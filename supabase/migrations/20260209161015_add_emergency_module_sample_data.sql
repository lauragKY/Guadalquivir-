/*
  # Agregar datos de ejemplo para el módulo de Gestión de Emergencias

  1. Datos creados
    - Indicadores de emergencia para presas (cuantitativos y cualitativos)
    - Sirenas de aviso a la población
    - Procedimientos de actuación por escenario
    - Simulacros históricos de ejemplo
    
  2. Estructura
    - emergency_indicators: Umbrales para detectar escenarios automáticamente
    - warning_sirens: Equipos de aviso con ubicación y estado
    - emergency_procedures: Procedimientos de inspección y ejecución
    - emergency_simulations: Historial de entrenamientos y simulacros
*/

DO $$
DECLARE
  v_dam_alarcon uuid;
  v_dam_ricobayo uuid;
  v_user_admin uuid;
BEGIN
  -- Get dam IDs
  SELECT id INTO v_dam_alarcon FROM dams WHERE code = 'AL-001';
  SELECT id INTO v_dam_ricobayo FROM dams WHERE code = 'ZA-007';
  
  -- Get a user for simulations
  SELECT id INTO v_user_admin FROM user_profiles LIMIT 1;

  -- Insert Emergency Indicators for Alarcón dam
  INSERT INTO emergency_indicators (dam_id, indicator_type, variable_name, scenario_threshold, threshold_value, threshold_formula, description) VALUES
  (v_dam_alarcon, 'quantitative', 'Nivel de embalse', 'scenario_0', 290.0, NULL, 'Nivel de embalse que activa Escenario 0'),
  (v_dam_alarcon, 'quantitative', 'Nivel de embalse', 'scenario_1', 295.0, NULL, 'Nivel de embalse que activa Escenario 1'),
  (v_dam_alarcon, 'quantitative', 'Aportación última hora', 'scenario_0', 100.0, NULL, 'Aportación en m³/s que activa Escenario 0'),
  (v_dam_alarcon, 'quantitative', 'Precipitación 24h', 'scenario_0', 50.0, NULL, 'Precipitación acumulada 24h que activa Escenario 0'),
  (v_dam_alarcon, 'qualitative', 'Movimientos anómalos', 'scenario_0', NULL, NULL, 'Detección visual de movimientos en la estructura'),
  (v_dam_alarcon, 'qualitative', 'Filtraciones anómalas', 'scenario_1', NULL, NULL, 'Aumento significativo de filtraciones');

  -- Insert Emergency Indicators for Ricobayo dam
  INSERT INTO emergency_indicators (dam_id, indicator_type, variable_name, scenario_threshold, threshold_value, threshold_formula, description) VALUES
  (v_dam_ricobayo, 'quantitative', 'Nivel de embalse', 'scenario_0', 675.0, NULL, 'Nivel de embalse que activa Escenario 0'),
  (v_dam_ricobayo, 'quantitative', 'Aportación última hora', 'scenario_0', 150.0, NULL, 'Aportación en m³/s que activa Escenario 0'),
  (v_dam_ricobayo, 'quantitative', 'Magnitud sísmica', 'scenario_1', 4.5, NULL, 'Magnitud de sismo que activa Escenario 1');

  -- Insert Warning Sirens for Alarcón
  INSERT INTO warning_sirens (dam_id, siren_code, location_name, latitude, longitude, operational_status, last_check_at, installation_date) VALUES
  (v_dam_alarcon, 'SIR-AL-001', 'Alarcón - Núcleo urbano', 39.5564, -1.8897, 'operational', NOW() - INTERVAL '2 days', '2023-06-15'),
  (v_dam_alarcon, 'SIR-AL-002', 'Villalba de la Sierra', 39.5234, -1.9123, 'operational', NOW() - INTERVAL '2 days', '2023-06-15'),
  (v_dam_alarcon, 'SIR-AL-003', 'Puente Vadillos', 39.5789, -1.8456, 'degraded', NOW() - INTERVAL '5 days', '2023-06-15'),
  (v_dam_alarcon, 'SIR-AL-004', 'Camping El Molino', 39.5423, -1.9034, 'operational', NOW() - INTERVAL '2 days', '2023-06-15');

  -- Insert Warning Sirens for Ricobayo
  INSERT INTO warning_sirens (dam_id, siren_code, location_name, latitude, longitude, operational_status, last_check_at, installation_date) VALUES
  (v_dam_ricobayo, 'SIR-ZA-001', 'Ricobayo - Presa', 41.5234, -5.9876, 'operational', NOW() - INTERVAL '1 day', '2023-08-20'),
  (v_dam_ricobayo, 'SIR-ZA-002', 'Muelas del Pan', 41.5456, -5.9654, 'operational', NOW() - INTERVAL '1 day', '2023-08-20'),
  (v_dam_ricobayo, 'SIR-ZA-003', 'Fariza', 41.5789, -6.0123, 'operational', NOW() - INTERVAL '1 day', '2023-08-20');

  -- Insert Emergency Procedures for Escenario 0 - Hydrological causes
  INSERT INTO emergency_procedures (dam_id, scenario_type, cause, procedure_type, title, description, procedure_order, checklist_items) VALUES
  (v_dam_alarcon, 'scenario_0', 'hydrological', 'inspection', 'Inspección visual de paramentos', 'Realizar inspección detallada de paramentos aguas arriba y aguas abajo', 1, 
   '[{"item": "Inspeccionar paramento aguas arriba", "completed": false}, {"item": "Inspeccionar paramento aguas abajo", "completed": false}, {"item": "Documentar hallazgos con fotografías", "completed": false}]'::jsonb),
  (v_dam_alarcon, 'scenario_0', 'hydrological', 'inspection', 'Verificar órganos de desagüe', 'Comprobar operatividad de compuertas y desagües', 2,
   '[{"item": "Verificar aliviadero", "completed": false}, {"item": "Verificar desagües de fondo", "completed": false}, {"item": "Comprobar mecanismos de accionamiento", "completed": false}]'::jsonb),
  (v_dam_alarcon, 'scenario_0', 'hydrological', 'execution', 'Intensificar lecturas de auscultación', 'Aumentar frecuencia de lecturas de instrumentación', 3,
   '[{"item": "Leer piezómetros cada 6 horas", "completed": false}, {"item": "Leer péndulos cada 12 horas", "completed": false}, {"item": "Registrar todas las lecturas", "completed": false}]'::jsonb),
  (v_dam_alarcon, 'scenario_0', 'hydrological', 'execution', 'Activar Plan de Comunicaciones', 'Notificar a autoridades y equipo de gestión', 4,
   '[{"item": "Notificar a Director del Plan", "completed": false}, {"item": "Informar a Protección Civil", "completed": false}, {"item": "Contactar con Confederación", "completed": false}]'::jsonb);

  -- Insert Emergency Procedures for Escenario 1 - Structural causes
  INSERT INTO emergency_procedures (dam_id, scenario_type, cause, procedure_type, title, description, procedure_order, checklist_items) VALUES
  (v_dam_alarcon, 'scenario_1', 'structural', 'inspection', 'Inspección estructural detallada', 'Evaluar integridad estructural de elementos críticos', 1,
   '[{"item": "Inspeccionar fisuras existentes", "completed": false}, {"item": "Buscar nuevas fisuras o grietas", "completed": false}, {"item": "Evaluar filtraciones", "completed": false}]'::jsonb),
  (v_dam_alarcon, 'scenario_1', 'structural', 'execution', 'Preparar equipos de emergencia', 'Alistar maquinaria y materiales para intervención', 2,
   '[{"item": "Verificar disponibilidad de materiales", "completed": false}, {"item": "Movilizar equipos de reparación", "completed": false}, {"item": "Establecer punto de mando", "completed": false}]'::jsonb),
  (v_dam_alarcon, 'scenario_1', 'structural', 'execution', 'Iniciar desembalse controlado', 'Reducir nivel de embalse de forma controlada', 3,
   '[{"item": "Calcular caudal de desembalse", "completed": false}, {"item": "Avisar a afectados aguas abajo", "completed": false}, {"item": "Iniciar operación de desagüe", "completed": false}]'::jsonb);

  -- Insert Emergency Simulations
  IF v_user_admin IS NOT NULL THEN
    INSERT INTO emergency_simulations (dam_id, simulation_type, scenario_type, cause, started_by, started_at, completed_at, participants, evaluation_notes) VALUES
    (v_dam_alarcon, 'training', 'scenario_0', 'Avenida extraordinaria', v_user_admin, NOW() - INTERVAL '30 days', NOW() - INTERVAL '30 days' + INTERVAL '3 hours',
     '["Juan García", "María López", "Carlos Ruiz"]'::jsonb, 'El equipo respondió adecuadamente. Se identificó necesidad de mejorar protocolo de comunicaciones.'),
    (v_dam_alarcon, 'drill', 'scenario_1', 'Movimientos estructurales', v_user_admin, NOW() - INTERVAL '90 days', NOW() - INTERVAL '90 days' + INTERVAL '5 hours',
     '["Juan García", "María López", "Pedro Sánchez", "Ana Martínez"]'::jsonb, 'Simulacro reglado completado con éxito. Todas las comunicaciones fueron enviadas correctamente.'),
    (v_dam_ricobayo, 'training', 'scenario_0', 'Precipitaciones intensas', v_user_admin, NOW() - INTERVAL '45 days', NOW() - INTERVAL '45 days' + INTERVAL '2 hours',
     '["Luis Fernández", "Carmen Díaz"]'::jsonb, 'Entrenamiento satisfactorio. Se requiere actualizar lista de contactos.');
  END IF;

END $$;
