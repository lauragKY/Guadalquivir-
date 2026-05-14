import React, { useState } from 'react';
import { CheckCircle, CreditCard as Edit3, XCircle, ShieldAlert, ChevronDown, AlertTriangle, FileText } from 'lucide-react';
import type { EmergencyState, Indicator, EmergencyScenario, EmergencyCause } from './types';
import { SCENARIO_LABELS, SCENARIO_COLORS, CAUSE_LABELS } from './types';

interface Props {
  state: EmergencyState;
  indicators: Indicator[];
  onDeclare: (update: Partial<EmergencyState>) => void;
  onNext: () => void;
}

const scenarios: EmergencyScenario[] = ['normalidad', 'extraordinaria', 'escenario_0', 'escenario_1', 'escenario_2', 'escenario_3'];
const causes: EmergencyCause[] = ['hidrologica', 'auscultacion', 'sismo', 'inspeccion', 'equipos_aviso', 'presa_aguas_arriba', 'otro'];

export default function Screen2Declaracion({ state, indicators, onDeclare, onNext }: Props) {
  const [mode, setMode] = useState<'review' | 'modify' | 'manual' | 'declared'>('review');
  const [selectedScenario, setSelectedScenario] = useState<EmergencyScenario>(state.proposedScenario);
  const [selectedCause, setSelectedCause] = useState<EmergencyCause>(state.proposedCause || 'hidrologica');
  const [reason, setReason] = useState('');
  const [observations, setObservations] = useState('');
  const [confirmed, setConfirmed] = useState(false);

  const triggeredIndicators = indicators.filter(i => i.status === 'superado');
  const scColors = SCENARIO_COLORS[state.proposedScenario];

  const handleAccept = () => {
    onDeclare({
      scenario: state.proposedScenario,
      cause: state.proposedCause,
      active: true,
      declaredAt: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
      declaredBy: 'Director/a del Plan',
      declarationReason: 'Propuesta automática aceptada.',
    });
    setMode('declared');
  };

  const handleDeclare = () => {
    if (!reason.trim() || !confirmed) return;
    onDeclare({
      scenario: selectedScenario,
      cause: selectedCause,
      active: true,
      declaredAt: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
      declaredBy: 'Director/a del Plan',
      declarationReason: reason,
    });
    setMode('declared');
  };

  if (mode === 'declared' || state.active) {
    const sc = state.active ? state.scenario : selectedScenario;
    const col = SCENARIO_COLORS[sc];
    return (
      <div className="space-y-6">
        <div className={`rounded-xl border-2 ${col.border} ${col.bg} p-6 flex items-start gap-4`}>
          <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center flex-shrink-0">
            <CheckCircle className="text-emerald-600" size={26} />
          </div>
          <div className="flex-1">
            <p className={`text-lg font-bold ${col.text}`}>
              {SCENARIO_LABELS[sc]} declarado formalmente
            </p>
            <p className={`text-sm mt-1 ${col.text} opacity-80`}>
              Declarado a las {state.declaredAt} h por {state.declaredBy}.
              Causa: <strong>{state.cause ? CAUSE_LABELS[state.cause] : '—'}</strong>.
            </p>
            {state.declarationReason && (
              <p className={`text-sm mt-1 ${col.text} opacity-70 italic`}>"{state.declarationReason}"</p>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <h3 className="font-bold text-slate-800 mb-3">Resumen de la declaración</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div><span className="text-slate-400">Escenario</span><p className="font-semibold mt-0.5">{SCENARIO_LABELS[sc]}</p></div>
            <div><span className="text-slate-400">Causa</span><p className="font-semibold mt-0.5">{state.cause ? CAUSE_LABELS[state.cause] : '—'}</p></div>
            <div><span className="text-slate-400">Hora declaración</span><p className="font-semibold mt-0.5">{state.declaredAt} h</p></div>
            <div><span className="text-slate-400">Declarado por</span><p className="font-semibold mt-0.5">{state.declaredBy}</p></div>
            <div className="col-span-2"><span className="text-slate-400">Motivo</span><p className="font-semibold mt-0.5">{state.declarationReason}</p></div>
          </div>
        </div>

        <div className="flex justify-end">
          <button onClick={onNext} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-xl text-sm transition-colors">
            Ver actuaciones recomendadas →
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Propuesta automática */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 bg-slate-50">
          <h3 className="font-bold text-slate-800 flex items-center gap-2">
            <ShieldAlert size={18} className="text-blue-600" />
            Propuesta automática del sistema
          </h3>
        </div>
        <div className="p-5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
            <div className={`rounded-xl p-4 border-2 ${scColors.border} ${scColors.bg}`}>
              <p className="text-xs font-bold uppercase tracking-wide text-slate-500 mb-1">Escenario propuesto</p>
              <p className={`text-xl font-bold ${scColors.text}`}>{SCENARIO_LABELS[state.proposedScenario]}</p>
            </div>
            <div className="rounded-xl p-4 border border-slate-200 bg-slate-50">
              <p className="text-xs font-bold uppercase tracking-wide text-slate-500 mb-1">Causa propuesta</p>
              <p className="text-base font-semibold text-slate-800">{state.proposedCause ? CAUSE_LABELS[state.proposedCause] : '—'}</p>
            </div>
            <div className="rounded-xl p-4 border border-slate-200 bg-slate-50">
              <p className="text-xs font-bold uppercase tracking-wide text-slate-500 mb-1">Confianza</p>
              <span className={`inline-flex items-center gap-1 text-sm font-bold px-2.5 py-1 rounded-full ${
                state.proposedConfidence === 'alta' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
              }`}>
                {state.proposedConfidence === 'alta' ? '● Alta' : '● Media'}
              </span>
            </div>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-slate-500 mb-2">Indicadores que originan la propuesta</p>
            <div className="space-y-2">
              {triggeredIndicators.map(ind => (
                <div key={ind.id} className="flex items-center gap-3 text-sm bg-red-50 border border-red-100 rounded-lg px-3 py-2.5">
                  <AlertTriangle size={14} className="text-red-500 flex-shrink-0" />
                  <span className="font-medium text-slate-800 flex-1">{ind.name}</span>
                  <span className="text-red-600 font-bold">{ind.value}</span>
                  <span className="text-slate-400 text-xs">umbral: {ind.threshold}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bloque de decisión */}
      {mode === 'review' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
          <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
            <FileText size={18} className="text-blue-600" />
            Decisión del Director/a del Plan
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <button
              onClick={handleAccept}
              className="flex flex-col items-center gap-2 p-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition-colors text-sm"
            >
              <CheckCircle size={22} />
              Aceptar propuesta
            </button>
            <button
              onClick={() => setMode('modify')}
              className="flex flex-col items-center gap-2 p-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold transition-colors text-sm"
            >
              <Edit3 size={22} />
              Modificar escenario
            </button>
            <button
              onClick={() => setMode('manual')}
              className="flex flex-col items-center gap-2 p-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition-colors text-sm"
            >
              <ShieldAlert size={22} />
              Declarar manualmente
            </button>
            <button
              className="flex flex-col items-center gap-2 p-4 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold transition-colors text-sm"
            >
              <XCircle size={22} />
              Rechazar propuesta
            </button>
          </div>
        </div>
      )}

      {/* Formulario modificar / declarar manual */}
      {(mode === 'modify' || mode === 'manual') && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
            <h3 className="font-bold text-slate-800">
              {mode === 'modify' ? 'Modificar propuesta' : 'Declaración manual de escenario'}
            </h3>
            <button onClick={() => setMode('review')} className="text-slate-400 hover:text-slate-600 text-sm">← Volver</button>
          </div>
          <div className="p-5 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wide text-slate-500 mb-1.5">Escenario declarado *</label>
                <div className="relative">
                  <select
                    value={selectedScenario}
                    onChange={e => setSelectedScenario(e.target.value as EmergencyScenario)}
                    className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white pr-8"
                  >
                    {scenarios.map(s => (
                      <option key={s} value={s}>{SCENARIO_LABELS[s]}</option>
                    ))}
                  </select>
                  <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wide text-slate-500 mb-1.5">Causa *</label>
                <div className="relative">
                  <select
                    value={selectedCause}
                    onChange={e => setSelectedCause(e.target.value as EmergencyCause)}
                    className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white pr-8"
                  >
                    {causes.map(c => (
                      <option key={c} value={c}>{CAUSE_LABELS[c]}</option>
                    ))}
                  </select>
                  <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wide text-slate-500 mb-1.5">Motivo de la decisión *</label>
              <textarea
                value={reason}
                onChange={e => setReason(e.target.value)}
                rows={3}
                placeholder="Describa el motivo de la declaración o modificación..."
                className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wide text-slate-500 mb-1.5">Observaciones adicionales</label>
              <textarea
                value={observations}
                onChange={e => setObservations(e.target.value)}
                rows={2}
                placeholder="Observaciones opcionales..."
                className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wide text-slate-500 mb-1.5">Documentación / evidencia (opcional)</label>
              <div className="border-2 border-dashed border-slate-200 rounded-lg p-4 text-center text-sm text-slate-400 hover:border-blue-300 transition-colors cursor-pointer">
                Arrastrar archivo o hacer clic para adjuntar
              </div>
            </div>

            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={confirmed}
                onChange={e => setConfirmed(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-slate-700 font-medium">
                Declaro formalmente el escenario seleccionado bajo mi responsabilidad como Director/a del Plan de Emergencia.
              </span>
            </label>

            <div className="flex justify-end gap-3 pt-2 border-t border-slate-100">
              <button onClick={() => setMode('review')} className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                Cancelar
              </button>
              <button
                onClick={handleDeclare}
                disabled={!reason.trim() || !confirmed}
                className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold rounded-lg text-sm transition-colors"
              >
                <ShieldAlert size={16} />
                Declarar escenario
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
