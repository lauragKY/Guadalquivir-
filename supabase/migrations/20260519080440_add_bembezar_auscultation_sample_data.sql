/*
  # Datos de auscultación de ejemplo para Presa de Bembézar (GQ-009)

  Inserta datos realistas para demostrar el módulo de auscultación mejorado:
  1. Sensores: 8 dispositivos (piezómetros, aforos, inclinómetros, extensómetros)
  2. Lecturas: histórico 2026 con valores que incluyen superaciones de umbral
  3. Reglas de umbral: fórmulas de filtración del pliego (Q vs NE)
  4. Eventos: superaciones con distintos estados
  5. Log de alertas: auditoría de acciones del Director de Explotación
*/

-- ============================================================
-- SENSORES de Presa de Bembézar
-- ============================================================
INSERT INTO sensors (id, dam_id, name, sensor_type, location, unit, status, threshold_normal, threshold_caution, threshold_alert, threshold_critical)
VALUES
  ('d1000001-beef-4000-8000-000000000001', '0bbf880c-2745-40e7-828b-a798fd9636f3',
   'Piezómetro P-01', 'piezometer', 'Estribo izquierdo, cota 340 m', 'm.c.a.',
   'active', 20.0, 35.0, 45.0, 55.0),
  ('d1000001-beef-4000-8000-000000000002', '0bbf880c-2745-40e7-828b-a798fd9636f3',
   'Piezómetro P-04', 'piezometer', 'Cuerpo de presa, eje central, cota 355 m', 'm.c.a.',
   'active', 25.0, 40.0, 52.0, 62.0),
  ('d1000001-beef-4000-8000-000000000003', '0bbf880c-2745-40e7-828b-a798fd9636f3',
   'Piezómetro P-07', 'piezometer', 'Estribo derecho, cota 345 m', 'm.c.a.',
   'active', 18.0, 30.0, 40.0, 50.0),
  ('d1000001-beef-4000-8000-000000000004', '0bbf880c-2745-40e7-828b-a798fd9636f3',
   'Piezómetro P-10', 'piezometer', 'Galería drenaje nivel -2', 'm.c.a.',
   'active', 15.0, 28.0, 38.0, 48.0),
  ('d1000001-beef-4000-8000-000000000005', '0bbf880c-2745-40e7-828b-a798fd9636f3',
   'Aforador AF-01 — Filtración Total', 'flowmeter', 'Galería drenaje, salida aguas abajo', 'lts/min',
   'active', 50.0, 150.0, 250.0, 400.0),
  ('d1000001-beef-4000-8000-000000000006', '0bbf880c-2745-40e7-828b-a798fd9636f3',
   'Aforador AF-02 — Galería Izquierda', 'flowmeter', 'Galería estribo izquierdo', 'lts/min',
   'active', 20.0, 60.0, 100.0, 160.0),
  ('d1000001-beef-4000-8000-000000000007', '0bbf880c-2745-40e7-828b-a798fd9636f3',
   'Inclinómetro INC-01', 'inclinometer', 'Talud aguas abajo, punto medio', 'mm',
   'active', 2.0, 5.0, 10.0, 15.0),
  ('d1000001-beef-4000-8000-000000000008', '0bbf880c-2745-40e7-828b-a798fd9636f3',
   'Extensómetro EXT-01', 'extensometer', 'Coronación, junta de dilatación central', 'mm',
   'active', 1.0, 3.0, 6.0, 10.0)
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- LECTURAS históricas 2026 — Aforador AF-01 (Filtración Total)
-- ============================================================
INSERT INTO auscultation_readings (id, sensor_id, dam_id, reading_value, reading_date, alert_level, data_source, notes)
VALUES
  ('e1000001-beef-4000-8000-000000000001', 'd1000001-beef-4000-8000-000000000005', '0bbf880c-2745-40e7-828b-a798fd9636f3',  82.3, '2026-01-07 10:00:00+00', 'normal',  'manual', 'Lectura semanal'),
  ('e1000001-beef-4000-8000-000000000002', 'd1000001-beef-4000-8000-000000000005', '0bbf880c-2745-40e7-828b-a798fd9636f3',  85.1, '2026-01-14 10:00:00+00', 'normal',  'manual', NULL),
  ('e1000001-beef-4000-8000-000000000003', 'd1000001-beef-4000-8000-000000000005', '0bbf880c-2745-40e7-828b-a798fd9636f3',  91.7, '2026-01-21 10:00:00+00', 'normal',  'manual', NULL),
  ('e1000001-beef-4000-8000-000000000004', 'd1000001-beef-4000-8000-000000000005', '0bbf880c-2745-40e7-828b-a798fd9636f3',  88.4, '2026-01-28 10:00:00+00', 'normal',  'manual', NULL),
  ('e1000001-beef-4000-8000-000000000005', 'd1000001-beef-4000-8000-000000000005', '0bbf880c-2745-40e7-828b-a798fd9636f3',  95.2, '2026-02-04 10:00:00+00', 'normal',  'manual', NULL),
  ('e1000001-beef-4000-8000-000000000006', 'd1000001-beef-4000-8000-000000000005', '0bbf880c-2745-40e7-828b-a798fd9636f3', 103.8, '2026-02-11 10:00:00+00', 'normal',  'manual', NULL),
  ('e1000001-beef-4000-8000-000000000007', 'd1000001-beef-4000-8000-000000000005', '0bbf880c-2745-40e7-828b-a798fd9636f3',  98.6, '2026-02-18 10:00:00+00', 'normal',  'manual', NULL),
  ('e1000001-beef-4000-8000-000000000008', 'd1000001-beef-4000-8000-000000000005', '0bbf880c-2745-40e7-828b-a798fd9636f3', 107.3, '2026-02-25 10:00:00+00', 'normal',  'manual', NULL),
  ('e1000001-beef-4000-8000-000000000009', 'd1000001-beef-4000-8000-000000000005', '0bbf880c-2745-40e7-828b-a798fd9636f3', 118.5, '2026-03-04 10:00:00+00', 'normal',  'manual', 'Nivel embalse en ascenso'),
  ('e1000001-beef-4000-8000-000000000010', 'd1000001-beef-4000-8000-000000000005', '0bbf880c-2745-40e7-828b-a798fd9636f3', 132.1, '2026-03-11 10:00:00+00', 'caution', 'manual', 'Incremento tras lluvias'),
  ('e1000001-beef-4000-8000-000000000011', 'd1000001-beef-4000-8000-000000000005', '0bbf880c-2745-40e7-828b-a798fd9636f3', 145.7, '2026-03-18 10:00:00+00', 'caution', 'manual', NULL),
  ('e1000001-beef-4000-8000-000000000012', 'd1000001-beef-4000-8000-000000000005', '0bbf880c-2745-40e7-828b-a798fd9636f3', 128.9, '2026-03-25 10:00:00+00', 'caution', 'manual', NULL),
  ('e1000001-beef-4000-8000-000000000013', 'd1000001-beef-4000-8000-000000000005', '0bbf880c-2745-40e7-828b-a798fd9636f3', 162.4, '2026-04-01 10:00:00+00', 'caution', 'manual', 'Embalse 94%, vigilancia intensificada'),
  ('e1000001-beef-4000-8000-000000000014', 'd1000001-beef-4000-8000-000000000005', '0bbf880c-2745-40e7-828b-a798fd9636f3', 178.3, '2026-04-08 10:00:00+00', 'caution', 'manual', NULL),
  ('e1000001-beef-4000-8000-000000000015', 'd1000001-beef-4000-8000-000000000005', '0bbf880c-2745-40e7-828b-a798fd9636f3', 183.1, '2026-04-15 10:00:00+00', 'alert',   'manual', 'Superación umbral aviso'),
  ('e1000001-beef-4000-8000-000000000016', 'd1000001-beef-4000-8000-000000000005', '0bbf880c-2745-40e7-828b-a798fd9636f3', 171.6, '2026-04-22 10:00:00+00', 'caution', 'manual', 'Ligera bajada'),
  ('e1000001-beef-4000-8000-000000000017', 'd1000001-beef-4000-8000-000000000005', '0bbf880c-2745-40e7-828b-a798fd9636f3', 165.2, '2026-04-29 10:00:00+00', 'caution', 'manual', NULL),
  ('e1000001-beef-4000-8000-000000000018', 'd1000001-beef-4000-8000-000000000005', '0bbf880c-2745-40e7-828b-a798fd9636f3', 198.4, '2026-05-06 10:00:00+00', 'alert',   'manual', 'Umbral SE superado — NE=383.2m'),
  ('e1000001-beef-4000-8000-000000000019', 'd1000001-beef-4000-8000-000000000005', '0bbf880c-2745-40e7-828b-a798fd9636f3', 212.7, '2026-05-13 10:00:00+00', 'alert',   'manual', 'Umbral SE confirmado. Seguimiento diario activado'),
  ('e1000001-beef-4000-8000-000000000020', 'd1000001-beef-4000-8000-000000000005', '0bbf880c-2745-40e7-828b-a798fd9636f3', 187.9, '2026-05-19 10:00:00+00', 'alert',   'manual', 'Tendencia descendente')
