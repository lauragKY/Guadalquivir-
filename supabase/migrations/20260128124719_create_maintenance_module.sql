/*
  # Create Maintenance Module Schema

  1. New Tables
    - `maintenance_activities`
      - `id` (uuid, primary key)
      - `dam_id` (uuid, foreign key to dams)
      - `inventory_item_id` (uuid, foreign key to inventory_items, optional)
      - `code` (text, activity code)
      - `name` (text, activity name)
      - `description` (text)
      - `activity_type` (text: 'preventive' or 'corrective')
      - `category` (text, maintenance category)
      - `periodicity` (text: 'daily', 'weekly', 'monthly', 'quarterly', 'semiannual', 'annual')
      - `estimated_duration` (integer, minutes)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `maintenance_work_orders`
      - `id` (uuid, primary key)
      - `dam_id` (uuid, foreign key to dams)
      - `activity_id` (uuid, foreign key to maintenance_activities)
      - `code` (text, work order code)
      - `title` (text)
      - `description` (text)
      - `order_type` (text: 'preventive' or 'corrective')
      - `status` (text: 'pending', 'in_progress', 'completed', 'cancelled')
      - `priority` (text: 'low', 'medium', 'high', 'urgent')
      - `scheduled_date` (date)
      - `scheduled_month` (integer, 1-12)
      - `scheduled_year` (integer)
      - `started_at` (timestamptz)
      - `completed_at` (timestamptz)
      - `assigned_to` (uuid, foreign key to user_profiles)
      - `created_by` (uuid, foreign key to user_profiles)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `maintenance_reports`
      - `id` (uuid, primary key)
      - `work_order_id` (uuid, foreign key to maintenance_work_orders)
      - `performed_by` (uuid, foreign key to user_profiles)
      - `performed_at` (timestamptz)
      - `duration_minutes` (integer)
      - `observations` (text)
      - `issues_found` (text)
      - `corrective_actions` (text)
      - `materials_used` (jsonb)
      - `next_actions_required` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on all maintenance tables
    - Add policies for authenticated users to read maintenance data
    - Add policies for admins and technicians to manage maintenance
*/

CREATE TABLE IF NOT EXISTS maintenance_activities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  dam_id uuid REFERENCES dams(id) ON DELETE CASCADE NOT NULL,
  inventory_item_id uuid REFERENCES inventory_items(id) ON DELETE SET NULL,
  code text NOT NULL,
  name text NOT NULL,
  description text,
  activity_type text NOT NULL CHECK (activity_type IN ('preventive', 'corrective')),
  category text,
  periodicity text CHECK (periodicity IN ('daily', 'weekly', 'monthly', 'quarterly', 'semiannual', 'annual', 'biennial')),
  estimated_duration integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS maintenance_work_orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  dam_id uuid REFERENCES dams(id) ON DELETE CASCADE NOT NULL,
  activity_id uuid REFERENCES maintenance_activities(id) ON DELETE SET NULL,
  code text NOT NULL,
  title text NOT NULL,
  description text,
  order_type text NOT NULL CHECK (order_type IN ('preventive', 'corrective')),
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')),
  priority text DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  scheduled_date date,
  scheduled_month integer CHECK (scheduled_month >= 1 AND scheduled_month <= 12),
  scheduled_year integer,
  started_at timestamptz,
  completed_at timestamptz,
  assigned_to uuid REFERENCES user_profiles(id) ON DELETE SET NULL,
  created_by uuid REFERENCES user_profiles(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS maintenance_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  work_order_id uuid REFERENCES maintenance_work_orders(id) ON DELETE CASCADE NOT NULL,
  performed_by uuid REFERENCES user_profiles(id) ON DELETE SET NULL NOT NULL,
  performed_at timestamptz DEFAULT now(),
  duration_minutes integer DEFAULT 0,
  observations text,
  issues_found text,
  corrective_actions text,
  materials_used jsonb DEFAULT '[]'::jsonb,
  next_actions_required text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_maintenance_activities_dam_id ON maintenance_activities(dam_id);
CREATE INDEX IF NOT EXISTS idx_maintenance_activities_type ON maintenance_activities(activity_type);
CREATE INDEX IF NOT EXISTS idx_maintenance_work_orders_dam_id ON maintenance_work_orders(dam_id);
CREATE INDEX IF NOT EXISTS idx_maintenance_work_orders_status ON maintenance_work_orders(status);
CREATE INDEX IF NOT EXISTS idx_maintenance_work_orders_type ON maintenance_work_orders(order_type);
CREATE INDEX IF NOT EXISTS idx_maintenance_work_orders_date ON maintenance_work_orders(scheduled_date);
CREATE INDEX IF NOT EXISTS idx_maintenance_work_orders_month_year ON maintenance_work_orders(scheduled_year, scheduled_month);
CREATE INDEX IF NOT EXISTS idx_maintenance_reports_work_order_id ON maintenance_reports(work_order_id);

ALTER TABLE maintenance_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE maintenance_work_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE maintenance_reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view maintenance activities"
  ON maintenance_activities
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage maintenance activities"
  ON maintenance_activities
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role IN ('admin', 'technician')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role IN ('admin', 'technician')
    )
  );

CREATE POLICY "Authenticated users can view work orders"
  ON maintenance_work_orders
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage work orders"
  ON maintenance_work_orders
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role IN ('admin', 'technician', 'operator')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role IN ('admin', 'technician', 'operator')
    )
  );

CREATE POLICY "Authenticated users can view maintenance reports"
  ON maintenance_reports
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Technicians can manage maintenance reports"
  ON maintenance_reports
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role IN ('admin', 'technician', 'operator')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role IN ('admin', 'technician', 'operator')
    )
  );
