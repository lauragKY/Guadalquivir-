# Backlog del Módulo de Mantenimiento - SIPRESAS

## Resumen del Módulo

El Módulo de Mantenimiento gestiona todas las actividades de mantenimiento preventivo, correctivo y predictivo de las presas, incluyendo órdenes de trabajo, programación, ejecución, cierre y generación de informes.

---

## Épicas del Módulo

### ÉPICA 1: Gestión de Órdenes de Trabajo (OT)
**Descripción**: Sistema completo para crear, gestionar y ejecutar órdenes de trabajo de mantenimiento.

**Valor de Negocio**: Permite planificar y ejecutar mantenimientos de forma estructurada, asegurando trazabilidad completa.

**Dependencias de Módulos**:
- **Inventario**: Para obtener equipos e infraestructuras
- **Archivo Técnico**: Para vincular documentación técnica
- **Auscultación**: Para alertas que generen OT correctivas
- **Emergencias**: Para OT urgentes derivadas de situaciones críticas

---

### ÉPICA 2: Programación y Planificación
**Descripción**: Calendario de mantenimientos preventivos basado en frecuencias, criticidad y disponibilidad de recursos.

**Valor de Negocio**: Optimiza recursos y evita fallos por falta de mantenimiento.

**Dependencias de Módulos**:
- **Inventario**: Para datos de equipos críticos y frecuencias recomendadas
- **Explotación**: Para coordinar paradas operativas

---

### ÉPICA 3: Ejecución y Seguimiento
**Descripción**: Registro detallado de actividades realizadas, materiales utilizados, personal asignado y tiempo invertido.

**Valor de Negocio**: Trazabilidad completa de todas las intervenciones realizadas.

**Dependencias de Módulos**:
- **Inventario**: Para registro de materiales consumidos
- **Archivo Técnico**: Para procedimientos de trabajo

---

### ÉPICA 4: Cierre y Documentación
**Descripción**: Proceso de cierre de OT con validación, generación de informes y actualización del historial.

**Valor de Negocio**: Garantiza que todos los trabajos se completen adecuadamente y quede registro permanente.

**Dependencias de Módulos**:
- **BIM**: Para vincular informes PDF al modelo 3D
- **Archivo Técnico**: Para almacenar informes generados

---

### ÉPICA 5: Indicadores y Analítica
**Descripción**: KPIs de mantenimiento, análisis de tendencias y reportes gerenciales.

**Valor de Negocio**: Soporte a la toma de decisiones basada en datos.

**Dependencias de Módulos**:
- **Inventario**: Para correlacionar fallos con equipos
- **Auscultación**: Para análisis predictivo

---

## Historias de Usuario Detalladas

---

## ÉPICA 1: Gestión de Órdenes de Trabajo

### US-MNT-001: Crear Orden de Trabajo Preventiva
**Como**: Técnico de Mantenimiento
**Quiero**: Crear una OT preventiva programada
**Para**: Asegurar el mantenimiento regular de equipos críticos

**Criterios de Aceptación**:
1. Puedo seleccionar la presa desde el selector global
2. Puedo elegir el tipo de mantenimiento: Preventivo, Correctivo, Predictivo
3. Puedo asignar prioridad: Baja, Media, Alta, Urgente
4. Puedo vincular equipos o infraestructuras del inventario
5. Puedo programar fecha prevista de ejecución
6. Puedo asignar técnicos responsables
7. Puedo adjuntar documentación de referencia
8. El sistema genera automáticamente un código único (OT-YYYY-XXX)
9. Se crea un registro en `maintenance_work_orders` con estado "pending"
10. Se envía notificación al responsable asignado

**Definición de Hecho**:
- Formulario funcional con validaciones
- Integración con inventario para selección de equipos
- Generación automática de código
- Notificaciones implementadas
- Tests unitarios y de integración

**Dependencias**:
- Módulo de Inventario operativo
- Sistema de notificaciones configurado
- Datos maestros de personal disponibles

**Estimación**: 8 puntos

---

### US-MNT-002: Crear Orden de Trabajo Correctiva de Emergencia
**Como**: Operador de Presa
**Quiero**: Crear una OT correctiva urgente
**Para**: Responder rápidamente a fallos detectados

**Criterios de Aceptación**:
1. Puedo crear OT con prioridad "Urgente" desde cualquier módulo
2. Puedo describir el problema detectado
3. Puedo adjuntar fotos del fallo
4. El sistema sugiere técnicos disponibles según turno
5. Se puede vincular desde alertas de auscultación
6. Se puede vincular desde situaciones de emergencia
7. Notificación inmediata a responsable de turno
8. El estado inicial es "in_progress" si es urgente
9. Se registra hora exacta de detección del fallo
10. Se calcula SLA según criticidad del equipo

