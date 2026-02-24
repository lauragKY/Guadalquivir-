# MÓDULO BIM - Especificación Técnica Completa
## SIPRESAS - Sistema Integral de Presas

---

## 📋 Índice

1. [Visión General](#visión-general)
2. [Contexto y Justificación](#contexto-y-justificación)
3. [Arquitectura del Módulo](#arquitectura-del-módulo)
4. [Gestión de Archivos y Datos](#gestión-de-archivos-y-datos)
5. [Elementos del Gemelo Digital](#elementos-del-gemelo-digital)
6. [Integraciones con Módulos Existentes](#integraciones-con-módulos-existentes)
7. [Funcionalidades del Visor BIM](#funcionalidades-del-visor-bim)
8. [Consideraciones Técnicas](#consideraciones-técnicas)
9. [Roadmap y Cronograma](#roadmap-y-cronograma)
10. [Preparación para Backlog](#preparación-para-backlog)

---

# VISIÓN GENERAL

## 🎯 Objetivo del Módulo

El **Módulo BIM** (Building Information Modeling) extiende las capacidades de SIPRESAS incorporando visualización 3D interactiva de presas mediante **gemelos digitales**, permitiendo a los usuarios:

- **Visualizar** elementos críticos de infraestructura en entorno 3D
- **Acceder** a información técnica contextualizada geométricamente
- **Integrar** datos operacionales en tiempo real con modelo 3D
- **Navegar** intuitivamente por instalaciones complejas
- **Gestionar** documentación técnica vinculada a elementos físicos

## 🌟 Valor Añadido

El módulo BIM transforma SIPRESAS de un sistema de gestión de información tradicional a una plataforma de **gemelo digital inteligente**, donde:

- La información no solo se almacena, sino que se **visualiza en su contexto espacial**
- Los estados operacionales se **representan visualmente** en tiempo real
- La navegación por documentación técnica es **geométrica e intuitiva**
- Las inspecciones y mantenimientos se **contextualizan en el modelo 3D**

---

# CONTEXTO Y JUSTIFICACIÓN

## 📊 Situación Actual

### Proyectos de Digitalización en Curso

La Confederación Hidrográfica del Guadalquivir (CHG) tiene en marcha:

1. **Créditos de Digitalización** para presente y próximo año
2. **Trabajos de escaneo láser** de presas (nubes de puntos)
3. **Generación de modelos BIM** próximos a iniciarse
4. **Levantamientos geométricos** de infraestructuras críticas

### Tecnologías de Captura

Los trabajos incluyen:

- **Escaneo láser 3D**: Generación de nubes de puntos de alta densidad
- **Fotogrametría**: Modelos 3D texturizados
- **Levantamientos topográficos**: Datos georreferenciados
- **Modelado BIM**: Construcción de gemelos digitales con información técnica

### Archivos Generados

Los proyectos producen archivos de gran tamaño:

- **Nubes de puntos** (.las, .laz, .e57): 500 MB - 10 GB por presa
- **Modelos BIM** (.ifc, .rvt): 100 MB - 2 GB
- **Modelos 3D simplificados** (.obj, .fbx, .gltf): 10 MB - 500 MB
- **Ortoimágenes** (.tif, .jpg): 50 MB - 500 MB

## 💡 Oportunidad Estratégica

La inversión en digitalización BIM permite:

1. **Capitalizar inversión**: Los modelos BIM no quedan como entregables estáticos
2. **Democratizar acceso**: Usuarios de SIPRESAS acceden a gemelos digitales sin software especializado
3. **Integrar información**: Vincular datos operacionales (SIPRESAS) con geometría (BIM)
4. **Modernizar operaciones**: Pasar de planos 2D a navegación 3D inmersiva
5. **Preparar futuro**: Base para AR/VR, drones, sensores IoT integrados

## 🎯 Alcance del Módulo

### Fase 1: Visor BIM Integrado (Presente Año)
- Integración en menú de SIPRESAS
- Visor 3D web (WebGL)
- Carga de modelos simplificados
- Visualización de elementos del inventario
- Vinculación básica con fichas de equipos

### Fase 2: Integración Completa (Próximo Año)
- Integración con módulo Mantenimiento (PDFs de inspecciones)
- Estados en tiempo real desde Explotación y Auscultación
- Gráficos históricos embebidos
- Navegación por capas (LOD: Level of Detail)
- Filtros avanzados y búsqueda espacial

### Fase 3: Funcionalidades Avanzadas (Futuro)
- Realidad Aumentada (AR) para inspecciones de campo
- Simulaciones de avenidas y escenarios de emergencia
- Integración con drones para modelos actualizados
- Análisis espaciales avanzados

---

# ARQUITECTURA DEL MÓDULO

## 🏗️ Componentes Principales

```
┌─────────────────────────────────────────────────────────────┐
│                    MÓDULO BIM - SIPRESAS                    │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────────┐      ┌──────────────────┐           │
│  │   VISOR 3D WEB   │◄────►│  GESTOR MODELOS  │           │
│  │   (Three.js/     │      │   BIM/IFC        │           │
│  │    Babylon.js)   │      └──────────────────┘           │
│  └──────────────────┘               │                      │
│           │                         │                      │
│           ▼                         ▼                      │
│  ┌──────────────────┐      ┌──────────────────┐           │
│  │  PANEL DE INFO   │      │ ARCHIVO TÉCNICO  │           │
│  │  CONTEXTUAL      │      │  (Storage BIM)   │           │
│  └──────────────────┘      └──────────────────┘           │
│           │                         │                      │
│           └─────────┬───────────────┘                      │
│                     ▼                                      │
│         ┌──────────────────────────┐                      │
│         │  INTEGRACIÓN MÓDULOS     │                      │
│         │  - Inventario            │                      │
│         │  - Mantenimiento         │                      │
│         │  - Explotación           │                      │
│         │  - Auscultación          │                      │
│         └──────────────────────────┘                      │
│                     │                                      │
│                     ▼                                      │
│         ┌──────────────────────────┐                      │
│         │   SUPABASE DATABASE      │                      │
│         │   - Metadatos BIM        │                      │
│         │   - Elementos 3D         │                      │
│         │   - Vínculos módulos     │                      │
│         └──────────────────────────┘                      │
└─────────────────────────────────────────────────────────────┘
```

## 🔧 Stack Tecnológico Propuesto

### Frontend - Visor 3D

**Opción A: Three.js + IFC.js** (Recomendada)
- **Three.js**: Librería 3D WebGL estándar, flexible y potente
- **IFC.js**: Parser de archivos IFC (formato estándar BIM) en navegador
- **Ventajas**: Open source, gran comunidad, IFC nativo
- **Desventajas**: Requiere desarrollo custom de controles

**Opción B: Babylon.js + Extensiones BIM**
- **Babylon.js**: Motor 3D completo con herramientas integradas
- **Ventajas**: Funcionalidades built-in, mejor performance en modelos complejos
- **Desventajas**: Curva de aprendizaje mayor

**Opción C: Xeokit SDK** (Especializado BIM)
- **Xeokit**: SDK específico para visualización BIM en web
- **Ventajas**: Optimizado para arquitectura, herramientas BIM específicas
- **Desventajas**: Licencia comercial para funcionalidades avanzadas

**Recomendación**: **Three.js + IFC.js** para máxima flexibilidad y control, con posibilidad de migrar a Xeokit si se requieren funcionalidades BIM avanzadas.

### Backend - Procesamiento de Modelos

**Conversión y Optimización**:
- **Blender + Python scripts**: Simplificación de mallas, reducción polígonos
- **FME (Feature Manipulation Engine)**: Conversión entre formatos (IFC, Revit, OBJ)
- **Cloud Convert API**: Procesamiento en cloud para modelos pesados

**Storage**:
- **Supabase Storage**: Archivos BIM originales y optimizados
- **CDN (CloudFlare)**: Distribución de modelos 3D para carga rápida
- **PostgreSQL + PostGIS**: Metadatos, coordenadas georreferenciadas

## 📐 Niveles de Detalle (LOD)

El módulo soporta múltiples niveles de detalle según necesidad:

### LOD 100 - Conceptual
- **Uso**: Vista general de presa completa
- **Geometría**: Bloques simples, sin detalles
- **Tamaño**: < 10 MB
- **Casos**: Navegación inicial, contexto general

### LOD 200 - Aproximado
- **Uso**: Vista de sectores (cuerpo presa, galerías, órganos)
- **Geometría**: Formas básicas con dimensiones aproximadas
- **Tamaño**: 10-50 MB
- **Casos**: Selección de zona, planificación

### LOD 300 - Preciso
- **Uso**: Vista de equipos individuales
- **Geometría**: Representación precisa, detalles constructivos
- **Tamaño**: 50-200 MB
- **Casos**: Inspección detallada, mantenimiento

### LOD 400 - Fabricación
- **Uso**: Elementos críticos (compuertas, válvulas)
- **Geometría**: Detalle completo, componentes internos
- **Tamaño**: 200-500 MB
- **Casos**: Reparaciones, análisis técnico especializado

**Estrategia de carga**: Progresiva según zoom del usuario (LOD 100 → 200 → 300 → 400).

---

# GESTIÓN DE ARCHIVOS Y DATOS

## 📁 Estructura de Almacenamiento

### Supabase Storage - Carpeta BIM

Dentro del módulo **Archivo Técnico**, crear estructura dedicada:

```
archivo_tecnico/
└── bim/
    ├── {presa_id}/
    │   ├── originales/
    │   │   ├── nubes_puntos/
    │   │   │   ├── sector_cuerpo_presa.laz        (5 GB)
    │   │   │   ├── sector_galerias.laz            (2 GB)
    │   │   │   └── sector_aliviadero.laz          (3 GB)
    │   │   ├── modelos_bim/
    │   │   │   ├── modelo_completo.ifc            (800 MB)
    │   │   │   ├── modelo_estructural.rvt         (1.2 GB)
    │   │   │   └── modelo_instalaciones.ifc       (400 MB)
    │   │   └── ortoimagenes/
    │   │       ├── ortofoto_paramento_aguas_arriba.tif  (200 MB)
    │   │       └── ortofoto_coronacion.tif        (150 MB)
    │   │
    │   ├── optimizados/
    │   │   ├── lod_100_presa_completa.glb         (8 MB)
    │   │   ├── lod_200_sector_cuerpo.glb          (35 MB)
    │   │   ├── lod_200_sector_galerias.glb        (25 MB)
    │   │   ├── lod_300_organos_desague.glb        (120 MB)
    │   │   └── lod_400_compuerta_principal.glb    (180 MB)
    │   │
    │   ├── texturas/
    │   │   ├── hormigon_paramento.jpg             (5 MB)
    │   │   ├── roca_cimentacion.jpg               (4 MB)
    │   │   └── metal_compuertas.jpg               (3 MB)
    │   │
    │   └── metadatos/
    │       ├── modelo_info.json
    │       ├── elementos_index.json
    │       └── coordenadas_georref.json
    │
    └── plantillas/
        ├── template_presa_gravedad.glb
        └── template_presa_arco.glb
```

### Políticas de Almacenamiento

**Archivos Originales** (nubes de puntos, BIM nativos):
- **Acceso**: Solo administradores y técnicos BIM
- **Propósito**: Archivo maestro, regeneración de optimizados
- **Retención**: Permanente
- **Backup**: Sí, con réplica geográfica

**Archivos Optimizados** (modelos web):
- **Acceso**: Todos los usuarios autenticados
- **Propósito**: Visualización en visor web
- **Retención**: Mientras sean versión activa (histórico si se actualizan)
- **CDN**: Sí, para carga rápida

**Texturas e Imágenes**:
- **Formato**: JPEG optimizado (calidad 85%), resolución máx 2048x2048
- **Compresión**: Sí, WebP para navegadores compatibles
- **CDN**: Sí

## 🗄️ Modelo de Datos

### Tabla: `bim_modelos`

```sql
CREATE TABLE bim_modelos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  presa_id UUID REFERENCES presas(id) NOT NULL,
  nombre VARCHAR(255) NOT NULL,
  descripcion TEXT,
  tipo_modelo VARCHAR(50) NOT NULL, -- 'nube_puntos', 'modelo_bim', 'modelo_simplificado'
  formato_archivo VARCHAR(20) NOT NULL, -- 'ifc', 'rvt', 'glb', 'laz', 'obj'
  lod_nivel INTEGER, -- 100, 200, 300, 400
  archivo_original_url TEXT, -- URL en Supabase Storage
  archivo_optimizado_url TEXT, -- URL del modelo optimizado para web
  tamaño_bytes BIGINT,
  fecha_escaneo DATE,
  fecha_carga TIMESTAMP DEFAULT NOW(),
  cargado_por_id UUID REFERENCES auth.users(id),
  version INTEGER DEFAULT 1,
  activo BOOLEAN DEFAULT TRUE,
  coordenadas_georref JSONB, -- {"origen": {"lat": 37.xx, "lon": -3.xx, "alt": 500}, "sistema": "EPSG:25830"}
  metadatos JSONB, -- Información técnica adicional
  CONSTRAINT unique_modelo_activo UNIQUE (presa_id, tipo_modelo, lod_nivel, activo)
);

-- Índices
CREATE INDEX idx_bim_modelos_presa ON bim_modelos(presa_id);
CREATE INDEX idx_bim_modelos_lod ON bim_modelos(lod_nivel);
CREATE INDEX idx_bim_modelos_activo ON bim_modelos(activo);

-- RLS
ALTER TABLE bim_modelos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuarios autenticados pueden ver modelos de sus presas"
  ON bim_modelos FOR SELECT
  TO authenticated
  USING (
    presa_id IN (
      SELECT presa_id FROM user_presas_access WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Solo administradores BIM pueden cargar modelos"
  ON bim_modelos FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid()
      AND rol IN ('admin', 'tecnico_bim')
    )
  );
```

### Tabla: `bim_elementos`

Elementos individuales dentro del modelo BIM (equipos, estructuras):

```sql
CREATE TABLE bim_elementos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  modelo_id UUID REFERENCES bim_modelos(id) ON DELETE CASCADE NOT NULL,
  presa_id UUID REFERENCES presas(id) NOT NULL,
  ifc_guid VARCHAR(50), -- GUID del elemento en archivo IFC (estándar BIM)
  tipo_elemento VARCHAR(100) NOT NULL, -- 'centro_transformacion', 'compuerta', 'valvula', etc.
  nombre VARCHAR(255) NOT NULL,
  descripcion TEXT,

  -- Vinculación con otros módulos
  equipo_inventario_id UUID REFERENCES inventario_equipos(id), -- FK a módulo Inventario
  instrumento_auscultacion_id UUID REFERENCES auscultacion_instrumentos(id), -- FK a Auscultación

  -- Geometría y ubicación
  coordenadas_3d JSONB, -- {"x": 125.5, "y": 45.2, "z": 501.3} en sistema local del modelo
  bbox JSONB, -- Bounding box: {"min": {"x","y","z"}, "max": {"x","y","z"}}

  -- Visualización
  color_destacado VARCHAR(7), -- Color hex para resaltar (#FF5733)
  icono_marcador VARCHAR(50), -- Icono para modo esquemático
  visible_por_defecto BOOLEAN DEFAULT TRUE,
  capa_visualizacion VARCHAR(100), -- 'estructura', 'equipos_electricos', 'organos_desague', etc.

  -- Metadatos
  propiedades_ifc JSONB, -- Propiedades originales del IFC
  documentos_vinculados JSONB, -- Array de URLs a documentos técnicos
  fotos_urls JSONB, -- Array de URLs a fotografías

  fecha_creacion TIMESTAMP DEFAULT NOW(),
  fecha_actualizacion TIMESTAMP DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_bim_elementos_modelo ON bim_elementos(modelo_id);
CREATE INDEX idx_bim_elementos_presa ON bim_elementos(presa_id);
CREATE INDEX idx_bim_elementos_tipo ON bim_elementos(tipo_elemento);
CREATE INDEX idx_bim_elementos_equipo_inventario ON bim_elementos(equipo_inventario_id);
CREATE INDEX idx_bim_elementos_instrumento ON bim_elementos(instrumento_auscultacion_id);
CREATE INDEX idx_bim_elementos_ifc_guid ON bim_elementos(ifc_guid);

-- RLS
ALTER TABLE bim_elementos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuarios pueden ver elementos de sus presas"
  ON bim_elementos FOR SELECT
  TO authenticated
  USING (
    presa_id IN (
      SELECT presa_id FROM user_presas_access WHERE user_id = auth.uid()
    )
  );
```

### Tabla: `bim_vistas_guardadas`

Permite a usuarios guardar posiciones de cámara y configuraciones de visualización:

```sql
CREATE TABLE bim_vistas_guardadas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  modelo_id UUID REFERENCES bim_modelos(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  nombre VARCHAR(255) NOT NULL,
  descripcion TEXT,

  -- Configuración de cámara
  camara_posicion JSONB NOT NULL, -- {"x","y","z"}
  camara_objetivo JSONB NOT NULL, -- {"x","y","z"} punto al que mira
  camara_zoom FLOAT,

  -- Configuración de visualización
  capas_activas JSONB, -- Array de capas visibles: ["estructura", "equipos_electricos"]
  elementos_destacados JSONB, -- Array de IDs de elementos resaltados
  filtros_aplicados JSONB, -- Filtros activos

  publica BOOLEAN DEFAULT FALSE, -- Si otros usuarios pueden usar esta vista
  fecha_creacion TIMESTAMP DEFAULT NOW(),
  fecha_actualizacion TIMESTAMP DEFAULT NOW(),

  CONSTRAINT unique_vista_nombre_usuario UNIQUE (modelo_id, user_id, nombre)
);

-- Índices
CREATE INDEX idx_bim_vistas_modelo ON bim_vistas_guardadas(modelo_id);
CREATE INDEX idx_bim_vistas_usuario ON bim_vistas_guardadas(user_id);
CREATE INDEX idx_bim_vistas_publica ON bim_vistas_guardadas(publica);

-- RLS
ALTER TABLE bim_vistas_guardadas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuarios pueden gestionar sus propias vistas"
  ON bim_vistas_guardadas FOR ALL
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Usuarios pueden ver vistas públicas"
  ON bim_vistas_guardadas FOR SELECT
  TO authenticated
  USING (publica = true);
```

---

# ELEMENTOS DEL GEMELO DIGITAL

## 🏭 Catálogo de Elementos a Visualizar

Los elementos del inventario de SIPRESAS que se representarán en el modelo BIM:

### 1. Instalaciones Eléctricas

#### 1.1 Centros de Transformación
- **Vinculación**: `inventario_equipos` WHERE `categoria = 'centro_transformacion'`
- **Propiedades BIM**: Potencia, tensión primaria/secundaria, marca, modelo
- **Estados visuales**:
  - 🟢 Verde: Operativo
  - 🟡 Amarillo: Mantenimiento programado próximo
  - �� Rojo: Avería o inspección fallida
- **Información contextual**:
  - Ficha técnica completa
  - Última inspección (fecha, resultado, PDF)
  - Próximo mantenimiento programado
  - Documentación técnica (planos, manuales)

#### 1.2 Cuadros Eléctricos Generales
- **Vinculación**: `inventario_equipos` WHERE `categoria = 'cuadro_electrico'`
- **Propiedades BIM**: Tipo, número de circuitos, protecciones
- **Información contextual**: Esquema eléctrico, historial de actuaciones

#### 1.3 Grupos Electrógenos
- **Vinculación**: `inventario_equipos` WHERE `categoria = 'grupo_electrogeno'`
- **Propiedades BIM**: Potencia (kVA), combustible, autonomía
- **Estados visuales**: Similar a centros transformación
- **Información adicional**: Horas de funcionamiento, últimas pruebas

#### 1.4 Iluminación en Galerías
- **Vinculación**: `inventario_equipos` WHERE `categoria = 'iluminacion_galeria'`
- **Propiedades BIM**: Tipo de luminaria, potencia, sector
- **Visualización**: Puntos de luz distribuidos en galerías
- **Información**: Estado operativo, última revisión

### 2. Órganos de Desagüe

#### 2.1 Aliviaderos
- **Vinculación**: `explotacion_organos_desague` WHERE `tipo = 'aliviadero'`
- **Propiedades BIM**: Tipo (superficie/compuertas), capacidad (m³/s), cota umbral
- **Estados visuales**:
  - 🟢 Verde: Operativo (todas compuertas funcionales)
  - 🟡 Amarillo: Operatividad parcial (algunas compuertas no operativas)
  - 🔴 Rojo: No operativo
- **Información contextual**:
  - Curvas de gasto (del módulo Explotación)
  - Última inspección visual
  - Operatividad actual de compuertas
  - Caudal vertido actual (si hay operación)

#### 2.2 Desagües de Fondo
- **Vinculación**: `explotacion_organos_desague` WHERE `tipo = 'desague_fondo'`
- **Propiedades BIM**: Diámetro, tipo de válvula, cota de toma
- **Información contextual**: Operatividad, última maniobra, caudal actual

#### 2.3 Tomas para Abastecimiento/Riego
- **Vinculación**: `explotacion_organos_desague` WHERE `tipo = 'toma'`
- **Propiedades BIM**: Diámetro, caudal concesional
- **Información contextual**: Concesionarios, volumen entregado anual

#### 2.4 Válvulas de Control
- **Vinculación**: `inventario_equipos` WHERE `categoria = 'valvula'`
- **Propiedades BIM**: Tipo (mariposa/esférica/cono), diámetro, presión máxima
- **Estados visuales**: Abierta (verde), cerrada (gris), posición intermedia (amarillo)

### 3. Equipos de Seguridad

#### 3.1 Sistemas de Achique
- **Vinculación**: `inventario_equipos` WHERE `categoria = 'bomba_achique'`
- **Propiedades BIM**: Caudal (l/s), altura manométrica, potencia motor
- **Estados visuales**: Operativa (verde), avería (rojo), en prueba (azul)
- **Información contextual**: Horas de funcionamiento, última prueba, curva característica

#### 3.2 Ventilación Forzada
- **Vinculación**: `inventario_equipos` WHERE `categoria = 'ventilador'`
- **Propiedades BIM**: Caudal de aire (m³/h), potencia
- **Estados visuales**: En funcionamiento (verde animado), parado (gris)
- **Información contextual**: Sensores de calidad de aire asociados

### 4. Equipos de Auscultación

#### 4.1 Aforadores de Filtración
- **Vinculación**: `auscultacion_instrumentos` WHERE `tipo = 'aforador'`
- **Propiedades BIM**: Ubicación exacta, tipo (vertedero/caudalímetro), rango medida
- **Estados visuales según umbrales**:
  - 🟢 Verde: Valores normales
  - 🟡 Amarillo: Próximo a umbral (80-100% del umbral Extraordinaria)
  - 🟠 Naranja: Situación Extraordinaria declarada
  - 🔴 Rojo: Escenario 0 o 1 PEP activado
- **Información contextual**:
  - Valor actual de caudal
  - Gráfico de evolución temporal (últimos 7/30 días)
  - Umbrales configurados (del módulo Auscultación)
  - Alertas activas si las hay

#### 4.2 Piezómetros
- **Vinculación**: `auscultacion_instrumentos` WHERE `tipo = 'piezometro'`
- **Propiedades BIM**: Profundidad, tipo (abierto/cerrado/eléctrico), cota instalación
- **Estados visuales**: Similar a aforadores
- **Información**: Presión intersticial actual, histórico, umbrales

#### 4.3 Péndulos/Desplazómetros
- **Vinculación**: `auscultacion_instrumentos` WHERE `tipo = 'desplazometro'`
- **Propiedades BIM**: Coordenadas precisas, tipo medición (horizontal/vertical/3D)
- **Visualización especial**: Vectores de desplazamiento amplificados (escala x1000) superpuestos al modelo
- **Información**: Desplazamiento acumulado, velocidad, tendencia

#### 4.4 Inclinómetros
- **Vinculación**: `auscultacion_instrumentos` WHERE `tipo = 'inclinometro'`
- **Propiedades BIM**: Profundidad de sondeo, orientación
- **Visualización**: Perfil de inclinación en ventana lateral

#### 4.5 Termómetros
- **Vinculación**: `auscultacion_instrumentos` WHERE `tipo = 'termometro'`
- **Propiedades BIM**: Ubicación (galería/paramento/núcleo)
- **Información**: Temperatura actual, evolución estacional

### 5. Elementos Estructurales (Contexto)

Aunque no son equipos del inventario, se representan para contexto:

#### 5.1 Cuerpo de Presa
- **Geometría**: Completa según LOD
- **Materiales**: Hormigón (color distintivo), roca de cimentación
- **Secciones**: Posibilidad de cortes transversales virtuales

#### 5.2 Galerías de Inspección
- **Geometría**: Túneles navegables virtualmente
- **Marcadores**: Entradas, salidas, escaleras, accesos
- **Información**: Longitud, cota, accesibilidad

#### 5.3 Embalse (Agua)
- **Representación**: Superficie de agua según nivel actual (del SAIH)
- **Dinámica**: Actualización cada 1 hora con nivel actual
- **Visualización**: Transparencia, reflejo, animación sutil de oleaje

---

# INTEGRACIONES CON MÓDULOS EXISTENTES

## 🔗 Integración con Módulo Inventario

### Vinculación Bidireccional

**Desde Inventario → BIM**:
- Al crear equipo en Inventario, opción de vincularlo a elemento BIM
- Selector visual: "Seleccionar en Modelo 3D" abre visor BIM, usuario hace clic en elemento
- Al seleccionar, se guarda `equipo_inventario_id` en `bim_elementos`

**Desde BIM → Inventario**:
- Al hacer clic en elemento 3D, panel lateral muestra ficha de inventario
- Botón "Ver Ficha Completa" abre módulo Inventario con ese equipo

### Datos Compartidos

```sql
-- Query de integración
SELECT
  be.id AS elemento_bim_id,
  be.nombre AS elemento_nombre,
  be.coordenadas_3d,
  ie.codigo AS codigo_inventario,
  ie.categoria,
  ie.marca,
  ie.modelo,
  ie.fecha_instalacion,
  ie.estado_actual,
  ie.documentacion_urls
FROM bim_elementos be
JOIN inventario_equipos ie ON be.equipo_inventario_id = ie.id
WHERE be.modelo_id = ? AND be.presa_id = ?
```

### Panel de Información Contextual

Cuando usuario hace clic en elemento BIM vinculado a Inventario:

```
┌─────────────────────────────────────────────┐
│ Centro de Transformación CT-01              │
├─────────────────────────────────────────────┤
│ 📋 DATOS GENERALES                          │
│ Código: CT-001-2018                         │
│ Marca: Schneider Electric                   │
│ Modelo: RM6-20kV                            │
│ Potencia: 630 kVA                           │
│ Instalación: 15/03/2018                     │
│                                             │
│ 🔧 ESTADO ACTUAL                            │
│ Estado: 🟢 Operativo                        │
│ Última inspección: 12/01/2024 ✅            │
│ Próximo mantenimiento: 15/07/2024          │
│                                             │
│ 📄 DOCUMENTACIÓN                            │
│ [📑 Manual de Operación]                    │
│ [📐 Plano Eléctrico]                        │
│ [📋 Certificado CE]                         │
│                                             │
│ [Ver Ficha Completa en Inventario] [Cerrar]│
└─────────────────────────────────────────────┘
```

## 🔧 Integración con Módulo Mantenimiento

### Visualización de Estado de Inspecciones

**Estados en BIM según última inspección**:
```sql
-- Query para obtener estado de inspección
SELECT
  be.id AS elemento_bim_id,
  mi.fecha_fin AS fecha_ultima_inspeccion,
  mi.resultado_general, -- 'ok', 'observaciones_menores', 'anomalia_grave'
  mi.pdf_parte_url
FROM bim_elementos be
JOIN inventario_equipos ie ON be.equipo_inventario_id = ie.id
LEFT JOIN mantenimiento_inspecciones mi ON mi.equipo_id = ie.id
WHERE mi.fecha_fin = (
  SELECT MAX(fecha_fin)
  FROM mantenimiento_inspecciones
  WHERE equipo_id = ie.id AND estado = 'cerrada'
)
```

**Mapeo de colores**:
- ✅ `resultado = 'ok'` → Verde
- ⚠️ `resultado = 'observaciones_menores'` → Amarillo
- ❌ `resultado = 'anomalia_grave'` → Rojo
- ❓ Sin inspección reciente (>1 año) → Gris con advertencia

### Acceso a PDFs de Inspección

Al hacer clic en elemento con inspecciones:

```
┌─────────────────────────────────────────────┐
│ Compuerta Aliviadero CA-02                  │
├─────────────────────────────────────────────┤
│ 🔍 ÚLTIMA INSPECCIÓN                        │
│ Fecha: 28/11/2023                           │
│ Operario: Juan García                       │
│ Resultado: ⚠️ Observaciones menores         │
│                                             │
│ 📄 Parte de Inspección                      │
│ [📥 Descargar PDF]                          │
│                                             │
│ Observaciones:                              │
│ "Lubricación de cojinetes necesaria.        │
│  Oxidación leve en vástago."                │
│                                             │
│ 📊 HISTORIAL (últimas 5 inspecciones)      │
│ ┌──────────┬─────────┬──────────────┐       │
│ │ Fecha    │ Operario│ Resultado    │       │
│ ├──────────┼─────────┼──────────────┤       │
│ │28/11/2023│ J.García│ ⚠️ Obs. menor │       │
│ │15/05/2023│ M.López │ ✅ OK         │       │
│ │10/11/2022│ J.García│ ✅ OK         │       │
│ │...       │         │              │       │
│ └──────────┴─────────┴──────────────┘       │
│                                             │
│ [Ver Historial Completo] [Cerrar]          │
└─────────────────────────────────────────────┘
```

### Integración Automática (según BACKLOG_MODULOS_ADICIONALES.md)

Ya está previsto en **MNT-003**:
> "**Given** inspección cerrada de equipo marcado como "BIM"<br>
> **When** genera PDF<br>
> **Then** sistema envía PDF automáticamente a endpoint BIM configurado"

**Implementación**:
- Edge Function `enviar-pdf-a-bim` se dispara al cerrar inspección
- Actualiza `bim_elementos.documentos_vinculados` añadiendo nuevo PDF
- Marca fecha de última actualización
- Visor BIM muestra badge "Nuevo PDF" si actualizado en últimos 7 días

## ⚙️ Integración con Módulo Explotación

### Visualización de Estado de la Presa

**Estados globales** (del módulo Explotación):
- 🟢 **Normal**: Todos los elementos con color estándar
- 🟡 **Situación Extraordinaria**: Banner superior amarillo + elementos relacionados destacados
- 🔴 **Escenario 0 PEP**: Banner rojo parpadeante + elementos críticos resaltados

**Banner superior en visor BIM**:

```
┌─────────────────────────────────────────────────────────┐
│ ⚠️ SITUACIÓN EXTRAORDINARIA DECLARADA                   │
│ Causa: Avenida - Nivel embalse 602.5m (resguardo 600m) │
│ Desde: 15/01/2024 10:30                                 │
│ [Ver Detalle en Módulo Explotación]                     │
└─────────────────────────────────────────────────────────┘
```

### Estado de Órganos de Desagüe

**Visualización dinámica**:
```sql
-- Query para obtener estado de órganos
SELECT
  be.id AS elemento_bim_id,
  oed.tipo_organo,
  oed.numero_compuertas,
  oed.configuracion_compuertas, -- JSON con operatividad
  eoa.organos_operatividad -- Del módulo Explotación
FROM bim_elementos be
JOIN explotacion_organos_desague oed ON be.nombre = oed.nombre
LEFT JOIN explotacion_operatividad_actual eoa ON eoa.presa_id = be.presa_id
WHERE be.tipo_elemento LIKE 'organo_desague%'
```

**Representación visual de compuertas**:
- Compuertas operativas: Verde sólido
- Compuertas no operativas: Rojo con patrón rayado
- Compuertas en maniobra: Amarillo con animación

### Nivel de Embalse Dinámico

**Actualización en tiempo real**:
```javascript
// Actualiza geometría de agua cada 1 hora
const actualizarNivelEmbalse = async (presaId) => {
  const nivel = await obtenerNivelActualSAIH(presaId);

  // Actualiza mesh de superficie de agua
  superficieAgua.position.z = nivel; // Cota en metros

  // Marca visual de niveles importantes
  const nme = await obtenerNME(presaId); // Nivel Máximo Embalse
  const resguardo = await obtenerResguardoEstacional(presaId);

  // Renderiza líneas de referencia
  renderizarLineaNivel(nme, 'rojo', 'NME');
  renderizarLineaNivel(resguardo, 'naranja', 'Resguardo');
};
```

## 📊 Integración con Módulo Auscultación

### Visualización de Estado de Instrumentos

**Colores según evaluación de umbrales** (del módulo Auscultación):

```sql
-- Query para estado de instrumentos de auscultación
SELECT
  be.id AS elemento_bim_id,
  ai.codigo_damdata,
  ai.tipo_instrumento,
  ai.variable_medida,
  al.fecha_hora_lectura AS lectura_timestamp,
  al.valor AS lectura_valor,
  al.unidad,
  aa.tipo_resultado_alcanzado, -- null, 'situación_extraordinaria', 'escenario_0_pep', 'escenario_1_pep'
  aa.estado AS alerta_estado -- 'activa', 'reconocida', 'resuelta'
FROM bim_elementos be
JOIN auscultacion_instrumentos ai ON be.instrumento_auscultacion_id = ai.id
LEFT JOIN auscultacion_lecturas al ON al.instrumento_id = ai.id
  AND al.id = (SELECT MAX(id) FROM auscultacion_lecturas WHERE instrumento_id = ai.id)
LEFT JOIN auscultacion_evaluaciones ae ON ae.lectura_id = al.id AND ae.resultado_expresión = TRUE
LEFT JOIN auscultacion_alertas aa ON aa.evaluación_id = ae.id AND aa.estado IN ('activa', 'reconocida')
WHERE be.presa_id = ? AND be.instrumento_auscultacion_id IS NOT NULL
```

**Mapeo de colores**:
- 🟢 **Verde**: Sin alertas, valores normales
- 🟡 **Amarillo**: Valor entre 80-100% del umbral (pre-alerta)
- 🟠 **Naranja**: Situación Extraordinaria activa
- 🔴 **Rojo**: Escenario 0 o 1 PEP activo
- ⚫ **Gris**: Sin lecturas recientes (>7 días)

**Animaciones**:
- Alertas activas no reconocidas: Parpadeo lento (1 ciclo/2s)
- Alertas críticas (Escenario 1): Parpadeo rápido (2 ciclos/s)

### Panel de Información - Instrumento de Auscultación

Al hacer clic en instrumento (ej: Aforador de filtración):

```
┌────────────────────────────────────────────────────┐
│ Aforador AF-01 - Filtración Galería Principal      │
├────────────────────────────────────────────────────┤
│ 🔴 ALERTA ACTIVA: Situación Extraordinaria         │
│                                                    │
│ 📊 LECTURA ACTUAL                                  │
│ Caudal: 85.3 lts/min                               │
│ Fecha: 15/01/2024 10:15                            │
│ Origen: DAMDATA (automático)                       │
│                                                    │
│ ⚠️ UMBRALES                                        │
│ ┌──────────────────┬──────────┬─────────────┐     │
│ │ Tipo             │ Valor    │ Estado      │     │
│ ├──────────────────┼──────────┼─────────────┤     │
│ │ Normal           │ < 82.7   │             │     │
│ │ Extraordinaria   │ > 82.7   │ 🔴 SUPERADO │     │
│ │ Escenario 0      │ > 117.2  │             │     │
│ └──────────────────┴──────────┴─────────────┘     │
│                                                    │
│ 📈 GRÁFICO EVOLUCIÓN (últimos 7 días)             │
│ [Gráfico interactivo de línea Q vs tiempo]        │
│ [Ver gráfico ampliado] [Cambiar rango: 30d | 6m]  │
│                                                    │
│ 🔔 ALERTAS ACTIVAS (1)                             │
│ • Situación Extraordinaria desde 15/01 09:45      │
│   Reconocida por: Director Explotación            │
│   [Ver detalle en Módulo Auscultación]            │
│                                                    │
│ 📜 HISTORIAL ALERTAS                               │
│ • 15/01/2024: Situación Extraordinaria            │
│ • 12/11/2023: Situación Extraordinaria (resuelta) │
│ • 05/04/2023: Pre-alerta (no activada)            │
│                                                    │
│ [Ir a Módulo Auscultación] [Cerrar]               │
└────────────────────────────────────────────────────┘
```

### Gráfico Histórico Embebido

**Implementación** con Recharts (ya usado en proyecto):

```typescript
// Componente de gráfico en panel BIM
const GraficoAuscultacionBIM: React.FC<{instrumentoId: string}> = ({ instrumentoId }) => {
  const [lecturas, setLecturas] = useState([]);
  const [rango, setRango] = useState('7d');

  useEffect(() => {
    const fetchLecturas = async () => {
      const { data } = await supabase
        .from('auscultacion_lecturas')
        .select('fecha_hora_lectura, valor, unidad')
        .eq('instrumento_id', instrumentoId)
        .gte('fecha_hora_lectura', calcularFechaInicio(rango))
        .order('fecha_hora_lectura', { ascending: true });

      setLecturas(data);
    };

    fetchLecturas();
  }, [instrumentoId, rango]);

  return (
    <div className="w-full h-48">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={lecturas}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="fecha_hora_lectura"
            tickFormatter={(ts) => format(new Date(ts), 'dd/MM')}
          />
          <YAxis label={{ value: 'Caudal (lts/min)', angle: -90 }} />
          <Tooltip
            labelFormatter={(ts) => format(new Date(ts), 'dd/MM/yyyy HH:mm')}
          />
          <Line
            type="monotone"
            dataKey="valor"
            stroke="#3b82f6"
            strokeWidth={2}
            dot={false}
          />
          {/* Línea de umbral Extraordinaria */}
          <ReferenceLine y={82.7} stroke="orange" strokeDasharray="5 5" label="Extraordinaria" />
          {/* Línea de umbral Escenario 0 */}
          <ReferenceLine y={117.2} stroke="red" strokeDasharray="5 5" label="Escenario 0" />
        </LineChart>
      </ResponsiveContainer>

      <div className="flex gap-2 mt-2 justify-center">
        <button onClick={() => setRango('7d')} className={rango === '7d' ? 'active' : ''}>7 días</button>
        <button onClick={() => setRango('30d')} className={rango === '30d' ? 'active' : ''}>30 días</button>
        <button onClick={() => setRango('6m')} className={rango === '6m' ? 'active' : ''}>6 meses</button>
      </div>
    </div>
  );
};
```

---

# FUNCIONALIDADES DEL VISOR BIM

## 🖥️ Interfaz de Usuario

### Layout Principal

```
┌─────────────────────────────────────────────────────────────────┐
│ SIPRESAS - Módulo BIM                                    [X]    │
├─────────────────────────────────────────────────────────────────┤
│ Presa: [Jándula ▼]  Modelo: [Completo LOD 200 ▼]  [⚙️ Config]  │
├─────┬───────────────────────────────────────────────────┬───────┤
│     │                                                   │       │
│  P  │                                                   │   I   │
│  A  │                                                   │   N   │
│  N  │           VISOR 3D                                │   F   │
│  E  │           (Modelo de presa)                       │   O   │
│  L  │                                                   │       │
│     │                                                   │   P   │
│  C  │                                                   │   A   │
│  A  │                                                   │   N   │
│  P  │                                                   │   E   │
│  A  │                                                   │   L   │
│  S  │                                                   │       │
│     │                                                   │ (se   │
│     │                                                   │ abre  │
│     │                                                   │ al    │
│     │                                                   │ clic) │
│     │                                                   │       │
├─────┴───────────────────────────────────────────────────┴───────┤
│ 🎮 Controles: Ratón para rotar | Rueda para zoom | Clic derecho│
│    para desplazar | Doble clic en elemento para información    │
└─────────────────────────────────────────────────────────────────┘
```

### Panel Izquierdo: Capas y Filtros

```
┌─────────────────────────┐
│ 📂 CAPAS DE VISUALIZACIÓN│
├─────────────────────────┤
│ ☑️ Estructura           │
│   ├─ ☑️ Cuerpo de presa │
│   ├─ ☑️ Galerías        │
│   └─ ☑️ Cimentación     │
│                         │
│ ☑️ Órganos de Desagüe   │
│   ├─ ☑️ Aliviaderos     │
│   ├─ ☑️ Desagües fondo  │
│   └─ ☑️ Tomas           │
│                         │
│ ☑️ Equipos Eléctricos   │
│   ├─ ☑️ CT              │
│   ├─ ☑️ Cuadros         │
│   └─ ☐ Iluminación     │
│                         │
│ ☑️ Auscultación         │
│   ├─ ☑️ Aforadores      │
│   ├─ ☑️ Piezómetros     │
│   └─ ☑️ Desplazómetros  │
│                         │
│ ☐ Embalse (agua)        │
│ ☐ Entorno (terreno)     │
│                         │
├─────────────────────────┤
│ 🔍 FILTROS              │
├─────────────────────────┤
│ Estado:                 │
│ ☐ Solo con alertas      │
│ ☐ Mantenimiento próximo │
│ ☐ Sin inspección reciente│
│                         │
│ Tipo:                   │
│ [Todos ▼]               │
│                         │
│ [Aplicar] [Limpiar]     │
│                         │
├─────────────────────────┤
│ 📌 VISTAS GUARDADAS     │
├─────────────────────────┤
│ • Vista general         │
│ • Galería principal     │
│ • Aliviadero            │
│ • Instrumentación       │
│                         │
│ [+ Guardar vista actual]│
└─────────────────────────┘
```

### Panel Derecho: Información Contextual

Se abre al hacer clic en cualquier elemento del modelo 3D. Contenido dinámico según tipo de elemento (ya mostrado en secciones de integración anteriores).

## 🎮 Controles de Navegación

### Controles de Cámara

**Ratón**:
- **Clic izquierdo + arrastrar**: Rotar cámara (orbital)
- **Clic derecho + arrastrar**: Desplazar (pan)
- **Rueda del ratón**: Zoom in/out
- **Doble clic en elemento**: Centrar cámara en elemento + abrir panel info

**Teclado** (opcional):
- **W/A/S/D**: Desplazamiento (modo first-person opcional)
- **Q/E**: Subir/bajar cámara
- **Flechas**: Rotar cámara
- **Espacio**: Reset vista a posición inicial
- **F**: Focus en elemento seleccionado

**Táctil** (tablets):
- **1 dedo**: Rotar
- **2 dedos**: Zoom (pinch)
- **3 dedos**: Desplazar

### Barra de Herramientas

```
┌──────────────────────────────────────────────────────┐
│ [🏠 Home] [📏 Medir] [✂️ Corte] [📷 Captura]          │
│ [🔦 Luz] [👁️ Modo] [🎬 Tour] [❓ Ayuda]               │
└──────────────────────────────────────────────────────┘
```

**Herramientas**:

1. **🏠 Home**: Volver a vista inicial predefinida
2. **📏 Medir**: Activar herramienta de medición (distancias, áreas)
3. **✂️ Corte**: Planos de corte para ver interior (sección transversal)
4. **📷 Captura**: Screenshot del visor (descarga PNG)
5. **🔦 Luz**: Ajustar iluminación de la escena
6. **👁️ Modo**: Cambiar entre modos de renderizado:
   - Realista (con texturas)
   - Esquemático (colores por tipo)
   - Wireframe (solo aristas)
   - Transparencias
7. **🎬 Tour**: Tour automático pregrabado (animación de cámara)
8. **❓ Ayuda**: Tutorial interactivo de controles

## 🔍 Funcionalidades Avanzadas

### Modo de Medición

Al activar herramienta de medición:

1. **Medir distancia**:
   - Clic en punto inicio
   - Clic en punto fin
   - Muestra línea 3D con medida en metros

2. **Medir área**:
   - Clic en múltiples puntos (polígono)
   - Doble clic para cerrar
   - Muestra área en m²

3. **Medir ángulo**:
   - Clic en 3 puntos (vértice en medio)
   - Muestra ángulo en grados

Ejemplo visual:
```
    Punto A
      ●━━━━━━━━━━━━━━━━━━━━━━● Punto B
            45.2 m
```

### Planos de Corte (Secciones)

Permite "cortar" virtualmente la presa para ver su interior:

**Tipos de corte**:
- **Horizontal**: Planta a cota especificada
- **Vertical longitudinal**: Sección aguas arriba-abajo
- **Vertical transversal**: Sección margen derecha-izquierda
- **Libre**: Usuario define plano con 3 puntos

**Controles**:
- Slider para mover plano de corte
- Toggle para invertir lado visible
- Opción de mostrar/ocultar aristas de corte

**Utilidad**:
- Visualizar galerías internas
- Ver disposición de equipos en interior
- Entender estructura de núcleo de presa

### Tour Automático

Recorrido virtual pregrabado por puntos de interés:

**Secuencia ejemplo**:
1. Vista aérea general de presa (5s)
2. Zoom a coronación (3s)
3. Descenso a galería principal, entrada (4s)
4. Recorrido por galería mostrando instrumentación (10s)
5. Salida a paramento aguas abajo (3s)
6. Zoom a aliviadero con compuertas (5s)
7. Vuelta a vista general (3s)

**Controles**:
- ▶️ Play / ⏸️ Pause
- ⏭️ Siguiente punto de interés
- ⏮️ Punto anterior
- 🔄 Repetir tour

**Personalización** (para admins):
- Editor de tours con keyframes
- Configurar tiempo por punto
- Añadir etiquetas explicativas

### Modo de Colores por Estado

**Codificación cromática automática**:

1. **Por estado operacional**:
   - 🟢 Verde: Operativo / OK
   - 🟡 Amarillo: Aviso / Mantenimiento próximo
   - 🔴 Rojo: Fallo / Alerta activa
   - ⚫ Gris: Sin datos / Desconocido

2. **Por criticidad** (Auscultación):
   - Gradiente del verde al rojo según proximidad a umbral
   - Barra de leyenda en pantalla

3. **Por fecha de inspección**:
   - Verde: < 3 meses
   - Amarillo: 3-6 meses
   - Naranja: 6-12 meses
   - Rojo: > 12 meses

4. **Por tipo de equipo**:
   - Azul: Eléctricos
   - Verde: Mecánicos
   - Naranja: Auscultación
   - Gris: Estructurales

Selector en interfaz permite cambiar entre modos.

---

# CONSIDERACIONES TÉCNICAS

## ⚡ Performance y Optimización

### Carga Progresiva (LOD)

**Estrategia de streaming**:

1. **Carga inicial** (< 3s):
   - Modelo LOD 100 (< 10 MB)
   - Bounding boxes de elementos
   - Interfaz interactiva operativa

2. **Carga secundaria** (background):
   - LOD 200 por sectores visibles
   - Texturas de baja resolución

3. **Carga bajo demanda**:
   - LOD 300/400 solo cuando usuario hace zoom cercano
   - Texturas de alta resolución

**Implementación**:
```javascript
// Pseudo-código
const cargarModeloProgresivo = async (presaId) => {
  // 1. Carga inmediata LOD 100
  const modeloBase = await cargarModelo(`${presaId}/lod_100.glb`);
  renderizar(modeloBase);

  // 2. Carga en background LOD 200 sectores
  const sectores = ['cuerpo', 'galerias', 'organos'];
  sectores.forEach(sector => {
    cargarModeloAsync(`${presaId}/lod_200_${sector}.glb`)
      .then(modelo => reemplazarSector(modeloBase, sector, modelo));
  });

  // 3. Listener de zoom para LOD 300/400
  camara.addEventListener('zoom', (evento) => {
    if (evento.distancia < 50) { // Zoom cercano
      const elementoCercano = detectarElementoCercano();
      cargarLODDetallado(elementoCercano);
    }
  });
};
```

### Optimización de Mallas

**Técnicas**:
- **Decimation**: Reducción de polígonos manteniendo silueta
  - LOD 100: 100K polígonos
  - LOD 200: 500K polígonos
  - LOD 300: 2M polígonos
  - LOD 400: 10M polígonos (solo elementos críticos)

- **Instanciamiento**: Equipos repetidos (luminarias, barandillas) usan una sola geometría instanciada múltiples veces

- **Culling**: No renderizar objetos fuera de cámara (frustum culling) u ocultos por otros (occlusion culling)

### Compresión de Archivos

**Formatos optimizados**:
- **glTF 2.0 + Draco**: Compresión de geometría ~90%
- **KTX2 + Basis Universal**: Texturas comprimidas para GPU
- **Meshopt**: Optimización de orden de vértices para caché GPU

**Ejemplo de compresión**:
- Modelo original IFC: 800 MB
- Modelo LOD 200 sin comprimir: 120 MB
- Modelo LOD 200 Draco + KTX2: 15 MB ✅ (87.5% reducción)

### Caché y CDN

**Estrategia**:
1. **Cache-Control headers**: `max-age=31536000` (1 año) para modelos versionados
2. **Service Worker**: Cache de modelos en navegador para uso offline
3. **CDN**: CloudFlare con POP cercano a usuarios (Madrid)

**Versionado**:
- URL con hash de contenido: `modelo_lod200_a4f3e9b2.glb`
- Al actualizar modelo, nuevo hash → invalida caché automáticamente

## 🔒 Seguridad

### Control de Acceso a Modelos

**RLS en Supabase Storage**:
```sql
-- Política de Storage para bucket bim
CREATE POLICY "Usuarios autenticados pueden descargar modelos de sus presas"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'bim'
  AND (storage.foldername(name))[1] IN (
    SELECT presa_id::text
    FROM user_presas_access
    WHERE user_id = auth.uid()
  )
);
```

**Signed URLs** (opcional para modelos sensibles):
- Genera URL temporal con token (válido 1 hora)
- Evita hotlinking de modelos

### Protección de Datos Sensibles

**Filtrado de información**:
- Elementos clasificados como "Confidencial" en Inventario no se muestran a usuarios sin permisos
- Coordenadas exactas de instrumentación crítica ofuscadas para usuarios no autorizados
- Planos detallados solo accesibles con rol "técnico" o superior

## 📱 Compatibilidad

### Navegadores Soportados

**Desktop**:
- ✅ Chrome 90+ (recomendado)
- ✅ Firefox 88+
- ✅ Edge 90+
- ✅ Safari 14+

**Mobile**:
- ✅ Chrome Android 90+
- ✅ Safari iOS 14+
- ⚠️ Funcionalidad limitada en dispositivos <2GB RAM

### Requisitos Mínimos

**Hardware**:
- **CPU**: Dual-core 2.0 GHz
- **RAM**: 4 GB (8 GB recomendado)
- **GPU**: Soporte WebGL 2.0
- **Conexión**: 5 Mbps (carga inicial), 1 Mbps (operación)

**Software**:
- JavaScript habilitado
- WebGL 2.0 habilitado
- Cookies de sesión permitidas

### Detección y Degradación

```javascript
// Detección de capacidades
const detectarCapacidades = () => {
  const canvas = document.createElement('canvas');
  const gl = canvas.getContext('webgl2');

  if (!gl) {
    mostrarAlerta('Tu navegador no soporta WebGL 2.0. Actualiza tu navegador.');
    return { webgl2: false };
  }

  const memoria = navigator.deviceMemory || 4; // API experimental
  const cores = navigator.hardwareConcurrency || 2;

  // Perfil de rendimiento
  let perfil = 'alto';
  if (memoria < 4 || cores < 4) perfil = 'medio';
  if (memoria < 2 || cores < 2) perfil = 'bajo';

  return { webgl2: true, perfil };
};

// Ajuste automático de calidad
const configurarCalidad = (perfil) => {
  switch(perfil) {
    case 'alto':
      configurar({ lod: 300, sombras: true, antialiasing: 4 });
      break;
    case 'medio':
      configurar({ lod: 200, sombras: false, antialiasing: 2 });
      break;
    case 'bajo':
      configurar({ lod: 100, sombras: false, antialiasing: 0 });
      break;
  }
};
```

## 🧪 Testing

### Pruebas Funcionales

**Casos de prueba clave**:
1. ✅ Carga de modelo completo < 10s (LOD 100)
2. ✅ Transición LOD 100 → 200 sin saltos visuales
3. ✅ Clic en 10 elementos diferentes abre panel info correcto
4. ✅ Filtros de capas ocultan/muestran geometría correspondiente
5. ✅ Integración con Inventario muestra datos actualizados
6. ✅ Integración con Auscultación actualiza colores según alertas
7. ✅ Modo offline muestra modelos previamente cargados

### Pruebas de Performance

**Métricas objetivo**:
- **FPS**: ≥ 30 fps constantes con modelo LOD 200 completo
- **Tiempo carga inicial**: < 5s (3G) o < 2s (4G/WiFi)
- **Memoria RAM**: < 500 MB con modelo LOD 300 cargado
- **Consumo datos**: < 50 MB para sesión típica (30 min)

**Herramientas**:
- Chrome DevTools Performance
- Lighthouse (Performance score ≥ 80)
- WebGL Insights para GPU profiling

---

# ROADMAP Y CRONOGRAMA

## 📅 Planificación Temporal

### Fase 0: Análisis y Preparación (1 mes) - Q1 2024

**Actividades**:
- ✅ Reunión con proveedores de escaneo láser
- ✅ Definición de especificaciones técnicas de modelos BIM
- ✅ Evaluación de tecnologías de visor web (POC Three.js vs Babylon.js)
- ✅ Diseño de arquitectura de datos
- ✅ Definición de integraciones con módulos existentes

**Entregables**:
- Documento de especificación técnica (este documento)
- POC de visor 3D con modelo de prueba
- Esquema de base de datos aprobado

### Fase 1: MVP Visor BIM (3 meses) - Q2 2024

**Sprint 1-2: Infraestructura Base** (1 mes)
- Configurar storage para archivos BIM en Supabase
- Implementar tablas BD (bim_modelos, bim_elementos)
- Crear página de módulo BIM en menú de SIPRESAS
- Integrar librería Three.js + IFC.js
- Implementar carga de modelos glTF básicos

**Sprint 3-4: Visor Interactivo** (1 mes)
- Controles de cámara (orbital, zoom, pan)
- Selector de capas (mostrar/ocultar elementos)
- Clic en elementos 3D → Panel de información
- Modo de colores por tipo de elemento
- Barra de herramientas básica

**Sprint 5-6: Integración Inventario** (1 mes)
- Vinculación elementos BIM ↔ equipos Inventario
- Panel lateral con ficha de equipo
- Botón "Ver en Inventario" que abre módulo
- Estados visuales según datos de Inventario
- Documentación técnica accesible desde BIM

**Entregables Fase 1**:
- ✅ Módulo BIM operativo en SIPRESAS
- ✅ Carga de 1 presa piloto con modelo LOD 200
- ✅ Integración básica con módulo Inventario
- ✅ Manual de usuario del visor BIM

### Fase 2: Integraciones Completas (4 meses) - Q3-Q4 2024

**Sprint 7-8: Integración Mantenimiento** (1 mes)
- Obtener estado de última inspección
- Colores según resultado de inspección
- Acceso a PDFs de partes de inspección
- Historial de inspecciones por equipo
- Automatización: nuevo PDF → actualiza BIM

**Sprint 9-10: Integración Explotación** (1 mes)
- Banner de estado global de presa (Normal/Extraordinaria/PEP)
- Estado de órganos de desagüe (operatividad compuertas)
- Nivel de embalse dinámico (actualización desde SAIH)
- Líneas de referencia (NME, resguardo)
- Visualización de caudales vertidos

**Sprint 11-12: Integración Auscultación** (1.5 meses)
- Colores según evaluación de umbrales
- Alertas activas superpuestas en modelo
- Panel con lectura actual + gráfico histórico embebido
- Animaciones para alertas no reconocidas
- Vectores de desplazamiento para desplazómetros

**Sprint 13: Testing y Refinamiento** (0.5 meses)
- Pruebas de integración end-to-end
- Testing de performance con múltiples usuarios
- Corrección de bugs reportados
- Optimización de consultas BD

**Entregables Fase 2**:
- ✅ Integraciones completas con 4 módulos
- ✅ 3 presas piloto con modelos completos
- ✅ Documentación técnica de APIs de integración
- ✅ Videos tutoriales para usuarios finales

### Fase 3: Funcionalidades Avanzadas (3 meses) - Q1 2025

**Sprint 14-15: LOD Dinámico** (1 mes)
- Implementar carga progresiva LOD 100/200/300/400
- Streaming de modelos según zoom
- Optimización de mallas con Draco
- Compresión de texturas con KTX2

**Sprint 16: Herramientas de Análisis** (1 mes)
- Herramienta de medición (distancias, áreas)
- Planos de corte (secciones transversales)
- Modo wireframe y transparencias
- Tour automático pregrabado

**Sprint 17-18: Mejoras UX** (1 mes)
- Vistas guardadas por usuario
- Búsqueda textual de elementos
- Modo comparación (antes/después de intervención)
- Exportación de capturas 3D con anotaciones

**Entregables Fase 3**:
- ✅ Visor BIM con funcionalidades avanzadas
- ✅ 10 presas con modelos LOD progresivos
- ✅ Guías técnicas para creación de modelos BIM

### Fase 4: Escalado y Mantenimiento (Continuo) - 2025+

**Actividades continuas**:
- Incorporación de nuevas presas según disponibilidad de modelos
- Actualización de modelos tras intervenciones en presa
- Evolución de integraciones según nuevos módulos SIPRESAS
- Soporte a usuarios y resolución de incidencias
- Mejoras incrementales de performance

**Hitos futuros (largo plazo)**:
- 🔮 Realidad Aumentada (AR) para inspecciones de campo
- 🔮 Simulaciones de escenarios (avenidas, sismos)
- 🔮 Integración con drones para actualización de modelos
- 🔮 Gemelo digital en tiempo real con IoT

## 💰 Recursos y Presupuesto

### Recursos Humanos

**Equipo de desarrollo**:
- 1 Desarrollador Senior Full-Stack (líder técnico)
- 1 Desarrollador Frontend especializado en 3D/WebGL
- 0.5 Técnico BIM (consultoría)
- 0.5 UX/UI Designer

**Estimación esfuerzo**:
- Fase 1 (MVP): ~480 horas → 3 desarrolladores x 1 mes
- Fase 2 (Integraciones): ~640 horas → 3 desarrolladores x 1.3 meses
- Fase 3 (Avanzado): ~480 horas → 2 desarrolladores x 1.5 meses
- **Total**: ~1,600 horas de desarrollo

### Presupuesto Estimado

**Desarrollo**:
- Desarrollo software (1,600h x 60€/h): 96,000€
- Consultoría BIM (100h x 80€/h): 8,000€
- Diseño UX/UI (80h x 50€/h): 4,000€
- **Subtotal desarrollo**: 108,000€

**Infraestructura** (anual):
- Supabase Storage (500GB): 1,200€/año
- CDN CloudFlare Pro: 2,400€/año
- Herramientas de procesamiento (Blender, FME): 3,000€/año
- **Subtotal infraestructura**: 6,600€/año

**Servicios externos**:
- Créditos de digitalización (escaneo + modelos BIM): Presupuestado externamente por CHG
- Formación usuarios (2 sesiones): 2,000€

**Total estimado Fase 1-3**: ~116,600€ + 6,600€/año mantenimiento

### ROI y Justificación

**Beneficios tangibles**:
- Capitalización de inversión en digitalización BIM (modelos no quedan estáticos)
- Reducción de tiempo de consulta de documentación técnica (~30% ahorro)
- Mejora en planificación de inspecciones (visualización previa)
- Reducción de errores en localización de equipos

**Beneficios intangibles**:
- Mejora de imagen tecnológica de CHG
- Facilita formación de nuevo personal (navegación visual intuitiva)
- Base para futuros proyectos de innovación (AR, drones, IoT)

---

# PREPARACIÓN PARA BACKLOG

## 📝 Conversión a User Stories

Este documento técnico debe convertirse en **backlog de desarrollo** estructurado en **Épicas** y **User Stories** con formato:

### Plantilla de User Story

```markdown
| ID | User Story | Criterios de Aceptación | Campos/Reglas | Prioridad | Hito | Estimación |
|----|------------|------------------------|---------------|-----------|------|------------|
| **BIM-XXX** | **Como** [rol]<br>**Quiero** [funcionalidad]<br>**Para** [beneficio] | **Given** [contexto]<br>**When** [acción]<br>**Then** [resultado esperado] | **Tabla/Campos**: ...<br>**Lógica**: ...<br>**Validaciones**: ...<br>**Reglas**: ... | M/S/C | Hito X | XX SP |
```

## 🗂️ Estructura de Épicas Propuesta

### ÉPICA 1: INFRAESTRUCTURA BASE (Hito 1)
- BIM-001: Configurar storage BIM en Archivo Técnico
- BIM-002: Crear esquema de BD (tablas bim_modelos, bim_elementos, bim_vistas)
- BIM-003: Implementar RLS y políticas de acceso
- BIM-004: Crear página módulo BIM en menú SIPRESAS
- BIM-005: Integrar librería Three.js + IFC.js

**Estimación**: ~55 SP

### ÉPICA 2: VISOR 3D INTERACTIVO (Hito 1)
- BIM-006: Implementar controles de cámara (orbital, zoom, pan)
- BIM-007: Sistema de carga de modelos glTF/IFC
- BIM-008: Selector de capas (mostrar/ocultar elementos)
- BIM-009: Interacción con elementos (clic, hover, selección)
- BIM-010: Panel lateral de información contextual
- BIM-011: Barra de herramientas básica
- BIM-012: Modo de colores por tipo de elemento

**Estimación**: ~70 SP

### ÉPICA 3: INTEGRACIÓN MÓDULO INVENTARIO (Hito 1)
- BIM-013: Vincular elementos BIM con equipos Inventario
- BIM-014: Mostrar ficha de equipo en panel BIM
- BIM-015: Estados visuales según datos Inventario
- BIM-016: Navegación bidireccional BIM ↔ Inventario
- BIM-017: Acceso a documentación técnica desde BIM

**Estimación**: ~40 SP

### ÉPICA 4: INTEGRACIÓN MÓDULO MANTENIMIENTO (Hito 2)
- BIM-018: Obtener estado de última inspección
- BIM-019: Colores según resultado inspección
- BIM-020: Acceso a PDFs de partes de inspección
- BIM-021: Historial de inspecciones por equipo
- BIM-022: Automatización: PDF nuevo → actualiza BIM

**Estimación**: ~50 SP

### ÉPICA 5: INTEGRACIÓN MÓDULO EXPLOTACIÓN (Hito 2)
- BIM-023: Banner de estado global de presa
- BIM-024: Estado de órganos de desagüe (operatividad)
- BIM-025: Nivel de embalse dinámico (SAIH)
- BIM-026: Líneas de referencia (NME, resguardo)
- BIM-027: Visualización de caudales vertidos

**Estimación**: ~45 SP

### ÉPICA 6: INTEGRACIÓN MÓDULO AUSCULTACIÓN (Hito 2)
- BIM-028: Colores según evaluación de umbrales
- BIM-029: Alertas activas superpuestas
- BIM-030: Panel con lectura actual + gráfico histórico
- BIM-031: Animaciones para alertas
- BIM-032: Vectores de desplazamiento para desplazómetros

**Estimación**: ~55 SP

### ÉPICA 7: LOD DINÁMICO Y PERFORMANCE (Hito 3)
- BIM-033: Implementar carga progresiva LOD 100/200/300/400
- BIM-034: Streaming de modelos según zoom
- BIM-035: Optimización de mallas con Draco
- BIM-036: Compresión de texturas con KTX2
- BIM-037: Sistema de caché y CDN

**Estimación**: ~60 SP

### ÉPICA 8: HERRAMIENTAS DE ANÁLISIS (Hito 3)
- BIM-038: Herramienta de medición (distancias, áreas, ángulos)
- BIM-039: Planos de corte (secciones transversales)
- BIM-040: Modo wireframe y transparencias
- BIM-041: Tour automático pregrabado
- BIM-042: Captura de pantalla con anotaciones

**Estimación**: ~50 SP

### ÉPICA 9: GESTIÓN DE USUARIO (Hito 3)
- BIM-043: Vistas guardadas por usuario
- BIM-044: Búsqueda textual de elementos
- BIM-045: Modo comparación antes/después
- BIM-046: Configuración de preferencias de visor
- BIM-047: Tutorial interactivo integrado

**Estimación**: ~35 SP

### RESUMEN TOTAL

| Épica | Story Points | Hito | Prioridad |
|-------|--------------|------|-----------|
| ÉPICA 1: Infraestructura Base | 55 SP | Hito 1 | Must Have |
| ÉPICA 2: Visor 3D Interactivo | 70 SP | Hito 1 | Must Have |
| ÉPICA 3: Integración Inventario | 40 SP | Hito 1 | Must Have |
| ÉPICA 4: Integración Mantenimiento | 50 SP | Hito 2 | Must Have |
| ÉPICA 5: Integración Explotación | 45 SP | Hito 2 | Must Have |
| ÉPICA 6: Integración Auscultación | 55 SP | Hito 2 | Must Have |
| ÉPICA 7: LOD Dinámico | 60 SP | Hito 3 | Should Have |
| ÉPICA 8: Herramientas Análisis | 50 SP | Hito 3 | Should Have |
| ÉPICA 9: Gestión Usuario | 35 SP | Hito 3 | Should Have |
| **TOTAL MÓDULO BIM** | **460 SP** | **3 Hitos** | **~11 meses** |

---

## 🎯 Criterios de Priorización

### Must Have (Hitos 1-2) - 315 SP
Funcionalidades esenciales para MVP funcional:
- Visor 3D operativo con controles básicos
- Carga de modelos BIM optimizados
- Integraciones con módulos core (Inventario, Mantenimiento, Explotación, Auscultación)
- Estados visuales en tiempo real

### Should Have (Hito 3) - 145 SP
Funcionalidades que mejoran experiencia:
- Carga progresiva LOD para mejor performance
- Herramientas de medición y análisis
- Planos de corte y secciones
- Vistas guardadas y personalización

### Could Have (Futuro)
Funcionalidades aspiracionales:
- Realidad Aumentada para inspecciones
- Simulaciones de escenarios (avenidas, sismos)
- Integración con drones para actualización modelos
- Gemelo digital IoT en tiempo real

---

## 📋 Próximos Pasos Inmediatos

### 1. Validación de Especificación (Semana 1)
- [ ] Revisar este documento con stakeholders (Director TI, Jefe Seguridad Presas)
- [ ] Validar integraciones propuestas con responsables de módulos
- [ ] Aprobar stack tecnológico (Three.js + IFC.js)
- [ ] Confirmar presupuesto y recursos disponibles

### 2. Coordinación con Proveedores BIM (Semana 2)
- [ ] Reunión con empresa de escaneo láser
- [ ] Definir especificaciones de entregables:
  - Formatos de archivos (IFC, glTF, nubes de puntos)
  - Niveles de detalle (LOD 200 mínimo)
  - Sistema de coordenadas
  - Nomenclatura de elementos
- [ ] Establecer calendario de entregas por presa
- [ ] Seleccionar 1 presa piloto para Fase 1

### 3. Configuración de Entorno (Semana 3-4)
- [ ] Crear carpeta BIM en Supabase Storage
- [ ] Implementar tablas de BD (bim_modelos, bim_elementos)
- [ ] Configurar CDN para distribución de modelos
- [ ] Setup de herramientas de desarrollo (Three.js, Vite)

### 4. POC Técnico (Semana 5-6)
- [ ] Cargar modelo de prueba (puede ser ejemplo público)
- [ ] Implementar visor básico con controles
- [ ] Probar carga de IFC nativo vs glTF optimizado
- [ ] Medir performance (FPS, tiempo carga, memoria)
- [ ] Demo interna para validar approach

### 5. Desarrollo Fase 1 - MVP (Mes 2-4)
- [ ] Seguir roadmap de Sprints 1-6
- [ ] Reuniones semanales de seguimiento
- [ ] Testing continuo con usuarios piloto
- [ ] Ajustes según feedback

---

## 🤝 Stakeholders y Responsabilidades

| Rol | Responsabilidades | Contacto |
|-----|-------------------|----------|
| **Director TI CHG** | Aprobación de presupuesto, recursos, estrategia | - |
| **Jefe Seguridad de Presas** | Validación de funcionalidades técnicas, priorización | - |
| **Responsable SIPRESAS** | Coordinación con módulos existentes, integración | - |
| **Técnico BIM (Consultor)** | Asesoría en estándares BIM, procesamiento de modelos | - |
| **Proveedor Escaneo** | Entrega de modelos BIM según especificaciones | - |
| **Desarrolladores** | Implementación de módulo según backlog | - |
| **Usuarios Finales** | Testing, feedback, validación de usabilidad | Operarios, Inspectores, Director Explotación |

---

## 📚 Referencias y Estándares

### Estándares BIM
- **IFC (Industry Foundation Classes)**: ISO 16739-1:2018
- **LOD (Level of Development)**: BIMForum LOD Specification 2020
- **COBie (Construction Operations Building Information Exchange)**: Para metadatos de equipos

### Tecnologías Web 3D
- **Three.js**: https://threejs.org/ (Documentación oficial)
- **IFC.js**: https://ifcjs.github.io/info/ (Parser IFC en JavaScript)
- **glTF**: https://www.khronos.org/gltf/ (Formato estándar 3D web)
- **Draco**: https://google.github.io/draco/ (Compresión de mallas 3D)

### Best Practices
- **Web Performance**: Core Web Vitals (Google)
- **Accesibilidad**: WCAG 2.1 (AA compliance para interfaz)
- **Seguridad**: OWASP Top 10 para aplicaciones web

---

## 📝 Historial de Cambios

| Versión | Fecha | Autor | Cambios |
|---------|-------|-------|---------|
| 1.0 | 2026-01-28 | Sistema | Creación inicial de especificación completa |

---

## ✅ Checklist de Completitud

Este documento de especificación incluye:

- [x] Visión y objetivos del módulo BIM
- [x] Contexto y justificación estratégica
- [x] Arquitectura técnica (componentes, stack tecnológico)
- [x] Gestión de archivos y datos (estructura storage, modelo BD)
- [x] Catálogo completo de elementos del gemelo digital
- [x] Especificación de integraciones con 4 módulos existentes
- [x] Funcionalidades del visor 3D (controles, herramientas)
- [x] Consideraciones técnicas (performance, seguridad, compatibilidad)
- [x] Roadmap detallado con cronograma (Fase 1-3)
- [x] Presupuesto y recursos estimados
- [x] Preparación para conversión a backlog (épicas propuestas)
- [x] Próximos pasos inmediatos
- [x] Stakeholders y responsabilidades
- [x] Referencias y estándares aplicables

---

**Documento listo para:**
1. ✅ Presentación a stakeholders para aprobación
2. ✅ Coordinación con proveedores de digitalización BIM
3. ✅ Conversión a backlog detallado de desarrollo
4. ✅ Inicio de Fase 0: Análisis y Preparación

---

**FIN DE LA ESPECIFICACIÓN TÉCNICA DEL MÓDULO BIM**

---

**Contacto para consultas técnicas:** Equipo de Desarrollo SIPRESAS - CHG
**Fecha de próxima revisión:** Tras validación con stakeholders (Q1 2024)
