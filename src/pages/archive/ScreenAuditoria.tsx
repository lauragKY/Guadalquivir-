import React, { useState } from 'react';
import { History, Filter, CheckCircle2, XCircle, AlertTriangle, Download } from 'lucide-react';
import { AUDIT_EVENTS } from './mockData';
import type { AuditAction, Criticality } from './types';
import { AUDIT_ACTION_CONFIG, CriticalityBadge } from './helpers';

export default function ScreenAuditoria() {
  const [filterAction, setFilterAction] = useState('');
  const [filterUser, setFilterUser] = useState('');
  const [filterResult, setFilterResult] = useState('');
  const [filterCrit, setFilterCrit] = useState('');

  const users = [...new Set(AUDIT_EVENTS.map(e => e.user))];

  let events = AUDIT_EVENTS;
  if (filterAction) events = events.filter(e => e.action === filterAction);
  if (filterUser)   events = events.filter(e => e.user === filterUser);
  if (filterResult) events = events.filter(e => e.result === filterResult);
  if (filterCrit)   events = events.filter(e => e.criticality === filterCrit);

  const resultIcon = (r: string) => {
    if (r === 'ok')       return <CheckCircle2 size={14} className="text-emerald-500" />;
    if (r === 'denegado') return <XCircle size={14} className="text-red-500" />;
    return <AlertTriangle size={14} className="text-amber-500" />;
  };

  const resultBadge = (r: string) => {
    if (r === 'ok')       return 'bg-emerald-100 text-emerald-700';
    if (r === 'denegado') return 'bg-red-100 text-red-700';
    return 'bg-amber-100 text-amber-700';
  };

  const resultLabel = (r: string) => {
    if (r === 'ok')       return 'OK';
    if (r === 'denegado') return 'Denegado';
    return 'Error';
  };

  const totals = {
    ok:       AUDIT_EVENTS.filter(e => e.result === 'ok').length,
    denegado: AUDIT_EVENTS.filter(e => e.result === 'denegado').length,
    subidas:  AUDIT_EVENTS.filter(e => e.action === 'subida').length,
    descargas:AUDIT_EVENTS.filter(e => e.action === 'descarga').length,
  };

  return (
    <div className="space-y-5">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total eventos',      value: AUDIT_EVENTS.length, cls: 'text-slate-900',     bg: 'bg-slate-50',    border: 'border-slate-200' },
          { label: 'Operaciones OK',     value: totals.ok,           cls: 'text-emerald-700',   bg: 'bg-emerald-50',  border: 'border-emerald-100' },
          { label: 'Accesos denegados',  value: totals.denegado,     cls: 'text-red-700',       bg: 'bg-red-50',      border: 'border-red-100' },
          { label: 'Descargas',          value: totals.descargas,    cls: 'text-blue-700',      bg: 'bg-blue-50',     border: 'border-blue-100' },
        ].map(({ label, value, cls, bg, border }) => (
          <div key={label} className={`${bg} rounded-xl border ${border} p-4 shadow-sm text-center`}>
            <p className={`text-2xl font-bold ${cls}`}>{value}</p>
            <p className="text-xs text-slate-500 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 flex items-center gap-3 flex-wrap">
        <Filter size={14} className="text-slate-400 flex-shrink-0" />
        <select value={filterAction} onChange={e => setFilterAction(e.target.value)} className="px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white">
          <option value="">Todas las acciones</option>
          {Object.entries(AUDIT_ACTION_CONFIG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
        </select>
        <select value={filterUser} onChange={e => setFilterUser(e.target.value)} className="px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white">
          <option value="">Todos los usuarios</option>
          {users.map(u => <option key={u} value={u}>{u}</option>)}
        </select>
        <select value={filterResult} onChange={e => setFilterResult(e.target.value)} className="px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white">
          <option value="">Todos los resultados</option>
          <option value="ok">OK</option>
          <option value="denegado">Denegado</option>
        </select>
        <select value={filterCrit} onChange={e => setFilterCrit(e.target.value)} className="px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white">
          <option value="">Todas las criticidades</option>
          <option value="baja">Baja</option>
          <option value="media">Media</option>
          <option value="alta">Alta</option>
          <option value="critica">Crítica</option>
        </select>
        <button className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-semibold rounded-lg transition-colors ml-auto">
          <Download size={13} /> Exportar
        </button>
      </div>

      {/* Timeline/Tabla */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
          <h3 className="font-bold text-slate-800 flex items-center gap-2">
            <History size={16} className="text-blue-600" /> Registro de auditoría
          </h3>
          <span className="text-xs text-slate-400">{events.length} evento{events.length !== 1 ? 's' : ''}</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Fecha / Hora</th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Usuario</th>
                <th className="text-center px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Acción</th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Documento</th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Detalle</th>
                <th className="text-center px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Criticidad</th>
                <th className="text-center px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Resultado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {events.length === 0 ? (
                <tr><td colSpan={7} className="text-center py-12 text-slate-400 text-sm">No se encontraron eventos con los filtros seleccionados</td></tr>
              ) : events.map(ev => {
                const ac = AUDIT_ACTION_CONFIG[ev.action];
                return (
                  <tr key={ev.id} className={`hover:bg-slate-50 transition-colors ${ev.result === 'denegado' ? 'bg-red-50/20' : ''}`}>
                    <td className="px-4 py-3 text-xs text-slate-600">
                      <span className="font-mono font-bold text-slate-700">{ev.date}</span>
                      <br />
                      <span className="text-slate-400">{ev.time} h</span>
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-700 font-medium">{ev.user}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded-full ${ac.cls}`}>
                        {ac.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-700 font-medium max-w-[180px] truncate">{ev.document}</td>
                    <td className="px-4 py-3 text-xs text-slate-500 max-w-[220px]">{ev.detail}</td>
                    <td className="px-4 py-3 text-center">
                      {ev.criticality ? <CriticalityBadge value={ev.criticality} size="xs" /> : <span className="text-slate-300">—</span>}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-2 py-0.5 rounded-full ${resultBadge(ev.result)}`}>
                        {resultIcon(ev.result)}
                        {resultLabel(ev.result)}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
