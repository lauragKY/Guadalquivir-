# BACKLOG - Módulo de Gestión de Emergencias
## SIPRESAS - Sistema Integral de Presas

---

## 📋 Índice

1. [Visión General](#visión-general)
2. [Organización por Hitos](#organización-por-hitos)
3. [Épicas e Historias de Usuario](#épicas-e-historias-de-usuario)
4. [Matriz de Dependencias](#matriz-de-dependencias)
5. [Estimación y Priorización](#estimación-y-priorización)

---

## 🎯 Visión General

El **Módulo de Gestión de Emergencias** es el núcleo operativo de SIPRESAS para la gestión de situaciones críticas en presas hidráulicas. Implementa los requisitos normativos establecidos en los Planes de Emergencia de Presas.

### Componentes Principales

1. **Plan de Emergencia** (6 submódulos)
   - a. Propuesta y Declaración de Escenario
   - b. Comunicación del Escenario
   - c. Actuaciones a realizar
   - d. Registro de actuaciones
   - e. Información gráfica de afecciones
   - f. Vinculación entre Planes

2. **Estado de Equipos de Aviso**
   - Monitoreo de sirenas
   - Autodiagnóstico
   - Alertas de disponibilidad

3. **Simulacros**
   - Entrenamientos sin envíos
   - Simulacros reglados
   - Registro histórico

4. **Revisiones y Actualizaciones**
   - Versionado de Planes
   - Gestión de cambios

---

## 📅 Organización por Hitos

### HITO 1: Infraestructura y Datos Maestros (Sprint 1-2)
- Base de datos Plan de Emergencia
- Catálogos: Causas, Escenarios, Indicadores
- Configuración de Planes por Presa
- Infraestructura de comunicaciones (mock)

### HITO 2: Evaluación y Declaración de Escenarios (Sprint 3-4)
- Evaluación automática de indicadores
- Motor de reglas para propuesta de escenario
- Validación y declaración manual
- Histórico de declaraciones

### HITO 3: Comunicaciones y Notificaciones (Sprint 5-6)
- Generación de formularios F-2
- Sistema de envío de avisos
- Confirmaciones de recepción
- Registro de comunicaciones

### HITO 4: Actuaciones y Procedimientos (Sprint 7-8)
- Fichas de actuaciones por escenario
- Procedimientos PV y PM
- Registro de actuaciones ejecutadas
- Trazabilidad completa

### HITO 5: Equipos de Aviso y Simulacros (Sprint 9-10)
- Monitoreo de sirenas
- Autodiagnóstico de equipos
- Módulo de simulacros
- Entrenamientos y registro

### HITO 6: Información Gráfica y Vínculos (Sprint 11-12)
- Integración cartografía GIS
- PDFs de afecciones
- Vinculación presas en cascada
- Activación automática

### HITO 7: Revisiones y Cierre (Sprint 13-14)
- Versionado de Planes
- Sistema de revisiones
- Exportación e informes
- Testing y refinamiento

---

## 📦 Épicas e Historias de Usuario

---

## ÉPICA 1: INFRAESTRUCTURA DEL PLAN DE EMERGENCIA

### Feature 1.1: Base de Datos y Configuración

| ID | User Story | Criterios de Aceptación | Campos/Reglas | Prioridad | Hito | Estimación |
|----|------------|------------------------|---------------|-----------|------|------------|
| **EMG-001** | **Como** administrador<br>**Quiero** definir la estructura del Plan de Emergencia para una presa<br>**Para** configurar todos los elementos normativos requeridos | **Given** presa sin Plan de Emergencia<br>**When** accede a configuración del Plan<br>**Then** puede ingresar: fecha_aprobación, versión, director_plan, equipo_emergencia, estado<br><br>**Given** Plan configurado<br>**When** guarda cambios<br>**Then** Plan queda activo y disponible para operación | **Tabla**: `planes_emergencia`<br>**Campos**: id, presa_id (FK), código_plan (único), fecha_aprobación, versión, director_plan_id (FK users), estado (activo/revisión/inactivo), fecha_última_revisión, próxima_revisión<br>**Validaciones**: Una presa solo puede tener un Plan activo, director debe tener rol adecuado<br>**Reglas RLS**: Admin y Director del Plan pueden editar | M | Hito 1 | 8 SP |
| **EMG-002** | **Como** administrador<br>**Quiero** gestionar el catálogo de Causas de Emergencia<br>**Para** tener valores normalizados según normativa | **Given** usuario admin<br>**When** accede a Catálogos > Causas Emergencia<br>**Then** puede crear/editar: código, nombre, descripción, tipo (sísmica/hidrológica/estructural/operacional)<br><br>**Given** causa usada en escenarios<br>**When** intenta eliminar<br>**Then** muestra advertencia con dependencias | **Tabla**: `cat_causas_emergencia`<br>**Campos**: id, código (único, ej: "AV", "AM", "SE"), nombre, descripción, tipo, requiere_notificación_inmediata (boolean), nivel_gravedad_base (1-3)<br>**Ejemplos**: AV (Avenida), AM (Amenaza Estructural), SE (Sismo)<br>**Reglas**: Códigos según nomenclatura oficial, auditoría de cambios | M | Hito 1 | 5 SP |
| **EMG-003** | **Como** administrador<br>**Quiero** gestionar el catálogo de Escenarios<br>**Para** definir los niveles de gravedad según indicadores | **Given** causas configuradas<br>**When** accede a Catálogos > Escenarios<br>**Then** puede crear escenarios vinculados a causas con: código (0/1/2/3), nombre, descripción, medidas_inmediatas<br><br>**Given** escenario configurado<br>**When** lo asocia a causa<br>**Then** queda disponible para evaluación automática | **Tabla**: `cat_escenarios`<br>**Campos**: id, código_escenario (0=Situación Normal, 1=Emergencia Grado 1, 2=Emergencia Grado 2, 3=Emergencia Grado 3), nombre, descripción, nivel_gravedad (0-3), medidas_correctoras_texto, requiere_activación_plan (boolean)<br>**Relación**: N:M con causas (una causa puede tener múltiples escenarios)<br>**Reglas**: Escenario 0 siempre existe (situación normal) | M | Hito 1 | 5 SP |
| **EMG-004** | **Como** administrador<br>**Quiero** definir Indicadores (cuantitativos y cualitativos) por Plan de Emergencia<br>**Para** permitir la evaluación automática de escenarios | **Given** Plan de Emergencia configurado<br>**When** accede a Indicadores del Plan<br>**Then** puede crear indicadores con: código, tipo (cuantitativo/cualitativo), fórmula/descripción, umbrales por escenario<br><br>**Given** indicador cuantitativo<br>**When** define umbrales<br>**Then** establece rangos para cada escenario (ej: NE > 600.87m y Qent > 1800 m³/s) | **Tabla**: `plan_indicadores`<br>**Campos**: id, plan_emergencia_id (FK), código_indicador (ej: "Indicador 1"), tipo (cuantitativo/cualitativo), descripción, fórmula (si aplica), unidad_medida<br>**Tabla**: `plan_indicador_umbrales`<br>**Campos**: id, indicador_id (FK), escenario_id (FK), causa_id (FK), condición (expresión lógica, ej: "NE > 600.87 AND Qent > 1800"), orden_evaluación<br>**Ejemplos**: Indicador 1 (hidrológico), Indicador 2 (estructural)<br>**Reglas**: Un indicador puede tener múltiples condiciones según escenario | M | Hito 1 | 13 SP |

---

## ÉPICA 2: EVALUACIÓN Y DECLARACIÓN DE ESCENARIOS

### Feature 2.1: Motor de Evaluación Automática

| ID | User Story | Criterios de Aceptación | Campos/Reglas | Prioridad | Hito | Estimación |
|----|------------|------------------------|---------------|-----------|------|------------|
| **EMG-005** | **Como** sistema<br>**Quiero** evaluar automáticamente indicadores en tiempo real<br>**Para** proponer escenario y causa cuando se detecten anomalías | **Given** sensores enviando lecturas<br>**When** lectura supera umbrales definidos en indicadores<br>**Then** sistema evalúa condiciones y propone escenario + causa<br><br>**Given** múltiples indicadores activos simultáneamente<br>**When** evalúa situación<br>**Then** propone escenario de mayor gravedad | **Lógica**: Motor de reglas que evalúa expresiones lógicas de `plan_indicador_umbrales`<br>**Inputs**: Lecturas de sensores (NE, Qent, desplazamientos, etc.)<br>**Outputs**: Causa propuesta + Escenario propuesto + Indicador(es) que lo activaron<br>**Reglas**: Prioridad por gravedad (3 > 2 > 1 > 0), si empate toma más reciente, log de evaluaciones<br>**Performance**: Evaluación cada 5 minutos o en cambio de lectura crítica | M | Hito 2 | 21 SP |
| **EMG-006** | **Como** técnico de explotación<br>**Quiero** visualizar evaluación automática propuesta<br>**Para** decidir si declaro formalmente el escenario | **Given** sistema propone escenario<br>**When** accede a módulo Plan de Emergencia<br>**Then** ve panel destacado con: causa propuesta, escenario propuesto, indicadores activos, valores actuales, timestamp<br><br>**Given** propuesta activa no declarada<br>**When** pasan más de 15 minutos<br>**Then** sistema genera alerta a Director del Plan | **Pantalla**: Panel en Dashboard del Plan de Emergencia<br>**Elementos visuales**: Badge con gravedad (color según escenario 0/1/2/3), tabla de indicadores con valores vs umbrales, botón "Revisar Propuesta", botón "Declarar Escenario"<br>**Estados**: Propuesta Pendiente / En Revisión / Declarada / Descartada<br>**Notificaciones**: Email/push a Director del Plan y equipo de emergencia | M | Hito 2 | 13 SP |
| **EMG-007** | **Como** Director del Plan<br>**Quiero** validar o rechazar la propuesta automática<br>**Para** ejercer supervisión humana antes de declarar emergencia | **Given** propuesta de escenario<br>**When** revisa información<br>**Then** puede: Declarar (acepta), Ajustar (cambia causa/escenario), Descartar (situación normal)<br><br>**Given** Director decide Descartar<br>**When** ingresa justificación<br>**Then** propuesta se archiva con motivo y sin declaración | **Tabla**: `plan_evaluaciones`<br>**Campos**: id, plan_id (FK), fecha_evaluación, causa_propuesta_id (FK), escenario_propuesto_id (FK), indicadores_activos (JSON array), valores_indicadores (JSON), estado (propuesta/declarada/descartada), declarada_por_user_id (FK), fecha_declaración, observaciones_declaración<br>**Reglas**: Solo Director del Plan o Admin pueden declarar, trazabilidad completa, timestamp inmutable | M | Hito 2 | 13 SP |
| **EMG-008** | **Como** Director del Plan<br>**Quiero** declarar manualmente un escenario sin propuesta automática<br>**Para** actuar ante situaciones no detectadas por sensores | **Given** situación de emergencia sin indicadores automáticos<br>**When** accede a "Declarar Escenario Manualmente"<br>**Then** formulario permite seleccionar: presa, causa, escenario, descripción_situación, testigos, fecha_detección<br><br>**Given** declaración manual<br>**When** guarda<br>**Then** activa todos los workflows igual que declaración automática | **Campos adicionales**: origen (automático/manual), razón_declaración_manual (texto libre, obligatorio si manual), anexos (fotos/documentos)<br>**Validaciones**: Causa y escenario deben ser compatibles, fecha no futura, descripción mínimo 50 caracteres<br>**Reglas**: Mismo tratamiento que automática, genera comunicaciones y actuaciones | M | Hito 2 | 8 SP |

### Feature 2.2: Histórico y Trazabilidad

| ID | User Story | Criterios de Aceptación | Campos/Reglas | Prioridad | Hito | Estimación |
|----|------------|------------------------|---------------|-----------|------|------------|
| **EMG-009** | **Como** usuario<br>**Quiero** consultar histórico de declaraciones de escenarios<br>**Para** analizar incidencias pasadas y patrones | **Given** Plan con declaraciones históricas<br>**When** accede a "Histórico Declaraciones"<br>**Then** tabla muestra: fecha, causa, escenario, duración, estado_final (cerrada/cancelada), usuario_declarador<br><br>**Given** declaración histórica<br>**When** hace clic en registro<br>**Then** muestra detalle completo con evolución, comunicaciones, actuaciones | **Tabla**: `plan_declaraciones_historico`<br>**Campos**: id, plan_id (FK), evaluación_id (FK), fecha_inicio, fecha_fin, causa_id (FK), escenario_inicial_id (FK), escenario_final_id (FK), duración_horas, estado_cierre (normal/cancelada/escalada), resumen_situación (texto), resumen_actuaciones (texto)<br>**Vistas**: Gráfico línea temporal, filtros por causa/escenario/año, exportar a PDF/Excel<br>**Reglas**: Inmutable, retención 10 años mínimo (normativa) | S | Hito 2 | 8 SP |

---

## ÉPICA 3: COMUNICACIONES Y NOTIFICACIONES

### Feature 3.1: Generación de Avisos (Formulario F-2)

| ID | User Story | Criterios de Aceptación | Campos/Reglas | Prioridad | Hito | Estimación |
|----|------------|------------------------|---------------|-----------|------|------------|
| **EMG-010** | **Como** sistema<br>**Quiero** generar automáticamente borradores de Formulario F-2<br>**Para** facilitar comunicaciones oficiales tras declaración de escenario | **Given** escenario declarado<br>**When** sistema detecta declaración<br>**Then** genera borradores de F-2 para cada organismo según protocolo (CHG, Protección Civil, Ayuntamientos, etc.)<br><br>**Given** F-2 generado<br>**When** Director del Plan revisa<br>**Then** formulario tiene pre-rellenados: datos presa, causa, escenario, fecha_hora, indicadores, medidas_a_tomar | **Tabla**: `plan_comunicaciones`<br>**Campos**: id, declaración_id (FK), organismo_destinatario, tipo_comunicacion (F-2/F-3/telefónica/email), estado (borrador/enviada/confirmada), fecha_generación, fecha_envío, contenido_generado (JSON con campos F-2), contenido_editado (JSON), medio_envío (email/fax/presencial), confirmación_recepción (boolean), fecha_confirmación, usuario_confirmador<br>**Template F-2**: Campos normativa (código presa, titular, causa, escenario, fecha/hora detección, medidas inmediatas, nivel_agua, caudal_desembalse, observaciones)<br>**Reglas**: Auto-rellenado inteligente desde declaración, permite edición antes de envío | M | Hito 3 | 13 SP |
| **EMG-011** | **Como** Director del Plan<br>**Quiero** editar contenido de avisos antes de enviar<br>**Para** ajustar información según contexto específico | **Given** borrador de F-2 generado<br>**When** accede a edición<br>**Then** formulario permite modificar todos los campos, añadir observaciones, adjuntar documentos<br><br>**Given** formulario editado<br>**When** marca como "Listo para Envío"<br>**Then** pasa a cola de envío con estado "Pendiente Envío" | **Interfaz**: Formulario con campos del F-2, editor de texto enriquecido para observaciones, upload de archivos adjuntos (PDFs, fotos)<br>**Validaciones**: Campos obligatorios según normativa, fecha/hora coherente, destinatarios válidos<br>**Reglas**: Conserva versión auto-generada y versión editada, log de cambios, solo Director o delegado pueden editar | M | Hito 3 | 8 SP |
| **EMG-012** | **Como** Director del Plan<br>**Quiero** enviar avisos a organismos oficiales<br>**Para** cumplir obligaciones de comunicación de emergencias | **Given** avisos listos para envío<br>**When** hace clic en "Enviar Todos" o envío individual<br>**Then** sistema envía emails a destinatarios configurados, registra envío con timestamp<br><br>**Given** envío exitoso<br>**When** destinatario recibe email<br>**Then** email incluye link de confirmación de recepción | **Integración**: Supabase Edge Function para envío de emails<br>**Email incluye**: Logo CHG, datos completos F-2 en formato legible, PDF adjunto con F-2 oficial, link confirmación: `https://sipresas.es/confirmar/{token}`<br>**Tabla**: `plan_envios_log`<br>**Campos**: id, comunicación_id (FK), fecha_envío, destinatario_email, estado_envío (enviado/error/rebotado), mensaje_error, intentos_envío<br>**Reglas**: Reintento automático 3 veces si falla, notificación a Director si error persistente, mock en HITO 3 (envíos reales en producción) | M | Hito 3 | 13 SP |
| **EMG-013** | **Como** organismo receptor<br>**Quiero** confirmar recepción de aviso mediante link<br>**Para** que CHG tenga constancia de comunicación recibida | **Given** email con link de confirmación<br>**When** destinatario hace clic en link<br>**Then** página pública muestra formulario: nombre_confirmador, cargo, organismo, fecha_hora_recepción, observaciones<br><br>**Given** formulario completado<br>**When** envía confirmación<br>**Then** actualiza registro en BD y notifica a Director del Plan | **Página pública**: `/confirmar-recepcion/{token}` (sin login)<br>**Token**: JWT con exp 7 días, vinculado a comunicación_id<br>**Campos confirmación**: nombre, cargo, organismo (pre-rellenado), fecha_hora, observaciones (opcional), firma_digital (opcional)<br>**Notificación**: Email a Director del Plan + alerta en dashboard<br>**Reglas**: Token único por comunicación, no reutilizable, auditoría completa | S | Hito 3 | 8 SP |

### Feature 3.2: Gestión de Destinatarios

| ID | User Story | Criterios de Aceptación | Campos/Reglas | Prioridad | Hito | Estimación |
|----|------------|------------------------|---------------|-----------|------|------------|
| **EMG-014** | **Como** administrador<br>**Quiero** configurar catálogo de organismos y contactos<br>**Para** tener destinatarios actualizados para avisos | **Given** Plan de Emergencia<br>**When** accede a Configuración > Destinatarios<br>**Then** puede gestionar: organismo (CHG/PC/Ayuntamiento/Prensa/Otro), nombre_contacto, cargo, email, teléfono, fax, activo (boolean)<br><br>**Given** cambio en contacto<br>**When** actualiza datos<br>**Then** histórico conserva versión anterior con fecha cambio | **Tabla**: `plan_destinatarios`<br>**Campos**: id, plan_id (FK), organismo_tipo, organismo_nombre, contacto_nombre, contacto_cargo, email_principal, emails_cc (array), teléfono, fax, dirección_postal, activo, prioridad_notificación (1-5), requiere_confirmación (boolean), fecha_alta, fecha_última_actualización<br>**Reglas**: Email válido, al menos un contacto activo por organismo crítico (CHG, Protección Civil), auditoría de cambios | M | Hito 3 | 5 SP |
| **EMG-015** | **Como** Director del Plan<br>**Quiero** definir qué organismos reciben aviso según tipo de escenario<br>**Para** notificar solo a destinatarios relevantes | **Given** configuración de destinatarios<br>**When** define protocolos por escenario<br>**Then** establece: Escenario 0 → no notifica / Escenario 1 → CHG / Escenario 2 → CHG + PC / Escenario 3 → Todos<br><br>**Given** declaración de escenario<br>**When** genera comunicaciones<br>**Then** solo incluye destinatarios según protocolo configurado | **Tabla**: `plan_protocolo_comunicaciones`<br>**Campos**: id, plan_id (FK), escenario_id (FK), destinatario_id (FK), tipo_comunicacion (inmediata/1h/3h/24h), template_comunicacion, obligatoria (boolean)<br>**Reglas**: Escenario 3 siempre notifica a todos, permite override manual, log de destinatarios notificados | M | Hito 3 | 5 SP |

---

## ÉPICA 4: ACTUACIONES Y PROCEDIMIENTOS

### Feature 4.1: Fichas de Actuaciones Específicas

| ID | User Story | Criterios de Aceptación | Campos/Reglas | Prioridad | Hito | Estimación |
|----|------------|------------------------|---------------|-----------|------|------------|
| **EMG-016** | **Como** sistema<br>**Quiero** mostrar automáticamente las actuaciones a realizar según escenario declarado<br>**Para** guiar al Director del Plan en la gestión de la emergencia | **Given** escenario declarado (causa + escenario + indicador)<br>**When** Director accede a "Actuaciones"<br>**Then** muestra ficha específica (ej: AV.1.1.a) con: definición del escenario, tabla de actuaciones (descripción, responsable, procedimiento, personal, medios)<br><br>**Given** múltiples actuaciones en ficha<br>**When** visualiza listado<br>**Then** actuaciones ordenadas por prioridad, destacando inspecciones vs ejecuciones | **Tabla**: `plan_fichas_actuacion`<br>**Campos**: id, plan_id (FK), causa_id (FK), escenario_id (FK), indicador (ej: "Indicador 1"), código_ficha (ej: "AV.1.1.a"), definición_escenario (texto con condiciones), orden_visualización<br>**Tabla**: `plan_actuaciones`<br>**Campos**: id, ficha_id (FK), número_orden, descripción_actuación, tipo (inspección/ejecución), responsable_directo, código_procedimiento (ej: "PV-1", "PM-2"), otro_personal_necesario, medios_materiales<br>**Reglas**: Código ficha único por Plan, actuaciones heredan prioridad de escenario | M | Hito 4 | 13 SP |
| **EMG-017** | **Como** Director del Plan<br>**Quiero** acceder al detalle de procedimientos de actuación<br>**Para** ejecutar correctamente las medidas requeridas | **Given** actuación con código de procedimiento (ej: PV-1)<br>**When** hace clic en código<br>**Then** abre modal/página con: título procedimiento, responsable, personal necesario, medios materiales, modus operandi (pasos detallados), resultados esperados<br><br>**Given** procedimiento visualizado<br>**When** lee modus operandi<br>**Then** muestra pasos numerados (a, b, c...) con descripciones detalladas | **Tabla**: `plan_procedimientos`<br>**Campos**: id, plan_id (FK), código_procedimiento (PV-X para inspección, PM-X para ejecución), título, responsable_directo, otro_personal, medios_materiales, modus_operandi (JSON array con pasos), resultados_esperados (texto)<br>**Interfaz**: Modal con formato legible, opción imprimir/exportar PDF, botón "Marcar como Ejecutado"<br>**Reglas**: Procedimientos reutilizables en múltiples actuaciones, versionado si Plan se actualiza | M | Hito 4 | 8 SP |
| **EMG-018** | **Como** administrador<br>**Quiero** configurar fichas y actuaciones desde el backoffice<br>**Para** mantener actualizados los protocolos según revisiones del Plan | **Given** Plan de Emergencia en revisión<br>**When** accede a Gestión > Fichas de Actuación<br>**Then** puede CRUD fichas, añadir/editar actuaciones, vincular procedimientos<br><br>**Given** cambios en ficha<br>**When** guarda<br>**Then** queda versionada, conserva histórico, aplica a nuevas declaraciones | **Interfaz**: CRUD completo con formularios modales, drag&drop para reordenar actuaciones, selector de procedimientos existentes<br>**Versionado**: Tabla `plan_fichas_actuacion_versiones` con timestamp y usuario<br>**Reglas**: Solo admin o Director del Plan pueden editar, declaraciones activas usan versión vigente en momento de declaración | S | Hito 4 | 13 SP |

### Feature 4.2: Registro de Actuaciones Ejecutadas

| ID | User Story | Criterios de Aceptación | Campos/Reglas | Prioridad | Hito | Estimación |
|----|------------|------------------------|---------------|-----------|------|------------|
| **EMG-019** | **Como** técnico de explotación<br>**Quiero** registrar actuaciones realizadas durante la emergencia<br>**Para** documentar medidas ejecutadas y resultados obtenidos | **Given** declaración activa con actuaciones pendientes<br>**When** accede a "Registrar Actuación"<br>**Then** formulario muestra: actuación (dropdown pre-cargado), fecha_hora_ejecución, responsable_ejecutor, personal_participante, resultado, observaciones, adjuntar_evidencias (fotos/documentos)<br><br>**Given** actuación registrada<br>**When** guarda<br>**Then** aparece en log de actuaciones con timestamp y usuario | **Tabla**: `plan_actuaciones_ejecutadas`<br>**Campos**: id, declaración_id (FK), actuación_id (FK nullable si manual), fecha_hora_inicio, fecha_hora_fin, responsable_ejecutor_id (FK users), personal_participante (text), resultado (exitosa/parcial/fallida/cancelada), descripción_resultado (text), observaciones, evidencias_urls (JSON array), registrado_por_id (FK users), fecha_registro<br>**Validaciones**: Fecha no futura, resultado obligatorio, descripción mínima 30 caracteres<br>**Reglas**: Actuaciones manuales (no predefinidas) también permitidas, trazabilidad completa | M | Hito 4 | 13 SP |
| **EMG-020** | **Como** Director del Plan<br>**Quiero** visualizar checklist de actuaciones pendientes vs ejecutadas<br>**Para** controlar progreso de gestión de emergencia | **Given** declaración activa<br>**When** accede a vista "Checklist Actuaciones"<br>**Then** muestra lista de actuaciones requeridas con checkbox: pendiente/en_ejecución/completada<br><br>**Given** actuación marcada como completada<br>**When** revisa detalles<br>**Then** muestra link a registro de ejecución con resultados | **Vista**: Tabla con columnas: actuación, responsable, estado (badge coloreado), fecha_ejecución, acciones (ver detalle/registrar)<br>**Estados visuales**: Rojo (pendiente), Amarillo (en ejecución), Verde (completada)<br>**Filtros**: Por responsable, por tipo (inspección/ejecución), por estado<br>**Reglas**: Actualización en tiempo real, exportar a PDF para informes | M | Hito 4 | 8 SP |
| **EMG-021** | **Como** usuario<br>**Quiero** registrar comunicaciones telefónicas realizadas durante la emergencia<br>**Para** mantener trazabilidad de todas las gestiones | **Given** declaración activa<br>**When** realiza llamada desde Sala de Emergencia<br>**Then** puede registrar: fecha_hora, destinatario, medio (teléfono/presencial/videollamada), tipo (informativa/coordinación/solicitud_apoyo), resumen, respuesta_recibida<br><br>**Given** teléfono con grabación<br>**When** registra llamada<br>**Then** puede vincular archivo audio de grabación | **Tabla**: `plan_comunicaciones_operativas`<br>**Campos**: id, declaración_id (FK), fecha_hora, destinatario_nombre, destinatario_organismo, medio, tipo_comunicacion, resumen (text), respuesta_recibida (text), grabación_url, registrado_por_id (FK users)<br>**Reglas**: Grabaciones en `/tmp` de Edge Function o storage Supabase, opcional vincular con comunicación_id si es seguimiento de F-2, exportar log completo | S | Hito 4 | 8 SP |

---

## ÉPICA 5: INFORMACIÓN GRÁFICA Y CARTOGRAFÍAS

### Feature 5.1: Acceso a Cartografías de Afecciones

| ID | User Story | Criterios de Aceptación | Campos/Reglas | Prioridad | Hito | Estimación |
|----|------------|------------------------|---------------|-----------|------|------------|
| **EMG-022** | **Como** Director del Plan<br>**Quiero** acceder rápidamente a cartografías de afecciones por rotura<br>**Para** visualizar zonas en riesgo según escenario | **Given** declaración activa<br>**When** hace clic en "Ver Mapas de Afección"<br>**Then** muestra galería de cartografías: onda de rotura, inundación zonas habitadas, infraestructuras afectadas<br><br>**Given** cartografías disponibles en PDF<br>**When** selecciona una<br>**Then** abre PDF en nueva pestaña con opción descargar | **Tabla**: `plan_cartografias`<br>**Campos**: id, plan_id (FK), escenario_id (FK nullable, si es específico de escenario), tipo_cartografia (rotura/inundación/evacuación/infraestructuras), título, descripción, archivo_pdf_url, archivo_gis_url (shapefile/geojson), fecha_elaboración, versión<br>**Storage**: Supabase Storage en bucket `plan-cartografias/` con RLS<br>**Reglas**: PDFs siempre disponibles, GIS opcional, múltiples cartografías por Plan | M | Hito 6 | 8 SP |
| **EMG-023** | **Como** Director del Plan<br>**Quiero** visualizar cartografías GIS en el módulo de Mapa de SIPRESAS<br>**Para** contextualizar afecciones con datos actuales de la presa | **Given** Plan con cartografías GIS<br>**When** activa "Capa Afecciones" en Mapa<br>**Then** superpone geometrías de afección (polígonos inundación, líneas infraestructura) sobre mapa base<br><br>**Given** capa activa<br>**When** hace clic en polígono de afección<br>**Then** tooltip muestra: nivel de riesgo, población afectada estimada, tiempos de llegada onda | **Integración**: Leaflet o similar para cargar GeoJSON/Shapefile convertido<br>**Capas**: Zona inundación (polígonos con color según profundidad), Infraestructuras críticas (marcadores), Rutas evacuación (líneas)<br>**Interactividad**: Hover tooltip, click para detalles, toggle capas, zoom a extent de afección<br>**Reglas**: Decisión diseño: preguntar al Director si cargar automáticamente al declarar escenario 3, o carga manual | S | Hito 6 | 13 SP |
| **EMG-024** | **Como** administrador<br>**Quiero** cargar y gestionar cartografías del Plan<br>**Para** mantener actualizadas las capas de información gráfica | **Given** revisión de Plan con nuevas cartografías<br>**When** accede a Gestión > Cartografías<br>**Then** puede upload PDFs y archivos GIS, asociar a escenarios, describir contenido<br><br>**Given** cartografía subida<br>**When** guarda<br>**Then** disponible para visualización en declaraciones futuras | **Interfaz**: Upload con drag&drop, preview de PDF, validación de formato GIS (GeoJSON/Shapefile zip), formulario metadatos<br>**Validaciones**: Tamaño máximo 50MB por archivo, formatos permitidos: PDF, GeoJSON, SHP (zip), KML<br>**Storage**: Supabase Storage con RLS, URLs firmadas temporales para descarga<br>**Reglas**: Versionado de cartografías, conservar históricas aunque se actualicen | S | Hito 6 | 8 SP |

---

## ÉPICA 6: VINCULACIÓN ENTRE PLANES DE EMERGENCIA

### Feature 6.1: Configuración de Presas en Cascada

| ID | User Story | Criterios de Aceptación | Campos/Reglas | Prioridad | Hito | Estimación |
|----|------------|------------------------|---------------|-----------|------|------------|
| **EMG-025** | **Como** administrador<br>**Quiero** definir relaciones de presas en cascada<br>**Para** activar automáticamente Planes de Emergencia aguas abajo | **Given** presa con presas aguas abajo<br>**When** accede a Configuración > Cascada<br>**Then** puede añadir presas aguas abajo con: presa_destino_id, distancia_km, tiempo_llegada_onda (horas), factor_amplificación (numérico)<br><br>**Given** relación configurada<br>**When** guarda<br>**Then** valida que no hay ciclos (A→B→A) y que distancia/tiempo son coherentes | **Tabla**: `plan_presas_cascada`<br>**Campos**: id, presa_origen_id (FK presas), presa_destino_id (FK presas), distancia_km, tiempo_llegada_onda_horas, factor_amplificación (decimal, ej: 1.2 si aumenta caudal), observaciones, activa (boolean)<br>**Validaciones**: presa_origen ≠ presa_destino, no ciclos, tiempo > 0<br>**Reglas**: Una presa puede tener múltiples aguas abajo, una presa puede ser aguas abajo de múltiples (confluencias) | M | Hito 6 | 8 SP |
| **EMG-026** | **Como** sistema<br>**Quiero** activar automáticamente escenarios en presas aguas abajo<br>**Para** propagar emergencias en cascada según normativa | **Given** declaración de escenario 2 o 3 en presa origen<br>**When** sistema detecta declaración<br>**Then** evalúa presas aguas abajo configuradas y propone escenario automáticamente considerando tiempo llegada onda y factor amplificación<br><br>**Given** propuesta generada en presa aguas abajo<br>**When** Director de esa presa accede<br>**Then** ve alerta: "Emergencia en presa aguas arriba: [Nombre Presa]. Revisar propuesta de escenario." | **Lógica**: Al declarar escenario en presa A, query de `plan_presas_cascada` encuentra presas B, C... aguas abajo → Crea `plan_evaluaciones` con origen "cascada" y causa especial "Activación Plan Emergencia [Presa A]"<br>**Tabla**: Añadir a `plan_evaluaciones` campo `origen_cascada_declaracion_id` (FK nullable)<br>**Notificaciones**: Email + push a Directores de Planes aguas abajo<br>**Reglas**: Propuesta automática, requiere validación humana, no declara automáticamente (supervisión humana obligatoria) | M | Hito 6 | 13 SP |
| **EMG-027** | **Como** Director del Plan<br>**Quiero** visualizar en dashboard si hay emergencias aguas arriba<br>**Para** estar alerta ante posibles impactos | **Given** presa con emergencias aguas arriba activas<br>**When** accede a Dashboard<br>**Then** panel destacado muestra: "⚠️ Emergencia aguas arriba: Presa X - Escenario 2 - Tiempo estimado llegada onda: 3h"<br><br>**Given** múltiples presas aguas arriba en emergencia<br>**When** visualiza panel<br>**Then** lista ordenada por tiempo de llegada (más urgente primero) | **Vista**: Widget en Dashboard del Plan, tabla con columnas: presa_origen, escenario_activo, fecha_declaración, tiempo_estimado_llegada, acciones (ver detalle/revisar propuesta)<br>**Lógica**: Query que busca declaraciones activas en presas aguas arriba según `plan_presas_cascada`<br>**Diseño**: Colores según urgencia (rojo <1h, naranja 1-3h, amarillo >3h)<br>**Reglas**: Actualización cada 5 min, link directo a declaración de presa origen | S | Hito 6 | 8 SP |

---

## ÉPICA 7: ESTADO DE EQUIPOS DE AVISO A LA POBLACIÓN

### Feature 7.1: Configuración y Monitoreo de Sirenas

| ID | User Story | Criterios de Aceptación | Campos/Reglas | Prioridad | Hito | Estimación |
|----|------------|------------------------|---------------|-----------|------|------------|
| **EMG-028** | **Como** administrador<br>**Quiero** dar de alta sirenas de aviso vinculadas a Planes de Emergencia<br>**Para** monitorizar su estado operativo | **Given** Plan de Emergencia configurado<br>**When** accede a Configuración > Equipos de Aviso<br>**Then** puede crear sirena con: código, ubicación (lat/lon), población_cercana, planes_emergencia_ids (array), estado (activa/mantenimiento/inactiva)<br><br>**Given** sirena vinculada a múltiples Planes<br>**When** guarda<br>**Then** disponible para todos los Planes asociados | **Tabla**: `equipos_aviso_sirenas`<br>**Campos**: id, código_sirena (único), nombre, ubicación_descripción, latitud, longitud, tipo_sirena (electrónica/mecánica/mixta), población_cobertura, alcance_metros, fecha_instalación, fabricante, modelo, estado_operativo, fecha_último_test, próximo_test_programado<br>**Tabla relación**: `plan_sirenas` (plan_id FK, sirena_id FK)<br>**Reglas**: Una sirena puede pertenecer a múltiples Planes (ej: presas cercanas), coordenadas válidas | M | Hito 5 | 8 SP |
| **EMG-029** | **Como** sistema<br>**Quiero** recibir autodiagnóstico diario de sirenas<br>**Para** detectar fallos y alertar a responsables | **Given** sirenas con capacidad autodiagnóstico<br>**When** sirena realiza test (programado diario)<br>**Then** envía resultado a SIPRESAS (endpoint API): sirena_id, fecha_hora_test, resultado (OK/fallo_bateria/fallo_altavoz/sin_conexión), detalles_json<br><br>**Given** sirena reporta fallo<br>**When** sistema recibe resultado<br>**Then** genera alerta, actualiza estado sirena, notifica a Director de Explotación y técnicos | **Edge Function**: `recibir-diagnostico-sirena`<br>**Input**: POST con { sirena_id, resultado, detalles, timestamp }<br>**Tabla**: `equipos_aviso_diagnosticos`<br>**Campos**: id, sirena_id (FK), fecha_hora_test, resultado, detalles (JSON), nivel_criticidad (info/warning/error), gestionado (boolean), fecha_gestión, notas_gestión<br>**Notificaciones**: Email inmediato si fallo, resumen diario si todo OK<br>**Reglas**: Test diario recomendado, conservar historial 1 año | M | Hito 5 | 13 SP |
| **EMG-030** | **Como** técnico de explotación<br>**Quiero** registrar manualmente estado de sirena tras inspección<br>**Para** actualizar disponibilidad si detecto fallo en campo | **Given** inspección física de sirena<br>**When** accede a "Registrar Estado Sirena"<br>**Then** formulario permite: seleccionar sirena, resultado (operativa/no_operativa), tipo_incidencia (batería/altavoz/cableado/vandalismo/otro), descripción, fotos, fecha_próximo_test<br><br>**Given** sirena marcada como no operativa<br>**When** guarda<br>**Then** cambia estado en BD, genera alerta a Director, si escenario >= 2 cambia a "situación extraordinaria" | **Interfaz**: Formulario con selector de sirenas, radio buttons para resultado, textarea para descripción, upload fotos<br>**Lógica**: Si sirena crítica (vinculada a escenarios 2-3) pasa a no operativa → Escala alerta a Director del Plan<br>**Reglas**: Registro manual prevalece sobre autodiagnóstico hasta nueva comprobación, trazabilidad completa | M | Hito 5 | 8 SP |

### Feature 7.2: Visualización de Estado de Sirenas

| ID | User Story | Criterios de Aceptación | Campos/Reglas | Prioridad | Hito | Estimación |
|----|------------|------------------------|---------------|-----------|------|------------|
| **EMG-031** | **Como** Director de Explotación<br>**Quiero** visualizar en mapa todas las sirenas de mis presas<br>**Para** tener visión global de disponibilidad de equipos de aviso | **Given** usuario con rol Director de Explotación<br>**When** accede a Módulo > Equipos de Aviso<br>**Then** mapa muestra marcadores de todas las sirenas vinculadas a sus Planes, con código de color según estado (verde: OK, amarillo: warning, rojo: fallo, gris: sin conexión)<br><br>**Given** sirena en estado fallo<br>**When** hace clic en marcador<br>**Then** popup muestra: código, ubicación, último test, tipo de fallo, acciones (ver histórico/gestionar) | **Integración**: Módulo Mapa de SIPRESAS con capa específica "Equipos Aviso"<br>**Permisos**: Admin ve todas, Director Explotación ve de sus presas, Técnico ve de su presa<br>**Filtros**: Por estado, por Plan de Emergencia, por fecha último test<br>**Diseño**: Marcadores con iconos de sirena, parpadeantes si fallo crítico<br>**Reglas**: Actualización tiempo real, contador resumen "12 operativas / 2 en fallo / 1 sin conexión" | M | Hito 5 | 13 SP |
| **EMG-032** | **Como** Director del Plan<br>**Quiero** recibir notificación si sirena pasa a no operativa<br>**Para** tomar medidas correctivas inmediatas | **Given** sirena crítica en fallo<br>**When** sistema detecta cambio de estado<br>**Then** envía email + notificación push a Director del Plan y Director de Explotación con: sirena afectada, tipo fallo, última prueba OK, acciones recomendadas<br><br>**Given** fallo en múltiples sirenas<br>**When** detecta patrón (ej: 3 sirenas misma zona)<br>**Then** escala alerta a "situación extraordinaria" y notifica a administrador CHG | **Lógica notificaciones**: Edge Function trigger en update de `equipos_aviso_sirenas.estado_operativo`<br>**Criterios criticidad**: 1 sirena fallo = warning, 2+ sirenas fallo = crítico, sirena vinculada a escenario 3 activo = crítico<br>**Contenido email**: Datos sirena, histórico reciente, link directo a gestión, botón "Marcar como Gestionado"<br>**Reglas**: No spam (máx 1 email cada 2h por misma sirena), consolidar alertas múltiples en un solo email | S | Hito 5 | 8 SP |

---

## ÉPICA 8: SIMULACROS Y ENTRENAMIENTOS

### Feature 8.1: Entrenamientos sin Comunicaciones

| ID | User Story | Criterios de Aceptación | Campos/Reglas | Prioridad | Hito | Estimación |
|----|------------|------------------------|---------------|-----------|------|------------|
| **EMG-033** | **Como** técnico de explotación<br>**Quiero** iniciar un entrenamiento de Plan de Emergencia<br>**Para** practicar procedimientos sin enviar comunicaciones reales | **Given** Plan de Emergencia configurado<br>**When** hace clic en "Nuevo Entrenamiento"<br>**Then** formulario permite definir: nombre_entrenamiento, fecha_programada, tipo (entrenamiento/simulacro_reglado), participantes, escenario_a_simular<br><br>**Given** entrenamiento creado<br>**When** inicia sesión de entrenamiento<br>**Then** entra en "Modo Entrenamiento" (banner visible en toda la app) y todas las funcionalidades operan sin envíos reales | **Tabla**: `plan_simulacros`<br>**Campos**: id, plan_id (FK), tipo (entrenamiento/simulacro_reglado), nombre, descripción, fecha_programada, fecha_inicio_real, fecha_fin, estado (programado/en_curso/finalizado/cancelado), participantes (JSON array user_ids), escenario_simulado_id (FK), causa_simulada_id (FK), coordinador_id (FK users)<br>**Modo Entrenamiento**: Flag `modo_simulacro_activo` en sesión usuario, banner rojo "🚨 MODO ENTRENAMIENTO - NO COMUNICACIONES REALES"<br>**Reglas**: Todas las tablas operacionales duplican registros con flag `simulacro_id` (FK), no se envían emails/notificaciones reales | M | Hito 5 | 13 SP |
| **EMG-034** | **Como** técnico<br>**Quiero** introducir manualmente variables cuantitativas y cualitativas durante entrenamiento<br>**Para** simular evolución de emergencia | **Given** entrenamiento en curso<br>**When** accede a "Panel de Control Simulacro"<br>**Then** puede modificar valores de indicadores: NE (nivel embalse), Qent (caudal entrada), desplazamientos, etc.<br><br>**Given** valores modificados<br>**When** sistema evalúa<br>**Then** propone cambio de escenario automáticamente según reglas configuradas, actualizando dashboard en tiempo real | **Interfaz**: Panel tipo "control remoto" con sliders/inputs para cada indicador, botón "Aplicar Cambios", histórico de cambios realizados<br>**Lógica**: Al modificar indicador → Trigger evaluación automática (igual que producción) pero con datos mock → Propuesta nuevo escenario si aplica<br>**Tabla**: `plan_simulacro_eventos`<br>**Campos**: id, simulacro_id (FK), timestamp, tipo_evento (cambio_indicador/declaración_escenario/actuación_ejecutada/comunicación_enviada), detalles (JSON), usuario_id (FK)<br>**Reglas**: Log completo de todos los eventos del simulacro para debrief posterior | M | Hito 5 | 13 SP |
| **EMG-035** | **Como** coordinador de simulacro<br>**Quiero** finalizar el entrenamiento y generar informe<br>**Para** documentar aprendizajes y áreas de mejora | **Given** entrenamiento finalizado<br>**When** hace clic en "Finalizar y Generar Informe"<br>**Then** sistema genera PDF con: datos del simulacro, escenarios simulados, actuaciones ejecutadas, tiempos de respuesta, participantes, observaciones, conclusiones<br><br>**Given** informe generado<br>**When** descarga<br>**Then** PDF incluye gráfico temporal de evolución de indicadores y escenarios | **Tabla**: `plan_simulacro_informes`<br>**Campos**: id, simulacro_id (FK), fecha_generación, resumen_ejecutivo (text), lecciones_aprendidas (text), áreas_mejora (text), pdf_url, generado_por_id (FK users)<br>**PDF incluye**: Carátula, resumen simulacro, timeline visual, tabla de actuaciones con tiempos, estadísticas (tiempo promedio respuesta, % actuaciones completadas), observaciones de participantes, firmas de coordinador y Director del Plan<br>**Reglas**: Almacenar en Storage, conservar 5 años mínimo (normativa) | M | Hito 5 | 13 SP |

### Feature 8.2: Simulacros Reglados con Comunicaciones

| ID | User Story | Criterios de Aceptación | Campos/Reglas | Prioridad | Hito | Estimación |
|----|------------|------------------------|---------------|-----------|------|------------|
| **EMG-036** | **Como** Director del Plan<br>**Quiero** ejecutar un simulacro reglado<br>**Para** cumplir obligaciones normativas de ejercicios periódicos con organismos oficiales | **Given** simulacro reglado programado<br>**When** inicia simulacro<br>**Then** sistema entra en modo "Simulacro Reglado" (banner naranja) y envía comunicaciones F-2 MARCADAS CLARAMENTE como "SIMULACRO - NO ES EMERGENCIA REAL"<br><br>**Given** comunicación de simulacro<br>**When** genera F-2<br>**Then** encabezado y pie de página incluyen texto destacado "🔔 SIMULACRO - EJERCICIO DE ENTRENAMIENTO - NO ES EMERGENCIA REAL 🔔" | **Diferencias con entrenamiento**: Sí envía emails, pero modificados con marca de simulacro<br>**Template email**: Asunto prefijado con "[SIMULACRO]", cuerpo con banner destacado, color de fondo diferente<br>**Tabla destinatarios**: Flag `participa_en_simulacros` (boolean) para filtrar quien recibe comunicaciones de simulacros<br>**Reglas**: Coordinación previa con organismos (email anuncio 7 días antes), confirmaciones de recepción sí se registran, procedimientos completos igual que emergencia real | S | Hito 5 | 13 SP |
| **EMG-037** | **Como** usuario<br>**Quiero** consultar histórico de entrenamientos y simulacros<br>**Para** analizar evolución de capacitación del equipo | **Given** Plan con simulacros históricos<br>**When** accede a "Histórico Simulacros"<br>**Then** tabla muestra: fecha, tipo, escenario simulado, participantes, duración, estado_finalización, informe (link descarga)<br><br>**Given** filtros aplicados<br>**When** selecciona año y tipo<br>**Then** resultados filtrados, contador de simulacros realizados vs obligatorios según normativa | **Vista**: Tabla con filtros (año, tipo, participantes), KPIs en header (Total simulacros realizados, % cumplimiento normativo, tiempo promedio duración), gráfico de tendencia (simulacros por año)<br>**Normativa**: Mínimo 1 simulacro reglado cada 2 años (según normativa española)<br>**Exportar**: Listado completo a Excel para auditorías<br>**Reglas**: Solo lectores con permisos ven simulacros pasados, no se pueden modificar registros históricos | S | Hito 5 | 8 SP |

---

## ÉPICA 9: REVISIONES Y ACTUALIZACIONES DE PLANES

### Feature 9.1: Versionado de Planes de Emergencia

| ID | User Story | Criterios de Aceptación | Campos/Reglas | Prioridad | Hito | Estimación |
|----|------------|------------------------|---------------|-----------|------|------------|
| **EMG-038** | **Como** administrador<br>**Quiero** crear nueva versión de Plan de Emergencia<br>**Para** reflejar revisiones normativas o cambios relevantes | **Given** Plan activo versión N<br>**When** hace clic en "Crear Nueva Versión"<br>**Then** sistema duplica configuración actual a versión N+1 en estado "Borrador", desactivando versión N temporalmente<br><br>**Given** versión en borrador<br>**When** edita elementos (indicadores, fichas, procedimientos)<br>**Then** cambios solo aplican a versión N+1, versión N permanece inmutable | **Tabla**: Añadir campo `versión` a `planes_emergencia` y columna `plan_version_id` en tablas dependientes<br>**Estados versión**: Borrador / Revisión / Aprobada / Activa / Histórica<br>**Workflow**: Borrador → Revisión → Aprobada → Activa (al activar, versión anterior pasa a Histórica)<br>**Versionado incluye**: Indicadores, fichas actuación, procedimientos, destinatarios, cartografías<br>**Reglas**: Solo puede haber 1 versión Activa por presa, versiones históricas read-only, declaraciones activas siguen usando versión vigente en momento de declaración | M | Hito 7 | 13 SP |
| **EMG-039** | **Como** Director del Plan<br>**Quiero** revisar cambios entre versiones del Plan<br>**Para** validar actualizaciones antes de aprobar | **Given** versión en revisión<br>**When** accede a "Comparar Versiones"<br>**Then** vista diff muestra: cambios en indicadores (añadidos/eliminados/modificados), cambios en fichas, cambios en procedimientos, con colores verde (nuevo), rojo (eliminado), amarillo (modificado)<br><br>**Given** cambios validados<br>**When** aprueba versión<br>**Then** estado pasa a "Aprobada", genera PDF de Plan actualizado, notifica a equipo de emergencia | **Interfaz**: Vista lado a lado o diff inline, filtros por tipo de cambio, sección de comentarios para cada cambio<br>**PDF Plan**: Generación automática con template oficial CHG, incluye todas las secciones normativas, firmado digitalmente<br>**Notificaciones**: Email a todos los miembros del equipo de emergencia con resumen de cambios y link a PDF<br>**Reglas**: Solo Director del Plan y Admin pueden aprobar, requiere comentario obligatorio explicando motivo de revisión | S | Hito 7 | 13 SP |
| **EMG-040** | **Como** administrador<br>**Quiero** activar nueva versión del Plan<br>**Para** que pase a ser la versión operativa oficial | **Given** versión aprobada<br>**When** hace clic en "Activar Versión"<br>**Then** confirma acción, sistema desactiva versión anterior (pasa a Histórica), activa nueva versión, actualiza fecha_última_revisión, programa próxima_revisión (+2 años)<br><br>**Given** declaraciones activas usando versión anterior<br>**When** activa nueva versión<br>**Then** declaraciones en curso siguen usando versión antigua hasta cierre, nuevas declaraciones usan versión nueva | **Lógica**: Al activar → UPDATE `planes_emergencia` SET estado='histórica' WHERE activo=true AND presa_id=X; UPDATE SET estado='activa' WHERE id=nueva_versión<br>**Auditoría**: Registro detallado de activación con usuario, timestamp, razón<br>**Backup**: Exportar versión anterior completa a JSON antes de archivar<br>**Reglas**: No se pueden eliminar versiones históricas (retención permanente), activación requiere doble confirmación con motivo | M | Hito 7 | 8 SP |

### Feature 9.2: Gestión de Actualizaciones Menores

| ID | User Story | Criterios de Aceptación | Campos/Reglas | Prioridad | Hito | Estimación |
|----|------------|------------------------|---------------|-----------|------|------------|
| **EMG-041** | **Como** administrador<br>**Quiero** realizar actualizaciones menores sin crear nueva versión<br>**Para** corregir errores tipográficos o actualizar contactos | **Given** Plan activo<br>**When** accede a modo "Actualización Menor"<br>**Then** puede editar: destinatarios (contactos), observaciones en procedimientos, descripciones (textos), sin cambiar lógica de indicadores ni estructura de fichas<br><br>**Given** actualización menor guardada<br>**When** confirma cambios<br>**Then** aplica inmediatamente sin cambio de versión, registra en histórico de cambios | **Tabla**: `plan_cambios_menores`<br>**Campos**: id, plan_id (FK), fecha_cambio, usuario_id (FK), tipo_cambio (contacto/texto/descripción), elemento_modificado (tabla y ID), valor_anterior, valor_nuevo, motivo<br>**Reglas permiso edición**: Destinatarios (siempre editable), Textos descriptivos (editable sin versionar), Lógica indicadores/fichas (requiere nueva versión)<br>**Auditoría**: Log detallado de todos los cambios menores, exportar histórico completo | S | Hito 7 | 8 SP |

---

## 🔗 Matriz de Dependencias

| Historia | Depende de | Tipo Dependencia | Notas |
|----------|-----------|------------------|-------|
| EMG-005 | EMG-001, EMG-002, EMG-003, EMG-004 | Fuerte | Requiere catálogos y configuración completa |
| EMG-006 | EMG-005 | Fuerte | Necesita motor de evaluación funcionando |
| EMG-007 | EMG-006 | Fuerte | Necesita propuestas para validar |
| EMG-010 | EMG-007, EMG-014 | Fuerte | Requiere declaraciones y destinatarios |
| EMG-011, EMG-012 | EMG-010 | Fuerte | Secuencial: generar → editar → enviar |
| EMG-013 | EMG-012 | Media | Confirmaciones son complementarias |
| EMG-016 | EMG-001, EMG-003 | Fuerte | Requiere escenarios declarados |
| EMG-019 | EMG-016 | Media | Actuaciones ejecutadas vinculan a definidas |
| EMG-022, EMG-023 | EMG-001 | Media | Cartografías independientes pero enriquecen |
| EMG-026 | EMG-025, EMG-007 | Fuerte | Cascada requiere relaciones + declaraciones |
| EMG-029 | EMG-028 | Fuerte | Diagnóstico requiere sirenas configuradas |
| EMG-033, EMG-034 | EMG-001 a EMG-020 | Media | Simulacros reutilizan todos los módulos |
| EMG-038 | Todas anteriores | Fuerte | Versionado afecta a todos los elementos |

---

## 📊 Estimación y Priorización

### Resumen por Épica

| Épica | User Stories | Story Points | Must Have | Should Have | Could Have | Hito |
|-------|--------------|--------------|-----------|-------------|------------|------|
| **ÉPICA 1**: Infraestructura | 4 | 31 SP | 31 | 0 | 0 | H1 |
| **ÉPICA 2**: Evaluación y Declaración | 5 | 63 SP | 55 | 8 | 0 | H2 |
| **ÉPICA 3**: Comunicaciones | 6 | 52 SP | 44 | 8 | 0 | H3 |
| **ÉPICA 4**: Actuaciones | 6 | 63 SP | 50 | 13 | 0 | H4 |
| **ÉPICA 5**: Información Gráfica | 3 | 29 SP | 8 | 21 | 0 | H6 |
| **ÉPICA 6**: Vinculación Cascada | 3 | 29 SP | 21 | 8 | 0 | H6 |
| **ÉPICA 7**: Equipos de Aviso | 5 | 50 SP | 42 | 8 | 0 | H5 |
| **ÉPICA 8**: Simulacros | 5 | 68 SP | 52 | 16 | 0 | H5 |
| **ÉPICA 9**: Revisiones | 4 | 42 SP | 29 | 13 | 0 | H7 |
| **TOTAL MÓDULO EMERGENCIAS** | **41** | **427 SP** | **332** | **95** | **0** | H1-H7 |

### Distribución por Hito

| Hito | Sprints | Story Points | Épicas Incluidas |
|------|---------|--------------|------------------|
| **Hito 1**: Infraestructura | Sprint 1-2 | 31 SP | ÉPICA 1 |
| **Hito 2**: Evaluación Escenarios | Sprint 3-4 | 63 SP | ÉPICA 2 |
| **Hito 3**: Comunicaciones | Sprint 5-6 | 52 SP | ÉPICA 3 |
| **Hito 4**: Actuaciones | Sprint 7-8 | 63 SP | ÉPICA 4 |
| **Hito 5**: Simulacros + Aviso | Sprint 9-10 | 118 SP | ÉPICA 7, ÉPICA 8 |
| **Hito 6**: Cartografías + Cascada | Sprint 11-12 | 58 SP | ÉPICA 5, ÉPICA 6 |
| **Hito 7**: Revisiones + Cierre | Sprint 13-14 | 42 SP | ÉPICA 9 + Testing |

### Velocidad Estimada
- **Velocidad sprint**: 25-30 SP (equipo de 3-4 desarrolladores)
- **Duración total**: 14 sprints (~7 meses)
- **Dependencias críticas**: Hitos 1-4 secuenciales, Hitos 5-6 paralelizables

---

## 🎯 Criterios de Aceptación Globales

### Para Todas las User Stories

1. **Seguridad**:
   - RLS aplicado en todas las tablas
   - Validación server-side de todos los inputs
   - Auditoría de operaciones críticas

2. **UX/UI**:
   - Responsive (desktop, tablet)
   - Feedback visual inmediato
   - Mensajes de error claros
   - Loading states en operaciones asíncronas

3. **Performance**:
   - Queries < 500ms
   - Carga inicial < 2s
   - Paginación en listados >100 registros

4. **Testing**:
   - Cobertura mínima 70% en lógica de negocio
   - Tests E2E en flujos críticos (declaración, comunicación)
   - Tests de integración en Edge Functions

5. **Documentación**:
   - Comentarios en código complejo
   - README técnico actualizado
   - Manual de usuario funcional

---

## 📝 Notas de Implementación

### Tecnologías Clave

- **Frontend**: React + TypeScript + Tailwind CSS
- **Backend**: Supabase (PostgreSQL + RLS + Edge Functions)
- **Mapas**: Leaflet / Mapbox GL JS para GIS
- **PDFs**: jsPDF o similar para generación de informes
- **Notificaciones**: Supabase Realtime + Email (Resend/SendGrid)

### Consideraciones Normativas

- Retención de datos: 10 años mínimo para declaraciones
- Trazabilidad completa: Auditoría de todas las operaciones
- Accesibilidad: WCAG 2.1 AA
- Protección de datos: GDPR / LOPD compliance

### Integraciones Futuras (Post-Backlog)

- API SCADA para indicadores en tiempo real
- Integración con sistemas CHG existentes
- App móvil para técnicos de campo
- WebSockets para actualizaciones push real-time

---

## ✅ Definition of Done

Una User Story se considera **DONE** cuando:

1. ✅ Código implementado y reviewed
2. ✅ Tests unitarios y de integración pasando
3. ✅ RLS policies aplicadas y verificadas
4. ✅ Interfaz responsive y accesible
5. ✅ Documentación técnica actualizada
6. ✅ Demo funcional en entorno DEV
7. ✅ Aprobado por Product Owner
8. ✅ Desplegado en TEST para QA

---

**Documento generado para**: Kick-off SIPRESAS - Módulo Gestión de Emergencias
**Versión**: 1.0
**Fecha**: 2026-01-28
**Próximos pasos**: Validación con stakeholders → Refinamiento → Inicio Sprint 1
