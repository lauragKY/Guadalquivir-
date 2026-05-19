import React, { useState } from 'react';
import { ArrowLeft, RefreshCw, CheckCircle, AlertTriangle, AlertOctagon, CreditCard as Edit3, Info } from 'lucide-react';
import { VARIABLES, calcThresholdSE, calcThresholdE0 } from './mockData';
import { VarStatusBadge } from './helpers';
import type { Screen } from './types';

interface Props { varId?: string; onNavigate: (s: Screen, id?: string) => void; }

export default function ScreenEvaluation({ varId, onNavigate }: Props) {
  const defaultVar = VARIABLES.find(v => v.id === varId) || VARIABLES[0];
  const [selectedVarId, setSelectedVarId] = useState(defaultVar.id);
  const v = VARIABLES.find(x => x.id === selectedVarId) || VARIABLES[0];

  const [qVal, setQVal] = useState(v.current_value.toString());
  const [neVal, setNeVal] = useState((v.current_ne || 383.6).toString());
  const [manualReason, setManualReason] = useState('');
  const [showManualForm, setShowManualForm] = useState(false);
  const [showIncoherentForm, setShowIncoherentForm] = useState(false);
  const [incoherentReason, setIncoherentReason] = useState('');
  const [validated, setValidated] = useState(false);
  const [recalculated, setRecalculated] = useState(false);

  const Q = parseFloat(qVal) || 0;
  const NE = parseFloat(neVal) || 0;
  const tSE = calcThresholdSE(NE);
  const tE0 = calcThresholdE0(NE);
  const marginSE = Q - tSE;
  const marginE0 = Q - tE0;
  const status = Q > tE0 ? 'scenario_0' : Q > tSE ? 'extraordinary' : 'normal';

  const handleRecalculate = () => setRecalculated(true);

  return (
    <div className="space-y-5">
      <button onClick={() => onNavigate('variable_detail', selectedVarId)} className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 transition-colors">
        <ArrowLeft size={15} /> Volver al detalle de variable
      </button>

      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-900">Evaluación de umbrales y fórmulas</h2>
        <select
          value={selectedVarId}
          onChange={e => { setSelectedVarId(e.target.value); setRecalculated(false); setValidated(false); }}
          className="px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {VARIABLES.map(x => <option key={x.id} value={x.id}>{x.name} ({x.code})</option>)}
        </select>
      </div>

      {/* Variable info */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-slate-900">{v.name}</h3>
            <p className="text-xs text-slate-500 font-mono">{v.code} · Sensor: {v.sensor_code}</p>
          </div>
          <VarStatusBadge status={status} />
        </div>

        {/* Formula display */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-5">
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
            <p className="text-xs font-bold text-amber-700 uppercase tracking-wide mb-1">Situación Extraordinaria</p>
            <p className="text-sm font-mono font-bold text-slate-800">{v.formula_se}</p>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <p className="text-xs font-bold text-red-700 uppercase tracking-wide mb-1">Escenario 0</p>
            <p className="text-sm font-mono font-bold text-slate-800">{v.formula_e0}</p>
          </div>
        </div>

        {/* Input fields */}
        <div className="grid grid-cols-2 gap-4 mb-5">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wide text-slate-500 mb-1.5">
              Valor Q actual ({v.unit})
            </label>
            <input
              type="number"
              value={qVal}
              onChange={e => { setQVal(e.target.value); setRecalculated(false); setValidated(false); }}
              className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {v.current_ne !== null && (
            <div>
              <label className="block text-xs font-bold uppercase tracking-wide text-slate-500 mb-1.5">
                Nivel embalse NE (m.s.n.m.) — SAIH
              </label>
              <input
                type="number"
                value={neVal}
                onChange={e => { setNeVal(e.target.value); setRecalculated(false); setValidated(false); }}
                className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}
        </div>

        {/* Calculation results */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
          {[
            { label: 'Umbral S.E. calculado', value: `${tSE.toFixed(2)} ${v.unit}`, color: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-200' },
            { label: 'Umbral Esc. 0 calculado', value: `${tE0.toFixed(2)} ${v.unit}`, color: 'text-red-700', bg: 'bg-red-50', border: 'border-red-200' },
            { label: 'Margen respecto S.E.', value: `${marginSE >= 0 ? '+' : ''}${marginSE.toFixed(2)} ${v.unit}`, color: marginSE > 0 ? 'text-red-600' : 'text-emerald-600', bg: marginSE > 0 ? 'bg-red-50' : 'bg-emerald-50', border: marginSE > 0 ? 'border-red-200' : 'border-emerald-200' },
            { label: 'Margen respecto Esc. 0', value: `${marginE0 >= 0 ? '+' : ''}${marginE0.toFixed(2)} ${v.unit}`, color: marginE0 > 0 ? 'text-red-700' : 'text-emerald-600', bg: marginE0 > 0 ? 'bg-red-50' : 'bg-emerald-50', border: marginE0 > 0 ? 'border-red-200' : 'border-emerald-200' },
          ].map(item => (
            <div key={item.label} className={`rounded-xl border ${item.border} ${item.bg} p-3 text-center`}>
              <p className="text-xs text-slate-500 mb-1">{item.label}</p>
              <p className={`text-sm font-bold font-mono ${item.color}`}>{item.value}</p>
            </div>
          ))}
        </div>

        {/* Status message */}
        {status === 'extraordinary' && (
          <div className="bg-amber-50 border border-amber-300 rounded-xl p-4 flex items-start gap-3 mb-5">
            <AlertTriangle size={18} className="text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-amber-900 text-sm">Situación Extraordinaria detectada</p>
              <p className="text-xs text-amber-700 mt-0.5">
                El valor actual de {v.name.toLowerCase()} ({Q.toFixed(1)} {v.unit}) supera el umbral configurado para Situación Extraordinaria ({tSE.toFixed(1)} {v.unit}).
                Se recomienda notificación inmediata al Director/a de Explotación.
              </p>
            </div>
          </div>
        )}
        {status === 'scenario_0' && (
          <div className="bg-red-50 border border-red-400 rounded-xl p-4 flex items-start gap-3 mb-5">
            <AlertOctagon size={18} className="text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-red-900 text-sm">Umbral de Escenario 0 superado</p>
              <p className="text-xs text-red-700 mt-0.5">
                El valor actual ({Q.toFixed(1)} {v.unit}) supera el umbral de Escenario 0 ({tE0.toFixed(1)} {v.unit}).
                Se activa la comunicación automática al módulo Plan de Emergencia para proponer activación del escenario.
              </p>
            </div>
          </div>
        )}
        {status === 'normal' && recalculated && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-start gap-3 mb-5">
            <CheckCircle size={18} className="text-emerald-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-emerald-800">
              Valor dentro de los límites normales. No se requiere acción.
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleRecalculate}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl transition-colors"
          >
            <RefreshCw size={15} /> Recalcular
          </button>
          <button
            onClick={() => { setValidated(true); }}
            className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold rounded-xl transition-colors"
          >
            <CheckCircle size={15} /> Validar resultado
          </button>
          <button
            onClick={() => setShowIncoherentForm(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-white text-sm font-bold rounded-xl transition-colors"
          >
            <AlertTriangle size={15} /> Marcar dato incoherente
          </button>
          <button
            onClick={() => setShowManualForm(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-slate-600 hover:bg-slate-700 text-white text-sm font-bold rounded-xl transition-colors"
          >
            <Edit3 size={15} /> Introducir dato manual
          </button>
        </div>

        {validated && (
          <div className="mt-3 bg-emerald-50 border border-emerald-200 rounded-xl p-3 flex items-center gap-2 text-sm text-emerald-800">
            <CheckCircle size={15} className="text-emerald-600" />
            Resultado validado por el usuario. Registrado en auditoría con hash de integridad.
          </div>
        )}
      </div>

      {/* Manual data form */}
      {showManualForm && (
        <div className="bg-orange-50 border border-orange-300 rounded-xl p-5 space-y-3">
          <h3 className="font-bold text-orange-900 text-sm flex items-center gap-2">
            <Edit3 size={14} /> Introducción de dato manual
          </h3>
          <p className="text-xs text-orange-700">El dato manual sustituirá al valor recibido de DAMDATA para el próximo ciclo de cálculo. Quedará registrado con usuario, fecha y motivo.</p>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wide text-slate-500 mb-1">Valor manual ({v.unit})</label>
              <input type="number" defaultValue={qVal} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-orange-500" />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wide text-slate-500 mb-1">Evidencia / adjunto</label>
              <input type="text" placeholder="Referencia documental..." className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wide text-slate-500 mb-1">Motivo (obligatorio)</label>
            <textarea value={manualReason} onChange={e => setManualReason(e.target.value)} rows={2} placeholder="Explique el motivo de la corrección manual..." className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none" />
          </div>
          <div className="flex gap-3">
            <button onClick={() => setShowManualForm(false)} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold rounded-xl transition-colors">Cancelar</button>
            <button onClick={() => setShowManualForm(false)} className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white text-sm font-bold rounded-xl transition-colors">Guardar dato manual</button>
          </div>
        </div>
      )}

      {/* Incoherent data form */}
      {showIncoherentForm && (
        <div className="bg-orange-50 border border-orange-300 rounded-xl p-5 space-y-3">
          <h3 className="font-bold text-orange-900 text-sm flex items-center gap-2">
            <AlertTriangle size={14} /> Marcar dato como incoherente
          </h3>
          <p className="text-xs text-orange-700">El dato será excluido del cálculo de umbrales. El sistema generará una incidencia en el módulo de Mantenimiento.</p>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wide text-slate-500 mb-1">Motivo (obligatorio)</label>
            <textarea value={incoherentReason} onChange={e => setIncoherentReason(e.target.value)} rows={2} placeholder="Describa por qué el dato es incoherente..." className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none" />
          </div>
          <div className="flex gap-3">
            <button onClick={() => setShowIncoherentForm(false)} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold rounded-xl transition-colors">Cancelar</button>
            <button onClick={() => setShowIncoherentForm(false)} className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white text-sm font-bold rounded-xl transition-colors">Marcar incoherente</button>
          </div>
        </div>
      )}
    </div>
  );
}
