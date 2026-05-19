import React, { useState } from 'react';
import { Search, Filter, ChevronDown, ChevronUp, Download } from 'lucide-react';
import { HISTORIC_EVENTS, VARIABLES } from './mockData';
import type { Screen, HistoricEvent } from './types';
import { EVENT_TYPE_CFG } from './helpers';

interface Props { onNavigate: (s: Screen, id?: string) => void; }

export default function ScreenHistoric({ onNavigate }: Props) {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<HistoricEvent['event_type'] | 'all'>('all');
  const [varFilter, setVarFilter] = useState('all');
  const [expanded, setExpanded] = useState<string | null>(null);

  const EVENT_FILTERS: { value: HistoricEvent['event_type'] | 'all'; label: string }[] = [
    { value: 'all',                   label: 'Todos' },
    { value: 'threshold_calculated',  label: 'Cálculo umbral' },
    { value: 'extraordinary_detected',label: 'S. Extraordinaria' },
    { value: 'manual_validation',     label: 'Validación manual' },
    { value: 'activation_rejected',   label: 'Rechazado' },
    { value: 'formula_modified',      label: 'Fórmula modificada' },
    { value: 'data_incoherent',       label: 'Dato incoherente' },
    { value: 'manual_data_entry',     label: 'Dato manual' },
  ];

  const filtered = HISTORIC_EVENTS.filter(e => {
    const matchSearch = !search || e.variable.toLowerCase().includes(search.toLowerCase()) || e.result.toLowerCase().includes(search.toLowerCase()) || e.user.toLowerCase().includes(search.toLowerCase());
    const matchType = typeFilter === 'all' || e.event_type === typeFilter;
    const matchVar = varFilter === 'all' || e.variable.toLowerCase().includes(varFilter.toLowerCase());
    return matchSearch && matchType && matchVar;
  });

  const uniqueVars = Array.from(new Set(HISTORIC_EVENTS.map(e => e.variable)));

  const handleDownload = () => {
    const lines = ['Fecha;Hora;Variable;Evento;Usuario;Resultado;Motivo'];
    filtered.forEach(e => {
      const cfg = EVENT_TYPE_CFG[e.event_type];
      lines.push(`${e.date};${e.time};${e.variable};${cfg?.label ?? e.event_type};${e.user};"${e.result}";"${e.reason}"`);
    });
    const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'historico_auscultacion_guadalmena.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-900">Histórico de superaciones y eventos</h2>
        <button
          onClick={handleDownload}
          className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-800 text-white text-sm font-bold rounded-xl transition-colors"
        >
          <Download size={14} /> Exportar CSV
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 space-y-3">
        <div className="flex gap-3 flex-wrap">
          <div className="relative flex-1 min-w-48">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Buscar por variable, resultado o usuario..."
              className="w-full pl-8 pr-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select
            value={varFilter}
            onChange={e => setVarFilter(e.target.value)}
            className="px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Todas las variables</option>
            {uniqueVars.map(v => <option key={v} value={v}>{v}</option>)}
          </select>
        </div>
        <div className="flex gap-2 flex-wrap">
          {EVENT_FILTERS.map(f => (
            <button
              key={f.value}
              onClick={() => setTypeFilter(f.value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${typeFilter === f.value ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
            >
              {f.label}
            </button>
          ))}
        </div>
        <p className="text-xs text-slate-400">{filtered.length} evento(s) encontrado(s)</p>
      </div>

      {/* Timeline */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500">Fecha/Hora</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500">Variable</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500">Tipo de evento</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500">Usuario</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500">Resultado</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500">Motivo</th>
                <th className="px-4 py-3 w-8" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map(event => {
                const cfg = EVENT_TYPE_CFG[event.event_type];
                const isExp = expanded === event.id;
                return (
                  <React.Fragment key={event.id}>
                    <tr
                      className="hover:bg-slate-50 cursor-pointer transition-colors"
                      onClick={() => setExpanded(isExp ? null : event.id)}
                    >
                      <td className="px-4 py-3 text-xs font-mono text-slate-600 whitespace-nowrap">
                        {event.date} {event.time}
                      </td>
                      <td className="px-4 py-3 text-xs font-bold text-slate-800">{event.variable}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2 py-0.5 rounded border font-semibold ${cfg?.color ?? 'bg-slate-100 text-slate-600 border-slate-200'}`}>
                          {cfg?.label ?? event.event_type}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-600">{event.user}</td>
                      <td className="px-4 py-3 text-xs text-slate-700 font-semibold max-w-xs truncate">{event.result}</td>
                      <td className="px-4 py-3 text-xs text-slate-500 max-w-xs truncate">{event.reason}</td>
                      <td className="px-4 py-3">
                        {isExp ? <ChevronUp size={14} className="text-slate-400" /> : <ChevronDown size={14} className="text-slate-400" />}
                      </td>
                    </tr>
                    {isExp && (
                      <tr className="bg-slate-50">
                        <td colSpan={7} className="px-6 py-4">
                          <div className="grid grid-cols-2 gap-4 text-xs">
                            <div>
                              <p className="font-bold text-slate-500 uppercase tracking-wide mb-1">Resultado completo</p>
                              <p className="text-slate-800">{event.result}</p>
                            </div>
                            <div>
                              <p className="font-bold text-slate-500 uppercase tracking-wide mb-1">Contexto/Motivo</p>
                              <p className="text-slate-800">{event.reason}</p>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center text-slate-400 text-sm">
                    No hay eventos que coincidan con los filtros aplicados.
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
