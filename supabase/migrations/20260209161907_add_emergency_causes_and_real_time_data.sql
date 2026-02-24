/*
  # Agregar causas de emergencia y datos en tiempo real

  1. Nuevas Tablas
    - emergency_causes: Define las causas contempladas en el Plan de Emergencia
    - emergency_indicator_values: Valores actuales de indicadores en tiempo real
    - emergency_communication_templates: Plantillas de avisos por escenario

  2. Estructura
    - Causas categorizadas (hidrológicas, estructurales, sísmicas)
    - Valores en tiempo real para evaluación automática
    - Plantillas de comunicación automáticas
*/

-- Crear tabla de causas de emergencia contempladas
CREATE TABLE IF NOT EXISTS emergency_causes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL,
  name text NOT NULL,
  category text NOT NULL CHECK (category IN ('hydrological', 'structural', 'seismic', 'operational', 'inspection')),
  description text DEFAULT '',
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE emergency_causes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated users to read emergency causes"
  ON emergency_causes FOR SELECT
  TO authenticated
  USING (true);

-- Crear tabla de valores actuales de indicadores
CREATE TABLE IF NOT EXISTS emergency_indicator_values (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  indicator_id uuid NOT NULL REFERENCES emergency_indicators(id) ON DELETE CASCADE,
  dam_id uuid NOT NULL REFERENCES dams(id) ON DELETE CASCADE,
  current_value numeric,
  current_value_text text,
  measured_at timestamptz DEFAULT now(),
  source text DEFAULT 'manual' CHECK (source IN ('manual', 'automatic', 'auscultation', 'exploitation')),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE emergency_indicator_values ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated users to read indicator values"
  ON emergency_indicator_values FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to insert indicator values"
  ON emergency_indicator_values FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Crear tabla de plantillas de comunicación
CREATE TABLE IF NOT EXISTS emergency_communication_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  dam_id uuid REFERENCES dams(id) ON DELETE CASCADE,
  scenario_type text NOT NULL CHECK (scenario_type IN ('scenario_0', 'scenario_1', 'scenario_2', 'scenario_3')),
  template_name text NOT NULL,
  subject_template text NOT NULL,
  body_template text NOT NULL,
  recipients jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE emergency_communication_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated users to read communication templates"
  ON emergency_communication_templates FOR SELECT
  TO authenticated
  USING (true);

-- Insertar causas de emergencia estándar
INSERT INTO emergency_causes (code, name, category, description, sort_order) VALUES
('HIDRO-01', 'Eventos Hidrológicos', 'hydrological', 'Avenidas extraordinarias, crecidas, precipitaciones intensas', 1),
('AUSCU-01', 'Sistemas de Auscultación', 'structural', 'Lecturas anómalas en instrumentación de auscultación', 2),
('INSP-01', 'Labores de Inspección y Vigilancia', 'inspection', 'Anomalías detectadas durante inspecciones visuales', 3),
('SISMI-01', 'Fenómenos Sísmicos', 'seismic', 'Terremotos o movimientos sísmicos significativos', 4),
('DESL-01', 'Sistemas de Observación/Detección de Deslizamientos', 'structural', 'Deslizamientos de laderas o taludes', 5);

-- Insertar valores actuales simulados para indicadores de Alarcón
DO $$
DECLARE
  v_dam_alarcon uuid;
  v_indicator_nivel uuid;
  v_indicator_aportacion uuid;
  v_indicator_precipitacion uuid;
BEGIN
  SELECT id INTO v_dam_alarcon FROM dams WHERE code = 'AL-001';
  
  -- Get indicator IDs
  SELECT id INTO v_indicator_nivel FROM emergency_indicators 
  WHERE dam_id = v_dam_alarcon AND variable_name = 'Nivel de embalse' AND scenario_threshold = 'scenario_0';
  
  SELECT id INTO v_indicator_aportacion FROM emergency_indicators 
  WHERE dam_id = v_dam_alarcon AND variable_name = 'Aportación última hora';
  
  SELECT id INTO v_indicator_precipitacion FROM emergency_indicators 
  WHERE dam_id = v_dam_alarcon AND variable_name = 'Precipitación 24h';
  
  -- Insert simulated current values
  IF v_indicator_nivel IS NOT NULL THEN
    INSERT INTO emergency_indicator_values (indicator_id, dam_id, current_value, source, measured_at)
    VALUES (v_indicator_nivel, v_dam_alarcon, 285.5, 'exploitation', NOW() - INTERVAL '10 minutes');
  END IF;
  
  IF v_indicator_aportacion IS NOT NULL THEN
    INSERT INTO emergency_indicator_values (indicator_id, dam_id, current_value, source, measured_at)
    VALUES (v_indicator_aportacion, v_dam_alarcon, 45.0, 'automatic', NOW() - INTERVAL '5 minutes');
  END IF;
  
  IF v_indicator_precipitacion IS NOT NULL THEN
    INSERT INTO emergency_indicator_values (indicator_id, dam_id, current_value, source, measured_at)
    VALUES (v_indicator_precipitacion, v_dam_alarcon, 12.0, 'automatic', NOW() - INTERVAL '1 hour');
  END IF;
END $$;

-- Insertar plantilla de comunicación para Escenario 0
DO $$
DECLARE
  v_dam_alarcon uuid;
BEGIN
  SELECT id INTO v_dam_alarcon FROM dams WHERE code = 'AL-001';
  
  IF v_dam_alarcon IS NOT NULL THEN
    INSERT INTO emergency_communication_templates (dam_id, scenario_type, template_name, subject_template, body_template, recipients)
    VALUES (
      v_dam_alarcon,
      'scenario_0',
      'Declaración Escenario 0',
      'URGENTE: Activación Escenario 0 - {DAM_NAME}',
      'Se comunica la activación del ESCENARIO 0 del Plan de Emergencia de la presa {DAM_NAME}.

Fecha y hora: {ACTIVATION_DATE}
Causa: {CAUSE}
Descripción de la situación: {DESCRIPTION}

Nivel actual del embalse: {CURRENT_LEVEL} m.s.n.m
Aportación: {CURRENT_INFLOW} m³/s

Medidas adoptadas:
{MEASURES}

Se mantendrá informado de la evolución de la situación.

Director/a del Plan de Emergencia
{DIRECTOR_NAME}',
      '["centro.control@saih.es", "jefe.area@confederacion.es", "proteccion.civil@112.es"]'::jsonb
    );
  END IF;
END $$;
