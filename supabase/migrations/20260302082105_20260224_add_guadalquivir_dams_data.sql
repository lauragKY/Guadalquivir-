/*
  # Add Guadalquivir Dams Data

  1. New Data
    - Adds 6 major dams from the Guadalquivir river basin
    - Each dam includes capacity, current level, operational status
    - Coordinates are provided for map visualization

  2. Dams Added:
    - GQ-001: Iznájar (Córdoba)
    - GQ-002: Tranco de Beas (Jaén)
    - GQ-003: Guadalmellato (Córdoba)
    - GQ-004: Doña Aldonza (Jaén)
    - GQ-005: Jándula (Jaén)
    - GQ-006: Negratín (Granada)
*/

INSERT INTO dams (id, name, code, dam_type, province, municipality, river, max_capacity, current_level, current_volume, operational_status, height, coordinates, created_at)
VALUES
  (
    gen_random_uuid(),
    'Presa de Iznájar',
    'GQ-001',
    'Bóveda de gravedad',
    'Córdoba',
    'Iznájar',
    'Genil',
    983.2,
    75.5,
    742.0,
    'operational',
    112.5,
    '37.279°N 3.868°O',
    now()
  ),
  (
    gen_random_uuid(),
    'Presa del Tranco de Beas',
    'GQ-002',
    'Bóveda',
    'Jaén',
    'Hornos de Segura',
    'Guadalquivir',
    534.8,
    82.3,
    439.9,
    'operational',
    125.0,
    '38.281°N 2.756°O',
    now()
  ),
  (
    gen_random_uuid(),
    'Presa de Guadalmellato',
    'GQ-003',
    'Bóveda de gravedad',
    'Córdoba',
    'Córdoba',
    'Guadalmellato',
    235.2,
    68.9,
    161.8,
    'operational',
    56.3,
    '37.943°N 4.771°O',
    now()
  ),
  (
    gen_random_uuid(),
    'Presa de Doña Aldonza',
    'GQ-004',
    'Bóveda',
    'Jaén',
    'La Carolina',
    'Guadalquivir',
    336.5,
    71.2,
    239.4,
    'operational',
    87.5,
    '38.297°N 3.592°O',
    now()
  ),
  (
    gen_random_uuid(),
    'Presa de Jándula',
    'GQ-005',
    'Bóveda de gravedad',
    'Jaén',
    'Santa Elena',
    'Jándula',
    426.3,
    76.8,
    327.0,
    'operational',
    106.0,
    '38.252°N 3.493°O',
    now()
  ),
  (
    gen_random_uuid(),
    'Presa de Negratín',
    'GQ-006',
    'Bóveda',
    'Granada',
    'Freila',
    'Genil',
    284.7,
    69.4,
    197.3,
    'operational',
    71.0,
    '37.449°N 3.365°O',
    now()
  )
ON CONFLICT DO NOTHING;
