/*
  # Agregar 'warning' al tipo operational_status
  
  1. Cambios
    - Actualizar el CHECK constraint de `operational_status` para incluir 'warning'
    - Valores permitidos: operational, maintenance, alert, emergency, warning
  
  2. Notas
    - Requerido por la interfaz TypeScript OperationalStatus
*/

-- Eliminar el constraint anterior si existe
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.constraint_column_usage
    WHERE table_name = 'dams' AND constraint_name LIKE '%operational_status%'
  ) THEN
    ALTER TABLE dams DROP CONSTRAINT IF EXISTS dams_operational_status_check;
  END IF;
END $$;

-- Agregar el nuevo constraint con 'warning' incluido
ALTER TABLE dams ADD CONSTRAINT dams_operational_status_check 
  CHECK (operational_status IN ('operational', 'maintenance', 'alert', 'emergency', 'warning'));
