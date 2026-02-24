/*
  # Emergency Management Module

  This migration creates the complete database structure for the Emergency Management module,
  which manages emergency situations, scenarios, alerts, and population warning systems.

  ## New Tables

  ### 1. emergency_scenarios
  - `id` (uuid, primary key)
  - `dam_id` (uuid, foreign key to dams)
  - `scenario_type` (text): 'normal', 'extraordinary', 'scenario_0', 'scenario_1', 'scenario_2', 'scenario_3'
  - `cause` (text): Cause of the emergency
  - `activation_mode` (text): 'automatic' or 'manual'
  - `activated_by` (uuid, foreign key to user_profiles)
  - `activated_at` (timestamptz)
  - `deactivated_at` (timestamptz)
  - `status` (text): 'active', 'resolved', 'simulated'
  - `notes` (text)
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 2. emergency_indicators
  - Indicators for automatic scenario detection (quantitative and qualitative)

  ### 3. emergency_communications
  - Emergency communications and alerts tracking

  ### 4. warning_sirens
  - Population warning system status monitoring

  ### 5. emergency_procedures
  - Emergency response procedures

  ### 6. emergency_action_logs
  - Log of actions taken during emergencies

  ### 7. emergency_simulations
  - Training and drill simulations

  ### 8. cascade_emergency_links
  - Links between upstream and downstream dams for cascade emergencies

  ## Security
  - Enable RLS on all tables
  - Policies for authenticated users based on their dam assignments
*/

