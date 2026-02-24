/*
  # Enhanced Inventory Module - Complete Asset Hierarchy

  ## Overview
  This migration creates a comprehensive inventory system matching the SIPRESAS structure
  with hierarchical assets, detailed technical data, and complete documentation.

  ## New Tables
  
  ### 1. `inventory_asset_categories`
  Categories for organizing assets (Activos, Áreas, Líneas, Equipos)
  - `id` (uuid, primary key)
  - `code` (text, unique) - Category code
  - `name` (text) - Category name
  - `description` (text) - Category description
  - `parent_id` (uuid, nullable) - For hierarchical categories
  - `sort_order` (integer) - Display order
  
  ### 2. `inventory_assets`
  Main asset inventory with hierarchical structure
  - `id` (uuid, primary key)
  - `dam_id` (uuid) - Reference to dam
  - `category_id` (uuid) - Reference to category
  - `parent_asset_id` (uuid, nullable) - For hierarchical structure
  - `code` (text) - Asset code (e.g., AC001, ALI)
  - `name` (text) - Asset name
  - `full_code` (text) - Complete hierarchical code
  - `description` (text) - Short description
  - `extended_description` (text) - Long description
  - `status` (text) - Current status
  - `installation_date` (date)
  - `commissioning_date` (date)
  - `manufacturer` (text)
  - `model` (text)
  - `serial_number` (text)
  - `location` (text)
  - `sort_order` (integer)
  - Technical and operational data
  
  ### 3. `inventory_technical_data`
  Additional technical specifications for assets
  - Stores key-value pairs of technical data
  - Flexible structure for different asset types
  
  ### 4. `inventory_photos`
  Photos and images for assets
  - Links to storage system
  - Multiple photos per asset
  
  ## Security
  - Enable RLS on all tables
  - Policies for authenticated users to read inventory data
  - Policies for authorized users to modify inventory data
*/

-- Create asset categories table
CREATE TABLE IF NOT EXISTS inventory_asset_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text UNIQUE NOT NULL,
  name text NOT NULL,
  description text DEFAULT '',
  parent_id uuid REFERENCES inventory_asset_categories(id) ON DELETE CASCADE,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create main assets table with hierarchical structure
CREATE TABLE IF NOT EXISTS inventory_assets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  dam_id uuid REFERENCES dams(id) ON DELETE CASCADE NOT NULL,
  category_id uuid REFERENCES inventory_asset_categories(id) NOT NULL,
  parent_asset_id uuid REFERENCES inventory_assets(id) ON DELETE CASCADE,
  code text NOT NULL,
  name text NOT NULL,
  full_code text NOT NULL,
  description text DEFAULT '',
  extended_description text DEFAULT '',
  status text DEFAULT 'active',
  
  -- Dates
  installation_date date,
  commissioning_date date,
  construction_end_date date,
  document_date text,
  
  -- Ownership and responsibility
  owner text DEFAULT '',
  operator text DEFAULT '',
  
  -- Design and construction
  designer text DEFAULT '',
  construction_manager text DEFAULT '',
  contractor text DEFAULT '',
  
  -- Classification
  risk_category text DEFAULT '',
  usage_type text DEFAULT '',
  
  -- Approvals and regulations
  exploitation_norms_approval text DEFAULT '',
  emergency_plan_approval text DEFAULT '',
  emergency_plan_homologation text DEFAULT '',
  
  -- Physical characteristics
  manufacturer text DEFAULT '',
  model text DEFAULT '',
  serial_number text DEFAULT '',
  location text DEFAULT '',
  
  -- Hydraulic data
  capacity_nmn numeric(10,2),
  surface_nmn numeric(10,3),
  avg_precipitation numeric(10,2),
  avg_inflow numeric(10,2),
  design_flood numeric(10,3),
  extreme_flood numeric(10,3),
  
  -- Dam technical data
  dam_type text DEFAULT '',
  height_above_riverbed numeric(10,2),
  height_from_foundation numeric(10,2),
  crest_length numeric(10,2),
  crest_elevation numeric(10,2),
  
  -- Metadata
  sort_order integer DEFAULT 0,
  is_visible boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  CONSTRAINT unique_asset_code_per_dam UNIQUE(dam_id, full_code)
);

-- Create technical data table for flexible key-value storage
CREATE TABLE IF NOT EXISTS inventory_technical_data (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  asset_id uuid REFERENCES inventory_assets(id) ON DELETE CASCADE NOT NULL,
  data_key text NOT NULL,
  data_value text NOT NULL,
  data_type text DEFAULT 'text',
  unit text DEFAULT '',
  category text DEFAULT 'general',
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  CONSTRAINT unique_key_per_asset UNIQUE(asset_id, data_key)
);

-- Create photos table
CREATE TABLE IF NOT EXISTS inventory_photos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  asset_id uuid REFERENCES inventory_assets(id) ON DELETE CASCADE NOT NULL,
  title text DEFAULT '',
  description text DEFAULT '',
  file_path text NOT NULL,
  file_url text,
  mime_type text DEFAULT 'image/jpeg',
  file_size bigint DEFAULT 0,
  sort_order integer DEFAULT 0,
  is_primary boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_inventory_assets_dam_id ON inventory_assets(dam_id);
CREATE INDEX IF NOT EXISTS idx_inventory_assets_category_id ON inventory_assets(category_id);
CREATE INDEX IF NOT EXISTS idx_inventory_assets_parent_id ON inventory_assets(parent_asset_id);
CREATE INDEX IF NOT EXISTS idx_inventory_assets_code ON inventory_assets(code);
CREATE INDEX IF NOT EXISTS idx_inventory_assets_full_code ON inventory_assets(full_code);
CREATE INDEX IF NOT EXISTS idx_inventory_technical_data_asset_id ON inventory_technical_data(asset_id);
CREATE INDEX IF NOT EXISTS idx_inventory_photos_asset_id ON inventory_photos(asset_id);

-- Enable RLS
ALTER TABLE inventory_asset_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_technical_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_photos ENABLE ROW LEVEL SECURITY;

-- RLS Policies for asset categories
CREATE POLICY "Asset categories are viewable by authenticated users"
  ON inventory_asset_categories FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Asset categories can be managed by authenticated users"
  ON inventory_asset_categories FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- RLS Policies for assets
CREATE POLICY "Assets are viewable by authenticated users"
  ON inventory_assets FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Assets can be created by authenticated users"
  ON inventory_assets FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Assets can be updated by authenticated users"
  ON inventory_assets FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Assets can be deleted by authenticated users"
  ON inventory_assets FOR DELETE
  TO authenticated
  USING (true);

-- RLS Policies for technical data
CREATE POLICY "Technical data is viewable by authenticated users"
  ON inventory_technical_data FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Technical data can be managed by authenticated users"
  ON inventory_technical_data FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- RLS Policies for photos
CREATE POLICY "Photos are viewable by authenticated users"
  ON inventory_photos FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Photos can be managed by authenticated users"
  ON inventory_photos FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Insert default asset categories
INSERT INTO inventory_asset_categories (code, name, description, sort_order) VALUES
  ('ACTIVOS', 'Activos', 'Activos generales de la presa', 1),
  ('AREAS', 'Áreas', 'Áreas funcionales de la presa', 2),
  ('LINEAS', 'Líneas', 'Líneas de sistemas', 3),
  ('EQUIPOS', 'Equipos', 'Equipos y maquinaria', 4)
ON CONFLICT (code) DO NOTHING;