**Definición de Hecho**:
- Formulario rápido de creación
- Integración con módulos de Auscultación y Emergencias
- Sistema de notificaciones push inmediatas
- Cálculo automático de SLA
- Tests de flujo completo

**Dependencias**:
- Módulo de Emergencias (para integración)
- Módulo de Auscultación (para alertas automáticas)
- Sistema de turnos y disponibilidad de personal

**Estimación**: 13 puntos

---

### US-MNT-003: Visualizar Lista de Órdenes de Trabajo
**Como**: Jefe de Mantenimiento
**Quiero**: Ver todas las OT filtradas por estado y presa
**Para**: Supervisar el trabajo del equipo

**Criterios de Aceptación**:
1. Veo tabla con todas las OT de la presa seleccionada
2. Puedo filtrar por estado: Pendiente, En Progreso, Completada, Cancelada
3. Puedo filtrar por tipo de mantenimiento
4. Puedo filtrar por prioridad
5. Puedo filtrar por rango de fechas
6. Veo código, título, equipo, responsable, fecha y estado
7. Puedo ordenar por cualquier columna
8. Puedo buscar por texto en código o título
9. Veo indicadores visuales de OT vencidas (SLA excedido)
10. Puedo acceder a detalle de cada OT

**Definición de Hecho**:
- Tabla responsive con todos los filtros
- Paginación implementada
- Indicadores visuales de estado y SLA
- Performance óptima con +1000 registros
- Tests de UI y filtros

**Dependencias**:
- Datos de ejemplo en base de datos
- RLS policies configuradas correctamente

**Estimación**: 5 puntos

---

### US-MNT-004: Ver Detalle de Orden de Trabajo
**Como**: Técnico de Mantenimiento
**Quiero**: Ver todos los detalles de una OT
**Para**: Conocer qué debo hacer y con qué recursos

**Criterios de Aceptación**:
1. Veo código, título, descripción completa
2. Veo equipo/infraestructura vinculada con enlace al inventario
3. Veo tipo, prioridad, estado actual
4. Veo fechas: creación, programada, inicio real, fin real
5. Veo responsable asignado y equipo de trabajo
6. Veo lista de materiales necesarios
7. Veo procedimiento de trabajo si está disponible
8. Veo historial de cambios de estado
9. Veo archivos adjuntos (procedimientos, manuales)
10. Veo operaciones registradas si está en progreso

**Definición de Hecho**:
- Vista detallada completa
- Navegación a elementos relacionados
- Historial de auditoría visible
- Descarga de documentos adjuntos
- Tests de integración

**Dependencias**:
- Módulo de Inventario (para navegación)
- Módulo de Archivo Técnico (para documentos)

**Estimación**: 5 puntos

---

### US-MNT-005: Cancelar Orden de Trabajo
**Como**: Jefe de Mantenimiento
**Quiero**: Cancelar una OT que ya no es necesaria
**Para**: Mantener el sistema actualizado

**Criterios de Aceptación**:
1. Puedo cancelar OT en estado "pending"
2. Debo proporcionar motivo de cancelación obligatorio
3. El sistema registra quién y cuándo canceló
4. No se puede cancelar OT en estado "completed"
5. Se puede cancelar OT "in_progress" con confirmación adicional
6. Se envía notificación a todos los involucrados
7. La OT aparece en historial como cancelada
8. No se puede reactivar una OT cancelada (debe crear nueva)
9. Los materiales reservados se liberan automáticamente
10. Se registra en el log de auditoría

**Definición de Hecho**:
- Funcionalidad de cancelación implementada
- Validaciones de estado
- Sistema de notificaciones
- Auditoría completa
- Tests de reglas de negocio

**Dependencias**:
- Sistema de notificaciones
- Gestión de materiales (si aplica)

**Estimación**: 5 puntos

---

## ÉPICA 2: Programación y Planificación

### US-MNT-006: Calendario de Mantenimientos Preventivos
**Como**: Jefe de Mantenimiento
**Quiero**: Ver calendario mensual de mantenimientos programados
**Para**: Planificar recursos y coordinar con operación