-- Create emergency_scenarios table
CREATE TABLE IF NOT EXISTS emergency_scenarios (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  dam_id uuid REFERENCES dams(id) ON DELETE CASCADE NOT NULL,
  scenario_type text NOT NULL CHECK (scenario_type IN ('normal', 'extraordinary', 'scenario_0', 'scenario_1', 'scenario_2', 'scenario_3')),
  cause text,
  activation_mode text NOT NULL CHECK (activation_mode IN ('automatic', 'manual')) DEFAULT 'manual',
  activated_by uuid REFERENCES user_profiles(id),
  activated_at timestamptz NOT NULL DEFAULT now(),
  deactivated_at timestamptz,
  status text NOT NULL CHECK (status IN ('active', 'resolved', 'simulated')) DEFAULT 'active',
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Create emergency_indicators table
CREATE TABLE IF NOT EXISTS emergency_indicators (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  dam_id uuid REFERENCES dams(id) ON DELETE CASCADE NOT NULL,
  indicator_type text NOT NULL CHECK (indicator_type IN ('quantitative', 'qualitative')),
  variable_name text NOT NULL,
  scenario_threshold text NOT NULL,
  threshold_value numeric,
  threshold_formula text,
  description text NOT NULL,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Create emergency_communications table
CREATE TABLE IF NOT EXISTS emergency_communications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  scenario_id uuid REFERENCES emergency_scenarios(id) ON DELETE CASCADE NOT NULL,
  communication_type text NOT NULL CHECK (communication_type IN ('email', 'sms', 'phone')),
  template_used text,
  recipients jsonb NOT NULL DEFAULT '[]',
  subject text,
  body text NOT NULL,
  sent_at timestamptz NOT NULL DEFAULT now(),
  delivery_status text NOT NULL CHECK (delivery_status IN ('pending', 'sent', 'delivered', 'failed')) DEFAULT 'pending',
  confirmation_received_at timestamptz,
  created_by uuid REFERENCES user_profiles(id)
);

-- Create warning_sirens table
CREATE TABLE IF NOT EXISTS warning_sirens (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  dam_id uuid REFERENCES dams(id) ON DELETE CASCADE NOT NULL,
  siren_code text NOT NULL,
  location_name text NOT NULL,
  latitude numeric,
  longitude numeric,
  operational_status text NOT NULL CHECK (operational_status IN ('operational', 'degraded', 'failed')) DEFAULT 'operational',
  last_check_at timestamptz,
  last_check_result text,
  installation_date date,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Create emergency_procedures table
CREATE TABLE IF NOT EXISTS emergency_procedures (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  dam_id uuid REFERENCES dams(id) ON DELETE CASCADE NOT NULL,
  scenario_type text NOT NULL,
  cause text,
  procedure_type text NOT NULL CHECK (procedure_type IN ('inspection', 'execution')),
  title text NOT NULL,
  description text NOT NULL,
  procedure_order integer NOT NULL DEFAULT 0,
  checklist_items jsonb NOT NULL DEFAULT '[]',
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Create emergency_action_logs table
CREATE TABLE IF NOT EXISTS emergency_action_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  scenario_id uuid REFERENCES emergency_scenarios(id) ON DELETE CASCADE NOT NULL,
  action_type text NOT NULL CHECK (action_type IN ('inspection', 'communication', 'maneuver', 'other')),
  description text NOT NULL,
  performed_by uuid REFERENCES user_profiles(id) NOT NULL,
  performed_at timestamptz NOT NULL DEFAULT now(),
  results text,
  attachments jsonb NOT NULL DEFAULT '[]',
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Create emergency_simulations table
CREATE TABLE IF NOT EXISTS emergency_simulations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  dam_id uuid REFERENCES dams(id) ON DELETE CASCADE NOT NULL,
  simulation_type text NOT NULL CHECK (simulation_type IN ('training', 'drill')),
  scenario_type text NOT NULL,
  cause text,
  started_by uuid REFERENCES user_profiles(id) NOT NULL,
  started_at timestamptz NOT NULL DEFAULT now(),
  completed_at timestamptz,
  participants jsonb NOT NULL DEFAULT '[]',
  evaluation_notes text,
  lessons_learned text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Create cascade_emergency_links table
CREATE TABLE IF NOT EXISTS cascade_emergency_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  upstream_dam_id uuid REFERENCES dams(id) ON DELETE CASCADE NOT NULL,
  downstream_dam_id uuid REFERENCES dams(id) ON DELETE CASCADE NOT NULL,
  trigger_scenario text NOT NULL,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_emergency_scenarios_dam_id ON emergency_scenarios(dam_id);
CREATE INDEX IF NOT EXISTS idx_emergency_scenarios_status ON emergency_scenarios(status);
CREATE INDEX IF NOT EXISTS idx_emergency_indicators_dam_id ON emergency_indicators(dam_id);
CREATE INDEX IF NOT EXISTS idx_emergency_communications_scenario_id ON emergency_communications(scenario_id);
CREATE INDEX IF NOT EXISTS idx_warning_sirens_dam_id ON warning_sirens(dam_id);
CREATE INDEX IF NOT EXISTS idx_warning_sirens_status ON warning_sirens(operational_status);
CREATE INDEX IF NOT EXISTS idx_emergency_procedures_dam_id ON emergency_procedures(dam_id);
CREATE INDEX IF NOT EXISTS idx_emergency_action_logs_scenario_id ON emergency_action_logs(scenario_id);
CREATE INDEX IF NOT EXISTS idx_emergency_simulations_dam_id ON emergency_simulations(dam_id);

-- Enable Row Level Security
ALTER TABLE emergency_scenarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE emergency_indicators ENABLE ROW LEVEL SECURITY;
ALTER TABLE emergency_communications ENABLE ROW LEVEL SECURITY;
ALTER TABLE warning_sirens ENABLE ROW LEVEL SECURITY;
ALTER TABLE emergency_procedures ENABLE ROW LEVEL SECURITY;
ALTER TABLE emergency_action_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE emergency_simulations ENABLE ROW LEVEL SECURITY;
ALTER TABLE cascade_emergency_links ENABLE ROW LEVEL SECURITY;

-- RLS Policies for emergency_scenarios
CREATE POLICY "Users can view scenarios for their assigned dams"
  ON emergency_scenarios FOR SELECT
  TO authenticated
  USING (
    dam_id IN (
      SELECT dam_id FROM user_dam_assignments WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create scenarios for their assigned dams"
  ON emergency_scenarios FOR INSERT
  TO authenticated
  WITH CHECK (
    dam_id IN (
      SELECT dam_id FROM user_dam_assignments WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update scenarios for their assigned dams"
  ON emergency_scenarios FOR UPDATE
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

-- RLS Policies for emergency_indicators
CREATE POLICY "Users can view indicators for their assigned dams"
  ON emergency_indicators FOR SELECT
  TO authenticated
  USING (
    dam_id IN (
      SELECT dam_id FROM user_dam_assignments WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage indicators"
  ON emergency_indicators FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role IN ('admin', 'technician')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role IN ('admin', 'technician')
    )
  );

-- RLS Policies for emergency_communications
CREATE POLICY "Users can view communications for scenarios they can access"
  ON emergency_communications FOR SELECT
  TO authenticated
  USING (
    scenario_id IN (
      SELECT id FROM emergency_scenarios
      WHERE dam_id IN (
        SELECT dam_id FROM user_dam_assignments WHERE user_id = auth.uid()
      )
    )
  );

CREATE POLICY "Users can create communications for their scenarios"
  ON emergency_communications FOR INSERT
  TO authenticated
  WITH CHECK (
    scenario_id IN (
      SELECT id FROM emergency_scenarios
      WHERE dam_id IN (
        SELECT dam_id FROM user_dam_assignments WHERE user_id = auth.uid()
      )
    )
  );

-- RLS Policies for warning_sirens
CREATE POLICY "Users can view sirens for their assigned dams"
  ON warning_sirens FOR SELECT
  TO authenticated
  USING (
    dam_id IN (
      SELECT dam_id FROM user_dam_assignments WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update siren status for their assigned dams"
  ON warning_sirens FOR UPDATE
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

-- RLS Policies for emergency_procedures
CREATE POLICY "Users can view procedures for their assigned dams"
  ON emergency_procedures FOR SELECT
  TO authenticated
  USING (
    dam_id IN (
      SELECT dam_id FROM user_dam_assignments WHERE user_id = auth.uid()
    )
  );

-- RLS Policies for emergency_action_logs
CREATE POLICY "Users can view action logs for scenarios they can access"
  ON emergency_action_logs FOR SELECT
  TO authenticated
  USING (
    scenario_id IN (
      SELECT id FROM emergency_scenarios
      WHERE dam_id IN (
        SELECT dam_id FROM user_dam_assignments WHERE user_id = auth.uid()
      )
    )
  );

CREATE POLICY "Users can create action logs for their scenarios"
  ON emergency_action_logs FOR INSERT
  TO authenticated
  WITH CHECK (
    scenario_id IN (
      SELECT id FROM emergency_scenarios
      WHERE dam_id IN (
        SELECT dam_id FROM user_dam_assignments WHERE user_id = auth.uid()
      )
    )
  );

-- RLS Policies for emergency_simulations
CREATE POLICY "Users can view simulations for their assigned dams"
  ON emergency_simulations FOR SELECT
  TO authenticated
  USING (
    dam_id IN (
      SELECT dam_id FROM user_dam_assignments WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create simulations for their assigned dams"
  ON emergency_simulations FOR INSERT
  TO authenticated
  WITH CHECK (
    dam_id IN (
      SELECT dam_id FROM user_dam_assignments WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update their own simulations"
  ON emergency_simulations FOR UPDATE
  TO authenticated
  USING (started_by = auth.uid())
  WITH CHECK (started_by = auth.uid());

-- RLS Policies for cascade_emergency_links
CREATE POLICY "Users can view cascade links for their assigned dams"
  ON cascade_emergency_links FOR SELECT
  TO authenticated
  USING (
    upstream_dam_id IN (
      SELECT dam_id FROM user_dam_assignments WHERE user_id = auth.uid()
    ) OR
    downstream_dam_id IN (
      SELECT dam_id FROM user_dam_assignments WHERE user_id = auth.uid()
    )
  );
