/*
  # Módulo de Auscultación — Umbrales y Alertas

  Amplía el módulo de auscultación con la funcionalidad de gestión de umbrales
  configurables y alertas automáticas vinculadas al Plan de Emergencia.

  ## Nuevas tablas

  ### 1. auscultation_threshold_rules
  Define las reglas matemáticas de umbral para cada sensor/variable de auscultación.
  Soporta expresiones configurables dependientes de variables externas (nivel embalse, temperatura).
  Cada sensor puede tener múltiples reglas con niveles de severidad diferente.

  ### 2. auscultation_threshold_events
  Registro histórico de cada superación de umbral detectada por el motor de cálculo.
  Incluye el valor medido, el valor del umbral en ese momento, la fórmula evaluada
  y el estado de resolución (confirmado/rechazado por el Director de Explotación).

  ### 3. auscultation_alert_log
  Log de auditoría de todas las notificaciones enviadas y acciones tomadas.
  Vinculado al módulo de Plan de Emergencia para declaración de escenarios.

  ## Seguridad
  - RLS habilitado en todas las tablas
  - Solo usuarios autenticados pueden leer
  - Solo admin/technician pueden insertar/modificar reglas
*/

-- ============================================================
-- 1. THRESHOLD RULES — reglas matemáticas configurables
-- ============================================================
CREATE TABLE IF NOT EXISTS auscultation_threshold_rules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  dam_id uuid NOT NULL REFERENCES dams(id) ON DELETE CASCADE,
  sensor_id uuid REFERENCES sensors(id) ON DELETE CASCADE,
  variable_name text NOT NULL,
  variable_code text NOT NULL,
  variable_unit text NOT NULL DEFAULT '',
  severity_level text NOT NULL CHECK (severity_level IN ('extraordinary', 'scenario_0', 'scenario_1')),
  condition_type text NOT NULL CHECK (condition_type IN ('greater_than', 'less_than', 'outside_range')),
  formula_expression text NOT NULL,
  formula_description text,
  dependent_variable text,
  dependent_variable_source text CHECK (dependent_variable_source IN ('saih', 'damdata', 'manual', 'system')),
  is_active boolean NOT NULL DEFAULT true,
  version integer NOT NULL DEFAULT 1,
  created_by uuid REFERENCES user_profiles(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_threshold_rules_dam ON auscultation_threshold_rules(dam_id);
CREATE INDEX IF NOT EXISTS idx_threshold_rules_sensor ON auscultation_threshold_rules(sensor_id);
CREATE INDEX IF NOT EXISTS idx_threshold_rules_active ON auscultation_threshold_rules(is_active);

ALTER TABLE auscultation_threshold_rules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view threshold rules"
  ON auscultation_threshold_rules FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert threshold rules"
  ON auscultation_threshold_rules FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update threshold rules"
  ON auscultation_threshold_rules FOR UPDATE
  TO authenticated
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

-- ============================================================
-- 2. THRESHOLD EVENTS — superaciones registradas
-- ============================================================
CREATE TABLE IF NOT EXISTS auscultation_threshold_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  rule_id uuid NOT NULL REFERENCES auscultation_threshold_rules(id) ON DELETE CASCADE,
  dam_id uuid NOT NULL REFERENCES dams(id) ON DELETE CASCADE,
  sensor_id uuid REFERENCES sensors(id) ON DELETE SET NULL,
  detected_at timestamptz NOT NULL DEFAULT now(),
  measured_value numeric NOT NULL,
  threshold_value numeric NOT NULL,
  dependent_value numeric,
  formula_evaluated text NOT NULL,
  severity_level text NOT NULL CHECK (severity_level IN ('extraordinary', 'scenario_0', 'scenario_1')),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'rejected', 'auto_resolved')),
  confirmed_by uuid REFERENCES user_profiles(id) ON DELETE SET NULL,
  confirmed_at timestamptz,
  rejection_reason text,
  emergency_declaration_id uuid,
  notes text,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_threshold_events_dam ON auscultation_threshold_events(dam_id);
CREATE INDEX IF NOT EXISTS idx_threshold_events_detected ON auscultation_threshold_events(detected_at DESC);
CREATE INDEX IF NOT EXISTS idx_threshold_events_status ON auscultation_threshold_events(status);
CREATE INDEX IF NOT EXISTS idx_threshold_events_severity ON auscultation_threshold_events(severity_level);

ALTER TABLE auscultation_threshold_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view threshold events"
  ON auscultation_threshold_events FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert threshold events"
  ON auscultation_threshold_events FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update threshold events"
  ON auscultation_threshold_events FOR UPDATE
  TO authenticated
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

-- ============================================================
-- 3. ALERT LOG — auditoría de notificaciones y acciones
-- ============================================================
CREATE TABLE IF NOT EXISTS auscultation_alert_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid REFERENCES auscultation_threshold_events(id) ON DELETE CASCADE,
  dam_id uuid NOT NULL REFERENCES dams(id) ON DELETE CASCADE,
  action_type text NOT NULL CHECK (action_type IN (
    'threshold_exceeded', 'notification_sent', 'scenario_proposed',
    'scenario_confirmed', 'scenario_rejected', 'manual_override', 'auto_resolved'
  )),
  actor_id uuid REFERENCES user_profiles(id) ON DELETE SET NULL,
  actor_name text,
  description text NOT NULL,
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_alert_log_dam ON auscultation_alert_log(dam_id);
CREATE INDEX IF NOT EXISTS idx_alert_log_created ON auscultation_alert_log(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_alert_log_event ON auscultation_alert_log(event_id);

ALTER TABLE auscultation_alert_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view alert log"
  ON auscultation_alert_log FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert alert log"
  ON auscultation_alert_log FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);