**Criterios de Aceptación**:
1. Veo vista calendario mensual con todas las OT programadas
2. Puedo cambiar entre vista mes, semana, día
3. Cada OT muestra código, equipo y prioridad
4. Colores diferentes según prioridad
5. Puedo hacer clic en OT para ver detalle
6. Puedo arrastrar y soltar OT para reprogramar
7. Al reprogramar, se registra el cambio y el motivo
8. Veo alertas de conflictos de recursos (mismo técnico, múltiples OT)
9. Puedo filtrar por tipo de mantenimiento
10. Puedo exportar el calendario a PDF

**Definición de Hecho**:
- Componente de calendario interactivo
- Drag & drop funcional
- Validación de conflictos
- Exportación a PDF
- Tests de usabilidad

**Dependencias**:
- Librería de calendario (react-big-calendar o similar)
- Generación de PDF

**Estimación**: 13 puntos

---

### US-MNT-007: Generar Mantenimientos Preventivos Automáticamente
**Como**: Sistema
**Quiero**: Crear OT preventivas automáticamente según frecuencias
**Para**: Asegurar que no se omitan mantenimientos programados

**Criterios de Aceptación**:
1. Proceso batch que se ejecuta diariamente
2. Lee frecuencias de mantenimiento del inventario de equipos
3. Genera OT preventivas con X días de antelación (configurable)
4. Asigna responsable según rol y disponibilidad
5. Calcula fecha programada según última intervención + frecuencia
6. Solo genera si no existe OT preventiva pendiente para ese equipo
7. Envía resumen diario al jefe de mantenimiento
8. Registra en log todas las OT generadas automáticamente
9. Respeta calendarios de parada de planta
10. Permite configurar reglas de generación por tipo de equipo

**Definición de Hecho**:
- Edge Function o proceso programado en Supabase
- Configuración de frecuencias por equipo
- Logs de ejecución
- Notificaciones de resumen
- Tests de lógica de negocio

**Dependencias**:
- Módulo de Inventario (frecuencias de equipos)
- Sistema de cron jobs o scheduled functions

**Estimación**: 13 puntos

---

### US-MNT-008: Asignar Recursos a Orden de Trabajo
**Como**: Jefe de Mantenimiento
**Quiero**: Asignar personal y materiales a una OT
**Para**: Garantizar que el trabajo se pueda ejecutar

**Criterios de Aceptación**:
1. Puedo asignar uno o varios técnicos a la OT
2. Veo disponibilidad de cada técnico (otras OT asignadas)
3. Puedo reservar materiales del almacén
4. Veo stock disponible de cada material
5. Puedo reservar herramientas especiales si es necesario
6. El sistema valida que hay recursos suficientes
7. Se envía notificación a técnicos asignados
8. Los materiales reservados se descuentan del stock disponible
9. Puedo reasignar recursos si la OT está en "pending"
10. Se registra histórico de asignaciones

**Definición de Hecho**:
- Formulario de asignación de recursos
- Validación de disponibilidad
- Reserva de materiales
- Sistema de notificaciones
- Tests de reglas de negocio

**Dependencias**:
- Gestión de personal y turnos
- Gestión de almacén (si aplica)

**Estimación**: 8 puntos

---

## ÉPICA 3: Ejecución y Seguimiento

### US-MNT-009: Iniciar Ejecución de Orden de Trabajo
**Como**: Técnico de Mantenimiento
**Quiero**: Marcar el inicio de la ejecución de una OT
**Para**: Registrar cuándo comencé el trabajo

**Criterios de Aceptación**:
1. Puedo cambiar estado de "pending" a "in_progress"
2. El sistema registra automáticamente fecha y hora de inicio
3. Puedo añadir comentarios iniciales (ej: estado inicial del equipo)
4. Puedo adjuntar fotos del estado inicial
5. El sistema me muestra el procedimiento de trabajo si existe
6. Veo lista de materiales asignados
7. Puedo confirmar o modificar lista de materiales
8. Se envía notificación al supervisor
9. Solo el técnico asignado puede iniciar la OT
10. El cronómetro de SLA comienza a contar

**Definición de Hecho**:
- Botón de inicio con validaciones
- Registro automático de timestamp
- Subida de fotos funcional
- Visualización de procedimientos
- Tests de permisos

**Dependencias**:
- Almacenamiento de archivos (Supabase Storage)
- Módulo de Archivo Técnico (procedimientos)

**Estimación**: 8 puntos

---

### US-MNT-010: Registrar Operaciones Durante Ejecución
**Como**: Técnico de Mantenimiento
**Quiero**: Registrar cada operación que realizo durante el mantenimiento
**Para**: Documentar detalladamente el trabajo realizado

