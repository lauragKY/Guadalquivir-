import React, { useState } from 'react';
import { CheckCircle2, Clock, PlayCircle, MinusCircle, Paperclip, MessageSquare, ChevronDown, ChevronUp, AlertTriangle } from 'lucide-react';
import type { EmergencyAction, ActionStatus, EmergencyState } from './types';
import { SCENARIO_LABELS } from './types';

interface Props {
  state: EmergencyState;
  actions: EmergencyAction[];
  onUpdateAction: (id: string, update: Partial<EmergencyAction>) => void;
  onNext: () => void;
}

const statusConfig: Record<ActionStatus, { label: string; cls: string; badge: string; icon: React.ReactNode }> = {
  pendiente:  { label: 'Pendiente',  cls: 'text-slate-500', badge: 'bg-slate-100 text-slate-600 border-slate-200',      icon: <Clock size={13} /> },
  en_curso:   { label: 'En curso',   cls: 'text-blue-600',  badge: 'bg-blue-100 text-blue-700 border-blue-200',          icon: <PlayCircle size={13} /> },
  realizada:  { label: 'Realizada',  cls: 'text-emerald-600',badge: 'bg-emerald-100 text-emerald-700 border-emerald-200',icon: <CheckCircle2 size={13} /> },
  no_aplica:  { label: 'No aplica',  cls: 'text-slate-400', badge: 'bg-slate-50 text-slate-400 border-slate-100',        icon: <MinusCircle size={13} /> },
};

