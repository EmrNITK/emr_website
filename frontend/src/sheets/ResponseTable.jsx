import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useTable, useFilters, useSortBy } from 'react-table';
import {
  Loader2, Plus, Trash2, Download, MessageSquare, Grid3X3, ShieldAlert, Edit2, Columns, EyeOff,
  ArrowUpAZ, ArrowDownZA, Lock, ChevronDown, Eye
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { convertLength } from '@mui/material/styles/cssUtils';

const API_URL = import.meta.env.VITE_API_BASE_URL;

const isUrl = (str) => {
  try {
    new URL(str);
    return true;
  } catch {
    return false;
  }
};

const parseNum = (str) => {
  if (str === null || str === undefined || str === '' || typeof str === 'boolean') return NaN;
  const num = Number(str);
  return isNaN(num) ? NaN : num;
};

const colorOptions = [
  { name: 'Default', class: 'bg-white' },
  { name: 'Red', class: 'bg-red-400' },
  { name: 'Green', class: 'bg-green-400' },
  { name: 'Blue', class: 'bg-blue-400' },
  { name: 'Yellow', class: 'bg-yellow-300' },
];

export default function ResponseTable() {
  const { formId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState(null);
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(50);
  const [filters, setFilters] = useState({});
  const [sortBy, setSortBy] = useState({ id: 'submittedAt', desc: false });
  const [hiddenColumns, setHiddenColumns] = useState({});
  const { user, isLoading: authLoading, logout } = useAuth();
  const [columnWidths, setColumnWidths] = useState({});
  const [focusedCell, setFocusedCell] = useState(null);
  const [editingCell, setEditingCell] = useState(null);
  const [confirmModal, setConfirmModal] = useState(null);
  const [formulaValue, setFormulaValue] = useState("");
  const [accessDenied, setAccessDenied] = useState(false);
  const [requestState, setRequestState] = useState('idle');
  const [requestMessage, setRequestMessage] = useState('');
  const [selection, setSelection] = useState({ start: null, end: null, isDragging: false });
  const [activeRowId, setActiveRowId] = useState(null);
  const [contextMenu, setContextMenu] = useState(null);
  const [showColumnPanel, setShowColumnPanel] = useState(false);
  const tableContainerRef = useRef(null);
  const [activeMenu, setActiveMenu] = useState(null);
  const [showHelpModal, setShowHelpModal] = useState(false);

  const responsesRef = useRef(responses);
  useEffect(() => {
    responsesRef.current = responses;
  }, [responses]);

  const hasAccess = useMemo(() => {
    if (!form || !user) return false;
    const isAdmin = user.userType === 'admin' || user.userType === 'super-admin';
    const isOwner = String(form.userId) === String(user.id || user._id);
    const isCollaborator = form.collaborators?.some(
      c => String(c.user) === String(user.id || user._id)
    );
    return isAdmin || isOwner || isCollaborator;
  }, [form, user]);

  useEffect(() => {
    const onMouseUp = () => setSelection(s => ({ ...s, isDragging: false }));
    const handleClickOutside = (e) => {
      if (!e.target.closest('.context-menu-container')) {
        setContextMenu(null);
      }
      if (!e.target.closest('.column-panel-container')) {
        setShowColumnPanel(false);
      }
      if (!e.target.closest('.top-menu-container')) {
        setActiveMenu(null);
      }
    };
    window.addEventListener('mouseup', onMouseUp);
    window.addEventListener('click', handleClickOutside);
    return () => {
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const handleMenuClick = (menuName) => {
    setActiveMenu(activeMenu === menuName ? null : menuName);
  };

  const handlePrint = () => {
    window.print();
    setActiveMenu(null);
  };

  const handleMenuExport = () => {
    exportCSV();
    setActiveMenu(null);
  };

  const handleMenuAddRow = () => {
    handleAddRow();
    setActiveMenu(null);
  };

  const handleMenuShowAllCols = () => {
    showAllColumns();
    setActiveMenu(null);
  };

  const openHelpModal = () => {
    setShowHelpModal(true);
    setActiveMenu(null);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (editingCell || confirmModal || e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || accessDenied) return;
      if ((e.ctrlKey || e.metaKey) && e.key === 'c' && selection.start) {
        e.preventDefault();
        handleCopy();
      }
      if ((e.key === 'Backspace' || e.key === 'Delete') && hasAccess) {
        if (activeRowId && selection.start?.c === 1 && selection.end?.c > 1) {
          e.preventDefault();
          handleDeleteResponse(activeRowId);
        }
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [selection, activeRowId, editingCell, confirmModal, hasAccess, accessDenied]);

  const fetchForm = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_URL}/api/responsepage/form/${formId}`, {
        headers: { Authorization: token }, withCredentials: true
      });
      setForm(res.data);
      setAccessDenied(false);
    } catch (err) {
      if (err.response?.status === 403 || err.response?.status === 401 || err.response?.status === 405) {
        setAccessDenied(true);
        if (err.response?.status === 405) {
          setRequestState('sent')
        }
      } else {
        toast.error('Failed to load form');
      }
    }
  }, [formId]);

  const fetchResponses = useCallback(async (reset = false, silent = false) => {
    if (accessDenied) return;
    if (reset) {
      setPage(1);
      setHasMore(true);
    }
    if (!silent && reset) setLoading(true);
    if (!reset && loadingMore) return;

    try {
      const token = localStorage.getItem('token');
      const params = new URLSearchParams({
        page: reset ? 1 : page,
        limit: pageSize,
        sort: sortBy.id,
        order: sortBy.desc ? 'desc' : 'asc',
        ...filters
      });
      const res = await axios.get(`${API_URL}/api/forms/${formId}/responses?${params}`, {
        headers: { Authorization: token }, withCredentials: true
      });

      const newResponses = res.data.responses;
      const totalPages = res.data.totalPages;

      if (reset) {
        setResponses(newResponses);
      } else {
        setResponses(prev => {
          const existingIds = new Set(prev.map(r => r._id));
          const uniqueNew = newResponses.filter(r => !existingIds.has(r._id));
          return [...prev, ...uniqueNew];
        });
      }
      setHasMore((reset ? 1 : page) < totalPages);
    } catch (err) {
      if (err.response?.status !== 403 && err.response?.status !== 401) {
        toast.error('Failed to load responses');
      }
    } finally {
      if (!silent) {
        setLoading(false);
        setLoadingMore(false);
      }
    }
  }, [formId, page, pageSize, sortBy, filters, loadingMore, accessDenied]);

  useEffect(() => {
    fetchForm();
  }, [fetchForm]);

  useEffect(() => {
    if (!accessDenied && form) {
      fetchResponses(true);
    }
  }, [formId, sortBy, filters, form, accessDenied]);

  useEffect(() => {
    if (accessDenied || !form) return;
    const interval = setInterval(async () => {
      try {
        const token = localStorage.getItem('token');
        const params = new URLSearchParams({
          page: 1, limit: page * pageSize, sort: sortBy.id, order: sortBy.desc ? 'desc' : 'asc', ...filters
        });
        const res = await axios.get(`${API_URL}/api/forms/${formId}/responses?${params}`, {
          headers: { Authorization: token }, withCredentials: true
        });
        const fetchedResponses = res.data.responses;

        setResponses(prev => {
          const newMap = new Map(fetchedResponses.map(r => [r._id, r]));
          const merged = prev.map(r => {
            if (newMap.has(r._id)) {
              const updated = newMap.get(r._id);
              if (editingCell && editingCell.startsWith(r._id)) return r;
              return updated;
            }
            return r;
          });
          const currentIds = new Set(merged.map(r => r._id));
          fetchedResponses.forEach(r => {
            if (!currentIds.has(r._id)) merged.push(r);
          });
          return merged.filter(r => newMap.has(r._id) || !r._id);
        });
      } catch (err) { }
    }, 2500);
    return () => clearInterval(interval);
  }, [formId, sortBy, filters, pageSize, page, editingCell, accessDenied, form]);

  const loadMore = () => {
    if (!hasMore || loadingMore) return;
    setLoadingMore(true);
    setPage(prev => prev + 1);
  };

  useEffect(() => {
    if (page > 1) fetchResponses(false);
  }, [page]);

  const handleSort = (columnId, desc) => {
    if (columnId === 'rowNumber') return;
    setSortBy({ id: columnId, desc });
    setContextMenu(null);
  };

  const toggleColumnVisibility = (columnId) => {
    setHiddenColumns(prev => ({
      ...prev,
      [columnId]: !prev[columnId]
    }));
    setContextMenu(null);
  };

  const showAllColumns = () => {
    setHiddenColumns({});
    setContextMenu(null);
  };

  const handleRequestAccess = async () => {
    setRequestState('loading');
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_URL}/api/forms/${formId}/request-access`, { message: requestMessage }, {
        headers: { Authorization: token }, withCredentials: true
      });
      setRequestState('sent');
      toast.success('Access request sent successfully');
    } catch (err) {
      setRequestState('idle');
      toast.error(err.response?.data?.message || 'Failed to request access');
    }
  };

  const handleSaveCell = async (responseId, field, value, isCoreField = false, questionId = null) => {
    if (!hasAccess) return toast.error('You do not have permission to edit');
    try {
      const token = localStorage.getItem('token');
      if (isCoreField) {
        await axios.put(`${API_URL}/api/responses/${responseId}/core`, { fieldName: field, value }, {
          headers: { Authorization: token }, withCredentials: true
        });
      } else {
        await axios.put(`${API_URL}/api/responses/${responseId}/answer`, { questionId, value }, {
          headers: { Authorization: token }, withCredentials: true
        });
      }

      setResponses(prev => prev.map(r => {
        if (r._id !== responseId) return r;
        if (isCoreField) {
          return { ...r, [field]: value };
        } else {
          const updatedAnswers = [...r.answers];
          const idx = updatedAnswers.findIndex(a => a.questionId === questionId);
          if (idx >= 0) updatedAnswers[idx] = { ...updatedAnswers[idx], value };
          else updatedAnswers.push({ questionId, value });
          return { ...r, answers: updatedAnswers };
        }
      }));
    } catch (err) {
      toast.error('Failed to update cell');
    }
  };

  const handleColorChange = async (responseId, color) => {
    try {
      const token = localStorage.getItem('token');
      setResponses(prev => prev.map(r => r._id === responseId ? { ...r, color } : r));
      await axios.put(`${API_URL}/api/responses/${responseId}/core`, { fieldName: 'color', value: color }, {
        headers: { Authorization: token }, withCredentials: true
      });
      setContextMenu(null);
    } catch (err) {
      toast.error('Failed to update row color');
      fetchResponses(true, true);
    }
  };

  const handleAddRow = async () => {
    if (!hasAccess) return;
    try {
      const token = localStorage.getItem('token');
      const newResponse = { formId, answers: [], respondentEmail: '', color: 'bg-white', remark: '' };
      const res = await axios.post(`${API_URL}/api/forms/${formId}/responses`, newResponse, {
        headers: { Authorization: token }, withCredentials: true
      });
      setResponses(prev => [...prev, res.data]);
    } catch (err) {
      toast.error('Failed to add row');
    }
  };

  const handleDeleteResponse = async (responseId) => {
    if (!hasAccess) return;
    if (!window.confirm('Are you sure you want to delete this row?')) return;
    try {
      const token = localStorage.getItem('token');
      setResponses(prev => prev.filter(r => r._id !== responseId));
      setActiveRowId(null);
      setSelection({ start: null, end: null, isDragging: false });
      setContextMenu(null);
      await axios.delete(`${API_URL}/api/responses/${responseId}`, {
        headers: { Authorization: token }, withCredentials: true
      });
    } catch (err) {
      toast.error('Failed to delete row');
      fetchResponses(true, true);
    }
  };

  const allColumns = useMemo(() => {
    if (accessDenied || !form) return [];
    const baseCols = [
      {
        Header: '',
        id: 'rowNumber',
        width: 46,
        disableSortBy: true,
        Cell: ({ row }) => (
          <div className="w-full h-full flex items-center justify-center bg-[#f8f9fa] text-[#5f6368] font-medium select-none text-[11px] border-r border-[#dadce0]">
            {row.index + 1}
          </div>
        )
      },
      {
        Header: 'Timestamp',
        id: 'submittedAt',
        accessor: 'submittedAt',
        width: 160,
        Cell: ({ value }) => <div className="px-2 py-1 truncate text-[#202124]">{new Date(value).toLocaleString()}</div>,
      }
    ];

    form.sections.forEach(section => {
      section.elements.forEach(el => {
        if (!['TEXT_ONLY', 'IMAGE'].includes(el.type)) {
          baseCols.push({
            Header: el.question || 'Untitled',
            id: `answers.${el.id}`,
            accessor: (row) => {
              const ans = row.answers?.find(a => String(a.questionId) === String(el.id));
              return ans ? (Array.isArray(ans.value) ? ans.value.join(', ') : ans.value) : '';
            },
            width: 200,
            Cell: ({ row, value }) => {
              return (
                <CellRenderer
                  value={value}
                  row={row}
                  columnId={`answers.${el.id}`}
                  colName={el.question}
                  colType={el.type}
                  isCoreField={false}
                  qId={el.id}
                  focusedCell={focusedCell}
                  setFocusedCell={setFocusedCell}
                  editingCell={editingCell}
                  setEditingCell={setEditingCell}
                  setConfirmModal={setConfirmModal}
                  setFormulaValue={setFormulaValue}
                  hasAccess={hasAccess}
                />
              );
            }
          });
        }
      });
    });

    baseCols.push({
      Header: 'Remark',
      id: 'remark',
      accessor: 'remark',
      width: 200,
      Cell: ({ row, value }) => <CellRenderer value={value} row={row} columnId="remark" colName="Remark" colType="text" isCoreField={true} />
    });

    return baseCols;
  }, [form, focusedCell, editingCell, hasAccess, accessDenied]);

  const columns = useMemo(() => allColumns.filter(c => !hiddenColumns[c.id]), [allColumns, hiddenColumns]);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    rows,
  } = useTable(
    {
      columns,
      data: responses,
      manualPagination: true,
      autoResetPage: false,
      getRowId: (row, relativeIndex) => row._id ? row._id : `temp-${relativeIndex}`
    },
    useFilters,
    useSortBy
  );

  const exportCSV = () => {
    if (!responses.length) return toast.error('No data to export');
    const headers = columns.filter(c => !['rowNumber'].includes(c.id)).map(c => c.Header);
    const csvRows = responses.map(row => {
      return columns
        .filter(c => !['rowNumber'].includes(c.id))
        .map(col => {
          let val = '';
          if (col.id === 'submittedAt') val = new Date(row.submittedAt).toLocaleString();
          else if (col.id === 'respondentEmail') val = row.respondentEmail || '';
          else if (col.id === 'remark') val = row.remark || '';
          else if (col.id.startsWith('answers.')) {
            const qId = col.id.substring(8);
            const ans = row.answers?.find(a => String(a.questionId) === String(qId));
            val = ans ? (Array.isArray(ans.value) ? ans.value.join(', ') : ans.value) : '';
          }
          return `"${String(val).replace(/"/g, '""')}"`;
        }).join(',');
    });
    const csvContent = [headers.join(','), ...csvRows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${form?.title || 'Form'}_Responses.csv`;
    link.click();
  };

  const handleCopy = useCallback(() => {
    if (!selection.start || !selection.end || editingCell) return;

    const rStart = Math.min(selection.start.r, selection.end.r);
    const rEnd = Math.max(selection.start.r, selection.end.r);
    const cStart = Math.min(selection.start.c, selection.end.c);
    const cEnd = Math.max(selection.start.c, selection.end.c);
    let tsv = '';

    for (let r = rStart; r <= rEnd; r++) {
      let rowVals = [];
      const targetRow = rows[r];

      if (!targetRow) continue;

      for (let c = cStart; c <= cEnd; c++) {
        const column = columns[c];

        if (column && column.id !== 'rowNumber') {
          const val = targetRow.values?.[column.id];
          rowVals.push(val !== undefined && val !== null ? val : '');
        }
      }
      if (rowVals.length > 0) tsv += rowVals.join('\t') + '\n';
    }

    navigator.clipboard.writeText(tsv);
    toast.success('Copied to clipboard');
  }, [selection, rows, columns, editingCell]);

  const stats = useMemo(() => {
    if (!selection?.start || !selection?.end) return null;
    let sum = 0, count = 0, numberCount = 0, hasNumbers = false;

    const rStart = Math.min(selection.start.r, selection.end.r);
    const rEnd = Math.max(selection.start.r, selection.end.r);
    const cStart = Math.min(selection.start.c, selection.end.c);
    const cEnd = Math.max(selection.start.c, selection.end.c);

    for (let r = rStart; r <= rEnd; r++) {
      const targetRow = rows?.[r];
      if (!targetRow) continue;

      for (let c = cStart; c <= cEnd; c++) {
        const column = columns[c];
        if (!column || column.id === 'rowNumber') continue;

        const val = targetRow.values?.[column.id];

        if (val === null || val === undefined || val === '') continue;

        count++;

        const num = (typeof val === 'string' && val.trim() !== '') ? Number(val) : (typeof val === 'number' ? val : NaN);

        if (!isNaN(num) && isFinite(num) && typeof val !== 'boolean') {
          sum += num;
          numberCount++;
          hasNumbers = true;
          console.log(sum)
        }
      }
    }

    if (count === 0) return null;
    return {
      sum,
      avg: numberCount > 0 ? sum / numberCount : 0,
      count,
      hasNumbers
    };
  }, [selection, rows, columns]);

  const handleResizeStart = (columnId, startX, startWidth, e) => {
    e.preventDefault();
    e.stopPropagation();
    const onMouseMove = (moveEvent) => {
      const delta = moveEvent.clientX - startX;
      setColumnWidths(prev => ({ ...prev, [columnId]: Math.max(46, startWidth + delta) }));
    };
    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  const getSelectionBounds = () => {
    if (!selection.start || !selection.end) return null;
    return {
      rStart: Math.min(selection.start.r, selection.end.r),
      rEnd: Math.max(selection.start.r, selection.end.r),
      cStart: Math.min(selection.start.c, selection.end.c),
      cEnd: Math.max(selection.start.c, selection.end.c),
    };
  };
  const selectionBounds = getSelectionBounds();

  const handleContextMenu = (e, rowId, cellId, columnId, colName) => {
    e.preventDefault();
    if (!hasAccess) return;
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      rowId,
      cellId,
      columnId,
      colName
    });
  };

  const CellRenderer = ({
    value,
    row,
    columnId,
    colName,
    colType,
    isCoreField,
    qId = null,
    focusedCell,
    setFocusedCell,
    editingCell,
    setEditingCell,
    setConfirmModal,
    setFormulaValue,
    hasAccess
  }) => {
    const displayValue = value || '';
    const isLink = typeof displayValue === 'string' && isUrl(displayValue);
    const cellId = `${row.original._id}-${columnId}`;
    const isFocused = focusedCell === cellId;
    const isEditing = editingCell === cellId;
    const [localValue, setLocalValue] = useState(displayValue);

    useEffect(() => {
      setLocalValue(displayValue);
    }, [displayValue, isEditing]);

    useEffect(() => {
      if (isFocused && !isEditing) setFormulaValue(displayValue);
    }, [isFocused, displayValue, isEditing]);

    const handleBlur = () => {
      if (localValue !== displayValue) {
        setConfirmModal({
          responseId: row.original._id,
          field: isCoreField ? columnId : colName,
          value: localValue,
          originalValue: displayValue,
          isCoreField,
          questionId: qId,
          colName
        });
      }
      setEditingCell(null);
    };

    const handleKeyDown = (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        e.target.blur();
      } else if (e.key === 'Escape') {
        setLocalValue(displayValue);
        setEditingCell(null);
      }
    };

    if (isEditing) {
      return (
        <div className="w-full h-full p-0 flex items-center bg-white z-20 overflow-hidden outline outline-2 outline-[#1a73e8]">
          <input
            autoFocus
            type={colType === 'number' ? 'number' : 'text'}
            className="w-full h-full px-2 py-1 text-[13px] outline-none bg-transparent font-sans"
            value={localValue}
            onChange={(e) => {
              setLocalValue(e.target.value);
              setFormulaValue(e.target.value);
            }}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
          />
        </div>
      );
    }

    return (
      <div
        tabIndex={0}
        onFocus={() => setFocusedCell(cellId)}
        onDoubleClick={() => hasAccess && setEditingCell(cellId)}
        className={`w-full h-full min-h-[25px] px-2 py-1 flex items-center overflow-hidden whitespace-nowrap outline-none select-none text-[13px] text-[#202124] ${hasAccess ? 'cursor-cell' : 'cursor-default'}`}
      >
        {isLink ? (
          <a href={displayValue} target="_blank" rel="noopener noreferrer" className="text-[#1155cc] hover:underline truncate">
            {displayValue}
          </a>
        ) : (
          <span className="truncate">{displayValue}</span>
        )}
      </div>
    );
  };

  if (authLoading) return <div className="min-h-screen flex items-center justify-center bg-[#f9fbfd]"><Loader2 className="animate-spin text-[#1a73e8]" /></div>;

  if (accessDenied) {
    if (!user) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#f0f4f9] p-4 font-sans">
          <div className="bg-white p-10 rounded-2xl shadow-sm border border-[#dadce0] max-w-md w-full text-center">
            <div className="w-16 h-16 bg-[#e8f0fe] rounded-full flex items-center justify-center mx-auto mb-6">
              <Lock size={32} className="text-[#1a73e8]" />
            </div>
            <h1 className="text-2xl font-normal text-[#202124] mb-3">Login Required</h1>
            <p className="text-[#5f6368] mb-8 text-[15px] leading-relaxed">
              You need to be logged in to view or request access to this form.
            </p>
            <button
              onClick={() => navigate(`/a/login?redirect=${encodeURIComponent(location.pathname + location.search)}`)}
              className="w-full h-10 bg-[#1a73e8] hover:bg-[#1557b0] text-white font-medium rounded transition-colors text-[14px] flex items-center justify-center"
            >
              Log in
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#f0f4f9] p-4 font-sans">
        <div className="bg-white p-10 rounded-2xl shadow-sm border border-[#dadce0] max-w-md w-full text-center">
          <div className="w-16 h-16 bg-[#fce8e6] rounded-full flex items-center justify-center mx-auto mb-6">
            <ShieldAlert size={32} className="text-[#d93025]" />
          </div>
          <h1 className="text-2xl font-normal text-[#202124] mb-3">You need access</h1>
          <p className="text-[#5f6368] mb-6 text-[15px] leading-relaxed">Ask for access, or switch to an account with permission.</p>
          {requestState === 'sent' ? (
            <div className="bg-[#e6f4ea] border border-[#ceead6] text-[#137333] px-4 py-3 rounded-lg text-sm font-medium mb-4">
              Request sent! Admin will be notified.
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <textarea
                value={requestMessage}
                onChange={(e) => setRequestMessage(e.target.value)}
                placeholder="Message (optional)"
                className="w-full p-3 border border-[#dadce0] rounded-md mb-2 text-sm resize-none h-24 focus:outline-none focus:ring-2 focus:ring-[#1a73e8] focus:border-transparent"
              />
              <button
                onClick={handleRequestAccess}
                disabled={requestState === 'loading'}
                className="w-full h-10 bg-[#1a73e8] hover:bg-[#1557b0] disabled:bg-[#8ab4f8] text-white font-medium rounded transition-colors flex items-center justify-center gap-2 text-[14px]"
              >
                {requestState === 'loading' && <Loader2 className="animate-spin" size={16} />} Request Access
              </button>
            </div>
          )}
          <div className="mt-4">
            <button
              onClick={() => { logout(); navigate('/a/login?redirect=' + encodeURIComponent(location.pathname + location.search)); }}
              className="w-full h-10 border border-[#dadce0] hover:bg-[#f8f9fa] text-[#1a73e8] font-medium rounded transition-colors text-[14px]"
            >
              Switch accounts
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!form) return <div className="min-h-screen flex items-center justify-center bg-[#f9fbfd]"><Loader2 className="animate-spin text-[#1a73e8]" /></div>;

  return (
    <div className="h-screen flex flex-col bg-[#f9fbfd] font-sans text-sm text-[#202124] overflow-hidden select-none">

      <div className="flex flex-col shrink-0 bg-white z-20 border-b border-[#dadce0]">
        <div className="flex flex-wrap items-center px-4 py-3 gap-4 justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#0f9d58] rounded-lg flex items-center justify-center text-white shrink-0 cursor-pointer shadow-sm">
              <Grid3X3 size={24} />
            </div>
            <div className="flex flex-col">
              <h1 className="text-[18px] font-normal text-[#202124] leading-tight outline-none border border-transparent rounded w-fit max-w-[400px] truncate">
                {form.title}
              </h1>
              <div className="text-[13px] text-[#5f6368] flex gap-2 mt-0.5 relative top-menu-container">
                <div className="relative">
                  <span
                    onClick={() => handleMenuClick('file')}
                    className={`px-2 py-1 rounded cursor-pointer transition-colors ${activeMenu === 'file' ? 'bg-[#f1f3f4] text-[#202124]' : 'hover:bg-[#f1f3f4] hover:text-[#202124]'}`}
                  >
                    File
                  </span>
                  {activeMenu === 'file' && (
                    <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-[#dadce0] rounded shadow-md py-1 z-[100]">
                      <div onClick={handleMenuAddRow} className="px-4 py-2 hover:bg-[#f1f3f4] cursor-pointer text-[#202124]">Add Row</div>
                      <div onClick={handleMenuExport} className="px-4 py-2 hover:bg-[#f1f3f4] cursor-pointer text-[#202124]">Export as CSV</div>
                      <div onClick={handlePrint} className="px-4 py-2 hover:bg-[#f1f3f4] cursor-pointer text-[#202124]">Print</div>
                    </div>
                  )}
                </div>

                <div className="relative">
                  <span
                    onClick={() => handleMenuClick('data')}
                    className={`px-2 py-1 rounded cursor-pointer transition-colors ${activeMenu === 'data' ? 'bg-[#f1f3f4] text-[#202124]' : 'hover:bg-[#f1f3f4] hover:text-[#202124]'}`}
                  >
                    Data
                  </span>
                  {activeMenu === 'data' && (
                    <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-[#dadce0] rounded shadow-md py-1 z-50">
                      <div onClick={handleMenuShowAllCols} className="px-4 py-2 hover:bg-[#f1f3f4] cursor-pointer text-[#202124]">Show All Columns</div>
                      <div onClick={() => { setSortBy({ id: 'submittedAt', desc: true }); setActiveMenu(null); }} className="px-4 py-2 hover:bg-[#f1f3f4] cursor-pointer text-[#202124]">Sort by Latest</div>
                      <div onClick={() => { setSortBy({ id: 'submittedAt', desc: false }); setActiveMenu(null); }} className="px-4 py-2 hover:bg-[#f1f3f4] cursor-pointer text-[#202124]">Sort by Oldest</div>
                    </div>
                  )}
                </div>

                <div className="relative">
                  <span
                    onClick={() => handleMenuClick('help')}
                    className={`px-2 py-1 rounded cursor-pointer transition-colors ${activeMenu === 'help' ? 'bg-[#f1f3f4] text-[#202124]' : 'hover:bg-[#f1f3f4] hover:text-[#202124]'}`}
                  >
                    Help
                  </span>
                  {activeMenu === 'help' && (
                    <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-[#dadce0] rounded shadow-md py-1 z-50">
                      <div onClick={openHelpModal} className="px-4 py-2 hover:bg-[#f1f3f4] cursor-pointer text-[#202124]">Guide & Shortcuts</div>
                    </div>
                  )}
                </div>
                {showHelpModal && (
                  <div className="fixed inset-0 bg-black/50 backdrop-blur-[1px] flex items-center justify-center z-[120] p-4">
                    <div className="bg-white p-6 rounded-lg shadow-2xl w-full max-w-lg border border-[#dadce0]">
                      <h2 className="text-[18px] font-normal mb-4 text-[#202124]">Help & Guide</h2>
                      <div className="max-h-[60vh] overflow-y-auto mb-6 flex flex-col gap-4 text-[13px] text-[#5f6368]">
                        <div>
                          <h3 className="text-[#202124] font-medium mb-1">Navigation & Editing</h3>
                          <ul className="list-disc pl-5 space-y-1">
                            <li>Click any cell to select it.</li>
                            <li>Double click a cell to edit its content.</li>
                            <li>Right click a column header to sort or hide the column.</li>
                            <li>Right click a cell or row number to edit row colors or delete the row.</li>
                          </ul>
                        </div>
                        <div>
                          <h3 className="text-[#202124] font-medium mb-1">Keyboard Shortcuts</h3>
                          <ul className="list-disc pl-5 space-y-1">
                            <li><kbd className="bg-[#f1f3f4] border border-[#dadce0] px-1.5 py-0.5 rounded text-[#202124] font-mono text-[11px]">Ctrl</kbd> + <kbd className="bg-[#f1f3f4] border border-[#dadce0] px-1.5 py-0.5 rounded text-[#202124] font-mono text-[11px]">C</kbd>: Copy selected cells</li>
                            <li><kbd className="bg-[#f1f3f4] border border-[#dadce0] px-1.5 py-0.5 rounded text-[#202124] font-mono text-[11px]">Backspace</kbd> / <kbd className="bg-[#f1f3f4] border border-[#dadce0] px-1.5 py-0.5 rounded text-[#202124] font-mono text-[11px]">Delete</kbd>: Delete selected row</li>
                            <li><kbd className="bg-[#f1f3f4] border border-[#dadce0] px-1.5 py-0.5 rounded text-[#202124] font-mono text-[11px]">Enter</kbd>: Save cell edit and exit</li>
                            <li><kbd className="bg-[#f1f3f4] border border-[#dadce0] px-1.5 py-0.5 rounded text-[#202124] font-mono text-[11px]">Escape</kbd>: Cancel cell edit</li>
                          </ul>
                        </div>
                        <div>
                          <h3 className="text-[#202124] font-medium mb-1">Features</h3>
                          <ul className="list-disc pl-5 space-y-1">
                            <li>Drag the right edge of any column header to resize it.</li>
                            <li>Select multiple cells containing numbers to instantly view Sum, Average, and Count at the bottom right.</li>
                          </ul>
                        </div>
                      </div>
                      <div className="flex justify-end">
                        <button
                          onClick={() => setShowHelpModal(false)}
                          className="px-5 py-2 bg-[#1a73e8] text-white rounded-md hover:bg-[#1557b0] text-[14px] font-medium transition-all shadow-sm"
                        >
                          Close
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative column-panel-container">
              <button
                onClick={() => setShowColumnPanel(!showColumnPanel)}
                className="text-[#5f6368] border border-[#dadce0] hover:bg-[#f8f9fa] transition-colors flex items-center gap-2 px-3 py-1.5 rounded-md font-medium text-[13px]"
              >
                <Columns size={15} /> Columns
              </button>

              {showColumnPanel && (
                <div className="absolute right-0 sm:left-0 left-10 top-10 w-[90vw] sm:w-64 max-w-[300px] bg-white border border-[#dadce0] shadow-xl rounded-lg py-2 z-[100] max-h-[70vh] flex flex-col">
                  <div className="flex justify-between items-center px-4 py-2 border-b border-[#dadce0] shrink-0 mb-1">
                    <span className="text-[12px] font-bold text-[#5f6368] uppercase tracking-wider">Show/Hide</span>
                    <button onClick={showAllColumns} className="text-[#1a73e8] hover:text-[#1557b0] text-[12px] font-medium flex items-center gap-1">
                      <Eye size={14} /> Show All
                    </button>
                  </div>
                  <div className="overflow-y-auto">
                    {allColumns.filter(c => c.id !== 'rowNumber').map(col => (
                      <label key={col.id} className="flex items-center gap-3 px-4 py-2 hover:bg-[#f1f3f4] cursor-pointer text-[13px]">
                        <input
                          type="checkbox"
                          checked={!hiddenColumns[col.id]}
                          onChange={() => toggleColumnVisibility(col.id)}
                          className="w-4 h-4 text-[#1a73e8] rounded border-[#dadce0] focus:ring-[#1a73e8] shrink-0"
                        />
                        <span className="truncate">{col.Header}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <button onClick={handleAddRow} className="text-[#1a73e8] border border-[#1a73e8] hover:bg-[#e8f0fe] transition-colors flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium text-[13px]">
              <Plus size={15} /> Add Row
            </button>
            <button onClick={exportCSV} className="flex text-[#5f6368] border border-[#dadce0] hover:bg-[#f8f9fa] transition-colors items-center gap-1.5 px-3 py-1.5 rounded-md font-medium text-[13px]">
              <Download size={15} /> Export
            </button>
          </div>
        </div>

        <div className="flex items-center px-4 py-2 bg-white border-t border-[#dadce0]">
          <div className="text-[#5f6368] font-serif italic font-bold mr-3 select-none text-[16px] w-6 flex justify-center">fx</div>
          <div className="w-px h-5 bg-[#dadce0] mr-3"></div>
          <input
            type="text"
            value={formulaValue}
            onChange={(e) => setFormulaValue(e.target.value)}
            readOnly={!hasAccess || !editingCell}
            placeholder={hasAccess ? "Enter value or formula" : "View mode"}
            className={`flex-1 outline-none text-[13px] text-[#202124] bg-transparent ${!hasAccess && 'opacity-70'}`}
          />
        </div>
      </div>

      <div className="flex-1 overflow-auto bg-white relative" ref={tableContainerRef}>
        <table {...getTableProps()} className="w-max border-collapse table-fixed bg-white">
          <thead className="sticky top-0 z-10 shadow-[0_1px_0_0_#dadce0]">
            {headerGroups.map(headerGroup => (
              <tr {...headerGroup.getHeaderGroupProps()} className="flex">
                {headerGroup.headers.map((column, i) => {
                  const isRowNumber = column.id === 'rowNumber';
                  return (
                    <th
                      {...column.getHeaderProps()}
                      onContextMenu={(e) => handleContextMenu(e, null, null, column.id, column.render('Header'))}
                      style={{ width: columnWidths[column.id] || column.width || 120 }}
                      className={`relative shrink-0 border-r border-[#dadce0] bg-[#f8f9fa] text-[12px] font-medium text-[#3c4043] select-none group
                        ${isRowNumber ? 'sticky left-0 z-40 shadow-[1px_0_0_0_#dadce0]' : ''} 
                        hover:bg-[#e8eaed] transition-colors`}
                    >
                      <div
                        className={`h-9 flex items-center px-2 justify-between cursor-pointer ${isRowNumber ? 'justify-center' : ''}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (!isRowNumber) {
                            const isDesc = sortBy.id === column.id ? !sortBy.desc : false;
                            handleSort(column.id, isDesc);
                            setSelection({ start: { r: 0, c: i }, end: { r: rows.length - 1, c: i }, isDragging: false });
                            setActiveRowId(null);
                          } else {
                            setSelection({ start: { r: 0, c: 1 }, end: { r: rows.length - 1, c: columns.length - 1 }, isDragging: false });
                          }
                        }}
                      >
                        <span className="truncate flex-1 font-normal text-left">{column.render('Header')}</span>
                        {!isRowNumber && sortBy.id === column.id && (
                          <div className="ml-1 text-[#1a73e8]">
                            {sortBy.desc ? <ArrowDownZA size={14} /> : <ArrowUpAZ size={14} />}
                          </div>
                        )}
                        {!isRowNumber && sortBy.id !== column.id && (
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity px-1">
                            <ChevronDown size={14} className="text-[#5f6368]" />
                          </div>
                        )}
                      </div>
                      {!isRowNumber && (
                        <div
                          onMouseDown={(e) => handleResizeStart(column.id, e.clientX, columnWidths[column.id] || column.width || 120, e)}
                          className="absolute right-0 top-0 bottom-0 w-[5px] cursor-col-resize hover:bg-[#1a73e8] z-50 transition-colors"
                        />
                      )}
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()} className="block">
            {rows.map((row, rIndex) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()} className={`flex border-b border-[#dadce0] transition-colors ${row.original.color || 'bg-white'}`}>
                  {row.cells.map((cell, cIndex) => {
                    const isRowNumber = cell.column.id === 'rowNumber';
                    let isSelected = false, isTopEdge = false, isBottomEdge = false, isLeftEdge = false, isRightEdge = false;
                    if (selectionBounds && !isRowNumber) {
                      const { rStart, rEnd, cStart, cEnd } = selectionBounds;
                      isSelected = rIndex >= rStart && rIndex <= rEnd && cIndex >= cStart && cIndex <= cEnd;
                      isTopEdge = isSelected && rIndex === rStart;
                      isBottomEdge = isSelected && rIndex === rEnd;
                      isLeftEdge = isSelected && cIndex === cStart;
                      isRightEdge = isSelected && cIndex === cEnd;
                    }
                    const cellIdentifier = `${row.original._id}-${cell.column.id}`;
                    const isEditingCell = editingCell === cellIdentifier;

                    return (
                      <td
                        {...cell.getCellProps()}
                        onContextMenu={(e) => handleContextMenu(e, row.original._id, cellIdentifier, cell.column.id, cell.column.Header)}
                        onMouseDown={(e) => {
                          if (e.button !== 0) return;
                          if (isRowNumber) {
                            setSelection({ start: { r: rIndex, c: 1 }, end: { r: rIndex, c: row.cells.length - 1 }, isDragging: false });
                            setActiveRowId(row.original._id);
                          } else {
                            setSelection({ start: { r: rIndex, c: cIndex }, end: { r: rIndex, c: cIndex }, isDragging: true });
                            setActiveRowId(row.original._id);
                          }
                        }}
                        onMouseEnter={() => {
                          if (selection.isDragging && !isRowNumber) {
                            setSelection(s => ({ ...s, end: { r: rIndex, c: cIndex } }));
                          }
                        }}
                        style={{ width: columnWidths[cell.column.id] || cell.column.width || 120 }}
                        className={`relative shrink-0 p-0 m-0 border-r border-[#dadce0]
                          ${isRowNumber ? 'sticky left-0 z-20 cursor-pointer hover:bg-[#e8eaed] shadow-[1px_0_0_0_#dadce0]' : ''}
                          ${isRowNumber && activeRowId === row.original._id ? 'bg-[#e8eaed]' : isRowNumber ? 'bg-[#f8f9fa]' : ''}
                          ${isSelected && !isRowNumber && !isEditingCell ? 'bg-[#1a73e8]/20' : ''}
                        `}
                      >
                        {!isEditingCell && isSelected && (
                          <div className={`absolute inset-0 pointer-events-none border-[#1a73e8] z-10
                                ${isTopEdge ? 'border-t-2' : ''}
                                ${isBottomEdge ? 'border-b-2' : ''}
                                ${isLeftEdge ? 'border-l-2' : ''}
                                ${isRightEdge ? 'border-r-2' : ''}
                            `} />
                        )}
                        {!isEditingCell && isBottomEdge && isRightEdge && hasAccess && (
                          <div className="absolute -bottom-[4px] -right-[4px] w-[8px] h-[8px] bg-[#1a73e8] border border-white cursor-crosshair z-20 pointer-events-none shadow-sm" />
                        )}
                        {cell.render('Cell')}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
        {hasMore && (
          <div className="p-8 flex justify-center w-full">
            <button onClick={loadMore} disabled={loadingMore} className="px-8 py-2.5 bg-white border border-[#dadce0] shadow-sm rounded-full text-[14px] font-medium text-[#1a73e8] hover:bg-[#f8f9fa] transition-all flex items-center gap-2">
              {loadingMore && <Loader2 className="animate-spin" size={16} />}
              {loadingMore ? 'Loading data...' : 'Load more rows'}
            </button>
          </div>
        )}
      </div>

      {contextMenu && (
        <div
          className="context-menu-container fixed bg-white shadow-[0_4px_16px_rgba(0,0,0,0.15)] border border-[#dadce0] rounded-lg py-2 z-[100] min-w-[220px]"
          style={{ top: contextMenu.y, left: contextMenu.x }}
          onClick={(e) => e.stopPropagation()}
        >


          {contextMenu.rowId && (
            <>
              <div
                className="px-4 py-2 hover:bg-[#f1f3f4] cursor-pointer text-[#202124] text-[13px] flex items-center gap-3 transition-colors"
                onClick={() => {
                  setEditingCell(contextMenu.cellId);
                  setContextMenu(null);
                }}
              >
                <Edit2 size={16} className="text-[#5f6368]" /> Edit Cell
              </div>
              <div className="w-full h-px bg-[#dadce0] my-1" />

              <div className="px-4 py-1.5 text-[12px] text-[#5f6368] font-medium mt-1">Row Color</div>
              <div className="px-4 py-1.5 flex items-center gap-2 mb-1">
                {colorOptions.map(c => (
                  <div
                    key={c.name}
                    className={`w-6 h-6 rounded-full cursor-pointer border border-[#dadce0] hover:scale-110 transition-transform ${c.class}`}
                    onClick={() => handleColorChange(contextMenu.rowId, c.class)}
                    title={c.name}
                  />
                ))}
              </div>
              <div className="w-full h-px bg-[#dadce0] my-1" />
            </>
          )}
          {contextMenu.columnId && contextMenu.columnId !== 'rowNumber' && (
            <>
              <div className="px-4 py-1.5 text-[11px] font-bold text-[#9aa0a6] uppercase tracking-wider">{contextMenu.colName}</div>
              <div
                className="px-4 py-2 hover:bg-[#f1f3f4] cursor-pointer text-[#202124] text-[13px] flex items-center gap-3 transition-colors"
                onClick={() => handleSort(contextMenu.columnId, false)}
              >
                <ArrowUpAZ size={16} className="text-[#5f6368]" /> Sort A-Z
              </div>
              <div
                className="px-4 py-2 hover:bg-[#f1f3f4] cursor-pointer text-[#202124] text-[13px] flex items-center gap-3 transition-colors"
                onClick={() => handleSort(contextMenu.columnId, true)}
              >
                <ArrowDownZA size={16} className="text-[#5f6368]" /> Sort Z-A
              </div>
              <div className="w-full h-px bg-[#dadce0] my-1" />
              <div
                className="px-4 py-2 hover:bg-[#f1f3f4] cursor-pointer text-[#202124] text-[13px] flex items-center gap-3 transition-colors"
                onClick={() => toggleColumnVisibility(contextMenu.columnId)}
              >
                <EyeOff size={16} className="text-[#5f6368]" /> Hide Column
              </div>
              {Object.keys(hiddenColumns).length > 0 && (
                <div
                  className="px-4 py-2 hover:bg-[#f1f3f4] cursor-pointer text-[#1a73e8] text-[13px] flex items-center gap-3 transition-colors"
                  onClick={showAllColumns}
                >
                  <Eye size={16} className="text-[#1a73e8]" /> Show All Columns
                </div>
              )}
              {contextMenu.rowId && <div className="w-full h-px bg-[#dadce0] my-1" />}
            </>
          )}
          {contextMenu.rowId && (
            <>
              <div
                className="px-4 py-2 hover:bg-[#fce8e6] cursor-pointer text-[#d93025] text-[13px] flex items-center gap-3 transition-colors"
                onClick={() => handleDeleteResponse(contextMenu.rowId)}
              >
                <Trash2 size={16} className="text-[#d93025]" /> Delete Row
              </div>
            </>
          )}
        </div>
      )}

      {stats ? (
        <div className="fixed bottom-6 right-6 bg-white border border-[#dadce0] shadow-xl rounded-lg px-5 py-2.5 flex items-center gap-5 text-[13px] text-[#5f6368] z-50 animate-in fade-in slide-in-from-bottom-2">
          {stats.hasNumbers && (
            <>
              <div className="flex flex-col">
                <span className="text-[10px] uppercase font-bold text-[#9aa0a6] tracking-wider">Sum</span>
                <span className="text-[#202124] font-medium">{stats.sum}</span>
              </div>
              <div className="w-px h-6 bg-[#dadce0]"></div>
              <div className="flex flex-col">
                <span className="text-[10px] uppercase font-bold text-[#9aa0a6] tracking-wider">Avg</span>
                <span className="text-[#202124] font-medium">{stats.avg}</span>
              </div>
              <div className="w-px h-6 bg-[#dadce0]"></div>
            </>
          )}
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-bold text-[#9aa0a6] tracking-wider">Count</span>
            <span className="text-[#202124] font-medium">{stats.count}</span>
          </div>
        </div>
      ) : null}

      {confirmModal && hasAccess && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-[1px] flex items-center justify-center z-[110] p-4">
          <div className="bg-white p-6 rounded-lg shadow-2xl w-full max-w-sm border border-[#dadce0]">
            <h2 className="text-[18px] font-normal mb-4 text-[#202124]">Update Cell?</h2>
            <div className="bg-[#f8f9fa] p-3 rounded-md mb-6 border border-[#e8eaed]">
              <p className="text-[13px] text-[#5f6368] mb-1">Field: <span className="text-[#202124] font-medium">{confirmModal.colName}</span></p>
              <p className="text-[13px] text-[#5f6368]">Value: <span className="line-through opacity-50">{confirmModal.originalValue || '(empty)'}</span> → <span className="text-[#188038] font-medium truncate inline-block max-w-[150px] align-bottom">{confirmModal.value || '(empty)'}</span></p>
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setConfirmModal(null)}
                className="px-4 py-2 text-[#5f6368] hover:bg-[#f1f3f4] rounded-md text-[14px] font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  handleSaveCell(
                    confirmModal.responseId,
                    confirmModal.field,
                    confirmModal.value,
                    confirmModal.isCoreField,
                    confirmModal.questionId
                  );
                  setConfirmModal(null);
                }}
                className="px-5 py-2 bg-[#1a73e8] text-white rounded-md hover:bg-[#1557b0] text-[14px] font-medium transition-all shadow-sm"
              >
                Save changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}