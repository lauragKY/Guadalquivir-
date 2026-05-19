import React from 'react';
import {
  Box, AlertTriangle, Wrench, Activity, Database, ArrowRight,
  CheckCircle, Eye, Shield, FileText, Zap, Settings
} from 'lucide-react';
import { BIM_ELEMENTS, BIM_ALERTS, BIM_MODELS, DAM_NAME, DAM_CODE, DAM_STATUS, MODULE_INTEGRATIONS } from './mockData';
import { DamStatusBanner, ElementStatusBadge, IntegrationStatusBadge } from './helpers';
import type { Screen } from './types';

interface Props { onNavigate: (s: Screen) => void; }

export default function ScreenDashboard({ onNavigate }: Props) {
  const openAlerts   = BIM_ALERTS.filter(a => !a.resolved);
  const criticalAlerts = openAlerts.filter(a => a.severity === 'critical');
  const pubModel     = BIM_MODELS.find(m => m.state === 'published' && m.format_original === 'glTF');
  const withAlerts   = BIM_ELEMENTS.filter(e => e.status !== 'operational' && e.status !== 'no_data');
  const withMaint    = BIM_ELEMENTS.filter(e => e.maint_open_incidents && e.maint_open_incidents > 0);
  const sensorAlert  = BIM_ELEMENTS.filter(e => e.status === 'threshold_exceeded');

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-900">BIM / Gemelo Digital</h2>
          <p className="text-sm text-slate-500 mt-0.5">{DAM_NAME} · {DAM_CODE}</p>
        </div>
        <DamStatusBanner status={DAM_STATUS} />
      </div>

      {/* Critical banner */}
      {criticalAlerts.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
          <AlertTriangle size={18} className="text-red-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <p className="font-bold text-red-900 text-sm">{criticalAlerts.length} alerta(s) crítica(s) activa(s)</p>
            <ul className="mt-1 space-y-0.5">
              {criticalAlerts.map(a => (
                <li key={a.id} className="text-xs text-red-700">· <strong>{a.element_name}</strong>: {a.title}</li>
              ))}
            </ul>
          </div>
          <button onClick={() => onNavigate('alerts')} className="flex items-center gap-1 text-xs font-bold text-red-700 hover:text-red-900 flex-shrink-0 whitespace-nowrap">
            Ver alertas <ArrowRight size={12} />
          </button>
        </div>
      )}

      {/* Exploitation status banner */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
        <Activity size={16} className="text-amber-600 flex-shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0 text-xs">
          <p className="font-bold text-amber-900 mb-1">Estado global de la presa · Módulo Explotación</p>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
            {[
              { label: 'Estado', value: 'S. Extraordinaria · Avenida' },
              { label: 'NE embalse', value: '600.92 m.s.n.m.' },
              { label: 'Aportación', value: '1.420 m³/s' },
              { label: 'Caudal desembalsado', value: '520 m³/s' },
            ].map(item => (
              <div key={item.label}>
                <p className="text-amber-600">{item.label}</p>
                <p className="font-bold text-amber-900">{item.value}</p>
              </div>
            ))}
          </div>
          <p className="text-amber-600 mt-1.5 italic">El estado global se sincroniza desde el módulo de Explotación.</p>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Elementos inventariados', value: BIM_ELEMENTS.length, color: 'text-slate-700', bg: 'bg-slate-50', icon: <Box size={18} className="text-slate-400" /> },
          { label: 'Alertas abiertas',        value: openAlerts.length,   color: 'text-red-700',   bg: 'bg-red-50',   icon: <AlertTriangle size={18} className="text-red-400" /> },
          { label: 'Mant. pendiente',          value: withMaint.length,    color: 'text-amber-700', bg: 'bg-amber-50', icon: <Wrench size={18} className="text-amber-400" /> },
          { label: 'Sensores umbral superado', value: sensorAlert.length,  color: 'text-orange-700', bg: 'bg-orange-50', icon: <Zap size={18} className="text-orange-400" /> },
        ].map(k => (
          <div key={k.label} className={`rounded-xl border border-slate-200 ${k.bg} p-4`}>
            <div className="flex items-center justify-between mb-1">{k.icon}<span className={`text-2xl font-bold ${k.color}`}>{k.value}</span></div>
            <p className="text-xs text-slate-500">{k.label}</p>
          </div>
        ))}
      </div>

      {/* Model info + Quick actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Model summary */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
          <h3 className="font-bold text-slate-900 text-sm mb-3 flex items-center gap-2"><Database size={15} /> Modelo BIM activo</h3>
          <div className="space-y-2 text-xs">
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: 'Archivo original', value: 'Guadalmena_BIM_IFC_v1.ifc' },
                { label: 'Archivo optimizado', value: 'Guadalmena_Modelo_Optimizado_v1.gltf' },
                { label: 'Versión', value: '1.0 · Publicado' },
                { label: 'Última actualización', value: '20/03/2026' },
                { label: 'Elementos totales', value: '14.832' },
                { label: 'Elementos visor', value: '4.200 (optimizado)' },
              ].map(item => (
                <div key={item.label}>
                  <p className="text-slate-500">{item.label}</p>
                  <p className="font-semibold text-slate-800">{item.value}</p>
                </div>
              ))}
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-2 mt-2">
              <p className="text-blue-800 text-xs font-semibold">El modelo original (1.24 GB) se conserva en Archivo Técnico. El visor utiliza la versión optimizada (88 MB) para garantizar rendimiento.</p>
            </div>
            {pubModel?.saih_sync && (
              <div className="flex items-center gap-1.5 text-teal-700 mt-1">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse" />
                SAIH sincronizado · {pubModel.last_sync}
              </div>
            )}
          </div>
        </div>

        {/* Quick access */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
          <h3 className="font-bold text-slate-900 text-sm mb-3">Accesos rápidos</h3>
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: 'Abrir visor 3D',          screen: 'viewer'      as Screen, icon: <Eye size={14} />,          color: 'bg-blue-600 hover:bg-blue-700' },
              { label: 'Ver elementos críticos',   screen: 'viewer'      as Screen, icon: <AlertTriangle size={14} />, color: 'bg-red-600 hover:bg-red-700' },
              { label: 'Ver alertas',              screen: 'alerts'      as Screen, icon: <Shield size={14} />,        color: 'bg-amber-600 hover:bg-amber-700' },
              { label: 'Gestión de modelos',       screen: 'models'      as Screen, icon: <Database size={14} />,      color: 'bg-slate-600 hover:bg-slate-700' },
              { label: 'Integraciones',            screen: 'integrations' as Screen, icon: <Activity size={14} />,     color: 'bg-teal-600 hover:bg-teal-700' },
              { label: 'Auditoría BIM',            screen: 'audit'       as Screen, icon: <FileText size={14} />,      color: 'bg-slate-700 hover:bg-slate-800' },
            ].map(item => (
              <button
                key={item.label}
                onClick={() => onNavigate(item.screen)}
                className={`flex items-center gap-2 px-3 py-2.5 ${item.color} text-white text-xs font-bold rounded-xl transition-colors`}
              >
                {item.icon} {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Element status + non-operational list */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Status summary */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-900 text-sm">Estado de elementos BIM</h3>
            <button onClick={() => onNavigate('viewer')} className="text-xs text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1">Visor <ArrowRight size={11} /></button>
          </div>
          <div className="grid grid-cols-2 gap-2 mb-4">
            {[
              { label: 'Operativos',        count: BIM_ELEMENTS.filter(e => e.status === 'operational').length,        fill: '#d1fae5', stroke: '#059669' },
              { label: 'Umbral superado',   count: BIM_ELEMENTS.filter(e => e.status === 'threshold_exceeded').length,  fill: '#ffedd5', stroke: '#ea580c' },
              { label: 'Rev. pendiente',    count: BIM_ELEMENTS.filter(e => e.status === 'revision_pending').length,    fill: '#fef3c7', stroke: '#d97706' },
              { label: 'Avería',            count: BIM_ELEMENTS.filter(e => e.status === 'failure').length,             fill: '#fee2e2', stroke: '#dc2626' },
            ].map(s => (
              <div key={s.label} className="rounded-xl p-3 flex items-center gap-2.5" style={{ backgroundColor: s.fill, border: `1px solid ${s.stroke}` }}>
                <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: s.stroke }} />
                <div>
                  <p className="text-lg font-bold text-slate-900">{s.count}</p>
                  <p className="text-xs text-slate-600">{s.label}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-1.5">
            {withAlerts.map(e => (
              <div key={e.id} className="flex items-center gap-2.5 px-2.5 py-2 bg-slate-50 rounded-lg border border-slate-100">
                <ElementStatusBadge status={e.status} />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-slate-800 truncate">{e.name}</p>
                  <p className="text-xs text-slate-400">{e.code}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Integrations status */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-slate-900 text-sm">Estado de integraciones</h3>
            <button onClick={() => onNavigate('integrations')} className="text-xs text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1">Ver todas <ArrowRight size={11} /></button>
          </div>
          <div className="space-y-3">
            {MODULE_INTEGRATIONS.map(m => (
              <div key={m.id} className="flex items-center gap-3">
                <IntegrationStatusBadge status={m.status} />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-slate-700">{m.name}</p>
                  <p className="text-xs text-slate-400">{m.elements_linked} elementos vinculados{m.docs_linked ? ` · ${m.docs_linked} docs` : ''}</p>
                </div>
                {m.last_sync && <p className="text-xs text-slate-400 flex-shrink-0">{m.last_sync.split(' ')[1]}</p>}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Docs linked summary */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
        <h3 className="font-bold text-slate-900 text-sm mb-3 flex items-center gap-2"><FileText size={15} /> Documentación vinculada (Archivo Técnico)</h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          {[
            { label: 'Modelos BIM originales', value: 3, path: 'AT > BIM > Guadalmena > Modelos originales' },
            { label: 'Modelos optimizados', value: 1, path: 'AT > BIM > Guadalmena > Modelos optimizados' },
            { label: 'Planos', value: 8, path: 'AT > BIM > Guadalmena > Planos' },
            { label: 'Manuales', value: 12, path: 'AT > BIM > Guadalmena > Manuales' },
          ].map(d => (
            <div key={d.label} className="bg-slate-50 rounded-xl border border-slate-200 p-3">
              <p className="text-lg font-bold text-slate-900">{d.value}</p>
              <p className="font-semibold text-slate-700">{d.label}</p>
              <p className="text-slate-400 mt-0.5">{d.path}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
