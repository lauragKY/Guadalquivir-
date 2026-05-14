import React, { useState } from 'react';
import { Activity, ClipboardList, History, Plus, CreditCard as Edit2, Trash2, ChevronDown, ChevronUp, CheckCircle2, AlertTriangle, Clock, Shield, Save, X } from 'lucide-react';
import type { EmergencyScenario, EmergencyCause } from './types';
import { SCENARIO_LABELS, CAUSE_LABELS } from './types';

type Tab = 'indicadores' | 'actuaciones' | 'historial';

// ─── Tipos locales ───────────────────────────────────────────────────────────

interface PlanIndicator {
  id: string;
  name: string;
  evaluation: 'Cuantitativa' | 'Cualitativa';
  threshold: string;
  unit: string;
  scenario: EmergencyScenario;
  cause: EmergencyCause;
  active: boolean;
}

interface PlanAction {
  id: string;
  num: number;
  name: string;
  procedure: string;
  type: 'inspeccion' | 'ejecucion';
  responsible: string;
  personnel: string;
  resources: string;
  scenario: EmergencyScenario;
  cause: EmergencyCause | 'all';
  deadline: string;
}

interface HistoryRecord {
  id: string;
  scenario: EmergencyScenario;
  cause: EmergencyCause;
  declaredAt: string;
  closedAt: string | null;
  declaredBy: string;
  duration: string | null;
  actions: number;
  comms: number;
  notes: string;
}

// ─── Mock data de configuración del Plan ────────────────────────────────────

const PLAN_INDICATORS: PlanIndicator[] = [
  { id: 'pi1',  name: 'Nivel de embalse',              evaluation: 'Cuantitativa', threshold: '600,87 m',     unit: 'm',    scenario: 'escenario_0',   cause: 'hidrologica',       active: true },
  { id: 'pi2',  name: 'Caudal entrante',               evaluation: 'Cuantitativa', threshold: '1.400 m³/s',  unit: 'm³/s', scenario: 'escenario_0',   cause: 'hidrologica',       active: true },
  { id: 'pi3',  name: 'Precipitación 24 h',            evaluation: 'Cuantitativa', threshold: '75 mm',       unit: 'mm',   scenario: 'escenario_0',   cause: 'hidrologica',       active: true },
  { id: 'pi4',  name: 'Nivel de embalse (Esc. 1)',     evaluation: 'Cuantitativa', threshold: '601,10 m',    unit: 'm',    scenario: 'escenario_1',   cause: 'hidrologica',       active: true },
  { id: 'pi5',  name: 'Caudal entrante (Esc. 1)',      evaluation: 'Cuantitativa', threshold: '1.800 m³/s',  unit: 'm³/s', scenario: 'escenario_1',   cause: 'hidrologica',       active: true },
  { id: 'pi6',  name: 'Piezómetro P-12',               evaluation: 'Cuantitativa', threshold: '315,0 m',     unit: 'm',    scenario: 'escenario_0',   cause: 'auscultacion',      active: true },
  { id: 'pi7',  name: 'Piezómetro P-15',               evaluation: 'Cuantitativa', threshold: '310,5 m',     unit: 'm',    scenario: 'escenario_0',   cause: 'auscultacion',      active: true },
  { id: 'pi8',  name: 'Aceleración sísmica',           evaluation: 'Cuantitativa', threshold: '0,05 g',      unit: 'g',    scenario: 'escenario_0',   cause: 'sismo',             active: true },
  { id: 'pi9',  name: 'Inspección visual del cuerpo',  evaluation: 'Cualitativa',  threshold: '—',           unit: '',     scenario: 'escenario_0',   cause: 'inspeccion',        active: true },
  { id: 'pi10', name: 'Estado equipos de aviso',       evaluation: 'Cualitativa',  threshold: '—',           unit: '',     scenario: 'extraordinaria', cause: 'equipos_aviso',    active: true },
  { id: 'pi11', name: 'Nivel presa aguas arriba',      evaluation: 'Cualitativa',  threshold: '—',           unit: '',     scenario: 'escenario_0',   cause: 'presa_aguas_arriba',active: true },
];

