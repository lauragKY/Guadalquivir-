import React, { useState } from 'react';
import { Search, Download } from 'lucide-react';
import { BIM_HISTORIC, CURRENT_DATE } from './mockData';
import { ROLE_LABEL } from './helpers';
import type { Screen } from './types';

interface Props { onNavigate: (s: Screen) => void; }

const EVENT_CFG: Record<string, { label: string; color: string }> = {
  status_changed:        { label: 'Cambio de estado',      color: 'bg-amber-100 text-amber-700 border-amber-200' },
  alert_generated:       { label: 'Alerta generada',       color: 'bg-red-100 text-red-700 border-red-200' },
  model_updated:         { label: 'Modelo actualizado',    color: 'bg-blue-100 text-blue-700 border-blue-200' },
  model_published:       { label: 'Modelo publicado',      color: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
  threshold_exceeded:    { label: 'Umbral superado',       color: 'bg-orange-100 text-orange-700 border-orange-200' },
  maintenance_completed: { label: 'Mantenimiento realizado', color: 'bg-teal-100 text-teal-700 border-teal-200' },
  document_accessed:     { label: 'Documento consultado',  color: 'bg-slate-100 text-slate-600 border-slate-200' },
};

export default function ScreenHistoric({ onNavigate }: Props) {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  const filtered = BIM_HISTORIC.filter(e => {
    const matchSearch = !search || [e.user, e.element_name, e.description, e.module].some(f => f?.toLowerCase().includes(search.toLowerCase()));
    const matchType = typeFilter === 'all' || e.event_type === typeFilter;
    return matchSearch && matchType;
  });

  const handleDownload = () => {
    const lines = ['Fecha;Hora;Tipo;Usuario;Rol;Elemento;Módulo;Descripción'];
    filtered.forEach(e => {
      lines.push(`${e.date};${e.time};"${EVENT_CFG[e.event_type]?.label || e.event_type}";"${e.user}";"${ROLE_LABEL[e.role]}";"${e.element_name || '—'}";"${e.module}";"${e.description}"`);
    });
    const blob = new Blob([lines.join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `historico_bim_${CURRENT_DATE.replace(/\//g, '-')}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-900">Histórico de eventos BIM</h2>
        <button onClick={handleDownload} className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-800 text-white text-sm font-bold rounded-xl transition-colors">
          <Download size={14} /> Exportar CSV
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 space-y-3">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar por usuario, elemento, módulo, descripción..." className="w-full pl-8 pr-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={() => setTypeFilter('all')} className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${typeFilter === 'all' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>Todos</button>
          {Object.entries(EVENT_CFG).map(([k, v]) => (
            <button key={k} onClick={() => setTypeFilter(k)} className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${typeFilter === k ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>{v.label}</button>
          ))}
        </div>
        <p className="text-xs text-slate-400">{filtered.length} evento(s)</p>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500">Fecha/Hora</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500">Tipo</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500">Usuario · Rol</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500">Elemento</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500">Módulo</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500">Descripción</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map(e => {
              const cfg = EVENT_CFG[e.event_type];
              return (
                <tr key={e.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 text-xs font-mono text-slate-600 whitespace-nowrap">{e.date} {e.time}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded border font-semibold ${cfg?.color ?? 'bg-slate-100 text-slate-600 border-slate-200'}`}>{cfg?.label ?? e.event_type}</span>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-xs font-bold text-slate-800">{e.user}</p>
                    <p className="text-xs text-slate-400">{ROLE_LABEL[e.role]}</p>
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-700">{e.element_name ?? '—'}</td>
                  <td className="px-4 py-3 text-xs text-slate-500">{e.module}</td>
                  <td className="px-4 py-3 text-xs text-slate-700 max-w-xs truncate">{e.description}</td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr><td colSpan={6} className="px-4 py-10 text-center text-slate-400 text-sm">No hay eventos con los filtros seleccionados.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
