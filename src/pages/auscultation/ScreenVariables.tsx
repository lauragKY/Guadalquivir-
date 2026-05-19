import React, { useState } from 'react';
import { Search, Filter, ArrowRight, AlertTriangle, CheckCircle } from 'lucide-react';
import { VARIABLES } from './mockData';
import { VarStatusBadge, SourceBadge, VAR_STATUS_CFG } from './helpers';
import type { Screen, VarStatus } from './types';

interface Props { onNavigate: (s: Screen, id?: string) => void; }

const STATUS_FILTERS: { value: VarStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'Todos' },
  { value: 'normal', label: 'Normal' },
  { value: 'extraordinary', label: 'S. Extraordinaria' },
  { value: 'scenario_0', label: 'Escenario 0' },
  { value: 'incoherent', label: 'Incoherente' },
  { value: 'no_data', label: 'Sin dato' },
];

export default function ScreenVariables({ onNavigate }: Props) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<VarStatus | 'all'>('all');
  const [sourceFilter, setSourceFilter] = useState<string>('all');

  const filtered = VARIABLES.filter(v => {
    const matchSearch = !search || v.name.toLowerCase().includes(search.toLowerCase()) || v.code.toLowerCase().includes(search.toLowerCase()) || v.sensor_code.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || v.status === statusFilter;
    const matchSource = sourceFilter === 'all' || v.source === sourceFilter;
    return matchSearch && matchStatus && matchSource;
  });

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-900">Variables críticas de auscultación</h2>
        <p className="text-xs text-slate-500">Fuente: DAMDATA + SAIH · Actualización cada 5 min</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar por nombre, código o sensor..."
            className="w-full pl-8 pr-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex items-center gap-1">
          {STATUS_FILTERS.map(f => (
            <button
              key={f.value}
              onClick={() => setStatusFilter(f.value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${statusFilter === f.value ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
            >
              {f.label}
            </button>
          ))}
        </div>
        <select
          value={sourceFilter}
          onChange={e => setSourceFilter(e.target.value)}
          className="px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">Todas las fuentes</option>
          <option value="DAMDATA">DAMDATA</option>
          <option value="SAIH">SAIH</option>
          <option value="Manual">Manual</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500">Código</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500">Variable / Sensor</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-slate-500">Valor actual</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-slate-500">NE asociado</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-slate-500">Fuente</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500">Última lectura</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-slate-500">Estado</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500">Acción recomendada</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map(v => (
                <tr
                  key={v.id}
                  className={`hover:bg-slate-50 cursor-pointer transition-colors ${VAR_STATUS_CFG[v.status].row}`}
                  onClick={() => onNavigate('variable_detail', v.id)}
                >
                  <td className="px-4 py-3">
                    <span className="text-xs font-mono font-bold text-slate-700">{v.code}</span>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-xs font-bold text-slate-800">{v.name}</p>
                    <p className="text-xs text-slate-500">{v.sensor_code} · {v.sensor_type}</p>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className="text-sm font-bold font-mono text-slate-900">{v.current_value.toFixed(1)}</span>
                    <span className="text-xs text-slate-500 ml-1">{v.unit}</span>
                    {v.has_manual_data && (
                      <span className="ml-1 text-xs bg-orange-50 text-orange-600 border border-orange-200 px-1.5 rounded font-semibold">M</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right text-xs font-mono text-slate-500">
                    {v.current_ne ? `${v.current_ne.toFixed(1)} m` : '—'}
                  </td>
                  <td className="px-4 py-3 text-center"><SourceBadge source={v.source} /></td>
                  <td className="px-4 py-3 text-xs text-slate-500 font-mono">{v.last_reading}</td>
                  <td className="px-4 py-3 text-center"><VarStatusBadge status={v.status} /></td>
                  <td className="px-4 py-3 text-xs text-slate-500 max-w-xs truncate">{v.recommended_action}</td>
                  <td className="px-4 py-3">
                    <ArrowRight size={14} className="text-slate-400" />
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={9} className="px-4 py-10 text-center text-slate-400 text-sm">
                    No hay variables que coincidan con los filtros aplicados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
