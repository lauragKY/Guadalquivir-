import type {
  BimElement, BimModel, BimAlert, BimHistoricEvent, BimAuditEntry,
  ModuleIntegration, SimulationScenario, DamGlobalStatus
} from './types';

export const CURRENT_DATE = '19/05/2026';
export const DAM_NAME = 'Presa de Guadalmena';
export const DAM_CODE = 'GQ-012';
export const DAM_STATUS: DamGlobalStatus = 'extraordinary';

// ─── BIM Elements ─────────────────────────────────────────────────────────────

export const BIM_ELEMENTS: BimElement[] = [
  // ── Cuerpo de presa (polygon)
  {
    id: 'E-001', code: 'EST-CUE-001', uuid: 'bim-0001-00aa-1111-aa11111aaaaa',
    name: 'Cuerpo de Presa', category: 'structure', asset_type: 'Estructura de hormigón',
    location: 'Cuerpo principal · Toda la sección', status: 'operational',
    criticality: 'critical', module_origin: 'Inventario / Explotación', last_updated: '02/04/2026',
    description: 'Cuerpo principal de presa de gravedad de hormigón en masa. H=78m, coronación 380m.',
    x: 120, y: 160, width: 360, height: 200, svgType: 'polygon',
    points: '120,360 200,155 400,155 480,360',
    layers: ['inventory', 'maintenance', 'exploitation'],
    inventory_ref: 'INV-EST-001', inv_type: 'Presa de gravedad', inv_manufacturer: 'DRAGADOS S.A.',
    inv_model: '—', inv_serial: '—', inv_install_date: '15/06/1995', inv_location_func: 'Eje principal',
    maint_status: 'Al día', maint_last_date: '10/05/2026', maint_last_pdf: '#', maint_last_pdf_name: 'Inspeccion_semestral_CUE_001.pdf',
    maint_next_date: '10/11/2026', maint_open_incidents: 0, maint_total_parts: 18,
    expl_status: 'S. Extraordinaria activa · Avenida en curso',
    archive_docs: [
      { id: 'd1', name: 'Plano sección transversal', type: 'PDF', size: '4.2 MB', date: '2018', critical: false, path: 'Archivo Técnico > BIM > Guadalmena > Planos' },
      { id: 'd2', name: 'Memoria constructiva presa', type: 'PDF', size: '18 MB', date: '1995', critical: true, path: 'Archivo Técnico > BIM > Guadalmena > Documentos' },
      { id: 'd3', name: 'Guadalmena_BIM_IFC_v1.ifc', type: 'IFC', size: '1.24 GB', date: '20/03/2026', critical: true, path: 'Archivo Técnico > BIM > Guadalmena > Modelos originales' },
    ],
    historic: [
      { id: 'h1', date: '10/05/2026', time: '11:15', user: 'Carmen Rodríguez', role: 'maintenance_tech', module: 'Mantenimiento', action: 'Inspección semestral', result: 'Sin anomalías detectadas. Parte cerrado.' },
      { id: 'h2', date: '14/05/2026', time: '16:22', user: 'Ana García López', role: 'director', module: 'Explotación', action: 'S.E. declarada', result: 'Avenida en curso. Aliviadero operativo.' },
    ],
  },
  // ── Coronación
  {
    id: 'E-002', code: 'EST-COR-001', uuid: 'bim-0002-00bb-2222-bb22222bbbbb',
    name: 'Coronación y vía de servicio', category: 'structure', asset_type: 'Coronación',
    location: 'Cota 610.00m · Toda la longitud', status: 'operational',
    criticality: 'medium', module_origin: 'Inventario', last_updated: '20/01/2026',
    description: 'Coronación de la presa. Cota 610.00m. Vía de servicio y acceso a equipos. Ancho 8.5m.',
    x: 195, y: 145, width: 210, height: 18, svgType: 'rect',
    layers: ['inventory', 'maintenance'],
    inventory_ref: 'INV-EST-002', inv_type: 'Coronación', inv_manufacturer: 'DRAGADOS S.A.',
    inv_install_date: '15/06/1995', inv_location_func: 'Cota 610.00m',
    maint_status: 'Al día', maint_last_date: '20/01/2026', maint_next_date: '20/07/2026',
    maint_open_incidents: 0, maint_total_parts: 8,
    archive_docs: [
      { id: 'd1', name: 'Plano coronación', type: 'DWG', size: '1.1 MB', date: '2018', critical: false, path: 'Archivo Técnico > BIM > Guadalmena > Planos' },
    ],
    historic: [
      { id: 'h1', date: '20/01/2026', time: '09:00', user: 'Miguel Torres', role: 'maintenance_tech', module: 'Mantenimiento', action: 'Revisión vía de servicio', result: 'Correcto. Sin fisuras.' },
    ],
  },
  // ── Compuerta nº1 (aliviadero)
  {
    id: 'E-003', code: 'ORG-CMP-001', uuid: 'bim-0003-00cc-3333-cc33333ccccc',
    name: 'Compuerta nº1 (Aliviadero)', category: 'organ', asset_type: 'Compuerta Taintor',
    location: 'Aliviadero · Vano 1 · Cota umbral 607.00m', status: 'operational',
    criticality: 'critical', module_origin: 'Explotación / Mantenimiento', last_updated: '05/05/2026',
    description: 'Compuerta Taintor 12×8m. Accionamiento electrohidráulico. Vano central aliviadero.',
    x: 248, y: 132, width: 30, height: 28, svgType: 'rect',
    layers: ['inventory', 'maintenance', 'exploitation'],
    inventory_ref: 'INV-CMP-001', inv_type: 'Compuerta Taintor', inv_manufacturer: 'HIDROSTANK S.A.',
    inv_model: 'TN-1200', inv_serial: 'HS-2003-0421', inv_install_date: '10/04/2003', inv_location_func: 'Aliviadero · Vano 1',
    maint_status: 'Al día', maint_last_date: '05/05/2026', maint_last_pdf: '#', maint_last_pdf_name: 'Parte_OT-2026-012_Compuerta_1.pdf',
    maint_next_date: '05/11/2026', maint_open_incidents: 0, maint_total_parts: 24,
    expl_status: 'Operativa · Abierta al 40% · Q=90 m³/s',
    archive_docs: [
      { id: 'd1', name: 'Manual compuerta Taintor TN-1200', type: 'PDF', size: '8.4 MB', date: '2003', critical: false, path: 'Archivo Técnico > BIM > Guadalmena > Manuales' },
      { id: 'd2', name: 'Parte_OT-2026-012_Compuerta_1.pdf', type: 'PDF', size: '1.1 MB', date: '05/05/2026', critical: false, path: 'Archivo Técnico > Mantenimiento > Partes' },
    ],
    historic: [
      { id: 'h1', date: '05/05/2026', time: '14:00', user: 'Miguel Torres', role: 'maintenance_tech', module: 'Mantenimiento', action: 'Revisión semestral', result: 'Correcto. Parte OT-2026-012 cerrado.' },
      { id: 'h2', date: '08/05/2026', time: '17:00', user: 'Ana García López', role: 'director', module: 'Explotación', action: 'Apertura para laminación', result: 'Abierta al 40%. S.E. activa.' },
    ],
  },
  // ── Compuerta nº2 (aliviadero) — revisión pendiente
  {
    id: 'E-004', code: 'ORG-CMP-002', uuid: 'bim-0004-00dd-4444-dd44444ddddd',
    name: 'Compuerta nº2 (Aliviadero)', category: 'organ', asset_type: 'Compuerta Taintor',
    location: 'Aliviadero · Vano 2 · Cota umbral 607.00m', status: 'revision_pending',
    criticality: 'critical', module_origin: 'Mantenimiento', last_updated: '10/02/2026',
    description: 'Compuerta Taintor 12×8m. Vano 2. Revisión semestral vencida. OT-2026-018 pendiente.',
    x: 322, y: 132, width: 30, height: 28, svgType: 'rect',
    layers: ['inventory', 'maintenance', 'exploitation'],
    inventory_ref: 'INV-CMP-002', inv_type: 'Compuerta Taintor', inv_manufacturer: 'HIDROSTANK S.A.',
    inv_model: 'TN-1200', inv_serial: 'HS-2003-0422', inv_install_date: '10/04/2003', inv_location_func: 'Aliviadero · Vano 2',
    maint_status: 'Revisión pendiente · OT-2026-018', maint_last_date: '10/02/2026',
    maint_last_pdf: '#', maint_last_pdf_name: 'Parte_OT-2026-014_Compuerta_2.pdf',
    maint_next_date: '10/05/2026', maint_open_incidents: 1, maint_total_parts: 22,
    expl_status: 'Cerrada · Revisión pendiente',
    archive_docs: [
      { id: 'd1', name: 'Parte_OT-2026-014_Compuerta_2.pdf', type: 'PDF', size: '1.2 MB', date: '10/02/2026', critical: false, path: 'Archivo Técnico > Mantenimiento > Partes' },
      { id: 'd2', name: 'Manual compuerta Taintor TN-1200', type: 'PDF', size: '8.4 MB', date: '2003', critical: false, path: 'Archivo Técnico > BIM > Guadalmena > Manuales' },
    ],
    historic: [
      { id: 'h1', date: '10/02/2026', time: '15:30', user: 'Miguel Torres', role: 'maintenance_tech', module: 'Mantenimiento', action: 'Revisión parcial', result: 'Parte OT-2026-014. Revisión pendiente por acceso limitado.' },
      { id: 'h2', date: '11/05/2026', time: '09:00', user: 'Sistema', role: 'sipresas_admin', module: 'BIM', action: 'Alerta generada', result: 'Revisión vencida. OT-2026-018 generada automáticamente.' },
    ],
  },
  // ── Desagüe de fondo — revisión pendiente
  {
    id: 'E-005', code: 'ORG-DES-001', uuid: 'bim-0005-00ee-5555-ee55555eeeee',
    name: 'Desagüe de fondo', category: 'organ', asset_type: 'Válvula de guarda DN-1200',
    location: 'Galería cota 535.00m', status: 'revision_pending',
    criticality: 'critical', module_origin: 'Mantenimiento / Explotación', last_updated: '10/02/2026',
    description: 'Desagüe de fondo DN-1200. Válvulas de guarda y regulación. Revisión semestral vencida.',
    x: 155, y: 295, width: 55, height: 28, svgType: 'rect',
    layers: ['inventory', 'maintenance', 'exploitation'],
    inventory_ref: 'INV-ORG-001', inv_type: 'Válvula de guarda', inv_manufacturer: 'REXROTH',
    inv_model: 'DN-1200 VG', inv_serial: 'RX-1999-0087', inv_install_date: '01/01/1999', inv_location_func: 'Galería de desagüe · Cota 535m',
    maint_status: 'Revisión vencida · OT-2026-018', maint_last_date: '10/02/2026',
    maint_last_pdf: '#', maint_last_pdf_name: 'Inspeccion_desague_fondo_feb26.pdf',
    maint_next_date: '10/05/2026', maint_open_incidents: 1, maint_total_parts: 15,
    expl_status: 'Cerrado · Acceso condicionado',
    archive_docs: [
      { id: 'd1', name: 'Plano_Galeria_Desague.pdf', type: 'PDF', size: '3.8 MB', date: '2018', critical: false, path: 'Archivo Técnico > BIM > Guadalmena > Planos' },
      { id: 'd2', name: 'Manual válvula DN-1200', type: 'PDF', size: '6.2 MB', date: '1999', critical: false, path: 'Archivo Técnico > BIM > Guadalmena > Manuales' },
    ],
    historic: [
      { id: 'h1', date: '10/02/2026', time: '10:00', user: 'Miguel Torres', role: 'maintenance_tech', module: 'Mantenimiento', action: 'Revisión semestral', result: 'Completada parcialmente. Revisión OT-2026-018 pendiente.' },
    ],
  },
  // ── Grupo electrógeno — FALLO CRÍTICO
  {
    id: 'E-006', code: 'MEC-GE-001', uuid: 'bim-0006-00ff-6666-ff66666fffff',
    name: 'Grupo electrógeno principal', category: 'electrical', asset_type: 'Grupo electrógeno',
    location: 'Sala maquinaria · Cota 538.00m', status: 'failure',
    criticality: 'critical', module_origin: 'Mantenimiento', last_updated: '18/05/2026',
    description: 'Grupo electrógeno principal 250kVA. FALLO CRÍTICO: avería en sistema de arranque automático.',
    x: 185, y: 245, width: 48, height: 36, svgType: 'rect',
    layers: ['electrical', 'maintenance', 'safety'],
    inventory_ref: 'INV-MEC-006', inv_type: 'Grupo electrógeno', inv_manufacturer: 'SDMO INDUSTRIES',
    inv_model: 'T250K', inv_serial: 'SD-2015-2234', inv_install_date: '20/03/2015', inv_location_func: 'Sala maquinaria cota 538m',
    maint_status: 'AVERÍA CRÍTICA · OT urgente 2026-023', maint_last_date: '18/05/2026',
    maint_last_pdf: '#', maint_last_pdf_name: 'Averia_GE_principal_18may26.pdf',
    maint_next_date: '20/05/2026', maint_open_incidents: 1, maint_total_parts: 32,
    archive_docs: [
      { id: 'd1', name: 'Manual_Grupo_Electrogeno.pdf', type: 'PDF', size: '14.5 MB', date: '2015', critical: false, path: 'Archivo Técnico > BIM > Guadalmena > Manuales' },
      { id: 'd2', name: 'Averia_GE_principal_18may26.pdf', type: 'PDF', size: '0.8 MB', date: '18/05/2026', critical: true, path: 'Archivo Técnico > Mantenimiento > Partes urgentes' },
    ],
    historic: [
      { id: 'h1', date: '18/05/2026', time: '07:45', user: 'Sistema SCADA', role: 'sipresas_admin', module: 'Mantenimiento', action: 'Alarma automática', result: 'Fallo arranque detectado. OT-2026-023 generada.' },
      { id: 'h2', date: '18/05/2026', time: '08:30', user: 'Miguel Torres', role: 'maintenance_tech', module: 'Mantenimiento', action: 'Diagnóstico in situ', result: 'Avería confirmada. Técnico especialista convocado.' },
    ],
  },
  // ── Cuadro eléctrico — AVERÍA
  {
    id: 'E-007', code: 'MEC-CE-001', uuid: 'bim-0007-0077-7777-777777777777',
    name: 'Cuadro eléctrico general', category: 'electrical', asset_type: 'Cuadro de mando',
    location: 'Sala eléctrica · Cota 610.00m', status: 'failure',
    criticality: 'high', module_origin: 'Mantenimiento', last_updated: '18/05/2026',
    description: 'Cuadro eléctrico principal de mando y protección. Fallo módulo diferencial. OT urgente.',
    x: 420, y: 148, width: 45, height: 30, svgType: 'rect',
    layers: ['electrical', 'maintenance'],
    inventory_ref: 'INV-MEC-007', inv_type: 'Cuadro eléctrico', inv_manufacturer: 'SCHNEIDER ELECTRIC',
    inv_model: 'MV400', inv_serial: 'SE-2010-1122', inv_install_date: '12/06/2010', inv_location_func: 'Sala eléctrica coronación',
    maint_status: 'AVERÍA · OT urgente 2026-024', maint_last_date: '18/05/2026',
    maint_last_pdf: '#', maint_last_pdf_name: 'Averia_cuadro_electrico_18may26.pdf',
    maint_next_date: '19/05/2026', maint_open_incidents: 1, maint_total_parts: 20,
    archive_docs: [
      { id: 'd1', name: 'Averia_cuadro_electrico_18may26.pdf', type: 'PDF', size: '0.6 MB', date: '18/05/2026', critical: true, path: 'Archivo Técnico > Mantenimiento > Partes urgentes' },
    ],
    historic: [
      { id: 'h1', date: '18/05/2026', time: '07:45', user: 'Sistema', role: 'sipresas_admin', module: 'Mantenimiento', action: 'Alarma diferencial', result: 'Fallo detectado. OT-2026-024 generada automáticamente.' },
    ],
  },
  // ── Centro de transformación
  {
    id: 'E-008', code: 'MEC-CT-001', uuid: 'bim-0008-0088-8888-888888888888',
    name: 'Centro de transformación', category: 'electrical', asset_type: 'Transformador MT/BT',
    location: 'Exterior coronación lado izquierdo', status: 'operational',
    criticality: 'high', module_origin: 'Inventario', last_updated: '15/04/2026',
    description: 'Centro de transformación MT/BT 630kVA. Alimentación de todos los equipos de la presa.',
    x: 130, y: 148, width: 45, height: 30, svgType: 'rect',
    layers: ['electrical', 'inventory'],
    inventory_ref: 'INV-MEC-008', inv_type: 'Transformador MT/BT', inv_manufacturer: 'ABB',
    inv_model: 'T630', inv_serial: 'AB-2008-0991', inv_install_date: '01/07/2008', inv_location_func: 'Exterior coronación izquierda',
    maint_status: 'Al día', maint_last_date: '15/04/2026', maint_next_date: '15/10/2026',
    maint_open_incidents: 0, maint_total_parts: 16,
    archive_docs: [
      { id: 'd1', name: 'Manual CT-630 ABB', type: 'PDF', size: '9.2 MB', date: '2008', critical: false, path: 'Archivo Técnico > BIM > Guadalmena > Manuales' },
    ],
    historic: [
      { id: 'h1', date: '15/04/2026', time: '10:30', user: 'Miguel Torres', role: 'maintenance_tech', module: 'Mantenimiento', action: 'Revisión anual', result: 'Correcto. Sin incidencias.' },
    ],
  },
  // ── Galería de inspección
  {
    id: 'E-009', code: 'EST-GAL-001', uuid: 'bim-0009-0099-9999-999999999999',
    name: 'Galería de inspección', category: 'access', asset_type: 'Galería perimetral',
    location: 'Cota 545.00m · L=420m', status: 'operational',
    criticality: 'high', module_origin: 'Inventario / Mantenimiento', last_updated: '15/01/2026',
    description: 'Galería perimetral de inspección cota 545m. Acceso a instrumentación y drenajes.',
    x: 210, y: 285, width: 175, height: 20, svgType: 'rect',
    layers: ['inventory', 'maintenance'],
    inventory_ref: 'INV-EST-009', inv_type: 'Galería de acceso', inv_manufacturer: 'DRAGADOS S.A.',
    inv_install_date: '15/06/1995', inv_location_func: 'Cota 545.00m',
    maint_status: 'Al día', maint_last_date: '15/01/2026', maint_next_date: '15/07/2026',
    maint_open_incidents: 0, maint_total_parts: 12,
    archive_docs: [
      { id: 'd1', name: 'Plano_Galeria_Desague.pdf', type: 'PDF', size: '3.8 MB', date: '2018', critical: false, path: 'Archivo Técnico > BIM > Guadalmena > Planos' },
    ],
    historic: [
      { id: 'h1', date: '15/01/2026', time: '11:00', user: 'Carmen Rodríguez', role: 'maintenance_tech', module: 'Mantenimiento', action: 'Limpieza sumideros', result: 'Completada. Sin obstrucciones.' },
    ],
  },
  // ── Sensor P-14 (piezómetro) — umbral superado
  {
    id: 'E-010', code: 'AUS-PIE-014', uuid: 'bim-0010-00aa-aaaa-aaaaaaaaaa10',
    name: 'Piezómetro P-14', category: 'sensor', asset_type: 'Piezómetro de tubo abierto',
    location: 'Cuerpo presa · Cota 565.00m · Bloque 7', status: 'threshold_exceeded',
    criticality: 'critical', module_origin: 'Auscultación (DAMDATA)', last_updated: '19/05/2026',
    description: 'Piezómetro tubo abierto. Mide presión intersticial zona central. Umbral S.E. superado.',
    x: 278, y: 262, width: 20, height: 20, svgType: 'ellipse',
    layers: ['auscultation', 'safety'],
    ausc_variable: 'Presión intersticial P-14', ausc_value: '2.18', ausc_unit: 'kg/cm²',
    ausc_threshold_se: '2.00', ausc_threshold_e0: '2.50', ausc_status: 'Umbral S.E. superado (+9%)',
    ausc_source: 'DAMDATA', ausc_trend: [1.82, 1.88, 1.92, 1.96, 2.00, 2.05, 2.10, 2.18],
    ausc_trend_dates: ['12/05', '13/05', '14/05', '15/05', '16/05', '17/05', '18/05', '19/05'],
    inventory_ref: 'INV-AUS-010', inv_type: 'Piezómetro', inv_manufacturer: 'SISGEO',
    inv_model: 'OA-P-102', inv_serial: 'SG-2002-0314', inv_install_date: '01/01/2002', inv_location_func: 'Cuerpo presa · Cota 565m · B-7',
    archive_docs: [
      { id: 'd1', name: 'Ficha piezómetro P-14', type: 'PDF', size: '0.9 MB', date: '2022', critical: false, path: 'Archivo Técnico > Auscultación > Fichas' },
    ],
    historic: [
      { id: 'h1', date: '17/05/2026', time: '14:30', user: 'Sistema DAMDATA', role: 'sipresas_admin', module: 'Auscultación', action: 'Umbral superado', result: '2.18 kg/cm² > 2.00 kg/cm² (S.E.).' },
      { id: 'h2', date: '17/05/2026', time: '14:35', user: 'Carlos Ramos', role: 'auscultation_tech', module: 'Auscultación', action: 'Aviso enviado', result: 'Director/a de Explotación notificado.' },
    ],
  },
  // ── Caudalímetro filtraciones — umbral superado
  {
    id: 'E-011', code: 'AUS-FIL-001', uuid: 'bim-0011-00bb-bbbb-bbbbbbbbbb11',
    name: 'Caudalímetro de filtraciones', category: 'instrumentation', asset_type: 'Caudalímetro electromagnético',
    location: 'Pie de presa · Aguas abajo · Cota 537.00m', status: 'threshold_exceeded',
    criticality: 'critical', module_origin: 'Auscultación (DAMDATA)', last_updated: '19/05/2026',
    description: 'Caudalímetro electromagnético filtración total. 212.7 l/s > umbral S.E. 169.1 l/s.',
    x: 428, y: 304, width: 24, height: 24, svgType: 'ellipse',
    layers: ['auscultation', 'safety'],
    ausc_variable: 'Filtración Total', ausc_value: '212.7', ausc_unit: 'l/s',
    ausc_threshold_se: '169.1', ausc_threshold_e0: '338.2', ausc_status: 'S. Extraordinaria · +25.8%',
    ausc_source: 'DAMDATA', ausc_trend: [145, 148, 155, 162, 170, 185, 200, 212.7],
    ausc_trend_dates: ['12/05', '13/05', '14/05', '15/05', '16/05', '17/05', '18/05', '19/05'],
    inventory_ref: 'INV-AUS-011', inv_type: 'Caudalímetro', inv_manufacturer: 'ENDRESS+HAUSER',
    inv_model: 'Promag 50W', inv_serial: 'EH-2005-1841', inv_install_date: '01/06/2005', inv_location_func: 'Pie de presa cota 537m',
    archive_docs: [
      { id: 'd1', name: 'Ficha caudalímetro FIL-001', type: 'PDF', size: '1.1 MB', date: '2022', critical: false, path: 'Archivo Técnico > Auscultación > Fichas' },
    ],
    historic: [
      { id: 'h1', date: '16/05/2026', time: '23:12', user: 'Sistema DAMDATA', role: 'sipresas_admin', module: 'Auscultación', action: 'Umbral superado', result: '212.7 l/s > 169.1 l/s. Alerta generada.' },
    ],
  },
  // ── Sistema de achique
  {
    id: 'E-012', code: 'MEC-ACH-001', uuid: 'bim-0012-00cc-cccc-cccccccccc12',
    name: 'Sistema de achique galería', category: 'mechanical', asset_type: 'Bomba de achique',
    location: 'Galería · Punto más bajo · Cota 535.50m', status: 'operational',
    criticality: 'high', module_origin: 'Inventario / Mantenimiento', last_updated: '01/04/2026',
    description: 'Bomba centrífuga submersible para achique de galería. 2 unidades (1 reserva).',
    x: 375, y: 295, width: 35, height: 28, svgType: 'rect',
    layers: ['mechanical', 'maintenance', 'safety'],
    inventory_ref: 'INV-MEC-012', inv_type: 'Bomba de achique', inv_manufacturer: 'GRUNDFOS',
    inv_model: 'SP-46-7N', inv_serial: 'GF-2012-3341', inv_install_date: '15/02/2012', inv_location_func: 'Galería cota 535.50m',
    maint_status: 'Al día', maint_last_date: '01/04/2026', maint_next_date: '01/10/2026',
    maint_open_incidents: 0, maint_total_parts: 14,
    archive_docs: [
      { id: 'd1', name: 'Manual bomba SP-46-7N', type: 'PDF', size: '5.3 MB', date: '2012', critical: false, path: 'Archivo Técnico > BIM > Guadalmena > Manuales' },
    ],
    historic: [
      { id: 'h1', date: '01/04/2026', time: '14:00', user: 'Miguel Torres', role: 'maintenance_tech', module: 'Mantenimiento', action: 'Prueba funcionamiento', result: 'Ambas bombas operativas. Correcto.' },
    ],
  },
  // ── Ventilación forzada galería
  {
    id: 'E-013', code: 'MEC-VEN-001', uuid: 'bim-0013-00dd-dddd-dddddddddd13',
    name: 'Ventilación forzada galería', category: 'mechanical', asset_type: 'Ventilador axial',
    location: 'Galería · Entrada · Cota 545.00m', status: 'operational',
    criticality: 'medium', module_origin: 'Inventario', last_updated: '10/03/2026',
    description: 'Sistema de ventilación forzada de galería de inspección. 2 ventiladores axiales redundantes.',
    x: 220, y: 244, width: 36, height: 28, svgType: 'rect',
    layers: ['mechanical', 'maintenance'],
    inventory_ref: 'INV-MEC-013', inv_type: 'Ventilador axial', inv_manufacturer: 'SODECA',
    inv_model: 'CA-71-6T', inv_serial: 'SO-2014-0871', inv_install_date: '20/05/2014', inv_location_func: 'Entrada galería cota 545m',
    maint_status: 'Al día', maint_last_date: '10/03/2026', maint_next_date: '10/09/2026',
    maint_open_incidents: 0, maint_total_parts: 10,
    archive_docs: [],
    historic: [
      { id: 'h1', date: '10/03/2026', time: '10:00', user: 'Miguel Torres', role: 'maintenance_tech', module: 'Mantenimiento', action: 'Revisión semestral', result: 'Correcto.' },
    ],
  },
  // ── Limnígrafo SAIH
  {
    id: 'E-014', code: 'AUS-NIV-001', uuid: 'bim-0014-00ee-eeee-eeeeeeeeee14',
    name: 'Limnígrafo SAIH nivel embalse', category: 'sensor', asset_type: 'Sensor nivel agua',
    location: 'Pared aguas arriba · Cota embalse', status: 'operational',
    criticality: 'critical', module_origin: 'Auscultación (SAIH)', last_updated: '19/05/2026',
    description: 'Sensor nivel embalse SAIH-CHG. NE actual 600.92 m. Sincronización en tiempo real.',
    x: 55, y: 215, width: 20, height: 20, svgType: 'ellipse',
    layers: ['auscultation', 'exploitation'],
    ausc_variable: 'Nivel embalse (SAIH)', ausc_value: '600.92', ausc_unit: 'm.s.n.m.',
    ausc_threshold_se: '605.00', ausc_threshold_e0: '607.00', ausc_status: 'Normal · SAIH en línea',
    ausc_source: 'SAIH-CHG', ausc_trend: [598.1, 598.5, 599.0, 599.8, 600.2, 600.5, 600.7, 600.92],
    ausc_trend_dates: ['12/05', '13/05', '14/05', '15/05', '16/05', '17/05', '18/05', '19/05'],
    inventory_ref: 'INV-AUS-014', inv_type: 'Limnígrafo', inv_manufacturer: 'OTT HYDROMET',
    inv_model: 'OTT ecoLog', inv_serial: 'OT-2010-2291', inv_install_date: '01/03/2010', inv_location_func: 'Cuerpo presa · Aguas arriba',
    archive_docs: [],
    historic: [
      { id: 'h1', date: '01/05/2026', time: '08:00', user: 'Sistema SAIH', role: 'sipresas_admin', module: 'Explotación', action: 'Sincronización', result: 'NE sincronizado correctamente.' },
    ],
  },
];