**Criterios de Aceptación**:
1. Puedo añadir múltiples operaciones a una OT en progreso
2. Cada operación tiene: tipo, descripción, técnico, hora inicio, hora fin
3. Tipos de operación: Inspección, Ajuste, Reparación, Sustitución, Prueba, Limpieza
4. Puedo registrar materiales consumidos en cada operación
5. Puedo adjuntar fotos por operación
6. Puedo registrar mediciones tomadas (torques, presiones, etc.)
7. El sistema calcula tiempo total automáticamente
8. Puedo marcar operación como completada
9. Veo histórico de todas las operaciones de la OT
10. Puedo editar operaciones mientras la OT está en progreso

**Definición de Hecho**:
- Formulario de registro de operaciones
- Lista dinámica de operaciones
- Cálculo automático de tiempos
- Subida de fotos por operación
- Tests de CRUD completo

**Dependencias**:
- Tabla `maintenance_operations` en BD
- Almacenamiento de fotos

**Estimación**: 13 puntos

---

### US-MNT-011: Registrar Materiales Consumidos
**Como**: Técnico de Mantenimiento
**Quiero**: Registrar los materiales que utilicé durante el mantenimiento
**Para**: Mantener control de inventario y costos

**Criterios de Aceptación**:
1. Puedo añadir materiales consumidos durante la ejecución
2. Puedo seleccionar material del catálogo del almacén
3. Registro cantidad consumida y unidad de medida
4. Puedo consumir materiales no reservados previamente
5. El sistema valida que hay stock disponible
6. Puedo registrar repuestos instalados con número de serie
7. El sistema actualiza stock de almacén automáticamente
8. Puedo registrar costo unitario si está disponible
9. Veo resumen de materiales consumidos vs reservados
10. Puedo editar cantidades antes de cerrar la OT

**Definición de Hecho**:
- Selector de materiales del almacén
- Validación de stock en tiempo real
- Actualización automática de inventario
- Registro de números de serie
- Tests de integridad de datos

**Dependencias**:
- Sistema de gestión de almacén
- Módulo de Inventario (para repuestos con N/S)

**Estimación**: 13 puntos

---

### US-MNT-012: Pausar y Reanudar Orden de Trabajo
**Como**: Técnico de Mantenimiento
**Quiero**: Pausar una OT cuando debo detener el trabajo
**Para**: Registrar tiempo real de trabajo efectivo

**Criterios de Aceptación**:
1. Puedo pausar una OT en estado "in_progress"
2. Debo proporcionar motivo de pausa: Falta Material, Espera Aprobación, Condiciones Climáticas, Otro
3. El sistema registra timestamp de pausa
4. Puedo añadir comentarios adicionales
5. La OT aparece con estado visual "Pausada"
6. Puedo reanudar la OT proporcionando comentario
7. Se registra timestamp de reanudación
8. El tiempo en pausa no cuenta para SLA de ejecución
9. Puedo ver histórico de todas las pausas
10. Se envía notificación al supervisor en cada pausa/reanudación

**Definición de Hecho**:
- Funcionalidad de pausa/reanudación
- Registro de tiempos y motivos
- Exclusión de tiempo pausado en métricas
- Notificaciones implementadas
- Tests de estados y transiciones

**Dependencias**:
- Sistema de notificaciones

**Estimación**: 8 puntos

---

## ÉPICA 4: Cierre y Documentación

### US-MNT-013: Cerrar Orden de Trabajo con Validaciones
**Como**: Técnico de Mantenimiento
**Quiero**: Cerrar una OT cuando termino el trabajo
**Para**: Documentar la finalización del mantenimiento

**Criterios de Aceptación**:
1. Puedo cerrar OT solo si está en estado "in_progress"
2. El sistema valida que se hayan registrado operaciones
3. Debo confirmar que el trabajo está completado satisfactoriamente
4. Puedo registrar observaciones finales
5. Puedo adjuntar fotos del estado final
6. El sistema registra automáticamente fecha y hora de cierre
7. Debo confirmar que el equipo queda operativo
8. Puedo marcar si se requiere seguimiento posterior
9. Si usé materiales, debo confirmar las cantidades
10. El estado cambia a "completed"

**Definición de Hecho**:
- Formulario de cierre con validaciones
- Registro de timestamp automático
- Subida de fotos finales
- Validaciones de integridad de datos
- Tests de reglas de negocio

**Dependencias**:
- Operaciones registradas
- Materiales confirmados

**Estimación**: 8 puntos

---

### US-MNT-014: Generar Informe PDF de Orden de Trabajo
**Como**: Técnico de Mantenimiento
**Quiero**: Generar un informe PDF de la OT cerrada
**Para**: Tener registro documental del trabajo realizado

