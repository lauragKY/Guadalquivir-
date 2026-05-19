import React, { useState } from 'react';
import { AlertTriangle, CheckCircle, Bell } from 'lucide-react';
import { BIM_ALERTS } from './mockData';
import { AlertSeverityBadge, AlertSourceBadge, ALERT_SEVERITY_CFG } from './helpers';
import type { Screen, BimAlert, AlertSeverity, AlertSource } from './types';

interface Props { onNavigate: (s: Screen) => void; }

export default function ScreenAlerts({ onNavigate }: Props) {
  const [severityFilter, setSeverityFilter] = useState<AlertSeverity | 'all'>('all');
  const [sourceFilter, setSourceFilter] = useState<AlertSource | 'all'>('all');
  const [showResolved, setShowResolved] = useState(false);
  const [selected, setSelected] = useState<BimAlert | null>(BIM_ALERTS[0]);

  const filtered = BIM_ALERTS.filter(a => {
    if (!showResolved && a.resolved) return false;
    if (severityFilter !== 'all' && a.severity !== severityFilter) return false;
    if (sourceFilter !== 'all' && a.source !== sourceFilter) return false;
    return true;
  });

  const open = BIM_ALERTS.filter(a => !a.resolved);
  const critical = open.filter(a => a.severity === 'critical');
  const warning  = open.filter(a => a.severity === 'warning');

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-900">Panel de alertas BIM</h2>
        <span className="text-xs text-slate-500">{open.length} alerta(s) abiertas</span>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Críticas',      value: critical.length, bg: 'bg-red-50',     text: 'text-red-700',     border: 'border-red-200' },
          { label: 'Avisos',        value: warning.length,  bg: 'bg-amber-50',   text: 'text-amber-700',   border: 'border-amber-200' },
          { label: 'Informativas',  value: open.filter(a => a.severity === 'info').length, bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
        ].map(s => (
          <div key={s.label} className={`rounded-xl border ${s.border} ${s.bg} p-4 text-center`}>
            <p className={`text-2xl font-bold ${s.text}`}>{s.value}</p>
            <p className="text-xs text-slate-500 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 flex flex-wrap gap-3 items-center">
        <div className="flex flex-wrap gap-1.5">
          {(['all', 'critical', 'warning', 'info'] as const).map(s => (
            <button key={s} onClick={() => setSeverityFilter(s)} className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${severityFilter === s ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
              {s === 'all' ? 'Todas' : ALERT_SEVERITY_CFG[s].label}
            </button>
          ))}
        </div>
        <div className="w-px h-4 bg-slate-200" />
        <div className="flex flex-wrap gap-1.5">
          {(['all', 'maintenance', 'auscultation', 'exploitation'] as const).map(s => (
            <button key={s} onClick={() => setSourceFilter(s)} className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${sourceFilter === s ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
              {s === 'all' ? 'Todos los módulos' : s === 'maintenance' ? 'Mantenimiento' : s === 'auscultation' ? 'Auscultación' : 'Explotación'}
            </button>
          ))}
        </div>
        <label className="flex items-center gap-2 text-xs text-slate-600 ml-auto cursor-pointer">
          <input type="checkbox" checked={showResolved} onChange={e => setShowResolved(e.target.checked)} className="rounded" />
          Mostrar resueltas
        </label>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Alert list */}
        <div className="lg:col-span-1 space-y-2">
          {filtered.length === 0 && (
            <div className="bg-white rounded-xl border border-slate-200 p-6 text-center text-slate-400 text-sm">No hay alertas con los filtros seleccionados.</div>
          )}
          {filtered.map(alert => (
            <button
              key={alert.id}
              onClick={() => setSelected(alert)}
              className={`w-full text-left rounded-xl border p-4 transition-all ${selected?.id === alert.id ? 'border-blue-400 bg-blue-50 shadow-sm' : 'border-slate-200 bg-white hover:bg-slate-50'}`}
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <AlertSeverityBadge severity={alert.severity} />
                <AlertSourceBadge source={alert.source} />
              </div>
              <p className="text-xs font-bold text-slate-800 mb-0.5">{alert.element_name}</p>
              <p className="text-xs text-slate-600 mb-1 line-clamp-2">{alert.title}</p>
              <p className="text-xs font-mono text-slate-400">{alert.date} {alert.time}</p>
              {alert.resolved && <p className="text-xs text-emerald-600 font-semibold mt-1">Resuelta · {alert.resolved_date}</p>}
            </button>
          ))}
        </div>

        {/* Alert detail */}
        {selected && (
          <div className="lg:col-span-2 space-y-4">
            <div className={`bg-white rounded-xl border shadow-sm p-5 ${ALERT_SEVERITY_CFG[selected.severity].bg}`}>
              <div className="flex items-start justify-between gap-3 mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <AlertSeverityBadge severity={selected.severity} />
                    <AlertSourceBadge source={selected.source} />
                  </div>
                  <h3 className="font-bold text-slate-900 text-base">{selected.title}</h3>
                  <p className="text-xs text-slate-500 mt-0.5 font-mono">{selected.date} {selected.time} · Elemento: {selected.element_name}</p>
                </div>
                {selected.resolved
                  ? <span className="flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-100 border border-emerald-200 rounded-lg px-2 py-1"><CheckCircle size={12} /> Resuelta</span>
                  : <span className="flex items-center gap-1 text-xs font-bold text-amber-700 bg-amber-100 border border-amber-200 rounded-lg px-2 py-1"><Bell size={12} /> Abierta</span>
                }
              </div>

              <div className="bg-white rounded-xl border border-slate-200 p-4 mb-4">
                <p className="text-xs font-bold uppercase tracking-wide text-slate-500 mb-2">Descripción</p>
                <p className="text-sm text-slate-800">{selected.description}</p>
              </div>

              {selected.resolved && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mb-4">
                  <p className="text-xs font-bold uppercase tracking-wide text-emerald-700 mb-1">Resolución</p>
                  <p className="text-sm text-emerald-800">Resuelta el {selected.resolved_date} por {selected.resolved_by}</p>
                </div>
              )}

              {!selected.resolved && (
                <div className="flex flex-wrap gap-3">
                  <button className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold rounded-xl transition-colors">
                    <CheckCircle size={14} /> Marcar como resuelta
                  </button>
                  <button onClick={() => onNavigate('viewer')} className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl transition-colors">
                    Ver en visor BIM
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
