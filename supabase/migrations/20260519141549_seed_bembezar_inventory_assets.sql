/*
  # Seed inventory assets for Presa de Bembézar (GQ-009)

  ## Summary
  Adds a comprehensive set of inventory assets for the Bembézar dam to support
  the client demo. Covers the main asset (the dam itself) and key sub-assets
  across structures, mechanical organs, electrical equipment and instrumentation.

  ## New data
  - 1 root ACTIVOS asset (the dam)
  - 3 main AREAS assets (Presa, Instalaciones, Galería)
  - 8 EQUIPOS assets (compuertas, válvulas, grupo electrógeno, cuadro eléctrico, etc.)
  - 4 LINEAS assets (piezómetros, caudalímetros, limnígrafo, inclinómetro)

  ## Security
  - Inherits existing RLS policies for inventory_assets
*/

DO $$
DECLARE
  v_dam_id uuid := '0bbf880c-2745-40e7-828b-a798fd9636f3';
  v_cat_activos  uuid := '1b7f2663-0869-4e69-9f76-6414974a3719';
  v_cat_areas    uuid := '34995900-3545-41bc-9c76-32e8fb8668ff';
  v_cat_equipos  uuid := 'cb023674-f18a-4954-a592-e3db11c30f93';
  v_cat_lineas   uuid := '1ce645e6-509d-4a7f-a31c-b8a7741a1932';

  v_root_id      uuid;
  v_area_presa   uuid;
  v_area_inst    uuid;
  v_area_galeria uuid;
