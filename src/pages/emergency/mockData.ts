import type {
  Indicator, EmergencyAction, Recipient, CommunicationRecord, TimelineEvent, EmergencyState,
} from './types';

export const MOCK_INDICATORS: Indicator[] = [
  { id: 'i1', name: 'Nivel de embalse', value: '383,95 m', threshold: '383,50 m', evaluation: 'Cuantitativa', status: 'superado',             unit: 'm',      cause: 'hidrologica' },
  { id: 'i2', name: 'Caudal entrante',  value: '480 m³/s', threshold: '450 m³/s', evaluation: 'Cuantitativa', status: 'superado',              unit: 'm³/s',   cause: 'hidrologica' },
  { id: 'i3', name: 'Precipitación 24h', value: '74 mm',   threshold: '70 mm',    evaluation: 'Cuantitativa', status: 'superado',              unit: 'mm',     cause: 'hidrologica' },
  { id: 'i4', name: 'Piezómetro P-07',  value: '43,2 m',   threshold: '48,0 m',   evaluation: 'Cuantitativa', status: 'normal',               unit: 'm',      cause: 'auscultacion' },
  { id: 'i5', name: 'Aceleración sísmica', value: '0,008 g', threshold: '0,05 g',  evaluation: 'Cuantitativa', status: 'normal',              unit: 'g',      cause: 'sismo' },
  { id: 'i6', name: 'Inspección visual', value: 'Pendiente', threshold: '—',        evaluation: 'Cualitativa',  status: 'pendiente_validacion', cause: 'inspeccion' },
  { id: 'i7', name: 'Estado sirenas',   value: '8/10 operativas', threshold: '—',   evaluation: 'Cualitativa',  status: 'normal',              cause: 'equipos_aviso' },
  { id: 'i8', name: 'Presa aguas arriba', value: 'Sin novedad', threshold: '—',     evaluation: 'Cualitativa',  status: 'normal',              cause: 'presa_aguas_arriba' },
];

export const MOCK_ACTIONS_ESC0: EmergencyAction[] = [
  { id: 'a1', num: 1, name: 'Vigilancia permanente del nivel del embalse', responsible: 'Adjunto/a al Director/a del Plan', procedure: 'PV-1', personnel: 'Auxiliar de Auscultación', resources: 'Equipo de medición, teléfono', type: 'inspeccion', status: 'en_curso',  observations: 'Lecturas cada 30 min.' },
  { id: 'a2', num: 2, name: 'Prueba de desagües y toma hidroeléctrica',    responsible: 'Jefe/a de Inspección y Equipos', procedure: 'PV-6', personnel: 'Auxiliar de Equipos', resources: 'Sistemas de control, HMI', type: 'ejecucion',  status: 'pendiente', observations: '' },
  { id: 'a3', num: 3, name: 'Prueba de grupos electrógenos',                responsible: 'Jefe/a de Inspección y Equipos', procedure: 'PV-7', personnel: 'Auxiliar de Equipos', resources: 'Grupos electrógenos', type: 'ejecucion',  status: 'pendiente', observations: '' },
  { id: 'a4', num: 4, name: 'Inspección visual de la presa y aliviadero',  responsible: 'Jefe/a de Inspección y Equipos', procedure: 'PV-2', personnel: 'Auxiliar de Auscultación + Auxiliar de Equipos', resources: 'Medios de protección individual', type: 'inspeccion', status: 'pendiente', observations: '' },
  { id: 'a5', num: 5, name: 'Notificación al Director/a del Plan',          responsible: 'Adjunto/a al Director/a del Plan', procedure: 'PC-1', personnel: 'Auxiliar de Comunicaciones', resources: 'Teléfono, radio', type: 'ejecucion', status: 'realizada', observations: 'Notificado a las 09:12 h.', completedAt: '09:12' },
  { id: 'a6', num: 6, name: 'Activación del sistema de auscultación automática', responsible: 'Adjunto/a al Director/a del Plan', procedure: 'PV-3', personnel: 'Auxiliar de Auscultación', resources: 'SCADA, red de sensores', type: 'ejecucion', status: 'realizada', observations: 'Sistema activado.', completedAt: '09:14' },
];

