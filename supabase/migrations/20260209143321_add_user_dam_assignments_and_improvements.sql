/*
  # User Dam Assignments and Module Improvements

  This migration adds user-dam assignment tracking and improvements to existing modules
  to support the enhanced functionality requirements.

  ## New Tables

  ### 1. user_dam_assignments
  - `id` (uuid, primary key)
  - `user_id` (uuid, foreign key to user_profiles)
  - `dam_id` (uuid, foreign key to dams)
  - `role_in_dam` (text): 'director', 'operator', 'viewer'
  - `assigned_at` (timestamptz)
  - `assigned_by` (uuid)

  ## Modifications to Existing Tables

  ### technical_documents
  - Add `criticality_level` for document classification
  - Add `access_restrictions` for security control

  ### maintenance_reports
  - Add `is_locked` to prevent editing after closure
  - Add `pdf_generated_at` for PDF generation tracking
  - Add `pdf_url` for PDF storage

  ### exploitation_daily_data
  - Add `operational_situation` for Normal/Extraordinary status
  - Add `discharge_gates_operational` for gate operability tracking

  ### sensors (auscultation)
  - Add `threshold_extraordinary` and `threshold_scenario_0` for emergency thresholds

  ## Security
  - Enable RLS on all new tables
  - Update policies for existing tables
*/

-- Create user_dam_assignments table
CREATE TABLE IF NOT EXISTS user_dam_assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE NOT NULL,
  dam_id uuid REFERENCES dams(id) ON DELETE CASCADE NOT NULL,
  role_in_dam text NOT NULL CHECK (role_in_dam IN ('director', 'operator', 'viewer')) DEFAULT 'viewer',
  assigned_at timestamptz NOT NULL DEFAULT now(),
  assigned_by uuid REFERENCES user_profiles(id),
  UNIQUE(user_id, dam_id)
);

CREATE INDEX IF NOT EXISTS idx_user_dam_assignments_user_id ON user_dam_assignments(user_id);
CREATE INDEX IF NOT EXISTS idx_user_dam_assignments_dam_id ON user_dam_assignments(dam_id);

-- Enable RLS on user_dam_assignments
ALTER TABLE user_dam_assignments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own dam assignments"
  ON user_dam_assignments FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Admins can manage dam assignments"
  ON user_dam_assignments FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Add new columns to technical_documents for criticality classification
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'technical_documents' AND column_name = 'criticality_level'
  ) THEN
    ALTER TABLE technical_documents ADD COLUMN criticality_level text CHECK (criticality_level IN ('public', 'internal', 'confidential', 'restricted')) DEFAULT 'internal';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'technical_documents' AND column_name = 'access_restrictions'
  ) THEN
    ALTER TABLE technical_documents ADD COLUMN access_restrictions jsonb DEFAULT '[]';
  END IF;
END $$;

-- Add new columns to maintenance_reports for PDF generation and locking
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'maintenance_reports' AND column_name = 'is_locked'
  ) THEN
    ALTER TABLE maintenance_reports ADD COLUMN is_locked boolean DEFAULT false;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'maintenance_reports' AND column_name = 'pdf_generated_at'
  ) THEN
    ALTER TABLE maintenance_reports ADD COLUMN pdf_generated_at timestamptz;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'maintenance_reports' AND column_name = 'pdf_url'
  ) THEN
    ALTER TABLE maintenance_reports ADD COLUMN pdf_url text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'maintenance_reports' AND column_name = 'locked_by'
  ) THEN
    ALTER TABLE maintenance_reports ADD COLUMN locked_by uuid REFERENCES user_profiles(id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'maintenance_reports' AND column_name = 'locked_at'
  ) THEN
    ALTER TABLE maintenance_reports ADD COLUMN locked_at timestamptz;
  END IF;
END $$;

-- Add new columns to exploitation_daily_data for operational situations
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'exploitation_daily_data' AND column_name = 'operational_situation'
  ) THEN
    ALTER TABLE exploitation_daily_data ADD COLUMN operational_situation text CHECK (operational_situation IN ('normal', 'extraordinary', 'scenario_0')) DEFAULT 'normal';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'exploitation_daily_data' AND column_name = 'discharge_gates_status'
  ) THEN
    ALTER TABLE exploitation_daily_data ADD COLUMN discharge_gates_status jsonb DEFAULT '[]';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'exploitation_daily_data' AND column_name = 'seismic_event'
  ) THEN
    ALTER TABLE exploitation_daily_data ADD COLUMN seismic_event jsonb;
  END IF;
END $$;