const PLAN_ACTIONS: PlanAction[] = [
  { id: 'pa1', num: 1,  name: 'Vigilancia permanente del nivel del embalse',     procedure: 'PV-1', type: 'inspeccion', responsible: 'Adjunto/a al Director/a del Plan', personnel: 'Auxiliar de Auscultación',                                  resources: 'Equipo de medición, teléfono', scenario: 'escenario_0', cause: 'hidrologica', deadline: 'Inmediato' },
  { id: 'pa2', num: 2,  name: 'Prueba de desagües y toma hidroeléctrica',         procedure: 'PV-6', type: 'ejecucion',  responsible: 'Jefe/a de Inspección y Equipos',  personnel: 'Auxiliar de Equipos',                                      resources: 'Sistemas de control, HMI',    scenario: 'escenario_0', cause: 'hidrologica', deadline: '< 1 hora' },
  { id: 'pa3', num: 3,  name: 'Prueba de grupos electrógenos',                    procedure: 'PV-7', type: 'ejecucion',  responsible: 'Jefe/a de Inspección y Equipos',  personnel: 'Auxiliar de Equipos',                                      resources: 'Grupos electrógenos',         scenario: 'escenario_0', cause: 'hidrologica', deadline: '< 1 hora' },
  { id: 'pa4', num: 4,  name: 'Inspección visual de la presa y aliviadero',       procedure: 'PV-2', type: 'inspeccion', responsible: 'Jefe/a de Inspección y Equipos',  personnel: 'Aux. Auscultación + Aux. Equipos',                         resources: 'EPI',                        scenario: 'escenario_0', cause: 'all',         deadline: '< 2 horas' },
  { id: 'pa5', num: 5,  name: 'Notificación al Director/a del Plan',              procedure: 'PC-1', type: 'ejecucion',  responsible: 'Adjunto/a al Director/a del Plan', personnel: 'Auxiliar de Comunicaciones',                               resources: 'Teléfono, radio',             scenario: 'escenario_0', cause: 'all',         deadline: 'Inmediato' },
  { id: 'pa6', num: 6,  name: 'Activación del sistema de auscultación automática',procedure: 'PV-3', type: 'ejecucion',  responsible: 'Adjunto/a al Director/a del Plan', personnel: 'Auxiliar de Auscultación',                                  resources: 'SCADA, red de sensores',      scenario: 'escenario_0', cause: 'all',         deadline: 'Inmediato' },
  { id: 'pa7', num: 7,  name: 'Comunicación formal F-2 (declaración)',            procedure: 'PC-3', type: 'ejecucion',  responsible: 'Director/a del Plan',             personnel: 'Auxiliar de Comunicaciones',                               resources: 'Correo electrónico, fax',     scenario: 'escenario_0', cause: 'all',         deadline: '< 30 min' },
  { id: 'pa8', num: 8,  name: 'Activar desagüe de fondo',                         procedure: 'PE-1', type: 'ejecucion',  responsible: 'Jefe/a de Inspección y Equipos',  personnel: 'Aux. Equipos + Aux. Auscultación',                         resources: 'Sistemas hidráulicos',        scenario: 'escenario_1', cause: 'hidrologica', deadline: 'Inmediato' },
  { id: 'pa9', num: 9,  name: 'Activación sirenas en zona de alerta',             procedure: 'PC-5', type: 'ejecucion',  responsible: 'Director/a del Plan',             personnel: 'Auxiliar de Comunicaciones',                               resources: 'Sistema de sirenas, 112',     scenario: 'escenario_2', cause: 'all',         deadline: 'Inmediato' },
];

const HISTORY_RECORDS: HistoryRecord[] = [
  { id: 'h1', scenario: 'escenario_0', cause: 'hidrologica',   declaredAt: '15/11/2024 09:17',  closedAt: '15/11/2024 21:40',  declaredBy: 'J. García (Dir. Plan)', duration: '12 h 23 min', actions: 6,  comms: 5, notes: 'Cierre ordenado tras reducción de caudal. Sin daños.' },
  { id: 'h2', scenario: 'extraordinaria', cause: 'hidrologica',declaredAt: '02/03/2024 14:30',  closedAt: '02/03/2024 20:15',  declaredBy: 'M. Torres (Dir. Plan)', duration: '5 h 45 min',  actions: 4,  comms: 3, notes: 'Situación controlada en todo momento.' },
  { id: 'h3', scenario: 'escenario_0', cause: 'auscultacion',  declaredAt: '18/07/2023 08:05',  closedAt: '19/07/2023 10:30',  declaredBy: 'J. García (Dir. Plan)', duration: '26 h 25 min', actions: 9,  comms: 8, notes: 'Anomalía en piezómetro P-12 confirmada y corregida.' },
  { id: 'h4', scenario: 'escenario_0', cause: 'hidrologica',   declaredAt: '07/12/2022 18:00',  closedAt: '08/12/2022 06:30',  declaredBy: 'M. Torres (Dir. Plan)', duration: '12 h 30 min', actions: 7,  comms: 6, notes: 'Avenida significativa. Laminación satisfactoria.' },
];

