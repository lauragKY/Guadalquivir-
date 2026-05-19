import React, { useState } from 'react';
import { CheckCircle, XCircle, AlertTriangle, Lock, Unlock, FileText, User, Clock } from 'lucide-react';
import { VARIABLES, CURRENT_DATE, CURRENT_TIME } from './mockData';
import { VarStatusBadge } from './helpers';
import type { Screen } from './types';

interface Props { onNavigate: (s: Screen, id?: string) => void; }

interface PendingValidation {
  id: string;
  variable_id: string;
  variable_name: string;
  type: 'threshold' | 'manual_data' | 'incoherent' | 'sensor_change';
  description: string;
  date: string;
  requested_by: string;
  value?: string;
  priority: 'high' | 'medium' | 'low';
}

const PENDING: PendingValidation[] = [
  { id: 'pv1', variable_id: 'v1', variable_name: 'Filtración Total',    type: 'threshold',      description: 'Superación Situación Extraordinaria Q=212,7 lts/min (umbral 169,1). Pendiente confirmación Director/a.', date: `${CURRENT_DATE} 08:43`, requested_by: 'Sistema SIPRESAS',       value: '212,7 lts/min', priority: 'high' },
  { id: 'pv2', variable_id: 'v4', variable_name: 'Caudal Drenaje',      type: 'manual_data',    description: 'Dato manual 45,1 lts/min introducido por técnico. Requiere validación supervisor.', date: '18/05/2026 15:30', requested_by: 'Técnico Auscultación', value: '45,1 lts/min',  priority: 'medium' },
  { id: 'pv3', variable_id: 'v2', variable_name: 'Presión Intersticial', type: 'sensor_change',  description: 'Cambio detectado en patrón de lectura del sensor PIEZ-014. Verificar calibración.', date: '17/05/2026 09:00', requested_by: 'Sistema SIPRESAS',       value: '34,2 m.c.a.',   priority: 'low' },
];

const TYPE_CFG = {
  threshold:     { label: 'Superación umbral', color: 'bg-red-100 text-red-700 border-red-200' },
  manual_data:   { label: 'Dato manual',       color: 'bg-orange-100 text-orange-700 border-orange-200' },
  incoherent:    { label: 'Incoherente',        color: 'bg-amber-100 text-amber-700 border-amber-200' },
  sensor_change: { label: 'Cambio sensor',     color: 'bg-blue-100 text-blue-700 border-blue-200' },
};

const PRIORITY_CFG = {
  high:   { label: 'Alta',  color: 'bg-red-50 text-red-700 border-red-200' },
  medium: { label: 'Media', color: 'bg-amber-50 text-amber-700 border-amber-200' },
  low:    { label: 'Baja',  color: 'bg-slate-100 text-slate-600 border-slate-200' },
};

