import { useState } from 'react';
import { useDamSelection } from '../contexts/DamSelectionContext';
import { AlertTriangle, Activity, Radio, Shield, ClipboardList, Send, BookOpen, ChevronRight, Settings, Zap } from 'lucide-react';
import type { EmergencyState, EmergencyAction, Recipient, CommunicationRecord } from './emergency/types';
import {
  INITIAL_EMERGENCY_STATE,
  MOCK_INDICATORS,
  MOCK_ACTIONS_ESC0,
  MOCK_RECIPIENTS,
  MOCK_COMMS,
  MOCK_TIMELINE,
} from './emergency/mockData';
import Screen1Situacion from './emergency/Screen1Situacion';
import Screen2Declaracion from './emergency/Screen2Declaracion';
import Screen3Actuaciones from './emergency/Screen3Actuaciones';
import Screen4Comunicacion from './emergency/Screen4Comunicacion';
import Screen5Registro from './emergency/Screen5Registro';
import ScreenConfigPlan from './emergency/ScreenConfigPlan';
import ScreenSimulacro from './emergency/ScreenSimulacro';

type Screen = 'situacion' | 'declaracion' | 'actuaciones' | 'comunicacion' | 'registro' | 'sirenas' | 'config' | 'simulacro';

const SIRENAS = [
  { id: 's1',  code: 'SIR-001', name: 'Núcleo urbano Hornachuelos',   status: 'operativa',  lastCheck: '2026-05-12' },
  { id: 's2',  code: 'SIR-002', name: 'Urb. Las Jaras',               status: 'operativa',  lastCheck: '2026-05-12' },
  { id: 's3',  code: 'SIR-003', name: 'Aldea El Bembézar',            status: 'degradada',  lastCheck: '2026-05-10' },
  { id: 's4',  code: 'SIR-004', name: 'Cortijo La Palma',             status: 'operativa',  lastCheck: '2026-05-12' },
  { id: 's5',  code: 'SIR-005', name: 'Núcleo Palma del Río',         status: 'operativa',  lastCheck: '2026-05-12' },
  { id: 's6',  code: 'SIR-006', name: 'Camping Río Retortillo',       status: 'operativa',  lastCheck: '2026-05-11' },
  { id: 's7',  code: 'SIR-007', name: 'Polígono Industrial Norte',    status: 'operativa',  lastCheck: '2026-05-12' },
  { id: 's8',  code: 'SIR-008', name: 'Aldea El Villar',              status: 'operativa',  lastCheck: '2026-05-12' },
  { id: 's9',  code: 'SIR-009', name: 'Cortijo Los Cipreses',         status: 'fallo',      lastCheck: '2026-05-08' },
  { id: 's10', code: 'SIR-010', name: 'Núcleo Posadas',               status: 'operativa',  lastCheck: '2026-05-12' },
];

const STEPS: { id: Screen; label: string; shortLabel: string; icon: React.ReactNode }[] = [
  { id: 'situacion',   label: 'Panel de situación',          shortLabel: 'Situación',   icon: <Activity size={16} /> },
  { id: 'declaracion', label: 'Propuesta y declaración',     shortLabel: 'Declaración', icon: <Shield size={16} /> },
  { id: 'actuaciones', label: 'Actuaciones recomendadas',    shortLabel: 'Actuaciones', icon: <ClipboardList size={16} /> },
  { id: 'comunicacion',label: 'Comunicación del escenario',  shortLabel: 'Comunicación',icon: <Send size={16} /> },
  { id: 'registro',    label: 'Registro de emergencia',      shortLabel: 'Registro',    icon: <BookOpen size={16} /> },
];

const sirenStatusConfig = {
  operativa: { label: 'Operativa', cls: 'bg-emerald-100 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500' },
  degradada:  { label: 'Degradada', cls: 'bg-amber-100 text-amber-700 border-amber-200',       dot: 'bg-amber-500' },
  fallo:      { label: 'Fallo',     cls: 'bg-red-100 text-red-700 border-red-200',              dot: 'bg-red-500' },
};

