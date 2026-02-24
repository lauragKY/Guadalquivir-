/*
  # Agregar campo capacity_hm3 a la tabla dams
  
  1. Cambios
    - Agregar columna `capacity_hm3` (numeric) a la tabla `dams`
    - Este campo almacena la capacidad en hectómetros cúbicos (hm³)
    - Por defecto, se copia el valor de `max_capacity` si no existe
  
  2. Notas
    - Campo requerido por la interfaz Dam en TypeScript
    - Permite diferenciar entre max_capacity y capacity_hm3 si es necesario
*/

-- Agregar columna capacity_hm3 si no existe
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'dams' AND column_name = 'capacity_hm3'
  ) THEN
    ALTER TABLE dams ADD COLUMN capacity_hm3 numeric;
    
    -- Copiar valores de max_capacity a capacity_hm3
    UPDATE dams SET capacity_hm3 = max_capacity WHERE capacity_hm3 IS NULL;
    
    -- Hacer el campo NOT NULL después de copiar los datos
    ALTER TABLE dams ALTER COLUMN capacity_hm3 SET NOT NULL;
  END IF;
END $$;
