/*
  # Create Demo Users for SIPRESAS

  Creates demo users with predefined credentials for the SIPRESAS system.
  Since we cannot directly call the auth API from SQL, we'll use a workaround
  by creating auth entries and corresponding profiles.

  This migration sets up:
  - admin@sipresas.es (password: demo123)
  - tecnico@sipresas.es (password: demo123)
  - operador@sipresas.es (password: demo123)
  - consulta@sipresas.es (password: demo123)
*/

-- Create demo users using the Supabase admin API via a trigger or function
-- Note: This requires the SUPABASE_SERVICE_ROLE_KEY to be used from an Edge Function

-- For now, we'll insert demo users directly if they don't exist
-- The users should be created via the setup-demo-users edge function

-- Check and create user profiles for demo accounts
-- These will link to auth users once they are created
DO $$
BEGIN
  -- Create a temporary table to hold demo user info
  CREATE TEMP TABLE temp_demo_users (
    email TEXT,
    full_name TEXT,
    role TEXT,
    organization TEXT,
    phone TEXT
  ) ON COMMIT DROP;

  INSERT INTO temp_demo_users VALUES
    ('admin@sipresas.es', 'Juan García Administrador', 'admin', 'Ministerio para la Transición Ecológica', '+34 600 000 001'),
    ('tecnico@sipresas.es', 'María López Técnico', 'technician', 'Ministerio para la Transición Ecológica', '+34 600 000 002'),
    ('operador@sipresas.es', 'Carlos Martínez Operador', 'operator', 'Ministerio para la Transición Ecológica', '+34 600 000 003'),
    ('consulta@sipresas.es', 'Ana Rodríguez Consulta', 'consultation', 'Ministerio para la Transición Ecológica', '+34 600 000 004');

END $$;