export default function EmergencyManagement() {
  const { selectedDam } = useDamSelection();

  const [activeScreen, setActiveScreen] = useState<Screen>('situacion');
  const [emergencyState, setEmergencyState] = useState<EmergencyState>(INITIAL_EMERGENCY_STATE);
  const [actions, setActions] = useState<EmergencyAction[]>(MOCK_ACTIONS_ESC0);
  const [recipients, setRecipients] = useState<Recipient[]>(MOCK_RECIPIENTS);
  const [comms, setComms] = useState<CommunicationRecord[]>(MOCK_COMMS);

  if (!selectedDam) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center">
        <div className="w-16 h-16 rounded-2xl bg-amber-100 flex items-center justify-center mb-4">
          <AlertTriangle className="text-amber-500" size={32} />
        </div>
        <p className="text-slate-800 font-bold text-lg mb-1">Sin presa seleccionada</p>
        <p className="text-slate-500 text-sm">Seleccione una presa en el selector superior para acceder al Plan de Emergencia.</p>
      </div>
    );
  }

  const handleDeclare = (update: Partial<EmergencyState>) => {
    setEmergencyState(prev => ({ ...prev, ...update }));
  };

  const handleUpdateAction = (id: string, update: Partial<EmergencyAction>) => {
    setActions(prev => prev.map(a => a.id === id ? { ...a, ...update } : a));
  };

  const handleToggleRecipient = (id: string) => {
    setRecipients(prev => prev.map(r => r.id === id ? { ...r, selected: !r.selected } : r));
  };

  const handleSend = () => {
    setComms(MOCK_COMMS);
  };

  const stepIndex = STEPS.findIndex(s => s.id === activeScreen);

  return (
    <div className="flex h-full min-h-screen bg-slate-50 -mx-4 -mt-4 sm:-mx-6 sm:-mt-6">
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 bg-slate-900 flex flex-col">
        {/* Header sidebar */}
        <div className="px-5 py-5 border-b border-slate-800">
          <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">Plan de Emergencia</p>
          <p className="text-white font-bold text-sm leading-tight">{selectedDam.name}</p>
          <div className={`mt-2 inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full ${
            emergencyState.active
              ? 'bg-red-600 text-white animate-pulse'
              : 'bg-slate-700 text-slate-300'
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${emergencyState.active ? 'bg-white' : 'bg-slate-500'}`} />
            {emergencyState.active ? 'Emergencia activa' : 'Situación normal'}
          </div>
        </div>

        {/* Steps */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          <p className="text-xs font-bold uppercase tracking-widest text-slate-500 px-2 mb-3">Flujo operativo</p>
          {STEPS.map((step, idx) => {
            const isActive = activeScreen === step.id;
            const isPast = idx < stepIndex;
            return (
              <button
                key={step.id}
                onClick={() => setActiveScreen(step.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white'
                    : isPast
                    ? 'text-slate-300 hover:bg-slate-800'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                }`}
              >
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                  isActive ? 'bg-blue-500 text-white' :
                  isPast  ? 'bg-emerald-600 text-white' :
                  'bg-slate-700 text-slate-400'
                }`}>
                  {isPast ? '✓' : idx + 1}
                </div>
                <span className="text-sm font-medium leading-tight flex-1">{step.label}</span>
                {isActive && <ChevronRight size={14} className="flex-shrink-0 opacity-70" />}
              </button>
            );
          })}

          <div className="pt-4 mt-2 border-t border-slate-800">
            <p className="text-xs font-bold uppercase tracking-widest text-slate-500 px-2 mb-3">Recursos</p>
            <button
              onClick={() => setActiveScreen('sirenas')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all ${
                activeScreen === 'sirenas'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                activeScreen === 'sirenas' ? 'bg-blue-500' : 'bg-slate-700'
              }`}>
                <Radio size={12} className="text-white" />
              </div>
              <span className="text-sm font-medium">Equipos de aviso</span>
            </button>

            <button
              onClick={() => setActiveScreen('config')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all ${
                activeScreen === 'config'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                activeScreen === 'config' ? 'bg-blue-500' : 'bg-slate-700'
              }`}>
                <Settings size={12} className="text-white" />
              </div>
              <span className="text-sm font-medium">Configuración del Plan</span>
            </button>

            <button
              onClick={() => setActiveScreen('simulacro')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all ${
                activeScreen === 'simulacro'
                  ? 'bg-amber-600 text-white'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                activeScreen === 'simulacro' ? 'bg-amber-500' : 'bg-slate-700'
              }`}>
                <Zap size={12} className="text-white" />
              </div>
              <span className="text-sm font-medium">Simulacro</span>
            </button>
          </div>
        </nav>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-slate-800 text-xs text-slate-500">
          Plan aprobado: 15/03/2024 · Rev. 2
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <div className="max-w-6xl mx-auto px-6 py-6">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-5">
            <span>Emergencias</span>
            <ChevronRight size={12} />
            <span className="font-semibold text-slate-700">
              {STEPS.find(s => s.id === activeScreen)?.label ||
              (activeScreen === 'config' ? 'Configuración del Plan' :
               activeScreen === 'simulacro' ? 'Simulacro' : 'Equipos de aviso')}
            </span>
          </div>

          {activeScreen === 'situacion' && (
            <Screen1Situacion
              dam={selectedDam}
              state={emergencyState}
              indicators={MOCK_INDICATORS}
              onReview={() => setActiveScreen('declaracion')}
            />
          )}

          {activeScreen === 'declaracion' && (
            <Screen2Declaracion
              state={emergencyState}
              indicators={MOCK_INDICATORS}
              onDeclare={handleDeclare}
              onNext={() => setActiveScreen('actuaciones')}
            />
          )}

          {activeScreen === 'actuaciones' && (
            <Screen3Actuaciones
              state={emergencyState}
              actions={actions}
              onUpdateAction={handleUpdateAction}
              onNext={() => setActiveScreen('comunicacion')}
            />
          )}

          {activeScreen === 'comunicacion' && (
            <Screen4Comunicacion
              dam={selectedDam}
              state={emergencyState}
              recipients={recipients}
              comms={comms}
              onToggleRecipient={handleToggleRecipient}
              onSend={handleSend}
              onNext={() => setActiveScreen('registro')}
            />
          )}

          {activeScreen === 'registro' && (
            <Screen5Registro timeline={MOCK_TIMELINE} />
          )}

          {activeScreen === 'sirenas' && (
            <SirenasPanel />
          )}

          {activeScreen === 'config' && (
            <ScreenConfigPlan />
          )}

          {activeScreen === 'simulacro' && (
            <ScreenSimulacro />
          )}
        </div>
      </main>
    </div>
  );
}

function SirenasPanel() {
  const [testing, setTesting] = useState<string | null>(null);

  const handleTest = (id: string) => {
    setTesting(id);
    setTimeout(() => setTesting(null), 2000);
  };

  const operativas = SIRENAS.filter(s => s.status === 'operativa').length;
  const degradadas = SIRENAS.filter(s => s.status === 'degradada').length;
  const fallos     = SIRENAS.filter(s => s.status === 'fallo').length;

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm text-center">
          <p className="text-2xl font-bold text-emerald-600">{operativas}</p>
          <p className="text-xs text-slate-500 mt-0.5">Operativas</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm text-center">
          <p className="text-2xl font-bold text-amber-600">{degradadas}</p>
          <p className="text-xs text-slate-500 mt-0.5">Degradadas</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm text-center">
          <p className="text-2xl font-bold text-red-600">{fallos}</p>
          <p className="text-xs text-slate-500 mt-0.5">Con fallo</p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
          <h3 className="font-bold text-slate-800 flex items-center gap-2">
            <Radio size={18} className="text-blue-600" />
            Equipos de aviso — Sistema de sirenas
          </h3>
          <span className="text-xs text-slate-400">{SIRENAS.length} sirenas configuradas</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Código</th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Ubicación</th>
                <th className="text-center px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Estado</th>
                <th className="text-center px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Último check</th>
                <th className="text-center px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {SIRENAS.map(s => {
                const sc = sirenStatusConfig[s.status as keyof typeof sirenStatusConfig];
                return (
                  <tr key={s.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 font-mono text-xs font-bold text-slate-600">{s.code}</td>
                    <td className="px-4 py-3 font-medium text-slate-800">{s.name}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border ${sc.cls}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
                        {sc.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center text-slate-500 text-xs">{s.lastCheck}</td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleTest(s.id)}
                          disabled={testing === s.id || s.status === 'fallo'}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 disabled:bg-slate-50 disabled:text-slate-300 text-blue-700 text-xs font-semibold rounded-lg transition-colors"
                        >
                          <Activity size={12} className={testing === s.id ? 'animate-pulse' : ''} />
                          {testing === s.id ? 'Probando...' : 'Autodiagnóstico'}
                        </button>
                        <button className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-semibold rounded-lg transition-colors">
                          Activar
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Info */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
        <p className="font-semibold mb-1">Aviso importante</p>
        <p className="text-xs">La activación de sirenas en emergencia real debe realizarse bajo autorización del Director/a del Plan de Emergencia. El autodiagnóstico no genera avisos sonoros en la zona afectada.</p>
      </div>
    </div>
  );
}
