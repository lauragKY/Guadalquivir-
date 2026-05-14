export type EmergencyScenario = 'normalidad' | 'extraordinaria' | 'escenario_0' | 'escenario_1' | 'escenario_2' | 'escenario_3';
export type EmergencyCause = 'hidrologica' | 'auscultacion' | 'sismo' | 'inspeccion' | 'equipos_aviso' | 'presa_aguas_arriba' | 'otro';
export type IndicatorStatus = 'normal' | 'superado' | 'pendiente_validacion' | 'no_aplica';
export type ActionStatus = 'pendiente' | 'en_curso' | 'realizada' | 'no_aplica';
export type CommStatus = 'borrador' | 'enviado' | 'acuse_recibido' | 'fallido';

export interface Indicator {
  id: string;
  name: string;
  value: string;
  threshold: string;
  evaluation: 'Cuantitativa' | 'Cualitativa';
  status: IndicatorStatus;
  unit?: string;
  cause?: EmergencyCause;
}

export interface EmergencyAction {
  id: string;
  num: number;
  name: string;
  responsible: string;
  procedure: string;
  personnel: string;
  resources: string;
  type: 'inspeccion' | 'ejecucion';
  status: ActionStatus;
  observations: string;
  startedAt?: string;
  completedAt?: string;
}

export interface Recipient {
  id: string;
  name: string;
  role: string;
  email: string;
  selected: boolean;
  required: boolean;
}

export interface CommunicationRecord {
  id: string;
  recipient: string;
  sentAt?: string;
  ackAt?: string;
  status: CommStatus;
  method: string;
}

export interface TimelineEvent {
  id: string;
  time: string;
  event: string;
  user: string;
  result: string;
  type: 'sistema' | 'decision' | 'comunicacion' | 'actuacion';
}

export interface EmergencyState {
  scenario: EmergencyScenario;
  cause: EmergencyCause | null;
  proposedScenario: EmergencyScenario;
  proposedCause: EmergencyCause | null;
  proposedConfidence: 'alta' | 'media' | 'requiere_validacion';
  declaredAt?: string;
  declaredBy?: string;
  declarationReason?: string;
  active: boolean;
}

export const SCENARIO_LABELS: Record<EmergencyScenario, string> = {
  normalidad: 'Normalidad',
  extraordinaria: 'Situación Extraordinaria',
  escenario_0: 'Escenario 0',
  escenario_1: 'Escenario 1',
  escenario_2: 'Escenario 2',
  escenario_3: 'Escenario 3',
};

export const SCENARIO_COLORS: Record<EmergencyScenario, { bg: string; text: string; border: string; badge: string }> = {
  normalidad:      { bg: 'bg-emerald-50',  text: 'text-emerald-800', border: 'border-emerald-300', badge: 'bg-emerald-100 text-emerald-800' },
  extraordinaria:  { bg: 'bg-amber-50',    text: 'text-amber-800',   border: 'border-amber-300',   badge: 'bg-amber-100 text-amber-800' },
  escenario_0:     { bg: 'bg-yellow-50',   text: 'text-yellow-800',  border: 'border-yellow-400',  badge: 'bg-yellow-100 text-yellow-900' },
  escenario_1:     { bg: 'bg-orange-50',   text: 'text-orange-800',  border: 'border-orange-400',  badge: 'bg-orange-100 text-orange-900' },
  escenario_2:     { bg: 'bg-red-50',      text: 'text-red-800',     border: 'border-red-400',     badge: 'bg-red-100 text-red-900' },
  escenario_3:     { bg: 'bg-red-100',     text: 'text-red-900',     border: 'border-red-600',     badge: 'bg-red-700 text-white' },
};

export const CAUSE_LABELS: Record<EmergencyCause, string> = {
  hidrologica:          'Eventos hidrológicos',
  auscultacion:         'Auscultación',
  sismo:                'Sismo',
  inspeccion:           'Inspección visual',
  equipos_aviso:        'Equipos de aviso',
  presa_aguas_arriba:   'Presa aguas arriba',
  otro:                 'Otro',
};