ON CONFLICT (id) DO NOTHING;

-- Piezómetro P-07 lecturas
INSERT INTO auscultation_readings (id, sensor_id, dam_id, reading_value, reading_date, alert_level, data_source, notes)
VALUES
  ('e2000001-beef-4000-8000-000000000001', 'd1000001-beef-4000-8000-000000000003', '0bbf880c-2745-40e7-828b-a798fd9636f3', 22.1, '2026-01-07 10:00:00+00', 'normal',  'manual', NULL),
  ('e2000001-beef-4000-8000-000000000002', 'd1000001-beef-4000-8000-000000000003', '0bbf880c-2745-40e7-828b-a798fd9636f3', 23.5, '2026-02-04 10:00:00+00', 'normal',  'manual', NULL),
  ('e2000001-beef-4000-8000-000000000003', 'd1000001-beef-4000-8000-000000000003', '0bbf880c-2745-40e7-828b-a798fd9636f3', 27.8, '2026-03-04 10:00:00+00', 'normal',  'manual', NULL),
  ('e2000001-beef-4000-8000-000000000004', 'd1000001-beef-4000-8000-000000000003', '0bbf880c-2745-40e7-828b-a798fd9636f3', 34.2, '2026-04-01 10:00:00+00', 'caution', 'manual', NULL),
  ('e2000001-beef-4000-8000-000000000005', 'd1000001-beef-4000-8000-000000000003', '0bbf880c-2745-40e7-828b-a798fd9636f3', 36.9, '2026-05-06 10:00:00+00', 'caution', 'manual', NULL),
  ('e2000001-beef-4000-8000-000000000006', 'd1000001-beef-4000-8000-000000000003', '0bbf880c-2745-40e7-828b-a798fd9636f3', 33.1, '2026-05-19 10:00:00+00', 'caution', 'manual', 'Post-sustitución sensor')
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- REGLAS DE UMBRAL
-- ============================================================
INSERT INTO auscultation_threshold_rules (id, dam_id, sensor_id, variable_name, variable_code, variable_unit, severity_level, condition_type, formula_expression, formula_description, dependent_variable, dependent_variable_source, is_active, version)
VALUES
  ('f1000001-beef-4000-8000-000000000001', '0bbf880c-2745-40e7-828b-a798fd9636f3',
   'd1000001-beef-4000-8000-000000000005',
   'Filtración Total', 'AF-01', 'lts/min', 'extraordinary', 'greater_than',
   'Q > 4×10⁻¹³ × exp(0,0563 × NE) + 58,49',
   'Filtración Q supera umbral superior de Situación Extraordinaria en función del nivel de embalse NE',
   'NE — Nivel de embalse (m.s.n.m.)', 'damdata', true, 1),

  ('f1000001-beef-4000-8000-000000000002', '0bbf880c-2745-40e7-828b-a798fd9636f3',
   'd1000001-beef-4000-8000-000000000005',
   'Filtración Total', 'AF-01', 'lts/min', 'extraordinary', 'less_than',
   '0 < Q < 4×10⁻¹³ × exp(0,0563 × NE) − 58,49',
   'Filtración Q inferior al umbral mínimo de Situación Extraordinaria (caída anómala)',
   'NE — Nivel de embalse (m.s.n.m.)', 'damdata', true, 1),

  ('f1000001-beef-4000-8000-000000000003', '0bbf880c-2745-40e7-828b-a798fd9636f3',
   'd1000001-beef-4000-8000-000000000005',
   'Filtración Total', 'AF-01', 'lts/min', 'scenario_0', 'greater_than',
   'Q > 4×10⁻¹³ × exp(0,0563 × NE) + 116,98',
   'Filtración Q supera umbral de Escenario 0 del PEP. Activa propuesta de declaración automática.',
   'NE — Nivel de embalse (m.s.n.m.)', 'damdata', true, 1),

  ('f1000001-beef-4000-8000-000000000004', '0bbf880c-2745-40e7-828b-a798fd9636f3',
   'd1000001-beef-4000-8000-000000000005',
   'Filtración Total', 'AF-01', 'lts/min', 'scenario_0', 'less_than',
   '0 < Q < 4×10⁻¹³ × exp(0,0563 × NE) − 116,98',
   'Caída anómala de filtración que supera umbral negativo de Escenario 0.',
   'NE — Nivel de embalse (m.s.n.m.)', 'damdata', true, 1),

  ('f1000001-beef-4000-8000-000000000005', '0bbf880c-2745-40e7-828b-a798fd9636f3',
   'd1000001-beef-4000-8000-000000000003',
   'Piezómetro P-07', 'PZ-07', 'm.c.a.', 'extraordinary', 'greater_than',
   'H > 35,0',
   'Nivel piezométrico P-07 supera umbral de Situación Extraordinaria (35 m.c.a.)',
   NULL, NULL, true, 1),

  ('f1000001-beef-4000-8000-000000000006', '0bbf880c-2745-40e7-828b-a798fd9636f3',
   'd1000001-beef-4000-8000-000000000003',
   'Piezómetro P-07', 'PZ-07', 'm.c.a.', 'scenario_0', 'greater_than',
   'H > 45,0',
   'Nivel piezométrico P-07 supera umbral de Escenario 0 (45 m.c.a.)',
   NULL, NULL, true, 1)
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- EVENTOS de superación de umbrales
-- ============================================================
INSERT INTO auscultation_threshold_events (id, rule_id, dam_id, sensor_id, detected_at, measured_value, threshold_value, dependent_value, formula_evaluated, severity_level, status, confirmed_by, confirmed_at, notes)
VALUES
  ('11000001-beef-4000-8000-000000000001',
   'f1000001-beef-4000-8000-000000000001',
   '0bbf880c-2745-40e7-828b-a798fd9636f3',
   'd1000001-beef-4000-8000-000000000005',
   '2026-04-15 10:05:00+00',
   183.1, 166.2, 383.2,
   'Q=183,1 > 4×10⁻¹³×exp(0,0563×383,2)+58,49 = 166,2',
   'extraordinary', 'auto_resolved', NULL, NULL,
   'Superación confirmada. Tendencia descendente posterior. Auto-resuelta tras 7 días.'),

  ('11000001-beef-4000-8000-000000000002',
   'f1000001-beef-4000-8000-000000000001',
   '0bbf880c-2745-40e7-828b-a798fd9636f3',
   'd1000001-beef-4000-8000-000000000005',
   '2026-05-06 10:08:00+00',
   198.4, 168.7, 383.5,
   'Q=198,4 > 4×10⁻¹³×exp(0,0563×383,5)+58,49 = 168,7',
   'extraordinary', 'confirmed',
   'baba18cc-a55a-47db-8986-60a381dd5555',
   '2026-05-06 11:30:00+00',
   'Situación Extraordinaria confirmada. Seguimiento diario activado. Sin activación del PEP.'),

  ('11000001-beef-4000-8000-000000000003',
   'f1000001-beef-4000-8000-000000000001',
   '0bbf880c-2745-40e7-828b-a798fd9636f3',
   'd1000001-beef-4000-8000-000000000005',
   '2026-05-13 10:11:00+00',
   212.7, 169.1, 383.6,
   'Q=212,7 > 4×10⁻¹³×exp(0,0563×383,6)+58,49 = 169,1',
   'extraordinary', 'pending', NULL, NULL,
   'Segunda superación consecutiva. Propuesta de análisis de Escenario 0 en curso.')
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- LOG DE ALERTAS
-- ============================================================
INSERT INTO auscultation_alert_log (id, event_id, dam_id, action_type, actor_name, description, metadata)
VALUES
  ('21000001-beef-4000-8000-000000000001',
   '11000001-beef-4000-8000-000000000001',
   '0bbf880c-2745-40e7-828b-a798fd9636f3',
   'threshold_exceeded', 'Sistema SIPRESAS',
   'Superación SE detectada: AF-01 = 183,1 lts/min (umbral: 166,2). NE=383,2 m.s.n.m.',
   '{"sensor": "AF-01", "value": 183.1, "threshold": 166.2, "ne": 383.2}'),

  ('21000001-beef-4000-8000-000000000002',
   '11000001-beef-4000-8000-000000000001',
   '0bbf880c-2745-40e7-828b-a798fd9636f3',
   'notification_sent', 'Sistema SIPRESAS',
   'Notificación enviada al Director/a de Explotación: superación SE en AF-01.',
   '{"channel": "app", "recipient": "Director Explotación"}'),

  ('21000001-beef-4000-8000-000000000003',
   '11000001-beef-4000-8000-000000000001',
   '0bbf880c-2745-40e7-828b-a798fd9636f3',
   'auto_resolved', 'Sistema SIPRESAS',
   'Evento auto-resuelto: filtración retornó a zona de aviso tras 7 días.',
   '{"next_reading": 171.6, "days_elapsed": 7}'),

  ('21000001-beef-4000-8000-000000000004',
   '11000001-beef-4000-8000-000000000002',
   '0bbf880c-2745-40e7-828b-a798fd9636f3',
   'threshold_exceeded', 'Sistema SIPRESAS',
   'Superación SE detectada: AF-01 = 198,4 lts/min (umbral: 168,7). NE=383,5 m.s.n.m.',
   '{"sensor": "AF-01", "value": 198.4, "threshold": 168.7, "ne": 383.5}'),

  ('21000001-beef-4000-8000-000000000005',
   '11000001-beef-4000-8000-000000000002',
   '0bbf880c-2745-40e7-828b-a798fd9636f3',
   'notification_sent', 'Sistema SIPRESAS',
   'Notificación enviada al Director/a de Explotación — Situación Extraordinaria AF-01.',
   '{"channel": "app", "recipient": "Director Explotación"}'),

  ('21000001-beef-4000-8000-000000000006',
   '11000001-beef-4000-8000-000000000002',
   '0bbf880c-2745-40e7-828b-a798fd9636f3',
   'scenario_confirmed', 'Adm. SIPRESAS',
   'Director/a confirma Situación Extraordinaria. Seguimiento diario activado. PEP no activado.',
   '{"decision": "confirmed", "pep_activated": false, "monitoring": "daily"}'),

  ('21000001-beef-4000-8000-000000000007',
   '11000001-beef-4000-8000-000000000003',
   '0bbf880c-2745-40e7-828b-a798fd9636f3',
   'threshold_exceeded', 'Sistema SIPRESAS',
   'Segunda superación SE consecutiva: AF-01 = 212,7 lts/min (máximo histórico). NE=383,6 m.s.n.m.',
   '{"sensor": "AF-01", "value": 212.7, "threshold": 169.1, "ne": 383.6, "consecutive": 2}'),

  ('21000001-beef-4000-8000-000000000008',
   '11000001-beef-4000-8000-000000000003',
   '0bbf880c-2745-40e7-828b-a798fd9636f3',
   'scenario_proposed', 'Sistema SIPRESAS',
   'Propuesta automática de análisis Escenario 0 generada por 2ª superación consecutiva. Pendiente validación.',
   '{"proposal": "scenario_0_analysis", "requires_validation": true}')
ON CONFLICT (id) DO NOTHING;
