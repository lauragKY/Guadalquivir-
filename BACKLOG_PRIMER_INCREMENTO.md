# SIPRESAS - Backlog Primer Incremento

## Metodología MoSCoW
- **M (Must have)**: Crítico para el primer incremento
- **S (Should have)**: Importante pero no crítico
- **C (Could have)**: Deseable si hay tiempo
- **W (Won't have)**: Fuera del alcance del primer incremento

---

## ÉPICA 1: INFRAESTRUCTURA Y SEGURIDAD

### Feature 1.1: Autenticación y Autorización

| ID | User Story | Criterios de Aceptación (Given/When/Then) | Campos/Reglas | Prioridad | Dependencias |
|----|------------|-------------------------------------------|---------------|-----------|--------------|
| US-001 | **Como** usuario del sistema<br>**Quiero** iniciar sesión con email y contraseña<br>**Para** acceder a la plataforma según mi rol | **Given** usuario registrado en BD<br>**When** ingresa credenciales correctas<br>**Then** accede al dashboard según su rol<br><br>**Given** credenciales incorrectas<br>**When** intenta iniciar sesión<br>**Then** muestra error y no permite acceso | **Campos**: email (válido), password (min 8 chars)<br>**Reglas**: Máx 5 intentos fallidos antes de bloqueo temporal (15 min)<br>**Roles**: Admin CHG, Técnico Explotación, Responsable Presa, Consulta | M (Must) | Ninguna |
| US-002 | **Como** administrador<br>**Quiero** gestionar usuarios y asignar roles<br>**Para** controlar el acceso al sistema | **Given** usuario admin autenticado<br>**When** accede a módulo usuarios<br>**Then** puede crear/editar/desactivar usuarios<br><br>**Given** usuario sin rol admin<br>**When** intenta acceder a gestión usuarios<br>**Then** se deniega el acceso | **Campos**: nombre, apellidos, email, teléfono, rol, estado (activo/inactivo), fecha_alta<br>**Reglas**: Email único, rol obligatorio, al menos un admin activo en sistema | M (Must) | US-001 |
| US-003 | **Como** usuario<br>**Quiero** cerrar sesión<br>**Para** proteger mi cuenta | **Given** usuario autenticado<br>**When** hace clic en "Cerrar sesión"<br>**Then** se invalida token y redirige a login | **Reglas**: Limpia toda la sesión, invalida tokens temporales | M (Must) | US-001 |

### Feature 1.2: Control de Permisos por Rol

| ID | User Story | Criterios de Aceptación (Given/When/Then) | Campos/Reglas | Prioridad | Dependencias |
|----|------------|-------------------------------------------|---------------|-----------|--------------|
| US-004 | **Como** sistema<br>**Quiero** aplicar permisos según rol del usuario<br>**Para** garantizar seguridad y trazabilidad | **Given** usuario con rol "Consulta"<br>**When** intenta editar datos<br>**Then** no muestra botones de edición<br><br>**Given** usuario con rol "Técnico"<br>**When** accede a emergencias<br>**Then** puede crear y editar incidencias | **Matriz de Permisos**:<br>- Admin CHG: CRUD total<br>- Técnico Explotación: CRUD emergencias, lecturas auscultación<br>- Responsable Presa: Visualización + Emergencias de su presa<br>- Consulta: Solo lectura | M (Must) | US-001, US-002 |

---

## ÉPICA 2: DASHBOARD Y NAVEGACIÓN

### Feature 2.1: Dashboard Principal

| ID | User Story | Criterios de Aceptación (Given/When/Then) | Campos/Reglas | Prioridad | Dependencias |
|----|------------|-------------------------------------------|---------------|-----------|--------------|
| US-005 | **Como** usuario autenticado<br>**Quiero** ver un dashboard con KPIs principales<br>**Para** tener visión general del estado del sistema | **Given** usuario autenticado<br>**When** accede al dashboard<br>**Then** visualiza: total presas, emergencias activas, presas con alertas, sensores críticos<br><br>**Given** datos actualizados en BD<br>**When** recarga dashboard<br>**Then** KPIs reflejan datos en tiempo real | **KPIs a mostrar**:<br>- Total Presas Gestionadas<br>- Emergencias Activas (estado != cerrada)<br>- Presas con Alertas (sensores fuera umbral)<br>- Sensores en Estado Crítico<br>**Reglas**: Actualización cada 5 min, colores según criticidad (verde/amarillo/rojo) | M (Must) | US-001 |
| US-006 | **Como** usuario<br>**Quiero** ver listado de últimas emergencias<br>**Para** tener acceso rápido a incidencias recientes | **Given** existen emergencias en BD<br>**When** visualiza sección "Emergencias Recientes"<br>**Then** muestra últimas 5 emergencias con estado, presa, fecha<br><br>**Given** hace clic en una emergencia<br>**When** selecciona el registro<br>**Then** navega al detalle de la emergencia | **Campos por emergencia**: código, presa, tipo, estado, fecha_detección, gravedad<br>**Reglas**: Ordenadas por fecha desc, badge con color según estado | M (Must) | US-005 |
| US-007 | **Como** usuario<br>**Quiero** accesos rápidos a módulos principales<br>**Para** navegar eficientemente | **Given** dashboard cargado<br>**When** usuario ve tarjetas de módulos<br>**Then** puede hacer clic en Presas, Emergencias, Auscultación, Mapa<br><br>**Given** usuario sin permisos para módulo<br>**When** intenta acceder<br>**Then** tarjeta no es clickeable o muestra mensaje | **Módulos**: Presas, Emergencias, Auscultación, Mapa, Admin (solo admin)<br>**Reglas**: Icono + título + descripción breve | S (Should) | US-005 |

### Feature 2.2: Menú de Navegación

| ID | User Story | Criterios de Aceptación (Given/When/Then) | Campos/Reglas | Prioridad | Dependencias |
|----|------------|-------------------------------------------|---------------|-----------|--------------|
| US-008 | **Como** usuario<br>**Quiero** un menú lateral persistente<br>**Para** navegar entre módulos fácilmente | **Given** usuario autenticado<br>**When** accede a cualquier pantalla<br>**Then** menú lateral visible con opciones según rol<br><br>**Given** usuario hace clic en opción<br>**When** selecciona módulo<br>**Then** navega y marca opción activa | **Opciones menú**:<br>- Dashboard<br>- Presas<br>- Emergencias<br>- Auscultación<br>- Mapa<br>- Admin (solo admin)<br>- Configuración<br>**Reglas**: Opción activa destacada, colapsable en móvil | M (Must) | US-001 |

---

## ÉPICA 3: GESTIÓN DE PRESAS

### Feature 3.1: Listado de Presas

| ID | User Story | Criterios de Aceptación (Given/When/Then) | Campos/Reglas | Prioridad | Dependencias |
|----|------------|-------------------------------------------|---------------|-----------|--------------|
| US-009 | **Como** usuario<br>**Quiero** ver listado completo de presas<br>**Para** conocer el inventario gestionado | **Given** existen presas en BD<br>**When** accede a módulo Presas<br>**Then** muestra tabla con: código, nombre, cuenca, tipo, estado_operativo, capacidad<br><br>**Given** listado cargado<br>**When** hace clic en una presa<br>**Then** navega al detalle | **Campos**: código_presa (único), nombre, cuenca_hidrográfica, tipo_presa (gravedad/arco/contrafuertes/tierra), estado_operativo (operativa/mantenimiento/emergencia), capacidad_hm3, altura_metros, año_construcción<br>**Reglas**: Paginación 20 registros, ordenable por columnas | M (Must) | US-001 |
| US-010 | **Como** usuario<br>**Quiero** filtrar presas por cuenca y estado<br>**Para** localizar información específica rápidamente | **Given** listado de presas visible<br>**When** selecciona filtros (cuenca, estado, tipo)<br>**Then** tabla actualiza resultados en tiempo real<br><br>**Given** filtros aplicados<br>**When** hace clic en "Limpiar filtros"<br>**Then** muestra todas las presas | **Filtros**:<br>- Cuenca hidrográfica (dropdown)<br>- Estado operativo (multiselect)<br>- Tipo de presa (multiselect)<br>- Búsqueda por nombre/código (text)<br>**Reglas**: Filtros combinables, contador de resultados | S (Should) | US-009 |
| US-011 | **Como** administrador<br>**Quiero** crear/editar datos maestros de presas<br>**Para** mantener catálogo actualizado | **Given** usuario admin<br>**When** hace clic en "Nueva Presa"<br>**Then** muestra formulario con validaciones<br><br>**Given** formulario completo y válido<br>**When** guarda cambios<br>**Then** crea registro en BD y muestra confirmación | **Campos obligatorios**: código, nombre, cuenca, tipo, capacidad, altura, coordenadas (lat/lon)<br>**Campos opcionales**: año_construcción, responsable_explotación, observaciones<br>**Validaciones**: código único, capacidad > 0, coordenadas formato válido | S (Should) | US-009, US-002 |

### Feature 3.2: Detalle de Presa

| ID | User Story | Criterios de Aceptación (Given/When/Then) | Campos/Reglas | Prioridad | Dependencias |
|----|------------|-------------------------------------------|---------------|-----------|--------------|
| US-012 | **Como** usuario<br>**Quiero** ver ficha completa de presa con pestañas<br>**Para** acceder a toda la información relacionada | **Given** usuario en detalle de presa<br>**When** visualiza pantalla<br>**Then** muestra pestañas: Datos Generales, Sensores, Emergencias Históricas, Documentos<br><br>**Given** usuario cambia de pestaña<br>**When** hace clic en cada tab<br>**Then** carga contenido específico sin recargar página | **Pestañas**:<br>1. **Datos Generales**: Características técnicas, responsable, estado<br>2. **Sensores**: Listado sensores asociados con estado actual<br>3. **Emergencias**: Histórico emergencias de esa presa<br>4. **Documentos**: PDFs planes emergencia, informes<br>**Reglas**: Estado de sensores en tiempo real, colores según criticidad | M (Must) | US-009 |
| US-013 | **Como** usuario<br>**Quiero** ver sensores asociados a la presa<br>**Para** monitorear estado de auscultación | **Given** presa con sensores configurados<br>**When** accede a pestaña Sensores<br>**Then** muestra tabla con: código sensor, tipo, ubicación, última lectura, estado<br><br>**Given** sensor fuera de umbral<br>**When** visualiza listado<br>**Then** marca sensor en rojo con icono alerta | **Campos sensor**: código, tipo (piezómetro/inclinómetro/aforador/sismógrafo/extensómetro), ubicación_descripción, coordenadas, fecha_instalación, umbral_min, umbral_max, última_lectura_valor, última_lectura_fecha, estado (ok/warning/crítico)<br>**Reglas**: Click en sensor navega a histórico auscultación | S (Should) | US-012 |

---

## ÉPICA 4: GESTIÓN DE EMERGENCIAS

### Feature 4.1: Listado y Filtros de Emergencias

| ID | User Story | Criterios de Aceptación (Given/When/Then) | Campos/Reglas | Prioridad | Dependencias |
|----|------------|-------------------------------------------|---------------|-----------|--------------|
| US-014 | **Como** técnico de explotación<br>**Quiero** ver listado de todas las emergencias<br>**Para** gestionar incidencias del sistema | **Given** existen emergencias en BD<br>**When** accede a módulo Emergencias<br>**Then** muestra tabla con: código, presa, tipo, gravedad, estado, fecha_detección, responsable<br><br>**Given** emergencias con diferentes estados<br>**When** visualiza listado<br>**Then** usa colores distintos por estado (detectada/valoración/seguimiento/resolución/cerrada/cancelada) | **Campos**: código_emergencia (auto), presa_id (FK), tipo_emergencia (sísmica/hidrológica/estructural/operacional), gravedad (1-baja/2-media/3-alta), estado, fecha_detección, fecha_cierre, usuario_responsable, descripción<br>**Reglas**: Ordenadas por fecha desc, paginación 25 registros | M (Must) | US-001, US-009 |
| US-015 | **Como** usuario<br>**Quiero** filtrar emergencias por estado, presa y fecha<br>**Para** localizar incidencias específicas | **Given** listado de emergencias<br>**When** aplica filtros (estado, presa, rango fechas, gravedad)<br>**Then** tabla actualiza resultados<br><br>**Given** filtro "Solo Activas"<br>**When** lo activa<br>**Then** muestra solo emergencias en estados != cerrada/cancelada | **Filtros**:<br>- Estado (multiselect con badges)<br>- Presa (dropdown con búsqueda)<br>- Rango fechas (desde-hasta)<br>- Gravedad (1-2-3)<br>- Solo Activas (checkbox)<br>**Reglas**: Contador de resultados, exportar a Excel | M (Must) | US-014 |

### Feature 4.2: Alta y Edición de Emergencias

| ID | User Story | Criterios de Aceptación (Given/When/Then) | Campos/Reglas | Prioridad | Dependencias |
|----|------------|-------------------------------------------|---------------|-----------|--------------|
| US-016 | **Como** técnico<br>**Quiero** registrar una nueva emergencia<br>**Para** activar protocolo de gestión | **Given** usuario con permisos<br>**When** hace clic en "Nueva Emergencia"<br>**Then** muestra formulario con validaciones<br><br>**Given** formulario completo<br>**When** guarda<br>**Then** crea registro con estado "Detectada" y envía notificación (mock) | **Campos obligatorios**: presa, tipo_emergencia, gravedad, descripción (min 20 chars), fecha_detección<br>**Campos opcionales**: ubicación_específica, condiciones_meteorológicas, testigos<br>**Validaciones**: Presa debe existir, fecha no futura, descripción clara<br>**Reglas**: Código auto-generado formato EMG-YYYY-NNNN, timestamp creación, usuario creador | M (Must) | US-014, US-002 |
| US-017 | **Como** técnico<br>**Quiero** editar datos de emergencia<br>**Para** actualizar información conforme avanza la gestión | **Given** emergencia existente<br>**When** accede a edición<br>**Then** permite modificar: gravedad, descripción, responsable<br><br>**Given** emergencia en estado "Cerrada"<br>**When** intenta editar<br>**Then** solo admin puede reabrir o modificar | **Campos editables**: gravedad, descripción, usuario_responsable, observaciones<br>**Campos no editables**: código, presa, fecha_detección, estado (se cambia por workflow)<br>**Reglas**: Log de cambios (auditoría), timestamp última modificación | M (Must) | US-016 |

### Feature 4.3: Workflow de Estados

| ID | User Story | Criterios de Aceptación (Given/When/Then) | Campos/Reglas | Prioridad | Dependencias |
|----|------------|-------------------------------------------|---------------|-----------|--------------|
| US-018 | **Como** técnico<br>**Quiero** cambiar estado de emergencia según workflow<br>**Para** reflejar progreso de gestión | **Given** emergencia en estado "Detectada"<br>**When** cambia a "En Valoración"<br>**Then** actualiza estado y registra cambio con timestamp y usuario<br><br>**Given** emergencia en "Seguimiento"<br>**When** intenta pasar a "Detectada"<br>**Then** no permite (transición inválida) | **Estados válidos**: Detectada → En Valoración → Seguimiento Activo → En Resolución → Cerrada<br>**Estado adicional**: Cancelada (desde cualquier estado previo a Cerrada)<br>**Reglas**: No retroceder estados, obligatorio comentario al cambiar estado, log de transiciones | M (Must) | US-014 |
| US-019 | **Como** usuario<br>**Quiero** ver histórico de cambios de estado<br>**Para** tener trazabilidad completa | **Given** emergencia con cambios de estado<br>**When** accede a pestaña "Histórico"<br>**Then** muestra línea temporal con: fecha, estado_anterior, estado_nuevo, usuario, comentario<br><br>**Given** transición con documentos adjuntos<br>**When** visualiza histórico<br>**Then** muestra enlaces a descargas | **Campos log**: id_transición, emergencia_id, fecha_hora, usuario, estado_origen, estado_destino, comentario, documentos_adjuntos<br>**Reglas**: Inmutable (no se puede borrar), ordenado cronológicamente desc | S (Should) | US-018 |

### Feature 4.4: Actuaciones y Comunicaciones

| ID | User Story | Criterios de Aceptación (Given/When/Then) | Campos/Reglas | Prioridad | Dependencias |
|----|------------|-------------------------------------------|---------------|-----------|--------------|
| US-020 | **Como** técnico<br>**Quiero** registrar actuaciones realizadas<br>**Para** documentar medidas tomadas | **Given** emergencia activa<br>**When** accede a pestaña "Actuaciones"<br>**Then** puede añadir nueva actuación con formulario<br><br>**Given** actuación guardada<br>**When** visualiza listado<br>**Then** muestra: fecha, tipo_actuación, responsable, descripción, resultado | **Campos**: fecha_hora, tipo_actuación (inspección/medición/reparación/evacuación/otro), responsable, descripción (min 30 chars), recursos_utilizados, resultado<br>**Reglas**: Al menos una actuación antes de cerrar emergencia, adjuntar fotos/documentos | M (Must) | US-014 |
| US-021 | **Como** técnico<br>**Quiero** registrar comunicaciones oficiales<br>**Para** mantener trazabilidad de notificaciones | **Given** emergencia activa<br>**When** accede a pestaña "Comunicaciones"<br>**Then** puede registrar: destinatario, fecha_hora, canal, resumen<br><br>**Given** comunicación crítica<br>**When** marca como "urgente"<br>**Then** destaca en rojo y notifica a supervisor | **Campos**: fecha_hora, destinatario (CHG/Protección Civil/Ayuntamiento/Prensa), canal (email/teléfono/presencial/reunión), tipo (informativa/alerta/todo despejado), resumen, respuesta_recibida<br>**Reglas**: Comunicaciones ordenadas cronológicamente, exportar a PDF | S (Should) | US-014 |

### Feature 4.5: Activación de Plan de Emergencia (Mock)

| ID | User Story | Criterios de Aceptación (Given/When/Then) | Campos/Reglas | Prioridad | Dependencias |
|----|------------|-------------------------------------------|---------------|-----------|--------------|
| US-022 | **Como** responsable de presa<br>**Quiero** activar plan de emergencia<br>**Para** ejecutar protocolo oficial ante riesgo grave | **Given** emergencia con gravedad 3<br>**When** hace clic en "Activar Plan Emergencia"<br>**Then** muestra modal con checklist y botón confirmar (mock)<br><br>**Given** confirma activación<br>**When** guarda<br>**Then** registra activación, cambia estado a "Seguimiento Activo", simula envío notificaciones | **Mock incluye**:<br>- Checklist: Notificar CHG, Notificar Protección Civil, Avisar responsables, Revisar niveles<br>- Botón "Activar Plan"<br>- Confirmación "Plan activado correctamente"<br>**Reglas**: Solo gravedad 3, registrar usuario y timestamp, no integración real (primer incremento) | C (Could) | US-018, US-014 |

---

## ÉPICA 5: AUSCULTACIÓN Y MONITOREO

### Feature 5.1: Gestión de Sensores

| ID | User Story | Criterios de Aceptación (Given/When/Then) | Campos/Reglas | Prioridad | Dependencias |
|----|------------|-------------------------------------------|---------------|-----------|--------------|
| US-023 | **Como** administrador<br>**Quiero** dar de alta sensores<br>**Para** configurar sistema de monitoreo | **Given** usuario admin<br>**When** accede a "Nuevo Sensor"<br>**Then** formulario permite ingresar: código, tipo, presa, ubicación, umbrales<br><br>**Given** sensor creado<br>**When** guarda<br>**Then** sensor disponible para recibir lecturas | **Campos**: código_sensor (único), presa_id (FK), tipo_sensor (piezómetro/inclinómetro/aforador/extensómetro/sismógrafo/otro), ubicación_descripción, coordenadas_lat_lon, cota_instalación, fecha_instalación, umbral_min, umbral_max, unidad_medida, estado_sensor (activo/inactivo/mantenimiento)<br>**Validaciones**: Código único, umbrales numéricos coherentes (min < max) | M (Must) | US-009, US-002 |
| US-024 | **Como** usuario<br>**Quiero** ver listado de sensores por presa<br>**Para** conocer puntos de monitoreo | **Given** presa con sensores configurados<br>**When** accede a módulo Auscultación<br>**Then** muestra tabla con todos los sensores y su estado actual<br><br>**Given** sensor con última lectura fuera de umbral<br>**When** visualiza listado<br>**Then** sensor marcado en rojo/amarillo según criticidad | **Campos visualizados**: código, tipo, ubicación, última_lectura, fecha_última_lectura, estado (OK/Warning/Crítico), presa<br>**Reglas**: Filtrar por presa, tipo sensor, estado, ordenar por criticidad | M (Must) | US-023 |

### Feature 5.2: Registro de Lecturas Manuales

| ID | User Story | Criterios de Aceptación (Given/When/Then) | Campos/Reglas | Prioridad | Dependencias |
|----|------------|-------------------------------------------|---------------|-----------|--------------|
| US-025 | **Como** técnico de campo<br>**Quiero** registrar lectura manual de sensor<br>**Para** alimentar histórico de datos | **Given** sensor activo<br>**When** hace clic en "Nueva Lectura"<br>**Then** formulario con: sensor, fecha_hora, valor, observaciones<br><br>**Given** valor fuera de umbrales<br>**When** ingresa lectura<br>**Then** muestra alerta visual y solicita confirmación | **Campos**: sensor_id, fecha_hora_lectura, valor_medido, unidad, observaciones, usuario_registrador, validada (boolean)<br>**Validaciones**: Valor numérico, fecha no futura, sensor debe estar activo<br>**Reglas**: Si fuera umbral, genera alerta automática | M (Must) | US-023 |
| US-026 | **Como** técnico<br>**Quiero** editar/anular lectura errónea<br>**Para** corregir datos incorrectos | **Given** lectura registrada<br>**When** accede a edición dentro de 24h<br>**Then** permite modificar valor y observaciones<br><br>**Given** lectura > 24h<br>**When** intenta editar<br>**Then** solo puede añadir nota de corrección (no modifica dato original) | **Reglas**: Log de modificaciones, conservar valor original, flag "corregida", solo usuario original o admin pueden modificar<br>**Campos log**: lectura_id, fecha_modificación, valor_original, valor_nuevo, usuario, motivo | S (Should) | US-025 |

### Feature 5.3: Histórico y Gráficos

| ID | User Story | Criterios de Aceptación (Given/When/Then) | Campos/Reglas | Prioridad | Dependencias |
|----|------------|-------------------------------------------|---------------|-----------|--------------|
| US-027 | **Como** usuario<br>**Quiero** ver gráfico histórico de sensor<br>**Para** analizar tendencias y anomalías | **Given** sensor con histórico de lecturas<br>**When** accede a pestaña "Histórico"<br>**Then** muestra gráfico línea temporal con valores, umbrales y alertas<br><br>**Given** usuario filtra rango fechas<br>**When** ajusta período<br>**Then** gráfico actualiza datos visualizados | **Funcionalidades gráfico**:<br>- Eje X: tiempo (día/semana/mes/año)<br>- Eje Y: valor con unidad medida<br>- Líneas umbrales (min/max) en colores<br>- Puntos fuera umbral destacados<br>- Zoom y tooltip con datos exactos<br>**Reglas**: Exportar a imagen/PDF, librería Recharts | M (Must) | US-025 |
| US-028 | **Como** analista<br>**Quiero** comparar lecturas de múltiples sensores<br>**Para** detectar patrones o comportamientos anómalos | **Given** varios sensores de misma presa<br>**When** selecciona sensores y rango fechas<br>**Then** gráfico superpone series de datos en diferentes colores<br><br>**Given** sensores con diferentes unidades<br>**When** intenta comparar<br>**Then** muestra advertencia o normaliza escalas | **Funcionalidades**:<br>- Selección múltiple sensores (max 5)<br>- Leyenda con colores<br>- Misma escala temporal<br>**Reglas**: Solo sensores de misma presa o tipo, exportar comparativa | C (Could) | US-027 |

### Feature 5.4: Alertas por Umbral (Mock)

| ID | User Story | Criterios de Aceptación (Given/When/Then) | Campos/Reglas | Prioridad | Dependencias |
|----|------------|-------------------------------------------|---------------|-----------|--------------|
| US-029 | **Como** sistema<br>**Quiero** generar alerta cuando lectura supera umbrales<br>**Para** notificar a responsables de anomalías | **Given** lectura fuera de umbral<br>**When** se registra en BD<br>**Then** crea alerta con nivel warning/crítico según desviación<br><br>**Given** alerta generada<br>**When** usuario accede a módulo alertas<br>**Then** visualiza lista priorizada con: sensor, valor, umbral, fecha, estado (activa/resuelta) | **Campos alerta**: id_alerta, sensor_id, lectura_id, tipo_alerta (umbral_min/umbral_max), nivel (warning si 10-20% fuera, crítico si >20%), fecha_hora_alerta, estado_alerta (activa/reconocida/resuelta), usuario_responsable, notas_resolución<br>**Mock**: No envía emails/SMS reales en primer incremento | M (Must) | US-025, US-023 |
| US-030 | **Como** técnico<br>**Quiero** reconocer y resolver alertas<br>**Para** gestionar anomalías detectadas | **Given** alerta activa<br>**When** hace clic en "Reconocer"<br>**Then** cambia estado a "reconocida" y asigna responsable<br><br>**Given** alerta reconocida<br>**When** ejecuta actuación correctiva y marca "Resuelta"<br>**Then** cierra alerta, registra fecha_resolución y notas | **Workflow**: Activa → Reconocida → Resuelta<br>**Campos adicionales**: fecha_reconocimiento, usuario_reconoce, fecha_resolución, usuario_resuelve, notas_resolución<br>**Reglas**: Obligatorio añadir notas al resolver, vincular con actuación si existe emergencia asociada | S (Should) | US-029 |

---

## ÉPICA 6: VISUALIZACIÓN GEOGRÁFICA

### Feature 6.1: Mapa Interactivo de Presas

| ID | User Story | Criterios de Aceptación (Given/When/Then) | Campos/Reglas | Prioridad | Dependencias |
|----|------------|-------------------------------------------|---------------|-----------|--------------|
| US-031 | **Como** usuario<br>**Quiero** visualizar presas en mapa interactivo<br>**Para** tener visión geográfica del sistema | **Given** presas con coordenadas<br>**When** accede a módulo Mapa<br>**Then** muestra mapa con marcadores en ubicación de cada presa<br><br>**Given** presa con emergencia activa<br>**When** visualiza mapa<br>**Then** marcador en color rojo/amarillo según gravedad | **Funcionalidades**:<br>- Mapa base (OpenStreetMap/Leaflet)<br>- Marcadores con colores según estado (verde: OK, amarillo: alerta, rojo: emergencia)<br>- Tooltip con: nombre presa, estado, última incidencia<br>**Reglas**: Click en marcador abre detalle presa, zoom y paneo | S (Should) | US-009 |
| US-032 | **Como** usuario<br>**Quiero** ver sensores en mapa de detalle de presa<br>**Para** ubicar puntos de monitoreo físicamente | **Given** presa con sensores geo-referenciados<br>**When** accede a vista mapa desde detalle presa<br>**Then** muestra cuerpo de presa con marcadores de sensores<br><br>**Given** sensor fuera de umbral<br>**When** visualiza mapa<br>**Then** marcador sensor en rojo parpadeante | **Funcionalidades**:<br>- Mapa detalle presa<br>- Marcadores sensores con iconos según tipo<br>- Click en sensor muestra última lectura y estado<br>**Reglas**: Capa de satélite para mejor contexto | C (Could) | US-031, US-023 |

---

## ÉPICA 7: ADMINISTRACIÓN Y CATÁLOGOS

### Feature 7.1: Gestión de Catálogos Básicos

| ID | User Story | Criterios de Aceptación (Given/When/Then) | Campos/Reglas | Prioridad | Dependencias |
|----|------------|-------------------------------------------|---------------|-----------|--------------|
| US-033 | **Como** administrador<br>**Quiero** gestionar catálogos maestros<br>**Para** mantener valores de referencia actualizados | **Given** usuario admin<br>**When** accede a Configuración > Catálogos<br>**Then** puede CRUD en: Tipos Emergencia, Tipos Sensor, Cuencas Hidrográficas, Estados<br><br>**Given** intenta eliminar valor usado en registros<br>**When** hace clic en eliminar<br>**Then** muestra advertencia y requiere confirmación o impide borrado | **Catálogos**:<br>1. **Tipos Emergencia**: código, nombre, descripción, requiere_plan (boolean)<br>2. **Tipos Sensor**: código, nombre, unidad_medida_default<br>3. **Cuencas**: código, nombre, demarcación<br>4. **Estados Operativos Presa**: código, nombre, color<br>**Reglas**: Códigos únicos, auditoría de cambios | M (Must) | US-002 |

### Feature 7.2: Configuración de Sistema

| ID | User Story | Criterios de Aceptación (Given/When/Then) | Campos/Reglas | Prioridad | Dependencias |
|----|------------|-------------------------------------------|---------------|-----------|--------------|
| US-034 | **Como** administrador<br>**Quiero** configurar parámetros generales<br>**Para** adaptar comportamiento del sistema | **Given** usuario admin<br>**When** accede a Configuración > Sistema<br>**Then** puede editar: umbral_alerta_global, intervalo_refresco_dashboard, email_notificaciones, logos<br><br>**Given** cambia configuración<br>**When** guarda<br>**Then** aplica cambios inmediatamente (o tras reinicio según parámetro) | **Parámetros**:<br>- Intervalo refresco dashboard (minutos)<br>- Email contacto CHG<br>- Umbral alertas global (%)<br>- Logo organismo (upload imagen)<br>- Formato fecha/hora preferido<br>**Reglas**: Validaciones según tipo parámetro, histórico de cambios | S (Should) | US-002 |

---

## ÉPICA 8: REPORTES Y AUDITORÍA

### Feature 8.1: Auditoría de Acciones

| ID | User Story | Criterios de Aceptación (Given/When/Then) | Campos/Reglas | Prioridad | Dependencias |
|----|------------|-------------------------------------------|---------------|-----------|--------------|
| US-035 | **Como** administrador<br>**Quiero** consultar log de auditoría<br>**Para** revisar trazabilidad de operaciones críticas | **Given** usuario admin<br>**When** accede a Auditoría<br>**Then** visualiza tabla con: fecha, usuario, módulo, acción, registro_afectado, resultado<br><br>**Given** aplica filtros<br>**When** filtra por usuario, fecha, módulo<br>**Then** resultados actualizados, exportar a CSV | **Campos log**: timestamp, usuario_id, módulo (presas/emergencias/sensores/admin), acción (create/update/delete/login), tabla_afectada, id_registro, valores_anteriores (JSON), valores_nuevos (JSON), ip_origen, resultado (éxito/error)<br>**Reglas**: Inmutable, retención 2 años, indexado para búsquedas rápidas | S (Should) | US-002 |

### Feature 8.2: Reportes Predefinidos

| ID | User Story | Criterios de Aceptación (Given/When/Then) | Campos/Reglas | Prioridad | Dependencias |
|----|------------|-------------------------------------------|---------------|-----------|--------------|
| US-036 | **Como** responsable presa<br>**Quiero** generar informe de estado de presa<br>**Para** cumplir reporting periódico | **Given** presa seleccionada<br>**When** hace clic en "Generar Informe"<br>**Then** crea PDF con: datos presa, sensores, lecturas últimos 30d, emergencias período, gráficos<br><br>**Given** informe generado<br>**When** descarga<br>**Then** PDF nombrado: "Informe_[NombrePresa]_[Fecha].pdf" | **Contenido informe**:<br>- Carátula con logo CHG<br>- Datos generales presa<br>- Resumen sensores y estado<br>- Gráficos evolución lecturas<br>- Emergencias último trimestre<br>- Conclusiones y recomendaciones<br>**Reglas**: Generación asíncrona si > 1000 lecturas | C (Could) | US-009, US-027 |

---

## RESUMEN PRIORIZACIÓN MoSCoW PRIMER INCREMENTO

### Must Have (26 US) - Core funcional mínimo
- US-001 a US-008: Autenticación, permisos, navegación (8)
- US-009, US-012, US-014: Listados básicos presas/emergencias (3)
- US-016 a US-018: Alta emergencias + workflow (3)
- US-020: Actuaciones emergencias (1)
- US-023 a US-025: Sensores + lecturas manuales (3)
- US-027: Gráficos histórico (1)
- US-029: Alertas por umbral (1)
- US-033: Catálogos maestros (1)

### Should Have (12 US) - Valor añadido importante
- US-010, US-011: Filtros presas + CRUD (2)
- US-013: Sensores en detalle presa (1)
- US-015: Filtros emergencias (1)
- US-019: Histórico estados (1)
- US-021: Comunicaciones (1)
- US-026: Editar lecturas (1)
- US-030: Gestión alertas (1)
- US-031: Mapa básico (1)
- US-034: Configuración sistema (1)
- US-035: Auditoría (1)

### Could Have (5 US) - Nice to have
- US-007: Accesos rápidos dashboard (1)
- US-022: Activar plan emergencia (mock) (1)
- US-028: Comparar sensores (1)
- US-032: Mapa sensores detalle (1)
- US-036: Reportes PDF (1)

### Won't Have (Fuera del primer incremento)
- Integración API sensores automáticos (IoT)
- Notificaciones push/SMS reales
- App móvil nativa
- Integración con sistemas externos CHG
- Portal público ciudadano
- Inteligencia artificial predictiva
- Gestión documental avanzada

---

## DEPENDENCIAS CRÍTICAS PARA INICIAR DESARROLLO

1. **Infraestructura**:
   - Entorno Supabase configurado (✅ ya disponible)
   - Repositorio Git + Azure DevOps configurado
   - Entornos DEV/TEST/PROD definidos

2. **Datos Maestros Iniciales**:
   - Lista oficial presas CHG con coordenadas
   - Catálogo tipos emergencia (normativa aplicable)
   - Catálogo tipos sensores estándar
   - Cuencas hidrográficas jurisdicción

3. **Diseño UX/UI**:
   - Paleta colores corporativa CHG
   - Logo oficial alta resolución
   - Iconografía estados/prioridades

4. **Validaciones Pendientes**:
   - Workflow estados emergencia (¿6 estados correctos?)
   - Umbrales alertas (% desviación warning/crítico)
   - Roles y permisos (¿4 roles suficientes o necesitan subdivisión?)
   - Integraciones futuras requeridas (APIs externas)

---

## ESTIMACIÓN ALTA NIVEL (Story Points - Fibonacci)

| Épica | Must Have | Should Have | Could Have | Total SP |
|-------|-----------|-------------|------------|----------|
| Infraestructura y Seguridad | 21 | - | - | 21 |
| Dashboard y Navegación | 13 | 5 | 3 | 21 |
| Gestión Presas | 8 | 13 | - | 21 |
| Gestión Emergencias | 34 | 13 | 5 | 52 |
| Auscultación y Monitoreo | 21 | 8 | 8 | 37 |
| Visualización Geográfica | - | 8 | 5 | 13 |
| Administración | 8 | 8 | - | 16 |
| Reportes y Auditoría | - | 8 | 5 | 13 |
| **TOTAL PRIMER INCREMENTO** | **105** | **63** | **26** | **194 SP** |

**Nota**: Velocidad estimada 20-25 SP/sprint → Primer incremento completo en ~8-10 sprints (4-5 meses)

---

## CRITERIOS DE ACEPTACIÓN GENERALES (Aplican a todas las US)

1. **Responsive Design**: Funcional en desktop (1920x1080), tablet (768x1024), móvil (375x667)
2. **Performance**: Carga inicial < 3s, interacciones < 500ms
3. **Accesibilidad**: Contraste WCAG AA, navegación por teclado, alt en imágenes
4. **Seguridad**: No exponer datos sensibles en frontend, validación server-side
5. **Testing**: Cobertura mínima 70% en lógica negocio, E2E en flujos críticos
6. **Documentación**: README técnico, manual usuario funcional

---

**Documento generado para**: SIPRESAS - Sistema de Presas y Auscultación
**Versión**: 1.0
**Fecha**: 2026-01-28
**Próximos pasos**: Validar con CHG → Refinar estimaciones → Priorizar Sprint 1
