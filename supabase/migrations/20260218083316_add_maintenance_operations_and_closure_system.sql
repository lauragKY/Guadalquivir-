/*
  # Add Maintenance Operations and Closure System

  1. New Tables
    - `maintenance_work_order_operations`
      - `id` (uuid, primary key)
      - `work_order_id` (uuid, foreign key to maintenance_work_orders)
      - `operation_number` (integer) - Order position in the list
      - `operation_name` (text) - Name/description of the operation
      - `operation_description` (text) - Detailed description
      - `status` (text) - pending, in_progress, completed
      - `result` (text) - Results or findings
      - `notes` (text) - Additional notes
      - `completed_at` (timestamptz) - When operation was completed
      - `completed_by` (uuid, foreign key to user_profiles)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `maintenance_work_order_closure`
      - `id` (uuid, primary key)
      - `work_order_id` (uuid, foreign key to maintenance_work_orders, unique)
      - `closed_at` (timestamptz) - When the work order was closed
      - `closed_by` (uuid, foreign key to user_profiles)
      - `pdf_generated` (boolean) - Whether PDF was generated
      - `pdf_file_path` (text) - Path to generated PDF
      - `sent_to_bim` (boolean) - Whether PDF was sent to BIM module
      - `bim_sent_at` (timestamptz) - When PDF was sent to BIM
      - `observations` (text) - Final observations
      - `created_at` (timestamptz)

  2. Changes to existing tables
    - Add `is_closed` (boolean) column to `maintenance_work_orders`
    - Add `closed_at` (timestamptz) column to `maintenance_work_orders`

  3. Security
    - Enable RLS on new tables
    - Add policies for authenticated users based on dam assignments

  4. Indexes
    - Add index on work_order_id for operations
    - Add index on operation_number for sorting
*/

-- Add columns to maintenance_work_orders
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'maintenance_work_orders' AND column_name = 'is_closed'
  ) THEN
    ALTER TABLE maintenance_work_orders ADD COLUMN is_closed BOOLEAN DEFAULT false;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'maintenance_work_orders' AND column_name = 'closed_at'
  ) THEN
    ALTER TABLE maintenance_work_orders ADD COLUMN closed_at TIMESTAMPTZ;
  END IF;
END $$;

-- Create maintenance_work_order_operations table
CREATE TABLE IF NOT EXISTS maintenance_work_order_operations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  work_order_id UUID NOT NULL REFERENCES maintenance_work_orders(id) ON DELETE CASCADE,
  operation_number INTEGER NOT NULL,
  operation_name TEXT NOT NULL,
  operation_description TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed')),
  result TEXT,
  notes TEXT,
  completed_at TIMESTAMPTZ,
  completed_by UUID REFERENCES user_profiles(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create maintenance_work_order_closure table
CREATE TABLE IF NOT EXISTS maintenance_work_order_closure (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  work_order_id UUID NOT NULL UNIQUE REFERENCES maintenance_work_orders(id) ON DELETE CASCADE,
  closed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  closed_by UUID NOT NULL REFERENCES user_profiles(id),
  pdf_generated BOOLEAN DEFAULT false,
  pdf_file_path TEXT,
  sent_to_bim BOOLEAN DEFAULT false,
  bim_sent_at TIMESTAMPTZ,
  observations TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_operations_work_order ON maintenance_work_order_operations(work_order_id);
CREATE INDEX IF NOT EXISTS idx_operations_number ON maintenance_work_order_operations(work_order_id, operation_number);
CREATE INDEX IF NOT EXISTS idx_closure_work_order ON maintenance_work_order_closure(work_order_id);

-- Enable RLS
ALTER TABLE maintenance_work_order_operations ENABLE ROW LEVEL SECURITY;
ALTER TABLE maintenance_work_order_closure ENABLE ROW LEVEL SECURITY;

-- RLS Policies for maintenance_work_order_operations

CREATE POLICY "Users can view operations from their assigned dams"
  ON maintenance_work_order_operations FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM maintenance_work_orders wo
      JOIN user_dam_assignments uda ON uda.dam_id = wo.dam_id
      WHERE wo.id = maintenance_work_order_operations.work_order_id
      AND uda.user_id = auth.uid()
    )
    OR
    EXISTS (
      SELECT 1 FROM user_profiles up
      WHERE up.id = auth.uid()
      AND up.role IN ('admin', 'superadmin')
    )
  );

