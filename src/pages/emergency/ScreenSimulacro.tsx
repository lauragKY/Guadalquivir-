import React, { useState } from 'react';
import {
  Play, RotateCw, CheckCircle, AlertTriangle, ChevronRight,
  ClipboardList, Send, BookOpen, Shield, Info, Activity, Radio
} from 'lucide-react';
import type { EmergencyScenario, EmergencyCause, EmergencyAction, Recipient, CommunicationRecord, TimelineEvent } from './types';
import { SCENARIO_LABELS, SCENARIO_COLORS, CAUSE_LABELS } from './types';

// ── Simulacro data ──────────────────────────────────────────────────────────

const SIM_SCENARIOS: { id: EmergencyScenario; cause: EmergencyCause; description: string; variables: { name: string; sim: string; threshold: string; status: 'superado' | 'normal' }[] }[] = [
  {
    id: 'escenario_0',
    cause: 'hidrologica',
    description: 'Superación de umbrales hidrológicos por avenida — NE, caudal y precipitación superados simultáneamente.',
    variables: [
      { name: 'Nivel de embalse',  sim: '383,95 m',   threshold: '383,50 m', status: 'superado' },
      { name: 'Caudal entrante',   sim: '480 m³/s',   threshold: '450 m³/s', status: 'superado' },
      { name: 'Precipitación 24h', sim: '74 mm',       threshold: '70 mm',   status: 'superado' },
      { name: 'Piezómetro P-07',   sim: '43,2 m',      threshold: '48,0 m',  status: 'normal'  },
    ],
  },
  {
    id: 'escenario_0',
    cause: 'auscultacion',
    description: 'Superación de umbral piezométrico crítico — deformación estructural detectada en cuerpo de presa.',
    variables: [
      { name: 'Piezómetro P-07',   sim: '51,4 m',      threshold: '48,0 m',  status: 'superado' },
      { name: 'Colimación C-03',   sim: '+18,4 mm',     threshold: '+15 mm',  status: 'superado' },
      { name: 'Nivel de embalse',  sim: '380,2 m',     threshold: '383,50 m', status: 'normal'  },
      { name: 'Aceleración sísmica', sim: '0,008 g',   threshold: '0,05 g',  status: 'normal'  },
    ],
  },
  {
    id: 'extraordinaria',
    cause: 'sismo',
    description: 'Evento sísmico con aceleración próxima al umbral — activación de inspección inmediata.',
    variables: [
      { name: 'Aceleración sísmica', sim: '0,038 g',   threshold: '0,05 g',  status: 'normal'  },
      { name: 'Magnitud (Richter)', sim: '3,8',        threshold: '4,0',     status: 'normal'  },
      { name: 'Inspección visual',  sim: 'Pendiente',  threshold: '—',       status: 'normal'  },
      { name: 'Piezómetro P-07',   sim: '43,2 m',     threshold: '48,0 m',  status: 'normal'  },
    ],
  },
];

const SIM_ACTIONS: EmergencyAction[] = [
  { id: 'sa1', num: 1, name: 'Vigilancia permanente del nivel del embalse',        responsible: 'Adjunto/a al Dir. del Plan', procedure: 'PV-1', personnel: 'Auxiliar de Auscultación',  resources: 'Equipo de medición, teléfono', type: 'inspeccion', status: 'pendiente', observations: '' },
  { id: 'sa2', num: 2, name: 'Notificación al Director/a del Plan',                 responsible: 'Adjunto/a al Dir. del Plan', procedure: 'PC-1', personnel: 'Aux. Comunicaciones',        resources: 'Teléfono, radio',             type: 'ejecucion',  status: 'pendiente', observations: '' },
  { id: 'sa3', num: 3, name: 'Prueba de desagües y toma hidroeléctrica',            responsible: 'Jefe/a de Inspección y Eq.', procedure: 'PV-6', personnel: 'Auxiliar de Equipos',        resources: 'Sistemas de control, HMI',    type: 'ejecucion',  status: 'pendiente', observations: '' },
  { id: 'sa4', num: 4, name: 'Activación del sistema de auscultación automática',  responsible: 'Adjunto/a al Dir. del Plan', procedure: 'PV-3', personnel: 'Auxiliar de Auscultación',  resources: 'SCADA, red de sensores',      type: 'ejecucion',  status: 'pendiente', observations: '' },
  { id: 'sa5', num: 5, name: 'Inspección visual de la presa y aliviadero',         responsible: 'Jefe/a de Inspección y Eq.', procedure: 'PV-2', personnel: 'Aux. Auscultación + Equipos', resources: 'EPI, radio',                  type: 'inspeccion', status: 'pendiente', observations: '' },
];

