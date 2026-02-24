/*
  # BIM Module

  This migration creates the database structure for the BIM (Building Information Modeling) module,
  which provides 3D visualization of dams and integration with other modules.

  ## New Tables

  ### 1. bim_models
  - `id` (uuid, primary key)
  - `dam_id` (uuid, foreign key to dams)
  - `model_name` (text)
  - `model_type` (text): 'point_cloud', 'digital_twin', 'geometric_model'
  - `file_url` (text): URL to the 3D model file
  - `file_size` (bigint)
  - `format` (text): 'ifc', 'rvt', 'obj', 'gltf', etc.
  - `lot_level` (text): Level of detail (LOD)
  - `scan_date` (date)
  - `version` (text)
  - `is_active` (boolean)
  - `metadata` (jsonb)
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 2. bim_elements
  - `id` (uuid, primary key)
  - `model_id` (uuid, foreign key to bim_models)
  - `inventory_asset_id` (uuid, foreign key to inventory_assets)
  - `element_code` (text)
  - `element_name` (text)
  - `element_type` (text)
  - `position` (jsonb): x, y, z coordinates
  - `rotation` (jsonb)
  - `scale` (jsonb)
  - `properties` (jsonb)
  - `is_visible` (boolean)
  - `created_at` (timestamptz)

  ### 3. bim_viewpoints
  - `id` (uuid, primary key)
  - `model_id` (uuid, foreign key to bim_models)
  - `name` (text)
  - `camera_position` (jsonb)
  - `camera_target` (jsonb)
  - `camera_up` (jsonb)
  - `is_default` (boolean)
  - `created_at` (timestamptz)

  ### 4. bim_asset_status
  - Real-time status view of assets in BIM model
  - Integrates with Maintenance, Exploitation, and Auscultation modules

  ## Security
  - Enable RLS on all tables
  - Policies for authenticated users based on their dam assignments
*/

