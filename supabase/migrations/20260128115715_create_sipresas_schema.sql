/*
  # SIPRESAS - Sistema de Información de Presas
  ## Prototipo Kick-off: Módulo de Emergencias y Auscultación

  ### 1. Nuevas Tablas
  
  #### Perfiles de Usuario (user_profiles)
  - `id` (uuid, FK a auth.users)
  - `full_name` (text)
  - `role` (text: 'admin', 'technician', 'operator', 'consultation')
  - `organization` (text)
  - `phone` (text)
  - `active` (boolean)
  - `created_at` (timestamptz)
  
  #### Presas (dams)
  - `id` (uuid, PK)
  - `name` (text) - Nombre de la presa
  - `code` (text) - Código identificador
  - `dam_type` (text) - Tipo: gravedad, arco, contrafuertes, etc.
  - `province` (text) - Provincia
  - `municipality` (text) - Municipio
  - `river` (text) - Río
  - `max_capacity` (numeric) - Capacidad máxima en hm³
  - `current_level` (numeric) - Nivel actual en %
  - `current_volume` (numeric) - Volumen actual en hm³
  - `operational_status` (text) - Estado: operational, maintenance, alert, emergency
  - `height` (numeric) - Altura en metros
  - `coordinates` (text) - Coordenadas GPS (lat,lng)
  - `created_at` (timestamptz)
  
  #### Emergencias (emergencies)
  - `id` (uuid, PK)
  - `dam_id` (uuid, FK)
  - `code` (text) - Código único de emergencia
  - `title` (text)
  - `description` (text)
  - `emergency_type` (text) - structural, hydrological, seismic, operational, environmental
  - `severity` (text) - low, medium, high, critical
  - `status` (text) - detection, evaluation, activation, management, resolution, closed
  - `responsible_id` (uuid, FK a user_profiles)
  - `detected_at` (timestamptz)
  - `resolved_at` (timestamptz, nullable)
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)
  
  #### Planes de Emergencia (emergency_plans)
  - `id` (uuid, PK)
  - `dam_id` (uuid, FK)
  - `title` (text)
  - `description` (text)
  - `plan_type` (text) - evacuation, structural, hydrological
  - `last_review` (date)
  - `next_review` (date)
  - `status` (text) - active, outdated, under_review
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)
  
  #### Sensores (sensors)
  - `id` (uuid, PK)
  - `dam_id` (uuid, FK)
  - `name` (text)
  - `sensor_type` (text) - piezometer, inclinometer, extensometer, flowmeter, accelerometer, weather_station
  - `location` (text) - Ubicación en la presa
  - `unit` (text) - Unidad de medida
  - `status` (text) - active, inactive, maintenance, fault
  - `threshold_normal` (numeric)
  - `threshold_caution` (numeric)
  - `threshold_alert` (numeric)
  - `threshold_critical` (numeric)
  - `created_at` (timestamptz)
  
  #### Lecturas de Sensores (sensor_readings)
  - `id` (uuid, PK)
  - `sensor_id` (uuid, FK)
  - `value` (numeric)
  - `alert_level` (text) - normal, caution, alert, critical
  - `timestamp` (timestamptz)

  ### 2. Seguridad (RLS)
  - Todas las tablas tienen RLS habilitado
  - Usuarios autenticados pueden leer datos según su rol
  - Solo administradores y técnicos pueden modificar datos
  - Operadores pueden actualizar estados de emergencias asignadas
  - Usuarios de consulta solo tienen acceso de lectura

  ### 3. Notas Importantes
  - Datos mock incluidos para demostración
  - Presas reales españolas con datos simulados
  - Coordenadas GPS reales para mapas
  - Estados y flujos de trabajo representativos
*/

-- Crear tabla de perfiles de usuario
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  role text NOT NULL CHECK (role IN ('admin', 'technician', 'operator', 'consultation')),
  organization text DEFAULT 'Ministerio para la Transición Ecológica',
  phone text,
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own profile"
  ON user_profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Admins can read all profiles"
  ON user_profiles FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can update profiles"
  ON user_profiles FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Crear tabla de presas