const SIM_RECIPIENTS: Recipient[] = [
  { id: 'sr1', name: 'Centro de Control de Sevilla / SAIH', role: 'Organismo de cuenca', email: 'saih.guadalquivir@chguadalquivir.es', selected: true,  required: true },
  { id: 'sr2', name: 'Jefe/a del Área de Explotación',      role: 'Responsable interno', email: 'explotacion@chguadalquivir.es',      selected: true,  required: true },
  { id: 'sr3', name: 'Comité Permanente',                   role: 'Órgano directivo',    email: 'comite@chguadalquivir.es',           selected: true,  required: true },
  { id: 'sr4', name: '112 Andalucía',                       role: 'Protección Civil',    email: 'emergencias@juntadeandalucia.es',    selected: false, required: false },
  { id: 'sr5', name: 'Dirección General del Agua',          role: 'Administración',      email: 'dga@miteco.gob.es',                  selected: false, required: false },
];

type SimStep = 'seleccion' | 'variables' | 'declaracion' | 'actuaciones' | 'comunicacion' | 'registro';

const SIM_STEPS: { id: SimStep; label: string }[] = [
  { id: 'seleccion',   label: 'Selección de escenario' },
  { id: 'variables',   label: 'Revisión de variables' },
  { id: 'declaracion', label: 'Declaración simulada' },
  { id: 'actuaciones', label: 'Actuaciones' },
  { id: 'comunicacion', label: 'Comunicaciones' },
  { id: 'registro',    label: 'Registro' },
];

// ── Component ───────────────────────────────────────────────────────────────

