import React from 'react';
import { Activity, Bell, CheckCircle, AlertTriangle, Zap, Shield, Clock, Database, Radio, BarChart3, Settings, History, FileText, ArrowRight } from 'lucide-react';
import { VARIABLES, ALERTS, CURRENT_DATE, CURRENT_TIME } from './mockData';
import { VarStatusBadge } from './helpers';
import type { Screen } from './types';

interface Props {
  onNavigate: (s: Screen, id?: string) => void;
}

export default function ScreenDashboard({ onNavigate }: Props) {
  const total = VARIABLES.length;
  const normal = VARIABLES.filter(v => v.status === 'normal').length;
  const extraordinary = VARIABLES.filter(v => v.status === 'extraordinary').length;
  const scenario0 = VARIABLES.filter(v => v.status === 'scenario_0').length;
  const pendingAlerts = ALERTS.filter(a => a.alert_status === 'pending').length;
  const sentAlerts = ALERTS.length;
  const emergComms = ALERTS.filter(a => a.emergency_comm_sent).length;

  const urgentVar = VARIABLES.find(v => v.status === 'extraordinary' || v.status === 'scenario_0');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Panel principal de Auscultación</h2>
          <p className="text-sm text-slate-500 mt-0.5">Presa de Bembézar · {CURRENT_DATE} {CURRENT_TIME}</p>
        </div>
        <div className="flex items-center gap-2">
          <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border ${extraordinary > 0 || scenario0 > 0 ? 'bg-amber-50 border-amber-300' : 'bg-emerald-50 border-emerald-200'}`}>
            <span className={`w-2.5 h-2.5 rounded-full animate-pulse ${extraordinary > 0 || scenario0 > 0 ? 'bg-amber-500' : 'bg-emerald-500'}`} />
            <span className={`text-sm font-bold ${extraordinary > 0 || scenario0 > 0 ? 'text-amber-800' : 'text-emerald-700'}`}>
              {extraordinary > 0 ? 'Situación Extraordinaria activa' : scenario0 > 0 ? 'Escenario 0 detectado' : 'Sistema normal'}
            </span>
          </div>
        </div>
      </div>

      {/* Urgent banner */}
      {urgentVar && (
        <div className={`rounded-xl border-l-4 p-4 flex items-start justify-between gap-4 ${urgentVar.status === 'scenario_0' ? 'bg-red-50 border-red-500' : 'bg-amber-50 border-amber-500'}`}>
          <div className="flex items-start gap-3">
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${urgentVar.status === 'scenario_0' ? 'bg-red-100' : 'bg-amber-100'}`}>
              <AlertTriangle size={18} className={urgentVar.status === 'scenario_0' ? 'text-red-600' : 'text-amber-600'} />
            </div>
            <div>
              <p className={`font-bold text-sm ${urgentVar.status === 'scenario_0' ? 'text-red-900' : 'text-amber-900'}`}>
                {urgentVar.name} — {urgentVar.status === 'scenario_0' ? 'Escenario 0 superado' : 'Situación Extraordinaria detectada'}
              </p>
              <p className={`text-xs mt-0.5 ${urgentVar.status === 'scenario_0' ? 'text-red-700' : 'text-amber-700'}`}>
                Valor actual: <strong>{urgentVar.current_value.toFixed(1)} {urgentVar.unit}</strong>
                {urgentVar.threshold_se && ` · Umbral S.E.: ${urgentVar.threshold_se.toFixed(1)} ${urgentVar.unit}`}
                {pendingAlerts > 0 && ` · ${pendingAlerts} aviso${pendingAlerts > 1 ? 's' : ''} pendiente${pendingAlerts > 1 ? 's' : ''} de validación`}
              </p>
            </div>
          </div>
          <div className="flex gap-2 flex-shrink-0">
            <button
              onClick={() => onNavigate('alerts')}
              className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-lg transition-colors"
            >
              Revisar aviso
            </button>
            <button
              onClick={() => onNavigate('variable_detail', urgentVar.id)}
              className="px-3 py-1.5 bg-white border border-amber-300 text-amber-700 text-xs font-bold rounded-lg hover:bg-amber-50 transition-colors"
            >
              Ver variable
            </button>
          </div>
        </div>
      )}

      {/* Integration status */}
      <div className="grid grid-cols-2 gap-4">
        {[
          { label: 'DAMDATA', detail: 'damdata.chguadalquivir.es', status: 'Conectado', sub: `Última sincronización: ${CURRENT_TIME}`, ok: true, icon: <Database size={16} className="text-blue-600" /> },
          { label: 'SAIH',    detail: 'saih.chguadalquivir.es',    status: 'Conectado', sub: `NE actualizado: ${CURRENT_TIME}`,        ok: true, icon: <Radio size={16} className="text-teal-600" /> },
        ].map(item => (
          <div key={item.label} className="bg-white rounded-xl border border-slate-200 p-4 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center">{item.icon}</div>
              <div>
                <p className="text-sm font-bold text-slate-800">{item.label}</p>
                <p className="text-xs text-slate-500">{item.detail}</p>
              </div>
            </div>
            <div className="text-right">
              <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full ${item.ok ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${item.ok ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`} />
                {item.status}
              </span>
              <p className="text-xs text-slate-400 mt-1">{item.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          { label: 'Variables normales',       value: normal,        color: 'text-emerald-600', bg: 'bg-emerald-50',  icon: <CheckCircle size={20} className="text-emerald-600" /> },
          { label: 'Situación Extraordinaria', value: extraordinary, color: 'text-amber-700',   bg: 'bg-amber-50',    icon: <AlertTriangle size={20} className="text-amber-600" /> },
          { label: 'Escenario 0 detectado',    value: scenario0,     color: 'text-red-600',     bg: 'bg-red-50',      icon: <Zap size={20} className="text-red-600" /> },
          { label: 'Avisos pendientes',        value: pendingAlerts, color: 'text-amber-600',   bg: 'bg-amber-50',    icon: <Bell size={20} className="text-amber-600" /> },
          { label: 'Avisos enviados (2026)',    value: sentAlerts,    color: 'text-slate-600',   bg: 'bg-slate-100',   icon: <Activity size={20} className="text-slate-500" /> },
          { label: 'Comun. a Emergencias',     value: emergComms,    color: 'text-slate-600',   bg: 'bg-slate-100',   icon: <Shield size={20} className="text-slate-500" /> },
        ].map(item => (
          <div key={item.label} className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl ${item.bg} flex items-center justify-center flex-shrink-0`}>{item.icon}</div>
            <div>
              <p className={`text-2xl font-bold ${item.color}`}>{item.value}</p>
              <p className="text-xs text-slate-500 mt-0.5">{item.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Quick access */}
      <div>
        <p className="text-xs font-bold uppercase tracking-wide text-slate-500 mb-3">Accesos rápidos</p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {[
            { label: 'Ver variables críticas',  icon: <Activity size={18} />,  target: 'variables' as Screen,    color: 'bg-blue-600 hover:bg-blue-700' },
            { label: 'Revisar avisos',           icon: <Bell size={18} />,      target: 'alerts' as Screen,       color: 'bg-amber-500 hover:bg-amber-600',  badge: pendingAlerts },
            { label: 'Configurar umbrales',      icon: <Settings size={18} />,  target: 'config' as Screen,       color: 'bg-slate-700 hover:bg-slate-800' },
            { label: 'Comunicar a Emergencias',  icon: <Shield size={18} />,    target: 'emergency_comm' as Screen, color: 'bg-red-600 hover:bg-red-700' },
            { label: 'Histórico de superaciones',icon: <History size={18} />,   target: 'historic' as Screen,     color: 'bg-slate-600 hover:bg-slate-700' },
            { label: 'Auditoría',                icon: <FileText size={18} />,  target: 'audit' as Screen,        color: 'bg-slate-500 hover:bg-slate-600' },
          ].map(item => (
            <button
              key={item.label}
              onClick={() => onNavigate(item.target)}
              className={`relative flex items-center gap-3 px-4 py-3.5 rounded-xl text-white font-semibold text-sm transition-all shadow-sm ${item.color}`}
            >
              {item.icon}
              {item.label}
              {item.badge ? (
                <span className="absolute top-2 right-2 w-5 h-5 rounded-full bg-white text-amber-600 text-xs font-bold flex items-center justify-center">
                  {item.badge}
                </span>
              ) : null}
              <ArrowRight size={14} className="ml-auto opacity-60" />
            </button>
          ))}
        </div>
      </div>

      {/* Variable summary table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
          <h3 className="font-bold text-slate-800 flex items-center gap-2">
            <BarChart3 size={15} className="text-blue-600" />
            Resumen de variables — {CURRENT_DATE}
          </h3>
          <button onClick={() => onNavigate('variables')} className="text-xs text-blue-600 hover:underline font-medium flex items-center gap-1">
            Ver todas <ArrowRight size={12} />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-4 py-2.5 text-left text-xs font-semibold text-slate-500">Variable</th>
                <th className="px-4 py-2.5 text-left text-xs font-semibold text-slate-500">Sensor</th>
                <th className="px-4 py-2.5 text-right text-xs font-semibold text-slate-500">Valor actual</th>
                <th className="px-4 py-2.5 text-left text-xs font-semibold text-slate-500">Fuente</th>
                <th className="px-4 py-2.5 text-center text-xs font-semibold text-slate-500">Estado</th>
                <th className="px-4 py-2.5 text-left text-xs font-semibold text-slate-500">Última lectura</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {VARIABLES.map(v => (
                <tr
                  key={v.id}
                  onClick={() => onNavigate('variable_detail', v.id)}
                  className="hover:bg-slate-50 cursor-pointer transition-colors"
                >
                  <td className="px-4 py-3">
                    <p className="text-xs font-bold text-slate-800">{v.name}</p>
                    <p className="text-xs text-slate-400 font-mono">{v.code}</p>
                  </td>
                  <td className="px-4 py-3 text-xs font-mono text-slate-600">{v.sensor_code}</td>
                  <td className="px-4 py-3 text-right text-xs font-bold font-mono text-slate-800">
                    {v.current_value.toFixed(1)} <span className="font-normal text-slate-500">{v.unit}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded text-xs font-semibold border ${
                      v.source === 'DAMDATA' ? 'bg-blue-50 text-blue-700 border-blue-200'
                      : v.source === 'SAIH' ? 'bg-teal-50 text-teal-700 border-teal-200'
                      : 'bg-orange-50 text-orange-700 border-orange-200'
                    }`}>{v.source}</span>
                  </td>
                  <td className="px-4 py-3 text-center"><VarStatusBadge status={v.status} /></td>
                  <td className="px-4 py-3 text-xs text-slate-500 font-mono">{v.last_reading}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Integration modules card */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
        <h3 className="font-bold text-slate-800 text-sm mb-3 flex items-center gap-2">
          <Activity size={15} className="text-blue-600" />
          Integración con otros módulos SIPRESAS
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {[
            { label: 'DAMDATA',           detail: 'Origen variables auscultación',    ok: true },
            { label: 'SAIH',              detail: 'Nivel embalse y variables ambientales', ok: true },
            { label: 'Explotación',       detail: 'Contexto operativo presa',          ok: true },
            { label: 'Plan Emergencia',   detail: 'Propuesta activación escenarios',   ok: true },
            { label: 'Archivo Técnico',   detail: 'Informes y evidencias',             ok: true },
            { label: 'Mantenimiento',     detail: 'Incidencias por fallo sensor',      ok: true },
          ].map(item => (
            <div key={item.label} className="flex items-center gap-2 p-3 rounded-lg border border-slate-100 bg-slate-50">
              <span className={`w-2 h-2 rounded-full flex-shrink-0 ${item.ok ? 'bg-emerald-500' : 'bg-red-500'}`} />
              <div>
                <p className="text-xs font-bold text-slate-700">{item.label}</p>
                <p className="text-xs text-slate-500">{item.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
