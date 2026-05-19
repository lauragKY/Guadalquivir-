import React from 'react';
import { Box, AlertTriangle, Wrench, Activity, Database, ArrowRight, CheckCircle, Clock, XCircle } from 'lucide-react';
import { BIM_ELEMENTS, BIM_ALERTS, BIM_MODELS, DAM_NAME, DAM_CODE } from './mockData';
import { ElementStatusBadge } from './helpers';
import type { Screen } from './types';

interface Props { onNavigate: (s: Screen) => void; }

export default function ScreenDashboard({ onNavigate }: Props) {
  const criticalAlerts = BIM_ALERTS.filter(a => a.severity === 'critical' && !a.resolved);
  const warningAlerts  = BIM_ALERTS.filter(a => a.severity === 'warning' && !a.resolved);
  const publishedModel = BIM_MODELS.find(m => m.state === 'published' && m.format === 'IFC');

  const statusCounts = {
    operational:        BIM_ELEMENTS.filter(e => e.status === 'operational').length,
    revision_pending:   BIM_ELEMENTS.filter(e => e.status === 'revision_pending').length,
    failure:            BIM_ELEMENTS.filter(e => e.status === 'failure').length,
    threshold_exceeded: BIM_ELEMENTS.filter(e => e.status === 'threshold_exceeded').length,
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Gemelo Digital BIM</h2>
          <p className="text-sm text-slate-500 mt-0.5">{DAM_NAME} · {DAM_CODE}</p>
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-1.5">
          <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
          S.E. activa · Avenida en curso
        </div>
      </div>

      {/* Critical alert banner */}
      {criticalAlerts.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
          <AlertTriangle size={18} className="text-red-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <p className="font-bold text-red-900 text-sm">{criticalAlerts.length} alerta(s) crítica(s) activa(s)</p>
            <ul className="mt-1 space-y-0.5">
              {criticalAlerts.map(a => (
                <li key={a.id} className="text-xs text-red-700">· {a.element_name}: {a.title}</li>
              ))}
            </ul>
          </div>
          <button onClick={() => onNavigate('alerts')} className="flex items-center gap-1 text-xs font-bold text-red-700 hover:text-red-900 flex-shrink-0">
            Ver alertas <ArrowRight size={12} />
          </button>
        </div>
      )}

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Elementos totales',    value: BIM_ELEMENTS.length, color: 'text-slate-700', bg: 'bg-slate-50', icon: <Box size={18} className="text-slate-400" /> },
          { label: 'Alertas abiertas',     value: BIM_ALERTS.filter(a => !a.resolved).length, color: 'text-red-700', bg: 'bg-red-50', icon: <AlertTriangle size={18} className="text-red-400" /> },
          { label: 'Modelos publicados',   value: BIM_MODELS.filter(m => m.state === 'published').length, color: 'text-emerald-700', bg: 'bg-emerald-50', icon: <Database size={18} className="text-emerald-400" /> },
          { label: 'En revisión / Avería', value: statusCounts.revision_pending + statusCounts.failure, color: 'text-amber-700', bg: 'bg-amber-50', icon: <Wrench size={18} className="text-amber-400" /> },
        ].map(k => (
          <div key={k.label} className={`rounded-xl border border-slate-200 ${k.bg} p-4`}>
            <div className="flex items-center justify-between mb-2">{k.icon}<span className={`text-2xl font-bold ${k.color}`}>{k.value}</span></div>
            <p className="text-xs text-slate-500">{k.label}</p>
          </div>
        ))}
      </div>

      {/* Element status grid */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-slate-900 text-sm">Estado de elementos BIM</h3>
          <button onClick={() => onNavigate('viewer')} className="flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-800">
            Abrir visor <ArrowRight size={12} />
          </button>
        </div>
        <div className="grid grid-cols-2 gap-3 mb-4">
          {[
            { label: 'Operativos', count: statusCounts.operational, color: 'bg-emerald-500', bg: 'bg-emerald-50 border-emerald-200' },
            { label: 'Umbral superado', count: statusCounts.threshold_exceeded, color: 'bg-orange-500', bg: 'bg-orange-50 border-orange-200' },
            { label: 'Revisión pendiente', count: statusCounts.revision_pending, color: 'bg-amber-500', bg: 'bg-amber-50 border-amber-200' },
            { label: 'Avería', count: statusCounts.failure, color: 'bg-red-500', bg: 'bg-red-50 border-red-200' },
          ].map(s => (
            <div key={s.label} className={`rounded-xl border ${s.bg} p-3 flex items-center gap-3`}>
              <span className={`w-3 h-3 rounded-full flex-shrink-0 ${s.color}`} />
              <div>
                <p className="text-lg font-bold text-slate-900">{s.count}</p>
                <p className="text-xs text-slate-500">{s.label}</p>
              </div>
            </div>
          ))}
        </div>
        {/* Critical elements list */}
        <div className="space-y-2">
          {BIM_ELEMENTS.filter(e => e.status !== 'operational').map(e => (
            <div key={e.id} className="flex items-center gap-3 px-3 py-2 bg-slate-50 rounded-lg border border-slate-200">
              <ElementStatusBadge status={e.status} />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-slate-800 truncate">{e.name}</p>
                <p className="text-xs text-slate-400">{e.code}</p>
              </div>
              <button onClick={() => onNavigate('viewer')} className="text-xs text-blue-600 hover:text-blue-800 font-semibold flex-shrink-0">Ver</button>
            </div>
          ))}
        </div>
      </div>

      {/* Integration status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Active model info */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
          <h3 className="font-bold text-slate-900 text-sm mb-3 flex items-center gap-2"><Database size={15} /> Modelo activo</h3>
          {publishedModel ? (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-800">{publishedModel.name}</span>
                <span className="text-xs px-2 py-0.5 rounded border font-semibold bg-emerald-100 text-emerald-700 border-emerald-200">v{publishedModel.version}</span>
              </div>
              <p className="text-xs text-slate-500">{publishedModel.elements_count.toLocaleString()} elementos · {publishedModel.format} · {publishedModel.size_mb} MB</p>
              {publishedModel.saih_sync && (
                <div className="flex items-center gap-1.5 text-xs text-teal-700">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse" />
                  SAIH sincronizado · {publishedModel.last_sync}
                </div>
              )}
              <p className="text-xs text-slate-400">Publicado: {publishedModel.published_date} por {publishedModel.published_by}</p>
            </div>
          ) : <p className="text-xs text-slate-400">Sin modelo publicado</p>}
        </div>

        {/* Module integrations */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
          <h3 className="font-bold text-slate-900 text-sm mb-3 flex items-center gap-2"><Activity size={15} /> Integraciones activas</h3>
          <div className="space-y-2">
            {[
              { name: 'Auscultación', status: 'S.E. · 2 variables umbral superado', ok: false, color: 'text-orange-700' },
              { name: 'Explotación',  status: 'S. Extraordinaria activa · Avenida', ok: false, color: 'text-amber-700' },
              { name: 'Mantenimiento',status: '1 avería activa · 1 revisión vencida', ok: false, color: 'text-red-700' },
              { name: 'Inventario',   status: 'Sincronizado · Todos los elementos', ok: true, color: 'text-emerald-700' },
              { name: 'Archivo Técnico', status: 'Sincronizado · 48 documentos', ok: true, color: 'text-emerald-700' },
            ].map(m => (
              <div key={m.name} className="flex items-center gap-3">
                {m.ok
                  ? <CheckCircle size={13} className="text-emerald-500 flex-shrink-0" />
                  : <AlertTriangle size={13} className="text-amber-500 flex-shrink-0" />
                }
                <span className="text-xs font-semibold text-slate-700 w-28 flex-shrink-0">{m.name}</span>
                <span className={`text-xs ${m.color}`}>{m.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent alerts */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-slate-900 text-sm">Alertas recientes</h3>
          <button onClick={() => onNavigate('alerts')} className="flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-800">Ver todas <ArrowRight size={12} /></button>
        </div>
        <div className="space-y-2">
          {BIM_ALERTS.slice(0, 5).map(a => (
            <div key={a.id} className={`flex items-start gap-3 p-3 rounded-lg border text-xs ${
              a.severity === 'critical' ? 'bg-red-50 border-red-200' :
              a.severity === 'warning'  ? 'bg-amber-50 border-amber-200' :
              'bg-blue-50 border-blue-200'
            }`}>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="font-bold text-slate-800">{a.element_name}</span>
                  <span className="text-slate-400">{a.date} {a.time}</span>
                  {a.resolved && <span className="text-emerald-600 font-semibold">· Resuelta</span>}
                </div>
                <p className="text-slate-700 truncate">{a.title}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