// ─── BIM Models ───────────────────────────────────────────────────────────────

export const BIM_MODELS: BimModel[] = [
  {
    id: 'M-001', dam: 'Presa de Guadalmena',
    name: 'Guadalmena_BIM_IFC_v1.ifc',
    description: 'Modelo BIM completo generado por escáner 3D. 14.832 elementos. Almacenado en Archivo Técnico.',
    format_original: 'IFC', format_optimized: 'glTF',
    state: 'published', version: '1.0', version_date: '12/03/2026',
    size_original_mb: 1240, size_optimized_mb: 88,
    elements_count: 14832, author: 'Carlos Fernández Ruiz',
    published_by: 'Ana García López', published_date: '20/03/2026',
    saih_sync: true, last_sync: '19/05/2026 07:30',
    changes_summary: 'Primera versión publicada del modelo completo Guadalmena.',
    archive_path: 'Archivo Técnico > BIM > Guadalmena > Modelos originales',
  },
  {
    id: 'M-002', dam: 'Presa de Guadalmena',
    name: 'Guadalmena_Modelo_Optimizado_v1.gltf',
    description: 'Versión optimizada para visor web. Nivel de detalle operativo. 4.200 elementos. Cargado en visor.',
    format_original: 'glTF',
    state: 'published', version: '1.0', version_date: '14/03/2026',
    size_original_mb: 88,
    elements_count: 4200, author: 'Carlos Fernández Ruiz',
    published_by: 'Ana García López', published_date: '21/03/2026',
    saih_sync: true, last_sync: '19/05/2026 07:30',
    changes_summary: 'Generado a partir de IFC v1.0. Reducción detalle nivel 3. Elementos críticos completos.',
    archive_path: 'Archivo Técnico > BIM > Guadalmena > Modelos optimizados',
  },
  {
    id: 'M-003', dam: 'Presa de Guadalmena',
    name: 'Guadalmena_Instrumentacion_v1.4-rc.ifc',
    description: 'Modelo detallado de instrumentación y auscultación. En revisión antes de publicar.',
    format_original: 'IFC',
    state: 'optimized', version: '1.4-rc', version_date: '07/05/2026',
    size_original_mb: 220,
    elements_count: 892, author: 'Miguel Torres Pérez',
    saih_sync: true, last_sync: '19/05/2026 07:30',
    changes_summary: 'Nuevo piezómetro P-18 incorporado. Actualización coordenadas P-14.',
    archive_path: 'Archivo Técnico > BIM > Guadalmena > Modelos originales',
  },
  {
    id: 'M-004', dam: 'Presa de Guadalmena',
    name: 'Guadalmena_AsBuilt_2018.dwg',
    description: 'Digitalización de planos as-built originales de construcción. Modelo de referencia histórico.',
    format_original: 'DWG',
    state: 'obsolete', version: '1.0', version_date: '15/06/2018',
    size_original_mb: 145,
    elements_count: 1200, author: 'Archivo Técnico CHG',
    saih_sync: false,
    changes_summary: 'Digitalización inicial. Sustituido por modelo IFC v1.0.',
    archive_path: 'Archivo Técnico > BIM > Guadalmena > Versiones',
  },
];