function ActionRow({ action, onUpdate }: { action: EmergencyAction; onUpdate: (u: Partial<EmergencyAction>) => void }) {
  const [expanded, setExpanded] = useState(false);
  const [obs, setObs] = useState(action.observations);
  const s = statusConfig[action.status];

  return (
    <div className={`border rounded-xl overflow-hidden transition-all ${
      action.status === 'realizada' ? 'border-emerald-200 bg-emerald-50/30' :
      action.status === 'en_curso'  ? 'border-blue-200 bg-blue-50/30' :
      'border-slate-200 bg-white'
    }`}>
      <div className="px-4 py-3.5 flex items-start gap-3">
        {/* Número */}
        <div className={`w-7 h-7 rounded-lg flex-shrink-0 flex items-center justify-center text-xs font-bold mt-0.5 ${
          action.status === 'realizada' ? 'bg-emerald-100 text-emerald-700' :
          action.status === 'en_curso'  ? 'bg-blue-100 text-blue-700' :
          'bg-slate-100 text-slate-500'
        }`}>
          {action.status === 'realizada' ? <CheckCircle2 size={14} /> : action.num}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 flex-wrap">
            <div>
              <p className="font-semibold text-sm text-slate-900">{action.name}</p>
              <div className="flex items-center gap-3 mt-1 flex-wrap">
                <span className="text-xs text-slate-500">{action.responsible}</span>
                <span className="text-xs font-mono bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">{action.procedure}</span>
                <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${
                  action.type === 'inspeccion' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'
                }`}>
                  {action.type === 'inspeccion' ? 'Inspección' : 'Ejecución'}
                </span>
              </div>
            </div>
            <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full border flex-shrink-0 ${s.badge}`}>
              {s.icon}{s.label}
            </span>
          </div>
        </div>

        <button onClick={() => setExpanded(!expanded)} className="text-slate-400 hover:text-slate-600 mt-0.5 flex-shrink-0">
          {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
      </div>

      {expanded && (
        <div className="border-t border-slate-100 px-4 py-4 bg-slate-50/50 space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-xs">
            <div><span className="text-slate-400 block mb-0.5">Responsable</span><span className="font-medium text-slate-700">{action.responsible}</span></div>
            <div><span className="text-slate-400 block mb-0.5">Personal necesario</span><span className="font-medium text-slate-700">{action.personnel}</span></div>
            <div><span className="text-slate-400 block mb-0.5">Medios materiales</span><span className="font-medium text-slate-700">{action.resources}</span></div>
            {action.startedAt && <div><span className="text-slate-400 block mb-0.5">Inicio</span><span className="font-medium text-slate-700">{action.startedAt} h</span></div>}
            {action.completedAt && <div><span className="text-slate-400 block mb-0.5">Finalización</span><span className="font-medium text-slate-700">{action.completedAt} h</span></div>}
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wide text-slate-500 block mb-1.5">Observaciones</label>
            <textarea
              value={obs}
              onChange={e => setObs(e.target.value)}
              onBlur={() => onUpdate({ observations: obs })}
              rows={2}
              placeholder="Registrar observaciones..."
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none bg-white"
            />
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {action.status !== 'en_curso' && action.status !== 'realizada' && (
              <button
                onClick={() => onUpdate({ status: 'en_curso', startedAt: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }) })}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition-colors"
              >
                <PlayCircle size={13} /> Iniciar
              </button>
            )}
            {action.status !== 'realizada' && (
              <button
                onClick={() => onUpdate({ status: 'realizada', completedAt: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }) })}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition-colors"
              >
                <CheckCircle2 size={13} /> Marcar realizada
              </button>
            )}
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-semibold rounded-lg transition-colors">
              <Paperclip size={13} /> Adjuntar evidencia
            </button>
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-semibold rounded-lg transition-colors">
              <MessageSquare size={13} /> Registrar incidencia
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Screen3Actuaciones({ state, actions, onUpdateAction, onNext }: Props) {
  const inspeccion = actions.filter(a => a.type === 'inspeccion');
  const ejecucion  = actions.filter(a => a.type === 'ejecucion');
  const done = actions.filter(a => a.status === 'realizada').length;
  const inProgress = actions.filter(a => a.status === 'en_curso').length;

  if (!state.active) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <AlertTriangle className="text-amber-400 mb-4" size={48} />
        <p className="text-slate-700 font-semibold text-lg mb-2">Escenario no declarado</p>
        <p className="text-slate-500 text-sm">Debe declarar un escenario en la pantalla anterior para ver las actuaciones recomendadas.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Cabecera */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex items-center justify-between gap-4 flex-wrap">
        <div>
          <p className="text-xs text-slate-500 mb-0.5">Actuaciones para</p>
          <p className="font-bold text-slate-900">
            {SCENARIO_LABELS[state.scenario]} · {state.cause ? { hidrologica: 'Eventos hidrológicos', auscultacion: 'Auscultación', sismo: 'Sismo', inspeccion: 'Inspección visual', equipos_aviso: 'Equipos de aviso', presa_aguas_arriba: 'Presa aguas arriba', otro: 'Otro' }[state.cause] : ''}
          </p>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <div className="text-center">
            <p className="text-xl font-bold text-emerald-600">{done}</p>
            <p className="text-xs text-slate-500">Realizadas</p>
          </div>
          <div className="text-center">
            <p className="text-xl font-bold text-blue-600">{inProgress}</p>
            <p className="text-xs text-slate-500">En curso</p>
          </div>
          <div className="text-center">
            <p className="text-xl font-bold text-slate-500">{actions.length - done - inProgress}</p>
            <p className="text-xs text-slate-500">Pendientes</p>
          </div>
        </div>
      </div>

      {/* Barra de progreso */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
        <div className="flex justify-between text-xs text-slate-500 mb-1.5">
          <span>Progreso de actuaciones</span>
          <span>{done}/{actions.length} realizadas</span>
        </div>
        <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-emerald-500 rounded-full transition-all duration-500"
            style={{ width: `${(done / actions.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Actuaciones de inspección */}
      {inspeccion.length > 0 && (
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-amber-700 mb-3 flex items-center gap-2">
            <span className="w-5 h-5 rounded bg-amber-100 flex items-center justify-center text-amber-600 text-xs">I</span>
            Actuaciones de inspección
          </h3>
          <div className="space-y-3">
            {inspeccion.map(a => (
              <ActionRow key={a.id} action={a} onUpdate={u => onUpdateAction(a.id, u)} />
            ))}
          </div>
        </div>
      )}

      {/* Actuaciones de ejecución */}
      {ejecucion.length > 0 && (
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-blue-700 mb-3 flex items-center gap-2">
            <span className="w-5 h-5 rounded bg-blue-100 flex items-center justify-center text-blue-600 text-xs">E</span>
            Actuaciones de ejecución
          </h3>
          <div className="space-y-3">
            {ejecucion.map(a => (
              <ActionRow key={a.id} action={a} onUpdate={u => onUpdateAction(a.id, u)} />
            ))}
          </div>
        </div>
      )}

      <div className="flex justify-end">
        <button onClick={onNext} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-xl text-sm transition-colors">
          Ir a Comunicaciones →
        </button>
      </div>
    </div>
  );
}