**Criterios de Aceptación**:
1. Puedo generar PDF de cualquier OT completada
2. El PDF incluye: código, fecha, presa, equipo, responsables
3. Incluye descripción inicial y observaciones finales
4. Lista detallada de todas las operaciones realizadas
5. Lista de materiales consumidos con cantidades
6. Tiempos: programado, inicio real, fin real, duración total
7. Fotos de estado inicial y final (si existen)
8. Logos institucionales (Ministerio, CHG)
9. Firma digital del técnico responsable (simulada)
10. El PDF se almacena automáticamente en el archivo técnico

**Definición de Hecho**:
- Servicio de generación de PDF funcional
- Template profesional con branding SIPRESAS
- Inclusión de todas las secciones requeridas
- Almacenamiento automático del PDF
- Tests de generación

**Dependencias**:
- Servicio `pdfGenerationService.ts` (ya existe)
- Supabase Storage para almacenar PDFs
- Módulo de Archivo Técnico (para vinculación)

**Estimación**: 8 puntos

---

### US-MNT-015: Vincular Informe PDF al Modelo BIM
**Como**: Ingeniero de Presa
**Quiero**: Visualizar informes de mantenimiento desde el modelo BIM 3D
**Para**: Tener contexto espacial del historial de mantenimientos

**Criterios de Aceptación**:
1. Cada OT cerrada con PDF se vincula automáticamente al equipo en BIM
2. Desde el módulo BIM, al seleccionar un equipo veo historial de mantenimientos
3. Puedo abrir el PDF directamente desde el visor BIM
4. El último informe de mantenimiento aparece destacado
5. Los informes se muestran ordenados cronológicamente
6. Puedo filtrar por tipo de mantenimiento
7. Veo indicador visual si el equipo tiene mantenimiento vencido
8. El PDF se muestra embebido en el módulo BIM
9. Puedo descargar el PDF si lo necesito
10. La vinculación se mantiene aunque cambie el equipo de ubicación

**Definición de Hecho**:
- Integración BIM-Mantenimiento implementada
- Vista de historial en módulo BIM
- Visor de PDF embebido funcional
- Indicadores visuales de estado
- Tests de integración

**Dependencias**:
- Módulo BIM operativo
- PDFs generados y almacenados
- Relación `equipment_id` en OT

**Estimación**: 8 puntos (ya implementado parcialmente)

---

### US-MNT-016: Aprobar Cierre de Orden de Trabajo (Workflow)
**Como**: Jefe de Mantenimiento
**Quiero**: Revisar y aprobar el cierre de OT críticas
**Para**: Validar que el trabajo se hizo correctamente

**Criterios de Aceptación**:
1. Las OT de equipos críticos requieren aprobación de cierre
2. Recibo notificación cuando una OT crítica se marca como completada
3. Puedo ver todos los detalles de la OT completada
4. Puedo ver el PDF generado antes de aprobar
5. Puedo aprobar el cierre si todo está correcto
6. Puedo rechazar el cierre con comentarios si hay problemas
7. Si rechazo, la OT vuelve a estado "in_progress"
8. El técnico recibe notificación del rechazo con comentarios
9. Una vez aprobada, la OT queda definitivamente cerrada
10. Se registra quién aprobó y cuándo

**Definición de Hecho**:
- Workflow de aprobación implementado
- Notificaciones bidireccionales
- Estados adicionales: "pending_approval", "approved"
- Registro de auditoría completo
- Tests de workflow

**Dependencias**:
- Sistema de notificaciones
- Roles y permisos configurados

**Estimación**: 13 puntos

---

## ÉPICA 5: Indicadores y Analítica

### US-MNT-017: Dashboard de KPIs de Mantenimiento
**Como**: Jefe de Mantenimiento
**Quiero**: Ver indicadores clave de desempeño
**Para**: Evaluar la eficiencia del equipo de mantenimiento

**Criterios de Aceptación**:
1. Veo número total de OT por estado (pendientes, en progreso, completadas)
2. Veo tasa de cumplimiento de SLA
3. Veo tiempo promedio de resolución por tipo de mantenimiento
4. Veo tasa de mantenimientos preventivos vs correctivos
5. Veo equipos con más incidencias
6. Veo disponibilidad de equipos críticos (MTBF/MTTR)
7. Veo costo total de mantenimientos por presa
8. Veo productividad por técnico
9. Puedo filtrar por presa y rango de fechas
10. Puedo exportar métricas a Excel

