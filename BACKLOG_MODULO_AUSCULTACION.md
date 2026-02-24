# BACKLOG - Módulo Auscultación
## SIPRESAS - Sistema Integral de Presas

---

## 📋 Índice

1. [Visión General](#visión-general)
2. [Contexto e Integración DAMDATA](#contexto-e-integración-damdata)
3. [Épica 1: Integración con DAMDATA](#épica-1-integración-con-damdata)
4. [Épica 2: Motor de Evaluación de Umbrales](#épica-2-motor-de-evaluación-de-umbrales)
5. [Épica 3: Gestión de Alertas y Avisos](#épica-3-gestión-de-alertas-y-avisos)
6. [Épica 4: Integración con Módulos Explotación y Emergencias](#épica-4-integración-con-módulos-explotación-y-emergencias)
7. [Épica 5: Visualización y Análisis](#épica-5-visualización-y-análisis)
8. [Matriz de Dependencias](#matriz-de-dependencias)
9. [Estimación y Priorización](#estimación-y-priorización)

---

# VISIÓN GENERAL

## 🎯 Objetivo del Módulo

El Módulo de Auscultación complementa la herramienta DAMDATA, agregando capacidades de:
- **Monitoreo automatizado** de umbrales de seguridad
- **Evaluación de indicadores** según Normas de Explotación (NEX) revisadas
- **Activación automática** de protocolos de seguridad
- **Integración** con módulos de Explotación y Plan de Emergencia

## 🔄 Arquitectura de Integración

```
┌─────────────┐         ┌──────────────┐         ┌─────────────┐
│   DAMDATA   │────────▶│  SIPRESAS    │────────▶│   Módulo    │
│  (Externo)  │         │ Auscultación │         │ Explotación │
└─────────────┘         └──────────────┘         └─────────────┘
      │                        │                         │
      │                        ▼                         │
      │                 ┌──────────────┐                 │
      │                 │ Motor        │                 │
      │                 │ Evaluación   │                 │
      │                 │ Umbrales     │                 │
      │                 └──────────────┘                 │
      │                        │                         │
      │                        ▼                         ▼
      │                 ┌──────────────┐         ┌─────────────┐
      └────────────────▶│    SAIH      │         │   Módulo    │
                        │ (Nivel NE)   │         │ Emergencias │
                        └──────────────┘         └─────────────┘
```

---

# CONTEXTO E INTEGRACIÓN DAMDATA

## Situación Actual

**DAMDATA** es la aplicación propietaria que gestiona:
- Registro de lecturas de instrumentación
- Almacenamiento de datos históricos de auscultación
- Análisis de comportamiento estructural
- Generación de informes técnicos

## Limitaciones Identificadas

- **Sistema cerrado**: Funcionalidades limitadas por desarrollador externo
- **Sin alertas automatizadas**: No notifica al Director de Explotación
- **Sin integración**: No comunica con otros sistemas de CHG
- **Umbrales pasivos**: Configurados pero sin acción automática

## Estrategia de Integración

SIPRESAS NO reemplaza DAMDATA, sino que:
1. **Extrae datos** de variables críticas con umbrales definidos
2. **Evalúa automáticamente** expresiones matemáticas de seguridad
3. **Genera alertas** cuando se superan umbrales
4. **Activa protocolos** en módulos Explotación y Emergencias
5. **Registra eventos** para trazabilidad y auditoría

---

# ÉPICA 1: INTEGRACIÓN CON DAMDATA

## 🎯 Objetivo
Establecer comunicación bidireccional con DAMDATA para obtener lecturas de variables de auscultación y metadatos de instrumentación.

---

## Feature 1.1: Conexión con DAMDATA

| ID | User Story | Criterios de Aceptación | Campos/Reglas | Prioridad | Hito | Estimación |
|----|------------|------------------------|---------------|-----------|------|------------|
| **AUS-001** | **Como** administrador técnico<br>**Quiero** configurar conexión con DAMDATA<br>**Para** obtener datos de auscultación automáticamente | **Given** credenciales de acceso a DAMDATA<br>**When** configura conexión en SIPRESAS<br>**Then** sistema valida conectividad, muestra presas disponibles, estado de conexión en dashboard<br><br>**Given** conexión establecida<br>**When** solicita test de conexión<br>**Then** obtiene muestra de datos reales y valida formato | **Tabla**: `auscultacion_config_damdata`<br>**Campos**: id, endpoint_url, api_key (encriptada), tipo_conexión (api/base_de_datos/webservice), versión_damdata, frecuencia_sincronización_minutos, última_sincronización, estado (activa/error/deshabilitada), notas_conexión<br>**Validación**: Timeout 30s, retry automático 3 veces, log de intentos fallidos<br>**Seguridad**: API key encriptada en BD, rotate cada 90 días, IP whitelist si disponible<br>**Reglas**: Una configuración activa por entorno (producción/test), test de conexión antes de activar | M | Hito 1 | 13 SP |
| **AUS-002** | **Como** sistema<br>**Quiero** sincronizar catálogo de instrumentos desde DAMDATA<br>**Para** conocer qué variables están disponibles para monitoreo | **Given** conexión DAMDATA activa<br>**When** ejecuta sincronización de catálogo<br>**Then** importa: presas, instrumentos (tipo, código, ubicación), variables medidas, unidades, rangos válidos<br><br>**Given** catálogo sincronizado<br>**When** hay cambios en DAMDATA<br>**Then** sincronización incremental actualiza solo diferencias | **Tabla**: `auscultacion_instrumentos`<br>**Campos**: id, presa_id (FK), código_damdata (único), tipo_instrumento (piezómetro/aforador/desplazómetro/acelerómetro/termómetro/inclinómetro), nombre, ubicación_descripción, coordenadas_x_y_z, variable_medida (caudal_filtración/presión_intersticial/desplazamiento/temperatura/aceleración), unidad_medida, rango_válido_min, rango_válido_max, activo (boolean), fecha_instalación, última_lectura_fecha<br>**Sincronización**: Cron job cada 6 horas, compara por código_damdata, marca como inactivos si eliminados en DAMDATA<br>**Validaciones**: Código único, rango min < max, unidad válida según tipo variable<br>**Reglas**: Conserva histórico (soft delete), log de cambios de configuración | M | Hito 1 | 13 SP |
| **AUS-003** | **Como** sistema<br>**Quiero** extraer lecturas de variables con umbrales definidos<br>**Para** evaluarlas contra criterios de seguridad | **Given** instrumentos con umbrales configurados en SIPRESAS<br>**When** ejecuta extracción de lecturas<br>**Then** obtiene de DAMDATA: timestamp, valor, estado_validación (validado/sospechoso/erróneo), observaciones<br><br>**Given** lectura fuera de rango válido<br>**When** procesa lectura<br>**Then** marca como "sospechosa", no evalúa umbral, alerta a técnico | **Tabla**: `auscultacion_lecturas`<br>**Campos**: id, instrumento_id (FK), fecha_hora_lectura, valor, unidad, origen (damdata_auto/manual/estimado), estado_validación (validado/sospechoso/erróneo/pendiente_revisión), validado_por_id (FK nullable), fecha_validación, observaciones, evaluación_umbral_realizada (boolean), sincronización_id (FK)<br>**Extracción**: Query a DAMDATA con filtro:<br>```sql<br>SELECT timestamp, valor, instrumento_id <br>FROM damdata.lecturas <br>WHERE instrumento_id IN (SELECT código_damdata FROM instrumentos_con_umbrales)<br>AND timestamp > última_extracción<br>ORDER BY timestamp ASC<br>```<br>**Frecuencia**: Cada 1 hora (configurable según criticidad)<br>**Validaciones**: Valor entre rango_válido_min/max, timestamp no futuro, no duplicados<br>**Reglas**: Lecturas sospechosas/erróneas no se evalúan, requieren validación manual, notifica a técnico responsable | M | Hito 1 | 13 SP |

---

## Feature 1.2: Gestión de Variables de Contexto

| ID | User Story | Criterios de Aceptación | Campos/Reglas | Prioridad | Hito | Estimación |
|----|------------|------------------------|---------------|-----------|------|------------|
| **AUS-004** | **Como** sistema<br>**Quiero** obtener nivel de embalse (NE) desde SAIH o DAMDATA<br>**Para** usarlo en fórmulas de evaluación de umbrales | **Given** fórmula de umbral requiere variable NE (nivel embalse)<br>**When** evalúa umbral<br>**Then** intenta obtener NE de SAIH (prioritario), si falla obtiene de DAMDATA, si ambos fallan usa último valor disponible con advertencia<br><br>**Given** NE obtenido de fallback<br>**When** evalúa umbral<br>**Then** marca evaluación como "con_advertencia", incluye nota de origen de datos | **Tabla**: `auscultacion_variables_contexto`<br>**Campos**: id, presa_id (FK), variable (nivel_embalse/temperatura_ambiente/presión_atmosférica/caudal_turbinado), valor, unidad, timestamp, origen (saih/damdata/estación_meteo/manual), confiabilidad (alta/media/baja), usado_en_evaluación_id (FK nullable a evaluaciones)<br>**Lógica de obtención NE**:<br>1. Query a SAIH: `SELECT nivel_actual FROM saih.embalses WHERE presa_id = X`<br>2. Si timeout/error → Query a DAMDATA: `SELECT valor FROM damdata.nivel_embalse WHERE presa_id = X ORDER BY timestamp DESC LIMIT 1`<br>3. Si ambos fallan → Query a `auscultacion_variables_contexto` último valor < 24h<br>4. Si >24h → Error "Variable contexto no disponible", suspende evaluación, alerta<br>**Caché**: Valores válidos 15 min, evita queries redundantes<br>**Reglas**: Prioridad SAIH > DAMDATA > Caché > Manual, log de origen usado en cada evaluación | M | Hito 1 | 8 SP |
| **AUS-005** | **Como** técnico de auscultación<br>**Quiero** ingresar manualmente valores de contexto si fallan fuentes automáticas<br>**Para** no detener evaluaciones críticas | **Given** SAIH y DAMDATA no disponibles<br>**When** accede a "Variables Contexto Manual"<br>**Then** puede ingresar: presa, variable (NE/temperatura), valor, timestamp, observaciones<br><br>**Given** valor manual ingresado<br>**When** sistema evalúa umbrales<br>**Then** usa valor manual, marca evaluaciones con badge "Datos Manuales" | **Interfaz**: Formulario rápido con campos: Presa (dropdown), Variable (dropdown: Nivel Embalse/Temperatura Ambiente), Valor (numérico), Timestamp (datetime, default NOW), Observaciones (text, ej: "SAIH fuera de servicio")<br>**Validaciones**: Valor en rango razonable según presa (NMN-NME para NE), timestamp no futuro, no más antiguo que última lectura + 1 hora<br>**Visualización**: Badge amarillo "📝 Modo Manual" en dashboard mientras hay variables manuales activas<br>**Expiración**: Valores manuales válidos 6 horas, luego requieren renovación o retorno a fuentes automáticas<br>**Reglas**: Solo usuarios con rol "técnico_auscultación" o superior, auditoría completa, notifica a supervisor cuando se usa modo manual | M | Hito 1 | 5 SP |

---

# ÉPICA 2: MOTOR DE EVALUACIÓN DE UMBRALES

## 🎯 Objetivo
Implementar sistema configurable de umbrales con expresiones matemáticas que evalúan automáticamente condiciones de Situación Extraordinaria y Escenarios de Emergencia.

---

## Feature 2.1: Configuración de Umbrales

| ID | User Story | Criterios de Aceptación | Campos/Reglas | Prioridad | Hito | Estimación |
|----|------------|------------------------|---------------|-----------|------|------------|
| **AUS-006** | **Como** administrador técnico<br>**Quiero** configurar umbrales de seguridad por instrumento<br>**Para** automatizar detección de situaciones anómalas | **Given** instrumento importado de DAMDATA<br>**When** accede a "Configurar Umbrales"<br>**Then** puede crear múltiples umbrales: nombre, resultado (situación_extraordinaria/escenario_0/escenario_1), expresión_matemática, descripción<br><br>**Given** umbral guardado<br>**When** valida configuración<br>**Then** sistema verifica sintaxis de expresión, identifica variables requeridas, simula evaluación con datos históricos | **Tabla**: `auscultacion_umbrales`<br>**Campos**: id, instrumento_id (FK), nombre_umbral, tipo_resultado (situación_extraordinaria/escenario_0_pep/escenario_1_pep), expresión_matemática (text), variables_requeridas (JSON array: `["NE", "Q"]`), descripción_técnica (text), referencia_nex (texto referencia a NEX), activo (boolean), fecha_creación, creado_por_id (FK), fecha_última_modificación, versión<br>**Ejemplo expresión** (según imagen proporcionada):<br>```<br>Q > 4e-13 * EXP(0.0563 * NE) + 58.49<br>```<br>Donde:<br>- Q = Caudal de filtración (lts/min) [variable medida]<br>- NE = Nivel de Embalse (m) [variable contexto]<br>- EXP = Función exponencial<br>**Parser**: Soporta operadores: +, -, *, /, ^, funciones: EXP, LOG, SQRT, ABS, SIN, COS, constantes numéricas, paréntesis<br>**Validaciones**: Sintaxis válida, variables en mayúsculas, función TEST con últimos 10 valores muestra resultado<br>**Reglas**: Versionado de umbrales (conserva histórico), un umbral puede tener múltiples resultados (ej: Extraordinaria + Escenario 0) | M | Hito 2 | 13 SP |
| **AUS-007** | **Como** administrador técnico<br>**Quiero** definir umbrales con múltiples condiciones<br>**Para** modelar criterios complejos de seguridad | **Given** criterio de seguridad con múltiples variables<br>**When** configura umbral<br>**Then** puede usar operadores lógicos: AND, OR, NOT, comparaciones: >, <, >=, <=, ==, !=<br><br>**Given** expresión con condiciones múltiples<br>**When** evalúa<br>**Then** sistema procesa lógica booleana correctamente, registra qué condiciones se cumplieron | **Ejemplo expresión compleja**:<br>```<br>(Q > 4e-13 * EXP(0.0563 * NE) + 58.49) AND (DELTA_Q_7D > 10)<br>```<br>Donde:<br>- Q = Caudal actual<br>- NE = Nivel embalse<br>- DELTA_Q_7D = Incremento de caudal respecto a media de últimos 7 días<br>**Variables derivadas**: Sistema puede calcular:<br>- DELTA_{VAR}_{PERIODO}: Incremento respecto a periodo (1D, 7D, 30D)<br>- MEDIA_{VAR}_{PERIODO}: Media de variable en periodo<br>- MAX_{VAR}_{PERIODO}: Máximo en periodo<br>- TENDENCIA_{VAR}: Derivada (creciente/decreciente/estable)<br>**Parser avanzado**: Evalúa expresiones anidadas, precedencia de operadores, short-circuit en AND/OR<br>**Interfaz**: Editor con syntax highlighting, autocompletado de variables, preview de evaluación con datos reales<br>**Reglas**: Máximo 5 condiciones por expresión (complejidad), timeout 5s por evaluación (evitar bucles), log de expresiones que fallan | M | Hito 2 | 13 SP |
| **AUS-008** | **Como** administrador técnico<br>**Quiero** importar umbrales desde plantillas NEX<br>**Para** acelerar configuración de presas similares | **Given** plantilla de umbrales según tipo de presa<br>**When** selecciona "Importar Plantilla NEX"<br>**Then** carga umbrales estándar para tipo de presa (gravedad/arco/tierra), permite revisar antes de aplicar<br><br>**Given** plantilla importada<br>**When** aplica a presa<br>**Then** crea umbrales vinculados a instrumentos correspondientes, ajusta constantes según características específicas | **Tabla**: `auscultacion_plantillas_umbrales`<br>**Campos**: id, nombre_plantilla, tipo_presa (gravedad/arco/materiales_sueltos), tipo_instrumento (aforador/piezómetro), descripción, umbrales_json (JSON array de umbrales con expresiones), versión_nex, fecha_creación, autor<br>**JSON ejemplo**:<br>```json<br>{<br>  "nombre": "Filtraciones - Presa Gravedad",<br>  "umbrales": [<br>    {<br>      "nombre": "Filtración Extraordinaria",<br>      "tipo": "situación_extraordinaria",<br>      "expresión": "Q > A * EXP(B * NE) + C",<br>      "parámetros": {"A": 4e-13, "B": 0.0563, "C": 58.49}<br>    },<br>    {<br>      "nombre": "Filtración Escenario 0",<br>      "tipo": "escenario_0_pep",<br>      "expresión": "Q > A * EXP(B * NE) + C",<br>      "parámetros": {"A": 4e-13, "B": 0.0563, "C": 116.98}<br>    }<br>  ]<br>}<br>```<br>**Interfaz**: Catálogo de plantillas, preview antes de importar, mapeo manual de instrumentos (ej: "Aforador Principal" → "AF-01")<br>**Ajuste parámetros**: Modal permite modificar constantes A, B, C según características presa antes de guardar<br>**Reglas**: Plantillas aprobadas por Servicio de Seguridad, versionadas según revisiones NEX | S | Hito 2 | 8 SP |

---

## Feature 2.2: Evaluación Automática

| ID | User Story | Criterios de Aceptación | Campos/Reglas | Prioridad | Hito | Estimación |
|----|------------|------------------------|---------------|-----------|------|------------|
| **AUS-009** | **Como** sistema<br>**Quiero** evaluar automáticamente umbrales al recibir nuevas lecturas<br>**Para** detectar inmediatamente superaciones críticas | **Given** nueva lectura sincronizada desde DAMDATA<br>**When** lectura es validada<br>**Then** sistema evalúa todos los umbrales asociados al instrumento, registra resultado, genera alertas si superación<br><br>**Given** umbral superado<br>**When** evalúa<br>**Then** registra: timestamp, valores variables, resultado expresión (true/false), tipo resultado alcanzado, tiempo procesamiento | **Tabla**: `auscultacion_evaluaciones`<br>**Campos**: id, umbral_id (FK), lectura_id (FK), fecha_hora_evaluación, expresión_evaluada (text con valores sustituidos), valores_variables (JSON: `{"Q": 85.3, "NE": 602.5}`), resultado_expresión (boolean), tipo_resultado_alcanzado (nullable: situación_extraordinaria/escenario_0/escenario_1), tiempo_procesamiento_ms, origen_variables (JSON: `{"Q": "damdata", "NE": "saih"}`), advertencias (JSON array si origen no óptimo)<br>**Trigger**: Al INSERT en `auscultacion_lecturas` WHERE estado_validación = 'validado' → ejecuta Edge Function `evaluar-umbrales`<br>**Lógica evaluación**:<br>1. Obtiene umbrales activos del instrumento<br>2. Para cada umbral:<br>   a. Obtiene variables requeridas (lectura + contexto)<br>   b. Sustituye en expresión matemática<br>   c. Evalúa expresión<br>   d. Si TRUE → registra evaluación positiva + genera alerta<br>   e. Si FALSE → solo registra evaluación (sin alerta)<br>**Performance**: Timeout 5s por umbral, evaluaciones en paralelo si múltiples umbrales, caché de variables contexto<br>**Reglas**: Solo evalúa lecturas validadas, suspende evaluación si variables contexto >6h antiguas, reintenta 3 veces si error transitorio | M | Hito 2 | 13 SP |
| **AUS-010** | **Como** sistema<br>**Quiero** reevaluar umbrales periódicamente aunque no haya nuevas lecturas<br>**Para** detectar situaciones donde variables de contexto (NE) cambian sin nueva lectura | **Given** instrumento sin lecturas recientes pero NE variable<br>**When** cron ejecuta reevaluación periódica (cada 1 hora)<br>**Then** obtiene última lectura validada + variables contexto actuales, reevalúa umbrales, alerta si ahora se supera<br><br>**Given** situación donde Q = constante pero NE aumenta<br>**When** reevalúa<br>**Then** expresión `Q > f(NE)` puede cambiar de FALSE a TRUE por incremento NE | **Cron Job**: Cada 1 hora<br>**Query**:<br>```sql<br>SELECT l.* FROM auscultacion_lecturas l<br>JOIN auscultacion_instrumentos i ON l.instrumento_id = i.id<br>WHERE l.id IN (<br>  SELECT MAX(id) FROM auscultacion_lecturas <br>  WHERE estado_validación = 'validado'<br>  GROUP BY instrumento_id<br>)<br>AND EXISTS (<br>  SELECT 1 FROM auscultacion_umbrales u <br>  WHERE u.instrumento_id = i.id AND u.activo = true<br>)<br>```<br>**Lógica**: Usa última lectura + variables contexto ACTUALES (no históricas), compara resultado con última evaluación, si cambió de FALSE a TRUE → alerta<br>**Optimización**: Solo reevalúa instrumentos con umbrales que dependen de variables contexto variables (NE, Temperatura), no reevalúa umbrales con solo constantes<br>**Reglas**: Marca evaluaciones periódicas con flag `evaluación_programada = true`, no genera spam (máx 1 alerta cada 4h por mismo umbral si situación persiste) | M | Hito 2 | 8 SP |
| **AUS-011** | **Como** técnico de auscultación<br>**Quiero** ejecutar evaluaciones manuales bajo demanda<br>**Para** validar configuración de umbrales o analizar escenarios hipotéticos | **Given** umbral configurado<br>**When** hace clic en "Evaluar Ahora"<br>**Then** sistema ejecuta evaluación con últimos datos disponibles, muestra resultado detallado: valores usados, pasos de cálculo, resultado final<br><br>**Given** modo "Simulación"<br>**When** ingresa valores hipotéticos (Q = 90, NE = 605)<br>**Then** evalúa umbral con esos valores, muestra resultado SIN generar alertas ni registros oficiales | **Interfaz**: Botón "🔍 Evaluar Ahora" en detalle de umbral<br>**Modal resultado**:<br>```<br>Evaluación Manual - Umbral: Filtración Extraordinaria<br>Fecha: 2024-01-15 10:30:00<br><br>Variables:<br>- Q (Caudal Filtración): 85.3 lts/min [DAMDATA - 2024-01-15 09:45]<br>- NE (Nivel Embalse): 602.5 m [SAIH - 2024-01-15 10:28]<br><br>Expresión:<br>Q > 4e-13 * EXP(0.0563 * NE) + 58.49<br>85.3 > 4e-13 * EXP(0.0563 * 602.5) + 58.49<br>85.3 > 82.7<br><br>Resultado: ✅ UMBRAL SUPERADO → Situación Extraordinaria<br>```<br>**Modo Simulación**: Toggle "Modo Simulación", habilita inputs para sobreescribir valores de variables, evaluación NO se registra en BD, banner "⚠️ SIMULACIÓN - No genera alertas"<br>**Reglas**: Evaluaciones manuales se registran con flag `manual = true`, útiles para auditoría y validación configuración | S | Hito 2 | 5 SP |

---

# ÉPICA 3: GESTIÓN DE ALERTAS Y AVISOS

## 🎯 Objetivo
Notificar oportunamente al Director de Explotación y equipo técnico sobre superaciones de umbrales, con información contextual para toma de decisiones.

---

## Feature 3.1: Generación de Alertas

| ID | User Story | Criterios de Aceptación | Campos/Reglas | Prioridad | Hito | Estimación |
|----|------------|------------------------|---------------|-----------|------|------------|
| **AUS-012** | **Como** sistema<br>**Quiero** generar alertas automáticas al superar umbrales<br>**Para** notificar inmediatamente situaciones críticas | **Given** evaluación de umbral resulta TRUE (superación)<br>**When** sistema procesa resultado<br>**Then** crea alerta con: presa, instrumento, umbral superado, valores actuales, tipo resultado (Extraordinaria/Escenario 0/1), timestamp, recomendaciones NEX<br><br>**Given** alerta generada<br>**When** persiste en BD<br>**Then** trigger envía notificaciones, actualiza dashboard, registra en log de eventos | **Tabla**: `auscultacion_alertas`<br>**Campos**: id, evaluación_id (FK), presa_id (FK), instrumento_id (FK), umbral_id (FK), tipo_resultado (situación_extraordinaria/escenario_0_pep/escenario_1_pep), fecha_hora_alerta, valores_variables_texto (ej: "Q=85.3 lts/min, NE=602.5 m"), descripción_alerta, recomendaciones_nex (text), criticidad (media/alta/crítica), estado (activa/reconocida/resuelta), reconocida_por_id (FK nullable), fecha_reconocimiento, notas_resolución, resuelta_por_id (FK nullable), fecha_resolución<br>**Criticidad**:<br>- Media: Situación Extraordinaria sin escenario PEP<br>- Alta: Escenario 0 PEP<br>- Crítica: Escenario 1 PEP<br>**Recomendaciones NEX**: Texto prellenado según tipo resultado:<br>- Extraordinaria: "Inspección visual urgente. Intensificar lecturas. Analizar tendencia histórica."<br>- Escenario 0: "Activar protocolo Plan de Emergencia. Notificar Protección Civil. Evaluar evolución cada 2 horas."<br>- Escenario 1: "Movilizar Comité Permanente. Inspección técnica inmediata. Evaluar medidas extraordinarias."<br>**Reglas**: Una alerta por evaluación positiva, no duplica alertas idénticas en última hora (deduplicación) | M | Hito 3 | 13 SP |
| **AUS-013** | **Como** Director de Explotación<br>**Quiero** recibir notificaciones inmediatas de alertas críticas<br>**Para** tomar decisiones operativas urgentes | **Given** alerta de criticidad Alta o Crítica generada<br>**When** sistema procesa alerta<br>**Then** envía notificaciones: Email + SMS (opcional) + Push en app, con resumen ejecutivo y link directo<br><br>**Given** múltiples alertas en corto periodo<br>**When** genera notificaciones<br>**Then** agrupa en un solo mensaje si misma presa y <15 min diferencia | **Notificaciones**:<br>**Email**: Asunto según criticidad<br>```<br>🚨 [CRÍTICO] Alerta Auscultación - Presa [Nombre] - Escenario 1 PEP<br>⚠️ [ALTA] Alerta Auscultación - Presa [Nombre] - Escenario 0 PEP<br>ℹ️ [MEDIA] Alerta Auscultación - Presa [Nombre] - Situación Extraordinaria<br>```<br>**Contenido**:<br>- Presa e instrumento afectado<br>- Tipo de umbral superado<br>- Valores actuales vs valores umbral<br>- Gráfico de evolución (últimos 7 días)<br>- Recomendaciones según NEX<br>- Botones: "Ver Detalle" "Reconocer Alerta" "Contactar Equipo"<br>**SMS** (solo Alta/Crítica):<br>```<br>SIPRESAS ALERTA: [Presa] - [Tipo resultado] por [Variable]. Ver detalle: [URL corta]<br>```<br>**Push**: Notificación en app móvil con sonido diferenciado por criticidad<br>**Destinatarios**:<br>- Criticidad Media: Director Explotación + Jefe Auscultación<br>- Alta: + Jefe Seguridad Presas<br>- Crítica: + Director Organismo Cuenca + Guardia 24/7<br>**Reglas**: Confirmación de recepción requerida para Crítica (si no respuesta en 15 min → escalar a backup), no envía entre 23h-7h si criticidad Media (salvo configuración específica) | M | Hito 3 | 13 SP |
| **AUS-014** | **Como** Director de Explotación<br>**Quiero** reconocer alertas recibidas<br>**Para** confirmar que estoy gestionando la situación | **Given** alerta activa recibida<br>**When** hace clic en "Reconocer Alerta" desde email o dashboard<br>**Then** estado cambia a "reconocida", registra quién y cuándo, notifica a equipo que Director está al tanto<br><br>**Given** alerta reconocida<br>**When** situación se resuelve<br>**Then** puede marcar como "resuelta" con notas explicativas, genera registro de cierre | **Interfaz**: <br>- Email: Botón "Reconocer" que abre web con formulario<br>- Dashboard: Badge "⚠️ Sin Reconocer" en alertas activas, botón destacado "Reconocer"<br>- App móvil: Acción rápida en notificación<br>**Formulario reconocimiento**: <br>- Timestamp automático<br>- Usuario automático (quien reconoce)<br>- Notas iniciales (opcional, ej: "Revisando datos históricos")<br>- Checkbox "Notificar al equipo técnico"<br>**Resolución**: <br>- Botón "Resolver Alerta" solo si reconocida previamente<br>- Requiere notas de resolución (min 30 chars, ej: "Lectura puntual por evento transitorio. Valores retornaron a normalidad.")<br>- Estado → resuelta<br>- Alerta desaparece de lista activas, pasa a histórico<br>**Auditoría**: Log completo de cambios de estado con timestamps, emails de confirmación a participantes<br>**Reglas**: Solo Director Explotación, Jefe Seguridad o Admin pueden reconocer/resolver, alertas sin reconocer >2h generan recordatorio automático | M | Hito 3 | 8 SP |

---

## Feature 3.2: Dashboard de Monitoreo

| ID | User Story | Criterios de Aceptación | Campos/Reglas | Prioridad | Hito | Estimación |
|----|------------|------------------------|---------------|-----------|------|------------|
| **AUS-015** | **Como** operario de auscultación<br>**Quiero** visualizar dashboard de alertas activas<br>**Para** tener visión global del estado de auscultación | **Given** acceso a módulo Auscultación<br>**When** entra en dashboard<br>**Then** visualiza: alertas activas (agrupadas por presa y criticidad), instrumentos en umbral, evolución últimas 24h, próximas lecturas pendientes<br><br>**Given** múltiples alertas activas<br>**When** ordena por criticidad<br>**Then** Críticas primero, luego Altas, luego Medias, dentro de cada grupo por antigüedad | **Dashboard Widgets**:<br><br>1. **Alertas Activas**: Tarjetas con colores según criticidad<br>   - Roja: Crítica (Escenario 1)<br>   - Naranja: Alta (Escenario 0)<br>   - Amarilla: Media (Extraordinaria)<br>   - Badges: "Sin Reconocer", "Reconocida", tiempo transcurrido<br><br>2. **Instrumentos en Umbral**: Listado con semáforo<br>   - 🔴 Superando umbral crítico<br>   - 🟡 Próximo a umbral (>80% del valor umbral)<br>   - 🟢 Normal<br><br>3. **Gráfico Evolución**: Línea temporal últimas 24h mostrando valores medidos vs umbrales<br><br>4. **Próximas Acciones**: Lecturas programadas pendientes, inspecciones derivadas de alertas<br><br>**Filtros**: Por presa, tipo instrumento, criticidad, estado alerta, rango fechas<br>**Actualización**: Auto-refresh cada 5 min, indicador "Última actualización: hace 3 min"<br>**Acciones rápidas**: Desde tarjeta alerta → Ver Detalle, Reconocer, Ver Histórico Instrumento, Descargar Informe<br>**Reglas**: Dashboard personalizable por rol (Director ve resumen ejecutivo, Técnico ve detalle técnico) | M | Hito 3 | 13 SP |
| **AUS-016** | **Como** técnico<br>**Quiero** visualizar histórico de alertas<br>**Para** analizar patrones y frecuencia de superaciones | **Given** acceso a módulo Auscultación<br>**When** accede a "Histórico de Alertas"<br>**Then** tabla con: fecha, presa, instrumento, umbral, tipo resultado, valores, estado final, tiempo de resolución<br><br>**Given** filtros aplicados<br>**When** filtra por instrumento específico<br>**Then** visualiza series temporales de alertas, identifica patrones estacionales o tendencias | **Interfaz**: Tabla con paginación, ordenación por columnas, exportar a Excel/PDF<br>**Filtros avanzados**:<br>- Presa (multi-selección)<br>- Tipo instrumento (aforador/piezómetro/etc)<br>- Tipo resultado (Extraordinaria/Escenario 0/1)<br>- Rango fechas<br>- Estado (activa/reconocida/resuelta)<br>- Reconocida por (usuario)<br>**Análisis**:<br>- Gráfico barras: Alertas por mes/año<br>- Gráfico pastel: Distribución por tipo resultado<br>- Tabla: Top 10 instrumentos con más alertas<br>- Estadísticas: Tiempo promedio reconocimiento, tiempo promedio resolución<br>**Exportación**: CSV con todos los datos, PDF con gráficos para informes<br>**Reglas**: Histórico sin límite temporal (retención permanente para auditoría), datos anonimizados en exports si no es admin | S | Hito 3 | 8 SP |

---

# ÉPICA 4: INTEGRACIÓN CON MÓDULOS EXPLOTACIÓN Y EMERGENCIAS

## 🎯 Objetivo
Automatizar activación de protocolos operacionales y de emergencia cuando auscultación detecta situaciones críticas.

---

## Feature 4.1: Integración Módulo Explotación

| ID | User Story | Criterios de Aceptación | Campos/Reglas | Prioridad | Hito | Estimación |
|----|------------|------------------------|---------------|-----------|------|------------|
| **AUS-017** | **Como** sistema<br>**Quiero** declarar Situación Extraordinaria en módulo Explotación<br>**Para** activar protocolo operacional según NEX | **Given** alerta de tipo "situación_extraordinaria" generada<br>**When** sistema procesa alerta<br>**Then** notifica a módulo Explotación, crea propuesta de declaración automática con: causa (auscultación), indicador superado, datos soporte<br><br>**Given** propuesta de declaración en Explotación<br>**When** Director accede<br>**Then** puede confirmar o descartar declaración con justificación | **Integración**: Tabla compartida `presas_estado_actual` (ya existe de otros módulos)<br>**Actualización**:<br>```sql<br>UPDATE presas_estado_actual<br>SET estado_explotación = 'extraordinaria_propuesta',<br>    causa = 'auscultación',<br>    indicador_auscultación_id = [alerta_id],<br>    fecha_propuesta = NOW(),<br>    requiere_validación = true<br>WHERE presa_id = [X]<br>```<br>**Notificación a Explotación**: Edge Function `notificar-modulo-explotacion`<br>```json<br>{<br>  "presa_id": 123,<br>  "tipo_evento": "situación_extraordinaria",<br>  "origen": "auscultación",<br>  "alerta_id": 456,<br>  "descripción": "Caudal de filtración en aforador AF-01 supera umbral extraordinario",<br>  "valores": {"Q": 85.3, "NE": 602.5, "umbral": 82.7},<br>  "recomendaciones": "Inspección visual urgente..."<br>}<br>```<br>**Visualización en Explotación**: Widget "⚠️ Propuesta desde Auscultación" en dashboard, con botones "Confirmar Declaración" "Descartar"<br>**Reglas**: Propuesta válida 4 horas, si no acción → recordatorio, si descartada → requiere justificación que se registra en alerta de auscultación | M | Hito 4 | 13 SP |

---

## Feature 4.2: Integración Módulo Plan de Emergencia

| ID | User Story | Criterios de Aceptación | Campos/Reglas | Prioridad | Hito | Estimación |
|----|------------|------------------------|---------------|-----------|------|------------|
| **AUS-018** | **Como** sistema<br>**Quiero** activar Escenario 0 del Plan de Emergencia automáticamente<br>**Para** iniciar protocolo de emergencia según PEP | **Given** alerta de tipo "escenario_0_pep" generada<br>**When** sistema procesa alerta<br>**Then** notifica a módulo Plan de Emergencia, crea declaración automática de Escenario 0 con causa "Indicador Auscultación", precarga datos técnicos<br><br>**Given** declaración en módulo Emergencias<br>**When** Director revisa<br>**Then** puede confirmar activación (inicia protocolo PEP) o desactivar si falsa alarma | **Integración**: POST a módulo Plan de Emergencia<br>```json<br>{<br>  "presa_id": 123,<br>  "escenario": 0,<br>  "causa": "auscultación",<br>  "indicador_tipo": "filtración",<br>  "alerta_id": 456,<br>  "instrumento": "Aforador AF-01",<br>  "umbral_superado": "Filtración Escenario 0",<br>  "valores_actuales": {"Q": 120.5, "NE": 603.2},<br>  "origen_automatico": true,<br>  "requiere_confirmación": true<br>}<br>```<br>**Tabla compartida**: `emergencias_declaraciones` recibe INSERT automático<br>**Workflow en PEP**:<br>1. Crea declaración estado "propuesta_automática"<br>2. Notifica Director Plan Emergencia + Director Explotación<br>3. Precarga datos: presa, causa, valores técnicos<br>4. Espera confirmación humana (timeout 30 min → escalar)<br>5. Si confirmado → estado = "activo", inicia protocolo Escenario 0<br>6. Si descartado → estado = "descartado", requiere justificación<br>**Notificaciones críticas**: Email + SMS a lista de emergencia, llamada telefónica automática opcional<br>**Reglas**: Activación automática de Escenario 0 requiere confirmación (no es totalmente automática), Escenario 1 también propuesto pero con criticidad mayor | M | Hito 4 | 13 SP |
| **AUS-019** | **Como** sistema<br>**Quiero** actualizar evolución de emergencia basada en auscultación<br>**Para** informar si situación mejora o empeora | **Given** emergencia activa por indicador de auscultación<br>**When** evalúa umbrales periódicamente<br>**Then** actualiza estado de indicador en módulo Emergencias: superado/no_superado, valores actuales, tendencia (mejorando/estable/empeorando)<br><br>**Given** valores retornan por debajo del umbral<br>**When** evalúa 3 veces consecutivas sin superación<br>**Then** propone des-escalamiento de escenario, notifica a Director | **Tabla compartida**: `emergencias_evolución_indicadores`<br>**Campos**: id, declaración_emergencia_id (FK), indicador_tipo (auscultación), alerta_auscultación_id (FK), fecha_hora_evaluación, umbral_superado (boolean), valores_actuales (JSON), tendencia (mejorando/estable/empeorando), recomendación (mantener/escalar/desescalar)<br>**Lógica de tendencia**:<br>- Compara últimas 3 evaluaciones (cada 1 hora)<br>- Mejorando: Valor decreciente en 3 lecturas consecutivas<br>- Estable: Sin cambio significativo (±5%)<br>- Empeorando: Valor creciente o alejándose más del umbral<br>**Criterio des-escalamiento**: 3 evaluaciones consecutivas con umbral NO superado + tendencia mejorando → propone desactivar escenario<br>**Interfaz en PEP**: Widget "Estado Indicadores Auscultación" con valores en tiempo real, gráfico de evolución, badge de tendencia<br>**Reglas**: Actualización cada 1 hora mientras emergencia activa, des-escalamiento requiere validación Director + inspección confirmatoria | M | Hito 4 | 8 SP |

---

# ÉPICA 5: VISUALIZACIÓN Y ANÁLISIS

## 🎯 Objetivo
Proporcionar herramientas de visualización y análisis para interpretar datos de auscultación y tomar decisiones informadas.

---

## Feature 5.1: Gráficos de Evolución

| ID | User Story | Criterios de Aceptación | Campos/Reglas | Prioridad | Hito | Estimación |
|----|------------|------------------------|---------------|-----------|------|------------|
| **AUS-020** | **Como** técnico de auscultación<br>**Quiero** visualizar gráficos de evolución temporal de variables<br>**Para** identificar tendencias y comportamientos anómalos | **Given** instrumento con lecturas históricas<br>**When** accede a "Gráficos de Evolución"<br>**Then** visualiza gráfico de línea con: eje X = tiempo, eje Y = valor medido, línea de umbral si configurado, puntos de alerta destacados<br><br>**Given** gráfico de filtración vs nivel embalse<br>**When** selecciona vista combinada<br>**Then** gráfico muestra dos ejes Y (Q en izquierda, NE en derecha), permite correlacionar comportamiento | **Interfaz**: Librería recharts para gráficos interactivos<br>**Configuraciones**:<br>- Rango temporal: últimos 7 días / 30 días / 6 meses / 1 año / personalizado<br>- Tipo gráfico: Línea / Barras / Área<br>- Comparar con: Variable de contexto (NE, Temperatura) en segundo eje<br>- Mostrar: Umbrales (líneas discontinuas), Eventos (marcadores), Alertas (puntos rojos)<br>**Características**:<br>- Zoom: Click y arrastrar para ampliar rango<br>- Tooltip: Hover muestra valor exacto + timestamp<br>- Exportar: PNG, SVG, CSV de datos<br>- Anotaciones: Agregar notas en puntos específicos (ej: "Inicio de lluvias intensas")<br>**Gráficos especiales**:<br>- Filtración vs NE: Scatter plot con línea de umbral<br>- Tendencias: Regresión lineal o polinómica<br>- Anomalías: Destacar outliers estadísticos<br>**Reglas**: Gráficos con >10,000 puntos usan agregación (media por hora/día), performance < 2s carga | M | Hito 5 | 13 SP |
| **AUS-021** | **Como** técnico<br>**Quiero** comparar comportamiento de múltiples instrumentos simultáneamente<br>**Para** identificar patrones correlacionados | **Given** múltiples instrumentos de mismo tipo<br>**When** selecciona comparación múltiple<br>**Then** gráfico muestra todas las series en misma escala, cada una con color diferente, leyenda identificable<br><br>**Given** instrumentos de tipos diferentes<br>**When** compara (ej: filtración vs desplazamiento)<br>**Then** usa ejes Y múltiples con escalas independientes, permite ver correlaciones | **Interfaz**: Multi-selector de instrumentos (hasta 6 simultáneos)<br>**Visualización**:<br>- Colores distintivos automáticos (paleta diferenciada)<br>- Leyenda con checkboxes para mostrar/ocultar series<br>- Sincronización de zoom (aplica a todas las series)<br>**Análisis**:<br>- Coeficiente de correlación entre pares de instrumentos<br>- Detección de desfases temporales (lag)<br>- Alertas si instrumentos similares muestran comportamiento divergente<br>**Casos de uso**:<br>- Comparar filtraciones de múltiples aforadores → detectar zona más afectada<br>- Correlacionar piezómetros con nivel embalse → validar consistencia<br>- Analizar desplazamientos de múltiples hitos → identificar movimientos diferenciales<br>**Reglas**: Limitar a 6 instrumentos para legibilidad, sugiere agrupación si >6 seleccionados | S | Hito 5 | 8 SP |

---

## Feature 5.2: Informes y Exportaciones

| ID | User Story | Criterios de Aceptación | Campos/Reglas | Prioridad | Hito | Estimación |
|----|------------|------------------------|---------------|-----------|------|------------|
| **AUS-022** | **Como** Jefe de Seguridad<br>**Quiero** generar informes de auscultación en PDF<br>**Para** documentación oficial y presentación a Comité de Seguridad | **Given** periodo temporal seleccionado<br>**When** genera "Informe de Auscultación"<br>**Then** PDF incluye: resumen ejecutivo, alertas generadas, gráficos de evolución, análisis de tendencias, recomendaciones<br><br>**Given** informe generado<br>**When** descarga<br>**Then** PDF firmado digitalmente, con marca de agua oficial, cabecera con logo CHG | **Plantilla PDF**:<br><br>**1. Carátula**:<br>- Logo CHG<br>- Título: "INFORME DE AUSCULTACIÓN"<br>- Presa<br>- Periodo: [fecha_inicio] - [fecha_fin]<br>- Fecha generación<br>- Generado por: [nombre usuario]<br><br>**2. Resumen Ejecutivo** (1 página):<br>- Total lecturas procesadas<br>- Alertas generadas (desglose por criticidad)<br>- Instrumentos en umbral<br>- Situaciones de emergencia activadas<br>- Conclusión general (semáforo: 🟢 Normal / 🟡 Vigilancia / 🔴 Crítico)<br><br>**3. Detalle por Instrumento** (n páginas):<br>- Tipo, código, ubicación<br>- Gráfico evolución temporal<br>- Tabla de lecturas (última semana)<br>- Alertas asociadas si las hay<br>- Análisis de tendencia<br><br>**4. Alertas Generadas** (tabla resumen)<br>- Fecha, instrumento, umbral, valores, estado, resolución<br><br>**5. Recomendaciones**:<br>- Instrumentos requieren atención<br>- Umbrales a revisar<br>- Acciones correctivas propuestas<br><br>**Edge Function**: `generar-informe-auscultacion-pdf`<br>**Storage**: `informes-auscultacion/{año}/{presa_id}/informe_{fecha_inicio}_{fecha_fin}.pdf`<br>**Firma digital**: Certificado CHG<br>**Reglas**: Informes con datos oficiales (no incluye simulaciones), retención 10 años, exportar también en formato Excel para análisis datos | M | Hito 5 | 13 SP |
| **AUS-023** | **Como** analista<br>**Quiero** exportar datos de lecturas y evaluaciones<br>**Para** realizar análisis estadísticos externos | **Given** filtros aplicados (presa, instrumento, fechas)<br>**When** hace clic en "Exportar Datos"<br>**Then** genera archivo CSV/Excel con: timestamp, instrumento, valor, unidad, origen, umbrales, resultados evaluación<br><br>**Given** export incluye evaluaciones<br>**When** abre archivo<br>**Then** contiene columnas: fecha_evaluación, umbral, expresión, resultado, variables_usadas | **Formatos disponibles**:<br>- **CSV**: Para análisis en Python/R, delimitador configurable (coma/punto y coma)<br>- **Excel**: Múltiples hojas (Lecturas, Evaluaciones, Alertas), con formato y colores<br>- **JSON**: Para integraciones API<br><br>**Estructura Excel**:<br>**Hoja "Lecturas"**:<br>| Timestamp | Presa | Instrumento | Tipo | Valor | Unidad | Origen | Estado |<br>|-----------|-------|-------------|------|-------|--------|--------|--------|<br><br>**Hoja "Evaluaciones"**:<br>| Fecha Eval | Instrumento | Umbral | Expresión | Resultado | Variables | Tipo Resultado |<br>|------------|-------------|--------|-----------|-----------|-----------|----------------|<br><br>**Hoja "Alertas"**:<br>| Fecha | Presa | Instrumento | Umbral | Criticidad | Estado | Reconocida Por | Fecha Resolución |<br>|-------|-------|-------------|--------|------------|--------|----------------|------------------|<br><br>**Límites**: Máx 50,000 filas por export (si más, sugerir partir por rangos), comprime si >10MB<br>**Reglas**: Solo usuarios autorizados pueden exportar, log de exportaciones para auditoría, watermark en Excel indicando origen SIPRESAS | S | Hito 5 | 5 SP |

---

# 🔗 MATRIZ DE DEPENDENCIAS

| Historia | Depende de | Tipo | Notas |
|----------|-----------|------|-------|
| AUS-002 | AUS-001 | Fuerte | Sincronizar instrumentos requiere conexión activa |
| AUS-003 | AUS-002 | Fuerte | Extraer lecturas requiere catálogo de instrumentos |
| AUS-004 | AUS-003 | Media | Variables contexto se usan en evaluaciones |
| AUS-005 | AUS-004 | Media | Ingreso manual es fallback de automático |
| AUS-007 | AUS-006 | Media | Condiciones múltiples extienden umbrales simples |
| AUS-008 | AUS-006 | Media | Plantillas generan umbrales configurables |
| AUS-009 | AUS-006, AUS-003, AUS-004 | Fuerte | Evaluación requiere umbrales + lecturas + contexto |
| AUS-010 | AUS-009 | Media | Reevaluación periódica extiende evaluación base |
| AUS-011 | AUS-009 | Media | Evaluación manual usa mismo motor |
| AUS-012 | AUS-009 | Fuerte | Alertas se generan de evaluaciones positivas |
| AUS-013 | AUS-012 | Fuerte | Notificaciones requieren alertas generadas |
| AUS-014 | AUS-013 | Media | Reconocimiento es acción sobre alertas notificadas |
| AUS-015 | AUS-012 | Media | Dashboard visualiza alertas existentes |
| AUS-016 | AUS-012 | Media | Histórico consulta alertas pasadas |
| AUS-017 | AUS-012, EXP-001 | Fuerte | Declaración Extraordinaria requiere módulo Explotación |
| AUS-018 | AUS-012, EMG-007 | Fuerte | Activación PEP requiere módulo Emergencias |
| AUS-019 | AUS-018 | Media | Evolución actualiza emergencia activa |
| AUS-020 | AUS-003 | Media | Gráficos usan lecturas existentes |
| AUS-021 | AUS-020 | Media | Comparación múltiple extiende gráficos simples |
| AUS-022 | AUS-012, AUS-020 | Media | Informes usan alertas + gráficos |
| AUS-023 | AUS-003, AUS-009 | Media | Exportación usa lecturas + evaluaciones |

---

# 📊 ESTIMACIÓN Y PRIORIZACIÓN

## Resumen por Épica

| Épica | User Stories | Story Points | Must Have | Should Have | Could Have |
|-------|--------------|--------------|-----------|-------------|------------|
| **ÉPICA 1**: Integración DAMDATA | 5 | 52 SP | 47 | 5 | 0 |
| **ÉPICA 2**: Motor Evaluación | 6 | 60 SP | 55 | 5 | 0 |
| **ÉPICA 3**: Alertas y Avisos | 5 | 55 SP | 47 | 8 | 0 |
| **ÉPICA 4**: Integración Explotación/Emergencias | 3 | 34 SP | 34 | 0 | 0 |
| **ÉPICA 5**: Visualización y Análisis | 4 | 39 SP | 26 | 13 | 0 |
| **TOTAL AUSCULTACIÓN** | **23** | **240 SP** | **209** | **31** | **0** |

## Distribución por Hito

| Hito | Descripción | Sprints | Story Points | Épicas Involucradas |
|------|-------------|---------|--------------|---------------------|
| **Hito 1**: Integración DAMDATA | Establecer conexión y sincronización | Sprint 1-3 | 52 SP | ÉPICA 1 |
| **Hito 2**: Motor de Umbrales | Implementar evaluación automática | Sprint 4-5 | 60 SP | ÉPICA 2 |
| **Hito 3**: Sistema de Alertas | Notificaciones y dashboard | Sprint 6-7 | 55 SP | ÉPICA 3 |
| **Hito 4**: Integración Módulos | Conectar con Explotación y Emergencias | Sprint 8-9 | 34 SP | ÉPICA 4 |
| **Hito 5**: Visualización | Gráficos e informes | Sprint 10-11 | 39 SP | ÉPICA 5 |

### Estimación Global Módulo Auscultación

- **Velocidad sprint**: 25-30 SP (equipo de 3-4 desarrolladores)
- **Duración módulo Auscultación**: 11 sprints (~5.5 meses)
- **Dependencia crítica**: Requiere módulos Explotación y Emergencias operativos para Hito 4

---

## 🎯 DEFINICIÓN DE HECHO (Definition of Done)

### Aplica a Todas las User Stories

1. **Funcionalidad**:
   - ✅ Código implementado según criterios de aceptación
   - ✅ Integración con DAMDATA funcional y testeada
   - ✅ Expresiones matemáticas evaluadas correctamente
   - ✅ Notificaciones entregadas a destinatarios correctos

2. **Calidad de Código**:
   - ✅ Unit tests con cobertura >80%
   - ✅ Integration tests de flujos críticos
   - ✅ Code review aprobado por peer
   - ✅ Sin vulnerabilidades de seguridad

3. **Seguridad**:
   - ✅ RLS aplicado a todas las tablas
   - ✅ API keys encriptadas
   - ✅ Validación de inputs (prevención SQL injection)
   - ✅ Auditoría de acciones críticas

4. **Performance**:
   - ✅ Evaluaciones de umbrales < 5s
   - ✅ Queries de lecturas < 2s
   - ✅ Sincronización DAMDATA sin bloqueos
   - ✅ Gráficos cargando en < 3s

5. **Integraciones**:
   - ✅ Comunicación con DAMDATA robusta (retry + fallback)
   - ✅ Notificaciones a módulos Explotación/Emergencias funcionales
   - ✅ Logs de integraciones para debugging
   - ✅ Documentación de endpoints y payloads

6. **Documentación**:
   - ✅ Manual de configuración de umbrales
   - ✅ Guía de integración DAMDATA
   - ✅ Documentación de expresiones matemáticas soportadas
   - ✅ Troubleshooting guide para alertas

7. **Validación Usuario**:
   - ✅ Demo aceptada por stakeholder (Jefe Seguridad Presas)
   - ✅ Técnicos de auscultación validan usabilidad
   - ✅ Director Explotación aprueba notificaciones
   - ✅ Pruebas con datos reales de DAMDATA exitosas

---

## 📝 NOTAS DE IMPLEMENTACIÓN

### Integración con DAMDATA

**Opciones de integración** (a determinar con proveedor DAMDATA):

1. **API REST**: Ideal si DAMDATA expone endpoints (ej: `/api/lecturas`, `/api/instrumentos`)
2. **Acceso directo a BD**: Query a base de datos DAMDATA (requiere permisos read-only)
3. **Archivos CSV**: Export/import periódico (menos ideal, considerar si no hay API)
4. **Web Services SOAP**: Si DAMDATA usa tecnología legacy

**Recomendación**: API REST con autenticación API Key, polling cada 1 hora.

### Expresiones Matemáticas

**Parser recomendado**: Librería `mathjs` (JavaScript) o implementación custom con:
- Soporte operadores: `+`, `-`, `*`, `/`, `^`, `%`
- Funciones: `EXP`, `LOG`, `LN`, `SQRT`, `ABS`, `SIN`, `COS`, `TAN`, `POW`, `MAX`, `MIN`
- Variables: Solo mayúsculas (Q, NE, T, DELTA_Q_7D)
- Constantes: Notación científica (4e-13)
- Precedencia estándar: paréntesis > exponentes > multiplicación/división > suma/resta

**Validación**: Sintaxis verificada antes de guardar, sandbox para ejecutar (prevenir code injection).

### Criticidad y Priorización

**Prioridad de historias**:
1. **Must Have (209 SP)**: Integración DAMDATA + Motor Umbrales + Alertas básicas + Integraciones
2. **Should Have (31 SP)**: Dashboard avanzado, plantillas, análisis histórico, informes

**Dependencias críticas**:
- AUS-017 y AUS-018 requieren que módulos Explotación y Emergencias estén operativos
- Planificar Hito 4 después de completar implementación base de esos módulos

### Consideraciones Normativas

- **NEX (Normas de Explotación)**: Fuente de umbrales y expresiones matemáticas
- **PEP (Plan de Emergencia de Presas)**: Define criterios de activación de escenarios
- **Política de Seguridad CHG**: Clasificación de información de auscultación (Confidencial por defecto)
- **RDSP (Reglamento de Seguridad de Presas)**: Marco legal para monitoreo estructural

---

## ✅ CRITERIOS DE ACEPTACIÓN GLOBALES

### Módulo Auscultación completo cumple con:

1. **Integración DAMDATA operativa**: Sincronización automática cada 1 hora sin errores
2. **Motor de umbrales funcional**: Evalúa 100% de expresiones configuradas correctamente
3. **Alertas en tiempo real**: Notificaciones llegan en <5 min tras superación de umbral
4. **Integraciones módulos**: Declaración automática en Explotación/Emergencias funcional
5. **Dashboard en producción**: Visualización en tiempo real de estado de auscultación
6. **Informes PDF generables**: Con datos oficiales y firma digital CHG
7. **Sin falsos positivos**: Tasa de alertas válidas >95% (filtrado de lecturas erróneas efectivo)
8. **Performance**: Sistema soporta 50 presas x 20 instrumentos x evaluaciones cada 1h = 1,000 eval/h
9. **Disponibilidad**: Uptime 99.5% en horario crítico (6h-22h)
10. **Auditoría completa**: Log de todas las evaluaciones, alertas y declaraciones de emergencia

---

## 🚀 PRÓXIMOS PASOS

1. **Validación técnica con proveedor DAMDATA**: Confirmar opciones de integración, formatos de datos, credenciales
2. **Revisión expresiones matemáticas con Servicio de Seguridad**: Validar umbrales según NEX finales
3. **Diseño UX/UI**: Mockups de dashboard de alertas, configuración de umbrales, gráficos de evolución
4. **Setup entorno de pruebas**: Acceso a DAMDATA de desarrollo/test para pruebas de integración
5. **Definición de SLAs**: Tiempos de respuesta de notificaciones, disponibilidad del sistema
6. **Plan de contingencia**: Procedimiento si DAMDATA no disponible, modo manual de operación

---

**Documento generado para**: Kick-off SIPRESAS - Módulo Auscultación
**Versión**: 1.0
**Fecha**: 2026-01-28
**Contacto técnico**: Servicio de Seguridad de Presas - CHG
**Proveedor externo**: DAMDATA (pendiente coordinación integración)

---

## 🔍 ANEXO: EJEMPLO DE CONFIGURACIÓN DE UMBRAL

### Caso Real: Filtración Total (según imagen proporcionada)

**Instrumento**: Aforador AF-01 - Filtración Total
**Variable medida**: Q (Caudal de filtración, lts/min)
**Variable contexto**: NE (Nivel de Embalse, m)

#### Umbral 1: Situación Extraordinaria

**Expresión matemática**:
```
Q > 4e-13 * EXP(0.0563 * NE) + 58.49
```

**Condición adicional** (rango válido):
```
0 < Q < 4e-13 * EXP(0.0563 * NE) - 58.49
```
_(Esta condición invali validez de la lectura, probablemente error en documento original)_

**Tipo resultado**: `situación_extraordinaria`

**Recomendaciones NEX**:
- Inspección visual inmediata de zona de filtraciones
- Intensificar toma de lecturas (cada 6 horas)
- Analizar tendencia histórica de filtraciones
- Correlacionar con nivel de embalse
- Evaluar si requiere escalar a Escenario 0

#### Umbral 2: Declaración de Escenario 0

**Expresión matemática**:
```
Q > 4e-13 * EXP(0.0563 * NE) + 116.98
```

**Condición adicional** (rango válido):
```
0 < Q < 4e-13 * EXP(0.0563 * NE) - 116.98
```

**Tipo resultado**: `escenario_0_pep`

**Recomendaciones NEX**:
- Activar Plan de Emergencia de la Presa
- Notificar a Protección Civil
- Movilizar equipo técnico de emergencia
- Inspección técnica inmediata
- Evaluar medidas extraordinarias (desembalse preventivo)
- Monitoreo continuo (lecturas cada 2 horas)

#### Ejemplo de Evaluación

**Datos**:
- Q = 85.3 lts/min (lectura DAMDATA)
- NE = 602.5 m (dato SAIH)

**Evaluación Umbral 1** (Situación Extraordinaria):
```
85.3 > 4e-13 * EXP(0.0563 * 602.5) + 58.49
85.3 > 4e-13 * EXP(33.92) + 58.49
85.3 > 4e-13 * 5.86e+14 + 58.49
85.3 > 0.234 + 58.49
85.3 > 58.72
```
**Resultado**: ✅ **UMBRAL SUPERADO** → Genera alerta de Situación Extraordinaria

**Evaluación Umbral 2** (Escenario 0):
```
85.3 > 4e-13 * EXP(0.0563 * 602.5) + 116.98
85.3 > 117.21
```
**Resultado**: ❌ **NO SUPERADO** → No genera alerta de Escenario 0

**Acción del sistema**:
1. Genera alerta de Situación Extraordinaria
2. Notifica a Director de Explotación (email + SMS)
3. Propone declaración en módulo Explotación
4. Registra evaluación en BD para auditoría
5. Actualiza dashboard con alerta activa

---

FIN DEL BACKLOG MÓDULO AUSCULTACIÓN
