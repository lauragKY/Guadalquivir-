/*
  # Corregir políticas RLS de sirenas

  1. Cambios
    - Simplificar políticas para permitir acceso a usuarios autenticados
    - Eliminar dependencia de user_dam_assignments para la demo
    - Mantener restricciones para operaciones de escritura

  2. Seguridad
    - Usuarios autenticados pueden ver todas las sirenas
    - Solo usuarios con asignaciones pueden actualizar
*/

-- Eliminar políticas existentes
DROP POLICY IF EXISTS "Users can view sirens for their assigned dams" ON warning_sirens;
DROP POLICY IF EXISTS "Users can update siren status for their assigned dams" ON warning_sirens;

-- Crear política simplificada para lectura
CREATE POLICY "Allow authenticated users to read warning sirens"
  ON warning_sirens FOR SELECT
  TO authenticated
  USING (true);

-- Crear política para actualización (requiere asignación o ser admin)
CREATE POLICY "Allow users to update sirens for their assigned dams"
  ON warning_sirens FOR UPDATE
  TO authenticated
  USING (
    dam_id IN (
      SELECT dam_id FROM user_dam_assignments WHERE user_id = auth.uid()
    )
    OR EXISTS (
      SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin'
    )
  )
  WITH CHECK (
    dam_id IN (
      SELECT dam_id FROM user_dam_assignments WHERE user_id = auth.uid()
    )
    OR EXISTS (
      SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin'
    )
  );