**Definición de Hecho**:
- Dashboard con gráficos interactivos (Recharts)
- Cálculo correcto de todos los KPIs
- Filtros funcionales
- Exportación a Excel
- Tests de cálculos

**Dependencias**:
- Datos históricos suficientes
- Librería de gráficos (Recharts ya instalada)

**Estimación**: 13 puntos

---

### US-MNT-018: Análisis de Tendencias de Fallos
**Como**: Ingeniero de Mantenimiento
**Quiero**: Visualizar tendencias de fallos por equipo
**Para**: Identificar problemas recurrentes y tomar acciones preventivas

**Criterios de Aceptación**:
1. Veo gráfico de línea con fallos por mes/trimestre
2. Puedo filtrar por tipo de equipo o equipo específico
3. Veo tipos de fallo más frecuentes
4. Veo equipos con mayor tasa de fallos
5. Puedo comparar múltiples equipos en el mismo gráfico
6. Veo correlación entre fallos y condiciones operativas
7. Veo alertas de equipos con tendencia creciente de fallos
8. Puedo exportar gráficos a imagen
9. Veo recomendaciones automáticas basadas en tendencias
10. Integración con datos de auscultación si disponibles

**Definición de Hecho**:
- Gráficos de tendencias implementados
- Análisis estadístico básico
- Sistema de alertas por tendencias
- Recomendaciones automáticas
- Tests de algoritmos

**Dependencias**:
- Datos históricos de al menos 6 meses
- Módulo de Auscultación (para correlaciones)

**Estimación**: 13 puntos

---

### US-MNT-019: Historial Completo de Mantenimiento por Equipo
**Como**: Ingeniero de Presa
**Quiero**: Ver el historial completo de mantenimientos de un equipo
**Para**: Conocer su trayectoria y planificar reemplazo

**Criterios de Aceptación**:
1. Desde el detalle de un equipo en Inventario, veo todas sus OT
2. Veo línea de tiempo con todas las intervenciones
3. Puedo filtrar por tipo de mantenimiento
4. Veo resumen: total de intervenciones, última intervención, próxima programada
5. Puedo abrir el detalle de cada OT históricas
6. Puedo descargar PDFs de informes históricos
7. Veo estadísticas: tiempo total de paradas, costo total invertido
8. Veo gráfico de vida útil vs vida útil esperada
9. Veo alertas si el equipo supera vida útil recomendada
10. Exportar historial completo a PDF

**Definición de Hecho**:
- Vista de historial integrada en Inventario
- Línea de tiempo visual
- Estadísticas calculadas correctamente
- Exportación a PDF
- Tests de integración

**Dependencias**:
- Módulo de Inventario
- Datos de vida útil en equipos

**Estimación**: 8 puntos

---

### US-MNT-020: Reporte de Costos de Mantenimiento
**Como**: Gerente Administrativo
**Quiero**: Generar reportes de costos de mantenimiento
**Para**: Controlar presupuesto y justificar inversiones

**Criterios de Aceptación**:
1. Puedo generar reporte de costos por presa
2. Puedo filtrar por rango de fechas
3. Veo desglose: mano de obra, materiales, servicios externos
4. Veo comparativa presupuestado vs ejecutado
5. Veo costos por tipo de mantenimiento
6. Veo top 10 equipos con mayor costo de mantenimiento
7. Veo proyección de costos futuros basado en preventivos programados
8. Puedo exportar reporte a Excel y PDF
9. Veo gráficos de evolución mensual de costos
10. Alertas si se supera presupuesto asignado

**Definición de Hecho**:
- Formulario de generación de reportes
- Cálculos de costos implementados
- Gráficos de costos
- Exportación a Excel y PDF
- Tests de cálculos financieros

**Dependencias**:
- Datos de costos de materiales
- Costos de mano de obra configurados
- Presupuestos asignados

**Estimación**: 13 puntos

---

## ÉPICA 6: Funcionalidades Avanzadas (Futuro)

### US-MNT-021: Mantenimiento Predictivo con Machine Learning
**Como**: Ingeniero de Mantenimiento
**Quiero**: Recibir alertas predictivas de fallos potenciales
**Para**: Actuar antes de que ocurra el fallo

**Criterios de Aceptación**:
1. El sistema analiza datos de auscultación en tiempo real
2. Detecta patrones anómalos que indican posible fallo
3. Genera alerta predictiva con nivel de confianza
4. Sugiere crear OT preventiva automáticamente
5. Explica qué parámetros indican el riesgo
6. Aprende de fallos históricos para mejorar predicciones
7. Integración completa con módulo de Auscultación
8. Dashboard de alertas predictivas
9. Historial de aciertos/fallos del modelo predictivo
10. Configuración de sensibilidad de alertas