-- Add new columns to sensors for emergency thresholds
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'sensors' AND column_name = 'threshold_extraordinary'
  ) THEN
    ALTER TABLE sensors ADD COLUMN threshold_extraordinary numeric;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'sensors' AND column_name = 'threshold_scenario_0'
  ) THEN
    ALTER TABLE sensors ADD COLUMN threshold_scenario_0 numeric;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'sensors' AND column_name = 'threshold_scenario_1'
  ) THEN
    ALTER TABLE sensors ADD COLUMN threshold_scenario_1 numeric;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'sensors' AND column_name = 'threshold_formula'
  ) THEN
    ALTER TABLE sensors ADD COLUMN threshold_formula text;
  END IF;
END $$;

-- Create table for discharge gates/organs
CREATE TABLE IF NOT EXISTS discharge_organs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  dam_id uuid REFERENCES dams(id) ON DELETE CASCADE NOT NULL,
  organ_type text NOT NULL CHECK (organ_type IN ('spillway', 'bottom_outlet', 'hydroelectric', 'ecological')),
  name text NOT NULL,
  code text NOT NULL,
  maximum_flow numeric NOT NULL DEFAULT 0,
  operational_status text NOT NULL CHECK (operational_status IN ('operational', 'partial', 'inoperative')) DEFAULT 'operational',
  flow_curve jsonb DEFAULT '[]',
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_discharge_organs_dam_id ON discharge_organs(dam_id);

ALTER TABLE discharge_organs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view discharge organs for their assigned dams"
  ON discharge_organs FOR SELECT
  TO authenticated
  USING (
    dam_id IN (
      SELECT dam_id FROM user_dam_assignments WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage discharge organs for their assigned dams"
  ON discharge_organs FOR ALL
  TO authenticated
  USING (
    dam_id IN (
      SELECT dam_id FROM user_dam_assignments WHERE user_id = auth.uid()
    )
  )
  WITH CHECK (
    dam_id IN (
      SELECT dam_id FROM user_dam_assignments WHERE user_id = auth.uid()
    )
  );

-- Create table for seasonal reserves (resguardos estacionales)
CREATE TABLE IF NOT EXISTS seasonal_reserves (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  dam_id uuid REFERENCES dams(id) ON DELETE CASCADE NOT NULL,
  month integer NOT NULL CHECK (month >= 1 AND month <= 12),
  reserve_percentage numeric NOT NULL CHECK (reserve_percentage >= 0 AND reserve_percentage <= 100),
  reserve_level numeric NOT NULL,
  required_organs jsonb NOT NULL DEFAULT '[]',
  notes text,
  valid_from date NOT NULL,
  valid_until date,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_seasonal_reserves_dam_id ON seasonal_reserves(dam_id);

ALTER TABLE seasonal_reserves ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view seasonal reserves for their assigned dams"
  ON seasonal_reserves FOR SELECT
  TO authenticated
  USING (
    dam_id IN (
      SELECT dam_id FROM user_dam_assignments WHERE user_id = auth.uid()
    )
  );

-- Create table for flood management rules (laminación de avenidas)
CREATE TABLE IF NOT EXISTS flood_management_rules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  dam_id uuid REFERENCES dams(id) ON DELETE CASCADE NOT NULL,
  rule_name text NOT NULL,
  level_reference text NOT NULL,
  min_level numeric NOT NULL,
  max_level numeric,
  discharge_percentage numeric NOT NULL,
  discharge_base_flow text NOT NULL CHECK (discharge_base_flow IN ('max_inflow_48h', 'current_inflow')),
  required_organs jsonb NOT NULL DEFAULT '[]',
  rule_order integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_flood_management_rules_dam_id ON flood_management_rules(dam_id);

ALTER TABLE flood_management_rules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view flood rules for their assigned dams"
  ON flood_management_rules FOR SELECT
  TO authenticated
  USING (
    dam_id IN (
      SELECT dam_id FROM user_dam_assignments WHERE user_id = auth.uid()
    )
  );

-- Create table for downstream affectations
CREATE TABLE IF NOT EXISTS downstream_affectations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  dam_id uuid REFERENCES dams(id) ON DELETE CASCADE NOT NULL,
  location_name text NOT NULL,
  location_type text NOT NULL CHECK (location_type IN ('bridge', 'town', 'infrastructure', 'natural_area')),
  latitude numeric,
  longitude numeric,
  critical_flow numeric NOT NULL,
  warning_flow numeric NOT NULL,
  contact_info jsonb DEFAULT '{}',
  notification_required boolean NOT NULL DEFAULT true,
  map_reference text,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_downstream_affectations_dam_id ON downstream_affectations(dam_id);

ALTER TABLE downstream_affectations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view downstream affectations for their assigned dams"
  ON downstream_affectations FOR SELECT
  TO authenticated
  USING (
    dam_id IN (
      SELECT dam_id FROM user_dam_assignments WHERE user_id = auth.uid()
    )
  );
