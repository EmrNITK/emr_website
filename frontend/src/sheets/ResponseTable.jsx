import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useTable, useFilters, useSortBy } from 'react-table';
import { 
  Loader2, Plus, Trash2, Download, Search, Undo, Redo, Printer, 
  Bold, Italic, Strikethrough, AlignLeft, AlignCenter, AlignRight, 
  Type, PaintBucket, Filter, ChevronDown, Lock, MessageSquare,
  Share2, Grid3X3
} from 'lucide-react';

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
  if (str === null || str === undefined || str === '') return NaN;
  const num = Number(str);
  return isNaN(num) ? NaN : num;
};

const colorOptions = [
  { name: 'Default', class: 'bg-white' },
  { name: 'Red', class: 'bg-red-500' },
  { name: 'Green', class: 'bg-green-500' },
  { name: 'Blue', class: 'bg-blue-500' },
  { name: 'Yellow', class: 'bg-yellow-500' },
];

export default function ResponseTable() {
  const { formId } = useParams();
  const [form, setForm] = useState(null);
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(50);
  const [filters, setFilters] = useState({});
  // Changed desc to false to show latest at bottom
  const [sortBy, setSortBy] = useState({ id: 'submittedAt', desc: false });
  const [hiddenColumns, setHiddenColumns] = useState({});
  
  const [columnWidths, setColumnWidths] = useState({});
  const [focusedCell, setFocusedCell] = useState(null);
  const [editingCell, setEditingCell] = useState(null);
  const [confirmModal, setConfirmModal] = useState(null);
  const [formulaValue, setFormulaValue] = useState("");

  const [selection, setSelection] = useState({ start: null, end: null, isDragging: false });
  const [activeRowId, setActiveRowId] = useState(null);
  const tableContainerRef = useRef(null);

  const responsesRef = useRef(responses);
  
  useEffect(() => {
    responsesRef.current = responses;
  }, [responses]);

  useEffect(() => {
    const onMouseUp = () => setSelection(s => ({ ...s, isDragging: false }));
    window.addEventListener('mouseup', onMouseUp);
    return () => window.removeEventListener('mouseup', onMouseUp);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (editingCell || confirmModal || e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      if ((e.ctrlKey || e.metaKey) && e.key === 'c' && selection.start) {
        e.preventDefault();
        handleCopy();
      }
      if (e.key === 'Backspace' || e.key === 'Delete') {
        if (activeRowId) {
           e.preventDefault();
           handleDeleteResponse(activeRowId);
        }
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [selection, activeRowId, editingCell, confirmModal]);

  const fetchForm = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_URL}/api/forms/${formId}`, {
        headers: { Authorization: token }, withCredentials: true
      });
      setForm(res.data);
    } catch (err) {
      toast.error('Failed to load form');
    }
  }, [formId]);

  const fetchResponses = useCallback(async (reset = false, silent = false) => {
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
        setResponses(prev => [...prev, ...newResponses]);
      }
      setHasMore((reset ? 1 : page) < totalPages);
    } catch (err) {
      toast.error('Failed to load responses');
    } finally {
      if (!silent) {
        setLoading(false);
        setLoadingMore(false);
      }
    }
  }, [formId, page, pageSize, sortBy, filters, loadingMore]);

  useEffect(() => {
    fetchForm();
  }, [fetchForm]);

  useEffect(() => {
    fetchResponses(true);
  }, [formId, sortBy, filters]);

  useEffect(() => {
    const interval = setInterval(async () => {
      if (editingCell || confirmModal) return;

      try {
        const token = localStorage.getItem('token');
        const params = new URLSearchParams({
          page: 1, limit: pageSize, sort: sortBy.id, order: sortBy.desc ? 'desc' : 'asc', ...filters
        });
        const res = await axios.get(`${API_URL}/api/forms/${formId}/responses?${params}`, {
          headers: { Authorization: token }, withCredentials: true
        });
        const newResponses = res.data.responses;
        const currentIds = new Set(responsesRef.current.map(r => r._id));
        const fresh = newResponses.filter(r => !currentIds.has(r._id));
        if (fresh.length > 0) {
          // Append to end since we are sorting by date asc
          setResponses(prev => [...prev, ...fresh]);
        }
      } catch (err) {}
    }, 10000); 
    return () => clearInterval(interval);
  }, [formId, sortBy, filters, pageSize, editingCell, confirmModal]);

  const loadMore = () => {
    if (!hasMore || loadingMore) return;
    setLoadingMore(true);
    setPage(prev => prev + 1);
  };

  useEffect(() => {
    if (page > 1) fetchResponses(false);
  }, [page]);

  const handleSaveCell = async (responseId, field, value, isCoreField = false, questionId = null) => {
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
          const updatedAnswers = r.answers.map(a => a.questionId === questionId ? { ...a, value } : a);
          if (!r.answers.some(a => a.questionId === questionId)) updatedAnswers.push({ questionId, value });
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
      await axios.put(`${API_URL}/api/responses/${responseId}/core`, { fieldName: 'color', value: color }, {
        headers: { Authorization: token }, withCredentials: true
      });
      setResponses(prev => prev.map(r => r._id === responseId ? { ...r, color } : r));
    } catch (err) {
      toast.error('Failed to update row color');
    }
  };

  const handleAddRow = async () => {
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
    if (!window.confirm('Are you sure you want to delete this row?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/api/responses/${responseId}`, {
        headers: { Authorization: token }, withCredentials: true
      });
      setResponses(prev => prev.filter(r => r._id !== responseId));
      setActiveRowId(null);
      setSelection({ start: null, end: null, isDragging: false });
    } catch (err) {
      toast.error('Failed to delete row');
    }
  };

  const columns = useMemo(() => {
    const baseColumns = [
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

    if (form) {
      form.sections.forEach(section => {
        section.elements.forEach(el => {
          if (!['TEXT_ONLY', 'IMAGE'].includes(el.type)) {
            baseColumns.push({
              Header: el.question || 'Untitled',
              id: `answers.${el.id}`,
              accessor: `answers.${el.id}`,
              width: 200,
              Cell: ({ row }) => {
                const ans = row.original.answers.find(a => a.questionId === el.id);
                const val = ans ? (Array.isArray(ans.value) ? ans.value.join(', ') : ans.value) : '';
                return <CellRenderer value={val} row={row} columnId={`answers.${el.id}`} colName={el.question} colType={el.type} isCoreField={false} qId={el.id} />;
              }
            });
          }
        });
      });
    }

    baseColumns.push({
      Header: 'Remark',
      id: 'remark',
      accessor: 'remark',
      width: 200,
      Cell: ({ row, value }) => <CellRenderer value={value} row={row} columnId="remark" colName="Remark" colType="text" isCoreField={true} />
    });

    return baseColumns.filter(c => !hiddenColumns[c.id]);
  }, [form, focusedCell, editingCell, hiddenColumns]);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    rows,
  } = useTable(
    { columns, data: responses, manualPagination: true, autoResetPage: false },
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
            const qId = col.id.split('.')[1];
            const ans = row.answers.find(a => a.questionId === qId);
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
    if (!selection.start || !selection.end) return;
    if (editingCell) return;

    const rStart = Math.min(selection.start.r, selection.end.r);
    const rEnd = Math.max(selection.start.r, selection.end.r);
    const cStart = Math.min(selection.start.c, selection.end.c);
    const cEnd = Math.max(selection.start.c, selection.end.c);

    let tsv = '';
    for (let r = rStart; r <= rEnd; r++) {
      let rowVals = [];
      for (let c = cStart; c <= cEnd; c++) {
         const cell = rows[r]?.cells[c];
         if (cell && cell.column.id !== 'rowNumber') {
             rowVals.push(cell?.value || '');
         }
      }
      if (rowVals.length > 0) {
        tsv += rowVals.join('\t') + '\n';
      }
    }
    navigator.clipboard.writeText(tsv);
    toast.success('Copied to clipboard');
  }, [selection, rows, editingCell]);

  const stats = useMemo(() => {
    if (!selection.start || !selection.end) return null;
    let sum = 0, count = 0, min = Infinity, max = -Infinity, hasNumbers = false;
    const rStart = Math.min(selection.start.r, selection.end.r);
    const rEnd = Math.max(selection.start.r, selection.end.r);
    const cStart = Math.min(selection.start.c, selection.end.c);
    const cEnd = Math.max(selection.start.c, selection.end.c);

    for (let r = rStart; r <= rEnd; r++) {
      if (!rows[r]) continue;
      for (let c = cStart; c <= cEnd; c++) {
        const cell = rows[r].cells[c];
        if (!cell || cell.column.id === 'rowNumber') continue;
        const val = cell.value;
        const num = parseNum(val);
        
        if (!isNaN(num)) {
          sum += num;
          count++;
          hasNumbers = true;
          if (num < min) min = num;
          if (num > max) max = num;
        }
      }
    }
    if (!hasNumbers) return null; 
    return { sum, avg: sum / count, max, min, count };
  }, [selection, rows]);

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

  const CellRenderer = ({ value, row, columnId, colName, colType, isCoreField, qId = null }) => {
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
        if (isFocused && !isEditing) {
            setFormulaValue(displayValue);
        }
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
        <div className="w-full h-full p-0 flex items-center bg-white z-20 overflow-hidden">
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
        onDoubleClick={() => setEditingCell(cellId)}
        className="w-full h-full min-h-[25px] px-2 py-1 flex items-center overflow-hidden whitespace-nowrap outline-none select-none cursor-cell text-[13px] text-[#202124]"
      >
        {isLink ? (
          <a href={displayValue} target="_blank" rel="noopener noreferrer" className="text-[#1155cc] hover:underline truncate">{displayValue}</a>
        ) : (
          <span className="truncate">{displayValue}</span>
        )}
      </div>
    );
  };

  if (!form) return <div className="min-h-screen flex items-center justify-center bg-white"><Loader2 className="animate-spin text-[#1a73e8]" /></div>;

  return (
    <div className="h-screen flex flex-col bg-[#f9fbfd] font-sans text-sm text-[#202124] overflow-hidden select-none">
      {/* Header / Nav */}
      <div className="flex flex-col shrink-0 bg-white z-20 border-b border-[#dadce0]">
        <div className="flex items-center px-4 py-2 gap-3 justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#0f9d58] rounded-lg flex items-center justify-center text-white shrink-0 cursor-pointer shadow-sm">
              <Grid3X3 size={24} />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <input 
                    type="text" 
                    className="text-[18px] font-normal text-[#202124] leading-tight outline-none border border-transparent hover:border-[#dadce0] focus:border-[#1a73e8] rounded px-1 -ml-1 w-fit max-w-[400px] transition-all" 
                    defaultValue={form.title}
                />
                <div className="p-1 hover:bg-[#f1f3f4] rounded-full cursor-pointer">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-[#5f6368]"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27z" fill="currentColor"/></svg>
                </div>
              </div>
              <div className="text-[13px] text-[#5f6368] flex gap-1 mt-0.5 -ml-1">
                {['File', 'Edit', 'View', 'Insert', 'Format', 'Data', 'Tools', 'Extensions', 'Help'].map(item => (
                  <span key={item} className="hover:bg-[#f1f3f4] px-2 py-0.5 rounded cursor-pointer transition-colors">{item}</span>
                ))}
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 bg-[#f1f3f4] rounded-full px-3 py-1.5 cursor-pointer hover:bg-[#e8eaed]">
               <MessageSquare size={18} className="text-[#5f6368]" />
               <ChevronDown size={14} className="text-[#5f6368]" />
            </div>
            <button onClick={exportCSV} className="h-9 px-6 bg-[#c2e7ff] text-[#001d35] font-medium hover:bg-[#b3dcf4] rounded-full text-[14px] flex items-center gap-2 transition-all shadow-sm">
              <Lock size={16} /> Share
            </button>
            <div className="w-8 h-8 rounded-full bg-[#7b1fa2] text-white flex items-center justify-center font-medium cursor-pointer shadow-inner">
              {form.author?.charAt(0) || 'U'}
            </div>
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex items-center gap-1 px-4 py-1 bg-[#edf2fa] border-b border-[#dadce0] rounded-full mx-4 my-1.5 shadow-sm text-[#444746]">
          <div className="flex items-center pr-1 border-r border-[#c7c7c7]">
            <Undo size={16} className="mx-2 cursor-pointer hover:text-[#202124]" />
            <Redo size={16} className="mx-2 cursor-pointer hover:text-[#202124]" />
            <Printer size={16} className="mx-2 cursor-pointer hover:text-[#202124]" />
          </div>
          <div className="flex items-center px-1 border-r border-[#c7c7c7]">
            <span className="text-[12px] font-medium mx-2 cursor-pointer flex items-center gap-1">100% <ChevronDown size={12}/></span>
          </div>
          <div className="flex items-center px-1 border-r border-[#c7c7c7]">
            <span className="text-[12px] font-medium mx-2 cursor-pointer flex items-center gap-1">Arial <ChevronDown size={12}/></span>
          </div>
          <div className="flex items-center px-2">
            <Bold size={16} className="mx-2 cursor-pointer hover:text-[#202124]" />
            <Italic size={16} className="mx-2 cursor-pointer hover:text-[#202124]" />
            <Type size={16} className="mx-2 cursor-pointer hover:text-[#202124]" />
            <PaintBucket size={16} className="mx-2 cursor-pointer hover:text-[#202124]" />
          </div>
          <div className="flex items-center px-2 border-l border-[#c7c7c7]">
            <AlignLeft size={16} className="mx-2 cursor-pointer hover:text-[#202124]" />
            <Filter size={16} className="mx-2 cursor-pointer hover:text-[#202124]" />
          </div>
        </div>

        {/* Formula Bar */}
        <div className="flex items-center px-4 py-1 bg-white border-b border-[#dadce0]">
            <div className="text-[#5f6368] font-serif italic font-bold mr-3 select-none text-[16px] w-6 flex justify-center">fx</div>
            <div className="w-px h-5 bg-[#dadce0] mr-3"></div>
            <input 
                type="text" 
                value={formulaValue}
                onChange={(e) => setFormulaValue(e.target.value)}
                readOnly={!editingCell}
                placeholder="Enter value or formula"
                className="flex-1 outline-none text-[13px] text-[#202124] py-1 bg-transparent"
            />
        </div>

        {/* Action Bar */}
        <div className={`flex items-center gap-4 px-4 py-1.5 border-b border-[#dadce0] bg-white text-[13px] transition-all duration-200 ${activeRowId ? 'h-auto opacity-100' : 'h-0 opacity-0 overflow-hidden py-0 border-0'}`}>
          <div className="flex items-center gap-2 border-r border-[#dadce0] pr-4">
            <span className="font-medium text-[#5f6368]">Row Style:</span>
            <select
              value={activeRowId ? (responses.find(r => r._id === activeRowId)?.color || 'bg-white') : 'bg-white'}
              onChange={(e) => handleColorChange(activeRowId, e.target.value)}
              className="text-[12px] border border-[#dadce0] rounded-md px-2 py-0.5 bg-white cursor-pointer outline-none focus:border-[#1a73e8]"
            >
              {colorOptions.map(opt => <option key={opt.class} value={opt.class}>{opt.name}</option>)}
            </select>
          </div>
          <button 
            onClick={() => handleDeleteResponse(activeRowId)} 
            className="text-[#5f6368] hover:text-[#d93025] transition-colors flex items-center gap-1.5 px-3 py-1 hover:bg-[#fce8e6] rounded-md"
          >
            <Trash2 size={15} /> Delete Row
          </button>
          <button onClick={handleAddRow} className="text-[#5f6368] hover:text-[#1a73e8] transition-colors flex items-center gap-1.5 px-3 py-1 hover:bg-[#e8f0fe] rounded-md ml-auto">
              <Plus size={15} /> Add Row
          </button>
        </div>
      </div>

      {/* Table Container */}
      <div className="flex-1 overflow-auto bg-white relative" ref={tableContainerRef}>
        <table {...getTableProps()} className="w-max border-collapse table-fixed bg-white">
          <thead className="sticky top-0 z-20">
            {headerGroups.map(headerGroup => (
              <tr {...headerGroup.getHeaderGroupProps()} className="flex">
                {headerGroup.headers.map((column, i) => {
                  const isRowNumber = column.id === 'rowNumber';
                  
                  return (
                    <th
                      {...column.getHeaderProps()}
                      style={{ width: columnWidths[column.id] || column.width || 120 }}
                      className={`relative shrink-0 border-r border-b border-[#dadce0] bg-[#f8f9fa] text-[12px] font-medium text-[#3c4043] select-none group
                        ${isRowNumber ? 'sticky left-0 z-30 shadow-[1px_0_0_0_#dadce0]' : ''} 
                        hover:bg-[#f1f3f4] transition-colors`}
                    >
                      <div 
                        className={`h-9 flex items-center px-2 justify-between cursor-pointer ${isRowNumber ? 'justify-center' : ''}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (!isRowNumber) {
                            setSelection({ start: { r: 0, c: i }, end: { r: rows.length - 1, c: i }, isDragging: false });
                            setActiveRowId(null);
                          }
                        }}
                      >
                        <span className="truncate flex-1 font-normal text-center">{column.render('Header')}</span>
                        
                        {!isRowNumber && (
                           <div className="absolute right-1 top-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-inherit px-1">
                             <ChevronDown size={14} className="text-[#5f6368]"/>
                           </div>
                        )}
                      </div>

                      {!isRowNumber && (
                        <div
                          onMouseDown={(e) => handleResizeStart(column.id, e.clientX, columnWidths[column.id] || column.width || 120, e)}
                          className="absolute right-0 top-0 bottom-0 w-1 cursor-col-resize hover:bg-[#1a73e8] z-10 transition-colors"
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
                    
                    let isSelected = false;
                    let isTopEdge = false, isBottomEdge = false, isLeftEdge = false, isRightEdge = false;
                    
                    if (selectionBounds && !isRowNumber) {
                        const { rStart, rEnd, cStart, cEnd } = selectionBounds;
                        isSelected = rIndex >= rStart && rIndex <= rEnd && cIndex >= cStart && cIndex <= cEnd;
                        isTopEdge = isSelected && rIndex === rStart;
                        isBottomEdge = isSelected && rIndex === rEnd;
                        isLeftEdge = isSelected && cIndex === cStart;
                        isRightEdge = isSelected && cIndex === cEnd;
                    }

                    const isEditingCell = editingCell === `${row.original._id}-${cell.column.id}`;
                    
                    return (
                      <td
                        {...cell.getCellProps()}
                        onMouseDown={() => {
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
                          ${isRowNumber ? 'sticky left-0 z-10 bg-[#f8f9fa] cursor-pointer hover:bg-[#f1f3f4] shadow-[1px_0_0_0_#dadce0]' : ''}
                          ${isSelected && !isRowNumber ? 'bg-[#e8f0fe]' : ''}
                          ${isEditingCell ? 'ring-2 ring-inset ring-[#1a73e8] z-20' : ''}
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
                         {!isEditingCell && isBottomEdge && isRightEdge && (
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

      {/* Stats Bar */}
      {stats ? (
        <div className="fixed bottom-6 right-6 bg-white border border-[#dadce0] shadow-xl rounded-lg px-5 py-2.5 flex items-center gap-5 text-[13px] text-[#5f6368] z-50 animate-in fade-in slide-in-from-bottom-2">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-bold text-[#9aa0a6] tracking-wider">Sum</span>
            <span className="text-[#202124] font-medium">{stats.sum.toLocaleString(undefined, {maximumFractionDigits: 2})}</span>
          </div>
          <div className="w-px h-6 bg-[#dadce0]"></div>
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-bold text-[#9aa0a6] tracking-wider">Average</span>
            <span className="text-[#202124] font-medium">{stats.avg.toLocaleString(undefined, {maximumFractionDigits: 2})}</span>
          </div>
          <div className="w-px h-6 bg-[#dadce0]"></div>
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-bold text-[#9aa0a6] tracking-wider">Count</span>
            <span className="text-[#202124] font-medium">{stats.count}</span>
          </div>
        </div>
      ) : null}

      {/* Confirm Modal */}
      {confirmModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-[1px] flex items-center justify-center z-[100]">
          <div className="bg-white p-6 rounded-lg shadow-2xl w-full max-w-sm border border-[#dadce0]">
            <h2 className="text-[18px] font-normal mb-4 text-[#202124]">Update Cell?</h2>
            <div className="bg-[#f8f9fa] p-3 rounded-md mb-6 border border-[#e8eaed]">
              <p className="text-[13px] text-[#5f6368] mb-1">Field: <span className="text-[#202124] font-medium">{confirmModal.colName}</span></p>
              <p className="text-[13px] text-[#5f6368]">Value: <span className="line-through opacity-50">{confirmModal.originalValue || '(empty)'}</span> → <span className="text-[#188038] font-medium">{confirmModal.value || '(empty)'}</span></p>
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