/*
  # Maintenance data for Presa de Bembézar (GQ-009)

  Inserts a realistic set of maintenance records to demonstrate the full maintenance module flow:

  1. Maintenance Activities (8 total)
     - 6 preventive activities: inspección visual, auscultación, compuertas, aliviadero, sirenas, eléctrico
     - 2 corrective activities: reparación fuga galería, sustitución sensor piezómetro

  2. Work Orders (14 total across Jan–Sep 2026)
     - Statuses: completed, in_progress, pending, planned
     - All mapped to correct English enum values

  3. Maintenance Reports (7 total for completed orders)
     - Realistic observations, materials, findings for each completed OT
*/

-- ============================================================
-- MAINTENANCE ACTIVITIES for Presa de Bembézar (GQ-009)
-- ============================================================
INSERT INTO maintenance_activities (id, dam_id, code, name, description, activity_type, category, periodicity, estimated_duration)
VALUES
  ('a1000001-beef-4000-8000-000000000001', '0bbf880c-2745-40e7-828b-a798fd9636f3',
   'BEM-PREV-001', 'Inspección visual de presa y aliviadero',
   'Revisión visual completa de la presa, aliviadero, compuertas y estructuras auxiliares para detección temprana de anomalías.',
   'preventive', 'inspeccion', 'monthly', 120),

  ('a1000001-beef-4000-8000-000000000002', '0bbf880c-2745-40e7-828b-a798fd9636f3',
   'BEM-PREV-002', 'Mantenimiento sistema de auscultación',
   'Revisión y calibración de piezómetros, extensómetros y aforos. Verificación de funcionamiento y transmisión de datos.',
   'preventive', 'auscultacion', 'quarterly', 240),

  ('a1000001-beef-4000-8000-000000000003', '0bbf880c-2745-40e7-828b-a798fd9636f3',
   'BEM-PREV-003', 'Revisión compuertas y mecanismos hidráulicos',
   'Comprobación de estanqueidad, engrase de mecanismos, verificación de actuadores eléctricos y sistemas de control.',
   'preventive', 'compuertas', 'semiannual', 360),

  ('a1000001-beef-4000-8000-000000000004', '0bbf880c-2745-40e7-828b-a798fd9636f3',
   'BEM-PREV-004', 'Limpieza y mantenimiento aliviadero',
   'Limpieza de flotantes y sedimentos en umbral del aliviadero. Inspección de recubrimientos y juntas de dilatación.',
   'preventive', 'obras_civiles', 'semiannual', 480),

  ('a1000001-beef-4000-8000-000000000005', '0bbf880c-2745-40e7-828b-a798fd9636f3',
   'BEM-PREV-005', 'Inspección y prueba sistema de alarma y sirenas',
   'Verificación del funcionamiento de todas las sirenas del sistema de alerta temprana. Prueba de comunicaciones y protocolos de activación.',
   'preventive', 'seguridad', 'quarterly', 180),

  ('a1000001-beef-4000-8000-000000000006', '0bbf880c-2745-40e7-828b-a798fd9636f3',
   'BEM-PREV-006', 'Mantenimiento instalaciones eléctricas',
   'Revisión cuadros eléctricos, grupo electrógeno, baterías de emergencia y alumbrado interior de galerías.',
   'preventive', 'instalaciones', 'semiannual', 300),

  ('a1000001-beef-4000-8000-000000000007', '0bbf880c-2745-40e7-828b-a798fd9636f3',
   'BEM-CORR-001', 'Reparación fuga en galería de drenaje',
   'Sellado y reparación de fisura con filtración detectada en galería de drenaje nivel -2. Inyección de resina epoxídica.',
   'corrective', 'obras_civiles', 'monthly', 960),

  ('a1000001-beef-4000-8000-000000000008', '0bbf880c-2745-40e7-828b-a798fd9636f3',
   'BEM-CORR-002', 'Sustitución sensor piezómetro P-07',
   'Reemplazo de sensor de nivel de agua en piezómetro P-07 por fallo en lectura. Verificación post-instalación y calibración.',
   'corrective', 'auscultacion', 'monthly', 300)
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- WORK ORDERS for Presa de Bembézar (GQ-009)
-- ============================================================
INSERT INTO maintenance_work_orders (id, dam_id, activity_id, code, title, description, order_type, status, priority, scheduled_date, scheduled_month, scheduled_year, started_at, completed_at, assigned_to, created_by)
VALUES
  -- January 2026 – completed visual inspection
  ('b2000001-beef-4000-8000-000000000001', '0bbf880c-2745-40e7-828b-a798fd9636f3',
   'a1000001-beef-4000-8000-000000000001',
   'OT-BEM-2026-001', 'Inspección visual enero 2026',
   'Inspección mensual de estructuras. Revisión de coronación, taludes y aliviadero tras lluvias de diciembre.',
   'preventive', 'completed', 'medium',
   '2026-01-08', 1, 2026,
   '2026-01-08 09:00:00+00', '2026-01-08 11:30:00+00',
   '45c8d696-38a3-4e01-a394-1f44597cf497', 'baba18cc-a55a-47db-8986-60a381dd5555'),

  -- January 2026 – corrective completed (fuga galería)
  ('b2000001-beef-4000-8000-000000000002', '0bbf880c-2745-40e7-828b-a798fd9636f3',
   'a1000001-beef-4000-8000-000000000007',
   'OT-BEM-2026-002', 'Reparación fuga galería de drenaje',
   'Fuga detectada en inspección del 08/01 en galería nivel -2. Sellado con inyección de resina epoxídica en 3 puntos.',
   'corrective', 'completed', 'high',
   '2026-01-15', 1, 2026,
   '2026-01-15 08:00:00+00', '2026-01-16 17:00:00+00',
   '45c8d696-38a3-4e01-a394-1f44597cf497', 'baba18cc-a55a-47db-8986-60a381dd5555'),

  -- February 2026 – completed visual
  ('b2000001-beef-4000-8000-000000000003', '0bbf880c-2745-40e7-828b-a798fd9636f3',
   'a1000001-beef-4000-8000-000000000001',
   'OT-BEM-2026-003', 'Inspección visual febrero 2026',
   'Inspección mensual de estructuras. Sin anomalías reseñables.',
   'preventive', 'completed', 'medium',
   '2026-02-05', 2, 2026,
   '2026-02-05 09:00:00+00', '2026-02-05 11:15:00+00',
   '45c8d696-38a3-4e01-a394-1f44597cf497', 'baba18cc-a55a-47db-8986-60a381dd5555'),

  -- February 2026 – quarterly auscultation completed
  ('b2000001-beef-4000-8000-000000000004', '0bbf880c-2745-40e7-828b-a798fd9636f3',
   'a1000001-beef-4000-8000-000000000002',
   'OT-BEM-2026-004', 'Mantenimiento sistema auscultación Q1 2026',
   'Revisión trimestral. Calibración de 12 piezómetros, 4 extensómetros y verificación de aforos.',
   'preventive', 'completed', 'medium',
   '2026-02-20', 2, 2026,
   '2026-02-20 08:00:00+00', '2026-02-20 14:30:00+00',
   '45c8d696-38a3-4e01-a394-1f44597cf497', 'baba18cc-a55a-47db-8986-60a381dd5555'),

  -- March 2026 – completed visual
  ('b2000001-beef-4000-8000-000000000005', '0bbf880c-2745-40e7-828b-a798fd9636f3',
   'a1000001-beef-4000-8000-000000000001',
   'OT-BEM-2026-005', 'Inspección visual marzo 2026',
   'Inspección mensual. Verificación estado de escollera en estribo derecho tras avenida.',
   'preventive', 'completed', 'medium',
   '2026-03-06', 3, 2026,
   '2026-03-06 09:00:00+00', '2026-03-06 12:00:00+00',
   '45c8d696-38a3-4e01-a394-1f44597cf497', 'baba18cc-a55a-47db-8986-60a381dd5555'),

  -- March 2026 – corrective sensor completed
  ('b2000001-beef-4000-8000-000000000006', '0bbf880c-2745-40e7-828b-a798fd9636f3',
   'a1000001-beef-4000-8000-000000000008',
   'OT-BEM-2026-006', 'Sustitución sensor piezómetro P-07',
   'Fallo detectado en lectura P-07. Sustitución por sensor KPSI-305 y calibración del sistema.',
   'corrective', 'completed', 'high',
   '2026-03-18', 3, 2026,
   '2026-03-18 10:00:00+00', '2026-03-18 14:00:00+00',
   '45c8d696-38a3-4e01-a394-1f44597cf497', 'baba18cc-a55a-47db-8986-60a381dd5555'),

  -- April 2026 – completed visual
  ('b2000001-beef-4000-8000-000000000007', '0bbf880c-2745-40e7-828b-a798fd9636f3',
   'a1000001-beef-4000-8000-000000000001',
   'OT-BEM-2026-007', 'Inspección visual abril 2026',
   'Inspección mensual. Revisión post-llenado de embalse.',
   'preventive', 'completed', 'medium',
   '2026-04-03', 4, 2026,
   '2026-04-03 09:00:00+00', '2026-04-03 11:45:00+00',
   '45c8d696-38a3-4e01-a394-1f44597cf497', 'baba18cc-a55a-47db-8986-60a381dd5555'),

  -- April 2026 – semiannual gates completed
  ('b2000001-beef-4000-8000-000000000008', '0bbf880c-2745-40e7-828b-a798fd9636f3',
   'a1000001-beef-4000-8000-000000000003',
   'OT-BEM-2026-008', 'Revisión semestral compuertas y mecanismos',
   'Revisión H1/2026. Engrase de los 3 mecanismos de compuertas, verificación actuadores y prueba de apertura/cierre.',
   'preventive', 'completed', 'medium',
   '2026-04-22', 4, 2026,
   '2026-04-22 08:00:00+00', '2026-04-22 16:00:00+00',
   '45c8d696-38a3-4e01-a394-1f44597cf497', 'baba18cc-a55a-47db-8986-60a381dd5555'),

  -- May 2026 – completed visual
  ('b2000001-beef-4000-8000-000000000009', '0bbf880c-2745-40e7-828b-a798fd9636f3',
   'a1000001-beef-4000-8000-000000000001',
   'OT-BEM-2026-009', 'Inspección visual mayo 2026',
   'Inspección mensual. Sin incidencias.',
   'preventive', 'completed', 'medium',
   '2026-05-08', 5, 2026,
   '2026-05-08 09:00:00+00', '2026-05-08 11:30:00+00',
   '45c8d696-38a3-4e01-a394-1f44597cf497', 'baba18cc-a55a-47db-8986-60a381dd5555'),

  -- May 2026 – quarterly auscultation completed
  ('b2000001-beef-4000-8000-000000000010', '0bbf880c-2745-40e7-828b-a798fd9636f3',
   'a1000001-beef-4000-8000-000000000002',
   'OT-BEM-2026-010', 'Mantenimiento sistema auscultación Q2 2026',
   'Revisión trimestral Q2. Todos los sensores operativos tras sustitución P-07.',
   'preventive', 'completed', 'medium',
   '2026-05-13', 5, 2026,
   '2026-05-13 08:00:00+00', '2026-05-13 14:00:00+00',
   '45c8d696-38a3-4e01-a394-1f44597cf497', 'baba18cc-a55a-47db-8986-60a381dd5555'),

  -- June 2026 – in_progress (visual inspection)
  ('b2000001-beef-4000-8000-000000000011', '0bbf880c-2745-40e7-828b-a798fd9636f3',
   'a1000001-beef-4000-8000-000000000001',
   'OT-BEM-2026-011', 'Inspección visual junio 2026',
   'Inspección mensual planificada para junio 2026.',
   'preventive', 'in_progress', 'medium',
   '2026-06-05', 6, 2026,
   '2026-06-05 09:00:00+00', NULL,
   '45c8d696-38a3-4e01-a394-1f44597cf497', 'baba18cc-a55a-47db-8986-60a381dd5555'),

  -- June 2026 – pending electrical
  ('b2000001-beef-4000-8000-000000000012', '0bbf880c-2745-40e7-828b-a798fd9636f3',
   'a1000001-beef-4000-8000-000000000006',
   'OT-BEM-2026-012', 'Mantenimiento instalaciones eléctricas H1/2026',
   'Revisión semestral de cuadros eléctricos, grupo electrógeno y baterías de emergencia.',
   'preventive', 'pending', 'medium',
   '2026-06-18', 6, 2026,
   NULL, NULL,
   '45c8d696-38a3-4e01-a394-1f44597cf497', 'baba18cc-a55a-47db-8986-60a381dd5555'),

  -- August 2026 – planned spillway
  ('b2000001-beef-4000-8000-000000000013', '0bbf880c-2745-40e7-828b-a798fd9636f3',
   'a1000001-beef-4000-8000-000000000004',
   'OT-BEM-2026-013', 'Limpieza y mantenimiento aliviadero H2/2026',
   'Limpieza semestral del umbral de aliviadero y revisión de recubrimientos.',
   'preventive', 'pending', 'medium',
   '2026-08-20', 8, 2026,
   NULL, NULL,
   '45c8d696-38a3-4e01-a394-1f44597cf497', 'baba18cc-a55a-47db-8986-60a381dd5555'),

  -- September 2026 – planned sirens
  ('b2000001-beef-4000-8000-000000000014', '0bbf880c-2745-40e7-828b-a798fd9636f3',
   'a1000001-beef-4000-8000-000000000005',
   'OT-BEM-2026-014', 'Prueba sistema sirenas y alerta temprana Q3 2026',
   'Verificación trimestral Q3 de las 8 sirenas del sistema de alerta temprana.',
   'preventive', 'pending', 'high',
   '2026-09-10', 9, 2026,
   NULL, NULL,
   '45c8d696-38a3-4e01-a394-1f44597cf497', 'baba18cc-a55a-47db-8986-60a381dd5555')
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- MAINTENANCE REPORTS for completed work orders
-- ============================================================
INSERT INTO maintenance_reports (id, work_order_id, performed_by, performed_at, duration_minutes, observations, issues_found, corrective_actions, materials_used, next_actions_required)
VALUES
  ('c3000001-beef-4000-8000-000000000001',
   'b2000001-beef-4000-8000-000000000001',
   '45c8d696-38a3-4e01-a394-1f44597cf497',
   '2026-01-08 11:30:00+00', 150,
   'Inspección completada sin anomalías graves. Se detecta ligera humedad en junta de dilatación zona estribo izquierdo km 0+120. Nivel embalse a cota 382.5 msnm (94% capacidad). Coronación en buen estado general.',
   'Humedad anómala en junta de dilatación estribo izquierdo. Posible inicio de filtración menor.',
   NULL,
   '[]',
   'Seguimiento en próxima inspección. Apertura de OT correctiva si persiste la humedad.'),

  ('c3000001-beef-4000-8000-000000000002',
   'b2000001-beef-4000-8000-000000000002',
   '45c8d696-38a3-4e01-a394-1f44597cf497',
   '2026-01-16 17:00:00+00', 960,
   'Reparación completada satisfactoriamente. Se identificaron 3 puntos de filtración en galería nivel -2 entre progresivas 45+00 y 47+20. Inyección de resina epoxídica en los 3 puntos con sellado completo verificado.',
   'Filtración activa en 3 puntos de galería nivel -2. Caudal estimado total 0.8 l/min.',
   'Inyección de resina SIKA Injection-101 RC en 3 taladros Ø12mm. Verificación de estanqueidad post-inyección con manómetro.',
   '[{"material": "Resina SIKA Injection-101 RC", "quantity": "4.5 kg"}, {"material": "Taladros Ø12mm x 300mm", "quantity": "3 ud"}]',
   'Inspección de control a los 30 días. Monitoreo intensificado del drenaje en zona reparada.'),

  ('c3000001-beef-4000-8000-000000000003',
   'b2000001-beef-4000-8000-000000000003',
   '45c8d696-38a3-4e01-a394-1f44597cf497',
   '2026-02-05 11:15:00+00', 135,
   'Inspección mensual sin anomalías. Junta estribo izquierdo sin humedad - desaparece tras reparación galería. Nivel embalse 378.2 msnm (88% capacidad).',
   NULL,
   NULL,
   '[]',
   NULL),

  ('c3000001-beef-4000-8000-000000000004',
   'b2000001-beef-4000-8000-000000000004',
   '45c8d696-38a3-4e01-a394-1f44597cf497',
   '2026-02-20 14:30:00+00', 390,
   'Revisión trimestral Q1 2026. 12 piezómetros revisados: 11 operativos, P-07 con lectura errática. 4 extensómetros en buen estado. Aforos sin anomalías. Transmisores remotos: batería al 67% en TR-03.',
   'P-07 con lectura errática, posible fallo de sensor. Batería baja en transmisor remoto TR-03.',
   'Se programa OT correctiva para sustitución sensor P-07. Recarga batería TR-03 in situ.',
   '[{"material": "Batería 12V 7Ah", "quantity": "1 ud"}]',
   'Apertura OT sustitución P-07. Revisión batería TR-03 en siguiente visita.'),

  ('c3000001-beef-4000-8000-000000000005',
   'b2000001-beef-4000-8000-000000000006',
   '45c8d696-38a3-4e01-a394-1f44597cf497',
   '2026-03-18 14:00:00+00', 240,
   'Sustitución de sensor KPSI-305 en piezómetro P-07. Extracción de sensor antiguo (ref. KPSI-301 instalado 2019). Instalación y calibración con equipo Geokon. Lecturas nominales verificadas.',
   NULL,
   'Sustitución completa del sensor. Calibración en punto cero y a cota de referencia.',
   '[{"material": "Sensor KPSI-305 Keller", "quantity": "1 ud"}, {"material": "Cable sumergible 2x0.75mm2", "quantity": "3 m"}]',
   'Verificar lecturas en calibración trimestral Q2 2026.'),

  ('c3000001-beef-4000-8000-000000000006',
   'b2000001-beef-4000-8000-000000000008',
   '45c8d696-38a3-4e01-a394-1f44597cf497',
   '2026-04-22 16:00:00+00', 480,
   'Revisión semestral H1/2026 de los 3 grupos de compuertas. Engrase de mecanismos con grasa Molykote G-0002. Prueba de apertura y cierre completa: todas las compuertas operativas. Actuadores eléctricos en buen estado. Tiempos de maniobra dentro de especificaciones.',
   'Compuerta C-02 presenta ligero rozamiento en guía superior derecha.',
   'Ajuste de holgura en guía compuerta C-02. Engrase reforzado en zona de rozamiento.',
   '[{"material": "Grasa Molykote G-0002", "quantity": "2 kg"}, {"material": "Aceite hidráulico ISO 46", "quantity": "5 l"}]',
   'Seguimiento compuerta C-02 en revisión H2/2026.'),

  ('c3000001-beef-4000-8000-000000000007',
   'b2000001-beef-4000-8000-000000000009',
   '45c8d696-38a3-4e01-a394-1f44597cf497',
   '2026-05-08 11:30:00+00', 150,
   'Inspección mensual de mayo. Sin incidencias. Compuerta C-02 sin rozamiento visible. Nivel embalse 374.8 msnm (80% capacidad). Galería de drenaje: zona reparada enero completamente seca.',
   NULL,
   NULL,
   '[]',
   NULL)
ON CONFLICT (id) DO NOTHING;
