import React, { useState } from 'react';
import { Bell, CheckCircle, XCircle, AlertTriangle, Shield, RefreshCw, ChevronDown, ChevronUp, ArrowRight } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { ALERTS, VARIABLES, calcThresholdSE, calcThresholdE0 } from './mockData';
import { AlertStatusBadge, VarStatusBadge } from './helpers';
import type { Screen, ThresholdAlert } from './types';

interface Props { onNavigate: (s: Screen, id?: string) => void; }

export default function ScreenAlerts({ onNavigate }: Props) {
  const [selected, setSelected] = useState<ThresholdAlert | null>(ALERTS[0]);
  const [confirming, setConfirming] = useState(false);
  const [rejecting, setRejecting] = useState(false);
  const [reason, setReason] = useState('');
  const [actionDone, setActionDone] = useState<string | null>(null);

  const v = selected ? VARIABLES.find(x => x.id === selected.variable_id) || VARIABLES[0] : null;

  const chartData = v ? v.trend_dates.map((date, i) => ({
    date,
    value: v.trend[i],
    threshold_se: v.threshold_se ?? undefined,
    threshold_e0: v.threshold_e0 ?? undefined,
  })) : [];

  const handleConfirm = () => {
    if (reason.trim()) { setActionDone('confirmed'); setConfirming(false); setReason(''); }
  };
  const handleReject = () => {
    if (reason.trim()) { setActionDone('rejected'); setRejecting(false); setReason(''); }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-900">Avisos al Director/a de Explotación</h2>
        <span className="text-xs text-slate-500">{ALERTS.filter(a => a.alert_status === 'pending').length} pendiente(s) de validación</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Alert list */}
        <div className="lg:col-span-1 space-y-2">
          {ALERTS.map(alert => (
            <button
              key={alert.id}
              onClick={() => { setSelected(alert); setActionDone(null); setConfirming(false); setRejecting(false); }}
              className={`w-full text-left rounded-xl border p-4 transition-all ${selected?.id === alert.id ? 'border-blue-400 bg-blue-50/50 shadow-sm' : 'border-slate-200 bg-white hover:bg-slate-50'}`}
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className="text-xs font-bold text-slate-800">{alert.variable_name}</span>
                <AlertStatusBadge status={alert.alert_status} />
              </div>
              <p className="text-xs text-slate-500 font-mono">{alert.date}</p>
              <p className="text-xs text-slate-600 mt-1">
                Medido: <span className="font-bold font-mono">{alert.measured_value.toFixed(1)}</span> · Umbral: <span className="font-mono">{alert.threshold_value.toFixed(1)}</span>
              </p>
              <p className="text-xs text-slate-500 mt-1 capitalize">{alert.proposed_status === 'extraordinary' ? 'S. Extraordinaria' : 'Escenario 0'}</p>
            </button>
          ))}
        </div>

        {/* Alert detail */}
        {selected && v && (
          <div className="lg:col-span-2 space-y-4">
            {/* Header */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-slate-900 text-base">{selected.variable_name}</h3>
                    <VarStatusBadge status={selected.proposed_status} />
                  </div>
                  <p className="text-xs text-slate-500 font-mono">{selected.date} · {selected.recipient}</p>
                </div>
                <AlertStatusBadge status={actionDone ?? selected.alert_status} />
              </div>

              {/* Calculation detail */}
              <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 mb-4">
                <p className="text-xs font-bold uppercase tracking-wide text-slate-500 mb-2">Justificación del cálculo</p>
                <p className="text-sm font-mono text-slate-800 mb-2">{selected.formula}</p>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: 'Valor medido', value: `${selected.measured_value.toFixed(1)} ${v.unit}`, color: 'text-red-600' },
                    { label: 'Umbral calculado', value: `${selected.threshold_value.toFixed(1)} ${v.unit}`, color: 'text-amber-700' },
                    { label: 'Exceso', value: `+${(selected.measured_value - selected.threshold_value).toFixed(1)} ${v.unit}`, color: 'text-red-700' },
                  ].map(item => (
                    <div key={item.label} className="text-center">
                      <p className="text-xs text-slate-500 mb-0.5">{item.label}</p>
                      <p className={`text-sm font-bold font-mono ${item.color}`}>{item.value}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Technical recommendation */}
              <div className={`rounded-xl border p-4 mb-4 ${selected.proposed_status === 'scenario_0' ? 'bg-red-50 border-red-200' : 'bg-amber-50 border-amber-200'}`}>
                <div className="flex items-start gap-2">
                  <AlertTriangle size={15} className={selected.proposed_status === 'scenario_0' ? 'text-red-600 mt-0.5 flex-shrink-0' : 'text-amber-600 mt-0.5 flex-shrink-0'} />
                  <div>
                    <p className={`text-xs font-bold uppercase tracking-wide mb-1 ${selected.proposed_status === 'scenario_0' ? 'text-red-700' : 'text-amber-700'}`}>Recomendación técnica</p>
                    <p className={`text-sm ${selected.proposed_status === 'scenario_0' ? 'text-red-800' : 'text-amber-800'}`}>
                      {selected.proposed_status === 'scenario_0'
                        ? 'El valor supera el umbral de Escenario 0. Se recomienda activar el Plan de Emergencia según procedimiento establecido en la Norma de Explotación. Comunicar inmediatamente al Organismo de Cuenca.'
                        : 'Se ha detectado Situación Extraordinaria. Confirmar o rechazar la situación. En caso de confirmación, activar vigilancia intensificada y documentar en el libro de explotación.'
                      }
                    </p>
                  </div>
                </div>
              </div>

              {/* Decision record (if already decided) */}
              {selected.decision_user && !actionDone && (
                <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 mb-4">
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-500 mb-1">Decisión registrada</p>
                  <p className="text-xs text-slate-700 font-semibold">{selected.decision_user} · {selected.decision_date}</p>
                  <p className="text-xs text-slate-600 mt-1">{selected.decision_reason}</p>
                </div>
              )}

              {actionDone && (
                <div className={`rounded-xl border p-3 mb-4 flex items-center gap-2 text-sm ${actionDone === 'confirmed' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-slate-50 border-slate-200 text-slate-700'}`}>
                  <CheckCircle size={15} className={actionDone === 'confirmed' ? 'text-emerald-600' : 'text-slate-500'} />
                  {actionDone === 'confirmed' ? 'Aviso confirmado. Registrado en auditoría con hash de integridad.' : 'Aviso rechazado. Registrado en auditoría.'}
                </div>
              )}

              {/* Action buttons */}
              {selected.alert_status === 'pending' && !actionDone && (
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => { setConfirming(true); setRejecting(false); }}
                    className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold rounded-xl transition-colors"
                  >
                    <CheckCircle size={14} /> Confirmar aviso
                  </button>
                  <button
                    onClick={() => { setRejecting(true); setConfirming(false); }}
                    className="flex items-center gap-2 px-4 py-2.5 bg-slate-600 hover:bg-slate-700 text-white text-sm font-bold rounded-xl transition-colors"
                  >
                    <XCircle size={14} /> Rechazar aviso
                  </button>
                  <button
                    onClick={() => onNavigate('data_quality')}
                    className="flex items-center gap-2 px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-white text-sm font-bold rounded-xl transition-colors"
                  >
                    <RefreshCw size={14} /> Solicitar revisión de dato
                  </button>
                  <button
                    onClick={() => onNavigate('emergency_comm')}
                    className="flex items-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white text-sm font-bold rounded-xl transition-colors"
                  >
                    <Shield size={14} /> Comunicar a Plan de Emergencia
                    <ArrowRight size={13} />
                  </button>
                </div>
              )}

              {/* Confirm form */}
              {confirming && (
                <div className="mt-4 bg-emerald-50 border border-emerald-200 rounded-xl p-4 space-y-3">
                  <p className="text-sm font-bold text-emerald-900">Confirmar Situación Extraordinaria</p>
                  <textarea
                    value={reason}
                    onChange={e => setReason(e.target.value)}
                    rows={2}
                    placeholder="Motivo de confirmación (obligatorio)..."
                    className="w-full px-3 py-2 border border-emerald-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                  />
                  <div className="flex gap-3">
                    <button onClick={() => setConfirming(false)} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold rounded-xl">Cancelar</button>
                    <button onClick={handleConfirm} disabled={!reason.trim()} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-300 text-white text-sm font-bold rounded-xl">Guardar confirmación</button>
                  </div>
                </div>
              )}

              {/* Reject form */}
              {rejecting && (
                <div className="mt-4 bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
                  <p className="text-sm font-bold text-slate-800">Rechazar aviso</p>
                  <textarea
                    value={reason}
                    onChange={e => setReason(e.target.value)}
                    rows={2}
                    placeholder="Motivo del rechazo (obligatorio)..."
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-500 resize-none"
                  />
                  <div className="flex gap-3">
                    <button onClick={() => setRejecting(false)} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold rounded-xl">Cancelar</button>
                    <button onClick={handleReject} disabled={!reason.trim()} className="px-4 py-2 bg-slate-700 hover:bg-slate-800 disabled:bg-slate-400 text-white text-sm font-bold rounded-xl">Guardar rechazo</button>
                  </div>
                </div>
              )}
            </div>

            {/* Trend chart */}
            {chartData.length > 0 && (
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
                <p className="text-sm font-bold text-slate-700 mb-4">Gráfico de tendencia — {v.name} ({v.unit})</p>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                    <YAxis tick={{ fontSize: 10 }} domain={['auto', 'auto']} />
                    <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                    {v.threshold_se && <ReferenceLine y={v.threshold_se} stroke="#f59e0b" strokeDasharray="5 3" label={{ value: 'Umbral S.E.', fontSize: 10, fill: '#b45309', position: 'right' }} />}
                    {v.threshold_e0 && <ReferenceLine y={v.threshold_e0} stroke="#ef4444" strokeDasharray="5 3" label={{ value: 'Umbral E.0', fontSize: 10, fill: '#dc2626', position: 'right' }} />}
                    <Line type="monotone" dataKey="value" name={v.name} stroke="#2563eb" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
