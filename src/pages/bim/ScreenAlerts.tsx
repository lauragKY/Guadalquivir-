import React, { useState } from 'react';
import { AlertTriangle, CheckCircle, Bell, User, PlusCircle, Eye, ArrowRight } from 'lucide-react';
import { BIM_ALERTS, BIM_ELEMENTS } from './mockData';
import { AlertSeverityBadge, AlertSourceBadge, ALERT_SEVERITY_CFG, ALERT_SOURCE_CFG } from './helpers';
import type { Screen, BimAlert, AlertSeverity, AlertSource } from './types';

interface Props { onNavigate: (s: Screen) => void; }

export default function ScreenAlerts({ onNavigate }: Props) {
  const [severityFilter, setSeverityFilter] = useState<AlertSeverity | 'all'>('all');
  const [sourceFilter, setSourceFilter] = useState<AlertSource | 'all'>('all');
  const [showResolved, setShowResolved] = useState(false);
  const [selected, setSelected] = useState<BimAlert | null>(BIM_ALERTS[0]);
  const [markingDone, setMarkingDone] = useState(false);

  const filtered = BIM_ALERTS.filter(a => {
    if (!showResolved && a.resolved) return false;
    if (severityFilter !== 'all' && a.severity !== severityFilter) return false;
    if (sourceFilter !== 'all' && a.source !== sourceFilter) return false;
    return true;
  });

  const open     = BIM_ALERTS.filter(a => !a.resolved);
  const critical = open.filter(a => a.severity === 'critical');
  const warning  = open.filter(a => a.severity === 'warning');
  const info     = open.filter(a => a.severity === 'info');

  const affectedElement = selected ? BIM_ELEMENTS.find(e => e.id === selected.element_id) : null;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-900">Panel de alertas BIM</h2>
        <span className="text-xs text-slate-500">{open.length} alerta(s) abiertas</span>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Críticas',     value: critical.length, bg: 'bg-red-50',    text: 'text-red-700',    border: 'border-red-200' },
          { label: 'Avisos',       value: warning.length,  bg: 'bg-amber-50',  text: 'text-amber-700',  border: 'border-amber-200' },
          { label: 'Informativas', value: info.length,     bg: 'bg-blue-50',   text: 'text-blue-700',   border: 'border-blue-200' },
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
              {s === 'all' ? 'Todas las severidades' : ALERT_SEVERITY_CFG[s].label}
            </button>
          ))}
        </div>
        <div className="w-px h-4 bg-slate-200 hidden lg:block" />
        <div className="flex flex-wrap gap-1.5">
          {(['all', 'maintenance', 'auscultation', 'exploitation', 'inventory', 'archive'] as const).map(s => (
            <button key={s} onClick={() => setSourceFilter(s)} className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${sourceFilter === s ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
              {s === 'all' ? 'Todos módulos' : ALERT_SOURCE_CFG[s].label}
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
        <div className="lg:col-span-1 space-y-2 max-h-[560px] overflow-y-auto pr-1">
          {filtered.length === 0 && (
            <div className="bg-white rounded-xl border border-slate-200 p-6 text-center text-slate-400 text-sm">No hay alertas con los filtros seleccionados.</div>
          )}
          {filtered.map(alert => (
            <button
              key={alert.id}
              onClick={() => { setSelected(alert); setMarkingDone(false); }}
              className={`w-full text-left rounded-xl border p-4 transition-all ${selected?.id === alert.id ? 'border-blue-400 bg-blue-50 shadow-sm' : 'border-slate-200 bg-white hover:bg-slate-50'}`}
            >
              <div className="flex flex-wrap gap-1.5 mb-2">
                <AlertSeverityBadge severity={alert.severity} />
                <AlertSourceBadge source={alert.source} />
              </div>
              <p className="text-xs font-bold text-slate-800 mb-0.5">{alert.element_name}</p>
              <p className="text-xs text-slate-600 mb-1 line-clamp-2">{alert.title}</p>
              <p className="text-xs font-mono text-slate-400">{alert.date} {alert.time}</p>
              {alert.resolved && <p className="text-xs text-emerald-600 font-semibold mt-1">Resuelta · {alert.resolved_date}</p>}
              {alert.assigned_to && <p className="text-xs text-blue-600 mt-0.5 flex items-center gap-1"><User size={10} />{alert.assigned_to}</p>}
            </button>
          ))}
        </div>

        {/* Alert detail */}
        {selected && (
          <div className="lg:col-span-2 space-y-4">
            <div className={`bg-white rounded-xl border shadow-sm p-5 ${ALERT_SEVERITY_CFG[selected.severity].bg}`}>
              <div className="flex items-start justify-between gap-3 mb-4">
                <div>
                  <div className="flex flex-wrap gap-1.5 mb-1.5">
                    <AlertSeverityBadge severity={selected.severity} />
                    <AlertSourceBadge source={selected.source} />
                  </div>
                  <h3 className="font-bold text-slate-900 text-base">{selected.title}</h3>
                  <p className="text-xs text-slate-500 mt-0.5 font-mono">{selected.date} {selected.time} · Elemento: <strong>{selected.element_name}</strong></p>
                </div>
                {selected.resolved
                  ? <span className="flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-100 border border-emerald-200 rounded-lg px-2 py-1"><CheckCircle size={12} /> Resuelta</span>
                  : <span className="flex items-center gap-1 text-xs font-bold text-amber-700 bg-amber-100 border border-amber-200 rounded-lg px-2 py-1"><Bell size={12} /> Abierta</span>
                }
              </div>

              {/* Description */}
              <div className="bg-white rounded-xl border border-slate-200 p-4 mb-3">
                <p className="text-xs font-bold uppercase tracking-wide text-slate-500 mb-1.5">Descripción</p>
                <p className="text-sm text-slate-800">{selected.description}</p>
              </div>

              {/* Recommendation */}
              <div className={`rounded-xl border p-4 mb-4 ${
                selected.severity === 'critical' ? 'bg-red-50 border-red-200' :
                selected.severity === 'warning' ? 'bg-amber-50 border-amber-200' :
                'bg-blue-50 border-blue-200'
              }`}>
                <p className={`text-xs font-bold uppercase tracking-wide mb-1 ${
                  selected.severity === 'critical' ? 'text-red-700' :
                  selected.severity === 'warning'  ? 'text-amber-700' : 'text-blue-700'
                }`}>Recomendación</p>
                <p className="text-sm text-slate-800">{selected.recommendation}</p>
              </div>

              {/* Affected element card */}
              {affectedElement && (
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-4">
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-500 mb-2">Elemento afectado</p>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-slate-800">{affectedElement.name}</p>
                      <p className="text-xs text-slate-500">{affectedElement.code} · {affectedElement.location}</p>
                    </div>
                    <button onClick={() => onNavigate('viewer')} className="flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-800 flex-shrink-0">
                      <Eye size={12} /> Ver en visor
                    </button>
                  </div>
                </div>
              )}

              {/* Resolution info */}
              {selected.resolved && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mb-4">
                  <p className="text-xs font-bold uppercase tracking-wide text-emerald-700 mb-1">Resolución</p>
                  <p className="text-sm text-emerald-800">Resuelta el {selected.resolved_date} por <strong>{selected.resolved_by}</strong></p>
                </div>
              )}

              {markingDone && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 mb-4 flex items-center gap-2 text-sm text-emerald-800">
                  <CheckCircle size={14} className="text-emerald-600" /> Alerta marcada como revisada. Registrado en auditoría.
                </div>
              )}

              {/* Actions */}
              {!selected.resolved && !markingDone && (
                <div className="flex flex-wrap gap-2">
                  <button onClick={() => setMarkingDone(true)} className="flex items-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl">
                    <CheckCircle size={13} /> Marcar revisada
                  </button>
                  <button onClick={() => onNavigate('viewer')} className="flex items-center gap-1.5 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl">
                    <Eye size={13} /> Ver en modelo
                  </button>
                  <button className="flex items-center gap-1.5 px-3 py-2 bg-slate-600 hover:bg-slate-700 text-white text-xs font-bold rounded-xl">
                    <User size={13} /> Asignar responsable
                  </button>
                  <button className="flex items-center gap-1.5 px-3 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl">
                    <PlusCircle size={13} /> Crear incidencia
                  </button>
                  {selected.severity === 'critical' && (
                    <button className="flex items-center gap-1.5 px-3 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl">
                      <ArrowRight size={13} /> Comunicar a Emergencias
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
