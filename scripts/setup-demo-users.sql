-- =====================================================
-- SCRIPT DE CONFIGURACIÓN DE USUARIOS DE DEMOSTRACIÓN
-- SIPRESAS - Módulo de Emergencias y Auscultación
-- =====================================================

-- IMPORTANTE: Este script debe ejecutarse DESPUÉS de crear los usuarios
-- en el panel de Supabase Authentication.

-- PASO 1: Crear usuarios en Supabase Dashboard
-- ============================================
-- 1. Ir a Supabase Dashboard > Authentication > Users
-- 2. Crear cada usuario con "Add user" > "Create new user"
-- 3. Copiar el UUID de cada usuario creado
-- 4. Reemplazar {UUID} en este script con el UUID real

-- Usuario 1: Administrador
-- Email: admin@sipresas.es
-- Password: demo123
INSERT INTO user_profiles (id, full_name, role, organization, phone, active)
VALUES
  ('{ADMIN_UUID}', 'Juan García Administrador', 'admin', 'Ministerio para la Transición Ecológica', '+34 600 000 001', true)
ON CONFLICT (id) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  organization = EXCLUDED.organization,
  phone = EXCLUDED.phone,
  active = EXCLUDED.active;

-- Usuario 2: Técnico
-- Email: tecnico@sipresas.es
-- Password: demo123
INSERT INTO user_profiles (id, full_name, role, organization, phone, active)
VALUES
  ('{TECHNICIAN_UUID}', 'María López Técnico', 'technician', 'Ministerio para la Transición Ecológica', '+34 600 000 002', true)
ON CONFLICT (id) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  organization = EXCLUDED.organization,
  phone = EXCLUDED.phone,
  active = EXCLUDED.active;

-- Usuario 3: Operador
-- Email: operador@sipresas.es
-- Password: demo123
INSERT INTO user_profiles (id, full_name, role, organization, phone, active)
VALUES
  ('{OPERATOR_UUID}', 'Carlos Martínez Operador', 'operator', 'Ministerio para la Transición Ecológica', '+34 600 000 003', true)
ON CONFLICT (id) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  organization = EXCLUDED.organization,
  phone = EXCLUDED.phone,
  active = EXCLUDED.active;

-- Usuario 4: Consulta
-- Email: consulta@sipresas.es
-- Password: demo123
INSERT INTO user_profiles (id, full_name, role, organization, phone, active)
VALUES
  ('{CONSULTATION_UUID}', 'Ana Rodríguez Consulta', 'consultation', 'Ministerio para la Transición Ecológica', '+34 600 000 004', true)
ON CONFLICT (id) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  organization = EXCLUDED.organization,
  phone = EXCLUDED.phone,
  active = EXCLUDED.active;

-- PASO 2: Asignar responsable a emergencias (opcional)
-- ====================================================
-- Esto asigna el técnico como responsable de la emergencia activa

UPDATE emergencies
SET responsible_id = '{TECHNICIAN_UUID}'
WHERE code IN ('EMG-2024-001', 'EMG-2024-003');

UPDATE emergencies
SET responsible_id = '{OPERATOR_UUID}'
WHERE code = 'EMG-2024-002';

-- VERIFICACIÓN
-- ============
-- Ejecutar para verificar que los usuarios fueron creados correctamente

SELECT
  up.full_name,
  up.role,
  up.organization,
  up.active,
  au.email,
  au.created_at
FROM user_profiles up
JOIN auth.users au ON au.id = up.id
ORDER BY up.role;

-- Deberías ver 4 usuarios:
-- 1. Juan García Administrador (admin) - admin@sipresas.es
-- 2. María López Técnico (technician) - tecnico@sipresas.es
-- 3. Carlos Martínez Operador (operator) - operador@sipresas.es
-- 4. Ana Rodríguez Consulta (consultation) - consulta@sipresas.es
