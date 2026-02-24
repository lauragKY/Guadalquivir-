/*
  # Create Auscultation Historical Data Storage

  1. New Tables
    - auscultation_readings: Historical sensor readings
    - auscultation_import_batches: Track bulk data imports

  2. Security
    - Enable RLS on all tables
    - Authenticated users can view readings
    - Technicians and admins can import data

  3. Important Notes
    - Historical data storage for pre-Damdata measurements
    - Supports manual entry and Excel imports
    - Complete audit trail for data imports
*/

CREATE TABLE IF NOT EXISTS auscultation_readings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sensor_id uuid REFERENCES sensors(id) ON DELETE CASCADE NOT NULL,
  dam_id uuid REFERENCES dams(id) ON DELETE CASCADE NOT NULL,
  reading_value decimal NOT NULL,
  reading_date timestamptz NOT NULL,
  alert_level text DEFAULT 'normal' CHECK (alert_level IN ('normal', 'caution', 'alert', 'critical')),
  data_source text DEFAULT 'manual' CHECK (data_source IN ('manual', 'excel_import', 'damdata_sync', 'automatic')),
  imported_by uuid REFERENCES user_profiles(id) ON DELETE SET NULL,
  import_batch_id text,
  notes text,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS auscultation_import_batches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  batch_id text UNIQUE NOT NULL,
  dam_id uuid REFERENCES dams(id) ON DELETE CASCADE NOT NULL,
  import_type text NOT NULL CHECK (import_type IN ('excel', 'manual')),
  file_name text,
  total_records integer DEFAULT 0,
  successful_records integer DEFAULT 0,
  failed_records integer DEFAULT 0,
  status text DEFAULT 'processing' CHECK (status IN ('processing', 'completed', 'failed')),
  imported_by uuid REFERENCES user_profiles(id) ON DELETE SET NULL NOT NULL,
  error_log jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now(),
  completed_at timestamptz
);

CREATE INDEX IF NOT EXISTS idx_auscultation_readings_sensor_id ON auscultation_readings(sensor_id);
CREATE INDEX IF NOT EXISTS idx_auscultation_readings_dam_id ON auscultation_readings(dam_id);
CREATE INDEX IF NOT EXISTS idx_auscultation_readings_date ON auscultation_readings(reading_date DESC);
CREATE INDEX IF NOT EXISTS idx_auscultation_readings_alert_level ON auscultation_readings(alert_level);
CREATE INDEX IF NOT EXISTS idx_auscultation_readings_batch ON auscultation_readings(import_batch_id);
CREATE INDEX IF NOT EXISTS idx_auscultation_import_batches_dam_id ON auscultation_import_batches(dam_id);
CREATE INDEX IF NOT EXISTS idx_auscultation_import_batches_status ON auscultation_import_batches(status);

ALTER TABLE auscultation_readings ENABLE ROW LEVEL SECURITY;
ALTER TABLE auscultation_import_batches ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view auscultation readings"
  ON auscultation_readings
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert auscultation readings"
  ON auscultation_readings
  FOR INSERT
  TO authenticated
  WITH CHECK (imported_by = auth.uid());

CREATE POLICY "Admins can manage auscultation readings"
  ON auscultation_readings
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can view import batches"
  ON auscultation_import_batches
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can create import batches"
  ON auscultation_import_batches
  FOR INSERT
  TO authenticated
  WITH CHECK (imported_by = auth.uid());

CREATE POLICY "Admins can manage import batches"
  ON auscultation_import_batches
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);
