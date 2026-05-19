import React, { useState } from 'react';
import { Zap, AlertTriangle, Play, RotateCw, Info, CheckCircle } from 'lucide-react';
import { SIMULATION_SCENARIOS, BIM_ELEMENTS } from './mockData';
import { ELEMENT_STATUS_CFG, DamStatusBanner, ElementStatusBadge } from './helpers';
import type { Screen, SimulationScenario, DamGlobalStatus, ElementStatus } from './types';

interface Props { onNavigate: (s: Screen) => void; }

export default function ScreenSimulation({ onNavigate }: Props) {
  const [active, setActive] = useState<SimulationScenario | null>(null);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);

  const runSimulation = (scenario: SimulationScenario) => {
    setRunning(true);
    setDone(false);
    setActive(scenario);
    setTimeout(() => { setRunning(false); setDone(true); }, 1800);
  };

  const reset = () => { setActive(null); setDone(false); setRunning(false); };

  const simulatedStatuses: Record<string, ElementStatus> = active ? active.status_change : {};
  const simulatedDamStatus: DamGlobalStatus = active?.dam_status ?? 'normal';

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Simulación de estados</h2>
          <p className="text-sm text-slate-500 mt-0.5">Modo formación · No afecta a datos reales</p>
        </div>
        {active && (
          <button onClick={reset} className="flex items-center gap-2 px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white text-sm font-bold rounded-xl">
            <RotateCw size={13} /> Resetear simulación
          </button>
        )}
      </div>

      {/* Warning notice */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
        <Info size={16} className="text-amber-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-bold text-amber-900 text-sm">Modo simulación — Solo para formación y validación</p>
          <p className="text-xs text-amber-700 mt-0.5">Los cambios aplicados en este modo no modifican datos reales del sistema. Sirven para visualizar cómo respondería el gemelo digital ante diferentes escenarios operativos y de emergencia.</p>
        </div>
      </div>

      {/* Active simulation banner */}
      {active && done && (
        <div className={`rounded-xl border p-4 flex items-start gap-3 ${
          simulatedDamStatus === 'scenario_0'    ? 'bg-red-50 border-red-200' :
          simulatedDamStatus === 'extraordinary' ? 'bg-amber-50 border-amber-200' :
          'bg-emerald-50 border-emerald-200'
        }`}>
          <AlertTriangle size={16} className={`flex-shrink-0 mt-0.5 ${simulatedDamStatus === 'scenario_0' ? 'text-red-600' : simulatedDamStatus === 'extraordinary' ? 'text-amber-600' : 'text-emerald-600'}`} />
          <div>
            <p className={`font-bold text-sm ${simulatedDamStatus === 'scenario_0' ? 'text-red-900' : simulatedDamStatus === 'extraordinary' ? 'text-amber-900' : 'text-emerald-900'}`}>
              SIMULACIÓN ACTIVA: {active.name}
            </p>
            <p className={`text-xs mt-0.5 ${simulatedDamStatus === 'scenario_0' ? 'text-red-700' : simulatedDamStatus === 'extraordinary' ? 'text-amber-700' : 'text-emerald-700'}`}>
              {active.warning_message}
            </p>
            {simulatedDamStatus === 'scenario_0' && (
              <button onClick={() => onNavigate('alerts')} className="flex items-center gap-1 text-xs font-bold text-red-700 hover:text-red-900 mt-1.5">
                Enlace a Gestión de Emergencias →
              </button>
            )}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Scenario list */}
        <div className="space-y-3">
          <h3 className="font-bold text-slate-700 text-sm">Escenarios disponibles</h3>
          {SIMULATION_SCENARIOS.map(scenario => (
            <div key={scenario.id} className={`bg-white rounded-xl border p-4 transition-all ${active?.id === scenario.id ? 'border-blue-400 shadow-sm' : 'border-slate-200'}`}>
              <div className="flex items-start justify-between gap-3 mb-2">
                <div>
                  <p className="text-sm font-bold text-slate-800">{scenario.name}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{scenario.description}</p>
                </div>
                {scenario.dam_status && (
                  <DamStatusBanner status={scenario.dam_status} />
                )}
              </div>
              <div className="flex flex-wrap gap-1.5 mb-3">
                {scenario.affected_elements.map(eid => {
                  const el = BIM_ELEMENTS.find(e => e.id === eid);
                  const newStatus = scenario.status_change[eid];
                  return el ? (
                    <div key={eid} className="flex items-center gap-1 bg-slate-50 rounded-lg px-2 py-1 border border-slate-200 text-xs">
                      <span className="text-slate-600 font-semibold">{el.name}</span>
                      {newStatus && (
                        <>
                          <span className="text-slate-300">→</span>
                          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: ELEMENT_STATUS_CFG[newStatus].svgStroke }} />
                          <span style={{ color: ELEMENT_STATUS_CFG[newStatus].svgStroke }} className="font-bold">{ELEMENT_STATUS_CFG[newStatus].label}</span>
                        </>
                      )}
                    </div>
                  ) : null;
                })}
              </div>
              <button
                onClick={() => runSimulation(scenario)}
                disabled={running}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white text-xs font-bold rounded-xl transition-colors"
              >
                {running && active?.id === scenario.id
                  ? <><RotateCw size={12} className="animate-spin" /> Aplicando simulación...</>
                  : <><Play size={12} /> Ejecutar simulación</>
                }
              </button>
            </div>
          ))}
        </div>

        {/* Simulation viewer */}
        <div className="space-y-3">
          <h3 className="font-bold text-slate-700 text-sm">Visor en modo simulación</h3>
          <div className="bg-gradient-to-b from-sky-100 to-slate-200 rounded-xl border border-slate-200 overflow-hidden relative" style={{ minHeight: 340 }}>
            {active && done && simulatedDamStatus !== 'normal' && (
              <div className={`absolute top-3 left-1/2 -translate-x-1/2 z-10 rounded-xl border px-4 py-2 text-xs font-bold ${
                simulatedDamStatus === 'scenario_0' ? 'bg-red-600 text-white border-red-700' :
                'bg-amber-500 text-white border-amber-600'
              }`}>
                {simulatedDamStatus === 'scenario_0' ? '⚠ SIMULACIÓN ESCENARIO 0' : '⚠ SIMULACIÓN S. EXTRAORDINARIA'}
              </div>
            )}

            <svg viewBox="0 20 600 360" className="w-full" style={{ minHeight: 320 }}>
              <rect x="0" y="215" width="200" height="155" fill="#bfdbfe" opacity="0.65" />
              <rect x="0" y="358" width="600" height="30" fill="#78716c" opacity="0.25" />
              <rect x="480" y="338" width="120" height="52" fill="#bfdbfe" opacity="0.45" />

              {BIM_ELEMENTS.map(el => {
                const effectiveStatus: ElementStatus = simulatedStatuses[el.id] ?? el.status;
                const cfg = ELEMENT_STATUS_CFG[effectiveStatus];
                const isAffected = active?.affected_elements.includes(el.id) && done;

                if (el.svgType === 'polygon' && el.points) {
                  return (
                    <g key={el.id}>
                      <polygon points={el.points} fill={cfg.svgFill} stroke={cfg.svgStroke} strokeWidth={isAffected ? 3 : 1.5} />
                    </g>
                  );
                }
                if (el.svgType === 'ellipse') {
                  const cx = el.x + el.width / 2;
                  const cy = el.y + el.height / 2;
                  const rx = el.width / 2;
                  const ry = el.height / 2;
                  return (
                    <g key={el.id}>
                      <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill={cfg.svgFill} stroke={cfg.svgStroke} strokeWidth={isAffected ? 3 : 1.5} />
                      {isAffected && (
                        <circle cx={cx} cy={cy} r={Math.max(rx, ry) + 6} fill="none" stroke={cfg.svgStroke} strokeWidth="2">
                          <animate attributeName="r" values={`${Math.max(rx,ry)+3};${Math.max(rx,ry)+9};${Math.max(rx,ry)+3}`} dur="1.5s" repeatCount="indefinite" />
                          <animate attributeName="opacity" values="0.8;0;0.8" dur="1.5s" repeatCount="indefinite" />
                        </circle>
                      )}
                    </g>
                  );
                }
                return (
                  <g key={el.id}>
                    <rect x={el.x} y={el.y} width={el.width} height={el.height} rx="2"
                      fill={cfg.svgFill} stroke={isAffected ? cfg.svgStroke : cfg.svgStroke}
                      strokeWidth={isAffected ? 3 : 1.5}
                    />
                    {isAffected && <rect x={el.x-4} y={el.y-4} width={el.width+8} height={el.height+8} fill="none" stroke={cfg.svgStroke} strokeWidth="2" strokeDasharray="3 2" rx="3">
                      <animate attributeName="opacity" values="1;0.2;1" dur="1.5s" repeatCount="indefinite" />
                    </rect>}
                  </g>
                );
              })}
            </svg>

            {!active && (
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="text-slate-500 text-sm bg-white/80 px-4 py-2 rounded-full border border-slate-200">Selecciona un escenario para ver la simulación</p>
              </div>
            )}
          </div>

          {/* Changed elements */}
          {active && done && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
              <p className="text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">Elementos afectados en esta simulación</p>
              <div className="space-y-1.5">
                {active.affected_elements.map(eid => {
                  const el = BIM_ELEMENTS.find(e => e.id === eid);
                  const origStatus = el?.status ?? 'no_data';
                  const newStatus: ElementStatus = simulatedStatuses[eid] ?? origStatus;
                  return el ? (
                    <div key={eid} className="flex items-center gap-2 text-xs">
                      <span className="font-semibold text-slate-700 flex-1">{el.name}</span>
                      <ElementStatusBadge status={origStatus} />
                      <span className="text-slate-400">→</span>
                      <ElementStatusBadge status={newStatus} />
                    </div>
                  ) : null;
                })}
              </div>
              {active.dam_status && (
                <div className="mt-3 pt-3 border-t border-slate-100">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="font-semibold text-slate-700">Estado global presa</span>
                    <DamStatusBanner status={active.dam_status} />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