export default function ScreenSimulacro() {
  const [step, setStep] = useState<SimStep>('seleccion');
  const [selectedScenarioIdx, setSelectedScenarioIdx] = useState<number | null>(null);
  const [actions, setActions] = useState<EmergencyAction[]>(SIM_ACTIONS);
  const [recipients, setRecipients] = useState<Recipient[]>(SIM_RECIPIENTS);
  const [comms, setComms] = useState<CommunicationRecord[]>([]);
  const [timeline, setTimeline] = useState<TimelineEvent[]>([]);
  const [declared, setDeclared] = useState(false);
  const [commsSent, setCommsSent] = useState(false);

  const scenario = selectedScenarioIdx !== null ? SIM_SCENARIOS[selectedScenarioIdx] : null;
  const scenarioColors = scenario ? SCENARIO_COLORS[scenario.id] : null;
  const stepIndex = SIM_STEPS.findIndex(s => s.id === step);

  const reset = () => {
    setStep('seleccion');
    setSelectedScenarioIdx(null);
    setActions(SIM_ACTIONS);
    setRecipients(SIM_RECIPIENTS);
    setComms([]);
    setTimeline([]);
    setDeclared(false);
    setCommsSent(false);
  };

  const handleDeclare = () => {
    if (!scenario) return;
    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2,'0')}:${now.getMinutes().toString().padStart(2,'0')}`;
    setDeclared(true);
    setTimeline(prev => [
      ...prev,
      { id: `t${Date.now()}`, time: timeStr, event: `[SIMULACRO] Declarado ${SCENARIO_LABELS[scenario.id]} — Causa: ${CAUSE_LABELS[scenario.cause]}`, user: 'Dir. del Plan (simulacro)', result: 'Simulacro activo', type: 'decision' },
    ]);
    setStep('actuaciones');
  };

  const handleActionComplete = (id: string) => {
    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2,'0')}:${now.getMinutes().toString().padStart(2,'0')}`;
    setActions(prev => prev.map(a => a.id === id ? { ...a, status: 'realizada', completedAt: timeStr } : a));
    const action = actions.find(a => a.id === id);
    if (action) {
      setTimeline(prev => [
        ...prev,
        { id: `t${Date.now()}`, time: timeStr, event: `[SIMULACRO] Actuación realizada: ${action.name}`, user: action.responsible, result: 'Completada', type: 'actuacion' },
      ]);
    }
  };

  const handleSendComms = () => {
    if (!scenario) return;
    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2,'0')}:${now.getMinutes().toString().padStart(2,'0')}`;
    const selected = recipients.filter(r => r.selected);
    const newComms: CommunicationRecord[] = selected.map(r => ({
      id: `sc${r.id}`,
      recipient: r.name,
      method: 'Correo electrónico (simulado)',
      sentAt: timeStr,
      status: 'enviado' as const,
    }));
    setComms(newComms);
    setCommsSent(true);
    setTimeline(prev => [
      ...prev,
      { id: `t${Date.now()}`, time: timeStr, event: `[SIMULACRO] Comunicación F-2 enviada a ${selected.length} destinatarios (simulado)`, user: 'Aux. Comunicaciones (simulacro)', result: 'Enviado simulado', type: 'comunicacion' },
    ]);
    setStep('registro');
  };

  const actionsCompleted = actions.filter(a => a.status === 'realizada').length;

  return (
    <div className="space-y-5 max-w-5xl">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 border border-amber-300">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
              MODO SIMULACRO
            </span>
          </div>
          <h2 className="text-xl font-bold text-slate-900">Simulacro del Plan de Emergencia</h2>
          <p className="text-sm text-slate-500 mt-0.5">Presa de Bembézar · GQ-009 — Modo formación, sin efecto sobre datos reales</p>
        </div>
        <button onClick={reset} className="flex items-center gap-2 px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white text-sm font-bold rounded-xl transition-colors">
          <RotateCw size={13} /> Reiniciar simulacro
        </button>
      </div>

      {/* Notice */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
        <Info size={16} className="text-amber-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-bold text-amber-900 text-sm">Simulacro — Solo para formación y validación del plan</p>
          <p className="text-xs text-amber-700 mt-0.5">Todas las acciones en este modo son simuladas. No se envían comunicaciones reales, no se modifican datos operativos y no se activan sirenas ni sistemas de aviso reales.</p>
        </div>
      </div>

      {/* Step progress */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
        <div className="flex items-center gap-1.5 flex-wrap">
          {SIM_STEPS.map((s, idx) => {
            const isActive = step === s.id;
            const isPast = idx < stepIndex;
            return (
              <React.Fragment key={s.id}>
                <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  isActive ? 'bg-blue-600 text-white' :
                  isPast   ? 'bg-emerald-100 text-emerald-700' :
                  'bg-slate-100 text-slate-400'
                }`}>
                  {isPast ? <CheckCircle size={12} /> : <span className="w-4 h-4 rounded-full flex items-center justify-center bg-current/20 text-current font-bold">{idx+1}</span>}
                  {s.label}
                </div>
                {idx < SIM_STEPS.length - 1 && <ChevronRight size={12} className="text-slate-300 flex-shrink-0" />}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* ── STEP 1: Selección de escenario ── */}
      {step === 'seleccion' && (
        <div className="space-y-4">
          <h3 className="font-bold text-slate-800">Paso 1 — Seleccionar escenario a simular</h3>
          <div className="grid grid-cols-1 gap-3">
            {SIM_SCENARIOS.map((s, idx) => {
              const colors = SCENARIO_COLORS[s.id];
              const isSelected = selectedScenarioIdx === idx;
              return (
                <button
                  key={idx}
                  onClick={() => setSelectedScenarioIdx(idx)}
                  className={`w-full text-left rounded-xl border p-4 transition-all ${isSelected ? `${colors.border} border-2 shadow-sm` : 'border-slate-200 hover:border-slate-300'}`}
                >
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${colors.badge}`}>{SCENARIO_LABELS[s.id]}</span>
                        <span className="text-xs text-slate-500 font-semibold">{CAUSE_LABELS[s.cause]}</span>
                      </div>
                      <p className="text-sm text-slate-700">{s.description}</p>
                    </div>
                    {isSelected && <CheckCircle size={18} className="text-blue-600 flex-shrink-0 mt-1" />}
                  </div>
                </button>
              );
            })}
          </div>

          <button
            disabled={selectedScenarioIdx === null}
            onClick={() => setStep('variables')}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 text-white text-sm font-bold rounded-xl transition-colors"
          >
            <Play size={14} /> Iniciar simulacro <ChevronRight size={14} />
          </button>
        </div>
      )}

      {/* ── STEP 2: Variables ── */}
      {step === 'variables' && scenario && (
        <div className="space-y-4">
          <h3 className="font-bold text-slate-800">Paso 2 — Revisión de variables simuladas</h3>
          <div className={`rounded-xl border p-4 ${scenarioColors?.bg} ${scenarioColors?.border}`}>
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${scenarioColors?.badge}`}>{SCENARIO_LABELS[scenario.id]}</span>
              <span className={`text-xs font-semibold ${scenarioColors?.text}`}>{CAUSE_LABELS[scenario.cause]}</span>
            </div>
            <p className={`text-xs ${scenarioColors?.text}`}>{scenario.description}</p>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-5 py-3 bg-slate-50 border-b border-slate-100">
              <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Indicadores de evaluación (valores simulados)</p>
            </div>
            <div className="divide-y divide-slate-100">
              {scenario.variables.map((v, idx) => (
                <div key={idx} className="flex items-center gap-4 px-5 py-3">
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-slate-800">{v.name}</p>
                    <p className="text-xs text-slate-400">Umbral: {v.threshold}</p>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-bold ${v.status === 'superado' ? 'text-red-700' : 'text-emerald-700'}`}>{v.sim}</p>
                    <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${v.status === 'superado' ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${v.status === 'superado' ? 'bg-red-500' : 'bg-emerald-500'}`} />
                      {v.status === 'superado' ? 'Superado' : 'Normal'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            <button onClick={() => setStep('seleccion')} className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-800 border border-slate-200 hover:border-slate-300 rounded-xl transition-colors">
              Atrás
            </button>
            <button onClick={() => setStep('declaracion')} className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl transition-colors">
              Continuar <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}

      {/* ── STEP 3: Declaración ── */}
      {step === 'declaracion' && scenario && (
        <div className="space-y-4">
          <h3 className="font-bold text-slate-800">Paso 3 — Declaración del escenario (simulado)</h3>
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-xs text-slate-500 font-semibold uppercase tracking-wide mb-1">Escenario propuesto</p>
                <span className={`inline-block text-sm font-bold px-3 py-1 rounded-full ${SCENARIO_COLORS[scenario.id].badge}`}>{SCENARIO_LABELS[scenario.id]}</span>
              </div>
              <div>
                <p className="text-xs text-slate-500 font-semibold uppercase tracking-wide mb-1">Causa principal</p>
                <p className="font-semibold text-slate-800">{CAUSE_LABELS[scenario.cause]}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 font-semibold uppercase tracking-wide mb-1">Variables superadas</p>
                <p className="font-semibold text-red-700">{scenario.variables.filter(v => v.status === 'superado').length} de {scenario.variables.length}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 font-semibold uppercase tracking-wide mb-1">Confianza propuesta</p>
                <span className="inline-block text-xs font-bold px-2.5 py-1 rounded-full bg-teal-100 text-teal-800">Alta</span>
              </div>
            </div>

            <div className={`rounded-xl border p-3 ${scenarioColors?.bg} ${scenarioColors?.border}`}>
              <p className={`text-xs font-semibold ${scenarioColors?.text}`}>Al confirmar, se registrará en el historial de simulacro la declaración con hora, escenario, causa y usuario. No se realizará ninguna acción real.</p>
            </div>

            {declared ? (
              <div className="flex items-center gap-2 text-emerald-700 font-semibold text-sm">
                <CheckCircle size={16} /> Escenario declarado en simulacro
              </div>
            ) : (
              <div className="flex gap-3">
                <button onClick={() => setStep('variables')} className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-800 border border-slate-200 hover:border-slate-300 rounded-xl transition-colors">
                  Atrás
                </button>
                <button onClick={handleDeclare} className="flex items-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white text-sm font-bold rounded-xl transition-colors">
                  <Shield size={14} /> Declarar escenario (simulacro)
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── STEP 4: Actuaciones ── */}
      {step === 'actuaciones' && scenario && (
        <div className="space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h3 className="font-bold text-slate-800">Paso 4 — Actuaciones recomendadas (simuladas)</h3>
            <span className="text-xs font-semibold text-slate-500">{actionsCompleted}/{actions.length} completadas</span>
          </div>

          <div className="space-y-2">
            {actions.map(action => (
              <div key={action.id} className={`bg-white rounded-xl border p-4 transition-all ${action.status === 'realizada' ? 'border-emerald-200 bg-emerald-50' : 'border-slate-200'}`}>
                <div className="flex items-start gap-3">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5 ${action.status === 'realizada' ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-600'}`}>
                    {action.status === 'realizada' ? <CheckCircle size={14} /> : action.num}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-semibold ${action.status === 'realizada' ? 'text-emerald-800' : 'text-slate-800'}`}>{action.name}</p>
                    <div className="flex flex-wrap gap-x-4 gap-y-0.5 mt-1">
                      <p className="text-xs text-slate-500">Proc: <span className="font-semibold text-slate-700">{action.procedure}</span></p>
                      <p className="text-xs text-slate-500">Responsable: <span className="font-semibold text-slate-700">{action.responsible}</span></p>
                      {action.completedAt && <p className="text-xs text-emerald-600 font-semibold">Completada {action.completedAt}</p>}
                    </div>
                  </div>
                  {action.status !== 'realizada' && (
                    <button
                      onClick={() => handleActionComplete(action.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold rounded-lg transition-colors flex-shrink-0"
                    >
                      <ClipboardList size={12} /> Marcar realizada
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          <button onClick={() => setStep('comunicacion')} className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl transition-colors">
            Continuar a comunicaciones <ChevronRight size={14} />
          </button>
        </div>
      )}

      {/* ── STEP 5: Comunicaciones ── */}
      {step === 'comunicacion' && scenario && (
        <div className="space-y-4">
          <h3 className="font-bold text-slate-800">Paso 5 — Comunicaciones simuladas</h3>
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4">
            <p className="text-xs text-slate-500">Seleccione los destinatarios que recibirán la comunicación F-2 simulada. En simulacro, no se enviarán correos reales.</p>
            <div className="space-y-2">
              {recipients.map(r => (
                <label key={r.id} className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${r.selected ? 'border-blue-300 bg-blue-50' : 'border-slate-200 hover:border-slate-300'}`}>
                  <input
                    type="checkbox"
                    checked={r.selected}
                    disabled={r.required || commsSent}
                    onChange={() => !commsSent && setRecipients(prev => prev.map(rr => rr.id === r.id ? { ...rr, selected: !rr.selected } : rr))}
                    className="w-4 h-4 accent-blue-600"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-800">{r.name}</p>
                    <p className="text-xs text-slate-400">{r.role} · {r.email}</p>
                  </div>
                  {r.required && <span className="text-xs font-bold text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full">Obligatorio</span>}
                </label>
              ))}
            </div>

            {comms.length > 0 && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 space-y-1.5">
                <p className="text-xs font-bold text-emerald-800 flex items-center gap-1.5"><Send size={12} /> {comms.length} comunicaciones enviadas (simulado)</p>
                {comms.map(c => (
                  <div key={c.id} className="flex items-center gap-2 text-xs text-emerald-700">
                    <CheckCircle size={11} />
                    <span className="font-semibold">{c.recipient}</span>
                    <span className="text-emerald-500">· {c.sentAt}</span>
                  </div>
                ))}
              </div>
            )}

            {!commsSent && (
              <div className="flex gap-3">
                <button onClick={() => setStep('actuaciones')} className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-800 border border-slate-200 hover:border-slate-300 rounded-xl transition-colors">
                  Atrás
                </button>
                <button onClick={handleSendComms} className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl transition-colors">
                  <Send size={14} /> Enviar comunicaciones (simulado)
                </button>
              </div>
            )}
            {commsSent && (
              <button onClick={() => setStep('registro')} className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl transition-colors">
                Ver registro <ChevronRight size={14} />
              </button>
            )}
          </div>
        </div>
      )}

      {/* ── STEP 6: Registro ── */}
      {step === 'registro' && (
        <div className="space-y-4">
          <h3 className="font-bold text-slate-800">Paso 6 — Registro de simulacro</h3>
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-5 py-3 bg-slate-50 border-b border-slate-100 flex items-center gap-2">
              <BookOpen size={14} className="text-slate-500" />
              <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Línea de tiempo del simulacro</p>
              <span className="ml-auto text-xs text-slate-400">{timeline.length} eventos registrados</span>
            </div>
            {timeline.length === 0 ? (
              <div className="px-5 py-8 text-center text-slate-400 text-sm">No hay eventos registrados.</div>
            ) : (
              <div className="divide-y divide-slate-100">
                {timeline.map(ev => (
                  <div key={ev.id} className="flex items-start gap-4 px-5 py-3">
                    <span className="text-xs font-mono text-slate-400 flex-shrink-0 mt-0.5 w-12">{ev.time}</span>
                    <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                      ev.type === 'decision' ? 'bg-red-500' :
                      ev.type === 'comunicacion' ? 'bg-blue-500' :
                      ev.type === 'actuacion' ? 'bg-teal-500' :
                      'bg-slate-400'
                    }`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-slate-800">{ev.event}</p>
                      <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-0.5 text-xs text-slate-400">
                        <span>{ev.user}</span>
                        <span className="font-semibold text-slate-500">{ev.result}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            {[
              { label: 'Escenario simulado', value: scenario ? SCENARIO_LABELS[scenario.id] : '—' },
              { label: 'Actuaciones completadas', value: `${actionsCompleted}/${actions.length}` },
              { label: 'Comunicaciones enviadas', value: `${comms.length}` },
              { label: 'Estado', value: 'Simulacro completado', highlight: true },
            ].map(item => (
              <div key={item.label} className={`rounded-xl border p-3 ${item.highlight ? 'bg-emerald-50 border-emerald-200' : 'bg-slate-50 border-slate-200'}`}>
                <p className="text-slate-500">{item.label}</p>
                <p className={`font-bold mt-0.5 ${item.highlight ? 'text-emerald-700' : 'text-slate-800'}`}>{item.value}</p>
              </div>
            ))}
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-800">
            <p className="font-bold mb-0.5">Fin del simulacro</p>
            <p>Todos los eventos registrados son ficticios y tienen únicamente valor formativo. Para exportar el informe del simulacro o registrarlo en el Archivo Técnico, contacte con el administrador del sistema.</p>
          </div>

          <button onClick={reset} className="flex items-center gap-2 px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white text-sm font-bold rounded-xl transition-colors">
            <RotateCw size={13} /> Nuevo simulacro
          </button>
        </div>
      )}
    </div>
  );
}
