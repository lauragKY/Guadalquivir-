import React from 'react';
import { Download, Filter, Bot, User, Send, Wrench, CheckCircle2 } from 'lucide-react';
import type { TimelineEvent } from './types';

interface Props {
  timeline: TimelineEvent[];
}

const typeConfig = {
  sistema:       { label: 'Sistema',       icon: Bot,          cls: 'bg-slate-100 text-slate-600',     line: 'border-slate-300' },
  decision:      { label: 'Decisión',      icon: User,         cls: 'bg-blue-100 text-blue-700',       line: 'border-blue-400' },
  comunicacion:  { label: 'Comunicación',  icon: Send,         cls: 'bg-emerald-100 text-emerald-700', line: 'border-emerald-400' },
  actuacion:     { label: 'Actuación',     icon: Wrench,       cls: 'bg-amber-100 text-amber-700',     line: 'border-amber-400' },
};

const resultConfig: Record<string, string> = {
  'Propuesta Escenario 0':   'bg-yellow-100 text-yellow-800',
  'Propuesta confirmada':    'bg-yellow-100 text-yellow-800',
  'Confianza: Alta':         'bg-emerald-100 text-emerald-700',
  'Propuesta aceptada':      'bg-emerald-100 text-emerald-700',
  'Emergencia activa':       'bg-red-100 text-red-700',
  'En curso':                'bg-blue-100 text-blue-700',
  'Pendiente acuse':         'bg-amber-100 text-amber-700',
  'Confirmado':              'bg-emerald-100 text-emerald-700',
};

export default function Screen5Registro({ timeline }: Props) {
  const counts = {
    sistema:      timeline.filter(t => t.type === 'sistema').length,
    decision:     timeline.filter(t => t.type === 'decision').length,
    comunicacion: timeline.filter(t => t.type === 'comunicacion').length,
    actuacion:    timeline.filter(t => t.type === 'actuacion').length,
  };

  return (
    <div className="space-y-6">
      {/* Cabecera */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3 flex-wrap">
          {Object.entries(typeConfig).map(([key, val]) => {
            const Icon = val.icon;
            return (
              <div key={key} className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${val.cls}`}>
                <Icon size={12} />
                {val.label}: {counts[key as keyof typeof counts]}
              </div>
            );
          })}
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-semibold rounded-lg transition-colors">
            <Filter size={13} /> Filtrar
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-semibold rounded-lg transition-colors">
            <Download size={13} /> Exportar PDF
          </button>
        </div>
      </div>

      {/* Timeline */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 bg-slate-50">
          <h3 className="font-bold text-slate-800">Registro cronológico de la emergencia</h3>
          <p className="text-xs text-slate-500 mt-0.5">Trazabilidad completa de decisiones, actuaciones y comunicaciones</p>
        </div>

        <div className="p-6">
          <div className="relative">
            {/* Línea vertical */}
            <div className="absolute left-[22px] top-0 bottom-0 w-0.5 bg-slate-200" />

            <div className="space-y-6">
              {timeline.map((event, idx) => {
                const tc = typeConfig[event.type];
                const Icon = tc.icon;
                const resultCls = resultConfig[event.result] || 'bg-slate-100 text-slate-600';

                return (
                  <div key={event.id} className="relative flex gap-4 items-start">
                    {/* Icono del tipo */}
                    <div className={`relative z-10 w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 ${tc.cls} border-2 border-white shadow-sm`}>
                      <Icon size={16} />
                    </div>

                    {/* Contenido */}
                    <div className={`flex-1 bg-white border rounded-xl p-4 shadow-sm ${tc.line} border-l-4`}>
                      <div className="flex items-start justify-between gap-3 flex-wrap">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <span className="font-mono text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                              {event.time} h
                            </span>
                            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${tc.cls}`}>
                              {tc.label}
                            </span>
                          </div>
                          <p className="text-sm font-semibold text-slate-800">{event.event}</p>
                          <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                            <User size={11} />
                            {event.user}
                          </p>
                        </div>
                        <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full flex-shrink-0 ${resultCls}`}>
                          {event.result === 'Emergencia activa' && <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />}
                          {event.result === 'Confirmado' && <CheckCircle2 size={11} />}
                          {event.result}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Indicador "ahora" */}
              <div className="relative flex gap-4 items-center">
                <div className="relative z-10 w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 bg-slate-100 border-2 border-white border-dashed border-slate-300">
                  <span className="w-2 h-2 rounded-full bg-slate-400 animate-pulse" />
                </div>
                <p className="text-xs text-slate-400 italic">Emergencia en curso — registro activo</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Resumen de auditoría */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
          <p className="text-xs text-slate-500 mb-1">Inicio de emergencia</p>
          <p className="text-lg font-bold text-slate-900">09:08 h</p>
          <p className="text-xs text-slate-400">Primera alerta del sistema</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
          <p className="text-xs text-slate-500 mb-1">Tiempo hasta declaración</p>
          <p className="text-lg font-bold text-slate-900">9 minutos</p>
          <p className="text-xs text-slate-400">De detección a declaración formal</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
          <p className="text-xs text-slate-500 mb-1">Comunicaciones</p>
          <p className="text-lg font-bold text-slate-900">3 enviadas</p>
          <p className="text-xs text-slate-400">1 acuse recibido · 2 pendientes</p>
        </div>
      </div>
    </div>
  );
}
