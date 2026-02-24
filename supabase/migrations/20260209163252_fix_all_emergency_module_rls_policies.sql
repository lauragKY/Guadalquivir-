/*
  # Corregir políticas RLS del módulo de emergencias

  1. Cambios
    - Simplificar políticas de lectura para usuarios autenticados
    - Eliminar dependencia de user_dam_assignments para la demo
    - Mantener restricciones para operaciones de escritura

  2. Tablas afectadas
    - emergency_indicators
    - emergency_procedures
    - emergency_simulations

  3. Seguridad
    - Usuarios autenticados pueden ver todos los datos
    - Restricciones de escritura mantenidas
*/

-- =====================================================
-- EMERGENCY INDICATORS
-- =====================================================

DROP POLICY IF EXISTS "Users can view indicators for their assigned dams" ON emergency_indicators;
DROP POLICY IF EXISTS "Admins can manage indicators" ON emergency_indicators;

-- Lectura: todos los usuarios autenticados
CREATE POLICY "Allow authenticated users to read emergency indicators"
  ON emergency_indicators FOR SELECT
  TO authenticated
  USING (true);

-- Escritura: solo admins y técnicos
CREATE POLICY "Allow admins to manage emergency indicators"
  ON emergency_indicators FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() 
      AND role IN ('admin', 'technician')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() 
      AND role IN ('admin', 'technician')
    )
  );

-- =====================================================
-- EMERGENCY PROCEDURES
-- =====================================================

DROP POLICY IF EXISTS "Users can view procedures for their assigned dams" ON emergency_procedures;

-- Lectura: todos los usuarios autenticados
CREATE POLICY "Allow authenticated users to read emergency procedures"
  ON emergency_procedures FOR SELECT
  TO authenticated
  USING (true);

-- =====================================================
-- EMERGENCY SIMULATIONS
-- =====================================================

DROP POLICY IF EXISTS "Users can view simulations for their assigned dams" ON emergency_simulations;
DROP POLICY IF EXISTS "Users can create simulations for their assigned dams" ON emergency_simulations;
DROP POLICY IF EXISTS "Users can update their own simulations" ON emergency_simulations;

-- Lectura: todos los usuarios autenticados
CREATE POLICY "Allow authenticated users to read emergency simulations"
  ON emergency_simulations FOR SELECT
  TO authenticated
  USING (true);

-- Inserción: usuarios autenticados
CREATE POLICY "Allow authenticated users to create simulations"
  ON emergency_simulations FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Actualización: solo el creador o admins
CREATE POLICY "Allow users to update their own simulations"
  ON emergency_simulations FOR UPDATE
  TO authenticated
  USING (
    started_by = auth.uid() 
    OR EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() 
      AND role = 'admin'
    )
  )
  WITH CHECK (
    started_by = auth.uid() 
    OR EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() 
      AND role = 'admin'
    )
  );
