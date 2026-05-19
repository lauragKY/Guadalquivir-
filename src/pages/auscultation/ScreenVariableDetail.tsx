import React, { useState } from 'react';
import { ArrowLeft, Activity, AlertTriangle, Info, Shield, Wrench, FileText, Database, Radio, Lock, ExternalLink } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Legend } from 'recharts';
import { VARIABLES, calcThresholdSE, calcThresholdE0, CURRENT_NE } from './mockData';
import { VarStatusBadge, SourceBadge } from './helpers';
import type { Screen } from './types';

interface Props { varId: string; onNavigate: (s: Screen, id?: string) => void; }

export default function ScreenVariableDetail({ varId, onNavigate }: Props) {
  const v = VARIABLES.find(x => x.id === varId) || VARIABLES[0];
  const [showModuleImpact, setShowModuleImpact] = useState(false);

  const chartData = v.trend_dates.map((date, i) => ({
    date,
    value: v.trend[i],
    threshold_se: v.threshold_se ? parseFloat(v.threshold_se.toFixed(1)) : undefined,
    threshold_e0: v.threshold_e0 ? parseFloat(v.threshold_e0.toFixed(1)) : undefined,
  }));

  const sc = v.status === 'scenario_0' ? { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-800', icon: <AlertTriangle size={18} className="text-red-600" /> }
    : v.status === 'extraordinary' ? { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-800', icon: <AlertTriangle size={18} className="text-amber-600" /> }
    : { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700', icon: <Activity size={18} className="text-emerald-600" /> };

  return (
    <div className="space-y-5">
      {/* Back */}
      <button onClick={() => onNavigate('variables')} className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 transition-colors">
        <ArrowLeft size={15} /> Volver a variables críticas
      </button>

      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-3 mb-1.5">
              <h2 className="text-lg font-bold text-slate-900">{v.name}</h2>
              <VarStatusBadge status={v.status} />
              {v.is_blocked && (
                <span className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-slate-700 text-white font-semibold">
                  <Lock size={10} /> Bloqueado
                </span>
              )}
            </div>
            <p className="text-sm text-slate-500 font-mono">{v.code}</p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => onNavigate('evaluation', v.id)} className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition-colors">
              Evaluar umbral
            </button>
            <button onClick={() => onNavigate('alerts')} className="px-3 py-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-lg transition-colors">
              Ver avisos
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Sensor', value: v.sensor_code },
            { label: 'Tipo sensor', value: v.sensor_type },
            { label: 'Unidad', value: v.unit },
            { label: 'Fuente de datos', value: <SourceBadge source={v.source} /> },
            { label: 'Última lectura', value: v.last_reading },
            { label: 'Variable dependiente', value: v.current_ne ? `NE = ${v.current_ne.toFixed(1)} m.s.n.m.` : 'Ninguna' },
            { label: 'Fuente NE', value: v.current_ne ? <SourceBadge source="SAIH" /> : '—' },
            { label: 'Dato manual', value: v.has_manual_data ? <span className="text-xs font-bold text-orange-600">Sí</span> : <span className="text-xs text-slate-500">No</span> },
          ].map(item => (
            <div key={item.label}>
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wide mb-0.5">{item.label}</p>
              <div className="text-sm font-medium text-slate-800">{item.value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Current state */}
      <div className={`rounded-xl border ${sc.border} ${sc.bg} p-5`}>
        <div className="flex items-start gap-3 mb-4">
          <div className="w-9 h-9 rounded-lg bg-white/60 flex items-center justify-center flex-shrink-0">{sc.icon}</div>
          <div className="flex-1">
            <p className={`font-bold ${sc.text}`}>{v.recommended_action}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'Valor actual Q', value: `${v.current_value.toFixed(1)} ${v.unit}`, highlight: true },
            { label: 'Nivel embalse NE', value: v.current_ne ? `${v.current_ne.toFixed(1)} m.s.n.m.` : '—', highlight: false },
            { label: 'Umbral S.E.', value: v.threshold_se ? `${v.threshold_se.toFixed(1)} ${v.unit}` : '—', highlight: false },
            { label: 'Umbral Esc. 0', value: v.threshold_e0 ? `${v.threshold_e0.toFixed(1)} ${v.unit}` : '—', highlight: false },
          ].map(item => (
            <div key={item.label} className="bg-white/70 rounded-lg p-3 text-center">
              <p className="text-xs text-slate-500 mb-0.5">{item.label}</p>
              <p className={`text-sm font-bold font-mono ${item.highlight ? sc.text : 'text-slate-800'}`}>{item.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Formulas */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-3">
        <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
          <Info size={14} className="text-blue-600" /> Fórmulas de umbral configuradas
        </h3>
        {[
          { level: 'Situación Extraordinaria', formula: v.formula_se, color: 'amber' },
          { level: 'Escenario 0',              formula: v.formula_e0, color: 'red' },
        ].map(item => (
          <div key={item.level} className={`rounded-xl border p-3 ${item.color === 'amber' ? 'bg-amber-50 border-amber-200' : 'bg-red-50 border-red-200'}`}>
            <p className={`text-xs font-bold uppercase tracking-wide mb-1 ${item.color === 'amber' ? 'text-amber-700' : 'text-red-700'}`}>{item.level}</p>
            <p className="text-sm font-mono font-bold text-slate-800">{item.formula}</p>
          </div>
        ))}
      </div>

      {/* Chart */}
      {chartData.length > 0 && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
          <p className="text-sm font-bold text-slate-700 mb-4">Evolución temporal — {v.unit}</p>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="date" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} domain={['auto', 'auto']} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} formatter={(v: number, name: string) => [`${v.toFixed(1)} ${v && name === 'value' ? '' : ''}`, name === 'value' ? 'Valor' : name]} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              {v.threshold_se && <ReferenceLine y={v.threshold_se} stroke="#f59e0b" strokeDasharray="5 3" label={{ value: 'Umbral S.E.', fontSize: 10, fill: '#b45309', position: 'right' }} />}
              {v.threshold_e0 && <ReferenceLine y={v.threshold_e0} stroke="#ef4444" strokeDasharray="5 3" label={{ value: 'Umbral E.0', fontSize: 10, fill: '#dc2626', position: 'right' }} />}
              <Line type="monotone" dataKey="value" name={`${v.name} (${v.unit})`} stroke="#2563eb" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Module impact card */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <button
          onClick={() => setShowModuleImpact(v => !v)}
          className="w-full flex items-center justify-between px-5 py-4 hover:bg-slate-50 transition-colors"
        >
          <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
            <Activity size={14} className="text-blue-600" /> Impacto en otros módulos
          </h3>
          <span className="text-xs text-slate-400">{showModuleImpact ? '▲' : '▼'}</span>
        </button>
        {showModuleImpact && (
          <div className="border-t border-slate-100 p-5 grid grid-cols-2 md:grid-cols-3 gap-3">
            {[
              { label: 'Plan de Emergencia', detail: v.status === 'scenario_0' ? 'Propuesta Esc. 0 pendiente' : v.status === 'extraordinary' ? 'S.E. notificada' : 'Sin acción', icon: <Shield size={14} className="text-red-600" />, action: () => onNavigate('emergency_comm') },
              { label: 'Explotación', detail: 'Contexto NE para cálculos', icon: <Database size={14} className="text-blue-600" />, action: null },
              { label: 'Archivo Técnico', detail: 'Evidencias de superaciones', icon: <FileText size={14} className="text-slate-600" />, action: null },
              { label: 'Mantenimiento', detail: v.has_manual_data ? 'Incidencia sensor generada' : 'Sin incidencia activa', icon: <Wrench size={14} className="text-amber-600" />, action: null },
              { label: 'DAMDATA', detail: 'Origen de la variable', icon: <Database size={14} className="text-blue-600" />, action: null },
              { label: 'SAIH', detail: 'Fuente NE para fórmulas', icon: <Radio size={14} className="text-teal-600" />, action: null },
            ].map(item => (
              <div
                key={item.label}
                onClick={item.action || undefined}
                className={`flex items-start gap-2 p-3 rounded-lg border border-slate-100 bg-slate-50 ${item.action ? 'cursor-pointer hover:bg-slate-100' : ''}`}
              >
                {item.icon}
                <div>
                  <p className="text-xs font-bold text-slate-700">{item.label}</p>
                  <p className="text-xs text-slate-500">{item.detail}</p>
                </div>
                {item.action && <ExternalLink size={11} className="ml-auto text-slate-400" />}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
