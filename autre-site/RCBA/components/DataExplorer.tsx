'use client'

import { useState, useEffect } from 'react';
import { getDbTables, getTableRows, updateDbRow } from '@/lib/actions';
import { 
  Database, 
  Table as TableIcon, 
  Edit3, 
  Check, 
  X, 
  Loader2,
  ChevronDown,
  Search
} from 'lucide-react';

export default function DataExplorer() {
  const [tables, setTables] = useState<string[]>([]);
  const [selectedTable, setSelectedTable] = useState<string>('');
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingCell, setEditingCell] = useState<{ id: number, field: string } | null>(null);
  const [editValue, setEditValue] = useState<any>('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    getDbTables().then(setTables);
  }, []);

  const handleTableSelect = async (name: string) => {
    setSelectedTable(name);
    setLoading(true);
    try {
      const data = await getTableRows(name);
      setRows(data);
    } catch (e) {
      console.error("Failed to fetch table rows:", e);
    } finally {
      setLoading(false);
    }
  };

  const startEditing = (id: number, field: string, value: any) => {
    setEditingCell({ id, field });
    setEditValue(value);
  };

  const cancelEditing = () => {
    setEditingCell(null);
    setEditValue('');
  };

  const saveEdit = async () => {
    if (!editingCell) return;
    
    setLoading(true);
    const result = await updateDbRow(selectedTable, editingCell.id, editingCell.field, editValue);
    
    if (result.success) {
      const updatedRows = rows.map(r => 
        r.id === editingCell.id ? { ...r, [editingCell.field]: editValue } : r
      );
      setRows(updatedRows);
      setEditingCell(null);
    } else {
      alert("Error: " + result.error);
    }
    setLoading(false);
  };

  const filteredRows = rows.filter(r => 
    Object.values(r).some(v => (v !== null && v !== undefined) ? v.toString().toLowerCase().includes(searchTerm.toLowerCase()) : false)
  );

  return (
    <div className="glass-card p-10 border-white/5 bg-white/[0.01] min-h-[600px] flex flex-col">
      <div className="flex flex-wrap items-center justify-between gap-6 mb-12">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
            <Database size={20} />
          </div>
          <h2 className="athletic-title text-2xl">Data <span className="text-blue-400">Explorer</span></h2>
        </div>

        <div className="flex items-center gap-4 flex-grow max-w-lg">
          <div className="relative flex-grow">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/80" size={16} />
            <input 
              type="text" 
              placeholder="Search in table..." 
              className="w-full bg-navy-deep border border-white/10 rounded-xl py-3 pl-12 pr-4 text-[10px] uppercase font-black tracking-wider focus:border-blue-400 outline-none transition"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="relative group">
            <button className="flex items-center gap-3 px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-[9px] font-black uppercase tracking-wider hover:border-blue-400 transition">
              {selectedTable || "Select Table"} <ChevronDown size={14} className="text-white/80" />
            </button>
            <div className="absolute right-0 top-full mt-2 w-56 bg-navy-deep border border-white/10 rounded-xl shadow-2xl opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition z-20 overflow-hidden">
              {tables.map(t => (
                <button 
                  key={t} 
                  onClick={() => handleTableSelect(t)}
                  className={`w-full text-left px-6 py-4 text-[10px] font-bold uppercase tracking-wider hover:bg-blue-500/10 transition border-b border-white/5 last:border-0 ${selectedTable === t ? 'text-blue-400' : 'text-white/60'}`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {selectedTable && rows.length > 0 && (
            <button
              onClick={() => {
                const headers = Object.keys(rows[0]).join(',');
                const csvRows = rows.map(r => 
                  Object.values(r).map(val => `"${(val ?? '').toString().replace(/"/g, '""')}"`).join(',')
                );
                const csvContent = [headers, ...csvRows].join('\n');
                const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', `${selectedTable}_export_${new Date().toISOString().slice(0,10)}.csv`);
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              }}
              title="Exporter cette table en CSV"
              className="px-4 py-3 bg-blue-500/10 border border-blue-500/30 rounded-xl text-[9px] font-black uppercase tracking-wider text-blue-400 hover:bg-blue-500 hover:text-navy-deep transition"
            >
              CSV
            </button>
          )}
        </div>
      </div>

      {(loading && !rows.length) ? (
        <div className="flex-grow flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="text-blue-400 animate-spin" size={40} />
            <div className="text-[10px] font-black uppercase tracking-wider text-white/80">Accessing rcba.db...</div>
          </div>
        </div>
      ) : !selectedTable ? (
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center opacity-20">
            <TableIcon size={80} className="mx-auto mb-6" />
            <div className="athletic-title text-xl uppercase italic">No Table Selected</div>
          </div>
        </div>
      ) : (
        <div className="flex-grow overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="border-b border-white/10">
                {rows.length > 0 && Object.keys(rows[0]).map(key => (
                  <th key={key} className="py-6 px-4 text-[9px] font-black uppercase tracking-wider text-white/80">{key}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredRows.map((row, idx) => (
                <tr key={idx} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group">
                  {Object.keys(row).map(key => {
                    const isEditing = editingCell?.id === row.id && editingCell?.field === key;
                    return (
                      <td key={key} className="py-5 px-4 text-[10px] font-medium text-white/60">
                        {isEditing ? (
                          <div className="flex items-center gap-2">
                            <input 
                              type="text" 
                              className="bg-navy-deep border border-blue-400 rounded-lg px-3 py-2 w-full outline-none text-blue-400"
                              value={editValue}
                              onChange={(e) => setEditValue(e.target.value)}
                              autoFocus
                            />
                            <button onClick={saveEdit} className="p-2 bg-pitch-green/10 text-pitch-green rounded-lg hover:bg-pitch-green/20 transition">
                              <Check size={14} />
                            </button>
                            <button onClick={cancelEditing} className="p-2 bg-rose-500/10 text-rose-400 rounded-lg hover:bg-rose-500/20 transition">
                              <X size={14} />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center justify-between group/cell">
                            <span>{row[key]?.toString() || ''}</span>
                            {key !== 'id' && (
                              <button 
                                onClick={() => startEditing(row.id, key, row[key])}
                                className="opacity-0 group-hover/cell:opacity-100 p-2 text-white/70 hover:text-blue-400 transition"
                              >
                                <Edit3 size={12} />
                              </button>
                            )}
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      <div className="mt-8 flex items-center justify-between border-t border-white/5 pt-8">
        <div className="text-[9px] font-bold text-white/80 uppercase tracking-wider">
          {filteredRows.length} entrées affichées sur {rows.length} au total
        </div>
        <div className="flex items-center gap-4">
          <button className="px-4 py-2 bg-white/5 rounded-lg text-[9px] font-black uppercase tracking-wider text-white/60 hover:text-white transition disabled:opacity-20" disabled>Previous</button>
          <button className="px-4 py-2 bg-white/5 rounded-lg text-[9px] font-black uppercase tracking-wider text-white/60 hover:text-white transition disabled:opacity-20" disabled>Next</button>
        </div>
      </div>
    </div>
  );
}