// ─── Sub-componentes de tabla ────────────────────────────────────────────────

const scenarioBadge = (s: EmergencyScenario) => {
  const map: Record<EmergencyScenario, string> = {
    normalidad:    'bg-emerald-100 text-emerald-700',
    extraordinaria:'bg-amber-100 text-amber-700',
    escenario_0:   'bg-yellow-100 text-yellow-800',
    escenario_1:   'bg-orange-100 text-orange-800',
    escenario_2:   'bg-red-100 text-red-700',
    escenario_3:   'bg-red-700 text-white',
  };
  return map[s];
};

// ─── Tab: Indicadores ───────────────────────────────────────────────────────

function TabIndicadores() {
  const [filter, setFilter] = useState<EmergencyScenario | 'all'>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = filter === 'all' ? PLAN_INDICATORS : PLAN_INDICATORS.filter(i => i.scenario === filter);

  const scenarios: (EmergencyScenario | 'all')[] = ['all', 'extraordinaria', 'escenario_0', 'escenario_1', 'escenario_2', 'escenario_3'];

  return (
    <div className="space-y-4">
      {/* Filtros + acción */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2 flex-wrap">
          {scenarios.map(s => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                filter === s
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {s === 'all' ? 'Todos' : SCENARIO_LABELS[s]}
            </button>
          ))}
        </div>
        <button className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition-colors">
          <Plus size={13} /> Nuevo indicador
        </button>
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Indicador</th>
              <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Escenario</th>
              <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Causa</th>
              <th className="text-center px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Tipo</th>
              <th className="text-right px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Umbral</th>
              <th className="text-center px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Activo</th>
              <th className="text-center px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map(ind => (
              <React.Fragment key={ind.id}>
                <tr className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 font-medium text-slate-800">{ind.name}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded-full ${scenarioBadge(ind.scenario)}`}>
                      {SCENARIO_LABELS[ind.scenario]}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-600 text-xs">{CAUSE_LABELS[ind.cause]}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-flex items-center text-xs font-medium px-2 py-0.5 rounded-full ${
                      ind.evaluation === 'Cuantitativa' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {ind.evaluation}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-xs font-bold text-slate-700">
                    {ind.threshold}
                    {ind.unit && <span className="text-slate-400 font-normal ml-1">{ind.unit}</span>}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {ind.active
                      ? <CheckCircle2 size={16} className="text-emerald-500 mx-auto" />
                      : <Clock size={16} className="text-slate-400 mx-auto" />
                    }
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() => setExpandedId(expandedId === ind.id ? null : ind.id)}
                        className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
                        title="Ver detalle"
                      >
                        {expandedId === ind.id ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                      </button>
                      <button className="p-1.5 rounded-lg hover:bg-blue-50 text-slate-400 hover:text-blue-600 transition-colors" title="Editar">
                        <Edit2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
                {expandedId === ind.id && (
                  <tr className="bg-slate-50">
                    <td colSpan={7} className="px-6 py-4">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                        <div><span className="text-slate-400 block mb-0.5">Nombre completo</span><span className="font-medium text-slate-700">{ind.name}</span></div>
                        <div><span className="text-slate-400 block mb-0.5">Evaluación</span><span className="font-medium text-slate-700">{ind.evaluation}</span></div>
                        <div><span className="text-slate-400 block mb-0.5">Umbral activación</span><span className="font-bold text-slate-800">{ind.threshold} {ind.unit}</span></div>
                        <div><span className="text-slate-400 block mb-0.5">Causa asociada</span><span className="font-medium text-slate-700">{CAUSE_LABELS[ind.cause]}</span></div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
        <div className="px-4 py-3 border-t border-slate-100 bg-slate-50 text-xs text-slate-500">
          {filtered.length} indicador{filtered.length !== 1 ? 'es' : ''} configurado{filtered.length !== 1 ? 's' : ''}
          {filter !== 'all' && ` para ${SCENARIO_LABELS[filter as EmergencyScenario]}`}
        </div>
      </div>
    </div>
  );
}

// ─── Tab: Actuaciones ───────────────────────────────────────────────────────

function TabActuaciones() {
  const [filter, setFilter] = useState<EmergencyScenario | 'all'>('all');

  const filtered = filter === 'all' ? PLAN_ACTIONS : PLAN_ACTIONS.filter(a => a.scenario === filter);
  const inspeccion = filtered.filter(a => a.type === 'inspeccion');
  const ejecucion  = filtered.filter(a => a.type === 'ejecucion');

  const scenarios: (EmergencyScenario | 'all')[] = ['all', 'escenario_0', 'escenario_1', 'escenario_2'];

  return (
    <div className="space-y-4">
      {/* Filtros + acción */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2 flex-wrap">
          {scenarios.map(s => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                filter === s
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {s === 'all' ? 'Todos' : SCENARIO_LABELS[s]}
            </button>
          ))}
        </div>
        <button className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition-colors">
          <Plus size={13} /> Nueva actuación
        </button>
      </div>

      {/* Stats rápidas */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-center">
          <p className="text-xl font-bold text-amber-700">{inspeccion.length}</p>
          <p className="text-xs text-amber-600 mt-0.5">De inspección</p>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-center">
          <p className="text-xl font-bold text-blue-700">{ejecucion.length}</p>
          <p className="text-xs text-blue-600 mt-0.5">De ejecución</p>
        </div>
      </div>

      {/* Actuaciones de inspección */}
      {inspeccion.length > 0 && (
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-amber-700 mb-2 flex items-center gap-2">
            <span className="w-4 h-4 rounded bg-amber-100 flex items-center justify-center text-amber-600 text-xs font-bold">I</span>
            Actuaciones de inspección
          </h4>
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="text-center px-3 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 w-10">Nº</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Actuación</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Código</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Responsable</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Escenario</th>
                  <th className="text-center px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Plazo</th>
                  <th className="text-center px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {inspeccion.map(a => (
                  <tr key={a.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-3 py-3 text-center">
                      <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-700 text-xs font-bold flex items-center justify-center mx-auto">{a.num}</span>
                    </td>
                    <td className="px-4 py-3 font-medium text-slate-800">{a.name}</td>
                    <td className="px-4 py-3 font-mono text-xs text-blue-700 font-bold">{a.procedure}</td>
                    <td className="px-4 py-3 text-slate-600 text-xs">{a.responsible}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded-full ${scenarioBadge(a.scenario)}`}>
                        {SCENARIO_LABELS[a.scenario]}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center text-xs text-slate-600">{a.deadline}</td>
                    <td className="px-4 py-3 text-center">
                      <button className="p-1.5 rounded-lg hover:bg-blue-50 text-slate-400 hover:text-blue-600 transition-colors">
                        <Edit2 size={13} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Actuaciones de ejecución */}
      {ejecucion.length > 0 && (
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-blue-700 mb-2 flex items-center gap-2">
            <span className="w-4 h-4 rounded bg-blue-100 flex items-center justify-center text-blue-600 text-xs font-bold">E</span>
            Actuaciones de ejecución
          </h4>
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="text-center px-3 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 w-10">Nº</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Actuación</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Código</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Responsable</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Escenario</th>
                  <th className="text-center px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Plazo</th>
                  <th className="text-center px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {ejecucion.map(a => (
                  <tr key={a.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-3 py-3 text-center">
                      <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center mx-auto">{a.num}</span>
                    </td>
                    <td className="px-4 py-3 font-medium text-slate-800">{a.name}</td>
                    <td className="px-4 py-3 font-mono text-xs text-blue-700 font-bold">{a.procedure}</td>
                    <td className="px-4 py-3 text-slate-600 text-xs">{a.responsible}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded-full ${scenarioBadge(a.scenario)}`}>
                        {SCENARIO_LABELS[a.scenario]}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center text-xs text-slate-600">{a.deadline}</td>
                    <td className="px-4 py-3 text-center">
                      <button className="p-1.5 rounded-lg hover:bg-blue-50 text-slate-400 hover:text-blue-600 transition-colors">
                        <Edit2 size={13} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Tab: Historial ─────────────────────────────────────────────────────────

function TabHistorial() {
  const [expanded, setExpanded] = useState<string | null>(null);

  const scenarioIcon = (s: EmergencyScenario) => {
    if (s === 'normalidad') return <CheckCircle2 size={14} className="text-emerald-500" />;
    if (s === 'extraordinaria') return <AlertTriangle size={14} className="text-amber-500" />;
    return <Shield size={14} className="text-red-500" />;
  };

  return (
    <div className="space-y-4">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm text-center">
          <p className="text-2xl font-bold text-slate-900">{HISTORY_RECORDS.length}</p>
          <p className="text-xs text-slate-500 mt-0.5">Emergencias históricas</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm text-center">
          <p className="text-2xl font-bold text-yellow-700">{HISTORY_RECORDS.filter(h => h.scenario === 'escenario_0').length}</p>
          <p className="text-xs text-slate-500 mt-0.5">Escenario 0</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm text-center">
          <p className="text-2xl font-bold text-amber-700">{HISTORY_RECORDS.filter(h => h.scenario === 'extraordinaria').length}</p>
          <p className="text-xs text-slate-500 mt-0.5">Extraordinaria</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm text-center">
          <p className="text-2xl font-bold text-emerald-600">100%</p>
          <p className="text-xs text-slate-500 mt-0.5">Resueltas</p>
        </div>
      </div>

      {/* Lista */}
      <div className="space-y-3">
        {HISTORY_RECORDS.map(h => (
          <div key={h.id} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <button
              onClick={() => setExpanded(expanded === h.id ? null : h.id)}
              className="w-full px-5 py-4 flex items-start gap-4 hover:bg-slate-50 transition-colors text-left"
            >
              <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center flex-shrink-0">
                {scenarioIcon(h.scenario)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className={`inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded-full ${scenarioBadge(h.scenario)}`}>
                    {SCENARIO_LABELS[h.scenario]}
                  </span>
                  <span className="text-xs text-slate-500">{CAUSE_LABELS[h.cause]}</span>
                </div>
                <p className="text-sm font-semibold text-slate-800">{h.declaredAt}</p>
                <p className="text-xs text-slate-500 mt-0.5">{h.declaredBy}</p>
              </div>
              <div className="flex items-center gap-6 text-center flex-shrink-0">
                {h.duration && (
                  <div>
                    <p className="text-sm font-bold text-slate-800">{h.duration}</p>
                    <p className="text-xs text-slate-400">Duración</p>
                  </div>
                )}
                <div>
                  <p className="text-sm font-bold text-slate-800">{h.actions}</p>
                  <p className="text-xs text-slate-400">Actuaciones</p>
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-800">{h.comms}</p>
                  <p className="text-xs text-slate-400">Comunicaciones</p>
                </div>
                <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
                  <CheckCircle2 size={11} /> Cerrada
                </span>
                {expanded === h.id ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
              </div>
            </button>

            {expanded === h.id && (
              <div className="border-t border-slate-100 px-5 py-4 bg-slate-50/50">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs mb-3">
                  <div><span className="text-slate-400 block mb-0.5">Inicio declaración</span><span className="font-medium text-slate-700">{h.declaredAt}</span></div>
                  <div><span className="text-slate-400 block mb-0.5">Cierre</span><span className="font-medium text-slate-700">{h.closedAt || '—'}</span></div>
                  <div><span className="text-slate-400 block mb-0.5">Duración total</span><span className="font-medium text-slate-700">{h.duration || '—'}</span></div>
                  <div><span className="text-slate-400 block mb-0.5">Director del Plan</span><span className="font-medium text-slate-700">{h.declaredBy}</span></div>
                </div>
                <div>
                  <span className="text-xs text-slate-400 block mb-0.5">Notas de cierre</span>
                  <p className="text-sm text-slate-700 italic">"{h.notes}"</p>
                </div>
                <div className="mt-3 flex gap-2">
                  <button className="text-xs text-blue-600 hover:underline font-medium">Ver registro completo</button>
                  <span className="text-slate-300">·</span>
                  <button className="text-xs text-blue-600 hover:underline font-medium">Exportar PDF</button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Componente principal ────────────────────────────────────────────────────

export default function ScreenConfigPlan() {
  const [tab, setTab] = useState<Tab>('indicadores');

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: 'indicadores', label: 'Indicadores de activación', icon: <Activity size={15} /> },
    { id: 'actuaciones', label: 'Actuaciones del Plan',      icon: <ClipboardList size={15} /> },
    { id: 'historial',   label: 'Historial de emergencias',  icon: <History size={15} /> },
  ];

  return (
    <div className="space-y-6">
      {/* Info banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
        <Shield size={18} className="text-blue-600 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-blue-900">
          <p className="font-semibold">Configuración del Plan de Emergencia</p>
          <p className="text-xs text-blue-700 mt-0.5">
            Define los indicadores que activan cada escenario, las actuaciones asociadas y consulta el historial de emergencias previas.
            Los cambios en esta sección requieren aprobación del responsable del Plan.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-100 p-1 rounded-xl w-fit">
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              tab === t.id
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {t.icon}
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'indicadores' && <TabIndicadores />}
      {tab === 'actuaciones' && <TabActuaciones />}
      {tab === 'historial'   && <TabHistorial />}
    </div>
  );
}