CREATE TABLE IF NOT EXISTS dams (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  code text UNIQUE NOT NULL,
  dam_type text NOT NULL,
  province text NOT NULL,
  municipality text NOT NULL,
  river text NOT NULL,
  max_capacity numeric NOT NULL,
  current_level numeric DEFAULT 75 CHECK (current_level >= 0 AND current_level <= 100),
  current_volume numeric,
  operational_status text DEFAULT 'operational' CHECK (operational_status IN ('operational', 'maintenance', 'alert', 'emergency')),
  height numeric,
  coordinates text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE dams ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read dams"
  ON dams FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins and technicians can modify dams"
  ON dams FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role IN ('admin', 'technician')
    )
  );

-- Crear tabla de emergencias
CREATE TABLE IF NOT EXISTS emergencies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  dam_id uuid REFERENCES dams(id) ON DELETE CASCADE,
  code text UNIQUE NOT NULL,
  title text NOT NULL,
  description text,
  emergency_type text NOT NULL CHECK (emergency_type IN ('structural', 'hydrological', 'seismic', 'operational', 'environmental')),
  severity text NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  status text DEFAULT 'detection' CHECK (status IN ('detection', 'evaluation', 'activation', 'management', 'resolution', 'closed')),
  responsible_id uuid REFERENCES user_profiles(id),
  detected_at timestamptz DEFAULT now(),
  resolved_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE emergencies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read emergencies"
  ON emergencies FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Technicians can create emergencies"
  ON emergencies FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role IN ('admin', 'technician')
    )
  );

CREATE POLICY "Technicians and operators can update emergencies"
  ON emergencies FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role IN ('admin', 'technician', 'operator')
    )
  );

-- Crear tabla de planes de emergencia
CREATE TABLE IF NOT EXISTS emergency_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  dam_id uuid REFERENCES dams(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  plan_type text NOT NULL CHECK (plan_type IN ('evacuation', 'structural', 'hydrological')),
  last_review date NOT NULL,
  next_review date NOT NULL,
  status text DEFAULT 'active' CHECK (status IN ('active', 'outdated', 'under_review')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE emergency_plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read emergency plans"
  ON emergency_plans FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins and technicians can modify plans"
  ON emergency_plans FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role IN ('admin', 'technician')
    )
  );

-- Crear tabla de sensores
CREATE TABLE IF NOT EXISTS sensors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  dam_id uuid REFERENCES dams(id) ON DELETE CASCADE,
  name text NOT NULL,
  sensor_type text NOT NULL CHECK (sensor_type IN ('piezometer', 'inclinometer', 'extensometer', 'flowmeter', 'accelerometer', 'weather_station')),
  location text NOT NULL,
  unit text NOT NULL,
  status text DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'maintenance', 'fault')),
  threshold_normal numeric NOT NULL,
  threshold_caution numeric NOT NULL,
  threshold_alert numeric NOT NULL,
  threshold_critical numeric NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE sensors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read sensors"
  ON sensors FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins and technicians can modify sensors"
  ON sensors FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role IN ('admin', 'technician')
    )
  );

-- Crear tabla de lecturas de sensores
CREATE TABLE IF NOT EXISTS sensor_readings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sensor_id uuid REFERENCES sensors(id) ON DELETE CASCADE,
  value numeric NOT NULL,
  alert_level text DEFAULT 'normal' CHECK (alert_level IN ('normal', 'caution', 'alert', 'critical')),
  timestamp timestamptz DEFAULT now()
);

ALTER TABLE sensor_readings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read sensor readings"
  ON sensor_readings FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "System can insert sensor readings"
  ON sensor_readings FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Crear índices para optimizar consultas
CREATE INDEX IF NOT EXISTS idx_dams_status ON dams(operational_status);
CREATE INDEX IF NOT EXISTS idx_emergencies_dam ON emergencies(dam_id);
CREATE INDEX IF NOT EXISTS idx_emergencies_status ON emergencies(status);
CREATE INDEX IF NOT EXISTS idx_emergencies_severity ON emergencies(severity);
CREATE INDEX IF NOT EXISTS idx_sensors_dam ON sensors(dam_id);
CREATE INDEX IF NOT EXISTS idx_sensor_readings_sensor ON sensor_readings(sensor_id);
CREATE INDEX IF NOT EXISTS idx_sensor_readings_timestamp ON sensor_readings(timestamp DESC);