CREATE POLICY "Users can insert operations for their assigned dams work orders"
  ON maintenance_work_order_operations FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM maintenance_work_orders wo
      JOIN user_dam_assignments uda ON uda.dam_id = wo.dam_id
      WHERE wo.id = maintenance_work_order_operations.work_order_id
      AND uda.user_id = auth.uid()
      AND wo.is_closed = false
    )
    OR
    EXISTS (
      SELECT 1 FROM user_profiles up
      WHERE up.id = auth.uid()
      AND up.role IN ('admin', 'superadmin')
    )
  );

CREATE POLICY "Users can update operations if work order is not closed"
  ON maintenance_work_order_operations FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM maintenance_work_orders wo
      JOIN user_dam_assignments uda ON uda.dam_id = wo.dam_id
      WHERE wo.id = maintenance_work_order_operations.work_order_id
      AND uda.user_id = auth.uid()
      AND wo.is_closed = false
    )
    OR
    EXISTS (
      SELECT 1 FROM user_profiles up
      WHERE up.id = auth.uid()
      AND up.role IN ('admin', 'superadmin')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM maintenance_work_orders wo
      WHERE wo.id = maintenance_work_order_operations.work_order_id
      AND wo.is_closed = false
    )
  );

CREATE POLICY "Users can delete operations if work order is not closed"
  ON maintenance_work_order_operations FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM maintenance_work_orders wo
      JOIN user_dam_assignments uda ON uda.dam_id = wo.dam_id
      WHERE wo.id = maintenance_work_order_operations.work_order_id
      AND uda.user_id = auth.uid()
      AND wo.is_closed = false
    )
    OR
    EXISTS (
      SELECT 1 FROM user_profiles up
      WHERE up.id = auth.uid()
      AND up.role IN ('admin', 'superadmin')
    )
  );

-- RLS Policies for maintenance_work_order_closure

CREATE POLICY "Users can view closures from their assigned dams"
  ON maintenance_work_order_closure FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM maintenance_work_orders wo
      JOIN user_dam_assignments uda ON uda.dam_id = wo.dam_id
      WHERE wo.id = maintenance_work_order_closure.work_order_id
      AND uda.user_id = auth.uid()
    )
    OR
    EXISTS (
      SELECT 1 FROM user_profiles up
      WHERE up.id = auth.uid()
      AND up.role IN ('admin', 'superadmin')
    )
  );

CREATE POLICY "Users can create closures for their assigned dams work orders"
  ON maintenance_work_order_closure FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM maintenance_work_orders wo
      JOIN user_dam_assignments uda ON uda.dam_id = wo.dam_id
      WHERE wo.id = maintenance_work_order_closure.work_order_id
      AND uda.user_id = auth.uid()
      AND wo.is_closed = false
    )
    OR
    EXISTS (
      SELECT 1 FROM user_profiles up
      WHERE up.id = auth.uid()
      AND up.role IN ('admin', 'superadmin')
    )
  );

CREATE POLICY "Admins can update closures"
  ON maintenance_work_order_closure FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles up
      WHERE up.id = auth.uid()
      AND up.role IN ('admin', 'superadmin')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles up
      WHERE up.id = auth.uid()
      AND up.role IN ('admin', 'superadmin')
    )
  );

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_maintenance_operations_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update updated_at
DROP TRIGGER IF EXISTS update_maintenance_operations_timestamp ON maintenance_work_order_operations;
CREATE TRIGGER update_maintenance_operations_timestamp
  BEFORE UPDATE ON maintenance_work_order_operations
  FOR EACH ROW
  EXECUTE FUNCTION update_maintenance_operations_updated_at();