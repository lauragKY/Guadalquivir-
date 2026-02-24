/*
  # Create Inventory Module Schema

  1. New Tables
    - `inventory_items`
      - `id` (uuid, primary key)
      - `dam_id` (uuid, foreign key to dams)
      - `parent_id` (uuid, self-referencing for hierarchy)
      - `code` (text, item code like "AC01", "CHG.E58")
      - `name` (text, item name)
      - `description` (text, short description)
      - `extended_description` (text, detailed description)
      - `item_type` (text, type: 'asset', 'area', 'line', 'equipment')
      - `photos` (jsonb, array of photo URLs)
      - `technical_data` (jsonb, flexible technical specifications)
      - `general_data` (jsonb, general information)
      - `category` (text, category classification)
      - `status` (text, operational status)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `inventory_items` table
    - Add policies for authenticated users to read inventory data
    - Add policies for admins and technicians to manage inventory
*/

CREATE TABLE IF NOT EXISTS inventory_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  dam_id uuid REFERENCES dams(id) ON DELETE CASCADE NOT NULL,
  parent_id uuid REFERENCES inventory_items(id) ON DELETE CASCADE,
  code text NOT NULL,
  name text NOT NULL,
  description text,
  extended_description text,
  item_type text NOT NULL CHECK (item_type IN ('asset', 'area', 'line', 'equipment')),
  photos jsonb DEFAULT '[]'::jsonb,
  technical_data jsonb DEFAULT '{}'::jsonb,
  general_data jsonb DEFAULT '{}'::jsonb,
  category text,
  status text DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'maintenance', 'retired')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_inventory_items_dam_id ON inventory_items(dam_id);
CREATE INDEX IF NOT EXISTS idx_inventory_items_parent_id ON inventory_items(parent_id);
CREATE INDEX IF NOT EXISTS idx_inventory_items_type ON inventory_items(item_type);
CREATE INDEX IF NOT EXISTS idx_inventory_items_code ON inventory_items(code);

ALTER TABLE inventory_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view inventory"
  ON inventory_items
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can insert inventory"
  ON inventory_items
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role IN ('admin', 'technician')
    )
  );

CREATE POLICY "Admins can update inventory"
  ON inventory_items
  FOR UPDATE
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

CREATE POLICY "Admins can delete inventory"
  ON inventory_items
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'admin'
    )
  );