export default function ScreenValidation({ onNavigate }: Props) {
  const [selected, setSelected] = useState<PendingValidation>(PENDING[0]);
  const [reason, setReason] = useState('');
  const [decisions, setDecisions] = useState<Record<string, 'approved' | 'rejected'>>({});

  const handleDecision = (id: string, decision: 'approved' | 'rejected') => {
    if (!reason.trim()) return;
    setDecisions(prev => ({ ...prev, [id]: decision }));
    setReason('');
  };

  const decided = decisions[selected.id];
  const v = VARIABLES.find(x => x.id === selected.variable_id);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-900">Validación manual y control de seguridad</h2>
        <span className="text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-full">
          {PENDING.filter(p => !decisions[p.id]).length} pendiente(s)
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left: pending list */}
        <div className="lg:col-span-1 space-y-2">
          {PENDING.map(item => {
            const d = decisions[item.id];
            return (
              <button
                key={item.id}
                onClick={() => setSelected(item)}
                className={`w-full text-left rounded-xl border p-4 transition-all ${selected.id === item.id ? 'border-blue-400 bg-blue-50/50 shadow-sm' : 'border-slate-200 bg-white hover:bg-slate-50'} ${d ? 'opacity-60' : ''}`}
              >
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <span className={`text-xs px-2 py-0.5 rounded border font-semibold ${TYPE_CFG[item.type].color}`}>
                    {TYPE_CFG[item.type].label}
                  </span>
                  <span className={`text-xs px-2 py-0.5 rounded border font-semibold ${PRIORITY_CFG[item.priority].color}`}>
                    {PRIORITY_CFG[item.priority].label}
                  </span>
                </div>
                <p className="text-xs font-bold text-slate-800 mb-0.5">{item.variable_name}</p>
                <p className="text-xs text-slate-500 font-mono">{item.date}</p>
                {d && (
                  <div className={`mt-2 flex items-center gap-1 text-xs font-bold ${d === 'approved' ? 'text-emerald-600' : 'text-slate-500'}`}>
                    {d === 'approved' ? <CheckCircle size={11} /> : <XCircle size={11} />}
                    {d === 'approved' ? 'Aprobado' : 'Rechazado'}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Right: detail */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-xs px-2 py-0.5 rounded border font-semibold ${TYPE_CFG[selected.type].color}`}>
                    {TYPE_CFG[selected.type].label}
                  </span>
                  <span className={`text-xs px-2 py-0.5 rounded border font-semibold ${PRIORITY_CFG[selected.priority].color}`}>
                    Prioridad {PRIORITY_CFG[selected.priority].label}
                  </span>
                </div>
                <h3 className="font-bold text-slate-900 text-base">{selected.variable_name}</h3>
              </div>
              {v && <VarStatusBadge status={v.status} />}
            </div>

            <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 mb-4">
              <p className="text-xs font-bold uppercase tracking-wide text-slate-500 mb-2">Descripción del punto de validación</p>
              <p className="text-sm text-slate-800">{selected.description}</p>
              <div className="mt-3 flex gap-6 text-xs text-slate-500">
                <span className="flex items-center gap-1"><Clock size={11} /> {selected.date}</span>
                <span className="flex items-center gap-1"><User size={11} /> Solicitado por: {selected.requested_by}</span>
                {selected.value && <span className="flex items-center gap-1"><FileText size={11} /> Valor: <strong className="text-slate-700 font-mono">{selected.value}</strong></span>}
              </div>
            </div>

            {/* Security checklist */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4">
              <p className="text-xs font-bold uppercase tracking-wide text-blue-700 mb-3">Lista de verificación de seguridad</p>
              <div className="space-y-2">
                {[
                  'El dato o situación ha sido revisado en el contexto del nivel del embalse',
                  'Se ha verificado la consistencia con lecturas de otros sensores',
                  'Se ha consultado el histórico reciente de la variable',
                  selected.type === 'manual_data' ? 'La corrección manual está justificada documentalmente' : 'No existen anomalías en el sensor reportadas en el módulo de Mantenimiento',
                  'La decisión tomada es coherente con la Norma de Explotación vigente',
                ].map((check, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <CheckCircle size={13} className="text-blue-500 mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-blue-800">{check}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Integrity lock indicator */}
            <div className="flex items-center gap-2 p-3 bg-slate-50 border border-slate-200 rounded-xl mb-4">
              <Lock size={14} className="text-slate-500 flex-shrink-0" />
              <p className="text-xs text-slate-600">
                Una vez registrada la decisión, el registro quedará sellado con hash de integridad y no podrá ser modificado. Solo se podrá añadir una aclaración en campo "observaciones posteriores".
              </p>
            </div>

            {decided ? (
              <div className={`rounded-xl border p-4 flex items-center gap-3 ${decided === 'approved' ? 'bg-emerald-50 border-emerald-200' : 'bg-slate-50 border-slate-200'}`}>
                {decided === 'approved' ? <CheckCircle size={18} className="text-emerald-600" /> : <XCircle size={18} className="text-slate-500" />}
                <div>
                  <p className={`font-bold text-sm ${decided === 'approved' ? 'text-emerald-900' : 'text-slate-700'}`}>
                    {decided === 'approved' ? 'Punto de validación aprobado' : 'Punto de validación rechazado'}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">Registrado en auditoría · {CURRENT_DATE} {CURRENT_TIME}</p>
                </div>
              </div>
            ) : (
              <>
                <div className="mb-3">
                  <label className="block text-xs font-bold uppercase tracking-wide text-slate-500 mb-1.5">Motivo de la decisión (obligatorio)</label>
                  <textarea
                    value={reason}
                    onChange={e => setReason(e.target.value)}
                    rows={2}
                    placeholder="Registre el razonamiento técnico de su decisión..."
                    className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => handleDecision(selected.id, 'approved')}
                    disabled={!reason.trim()}
                    className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-300 text-white text-sm font-bold rounded-xl transition-colors"
                  >
                    <CheckCircle size={14} /> Aprobar y registrar
                  </button>
                  <button
                    onClick={() => handleDecision(selected.id, 'rejected')}
                    disabled={!reason.trim()}
                    className="flex items-center gap-2 px-4 py-2.5 bg-slate-700 hover:bg-slate-800 disabled:bg-slate-400 text-white text-sm font-bold rounded-xl transition-colors"
                  >
                    <XCircle size={14} /> Rechazar y registrar
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