-- Create bim_models table
CREATE TABLE IF NOT EXISTS bim_models (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  dam_id uuid REFERENCES dams(id) ON DELETE CASCADE NOT NULL,
  model_name text NOT NULL,
  model_type text NOT NULL CHECK (model_type IN ('point_cloud', 'digital_twin', 'geometric_model')),
  file_url text,
  file_size bigint DEFAULT 0,
  format text NOT NULL,
  lot_level text DEFAULT 'LOD300',
  scan_date date,
  version text DEFAULT '1.0',
  is_active boolean NOT NULL DEFAULT true,
  metadata jsonb DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Create bim_elements table
CREATE TABLE IF NOT EXISTS bim_elements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  model_id uuid REFERENCES bim_models(id) ON DELETE CASCADE NOT NULL,
  inventory_asset_id uuid REFERENCES inventory_assets(id) ON DELETE SET NULL,
  element_code text NOT NULL,
  element_name text NOT NULL,
  element_type text NOT NULL,
  category text NOT NULL,
  position jsonb DEFAULT '{"x": 0, "y": 0, "z": 0}',
  rotation jsonb DEFAULT '{"x": 0, "y": 0, "z": 0}',
  scale jsonb DEFAULT '{"x": 1, "y": 1, "z": 1}',
  properties jsonb DEFAULT '{}',
  is_visible boolean NOT NULL DEFAULT true,
  is_critical boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Create bim_viewpoints table
CREATE TABLE IF NOT EXISTS bim_viewpoints (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  model_id uuid REFERENCES bim_models(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  description text,
  camera_position jsonb NOT NULL DEFAULT '{"x": 0, "y": 0, "z": 100}',
  camera_target jsonb NOT NULL DEFAULT '{"x": 0, "y": 0, "z": 0}',
  camera_up jsonb NOT NULL DEFAULT '{"x": 0, "y": 1, "z": 0}',
  field_of_view numeric DEFAULT 60,
  is_default boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Create bim_asset_status view
CREATE OR REPLACE VIEW bim_asset_status AS
SELECT
  be.id as bim_element_id,
  be.element_code,
  be.element_name,
  be.element_type,
  be.model_id,
  ia.id as asset_id,
  ia.dam_id,
  ia.status as asset_status,
  -- Latest maintenance report
  (SELECT pdf_url FROM maintenance_reports mr
   JOIN maintenance_work_orders mwo ON mr.work_order_id = mwo.id
   JOIN inventory_items ii ON mwo.activity_id IN (
     SELECT id FROM maintenance_activities WHERE inventory_item_id = ii.id
   )
   WHERE ii.code = ia.code AND mr.is_locked = true
   ORDER BY mr.performed_at DESC
   LIMIT 1) as latest_maintenance_pdf,
  -- Operational situation from exploitation
  (SELECT operational_situation FROM exploitation_daily_data
   WHERE dam_id = ia.dam_id
   ORDER BY date DESC
   LIMIT 1) as operational_situation,
  -- Auscultation status
  (SELECT alert_level FROM auscultation_readings ar
   JOIN sensors s ON ar.sensor_id = s.id
   WHERE s.location LIKE '%' || ia.name || '%'
   ORDER BY ar.reading_date DESC
   LIMIT 1) as auscultation_alert_level
FROM bim_elements be
LEFT JOIN inventory_assets ia ON be.inventory_asset_id = ia.id;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_bim_models_dam_id ON bim_models(dam_id);
CREATE INDEX IF NOT EXISTS idx_bim_models_is_active ON bim_models(is_active);
CREATE INDEX IF NOT EXISTS idx_bim_elements_model_id ON bim_elements(model_id);
CREATE INDEX IF NOT EXISTS idx_bim_elements_inventory_asset_id ON bim_elements(inventory_asset_id);
CREATE INDEX IF NOT EXISTS idx_bim_elements_is_visible ON bim_elements(is_visible);
CREATE INDEX IF NOT EXISTS idx_bim_viewpoints_model_id ON bim_viewpoints(model_id);

-- Enable Row Level Security
ALTER TABLE bim_models ENABLE ROW LEVEL SECURITY;
ALTER TABLE bim_elements ENABLE ROW LEVEL SECURITY;
ALTER TABLE bim_viewpoints ENABLE ROW LEVEL SECURITY;

-- RLS Policies for bim_models
CREATE POLICY "Users can view BIM models for their assigned dams"
  ON bim_models FOR SELECT
  TO authenticated
  USING (
    dam_id IN (
      SELECT dam_id FROM user_dam_assignments WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage BIM models"
  ON bim_models FOR ALL
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

-- RLS Policies for bim_elements
CREATE POLICY "Users can view BIM elements for their assigned dams"
  ON bim_elements FOR SELECT
  TO authenticated
  USING (
    model_id IN (
      SELECT id FROM bim_models
      WHERE dam_id IN (
        SELECT dam_id FROM user_dam_assignments WHERE user_id = auth.uid()
      )
    )
  );

CREATE POLICY "Admins can manage BIM elements"
  ON bim_elements FOR ALL
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

-- RLS Policies for bim_viewpoints
CREATE POLICY "Users can view BIM viewpoints for their assigned dams"
  ON bim_viewpoints FOR SELECT
  TO authenticated
  USING (
    model_id IN (
      SELECT id FROM bim_models
      WHERE dam_id IN (
        SELECT dam_id FROM user_dam_assignments WHERE user_id = auth.uid()
      )
    )
  );

CREATE POLICY "Users can manage BIM viewpoints"
  ON bim_viewpoints FOR ALL
  TO authenticated
  USING (
    model_id IN (
      SELECT id FROM bim_models
      WHERE dam_id IN (
        SELECT dam_id FROM user_dam_assignments WHERE user_id = auth.uid()
      )
    )
  )
  WITH CHECK (
    model_id IN (
      SELECT id FROM bim_models
      WHERE dam_id IN (
        SELECT dam_id FROM user_dam_assignments WHERE user_id = auth.uid()
      )
    )
  );