BEGIN
  -- ── Root asset (dam)
  INSERT INTO inventory_assets (
    id, dam_id, category_id, parent_asset_id, code, name, full_code,
    description, extended_description, status,
    owner, operator, designer, construction_manager,
    construction_end_date, commissioning_date,
    risk_category, usage_type,
    exploitation_norms_approval, emergency_plan_approval, emergency_plan_homologation,
    dam_type, height_above_riverbed, height_from_foundation,
    crest_length, crest_elevation,
    capacity_nmn, surface_nmn, avg_precipitation, avg_inflow,
    design_flood, extreme_flood,
    sort_order, is_visible
  ) VALUES (
    gen_random_uuid(), v_dam_id, v_cat_activos, NULL,
    'GQ-009', 'Presa de Bembézar', 'GQ-009',
    'Presa de arco de hormigón sobre el río Bembézar (cuenca del Guadalquivir). Provincia de Córdoba.',
    'Presa de arco de hormigón construida entre 1958 y 1961. Altura sobre cauce 84 m, longitud de coronación 266 m. Cota de coronación 385,00 m.s.n.m. Capacidad total 235 hm³. Embalse El Bembézar. Uso principal: abastecimiento y riego.',
    'operational',
    'Confederación Hidrográfica del Guadalquivir', 'Confederación Hidrográfica del Guadalquivir',
    'IBER', 'DRAGADOS S.A.',
    '1961-06-15', '1961-09-01',
    'A', 'Abastecimiento y riego',
    'Norma de Explotación aprobada por resolución de la CHG de 24/09/2024',
    'PEP aprobado por resolución del MITECO de 15/04/2026',
    'PEP homologado por la Junta de Andalucía · Consejería de Presidencia',
    'Arco', 84, 90, 266, 385.00,
    235, 1850, 612, 48,
    650, 820,
    1, true
  ) RETURNING id INTO v_root_id;

  -- ── Areas
  INSERT INTO inventory_assets (id, dam_id, category_id, parent_asset_id, code, name, full_code, description, status, sort_order, is_visible)
  VALUES (gen_random_uuid(), v_dam_id, v_cat_areas, v_root_id, 'GQ-009-PRE', 'Presa y aliviadero', 'GQ-009-PRE', 'Cuerpo de presa, coronación, aliviadero de compuertas y desagüe de fondo.', 'operational', 1, true)
  RETURNING id INTO v_area_presa;

  INSERT INTO inventory_assets (id, dam_id, category_id, parent_asset_id, code, name, full_code, description, status, sort_order, is_visible)
  VALUES (gen_random_uuid(), v_dam_id, v_cat_areas, v_root_id, 'GQ-009-INST', 'Instalaciones eléctricas y mecánicas', 'GQ-009-INST', 'Grupos electrógenos, cuadros eléctricos, centro de transformación y sistemas de control.', 'warning', 2, true)
  RETURNING id INTO v_area_inst;

  INSERT INTO inventory_assets (id, dam_id, category_id, parent_asset_id, code, name, full_code, description, status, sort_order, is_visible)
  VALUES (gen_random_uuid(), v_dam_id, v_cat_areas, v_root_id, 'GQ-009-GAL', 'Galería e instrumentación', 'GQ-009-GAL', 'Galería de inspección y red de instrumentación de auscultación.', 'operational', 3, true)
  RETURNING id INTO v_area_galeria;

  -- ── Equipos (sub-assets of presa)
  INSERT INTO inventory_assets (id, dam_id, category_id, parent_asset_id, code, name, full_code, description, extended_description, status, manufacturer, model, serial_number, installation_date, location, sort_order, is_visible)
  VALUES
  (gen_random_uuid(), v_dam_id, v_cat_equipos, v_area_presa, 'ORG-CMP-001', 'Compuerta nº1 (Aliviadero)', 'GQ-009-PRE-CMP-001',
    'Compuerta Taintor 10×6m. Vano 1 del aliviadero de compuertas.', 'Compuerta Taintor fabricada por HIDROSTANK S.A. Accionamiento electrohidráulico. Cota umbral 382,00 m.s.n.m. Capacidad máxima 150 m³/s por vano. Revisión semestral programada.',
    'operational', 'HIDROSTANK S.A.', 'TN-1000', 'HS-2003-0421', '2003-04-10', 'Aliviadero · Vano 1', 1, true),

  (gen_random_uuid(), v_dam_id, v_cat_equipos, v_area_presa, 'ORG-CMP-002', 'Compuerta nº2 (Aliviadero)', 'GQ-009-PRE-CMP-002',
    'Compuerta Taintor 10×6m. Vano 2 del aliviadero de compuertas.', 'Compuerta Taintor fabricada por HIDROSTANK S.A. Revisión semestral vencida · OT-2026-018 pendiente.',
    'warning', 'HIDROSTANK S.A.', 'TN-1000', 'HS-2003-0422', '2003-04-10', 'Aliviadero · Vano 2', 2, true),

  (gen_random_uuid(), v_dam_id, v_cat_equipos, v_area_presa, 'ORG-DES-001', 'Desagüe de fondo', 'GQ-009-PRE-DES-001',
    'Válvula de guarda DN-900 y válvula de regulación. Cota galería 340 m.s.n.m.', 'Válvulas de acero inoxidable. Fabricante REXROTH. Última revisión 10/02/2026. OT-2026-019 en curso.',
    'warning', 'REXROTH', 'DN-900 VG', 'RX-1999-0087', '1999-01-01', 'Galería desagüe · Cota 340m', 3, true),

  (gen_random_uuid(), v_dam_id, v_cat_equipos, v_area_inst, 'MEC-GE-001', 'Grupo electrógeno principal', 'GQ-009-INST-GE-001',
    'Grupo electrógeno 150kVA para alimentación de emergencia de equipos críticos.', 'Grupo electrógeno SDMO INDUSTRIES modelo J150K. Instalado en sala maquinaria cota 345m. AVERÍA CRÍTICA: fallo sistema arranque automático detectado 18/05/2026.',
    'critical', 'SDMO INDUSTRIES', 'J150K', 'SD-2015-2234', '2015-03-20', 'Sala maquinaria · Cota 345m', 1, true),

  (gen_random_uuid(), v_dam_id, v_cat_equipos, v_area_inst, 'MEC-CE-001', 'Cuadro eléctrico general', 'GQ-009-INST-CE-001',
    'Cuadro de mando y protección principal. Alimentación y control de todos los equipos.', 'Cuadro eléctrico SCHNEIDER ELECTRIC modelo MV400. Instalado en sala eléctrica coronación. Fallo módulo diferencial 18/05/2026. OT urgente 2026-024.',
    'critical', 'SCHNEIDER ELECTRIC', 'MV400', 'SE-2010-1122', '2010-06-12', 'Sala eléctrica · Coronación', 2, true),

  (gen_random_uuid(), v_dam_id, v_cat_equipos, v_area_inst, 'MEC-CT-001', 'Centro de transformación', 'GQ-009-INST-CT-001',
    'Centro de transformación MT/BT 400kVA. Alimentación de todos los equipos de la presa.', 'Transformador ABB modelo T400. Revisión anual completada 15/04/2026. Estado operativo.',
    'operational', 'ABB', 'T400', 'AB-2008-0991', '2008-07-01', 'Exterior coronación lado izquierdo', 3, true);

  -- ── Líneas (instrumentación)
  INSERT INTO inventory_assets (id, dam_id, category_id, parent_asset_id, code, name, full_code, description, extended_description, status, manufacturer, model, serial_number, installation_date, location, sort_order, is_visible)
  VALUES
  (gen_random_uuid(), v_dam_id, v_cat_lineas, v_area_galeria, 'AUS-PIE-014', 'Piezómetro P-14', 'GQ-009-GAL-PIE-014',
    'Piezómetro de tubo abierto. Mide presión intersticial zona central presa. Umbral S.E. superado.', 'SISGEO OA-P-102. Instalado en bloque 7, cota 565m. Valor actual 2,18 kg/cm² > umbral S.E. 2,00 kg/cm².',
    'warning', 'SISGEO', 'OA-P-102', 'SG-2002-0314', '2002-01-01', 'Cuerpo presa · Cota 365m · Bloque 7', 1, true),

  (gen_random_uuid(), v_dam_id, v_cat_lineas, v_area_galeria, 'AUS-FIL-001', 'Caudalímetro de filtraciones', 'GQ-009-GAL-FIL-001',
    'Caudalímetro electromagnético. Mide filtración total pie de presa. Situación Extraordinaria activa.', 'ENDRESS+HAUSER Promag 10. Valor actual 212,7 l/s > umbral S.E. 169,1 l/s. Auscultación intensificada.',
    'warning', 'ENDRESS+HAUSER', 'Promag 10', 'EH-2008-0512', '2008-05-01', 'Pie de presa · Aguas abajo · Cota 337m', 2, true),

  (gen_random_uuid(), v_dam_id, v_cat_lineas, v_area_galeria, 'AUS-NE-SAIH', 'Limnígrafo SAIH', 'GQ-009-GAL-NE-001',
    'Limnígrafo conectado a la red SAIH-Guadalquivir. Variable dependiente para cálculo de umbrales.', 'VEGA Vegapuls 62. Transmisión continua a SAIH cada 5 minutos. NE actual 383,6 m.s.n.m.',
    'operational', 'VEGA', 'Vegapuls 62', 'VG-2010-0178', '2010-03-15', 'Coronación · Galería SAIH', 3, true),

  (gen_random_uuid(), v_dam_id, v_cat_lineas, v_area_galeria, 'AUS-INC-002', 'Inclinómetro INC-002', 'GQ-009-GAL-INC-002',
    'Inclinómetro de deformación horizontal. Mide desplazamientos en bloque central.', 'GEOKON 6000 Series. Valor actual 2,8 mm. Umbral S.E. 5,0 mm. Estado normal.',
    'operational', 'GEOKON', '6000 Series', 'GK-2005-0234', '2005-06-01', 'Galería · Bloque central', 4, true);

END $$;
