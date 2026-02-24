# BACKLOG - Módulos Adicionales
## SIPRESAS - Sistema Integral de Presas

---

## 📋 Índice

1. [Módulo Archivo Técnico](#módulo-archivo-técnico)
2. [Módulo Mantenimiento](#módulo-mantenimiento)
3. [Módulo Explotación](#módulo-explotación)
4. [Matriz de Dependencias](#matriz-de-dependencias)
5. [Estimación y Priorización](#estimación-y-priorización)

---

# MÓDULO ARCHIVO TÉCNICO

## 🎯 Visión General

El Módulo de Archivo Técnico gestiona la documentación técnica de las presas, con mejoras enfocadas en rendimiento, organización jerárquica y seguridad de la información según la Política de Seguridad del Organismo de Cuenca.

---

## ÉPICA 1: GESTIÓN DE DOCUMENTOS Y RENDIMIENTO

### Feature 1.1: Optimización de Carga y Descarga

| ID | User Story | Criterios de Aceptación | Campos/Reglas | Prioridad | Hito | Estimación |
|----|------------|------------------------|---------------|-----------|------|------------|
| **ARC-001** | **Como** usuario<br>**Quiero** subir documentos con mayor velocidad<br>**Para** reducir tiempos de espera en la carga de archivos grandes | **Given** archivo de hasta 100MB<br>**When** lo subo al Archivo Técnico<br>**Then** tiempo de carga < 30 segundos en conexión estándar<br><br>**Given** múltiples archivos seleccionados<br>**When** subo batch de archivos<br>**Then** sistema muestra progreso individual y permite cancelar uploads específicos | **Implementación**: Upload multipart con chunking, progress bar granular por archivo<br>**Storage**: Supabase Storage con optimización de chunks (5MB por chunk)<br>**Validaciones**: Tipos de archivo permitidos (PDF, DOC, XLS, DWG, IMG), tamaño máximo 200MB por archivo<br>**Reglas**: Compresión automática de imágenes si >10MB, deduplicación por hash para evitar duplicados | M | Hito 1 | 13 SP |
| **ARC-002** | **Como** usuario<br>**Quiero** descargar documentos rápidamente<br>**Para** acceder ágilmente a la información técnica | **Given** documento almacenado<br>**When** hace clic en "Descargar"<br>**Then** inicio de descarga inmediato con streaming (no espera buffer completo)<br><br>**Given** múltiples archivos seleccionados<br>**When** descarga múltiples<br>**Then** genera ZIP en servidor y descarga comprimido | **Implementación**: Streaming directo desde Storage, URLs firmadas con caducidad 1h<br>**Optimización**: CDN para documentos públicos, caché de metadatos en frontend<br>**Descarga múltiple**: Edge Function que genera ZIP on-the-fly<br>**Reglas**: Límite 500MB por descarga múltiple, log de todas las descargas para auditoría | M | Hito 1 | 8 SP |
| **ARC-003** | **Como** sistema<br>**Quiero** mostrar previsualizaciones de documentos<br>**Para** que usuarios identifiquen archivos sin descargar | **Given** documento PDF<br>**When** usuario pasa cursor sobre archivo<br>**Then** tooltip muestra miniatura primera página<br><br>**Given** documento de imagen (PNG, JPG)<br>**When** visualiza en listado<br>**Then** muestra thumbnail optimizado | **Implementación**: Generación de thumbnails en upload (Edge Function)<br>**Storage**: Carpeta `thumbnails/` con naming convención `{doc_id}_thumb.jpg`<br>**Formatos**: PDF → primera página a JPG 300px, Imágenes → redimensión 150px, DOC/XLS → icono tipo archivo<br>**Reglas**: Generación asíncrona (no bloquea upload), caché de thumbnails 30 días | S | Hito 1 | 8 SP |

### Feature 1.2: Gestión de Ubicaciones

| ID | User Story | Criterios de Aceptación | Campos/Reglas | Prioridad | Hito | Estimación |
|----|------------|------------------------|---------------|-----------|------|------------|
| **ARC-004** | **Como** usuario<br>**Quiero** cambiar la ubicación de un documento editando su ruta<br>**Para** reorganizar archivos sin tener que eliminarlos y subirlos nuevamente | **Given** documento en carpeta actual<br>**When** edito documento y cambio campo "Ruta"<br>**Then** documento se mueve a nueva ubicación manteniendo versionado<br><br>**Given** nueva ruta no existe<br>**When** intento mover documento<br>**Then** sistema pregunta si desea crear ruta automáticamente | **Tabla**: `archivo_documentos`<br>**Campos**: id, nombre_archivo, ruta_actual, ruta_anterior (historial JSON array), presa_id (FK), tipo_documento_id (FK), tamaño_bytes, mime_type, storage_url, fecha_subida, subido_por_id (FK), fecha_última_modificación, versión<br>**Lógica**: Al cambiar ruta → INSERT en `archivo_movimientos` (auditoría) → UPDATE storage_url si necesario<br>**Validaciones**: Ruta válida (formato: /presa/categoría/subcategoría), no duplicados en misma ubicación, permisos según rol<br>**Reglas**: Conserva historial de ubicaciones, notifica a usuarios con acceso previo si documento crítico | M | Hito 2 | 13 SP |
| **ARC-005** | **Como** usuario<br>**Quiero** mover múltiples documentos simultáneamente<br>**Para** reorganizar lotes de archivos eficientemente | **Given** múltiples documentos seleccionados<br>**When** hace clic en "Mover a..." y selecciona carpeta destino<br>**Then** todos los archivos se mueven, mostrando progreso y errores si los hay<br><br>**Given** conflicto de nombres en destino<br>**When** intenta mover<br>**Then** muestra diálogo: renombrar automáticamente, sobrescribir (si permisos), cancelar operación | **Interfaz**: Selección múltiple con checkboxes, modal selector de carpeta destino con árbol expandible<br>**Edge Function**: `mover-documentos-batch` que procesa array de IDs<br>**Reglas**: Transacción atómica (todo o nada opcional), log detallado de operaciones, límite 50 documentos por operación batch<br>**Notificaciones**: Email resumen de movimientos a admin si >20 documentos | S | Hito 2 | 8 SP |

### Feature 1.3: Organización Jerárquica

| ID | User Story | Criterios de Aceptación | Campos/Reglas | Prioridad | Hito | Estimación |
|----|------------|------------------------|---------------|-----------|------|------------|
| **ARC-006** | **Como** usuario<br>**Quiero** reordenar subcarpetas dentro de una carpeta padre<br>**Para** organizar visualmente la estructura según prioridad | **Given** carpeta con múltiples subcarpetas<br>**When** activa modo "Reordenar"<br>**Then** puede arrastrar y soltar subcarpetas para cambiar orden de visualización<br><br>**Given** nuevo orden guardado<br>**When** otros usuarios acceden<br>**Then** visualizan carpetas en orden personalizado | **Tabla**: `archivo_carpetas`<br>**Campos**: id, nombre, ruta_completa, carpeta_padre_id (FK self), presa_id (FK), orden_visualización (integer), descripción, icono, color_badge, fecha_creación, creada_por_id (FK)<br>**Interfaz**: Drag & drop con librería react-beautiful-dnd o similar<br>**Lógica**: Al soltar → recalcula `orden_visualización` de hermanas (1, 2, 3...), persiste en BD<br>**Reglas**: Orden por carpeta padre (no afecta a hermanas de otros padres), auditoría de cambios de orden | M | Hito 2 | 8 SP |
| **ARC-007** | **Como** administrador<br>**Quiero** definir plantillas de estructura de carpetas<br>**Para** estandarizar organización al crear archivo de nueva presa | **Given** plantilla de estructura definida<br>**When** crea archivo técnico de nueva presa<br>**Then** sistema genera automáticamente árbol de carpetas según plantilla<br><br>**Given** plantilla actualizada<br>**When** aplica a presa existente<br>**Then** añade carpetas faltantes sin alterar estructura actual | **Tabla**: `archivo_plantillas_estructura`<br>**Campos**: id, nombre_plantilla, descripción, estructura_json (JSON anidado con árbol de carpetas), tipo_presa (gravedad/arco/tierra), activa (boolean), fecha_creación<br>**JSON ejemplo**: `{"nombre": "Proyecto", "hijos": [{"nombre": "Planos", "hijos": [...]}]}`<br>**Funcionalidad**: Botón "Aplicar Plantilla" en configuración de archivo, previsualización antes de aplicar<br>**Reglas**: No sobrescribe carpetas existentes, solo añade faltantes, log de aplicación de plantillas | S | Hito 2 | 13 SP |

---

## ÉPICA 2: SEGURIDAD Y CLASIFICACIÓN DE INFORMACIÓN

### Feature 2.1: Clasificación de Criticidad

| ID | User Story | Criterios de Aceptación | Campos/Reglas | Prioridad | Hito | Estimación |
|----|------------|------------------------|---------------|-----------|------|------------|
| **ARC-008** | **Como** administrador<br>**Quiero** clasificar documentos por nivel de criticidad<br>**Para** aplicar políticas de seguridad según sensibilidad de información | **Given** documento en Archivo Técnico<br>**When** accede a "Clasificar Documento"<br>**Then** puede asignar: Público, Interno, Confidencial, Secreto<br><br>**Given** documento clasificado como Confidencial<br>**When** usuario sin permisos intenta acceder<br>**Then** acceso denegado con registro en log de intentos | **Tabla**: Añadir a `archivo_documentos` campos: `nivel_criticidad` (enum: publico/interno/confidencial/secreto), `clasificado_por_id` (FK users), `fecha_clasificación`, `motivo_clasificación` (text), `fecha_revisión_clasificación` (para revisiones periódicas)<br>**Matriz permisos**:<br>- Público: Todos los usuarios autenticados<br>- Interno: Usuarios CHG<br>- Confidencial: Roles admin + Director Explotación<br>- Secreto: Solo admin CHG<br>**Reglas RLS**: Políticas Supabase según nivel_criticidad + rol usuario, documentos sin clasificar = Interno por defecto | M | Hito 3 | 13 SP |
| **ARC-009** | **Como** administrador<br>**Quiero** clasificar carpetas completas<br>**Para** aplicar nivel de criticidad a todos los documentos contenidos | **Given** carpeta seleccionada<br>**When** clasifica carpeta con nivel Confidencial<br>**Then** todos los documentos actuales y futuros heredan clasificación<br><br>**Given** documento hereda clasificación de carpeta<br>**When** admin necesita excepcionar un documento<br>**Then** puede asignar clasificación individual que prevalece sobre heredada | **Tabla**: Añadir a `archivo_carpetas` campo `nivel_criticidad_heredado` (nullable)<br>**Lógica**: Al crear documento en carpeta → IF carpeta tiene nivel_criticidad_heredado AND documento no tiene clasificación manual → asigna nivel de carpeta<br>**Prioridad**: Clasificación manual documento > Clasificación carpeta > Interno (default)<br>**Interfaz**: Badge visual en carpetas indicando nivel, icono candado si Confidencial/Secreto<br>**Reglas**: Cambio en clasificación de carpeta no afecta documentos ya clasificados manualmente | M | Hito 3 | 8 SP |
| **ARC-010** | **Como** sistema<br>**Quiero** notificar revisiones periódicas de clasificación<br>**Para** cumplir con política de revisión de criticidad de información | **Given** documento clasificado hace >1 año<br>**When** sistema ejecuta tarea programada<br>**Then** genera alerta a administrador para revisar clasificación<br><br>**Given** admin revisa documento<br>**When** confirma o modifica clasificación<br>**Then** actualiza fecha_revisión_clasificación y resetea contador | **Tabla**: `archivo_revisiones_clasificacion`<br>**Campos**: id, documento_id (FK), fecha_revisión, revisado_por_id (FK), nivel_anterior, nivel_nuevo, motivo_cambio, próxima_revisión<br>**Automatización**: Cron job diario que query documentos con `fecha_revisión_clasificación < NOW() - INTERVAL '1 year'`<br>**Notificaciones**: Email semanal con listado de documentos pendientes revisión<br>**Reglas**: Documentos Secreto revisión semestral, Confidencial anual, Interno cada 2 años | S | Hito 3 | 8 SP |

### Feature 2.2: Control de Acceso Avanzado

| ID | User Story | Criterios de Aceptación | Campos/Reglas | Prioridad | Hito | Estimación |
|----|------------|------------------------|---------------|-----------|------|------------|
| **ARC-011** | **Como** administrador<br>**Quiero** aplicar restricciones por "necesidad de conocer"<br>**Para** limitar acceso a documentos sensibles solo a usuarios autorizados | **Given** documento clasificado como Confidencial<br>**When** admin configura acceso<br>**Then** puede añadir usuarios/roles específicos con permisos: lectura, descarga, edición<br><br>**Given** usuario no autorizado<br>**When** intenta acceder a documento restringido<br>**Then** no aparece en listados ni búsquedas, acceso directo por URL devuelve 403 | **Tabla**: `archivo_permisos_especiales`<br>**Campos**: id, documento_id (FK), user_id (FK nullable), rol (nullable), tipo_permiso (lectura/descarga/edición), otorgado_por_id (FK), fecha_otorgamiento, fecha_expiración (nullable), motivo, contrato_vinculado (text, ej: "Contrato ABC-2024")<br>**RLS Avanzado**: Política que verifica permisos especiales antes de permitir acceso<br>**Interfaz**: Modal de gestión de permisos con búsqueda de usuarios, fecha expiración, campo contrato<br>**Reglas**: Permisos individuales prevalecen sobre rol, log de todos los accesos a documentos Confidencial/Secreto | M | Hito 3 | 13 SP |
| **ARC-012** | **Como** auditor<br>**Quiero** consultar log de accesos a documentos sensibles<br>**Para** verificar cumplimiento de política de seguridad | **Given** usuario auditor<br>**When** accede a "Log de Accesos"<br>**Then** visualiza tabla con: usuario, documento, acción (vista/descarga/intento_denegado), fecha_hora, IP, resultado<br><br>**Given** filtros aplicados<br>**When** filtra por documento Secreto y últimos 30 días<br>**Then** muestra todos los accesos, exportar a Excel para análisis | **Tabla**: `archivo_log_accesos`<br>**Campos**: id, documento_id (FK), user_id (FK), acción (visualización/descarga/edición/intento_acceso_denegado), fecha_hora, ip_origen, user_agent, resultado (éxito/denegado), razón_denegación<br>**Retención**: Logs de documentos Secreto → permanente, Confidencial → 5 años, Interno → 2 años, Público → 6 meses<br>**Interfaz**: Tabla con filtros avanzados (usuario, documento, fecha, acción, resultado), gráficos de accesos por documento/usuario<br>**Reglas**: Logs inmutables, indexados para búsquedas rápidas, exportar CSV/Excel con firma digital | M | Hito 3 | 8 SP |
| **ARC-013** | **Como** administrador<br>**Quiero** recibir alertas de accesos anómalos<br>**Para** detectar posibles brechas de seguridad | **Given** usuario descarga >20 documentos Confidenciales en 1 hora<br>**When** sistema detecta patrón anómalo<br>**Then** genera alerta a administrador con detalles de actividad<br><br>**Given** acceso desde IP no reconocida a documento Secreto<br>**When** sistema detecta acceso<br>**Then** alerta inmediata + requiere verificación adicional (2FA) | **Lógica**: Edge Function trigger en cada acceso que evalúa patrones:<br>- Descargas masivas (>10 docs Confidencial en 1h)<br>- Acceso fuera horario laboral (22h-6h) a docs Secreto<br>- IP geográfica inusual (fuera de España)<br>- Usuario sin acceso previo a tipo de documento<br>**Notificaciones**: Email inmediato a admin + notificación push, dashboard con alertas pendientes revisión<br>**Acciones**: Bloqueo temporal opcional, forzar cambio de contraseña, invalidar sesiones activas<br>**Reglas**: Umbral configurable por tipo de documento, falsos positivos revisables | S | Hito 3 | 13 SP |

---

# MÓDULO MANTENIMIENTO

## 🎯 Visión General

El Módulo de Mantenimiento gestiona inspecciones, trabajos de mantenimiento preventivo y correctivo, con enfoque en generación de informes PDF, integración BIM y trazabilidad de actuaciones.

---

## ÉPICA 3: GESTIÓN DE INSPECCIONES Y TRABAJOS

### Feature 3.1: Partes de Inspección en PDF

| ID | User Story | Criterios de Aceptación | Campos/Regles | Prioridad | Hito | Estimación |
|----|------------|------------------------|---------------|-----------|------|------------|
| **MNT-001** | **Como** operario<br>**Quiero** cerrar una inspección una vez finalizada<br>**Para** que los datos queden bloqueados sin posibilidad de modificación | **Given** inspección con resultados subidos<br>**When** operario hace clic en "Cerrar Inspección"<br>**Then** estado cambia a "Cerrada", formulario no editable, genera timestamp inmutable<br><br>**Given** inspección cerrada<br>**When** intenta editar resultados<br>**Then** muestra mensaje "Inspección cerrada. Contacte administrador para reabrir" | **Tabla**: `mantenimiento_inspecciones`<br>**Campos**: id, orden_trabajo_id (FK), presa_id (FK), equipo_id (FK), tipo_inspección, fecha_programada, fecha_inicio_real, fecha_fin, estado (programada/en_curso/cerrada/cancelada), operario_responsable_id (FK), cerrada_por_id (FK), fecha_cierre, observaciones_cierre<br>**Estados**: programada → en_curso (al iniciar) → cerrada (al cerrar, irreversible sin admin)<br>**Reglas**: Solo operario asignado o supervisor pueden cerrar, timestamp de cierre inmutable, auditoría completa<br>**Reapertura**: Solo admin puede cambiar estado cerrada → en_curso, con justificación obligatoria | M | Hito 4 | 8 SP |
| **MNT-002** | **Como** operario<br>**Quiero** generar PDF del parte de inspección al cerrar<br>**Para** documentar oficialmente los trabajos realizados | **Given** inspección cerrada<br>**When** cierra inspección<br>**Then** sistema genera automáticamente PDF con: datos inspección, equipo inspeccionado, operaciones realizadas, fotos adjuntas, firmas, timestamp<br><br>**Given** PDF generado<br>**When** accede a inspección cerrada<br>**Then** botón "Descargar PDF" disponible, link permanente al PDF | **Edge Function**: `generar-parte-inspeccion-pdf`<br>**Template PDF**:<br>- Carátula: Logo CHG, título "PARTE DE INSPECCIÓN", código inspección, fecha<br>- Datos equipo: Presa, código equipo, ubicación, características<br>- Operaciones: Tabla con descripción, resultado, mediciones, observaciones<br>- Fotos: Inserción de imágenes adjuntas con pie de foto<br>- Firmas: Operario responsable, supervisor (si aplica)<br>**Storage**: `partes-inspeccion/{año}/{presa_id}/{inspeccion_id}.pdf`<br>**Reglas**: Generación asíncrona (notifica cuando esté listo), PDF firmado digitalmente, inmutable tras generación | M | Hito 4 | 13 SP |
| **MNT-003** | **Como** sistema BIM<br>**Quiero** recibir automáticamente el último PDF de inspección de equipos BIM<br>**Para** integrar información de mantenimiento en modelo 3D | **Given** inspección cerrada de equipo marcado como "BIM"<br>**When** genera PDF<br>**Then** sistema envía PDF automáticamente a endpoint BIM configurado<br><br>**Given** envío a BIM exitoso<br>**When** usuario accede a equipo en BIM<br>**Then** PDF disponible como documento adjunto al elemento 3D | **Tabla**: Añadir a `mantenimiento_equipos` campo `integrado_bim` (boolean) + `bim_element_id` (identificador único en BIM)<br>**Integración**: Edge Function que POST a API BIM:<br>```json<br>{<br>  "element_id": "EQ-12345",<br>  "pdf_url": "https://...",<br>  "fecha_inspeccion": "2024-01-15",<br>  "tipo": "inspección_preventiva"<br>}<br>```<br>**Configuración**: Endpoint BIM y credenciales API en variables de entorno<br>**Reglas**: Solo envía última inspección (sobrescribe anterior en BIM), log de envíos, retry automático 3 veces si falla, alerta a admin si error persistente | M | Hito 4 | 13 SP |
| **MNT-004** | **Como** supervisor<br>**Quiero** descargar partes de inspección en PDF (no Excel)<br>**Para** tener formato oficial imprimible | **Given** listado de inspecciones cerradas<br>**When** selecciona una o varias y hace clic en "Descargar"<br>**Then** descarga PDFs (individual o ZIP si múltiples)<br><br>**Given** filtros aplicados (fecha, equipo, operario)<br>**When** hace clic en "Exportar Listado PDF"<br>**Then** genera PDF resumen con tabla de inspecciones y enlaces a partes individuales | **Interfaz**: Botón "Descargar PDF" en cada fila, checkbox para selección múltiple, botón "Descargar Seleccionados"<br>**Descarga múltiple**: Edge Function genera ZIP con naming `Inspecciones_{fecha_inicio}_{fecha_fin}.zip`<br>**PDF Resumen**: Tabla con columnas: código, equipo, fecha, operario, estado, resultado, observaciones<br>**Reglas**: Limitar descarga múltiple a 50 inspecciones, exportar listado sin límite pero sin PDFs adjuntos (solo metadatos) | M | Hito 4 | 8 SP |

### Feature 3.2: Gestión de Operaciones

| ID | User Story | Criterios de Aceptación | Campos/Reglas | Prioridad | Hito | Estimación |
|----|------------|------------------------|---------------|-----------|------|------------|
| **MNT-005** | **Como** operario<br>**Quiero** reordenar líneas de actividad en pestaña "Operaciones"<br>**Para** organizar tareas según secuencia de ejecución | **Given** orden de trabajo con múltiples operaciones<br>**When** activa modo "Reordenar Operaciones"<br>**Then** puede arrastrar y soltar operaciones para cambiar orden<br><br>**Given** operación añadida por defecto al final<br>**When** arrastra operación<br>**Then** puede ubicarla entre operaciones existentes | **Tabla**: `mantenimiento_operaciones`<br>**Campos**: id, orden_trabajo_id (FK), descripción_operación, tipo (preventiva/correctiva/inspección), orden_ejecución (integer), resultado (pendiente/ok/fallo/no_aplica), mediciones (JSON), observaciones, fecha_ejecución, ejecutada_por_id (FK), fotos_urls (JSON array)<br>**Interfaz**: Drag & drop con indicador visual de posición, auto-save al soltar<br>**Lógica**: Al reordenar → recalcula `orden_ejecución` de todas las operaciones de esa orden (1, 2, 3...)<br>**Reglas**: Solo operario asignado u orden no cerrada puede reordenar, auditoría de cambios de orden | M | Hito 5 | 8 SP |
| **MNT-006** | **Como** configurador<br>**Quiero** añadir operaciones a orden de trabajo ya existente<br>**Para** incorporar tareas no previstas inicialmente | **Given** orden de trabajo en curso<br>**When** hace clic en "Añadir Operación"<br>**Then** formulario permite: descripción, tipo, posición (al final o entre existentes)<br><br>**Given** operación añadida<br>**When** guarda<br>**Then** aparece en listado, disponible para cumplimentar, log de adición | **Interfaz**: Botón "+ Añadir Operación" en pestaña operaciones, modal con formulario<br>**Campos formulario**: Descripción (obligatorio), Tipo (dropdown), Insertar después de (dropdown con operaciones existentes, default: "Al final")<br>**Validaciones**: Descripción mínimo 10 caracteres, tipo debe coincidir con tipo orden si orden temática<br>**Reglas**: Solo operario asignado o supervisor pueden añadir, notifica a supervisor si operación añadida a orden programada, auditoría completa | M | Hito 5 | 5 SP |
| **MNT-007** | **Como** supervisor<br>**Quiero** eliminar órdenes de trabajo no realizadas no necesarias<br>**Para** limpiar listado de órdenes "en rojo" que no corresponden | **Given** orden de trabajo generada erróneamente<br>**When** supervisor accede a opciones de orden<br>**Then** puede marcar como "No Necesaria" con justificación obligatoria<br><br>**Given** orden marcada como "No Necesaria"<br>**When** visualiza en cronograma o listados<br>**Then** aparece tachada/gris, no cuenta como pendiente, conserva registro para auditoría | **Tabla**: Añadir a `mantenimiento_ordenes_trabajo` campo `estado_especial` (nullable: no_necesaria/duplicada/cancelada) + `motivo_estado` (text) + `marcada_por_id` (FK users) + `fecha_marca`<br>**Interfaz**: Opción en menú contextual "Marcar como No Necesaria", modal con textarea motivo obligatorio (min 20 chars)<br>**Visualización**: Badge "No Necesaria" en gris, filtro para ocultar/mostrar en listados<br>**Estadísticas**: No cuentan como incumplidas en KPIs de mantenimiento<br>**Reglas**: Solo supervisor o admin pueden marcar, no se puede eliminar físicamente (retención auditoría), reversible con justificación | M | Hito 5 | 8 SP |

---

# MÓDULO EXPLOTACIÓN

## 🎯 Visión General

El Módulo de Explotación gestiona operaciones diarias de presas: evaluación de estado, gestión de avenidas, calculadoras hidráulicas, avisos por afecciones y monitoreo sísmico. Integra datos SAIH y coordina con el módulo Plan de Emergencia.

---

## ÉPICA 4: EVALUACIÓN DE ESTADO DE LA PRESA

### Feature 4.1: Situación Normal vs Extraordinaria

| ID | User Story | Criterios de Aceptación | Campos/Reglas | Prioridad | Hito | Estimación |
|----|------------|------------------------|---------------|-----------|------|------------|
| **EXP-001** | **Como** sistema<br>**Quiero** evaluar estado de la presa según indicadores NEX<br>**Para** determinar si está en Situación Normal o Extraordinaria | **Given** presa con indicadores NEX configurados<br>**When** sistema evalúa indicadores (cuantitativos y cualitativos)<br>**Then** determina estado: Normal o Extraordinaria, registra causa que lo activa<br><br>**Given** indicador cualitativo detectado por operario<br>**When** operario marca indicador como activo<br>**Then** sistema evalúa y propone Situación Extraordinaria si aplica | **Tabla**: `explotacion_evaluaciones_estado`<br>**Campos**: id, presa_id (FK), fecha_evaluación, estado_determinado (normal/extraordinaria), indicadores_activos (JSON array), valores_indicadores (JSON), evaluación_origen (automática/manual), registrado_por_id (FK nullable si manual), observaciones<br>**Lógica**: Similar a evaluación de emergencias pero con indicadores NEX:<br>- Indicadores cuantitativos: Nivel embalse fuera de rango operativo, caudal vertido anómalo, desplazamientos excesivos<br>- Indicadores cualitativos: Filtraciones, grietas, comportamiento anormal compuertas<br>**Reglas**: Evaluación automática cada 15 min, propuesta requiere validación Director Explotación | M | Hito 6 | 13 SP |
| **EXP-002** | **Como** Director de Explotación<br>**Quiero** recibir avisos al superarse indicadores NEX<br>**Para** tomar decisiones operativas inmediatas | **Given** indicador NEX superado<br>**When** sistema detecta situación<br>**Then** genera alerta a Director de Explotación + equipo con: indicador superado, valor actual, valor umbral, recomendaciones NEX<br><br>**Given** múltiples indicadores superados simultáneamente<br>**When** genera avisos<br>**Then** consolida en un solo mensaje con nivel de urgencia agregado | **Notificaciones**: Email + SMS (opcional) + notificación push en app<br>**Contenido**: Presa, indicador(es), valores actuales vs umbrales, tiempo desde detección, acciones recomendadas según NEX, enlace directo a módulo<br>**Prioridades**:<br>- Normal → Sin avisos<br>- Situación Extraordinaria → Aviso inmediato a Director<br>- Escenario 0 PEP alcanzado → Aviso crítico + notifica módulo Emergencias<br>**Reglas**: No spam (máx 1 aviso cada 30 min por mismo indicador salvo cambio significativo >20%), confirmación de recepción requerida | M | Hito 6 | 8 SP |
| **EXP-003** | **Como** Director de Explotación<br>**Quiero** declarar manualmente Situación Extraordinaria<br>**Para** actuar ante situaciones no detectadas automáticamente | **Given** situación operativa anómala<br>**When** Director accede a "Declarar Situación Extraordinaria"<br>**Then** formulario permite: indicador cualitativo, descripción situación, evidencias (fotos), fecha_detección<br><br>**Given** declaración manual<br>**When** confirma<br>**Then** cambia estado presa a Extraordinaria, notifica a equipo, activa protocolo NEX | **Interfaz**: Botón destacado "Declarar Situación Extraordinaria" en dashboard de explotación<br>**Campos**: Tipo indicador cualitativo (filtraciones/grietas/comportamiento_anormal/meteorología_adversa/otro), descripción (min 50 chars), fotos/documentos adjuntos, fecha_hora_detección<br>**Workflow**: Declaración → Notificaciones → Evalúa si alcanza Escenario 0 PEP → Si sí, notifica módulo Emergencias<br>**Reglas**: Solo Director Explotación o Admin pueden declarar, auditoría completa, reversible con justificación | M | Hito 6 | 8 SP |

### Feature 4.2: Integración con Módulo Plan de Emergencia

| ID | User Story | Criterios de Aceptación | Campos/Reglas | Prioridad | Hito | Estimación |
|----|------------|------------------------|---------------|-----------|------|------------|
| **EXP-004** | **Como** sistema<br>**Quiero** compartir estados entre módulos Explotación y Plan de Emergencia<br>**Para** coordinar gestión de situaciones críticas | **Given** presa en Situación Extraordinaria que alcanza indicadores PEP<br>**When** sistema detecta Escenario 0<br>**Then** notifica a módulo Plan de Emergencia, crea propuesta de declaración automática<br><br>**Given** Escenario de emergencia declarado en PEP<br>**When** módulo Emergencias notifica cambio estado<br>**Then** módulo Explotación actualiza dashboard mostrando emergencia activa | **Integración**: Ambos módulos comparten tabla `presas_estado_actual`<br>**Campos compartidos**: presa_id, estado_explotación (normal/extraordinaria), estado_emergencia (escenario 0/1/2/3 o null), fecha_última_actualización, módulo_actualizador (explotacion/emergencias)<br>**Lógica**: Al cambiar estado en un módulo → trigger notifica al otro módulo mediante función compartida<br>**Dashboard**: Widget en Explotación muestra si hay emergencia activa (datos de módulo Emergencias), viceversa en Emergencias<br>**Reglas**: Estado emergencia prevalece sobre estado explotación (si Escenario ≥ 1, módulo Emergencias toma control completo) | M | Hito 6 | 13 SP |

---

## ÉPICA 5: CALCULADORAS HIDRÁULICAS

### Feature 5.1: Actualización de Curvas de Gasto

| ID | User Story | Criterios de Aceptación | Campos/Reglas | Prioridad | Hito | Estimación |
|----|------------|------------------------|---------------|-----------|------|------------|
| **EXP-005** | **Como** administrador técnico<br>**Quiero** actualizar tablas de caudales de órganos de desagüe<br>**Para** reflejar revisiones de curvas de gasto según NEX actualizadas | **Given** revisión de curvas de gasto disponible<br>**When** accede a Configuración > Órganos de Desagüe<br>**Then** puede cargar nueva tabla de caudales (CSV/Excel) con: cota, apertura, caudal_vertido<br><br>**Given** nueva tabla cargada<br>**When** valida datos<br>**Then** sistema compara con tabla anterior, muestra diferencias, solicita confirmación para activar | **Tabla**: `explotacion_curvas_gasto`<br>**Campos**: id, presa_id (FK), organo_desague_id (FK), versión, fecha_vigencia, tabla_caudales (JSON: array de `{cota: float, apertura: float, caudal: float}`), origen (NEX/estudio_específico/medición_campo), documento_soporte_url, activa (boolean)<br>**Interfaz**: Upload CSV con validación de formato, preview de tabla antes de guardar, comparador visual (gráfico) entre versión actual y nueva<br>**Validaciones**: Cota creciente, apertura 0-100%, caudal ≥ 0, sin duplicados (cota+apertura únicos)<br>**Reglas**: Versionado de curvas, conserva histórico, al activar nueva → anterior pasa a histórica | M | Hito 7 | 13 SP |
| **EXP-006** | **Como** operario<br>**Quiero** calcular caudal vertido según cota y apertura<br>**Para** estimar desembalses actuales o planificados | **Given** calculadora hidráulica activa<br>**When** ingresa: órgano_desague, cota_actual, apertura_%<br>**Then** calcula y muestra caudal vertido interpolando tabla de caudales<br><br>**Given** valores fuera de rango de tabla<br>**When** intenta calcular<br>**Then** muestra advertencia "Fuera de rango calibrado" y extrapola con aviso | **Interfaz**: Formulario en página "Calculadoras Hidráulicas"<br>**Campos input**: Presa (dropdown), Órgano (dropdown según presa), Cota embalse (input numérico), Apertura (slider 0-100% + input numérico)<br>**Cálculo**: Interpolación bilineal en tabla de caudales (cota, apertura) → caudal_vertido<br>**Output**: Caudal en m³/s, histórico de cálculos en sesión, botón "Guardar Cálculo" para registro<br>**Reglas**: Usa curva activa vigente, log de cálculos para auditoría, warning si extrapolación >10% fuera de rango calibrado | M | Hito 7 | 8 SP |
| **EXP-007** | **Como** administrador<br>**Quiero** ampliar funcionalidades de calculadoras para aliviaderos de compuertas<br>**Para** soportar casos complejos contemplados en NEX revisadas | **Given** aliviadero con múltiples compuertas<br>**When** configura órgano de desagüe<br>**Then** puede definir: número_compuertas, operatividad individual por compuerta, coeficientes de descarga según configuración<br><br>**Given** cálculo con compuertas parcialmente operativas<br>**When** ejecuta calculadora<br>**Then** considera solo compuertas operativas, aplica coeficientes específicos, muestra desagüe total y por compuerta | **Tabla**: `explotacion_organos_desague`<br>**Campos**: id, presa_id (FK), tipo_organo (aliviadero_compuertas/desagüe_fondo/toma/vertedero_libre), nombre, número_compuertas, ancho_compuerta_m, configuración_compuertas (JSON: `[{id: 1, operativa: true}, ...]`), coeficiente_descarga (por defecto, ajustable), cota_umbral_m<br>**Calculadora Avanzada**: Input adicional "Configuración Compuertas" (checkboxes para marcar operativas), cálculo iterativo por cada compuerta operativa → suma total<br>**Fórmulas**: Implementa fórmulas hidráulicas según NEX (Q = C * L * H^3/2 para vertedero, ajustes por sumergencia)<br>**Reglas**: Documentar fórmulas usadas en tooltip, exportar configuración a SAIH (JSON estándar) | M | Hito 7 | 13 SP |

---

## ÉPICA 6: GESTIÓN DE AVENIDAS

### Feature 6.1: Resguardos Estacionales

| ID | User Story | Criterios de Aceptación | Campos/Reglas | Prioridad | Hito | Estimación |
|----|------------|------------------------|---------------|-----------|------|------------|
| **EXP-008** | **Como** administrador técnico<br>**Quiero** configurar resguardos estacionales por presa<br>**Para** aplicar restricciones de explotación según mes y operatividad de órganos | **Given** NEX de presa con resguardos estacionales<br>**When** accede a Configuración > Resguardos Estacionales<br>**Then** puede definir tabla con: mes, cota_resguardo, porcentaje_embalse, volumen_embalse, configuración_compuertas_requerida<br><br>**Given** configuración guardada<br>**When** visualiza en dashboard<br>**Then** muestra resguardo vigente según mes actual y operatividad | **Tabla**: `explotacion_resguardos_estacionales`<br>**Campos**: id, presa_id (FK), mes (integer 1-12), cota_resguardo_m, porcentaje_embalse, volumen_hm3, calado_sobre_labio_m, volumen_sobre_labio_hm3, configuración_compuertas (JSON: `{n_compuertas_operativas: 3, descripción: "3 compuertas operativas"}`), observaciones<br>**Interfaz**: Tabla editable con 12 filas (meses), duplicar configuración de mes a múltiples meses, validación rangos coherentes<br>**Reglas**: Mínimo un resguardo por presa, cota/volumen deben ser coherentes con curva cota-volumen de presa, versionado según revisión NEX | M | Hito 8 | 13 SP |
| **EXP-009** | **Como** operario<br>**Quiero** configurar operatividad actual de órganos de desagüe<br>**Para** que sistema determine resguardo aplicable | **Given** resguardos estacionales con múltiples configuraciones de compuertas<br>**When** accede a "Configuración Operatividad"<br>**Then** puede marcar compuertas/órganos operativos vs no operativos<br><br>**Given** configuración operatividad modificada<br>**When** guarda cambios<br>**Then** sistema re-evalúa resguardo aplicable, muestra nuevo resguardo, alerta si nivel actual supera nuevo resguardo | **Tabla**: `explotacion_operatividad_actual`<br>**Campos**: id, presa_id (FK), fecha_configuración, organos_operatividad (JSON: `[{organo_id: 1, operativo: true, observaciones: "..."}]`), configurado_por_id (FK), vigente (boolean)<br>**Interfaz**: Checklist visual de órganos con toggle operativo/no operativo, textarea observaciones por órgano, preview de resguardo resultante<br>**Lógica**: Al guardar → query resguardo_estacional WHERE mes=actual AND configuración_compuertas coincide con operatividad → determina resguardo aplicable<br>**Reglas**: Log de todos los cambios de operatividad, notifica a Director si cambio implica superación de resguardo | M | Hito 8 | 8 SP |
| **EXP-010** | **Como** sistema<br>**Quiero** alertar cuando nivel de embalse supera resguardo estacional<br>**Para** notificar a Director de Explotación | **Given** nivel embalse supera resguardo estacional vigente<br>**When** sistema evalúa (cada 15 min)<br>**Then** genera alerta a Director: "⚠️ Resguardo estacional superado. Nivel actual: X m, Resguardo: Y m, Exceso: Z m"<br><br>**Given** alerta generada<br>**When** Director accede<br>**Then** muestra recomendaciones NEX para reducir nivel, calculadora de desembalses sugeridos | **Lógica**: Query cada 15 min:<br>```sql<br>SELECT * FROM presas p<br>JOIN explotacion_resguardos_estacionales r ON p.id = r.presa_id<br>WHERE p.nivel_actual_m > r.cota_resguardo_m<br>AND r.mes = EXTRACT(MONTH FROM NOW())<br>AND configuración_compuertas = (SELECT config actual)<br>```<br>**Notificaciones**: Email + push, no repetir si ya notificado en últimas 2h salvo incremento >0.5m<br>**Dashboard**: Widget destacado "⚠️ Resguardo Superado" con datos actuales<br>**Reglas**: Prioridad según exceso (>1m = crítico, 0.5-1m = alto, <0.5m = medio) | M | Hito 8 | 8 SP |

### Feature 6.2: Laminación de Avenidas

| ID | User Story | Criterios de Aceptación | Campos/Reglas | Prioridad | Hito | Estimación |
|----|------------|------------------------|---------------|-----------|------|------------|
| **EXP-011** | **Como** administrador técnico<br>**Quiero** configurar tablas de laminación por presa según NEX<br>**Para** automatizar recomendaciones de desembalse durante avenidas | **Given** NEX con tablas de laminación<br>**When** accede a Configuración > Laminación Avenidas<br>**Then** puede cargar tablas con: configuración_compuertas, cota_referencia_1/2/3, coeficientes_laminación por nivel<br><br>**Given** múltiples configuraciones de compuertas<br>**When** define tablas<br>**Then** crea tabla específica por cada configuración (3 comp, 2 comp, 1 comp, 0 comp) | **Tabla**: `explotacion_laminacion_tablas`<br>**Campos**: id, presa_id (FK), configuración_compuertas (JSON), cota_referencia_1_m, cota_referencia_2_m, cota_referencia_3_m, coeficiente_laminación_nivel_1, coef_nivel_2, coef_nivel_3, tipo_fase (laminación/normalización), observaciones<br>**Ejemplo de datos** (según imagen proporcionada):<br>- Conf 3 compuertas: cota_ref_1=599.49, coef_1=0.2, cota_ref_2=600.32, coef_2=0.4, cota_ref_3=601.12, coef_3=0.6<br>- Conf 2 compuertas: cota_ref_1=598.51, coef_1=0.2, ...<br>**Interfaz**: Formulario con selector de configuración, inputs para cotas y coeficientes, preview de tabla resultante<br>**Reglas**: Cotas crecientes (ref_1 < ref_2 < ref_3), coeficientes 0-1, versionado según revisión NEX | M | Hito 8 | 13 SP |
| **EXP-012** | **Como** Director de Explotación<br>**Quiero** recibir recomendaciones automáticas de desembalse durante avenida<br>**Para** gestionar laminación según NEX | **Given** avenida en curso (aportaciones elevadas)<br>**When** sistema detecta aumento de nivel + aportaciones<br>**Then** calcula desembalse recomendado: Q_desembalse = coef_laminación * Q_aportación_máxima_48h<br><br>**Given** recomendación calculada<br>**When** Director visualiza<br>**Then** muestra: nivel actual, cota referencia aplicable, aportación máxima 48h, Q_desembalse recomendado, Q_actual, diferencia | **Lógica de cálculo**:<br>1. Obtiene nivel actual embalse → determina cota_referencia aplicable (1/2/3)<br>2. Obtiene configuración operatividad actual → selecciona tabla laminación correspondiente<br>3. Obtiene Q_aportación_máxima_48h (de SAIH o manual)<br>4. Calcula Q_desembalse_recomendado = coef_laminación * Q_aportación_máxima_48h<br>5. Compara con Q_desembalse_actual → sugiere ajustar compuertas si diferencia >10%<br>**Interfaz**: Dashboard "Gestión Avenida" con datos en tiempo real, gráfico evolución nivel/aportaciones/desembalses, panel de recomendaciones destacado<br>**Disclaimers**: "⚠️ RECOMENDACIÓN SEGÚN NEX - Decisión final del Director de Explotación según situación real"<br>**Reglas**: Actualización cada 15 min, log de recomendaciones para auditoría | M | Hito 8 | 13 SP |
| **EXP-013** | **Como** operario<br>**Quiero** introducir datos SAIH manualmente si falla automatización<br>**Para** mantener operatividad en caso de fallo de integración | **Given** integración SAIH no disponible<br>**When** accede a "Datos SAIH Manual"<br>**Then** puede ingresar: nivel_embalse, aportación_última_hora, aportación_máxima_48h<br><br>**Given** datos manuales introducidos<br>**When** guarda<br>**Then** sistema usa datos manuales para cálculos, marca origen como "manual", alerta que no son datos SAIH automáticos | **Tabla**: `explotacion_datos_hidrologicos`<br>**Campos**: id, presa_id (FK), timestamp, nivel_embalse_m, aportación_última_hora_m3s, aportación_máxima_48h_m3s, origen (saih_auto/manual/calculado), registrado_por_id (FK nullable si manual), validado (boolean)<br>**Interfaz**: Formulario emergente con 3 inputs numéricos, validaciones de rangos razonables, timestamp automático<br>**Validaciones**: Nivel entre NMN y NME de presa, aportaciones ≥ 0, aportación_max_48h ≥ aportación_última_hora<br>**Reglas**: Datos manuales prevalecen sobre automáticos hasta nueva medición SAIH, badge visual "MODO MANUAL" en dashboard mientras activo, log completo para auditoría | M | Hito 8 | 8 SP |

### Feature 6.3: Normalización Post-Avenida

| ID | User Story | Criterios de Aceptación | Campos/Reglas | Prioridad | Hito | Estimación |
|----|------------|------------------------|---------------|-----------|------|------------|
| **EXP-014** | **Como** Director de Explotación<br>**Quiero** recibir recomendaciones de normalización tras punta de avenida<br>**Para** reducir desembalses progresivamente manteniendo seguridad | **Given** avenida en fase de descenso (aportaciones decrecientes)<br>**When** sistema detecta pico superado<br>**Then** cambia a modo "Normalización", calcula desembalses: Q_normalización = coef_norm * Q_aportación_actual (no máxima 48h)<br><br>**Given** recomendación normalización<br>**When** visualiza<br>**Then** muestra objetivo: alcanzar resguardo estacional en tiempo prudencial, con curva de reducción sugerida | **Lógica**:<br>1. Detecta pico de avenida: aportación_actual < 0.8 * aportación_máxima_48h (configurable)<br>2. Cambia a tabla de normalización (mismos coef. pero con Q_aportación_actual en vez de max_48h)<br>3. Calcula tiempo estimado para alcanzar resguardo según desembalse sugerido<br>4. Genera curva de reducción progresiva de desembalses<br>**Dashboard**: Widget "Normalización Post-Avenida" con gráfico predictivo de evolución de nivel, tiempo estimado para resguardo, recomendaciones<br>**Reglas**: No sugerir cierre total si aún hay aportaciones significativas (>umbral seguridad), avisar si tiempo normalización >7 días | S | Hito 8 | 13 SP |

### Feature 6.4: Integración con Plan de Emergencia

| ID | User Story | Criterios de Aceptación | Campos/Reglas | Prioridad | Hito | Estimación |
|----|------------|------------------------|---------------|-----------|------|------------|
| **EXP-015** | **Como** sistema<br>**Quiero** detectar cuando avenida alcanza indicadores PEP<br>**Para** notificar módulo Plan de Emergencia y activar Escenario 0 | **Given** gestión de avenida con niveles/aportaciones críticas<br>**When** nivel alcanza umbral Escenario 0 PEP<br>**Then** alerta a Director, propone activación PEP, notifica módulo Emergencias<br><br>**Given** tabla laminación indica "Declaración Escenario 0"<br>**When** condiciones se cumplen<br>**Then** genera propuesta automática en módulo PEP con datos de avenida | **Vinculación**: Query de indicadores PEP relacionados con avenidas (ej: Indicador 1 - Hidrológico)<br>**Lógica**: En cada evaluación de avenida, verifica si (nivel_actual, Q_entrada) cumplen condiciones indicadores PEP → Si sí, trigger notificación<br>**Tabla compartida**: `presas_estado_actual` actualiza estado_emergencia = 'escenario_0_propuesto'<br>**Notificaciones**: Alerta crítica a Director Explotación + Director Plan Emergencia, email inmediato, SMS opcional<br>**Interfaz**: Banner rojo en dashboard Explotación "⚠️ INDICADORES PEP ALCANZADOS - Activar Plan de Emergencia", botón directo para declarar<br>**Reglas**: Propuesta automática requiere confirmación humana, log completo de transición entre módulos | M | Hito 8 | 8 SP |
| **EXP-016** | **Como** Director de Explotación<br>**Quiero** declarar manualmente Escenario 0 desde módulo Explotación<br>**Para** escalar situación ante riesgo mayor del previsto | **Given** avenida gestionándose en Explotación<br>**When** Director considera situación más grave que consignas NEX<br>**Then** botón "Activar Plan Emergencia" disponible, confirma con justificación, notifica módulo PEP<br><br>**Given** declaración manual desde Explotación<br>**When** módulo PEP recibe notificación<br>**Then** crea declaración de Escenario 0 con origen "módulo_explotación", precarga datos avenida | **Interfaz**: Botón destacado "🚨 Activar Plan de Emergencia" en dashboard avenidas<br>**Modal confirmación**: Textarea justificación (min 50 chars), checkbox "He evaluado que situación requiere activación PEP", datos actuales (nivel, aportaciones, desembalses)<br>**Integración**: POST a módulo PEP:<br>```json<br>{<br>  "presa_id": 123,<br>  "causa": "hidrológica",<br>  "escenario": 0,<br>  "origen": "explotación_manual",<br>  "justificación": "...",<br>  "datos_avenida": {...}<br>}<br>```<br>**Reglas**: Solo Director Explotación o superior pueden activar, trazabilidad completa, irreversible (desde ese momento gestión pasa a módulo PEP) | M | Hito 8 | 8 SP |

---

## ÉPICA 7: AVISOS POR AFECCIONES AGUAS ABAJO

### Feature 7.1: Gestión de Avisos SAIH

| ID | User Story | Criterios de Aceptación | Campos/Reglas | Prioridad | Hito | Estimación |
|----|------------|------------------------|---------------|-----------|------|------------|
| **EXP-017** | **Como** sistema<br>**Quiero** recibir avisos hidrológicos SAIH<br>**Para** alertar a Director de Explotación sobre afecciones aguas abajo | **Given** SAIH genera aviso por umbral superado<br>**When** envía aviso a SIPRESAS (webhook/API)<br>**Then** registra aviso con: nivel (amarillo/naranja/rojo), punto_afectado, caudal_actual, umbral_superado, timestamp<br><br>**Given** aviso recibido<br>**When** sistema procesa<br>**Then** notifica Director Explotación, muestra en dashboard con nivel de alerta | **Edge Function**: `recibir-aviso-saih`<br>**Input esperado**:<br>```json<br>{<br>  "presa_id": 123,<br>  "nivel_aviso": "naranja",<br>  "punto_afectado": "Puente XX",<br>  "caudal_actual_m3s": 850,<br>  "umbral_superado_m3s": 800,<br>  "timestamp": "2024-01-15T10:30:00Z",<br>  "descripción": "Caudal supera umbral naranja"<br>}<br>```<br>**Tabla**: `explotacion_avisos_saih`<br>**Campos**: id, presa_id (FK), fecha_hora_aviso, nivel (amarillo/naranja/rojo), punto_afectado, caudal_m3s, umbral_m3s, descripción, gestionado (boolean), fecha_gestión, notas_gestión<br>**Notificaciones**: Email + push según nivel (amarillo=info, naranja=warning, rojo=crítico)<br>**Reglas**: No duplicar avisos idénticos en última hora, acumular si múltiples puntos afectados | M | Hito 9 | 13 SP |
| **EXP-018** | **Como** Director de Explotación<br>**Quiero** visualizar avisos SAIH en dashboard y mapa<br>**Para** tener contexto geográfico de afecciones | **Given** avisos SAIH activos<br>**When** accede a dashboard<br>**Then** widget muestra listado con: punto afectado, nivel aviso, caudal, hora, estado (activo/gestionado)<br><br>**Given** accede a módulo Mapa<br>**When** activa capa "Avisos SAIH"<br>**Then** marcadores en puntos afectados con color según nivel (amarillo/naranja/rojo), tooltip con detalles | **Dashboard**: Widget "Avisos SAIH Activos" con tabla, filtros por nivel, botón "Ver en Mapa"<br>**Integración mapa**: Capa opcional en módulo Mapa con marcadores, colores según nivel, parpadeante si rojo, click abre detalle aviso<br>**Gestión**: Botón "Marcar como Gestionado" que requiere notas (qué medidas se tomaron), aviso pasa a histórico<br>**Reglas**: Avisos activos destacados en header global si nivel rojo, contador de avisos pendientes gestión | M | Hito 9 | 8 SP |

### Feature 7.2: Cartografía de Afecciones

| ID | User Story | Criterios de Aceptación | Campos/Reglas | Prioridad | Hito | Estimación |
|----|------------|------------------------|---------------|-----------|------|------------|
| **EXP-019** | **Como** Director de Explotación<br>**Quiero** visualizar cartografía GIS de afecciones aguas abajo<br>**Para** identificar zonas en riesgo por desembalses operacionales | **Given** presa con estudios de afecciones aguas abajo<br>**When** accede a "Afecciones Aguas Abajo"<br>**Then** visualiza capas GIS con: zonas inundables según caudal, puntos críticos (puentes, poblaciones), umbrales de alerta<br><br>**Given** caudal desembalse actual superando umbral<br>**When** visualiza mapa<br>**Then** zonas afectadas destacadas, puntos críticos en alerta parpadean | **Storage**: Cartografías GIS en formato GeoJSON<br>**Capas**:<br>- Zonas inundables (polígonos con atributo `umbral_caudal_m3s`)<br>- Puntos críticos (marcadores con `nombre`, `tipo`, `umbral_alerta_m3s`)<br>- Tramo río (línea con dirección flujo)<br>**Integración mapa**: Leaflet con capas temáticas, estilos dinámicos según caudal actual vs umbrales<br>**Interactividad**: Click en zona muestra: nombre, umbral, tiempo estimado llegada crecida, población afectada<br>**Reglas**: Cartografías cargadas por admin, actualizables, comparar con desembalse actual para determinar zonas en riesgo | S | Hito 9 | 13 SP |

---

## ÉPICA 8: SITUACIÓN EXTRAORDINARIA POR SISMO

### Feature 8.1: Evaluación Sísmica

| ID | User Story | Criterios de Aceptación | Campos/Reglas | Prioridad | Hito | Estimación |
|----|------------|------------------------|---------------|-----------|------|------------|
| **EXP-020** | **Como** Director de Explotación<br>**Quiero** evaluar efectos de terremotos en mi presa<br>**Para** determinar si requiere Situación Extraordinaria o activación PEP | **Given** datos de terremoto (magnitud, distancia)<br>**When** ingresa en "Evaluación Sísmica"<br>**Then** sistema evalúa según tablas NEX y determina: Sin afección / Situación Extraordinaria / Escenario 0 PEP<br><br>**Given** resultado Situación Extraordinaria<br>**When** sistema evalúa<br>**Then** genera recomendaciones: inspección visual urgente, intensificar lecturas auscultación, avisos a equipo | **Tabla**: `explotacion_umbrales_sismicos`<br>**Campos**: id, presa_id (FK), magnitud_min_richter, magnitud_max_richter, distancia_min_km, distancia_max_km, resultado (sin_afección/situación_extraordinaria/escenario_0_pep), acciones_recomendadas (text)<br>**Ejemplo de datos** (según imagen):<br>- Situación Extraordinaria: M 4.0-4.5 AND R<9km, M 4.5-5.0 AND R<21km, M 5.0-5.5 AND R<44km, ...<br>- Escenario 0: M 4.0-4.5 AND R<3km, M 4.5-5.0 AND R<12km, ...<br>**Interfaz**: Formulario con inputs magnitud y distancia, botón "Evaluar", resultado destacado con color (verde/amarillo/rojo)<br>**Reglas**: Tablas configurables por presa según tipo (gravedad, arco, etc.), versionado según NEX | M | Hito 9 | 13 SP |
| **EXP-021** | **Como** sistema<br>**Quiero** recibir datos sísmicos de IGME automáticamente<br>**Para** evaluar impacto sin intervención manual | **Given** IGME detecta terremoto<br>**When** envía datos a SIPRESAS (webhook/API)<br>**Then** registra evento sísmico, evalúa automáticamente presas en radio afectado, notifica Directores según resultado<br><br>**Given** evaluación indica Escenario 0<br>**When** procesa resultado<br>**Then** notifica módulo Plan de Emergencia automáticamente | **Edge Function**: `recibir-evento-sismico-igme`<br>**Input esperado**:<br>```json<br>{<br>  "magnitud_richter": 5.2,<br>  "latitud": 37.5,<br>  "longitud": -3.8,<br>  "profundidad_km": 10,<br>  "timestamp": "2024-01-15T08:22:00Z",<br>  "id_evento_igme": "ES2024-0015"<br>}<br>```<br>**Lógica**:<br>1. Calcula distancia a todas las presas (haversine)<br>2. Para cada presa en radio <200km: evalúa según tabla umbrales sísmicos<br>3. Genera alertas según resultado<br>4. Notifica Directores afectados + módulo PEP si Escenario 0<br>**Tabla**: `explotacion_eventos_sismicos`<br>**Campos**: id, fecha_hora, magnitud, latitud, longitud, profundidad_km, id_evento_igme, presas_evaluadas (JSON array con resultados)<br>**Reglas**: Procesamiento automático 24/7, fallback a ingreso manual si API IGME no disponible | M | Hito 9 | 13 SP |
| **EXP-022** | **Como** Director de Explotación<br>**Quiero** registrar inspección visual post-sismo<br>**Para** documentar estado de presa tras evento sísmico | **Given** Situación Extraordinaria por sismo declarada<br>**When** realiza inspección visual<br>**Then** puede registrar: fecha, operarios, elementos inspeccionados, anomalías detectadas, fotos, conclusión<br><br>**Given** inspección sin anomalías<br>**When** guarda resultados<br>**Then** sistema sugiere retorno a Situación Normal, genera informe PDF | **Tabla**: `explotacion_inspecciones_sismicas`<br>**Campos**: id, evento_sismico_id (FK), presa_id (FK), fecha_hora_inspección, operarios (text), elementos_inspeccionados (checklist JSON), anomalías_detectadas (text), fotos_urls (JSON array), conclusión (sin_anomalías/anomalías_menores/anomalías_graves), acción_recomendada, cerrada (boolean), pdf_informe_url<br>**Checklist elementos**: Coronación, paramentos, aliviaderos, juntas, instrumentación, cimentación, entorno<br>**PDF**: Similar a parte de inspección, incluye datos sísmico + resultados inspección + fotos + conclusión<br>**Reglas**: Inspección obligatoria para cerrar Situación Extraordinaria por sismo, tiempo máximo 24h tras evento para realizar inspección | S | Hito 9 | 8 SP |

---

## 🔗 Matriz de Dependencias

| Historia | Depende de | Tipo | Notas |
|----------|-----------|------|-------|
| ARC-004 | ARC-001, ARC-002 | Media | Mover archivos requiere gestión base funcionando |
| ARC-005 | ARC-004 | Fuerte | Movimiento múltiple extiende individual |
| ARC-007 | ARC-006 | Media | Plantillas aprovechan sistema de ordenación |
| ARC-009 | ARC-008 | Fuerte | Clasificación carpetas requiere clasificación documentos |
| ARC-011 | ARC-008 | Fuerte | Permisos especiales requieren clasificación previa |
| ARC-013 | ARC-012 | Media | Alertas anómalas usan log de accesos |
| MNT-002 | MNT-001 | Fuerte | Generación PDF requiere cierre de inspección |
| MNT-003 | MNT-002 | Fuerte | Envío a BIM requiere PDF generado |
| MNT-004 | MNT-002 | Media | Descarga requiere PDFs existentes |
| MNT-007 | MNT-001 | Media | Marcar como no necesaria requiere sistema inspecciones |
| EXP-002 | EXP-001 | Fuerte | Avisos requieren evaluación de estado |
| EXP-004 | EXP-001, EMG-007 | Fuerte | Integración requiere ambos módulos operativos |
| EXP-006 | EXP-005 | Fuerte | Calculadora usa curvas actualizadas |
| EXP-009 | EXP-008 | Fuerte | Operatividad determina resguardo aplicable |
| EXP-010 | EXP-008, EXP-009 | Fuerte | Alerta compara nivel vs resguardo según operatividad |
| EXP-012 | EXP-011, EXP-013 | Fuerte | Recomendaciones usan tablas y datos SAIH |
| EXP-014 | EXP-012 | Media | Normalización es fase posterior a laminación |
| EXP-015 | EXP-012, EMG-007 | Fuerte | Activación PEP desde avenida requiere ambos módulos |
| EXP-016 | EXP-015 | Media | Declaración manual complementa automática |
| EXP-018 | EXP-017 | Fuerte | Visualización requiere avisos recibidos |
| EXP-021 | EXP-020 | Media | API automática complementa manual |
| EXP-022 | EXP-020 | Media | Inspección documenta evaluación |

---

## 📊 Estimación y Priorización

### Resumen por Módulo

| Módulo | Épicas | User Stories | Story Points | Must Have | Should Have | Could Have |
|--------|--------|--------------|--------------|-----------|-------------|------------|
| **Archivo Técnico** | 2 | 13 | 142 SP | 77 | 65 | 0 |
| **Mantenimiento** | 1 | 7 | 63 SP | 55 | 8 | 0 |
| **Explotación** | 5 | 22 | 239 SP | 192 | 47 | 0 |
| **TOTAL MÓDULOS** | **8** | **42** | **444 SP** | **324** | **120** | **0** |

### Distribución por Hito

| Hito | Módulo | Sprints | Story Points | Épicas |
|------|--------|---------|--------------|--------|
| **Hito 1**: Rendimiento Archivo | Archivo Técnico | Sprint 1-2 | 29 SP | ÉPICA 1 (parcial) |
| **Hito 2**: Organización Archivo | Archivo Técnico | Sprint 3-4 | 42 SP | ÉPICA 1 (resto) |
| **Hito 3**: Seguridad Archivo | Archivo Técnico | Sprint 5-6 | 71 SP | ÉPICA 2 |
| **Hito 4**: Partes Mantenimiento | Mantenimiento | Sprint 7-8 | 42 SP | ÉPICA 3 (parcial) |
| **Hito 5**: Operaciones Mantenimiento | Mantenimiento | Sprint 9 | 21 SP | ÉPICA 3 (resto) |
| **Hito 6**: Estado Presa Explotación | Explotación | Sprint 10-11 | 42 SP | ÉPICA 4 |
| **Hito 7**: Calculadoras Explotación | Explotación | Sprint 12-13 | 34 SP | ÉPICA 5 |
| **Hito 8**: Avenidas Explotación | Explotación | Sprint 14-17 | 99 SP | ÉPICA 6 |
| **Hito 9**: Avisos y Sismo | Explotación | Sprint 18-19 | 64 SP | ÉPICA 7, ÉPICA 8 |

### Estimación Global

- **Velocidad sprint**: 25-30 SP (equipo de 3-4 desarrolladores)
- **Duración total módulos adicionales**: 19 sprints (~9.5 meses)
- **Duración total proyecto** (incluyendo Emergencias): 33 sprints (~16-17 meses)

---

## ✅ Criterios de Aceptación Globales

### Aplican a Todas las User Stories

1. **Seguridad**:
   - RLS aplicado a todas las tablas nuevas
   - Validación server-side de inputs
   - Auditoría de operaciones críticas
   - Clasificación de información según política CHG

2. **Performance**:
   - Queries < 500ms
   - Carga de archivos con progress bar
   - Optimización de descargas (streaming)
   - Caché donde aplicable

3. **Integraciones**:
   - APIs bien documentadas (OpenAPI/Swagger)
   - Webhooks con retry automático
   - Logs de integraciones para debug
   - Fallback manual si API externa falla

4. **UX/UI**:
   - Responsive design (desktop, tablet)
   - Feedback visual inmediato
   - Loading states en operaciones async
   - Tooltips explicativos en campos complejos

5. **Documentación**:
   - Manual de usuario por módulo
   - Guías de configuración para admin
   - Diagramas de flujo de procesos complejos
   - FAQs basadas en normativa NEX

---

## 📝 Notas de Implementación

### Integraciones Clave

1. **SAIH (Sistema Automático de Información Hidrológica)**:
   - Endpoint: Webhook para recibir datos en tiempo real
   - Datos: Nivel embalse, aportaciones, avisos hidrológicos
   - Formato: JSON REST API
   - Fallback: Ingreso manual de datos

2. **BIM (Building Information Modeling)**:
   - Endpoint: POST de PDFs de inspecciones
   - Autenticación: API Key
   - Mapping: `bim_element_id` en equipos
   - Frecuencia: Cada inspección cerrada

3. **IGME (Instituto Geológico y Minero de España)**:
   - Endpoint: Webhook para eventos sísmicos
   - Datos: Magnitud, coordenadas, timestamp
   - Procesamiento: Cálculo automático distancia a presas
   - Fallback: Ingreso manual de eventos

### Consideraciones Normativas

- **NEX (Normas de Explotación)**: Revisiones periódicas, versionado de configuraciones
- **Política de Seguridad**: Clasificación de información, controles de acceso
- **Auditoría**: Retención de logs según criticidad (5-10 años)
- **GDPR**: Protección de datos personales de operarios/usuarios

---

## 🎯 Próximos Pasos

1. **Validación con stakeholders** (CHG + usuarios finales)
2. **Refinamiento de estimaciones** tras grooming sessions
3. **Priorización definitiva** según presupuesto y recursos
4. **Diseño UX/UI** de pantallas complejas (calculadoras, gestión avenidas)
5. **Definición de contratos de integración** (SAIH, BIM, IGME)
6. **Setup de entornos** y configuraciones iniciales

---

**Documento generado para**: Kick-off SIPRESAS - Módulos Adicionales
**Versión**: 1.0
**Fecha**: 2026-01-28
**Próximos pasos**: Validación → Refinamiento → Inicio implementación secuencial por hitos