// ─── BIM Alerts ───────────────────────────────────────────────────────────────

export const BIM_ALERTS: BimAlert[] = [
  {
    id: 'BA-001', date: '18/05/2026', time: '07:45',
    element_id: 'E-006', element_name: 'Grupo electrógeno principal',
    source: 'maintenance', severity: 'critical',
    title: 'Avería crítica: grupo electrógeno principal',
    description: 'Fallo sistema arranque automático. Sin alimentación de emergencia disponible. Riesgo alto en caso de corte de red.',
    recommendation: 'Convocar técnico especialista urgente. Activar grupo electrógeno de reserva. Comunicar a Director/a.',
    resolved: false, assigned_to: 'Miguel Torres Pérez',
  },
  {
    id: 'BA-002', date: '18/05/2026', time: '07:45',
    element_id: 'E-007', element_name: 'Cuadro eléctrico general',
    source: 'maintenance', severity: 'critical',
    title: 'Avería: cuadro eléctrico general',
    description: 'Fallo módulo protección diferencial. Sin mando eléctrico sobre desagüe de fondo.',
    recommendation: 'Reparación urgente antes de cualquier operación de desagüe. OT-2026-024 abierta.',
    resolved: false, assigned_to: 'Miguel Torres Pérez',
  },
  {
    id: 'BA-003', date: '16/05/2026', time: '23:12',
    element_id: 'E-011', element_name: 'Caudalímetro de filtraciones',
    source: 'auscultation', severity: 'critical',
    title: 'Filtración total supera umbral S.E.',
    description: '212.7 l/s > umbral S.E. 169.1 l/s. Exceso: +43.6 l/s (+25.8%). Tendencia ascendente 7 días.',
    recommendation: 'Intensificar vigilancia. Notificar OC. Preparar comunicación Plan Emergencia si tendencia continúa.',
    resolved: false, assigned_to: 'Carlos Ramos',
  },
  {
    id: 'BA-004', date: '17/05/2026', time: '14:30',
    element_id: 'E-010', element_name: 'Piezómetro P-14',
    source: 'auscultation', severity: 'warning',
    title: 'Presión intersticial P-14 supera umbral S.E.',
    description: 'P-14 = 2.18 kg/cm² > umbral S.E. 2.00 kg/cm². Correlacionado con filtración y NE.',
    recommendation: 'Revisar correlación con filtración total. Confirmar en módulo de Auscultación.',
    resolved: false,
  },
  {
    id: 'BA-005', date: '11/05/2026', time: '09:00',
    element_id: 'E-004', element_name: 'Compuerta nº2 (Aliviadero)',
    source: 'maintenance', severity: 'warning',
    title: 'Revisión periódica vencida · Compuerta nº2',
    description: 'Revisión semestral vencida el 10/05/2026. OT-2026-018 programada pero sin fecha de acceso.',
    recommendation: 'Coordinar acceso con Explotación durante período de normalización post-avenida.',
    resolved: false,
  },
  {
    id: 'BA-006', date: '14/05/2026', time: '16:22',
    element_id: 'E-003', element_name: 'Compuerta nº1 (Aliviadero)',
    source: 'exploitation', severity: 'info',
    title: 'Aliviadero en operación activa · S.E.',
    description: 'Compuerta nº1 en operación. S.E. activa. Q=90 m³/s. Avenida en fase de laminación.',
    recommendation: 'Seguimiento continuo. Registrar lecturas cada hora en libro de explotación.',
    resolved: false,
  },
  {
    id: 'BA-007', date: '10/05/2026', time: '11:15',
    element_id: 'E-001', element_name: 'Cuerpo de Presa',
    source: 'maintenance', severity: 'info',
    title: 'Inspección semestral completada sin anomalías',
    description: 'Inspección visual completa del paramento. Sin fisuras, sin filtraciones localizadas. Informe generado.',
    recommendation: 'Ninguna acción requerida. Próxima inspección: 10/11/2026.',
    resolved: true, resolved_date: '10/05/2026', resolved_by: 'Carmen Rodríguez',
  },
];