**Definición de Hecho**:
- Modelo de ML entrenado y desplegado
- Integración con datos de auscultación
- Sistema de alertas predictivas
- Dashboard de analítica predictiva
- Tests de precisión del modelo

**Dependencias**:
- Módulo de Auscultación con datos históricos extensos
- Infraestructura de ML (Edge Functions con TensorFlow.js o API externa)
- Datos etiquetados de fallos históricos

**Estimación**: 21 puntos

---

### US-MNT-022: App Móvil para Técnicos en Campo
**Como**: Técnico de Mantenimiento
**Quiero**: Usar app móvil para registrar mantenimientos
**Para**: Trabajar sin necesidad de ordenador

**Criterios de Aceptación**:
1. Descargo app en iOS/Android
2. Inicio sesión con mis credenciales
3. Veo mis OT asignadas del día
4. Puedo iniciar/pausar/completar OT desde el móvil
5. Puedo tomar fotos directamente con la cámara
6. Puedo registrar operaciones por voz (speech-to-text)
7. Funciona offline y sincroniza cuando hay conexión
8. Recibo notificaciones push de OT urgentes
9. Puedo escanear QR de equipos para registrar rápido
10. Puedo consultar procedimientos de trabajo offline

**Definición de Hecho**:
- App móvil desarrollada (React Native o Flutter)
- Funcionalidad offline implementada
- Sincronización bidireccional
- Notificaciones push
- Tests en dispositivos reales

**Dependencias**:
- API REST o GraphQL del backend
- Servicio de notificaciones push
- Generación de QR codes para equipos

**Estimación**: 34 puntos (proyecto completo)

---

### US-MNT-023: Integración con GMAO Corporativo
**Como**: Administrador del Sistema
**Quiero**: Sincronizar datos con GMAO corporativo
**Para**: Mantener consistencia entre sistemas

**Criterios de Aceptación**:
1. Sincronización bidireccional de OT con GMAO externo
2. Mapeo de campos entre SIPRESAS y GMAO
3. Sincronización en tiempo real o batch programado
4. Manejo de conflictos de datos
5. Log de todas las sincronizaciones
6. Alertas si falla la sincronización
7. Configuración de qué datos se sincronizan
8. Soporte para múltiples GMAO (SAP, Maximo, etc.)
9. API REST para integración
10. Documentación completa de la API

**Definición de Hecho**:
- API de integración implementada
- Conectores para al menos un GMAO
- Sistema de sincronización robusto
- Manejo de errores completo
- Documentación técnica

**Dependencias**:
- Acceso a API del GMAO corporativo
- Credenciales y permisos
- Especificación de mapeo de datos

**Estimación**: 21 puntos

---

## Resumen de Dependencias entre Módulos

### Dependencias CRÍTICAS (Bloqueantes)
1. **Inventario** → Mantenimiento: Necesario para vincular equipos a OT
2. **Autenticación** → Mantenimiento: Necesario para asignación de técnicos

### Dependencias IMPORTANTES (Funcionalidad reducida sin ellas)
3. **Archivo Técnico** → Mantenimiento: Para procedimientos y almacenar PDFs
4. **BIM** → Mantenimiento: Para visualización espacial de intervenciones
5. **Auscultación** → Mantenimiento: Para OT correctivas automáticas por alertas

### Dependencias OPCIONALES (Mejoras de integración)
6. **Emergencias** → Mantenimiento: Para OT urgentes en situaciones críticas
7. **Explotación** → Mantenimiento: Para coordinar paradas operativas

---

## Priorización de Incrementos

### Incremento 1 (MVP - 4 semanas)
**Objetivo**: Sistema básico funcional de gestión de OT

**Historias incluidas**:
- US-MNT-001: Crear OT Preventiva (8 pts)
- US-MNT-002: Crear OT Correctiva Urgente (13 pts)
- US-MNT-003: Listar OT (5 pts)
- US-MNT-004: Ver Detalle OT (5 pts)
- US-MNT-009: Iniciar OT (8 pts)
- US-MNT-013: Cerrar OT (8 pts)

**Total**: 47 puntos
**Capacidad estimada**: 40-50 puntos en 4 semanas

---

### Incremento 2 (Ejecución Detallada - 3 semanas)
**Objetivo**: Registro detallado de operaciones y materiales

