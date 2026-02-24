import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import {
  useTable,
  useFilters,
  useSortBy,
  usePagination
} from 'react-table';
import {
  Loader2, Plus, Trash2, Download, MoreVertical, Sheet
} from 'lucide-react';

const API_URL = import.meta.env.VITE_API_BASE_URL;

// Utility to check if a string is a valid URL
const isUrl = (str) => {
  try {
    new URL(str);
    return true;
  } catch {
    return false;
  }
};

// Spreadsheet row highlighting
const colorOptions = [
  { name: 'Default', class: 'bg-white' },
  { name: 'Red', class: 'bg-red-50' },
  { name: 'Green', class: 'bg-green-50' },
  { name: 'Blue', class: 'bg-blue-50' },
  { name: 'Yellow', class: 'bg-yellow-50' },
];

export default function ResponseTable() {
  const { formId } = useParams();
  const [form, setForm] = useState(null);
  const [responses, setResponses] = useState([]);
  const [customColumns, setCustomColumns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(50);
  const [filters, setFilters] = useState({});
  const [sortBy, setSortBy] = useState({ id: 'submittedAt', desc: true });
  
  // UI State
  const [newColumnModal, setNewColumnModal] = useState(false);
  const [rowColors, setRowColors] = useState({});
  const [columnWidths, setColumnWidths] = useState({});
  const [focusedCell, setFocusedCell] = useState(null);
  
  // Edit State
  const [editModal, setEditModal] = useState({
    open: false,
    responseId: null,
    columnName: null,
    value: null,
    type: 'text',
    questionId: null,
  });

  const responsesRef = useRef(responses);
  useEffect(() => {
    responsesRef.current = responses;
  }, [responses]);

  // --- Data fetching ---
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

 const fetchCustomColumns = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_URL}/api/forms/${formId}/custom-columns`, {
        headers: { Authorization: token }, withCredentials: true
      });
      
      // Safely handle the response whether it's an array directly or nested in an object
      const columnsData = Array.isArray(res.data) ? res.data : (res.data?.columns || []);
      setCustomColumns(columnsData);
      
    } catch (err) {
      toast.error('Failed to load custom columns');
      setCustomColumns([]); // Fallback to an empty array on error
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

  // Initial loads
  useEffect(() => {
    fetchForm();
    fetchCustomColumns();
  }, [fetchForm, fetchCustomColumns]);

  useEffect(() => {
    fetchResponses(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formId, sortBy, filters]);

  // Polling
  useEffect(() => {
    const interval = setInterval(async () => {
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
          setResponses(prev => [...fresh, ...prev]);
          toast.success(`${fresh.length} new response(s) synced`);
        }
      } catch (err) { }
    }, 10000); // Polling reduced to 10s to save network tabs
    return () => clearInterval(interval);
  }, [formId, sortBy, filters, pageSize]);

  const loadMore = () => {
    if (!hasMore || loadingMore) return;
    setLoadingMore(true);
    setPage(prev => prev + 1);
  };

  useEffect(() => {
    if (page > 1) fetchResponses(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  // --- CRUD operations ---
  const handleSaveCell = async (responseId, field, value, isCustom = true, questionId = null) => {
    try {
      const token = localStorage.getItem('token');
      if (isCustom) {
        await axios.put(`${API_URL}/api/responses/${responseId}/custom`, { fieldName: field, value }, {
          headers: { Authorization: token }, withCredentials: true
        });
      } else {
        await axios.put(`${API_URL}/api/responses/${responseId}/answer`, { questionId, value }, {
          headers: { Authorization: token }, withCredentials: true
        });
      }
      
      setResponses(prev => prev.map(r => {
        if (r._id !== responseId) return r;
        if (isCustom) {
          return { ...r, customFields: { ...r.customFields, [field]: value } };
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

  const handleAddRow = async () => {
    try {
      const token = localStorage.getItem('token');
      const newResponse = { formId, answers: [], respondentEmail: '', customFields: {} };
      const res = await axios.post(`${API_URL}/api/forms/${formId}/responses`, newResponse, {
        headers: { Authorization: token }, withCredentials: true
      });
      setResponses(prev => [res.data, ...prev]);
      toast.success('Row added');
    } catch (err) {
      toast.error('Failed to add row');
    }
  };

  const handleDeleteResponse = async (responseId) => {
    if (!confirm('Are you sure you want to delete this row?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/api/responses/${responseId}`, {
        headers: { Authorization: token }, withCredentials: true
      });
      setResponses(prev => prev.filter(r => r._id !== responseId));
      toast.success('Row deleted');
    } catch (err) {
      toast.error('Failed to delete row');
    }
  };

  const handleAddCustomColumn = async (name, type) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_URL}/api/forms/${formId}/custom-columns`, { name, type }, {
        headers: { Authorization: token }, withCredentials: true
      });
      fetchCustomColumns();
      setNewColumnModal(false);
      toast.success('Column added');
    } catch (err) {
      toast.error('Failed to add column');
    }
  };

  const exportCSV = () => {
    if (!responses.length) return toast.error('No data to export');
    
    // Generate Headers
    const headers = columns.filter(c => !['rowNumber', 'actions', 'addColumn'].includes(c.id)).map(c => c.Header);
    
    // Generate Rows
    const csvRows = responses.map(row => {
      return columns
        .filter(c => !['rowNumber', 'actions', 'addColumn'].includes(c.id))
        .map(col => {
          let val = '';
          if (col.id === 'submittedAt') val = new Date(row.submittedAt).toLocaleString();
          else if (col.id === 'respondentEmail') val = row.respondentEmail || '';
          else if (col.id.startsWith('answers.')) {
            const qId = col.id.split('.')[1];
            const ans = row.answers.find(a => a.questionId === qId);
            val = ans ? (Array.isArray(ans.value) ? ans.value.join(', ') : ans.value) : '';
          }
          else if (col.id.startsWith('customFields.')) {
            const fName = col.id.split('.')[1];
            val = row.customFields?.[fName] || '';
          }
          // Escape quotes for CSV
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

  // --- Resizing ---
  const handleResizeStart = (columnId, startX, startWidth, e) => {
    e.preventDefault();
    e.stopPropagation();
    const onMouseMove = (moveEvent) => {
      const delta = moveEvent.clientX - startX;
      setColumnWidths(prev => ({ ...prev, [columnId]: Math.max(100, startWidth + delta) }));
    };
    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  // --- Shared Cell Renderer ---
  const CellRenderer = ({ value, row, columnId, colName, colType, isCustom, qId = null }) => {
    const displayValue = value || '';
    const isLink = typeof displayValue === 'string' && isUrl(displayValue);
    const cellId = `${row.original._id}-${columnId}`;
    const isFocused = focusedCell === cellId;

    return (
      <div
        tabIndex={0}
        onFocus={() => setFocusedCell(cellId)}
        onDoubleClick={() => setEditModal({ open: true, responseId: row.original._id, columnName: colName, value: displayValue, type: colType, questionId: qId })}
        className={`w-full h-full min-h-[24px] px-2 py-1 flex items-center overflow-hidden whitespace-nowrap outline-none select-none cursor-cell
          ${isFocused ? 'ring-2 ring-blue-500 ring-inset bg-blue-50/50 z-10' : ''}`}
      >
        {isLink ? (
          <a href={displayValue} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline truncate">{displayValue}</a>
        ) : (
          <span className="truncate">{displayValue}</span>
        )}
      </div>
    );
  };

  // --- Table Columns ---
  const columns = useMemo(() => {
    const baseColumns = [
      {
        Header: '',
        id: 'rowNumber',
        width: 40,
        disableSortBy: true,
        Cell: ({ row }) => (
          <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-500 font-medium select-none border-r border-gray-300">
            {row.index + 1}
          </div>
        )
      },
      {
        Header: 'Timestamp',
        id: 'submittedAt',
        accessor: 'submittedAt',
        width: 160,
        Cell: ({ value }) => <div className="px-2 py-1 truncate text-gray-600">{new Date(value).toLocaleString()}</div>,
      },
      // {
      //   Header: 'Email',
      //   id: 'respondentEmail',
      //   accessor: 'respondentEmail',
      //   width: 200,
      //   Cell: ({ row, value }) => <CellRenderer value={value} row={row} columnId="respondentEmail" colName="Email" colType="text" isCustom={true} />
      // },
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
                return <CellRenderer value={val} row={row} columnId={`answers.${el.id}`} colName={el.question} colType={el.type} isCustom={false} qId={el.id} />;
              }
            });
          }
        });
      });
    }

    if (Array.isArray(customColumns)) {
      customColumns.forEach(col => {
        baseColumns.push({
          Header: col.name,
          id: `customFields.${col.name}`,
          accessor: `customFields.${col.name}`,
          width: 200,
          Cell: ({ row, value }) => <CellRenderer value={value} row={row} columnId={`customFields.${col.name}`} colName={col.name} colType={col.type || 'text'} isCustom={true} />
        });
      });
    }

    baseColumns.push({
      Header: 'Actions',
      id: 'actions',
      width: 100,
      disableSortBy: true,
      Cell: ({ row }) => (
        <div className="flex items-center gap-2 px-2 py-1 justify-center">
          <button onClick={() => handleDeleteResponse(row.original._id)} className="text-gray-400 hover:text-red-600 transition-colors">
            <Trash2 size={14} />
          </button>
          <select
            value={rowColors[row.original._id] || 'bg-white'}
            onChange={(e) => setRowColors(prev => ({ ...prev, [row.original._id]: e.target.value }))}
            className="text-[10px] border border-gray-300 rounded px-1 py-0.5 bg-white cursor-pointer outline-none focus:ring-1 focus:ring-blue-500"
          >
            {colorOptions.map(opt => (
              <option key={opt.class} value={opt.class}>{opt.name}</option>
            ))}
          </select>
        </div>
      )
    });

    baseColumns.push({
      Header: () => (
        <button onClick={() => setNewColumnModal(true)} className="flex w-full items-center justify-center text-blue-600 hover:bg-blue-50 p-1 rounded transition-colors" title="Add custom column">
          <Plus size={16} />
        </button>
      ),
      id: 'addColumn',
      width: 50,
      disableSortBy: true,
      Cell: () => null
    });

    return baseColumns;
  }, [form, customColumns, rowColors, focusedCell]);

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

  if (!form) return <div className="min-h-screen flex items-center justify-center bg-gray-50"><Loader2 className="animate-spin text-blue-600" /></div>;

  return (
    <div className="h-screen flex flex-col bg-white font-sans text-sm text-gray-800">
      
      {/* Sheets-like Top Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-gray-300 bg-white shrink-0 shadow-sm z-20">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-green-600 rounded text-white"><Sheet size={20} /></div>
          <div>
            <h1 className="text-lg font-medium leading-tight">{form.title}</h1>
            <div className="text-xs text-gray-500 flex gap-4 mt-0.5">
              <span>File</span><span>Edit</span><span>View</span><span>Insert</span><span>Format</span><span>Data</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={handleAddRow} className="px-3 py-1.5 bg-blue-50 text-blue-700 font-medium hover:bg-blue-100 rounded text-xs flex items-center gap-1 transition-colors border border-blue-200">
            <Plus size={14} /> Insert Row
          </button>
          <button onClick={exportCSV} className="px-3 py-1.5 bg-green-50 text-green-700 font-medium hover:bg-green-100 rounded text-xs flex items-center gap-1 transition-colors border border-green-200">
            <Download size={14} /> Download CSV
          </button>
        </div>
      </div>

      {/* Spreadsheet Grid Container */}
      <div className="flex-1 overflow-auto bg-gray-50 relative">
        <table {...getTableProps()} className="w-max border-collapse bg-white border-b border-r border-gray-300">
          <thead className="sticky top-0 z-20 bg-gray-100 shadow-[0_1px_0_#d1d5db]">
            {headerGroups.map(headerGroup => (
              <tr {...headerGroup.getHeaderGroupProps()} className="flex">
                {headerGroup.headers.map((column, i) => {
                  const isRowNumber = column.id === 'rowNumber';
                  const isAddCol = column.id === 'addColumn';
                  
                  return (
                    <th
                      {...column.getHeaderProps(column.getSortByToggleProps())}
                      style={{ width: columnWidths[column.id] || column.width || 150 }}
                      className={`relative shrink-0 border-r border-b border-gray-300 bg-gray-100 text-xs font-semibold text-gray-700 select-none
                        ${isRowNumber ? 'sticky left-0 z-30' : ''} 
                        hover:bg-gray-200 transition-colors`}
                    >
                      <div className="h-8 flex items-center px-2 justify-between">
                        <span className="truncate">{column.render('Header')}</span>
                        {column.isSorted && <span className="text-[10px] text-gray-500">{column.isSortedDesc ? '▼' : '▲'}</span>}
                      </div>
                      
                      {/* Filter Bar (Like Sheets frozen filter row) */}
                      {column.canFilter && !['actions', 'addColumn', 'rowNumber'].includes(column.id) && (
                        <div className="p-1 border-t border-gray-200 bg-white" onClick={e => e.stopPropagation()}>
                          <input
                            value={filters[column.id] || ''}
                            onChange={e => setFilters({ ...filters, [column.id]: e.target.value })}
                            placeholder="Filter..."
                            className="w-full px-1.5 py-0.5 text-[10px] border border-gray-300 rounded outline-none focus:border-blue-500"
                          />
                        </div>
                      )}

                      {/* Resizer Handle */}
                      {!isAddCol && !isRowNumber && (
                        <div
                          onMouseDown={(e) => handleResizeStart(column.id, e.clientX, columnWidths[column.id] || column.width || 150, e)}
                          className="absolute right-0 top-0 bottom-0 w-1.5 cursor-col-resize hover:bg-blue-400 z-10"
                        />
                      )}
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()} className="block">
            {rows.map(row => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()} className={`flex border-b border-gray-200 ${rowColors[row.original._id] || 'bg-white'}`}>
                  {row.cells.map(cell => {
                    const isRowNumber = cell.column.id === 'rowNumber';
                    return (
                      <td
                        {...cell.getCellProps()}
                        style={{ width: columnWidths[cell.column.id] || cell.column.width || 150 }}
                        className={`relative shrink-0 border-r border-gray-200 p-0 m-0 group
                          ${isRowNumber ? 'sticky left-0 z-10 bg-gray-100 border-gray-300 shadow-[1px_0_0_#d1d5db]' : ''}`}
                      >
                        {cell.render('Cell')}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Endless Scroll Trigger */}
        {hasMore && (
          <div className="p-4 flex justify-center w-full sticky left-0">
            <button onClick={loadMore} disabled={loadingMore} className="px-6 py-2 bg-white border border-gray-300 shadow-sm rounded-full text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2">
              {loadingMore && <Loader2 className="animate-spin" size={14} />}
              {loadingMore ? 'Loading Rows...' : 'Load More Rows'}
            </button>
          </div>
        )}
      </div>

      {/* --- Modals --- */}
      {/* Add Column Modal */}
      {newColumnModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white p-5 rounded-lg shadow-xl w-full max-w-sm border border-gray-200">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">Insert Column</h2>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target);
              handleAddCustomColumn(formData.get('name'), formData.get('type'));
            }}>
              <label className="block text-xs font-medium text-gray-700 mb-1">Column Header</label>
              <input name="name" placeholder="e.g. Status, Notes" required className="w-full p-2 mb-4 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
              
              <label className="block text-xs font-medium text-gray-700 mb-1">Data Type</label>
              <select name="type" className="w-full p-2 mb-5 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 outline-none">
                <option value="text">Text / String</option>
                <option value="number">Number</option>
                <option value="date">Date</option>
                <option value="boolean">Checkbox (True/False)</option>
              </select>
              
              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => setNewColumnModal(false)} className="px-4 py-1.5 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 text-sm font-medium transition-colors">Cancel</button>
                <button type="submit" className="px-4 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm font-medium transition-colors shadow-sm">Insert</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Cell Modal */}
      {editModal.open && (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50" onClick={() => setEditModal({...editModal, open: false})}>
          <div className="bg-white p-4 rounded shadow-2xl w-full max-w-md border border-gray-200" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-sm font-semibold text-gray-700">Editing: {editModal.columnName}</h3>
            </div>
            
            {editModal.type === 'text' && (
              <textarea id="edit-modal-input" defaultValue={editModal.value} className="w-full p-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none" rows={3} autoFocus onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); document.getElementById('save-cell-btn').click(); } }} />
            )}
            {editModal.type === 'number' && (
              <input id="edit-modal-input" type="number" defaultValue={editModal.value} className="w-full p-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none" autoFocus onKeyDown={(e) => { if (e.key === 'Enter') document.getElementById('save-cell-btn').click(); }} />
            )}
            {editModal.type === 'date' && (
              <input id="edit-modal-input" type="date" defaultValue={editModal.value} className="w-full p-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none" autoFocus />
            )}
            {editModal.type === 'boolean' && (
              <select id="edit-modal-input" defaultValue={editModal.value} className="w-full p-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none" autoFocus>
                <option value="true">True</option>
                <option value="false">False</option>
              </select>
            )}

            <div className="flex justify-end gap-2 mt-4">
              <button onClick={() => setEditModal({ ...editModal, open: false })} className="px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-100 rounded transition-colors">Cancel</button>
              <button id="save-cell-btn" onClick={() => {
                const input = document.getElementById('edit-modal-input');
                handleSaveCell(editModal.responseId, editModal.columnName, input ? input.value : editModal.value, editModal.questionId === null, editModal.questionId);
                setEditModal({ ...editModal, open: false });
              }} className="px-3 py-1.5 bg-blue-600 text-white text-xs font-medium rounded hover:bg-blue-700 transition-colors shadow-sm">Save Changes (Enter)</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}