// ─── Module Integrations ──────────────────────────────────────────────────────

export const MODULE_INTEGRATIONS: ModuleIntegration[] = [
  {
    id: 'int-inv', name: 'Inventario', description: 'Ficha técnica de activos. Vinculación elemento BIM ↔ activo inventariado.',
    status: 'synced', last_sync: '19/05/2026 07:30', elements_linked: 14, docs_linked: 0,
    events_received: [
      { id: 'e1', date: '15/04/2026', time: '10:00', event_type: 'evento_ficha_inventario_actualizada', description: 'Ficha CT-001 actualizada con datos revisión anual', element: 'Centro de transformación' },
      { id: 'e2', date: '20/03/2026', time: '09:00', event_type: 'evento_ficha_inventario_actualizada', description: 'Alta 14 activos vinculados al modelo BIM publicado', element: 'Todos los elementos' },
    ],
  },
  {
    id: 'int-maint', name: 'Mantenimiento', description: 'Estado del equipo, partes PDF, órdenes de trabajo e incidencias.',
    status: 'synced', last_sync: '19/05/2026 08:35', elements_linked: 10, docs_linked: 8,
    events_received: [
      { id: 'e1', date: '18/05/2026', time: '08:30', event_type: 'evento_parte_cerrado', description: 'OT-2026-023 (avería GE) → estado E-006 actualizado a Avería', element: 'Grupo electrógeno principal' },
      { id: 'e2', date: '18/05/2026', time: '08:30', event_type: 'evento_parte_cerrado', description: 'OT-2026-024 (avería CE) → estado E-007 actualizado a Avería', element: 'Cuadro eléctrico general' },
      { id: 'e3', date: '05/05/2026', time: '14:00', event_type: 'evento_parte_cerrado', description: 'OT-2026-012 cerrado → Compuerta nº1 estado Operativo', element: 'Compuerta nº1' },
    ],
  },
  {
    id: 'int-expl', name: 'Explotación', description: 'Estado global presa. NE, caudales, órganos desagüe, alertas operativas.',
    status: 'synced', last_sync: '19/05/2026 07:30', elements_linked: 5,
    events_received: [
      { id: 'e1', date: '14/05/2026', time: '16:22', event_type: 'evento_estado_presa', description: 'S. Extraordinaria declarada. Banner BIM actualizado.', element: 'Global' },
      { id: 'e2', date: '08/05/2026', time: '17:00', event_type: 'evento_estado_presa', description: 'Compuerta nº1 abierta 40% · Q=90m³/s laminación', element: 'Compuerta nº1' },
    ],
  },
  {
    id: 'int-ausc', name: 'Auscultación', description: 'Sensores críticos, valores, umbrales S.E./E0, gráficos históricos.',
    status: 'synced', last_sync: '19/05/2026 07:30', elements_linked: 5,
    events_received: [
      { id: 'e1', date: '16/05/2026', time: '23:12', event_type: 'evento_umbral_superado', description: 'Filtración 212.7 l/s > umbral 169.1. E-011 → threshold_exceeded', element: 'Caudalímetro filtraciones' },
      { id: 'e2', date: '17/05/2026', time: '14:30', event_type: 'evento_umbral_superado', description: 'P-14: 2.18 kg/cm² > 2.00. E-010 → threshold_exceeded', element: 'Piezómetro P-14' },
    ],
  },
  {
    id: 'int-arch', name: 'Archivo Técnico', description: 'Modelos BIM originales, planos, manuales, partes, cartografía.',
    status: 'synced', last_sync: '19/05/2026 07:30', elements_linked: 14, docs_linked: 48,
    events_received: [
      { id: 'e1', date: '18/05/2026', time: '09:00', event_type: 'evento_documento_actualizado', description: 'Parte avería GE subido a Archivo Técnico', element: 'Grupo electrógeno' },
      { id: 'e2', date: '05/05/2026', time: '14:05', event_type: 'evento_documento_actualizado', description: 'Parte OT-2026-012 Compuerta nº1 subido', element: 'Compuerta nº1' },
    ],
  },
  {
    id: 'int-emerg', name: 'Gestión de Emergencias', description: 'Enlace activado si Explotación declara Escenario 0.',
    status: 'pending', elements_linked: 0,
    events_received: [],
  },
];