export const MOCK_RECIPIENTS: Recipient[] = [
  { id: 'r1', name: 'Centro de Control de Sevilla / SAIH', role: 'Organismo de cuenca', email: 'saih.guadalquivir@chguadalquivir.es', selected: true,  required: true },
  { id: 'r2', name: 'Jefe/a del Área de Explotación',      role: 'Responsable interno', email: 'explotacion@chguadalquivir.es',      selected: true,  required: true },
  { id: 'r3', name: 'Comité Permanente',                   role: 'Órgano directivo',    email: 'comite@chguadalquivir.es',           selected: true,  required: true },
  { id: 'r4', name: '112 Andalucía',                       role: 'Protección Civil',    email: 'emergencias@juntadeandalucia.es',    selected: false, required: false },
  { id: 'r5', name: 'Dirección General del Agua',          role: 'Administración',      email: 'dga@miteco.gob.es',                  selected: false, required: false },
  { id: 'r6', name: 'Presa aguas abajo',                   role: 'Coordinación',        email: 'aguasabajo@chguadalquivir.es',       selected: false, required: false },
  { id: 'r7', name: 'Delegación del Gobierno en Andalucía', role: 'Administración',     email: 'delegacion.andalucia@mpr.gob.es',    selected: false, required: false },
];

export const MOCK_COMMS: CommunicationRecord[] = [
  { id: 'c1', recipient: 'Centro de Control Sevilla / SAIH', method: 'Correo electrónico', sentAt: '09:20', ackAt: '09:31', status: 'acuse_recibido' },
  { id: 'c2', recipient: 'Jefe/a Área de Explotación',       method: 'Correo electrónico', sentAt: '09:20', status: 'enviado' },
  { id: 'c3', recipient: 'Comité Permanente',                 method: 'Correo electrónico', sentAt: '09:20', status: 'enviado' },
];

export const MOCK_TIMELINE: TimelineEvent[] = [
  { id: 't1', time: '09:08', event: 'Superado umbral nivel embalse (383,95 m > 383,50 m)',    user: 'Sistema SIPRESAS',          result: 'Propuesta Escenario 0',   type: 'sistema' },
  { id: 't2', time: '09:09', event: 'Superado umbral caudal entrante (480 m³/s)',             user: 'Sistema SIPRESAS',          result: 'Propuesta confirmada',    type: 'sistema' },
  { id: 't3', time: '09:10', event: 'Superado umbral precipitación 24h (74 mm)',              user: 'Sistema SIPRESAS',          result: 'Confianza: Alta',         type: 'sistema' },
  { id: 't4', time: '09:12', event: 'Propuesta de Escenario 0 revisada',                        user: 'Dir. del Plan — J. García', result: 'Propuesta aceptada',      type: 'decision' },
  { id: 't5', time: '09:17', event: 'Declarado Escenario 0 — Causa: Eventos hidrológicos',      user: 'Dir. del Plan — J. García', result: 'Emergencia activa',       type: 'decision' },
  { id: 't6', time: '09:18', event: 'Actuación PV-1 iniciada (vigilancia nivel embalse)',        user: 'Aux. Auscultación',         result: 'En curso',                type: 'actuacion' },
  { id: 't7', time: '09:20', event: 'Comunicación F-2 enviada a 3 destinatarios',                user: 'Aux. Comunicaciones',       result: 'Pendiente acuse',         type: 'comunicacion' },
  { id: 't8', time: '09:31', event: 'Acuse de recibo — Centro de Control Sevilla / SAIH',        user: 'Sistema (email)',           result: 'Confirmado',              type: 'comunicacion' },
  { id: 't9', time: '09:40', event: 'Actuación PV-6 iniciada (prueba desagües)',                  user: 'Jefe/a Inspección',         result: 'En curso',                type: 'actuacion' },
];

export const INITIAL_EMERGENCY_STATE: EmergencyState = {
  scenario: 'normalidad',
  cause: null,
  proposedScenario: 'escenario_0',
  proposedCause: 'hidrologica',
  proposedConfidence: 'alta',
  active: false,
};