**Historias incluidas**:
- US-MNT-010: Registrar Operaciones (13 pts)
- US-MNT-011: Registrar Materiales (13 pts)
- US-MNT-012: Pausar/Reanudar OT (8 pts)
- US-MNT-005: Cancelar OT (5 pts)

**Total**: 39 puntos

---

### Incremento 3 (Planificación y Documentación - 3 semanas)
**Objetivo**: Calendario, PDFs y vinculación BIM

**Historias incluidas**:
- US-MNT-006: Calendario (13 pts)
- US-MNT-008: Asignar Recursos (8 pts)
- US-MNT-014: Generar PDF (8 pts)
- US-MNT-015: Vincular a BIM (8 pts)

**Total**: 37 puntos

---

### Incremento 4 (Analítica y Reportes - 3 semanas)
**Objetivo**: KPIs, tendencias y reportes

**Historias incluidas**:
- US-MNT-017: Dashboard KPIs (13 pts)
- US-MNT-018: Análisis Tendencias (13 pts)
- US-MNT-019: Historial Equipo (8 pts)
- US-MNT-020: Reporte Costos (13 pts)

**Total**: 47 puntos

---

### Incremento 5 (Automatización - 2 semanas)
**Objetivo**: Generación automática y workflows

**Historias incluidas**:
- US-MNT-007: Generar OT Automáticas (13 pts)
- US-MNT-016: Aprobar Cierre (13 pts)

**Total**: 26 puntos

---

### Incremento 6 (Funcionalidades Avanzadas - Futuro)
**Objetivo**: IA predictiva y app móvil

**Historias incluidas**:
- US-MNT-021: ML Predictivo (21 pts)
- US-MNT-022: App Móvil (34 pts)
- US-MNT-023: Integración GMAO (21 pts)

**Total**: 76 puntos

---

## Estimación Total del Módulo

**Total Incrementos 1-5 (Funcionalidad Completa)**: 196 puntos
**Tiempo estimado**: 15-17 semanas (3.5-4 meses)

**Total con Avanzado (Incremento 6)**: 272 puntos
**Tiempo estimado**: 24-28 semanas (6-7 meses)

---

## Riesgos y Mitigaciones

### Riesgo 1: Dependencia de Módulo de Inventario
**Probabilidad**: Alta
**Impacto**: Alto
**Mitigación**: Desarrollar Inventario en paralelo, usar datos mock inicialmente

### Riesgo 2: Complejidad de Generación de PDFs
**Probabilidad**: Media
**Impacto**: Medio
**Mitigación**: Usar servicio ya existente, templates simples inicialmente

### Riesgo 3: Performance con Grandes Volúmenes de Datos
**Probabilidad**: Media
**Impacto**: Alto
**Mitigación**: Implementar paginación, índices en BD, caching

### Riesgo 4: Adopción por Usuarios en Campo
**Probabilidad**: Media
**Impacto**: Alto
**Mitigación**: Capacitación, UX simple, opción de registro posterior en oficina

---

## Métricas de Éxito del Módulo

1. **Tasa de Adopción**: 80% de técnicos usan el sistema regularmente
2. **Cumplimiento de SLA**: 90% de OT completadas dentro del plazo
3. **Ratio Preventivo/Correctivo**: Mínimo 70% preventivo, 30% correctivo
4. **Disponibilidad de Equipos Críticos**: >95%
5. **Satisfacción de Usuario**: >4/5 en encuesta de usabilidad
6. **Reducción de Papel**: 90% de informes digitales
7. **Tiempo de Cierre de OT**: <24h para urgentes, <1 semana para normales
8. **Precisión de Predicción de Fallos** (con ML): >70%

---

## Notas Técnicas

### Esquema de Base de Datos Principal

**Tablas Implementadas**:
- `maintenance_work_orders`: OT principales
- `maintenance_operations`: Operaciones durante ejecución
- `maintenance_reports`: Informes con PDFs

**Tablas Pendientes**:
- `maintenance_materials_used`: Materiales consumidos
- `maintenance_pauses`: Histórico de pausas
- `maintenance_assignments`: Asignación de personal
- `maintenance_approvals`: Workflow de aprobaciones

### RLS Policies
Todas las tablas tienen RLS habilitado y restricciones por:
- Usuario autenticado
- Presa asignada al usuario
- Rol del usuario (técnico vs supervisor vs gerente)

### Integraciones Técnicas
- **Supabase Storage**: Para almacenar fotos y PDFs
- **Edge Functions**: Para generación automática de OT y reportes
- **Supabase Realtime**: Para notificaciones en tiempo real (opcional)

---

**Fin del Backlog del Módulo de Mantenimiento**