// ─── Simulation Scenarios ─────────────────────────────────────────────────────

export const SIMULATION_SCENARIOS: SimulationScenario[] = [
  {
    id: 'sim-1',
    name: 'Fallo grupo electrógeno',
    description: 'Simula avería del grupo electrógeno principal. Sin alimentación de emergencia.',
    affected_elements: ['E-006'],
    status_change: { 'E-006': 'failure' },
    warning_message: 'SIMULACIÓN: Sin alimentación eléctrica de emergencia. Riesgo operativo elevado.',
  },
  {
    id: 'sim-2',
    name: 'Umbral auscultación superado',
    description: 'Simula superación del umbral de Escenario 0 en sensor de filtración total.',
    affected_elements: ['E-011', 'E-010'],
    status_change: { 'E-011': 'threshold_exceeded', 'E-010': 'threshold_exceeded' },
    dam_status: 'extraordinary',
    warning_message: 'SIMULACIÓN: Filtración supera umbral E.0. Protocolo de emergencia activable.',
  },
  {
    id: 'sim-3',
    name: 'Situación Extraordinaria',
    description: 'Simula declaración de S. Extraordinaria por avenida. Aliviadero en operación.',
    affected_elements: ['E-003', 'E-004', 'E-014'],
    status_change: { 'E-003': 'operational', 'E-004': 'revision_pending' },
    dam_status: 'extraordinary',
    warning_message: 'SIMULACIÓN: S. Extraordinaria activa. Aliviadero operativo. Vigilancia intensificada.',
  },
  {
    id: 'sim-4',
    name: 'Escenario 0',
    description: 'Simula activación de Escenario 0. Alerta máxima. Enlace a Gestión de Emergencias.',
    affected_elements: ['E-001', 'E-005', 'E-010', 'E-011'],
    status_change: { 'E-001': 'threshold_exceeded', 'E-005': 'failure', 'E-010': 'threshold_exceeded', 'E-011': 'threshold_exceeded' },
    dam_status: 'scenario_0',
    warning_message: 'SIMULACIÓN ESCENARIO 0: Activar Plan de Emergencia. Comunicar Organismo de Cuenca.',
  },
  {
    id: 'sim-5',
    name: 'Apertura compuertas laminación',
    description: 'Simula apertura progresiva de compuertas durante avenida para laminación.',
    affected_elements: ['E-003', 'E-004'],
    status_change: { 'E-003': 'operational', 'E-004': 'operational' },
    dam_status: 'extraordinary',
    warning_message: 'SIMULACIÓN: Ambas compuertas abiertas. Q desembalsado = 520 m³/s. Laminación activa.',
  },
];

