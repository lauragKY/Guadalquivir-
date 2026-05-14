import React from 'react';
import { AlertTriangle, CheckCircle, Clock, Activity, Droplets, CloudRain, Zap, Radio, ArrowRight, TrendingUp } from 'lucide-react';
import { Dam } from '../../types';
import type { EmergencyState, Indicator } from './types';
import { SCENARIO_LABELS, SCENARIO_COLORS, CAUSE_LABELS } from './types';

interface Props {
  dam: Dam;
  state: EmergencyState;
  indicators: Indicator[];
  onReview: () => void;
}

const statusConfig = {
  superado:            { label: 'Superado',              icon: AlertTriangle, cls: 'text-red-600',    badge: 'bg-red-100 text-red-700 border-red-200' },
  pendiente_validacion:{ label: 'Pendiente validación',  icon: Clock,         cls: 'text-amber-600',  badge: 'bg-amber-100 text-amber-700 border-amber-200' },
  normal:              { label: 'Normal',                 icon: CheckCircle,   cls: 'text-emerald-600',badge: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
  no_aplica:           { label: 'No aplica',              icon: CheckCircle,   cls: 'text-slate-400',  badge: 'bg-slate-100 text-slate-500 border-slate-200' },
};

const indicatorIcons: Record<string, React.ReactNode> = {
  i1: <Droplets size={18} />,
  i2: <TrendingUp size={18} />,
  i3: <CloudRain size={18} />,
  i4: <Activity size={18} />,
  i5: <Zap size={18} />,
  i6: <AlertTriangle size={18} />,
  i7: <Radio size={18} />,
  i8: <Activity size={18} />,
};

export default function Screen1Situacion({ dam, state, indicators, onReview }: Props) {
  const scColors = SCENARIO_COLORS[state.proposedScenario];
  const alertCount = indicators.filter(i => i.status === 'superado').length;
  const pendingCount = indicators.filter(i => i.status === 'pendiente_validacion').length;

  return (
    <div className="space-y-6">
      {/* Header alerta */}
      {alertCount > 0 && (
        <div className={`rounded-xl border-2 ${scColors.border} ${scColors.bg} p-4 flex items-start gap-4`}>
          <div className="w-10 h-10 rounded-lg bg-yellow-400 flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="text-yellow-900" size={20} />
          </div>
          <div className="flex-1">
            <p className={`font-bold text-base ${scColors.text}`}>
              Sistema propone activar {SCENARIO_LABELS[state.proposedScenario]}
            </p>
            <p className={`text-sm mt-0.5 ${scColors.text} opacity-80`}>
              {alertCount} indicador{alertCount > 1 ? 'es' : ''} superado{alertCount > 1 ? 's' : ''} de umbral
              {pendingCount > 0 && ` · ${pendingCount} pendiente${pendingCount > 1 ? 's' : ''} de validación manual`}.
              Causa probable: <strong>{state.proposedCause ? CAUSE_LABELS[state.proposedCause] : '—'}</strong>.
            </p>
          </div>
          <button
            onClick={onReview}
            className="flex-shrink-0 flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-yellow-900 font-bold px-4 py-2 rounded-lg text-sm transition-colors"
          >
            Revisar propuesta <ArrowRight size={16} />
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Columna izquierda: datos de la presa */}
        <div className="xl:col-span-1 space-y-4">
          {/* Presa seleccionada */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">Presa seleccionada</h3>
            <p className="text-xl font-bold text-slate-900">{dam.name}</p>
            <div className="mt-3 space-y-1.5 text-sm text-slate-600">
              <div className="flex justify-between"><span className="text-slate-400">Código</span><span className="font-mono font-semibold">{dam.code}</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Río</span><span>{dam.river}</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Provincia</span><span>{dam.province}</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Municipio</span><span>{dam.municipality}</span></div>
            </div>
          </div>

          {/* Estado actual */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">Estado del Plan</h3>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-slate-400 mb-1">Escenario vigente</p>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-bold border ${SCENARIO_COLORS[state.scenario].badge} ${SCENARIO_COLORS[state.scenario].border}`}>
                  {SCENARIO_LABELS[state.scenario]}
                </span>
              </div>
              <div>
                <p className="text-xs text-slate-400 mb-1">Escenario propuesto</p>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-bold border ${scColors.badge} ${scColors.border}`}>
                  {SCENARIO_LABELS[state.proposedScenario]}
                </span>
              </div>
              <div>
                <p className="text-xs text-slate-400 mb-1">Causa probable</p>
                <p className="text-sm font-semibold text-slate-700">
                  {state.proposedCause ? CAUSE_LABELS[state.proposedCause] : '—'}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-400 mb-1">Confianza del sistema</p>
                <span className={`inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full ${
                  state.proposedConfidence === 'alta' ? 'bg-emerald-100 text-emerald-700' :
                  state.proposedConfidence === 'media' ? 'bg-amber-100 text-amber-700' :
                  'bg-slate-100 text-slate-600'
                }`}>
                  {state.proposedConfidence === 'alta' ? 'Alta' : state.proposedConfidence === 'media' ? 'Media' : 'Requiere validación'}
                </span>
              </div>
            </div>
          </div>

          {/* Indicadores resumen */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">Resumen de indicadores</h3>
            <div className="grid grid-cols-3 gap-3">
              <div className="text-center p-3 bg-red-50 rounded-lg border border-red-100">
                <p className="text-2xl font-bold text-red-600">{alertCount}</p>
                <p className="text-xs text-red-600 mt-0.5">Superados</p>
              </div>
              <div className="text-center p-3 bg-amber-50 rounded-lg border border-amber-100">
                <p className="text-2xl font-bold text-amber-600">{pendingCount}</p>
                <p className="text-xs text-amber-600 mt-0.5">Pendientes</p>
              </div>
              <div className="text-center p-3 bg-emerald-50 rounded-lg border border-emerald-100">
                <p className="text-2xl font-bold text-emerald-600">{indicators.filter(i => i.status === 'normal').length}</p>
                <p className="text-xs text-emerald-600 mt-0.5">Normales</p>
              </div>
            </div>
          </div>
        </div>

        {/* Columna derecha: tabla de indicadores */}
        <div className="xl:col-span-2">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
              <h3 className="font-bold text-slate-800 flex items-center gap-2">
                <Activity size={18} className="text-blue-600" />
                Indicadores de activación
              </h3>
              <span className="text-xs text-slate-500">Actualizado: {new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })} h</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    <th className="text-left px-4 py-3 font-semibold text-slate-600 text-xs uppercase tracking-wide">Indicador</th>
                    <th className="text-right px-4 py-3 font-semibold text-slate-600 text-xs uppercase tracking-wide">Valor actual</th>
                    <th className="text-right px-4 py-3 font-semibold text-slate-600 text-xs uppercase tracking-wide">Umbral</th>
                    <th className="text-center px-4 py-3 font-semibold text-slate-600 text-xs uppercase tracking-wide">Evaluación</th>
                    <th className="text-center px-4 py-3 font-semibold text-slate-600 text-xs uppercase tracking-wide">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {indicators.map((ind) => {
                    const s = statusConfig[ind.status];
                    const StatusIcon = s.icon;
                    return (
                      <tr key={ind.id} className={`transition-colors ${ind.status === 'superado' ? 'bg-red-50/40' : ind.status === 'pendiente_validacion' ? 'bg-amber-50/40' : 'hover:bg-slate-50'}`}>
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-2.5">
                            <span className={`${ind.status === 'superado' ? 'text-red-500' : ind.status === 'pendiente_validacion' ? 'text-amber-500' : 'text-slate-400'}`}>
                              {indicatorIcons[ind.id] || <Activity size={18} />}
                            </span>
                            <span className="font-medium text-slate-800">{ind.name}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3.5 text-right">
                          <span className={`font-bold ${ind.status === 'superado' ? 'text-red-700' : 'text-slate-700'}`}>{ind.value}</span>
                        </td>
                        <td className="px-4 py-3.5 text-right text-slate-500">{ind.threshold}</td>
                        <td className="px-4 py-3.5 text-center">
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                            ind.evaluation === 'Cuantitativa' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'
                          }`}>
                            {ind.evaluation}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 text-center">
                          <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border ${s.badge}`}>
                            <StatusIcon size={11} />
                            {s.label}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-4 flex justify-end">
            <button
              onClick={onReview}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-xl shadow-sm transition-colors text-sm"
            >
              Revisar propuesta de escenario <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
