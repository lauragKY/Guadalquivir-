/*
  # Add Guadalquivir Basin Dams
  
  1. New Data
    - Adds 6 dams from the Guadalquivir basin with complete technical specifications
    - Includes operational data and geographic coordinates
  
  2. Dams Added
    - GQ-001: Embalse de Iznájar (Córdoba)
    - GQ-002: Embalse de Tranco de Beas (Jaén)
    - GQ-003: Embalse de Guadalmellato (Córdoba)
    - GQ-004: Embalse de Doña Aldonza (Jaén)
    - GQ-005: Embalse de Jándula (Jaén)
    - GQ-006: Embalse de Negratín (Granada)
*/

-- Insert Guadalquivir dams
INSERT INTO dams (code, name, dam_type, province, municipality, river, max_capacity, current_level, current_volume, operational_status, height, coordinates)
VALUES
  ('GQ-001', 'Embalse de Iznájar', 'Gravedad', 'Córdoba', 'Iznájar', 'Genil', 981.0, 72.5, 711.0, 'operational', 100.0, '37.258,-4.293'),
  ('GQ-002', 'Embalse de Tranco de Beas', 'Gravedad', 'Jaén', 'Hornos de Segura', 'Guadalquivir', 498.0, 68.3, 340.0, 'operational', 91.0, '38.191,-2.826'),
  ('GQ-003', 'Embalse de Guadalmellato', 'Gravedad', 'Córdoba', 'Córdoba', 'Guadalmellato', 166.0, 65.7, 109.0, 'operational', 61.0, '38.183,-4.850'),
  ('GQ-004', 'Embalse de Doña Aldonza', 'Gravedad', 'Jaén', 'Úbeda', 'Guadalimar', 76.0, 58.2, 44.0, 'operational', 55.0, '38.508,-3.550'),
  ('GQ-005', 'Embalse de Jándula', 'Gravedad', 'Jaén', 'Andújar', 'Jándula', 322.0, 76.8, 247.0, 'operational', 93.0, '38.383,-3.600'),
  ('GQ-006', 'Embalse de Negratín', 'Arco-Gravedad', 'Granada', 'Zújar', 'Guadiana Menor', 546.0, 71.2, 389.0, 'operational', 86.0, '37.666,-2.866')
ON CONFLICT (code) DO NOTHING;