// ─── Historic Events ──────────────────────────────────────────────────────────

export const BIM_HISTORIC: BimHistoricEvent[] = [
  { id: 'BH-001', date: '19/05/2026', time: '08:30', element_id: 'E-007', element_name: 'Cuadro eléctrico general', event_type: 'status_changed', user: 'Sistema', role: 'sipresas_admin', description: 'Estado actualizado a Avería. OT-2026-024 activa.', module: 'Mantenimiento' },
  { id: 'BH-002', date: '18/05/2026', time: '07:45', element_id: 'E-006', element_name: 'Grupo electrógeno principal', event_type: 'alert_generated', user: 'Sistema SCADA', role: 'sipresas_admin', description: 'Avería crítica detectada. Alerta BA-001 generada.', module: 'Mantenimiento' },
  { id: 'BH-003', date: '17/05/2026', time: '14:30', element_id: 'E-010', element_name: 'Piezómetro P-14', event_type: 'threshold_exceeded', user: 'Sistema DAMDATA', role: 'sipresas_admin', description: 'Umbral S.E. superado: 2.18 kg/cm² > 2.00 kg/cm².', module: 'Auscultación' },
  { id: 'BH-004', date: '16/05/2026', time: '23:12', element_id: 'E-011', element_name: 'Caudalímetro filtraciones', event_type: 'threshold_exceeded', user: 'Sistema DAMDATA', role: 'sipresas_admin', description: 'Filtración 212.7 l/s > umbral S.E. 169.1 l/s.', module: 'Auscultación' },
  { id: 'BH-005', date: '14/05/2026', time: '16:22', element_id: 'E-003', element_name: 'Compuerta nº1', event_type: 'status_changed', user: 'Ana García López', role: 'director', description: 'Aliviadero operativo. S.E. activa. Q=90 m³/s.', module: 'Explotación' },
  { id: 'BH-006', date: '12/05/2026', time: '09:18', event_type: 'model_published', user: 'Ana García López', role: 'bim_admin', description: 'Modelo optimizado glTF v1.0 publicado en visor BIM.', module: 'Modelos BIM' },
  { id: 'BH-007', date: '10/05/2026', time: '11:20', element_id: 'E-001', element_name: 'Cuerpo de Presa', event_type: 'maintenance_completed', user: 'Carmen Rodríguez', role: 'maintenance_tech', description: 'Inspección semestral completada. Sin anomalías. Parte cerrado.', module: 'Mantenimiento' },
  { id: 'BH-008', date: '05/05/2026', time: '14:00', element_id: 'E-003', element_name: 'Compuerta nº1', event_type: 'document_accessed', user: 'Laura Sánchez', role: 'viewer', description: 'Manual compuerta descargado desde Archivo Técnico.', module: 'Archivo Técnico' },
  { id: 'BH-009', date: '20/03/2026', time: '15:00', event_type: 'model_published', user: 'Ana García López', role: 'bim_admin', description: 'Modelo BIM IFC v1.0 publicado. 14.832 elementos. Almacenado en Archivo Técnico.', module: 'Modelos BIM' },
  { id: 'BH-010', date: '12/03/2026', time: '09:00', event_type: 'model_updated', user: 'Carlos Fernández', role: 'bim_admin', description: 'Modelo IFC v1.0 subido. Procesado y optimizado a glTF. Pendiente de publicación.', module: 'Modelos BIM' },
];

