/*
  # Agregar datos de inventario para todas las presas

  1. Creación de Datos
    - Agrega activos, áreas, líneas y equipos de muestra para cada presa en el sistema
    - Incluye datos técnicos representativos de infraestructuras hidráulicas

  2. Estructura
    - Crea activos principales (diques, aliviaderos, válvulas)
    - Crea áreas operacionales (embalse, cuerpo de presa, estribo)
    - Crea líneas de funcionamiento (desagüe, abastecimiento)
    - Crea equipos específicos (compuertas, sensores, bombas)
*/

DO $$
DECLARE
  v_dam RECORD;
  v_activos_cat_id uuid;
  v_areas_cat_id uuid;
  v_lineas_cat_id uuid;
  v_equipos_cat_id uuid;
  v_activo_id uuid;
  v_area_id uuid;
  v_linea_id uuid;
BEGIN
  -- Get category IDs
  SELECT id INTO v_activos_cat_id FROM inventory_asset_categories WHERE code = 'ACTIVOS';
  SELECT id INTO v_areas_cat_id FROM inventory_asset_categories WHERE code = 'AREAS';
  SELECT id INTO v_lineas_cat_id FROM inventory_asset_categories WHERE code = 'LINEAS';
  SELECT id INTO v_equipos_cat_id FROM inventory_asset_categories WHERE code = 'EQUIPOS';

  -- Loop through all dams that don't have inventory data yet
  FOR v_dam IN 
    SELECT id, code, name 
    FROM dams 
    WHERE id NOT IN (SELECT DISTINCT dam_id FROM inventory_assets)
  LOOP
    -- Create ACTIVO: Dique Principal
    INSERT INTO inventory_assets (
      id, dam_id, category_id, code, name, full_code, description,
      status, sort_order
    ) VALUES (
      gen_random_uuid(), v_dam.id, v_activos_cat_id, 
      'ACT-01', 'Dique Principal', v_dam.code || '-ACT-01',
      'Estructura principal de contención del embalse',
      'active', 1
    ) RETURNING id INTO v_activo_id;

    -- Create ACTIVO: Aliviadero
    INSERT INTO inventory_assets (
      dam_id, category_id, code, name, full_code, description,
      status, sort_order
    ) VALUES (
      v_dam.id, v_activos_cat_id, 
      'ACT-02', 'Aliviadero', v_dam.code || '-ACT-02',
      'Sistema de evacuación de excedentes hídricos',
      'active', 2
    );

    -- Create AREA: Embalse
    INSERT INTO inventory_assets (
      id, dam_id, category_id, parent_asset_id, code, name, full_code, description,
      status, sort_order
    ) VALUES (
      gen_random_uuid(), v_dam.id, v_areas_cat_id, v_activo_id,
      'A-01', 'Embalse', v_dam.code || '-A-01',
      'Zona de almacenamiento de agua',
      'active', 1
    ) RETURNING id INTO v_area_id;

    -- Create AREA: Cuerpo de Presa
    INSERT INTO inventory_assets (
      dam_id, category_id, parent_asset_id, code, name, full_code, description,
      status, sort_order
    ) VALUES (
      v_dam.id, v_areas_cat_id, v_activo_id,
      'A-02', 'Cuerpo de Presa', v_dam.code || '-A-02',
      'Estructura de contención principal',
      'active', 2
    );

    -- Create LINEA: Desagüe de Fondo
    INSERT INTO inventory_assets (
      id, dam_id, category_id, parent_asset_id, code, name, full_code, description,
      status, sort_order
    ) VALUES (
      gen_random_uuid(), v_dam.id, v_lineas_cat_id, v_activo_id,
      'L-01', 'Desagüe de Fondo', v_dam.code || '-L-01',
      'Conducto para evacuación controlada',
      'active', 1
    ) RETURNING id INTO v_linea_id;

    -- Create LINEA: Toma de Abastecimiento
    INSERT INTO inventory_assets (
      dam_id, category_id, parent_asset_id, code, name, full_code, description,
      status, sort_order
    ) VALUES (
      v_dam.id, v_lineas_cat_id, v_activo_id,
      'L-02', 'Toma de Abastecimiento', v_dam.code || '-L-02',
      'Sistema de captación de agua',
      'active', 2
    );

    -- Create EQUIPO: Compuerta Principal
    INSERT INTO inventory_assets (
      dam_id, category_id, parent_asset_id, code, name, full_code, description,
      manufacturer, model, status, sort_order
    ) VALUES (
      v_dam.id, v_equipos_cat_id, v_linea_id,
      'E-01', 'Compuerta Principal', v_dam.code || '-E-01',
      'Compuerta de control de caudal',
      'INDAR', 'CP-2000', 'active', 1
    );

    -- Create EQUIPO: Válvula Mariposa
    INSERT INTO inventory_assets (
      dam_id, category_id, parent_asset_id, code, name, full_code, description,
      manufacturer, model, status, sort_order
    ) VALUES (
      v_dam.id, v_equipos_cat_id, v_linea_id,
      'E-02', 'Válvula Mariposa DN1000', v_dam.code || '-E-02',
      'Válvula de regulación de caudal',
      'AVK', 'VM-1000', 'active', 2
    );
  END LOOP;
END $$;