// ─── Audit Entries ────────────────────────────────────────────────────────────

export const BIM_AUDIT: BimAuditEntry[] = [
  { id: 'AU-001', date: '19/05/2026', time: '08:35', action: 'Consulta elemento BIM', user: 'Ana García López', role: 'director', resource: 'E-006 · Grupo electrógeno principal', result: 'Ficha completa consultada', detail: 'Estado, mantenimiento, avería activa', ip: '10.0.12.34', reason: 'Seguimiento S.E. activa', hash: 'sha256:a1b2c3d4e5f6789012345678901234aa' },
  { id: 'AU-002', date: '19/05/2026', time: '08:30', action: 'Cambio estado elemento', user: 'Sistema', role: 'sipresas_admin', resource: 'E-007 → failure', result: 'Estado actualizado', detail: 'Sincronización módulo Mantenimiento. OT-2026-024.', ip: '10.0.0.1', hash: 'sha256:b2c3d4e5f678901234567890abcd11bb' },
  { id: 'AU-003', date: '18/05/2026', time: '15:05', action: 'Descarga documento crítico', user: 'Ana García López', role: 'director', resource: 'Memoria constructiva presa (EST-CUE-001)', result: 'Descarga autorizada', detail: 'Documento crítico · Autorizado por rol director', ip: '10.0.12.34', reason: 'Revisión estructural S.E.', hash: 'sha256:c3d4e5f67890123456789012cdef22cc' },
  { id: 'AU-004', date: '18/05/2026', time: '10:00', action: 'Descarga documento crítico', user: 'Laura Sánchez', role: 'viewer', resource: 'Memoria constructiva presa (EST-CUE-001)', result: 'DENEGADO: rol insuficiente', detail: 'Documento marcado como crítico. Rol "viewer" sin permiso.', ip: '10.0.14.88', reason: 'Intento de descarga no autorizado', hash: 'sha256:d4e5f6789012345678901234efgh33dd' },
  { id: 'AU-005', date: '17/05/2026', time: '14:32', action: 'Alerta BIM generada', user: 'Sistema DAMDATA', role: 'sipresas_admin', resource: 'BA-004 · E-010 Piezómetro P-14', result: 'Alerta generada y notificada', detail: 'Umbral S.E. 2.18 kg/cm² > 2.00. Módulo Auscultación.', ip: '10.0.0.2', hash: 'sha256:e5f67890123456789012345678901234' },
  { id: 'AU-006', date: '16/05/2026', time: '23:14', action: 'Cambio estado elemento', user: 'Sistema DAMDATA', role: 'sipresas_admin', resource: 'E-011 → threshold_exceeded', result: 'Estado actualizado', detail: 'Filtración 212.7 l/s > 169.1. Sincronización módulo Auscultación.', ip: '10.0.0.2', hash: 'sha256:f678901234567890123456789012345a' },
  { id: 'AU-007', date: '12/05/2026', time: '09:18', action: 'Publicación modelo BIM', user: 'Ana García López', role: 'bim_admin', resource: 'M-002 · Guadalmena_Modelo_Optimizado_v1.gltf', result: 'Publicado en visor BIM', detail: 'Modelo optimizado 88 MB. 4.200 elementos. Firmado digitalmente.', ip: '10.0.12.34', reason: 'Publicación versión inicial visor', hash: 'sha256:789012345678901234567890abcdef12' },
  { id: 'AU-008', date: '10/05/2026', time: '11:20', action: 'Alerta BIM resuelta', user: 'Carmen Rodríguez', role: 'maintenance_tech', resource: 'BA-007 · Cuerpo de Presa', result: 'Alerta marcada como resuelta', detail: 'Inspección semestral completada. Sin anomalías.', ip: '10.0.15.22', reason: 'Cierre parte de mantenimiento', hash: 'sha256:01234567890123456789012345678901' },
  { id: 'AU-009', date: '05/05/2026', time: '14:02', action: 'Descarga documento', user: 'Laura Sánchez', role: 'viewer', resource: 'Manual compuerta Taintor TN-1200', result: 'Descarga permitida', detail: 'Documento no crítico. Rol "viewer" autorizado.', ip: '10.0.14.88', hash: 'sha256:1234567890abcdef12345678901234567' },
  { id: 'AU-010', date: '20/03/2026', time: '15:05', action: 'Modelo BIM almacenado', user: 'Ana García López', role: 'bim_admin', resource: 'M-001 · Guadalmena_BIM_IFC_v1.ifc', result: 'Almacenado en Archivo Técnico', detail: '1.24 GB · IFC v2.3 · Archivo Técnico > BIM > Guadalmena.', ip: '10.0.12.34', reason: 'Publicación primera versión modelo BIM', hash: 'sha256:abcdef1234567890123456789012345678' },
];
