# Guía Rápida de Demostración
## 🎯 Duración: 15-20 minutos

---

## ⚡ Checklist Pre-Demo

- [ ] Aplicación ejecutándose (`npm run dev`)
- [ ] Navegador en pantalla completa
- [ ] Cerrar pestañas innecesarias
- [ ] Audio funcionando (para video si hay)
- [ ] Backup listo (segundo dispositivo)

---

## 🎬 Script de Presentación

### 1. APERTURA (30 segundos)

**Pantalla: Dashboard**

> "Buenos días/tardes. Hoy les presentamos el prototipo funcional del Sistema de Gestión de Emergencias y Auscultación para presas. Este es un prototipo navegable de alta fidelidad que demuestra las capacidades completas del sistema."

---

### 2. DASHBOARD PRINCIPAL (3 minutos)

**Qué mostrar:**
- KPIs principales en las 4 cards superiores
- Panel de alertas (señalar alerta crítica sin confirmar)
- Lista de sensores con código de colores

**Qué decir:**

> "En el dashboard tenemos visibilidad inmediata del estado de la presa. Los KPIs principales nos muestran:"

- **Nivel de agua**: 185.3m (92.7% de capacidad) → *Señalar barra de progreso naranja*
- **Integridad estructural**: 94.5% → *Estado óptimo*
- **Actividad sísmica**: 0.05g → *Niveles normales*
- **Sensores activos**: 7 de 8 → *Uno fuera de línea*

> "El panel de alertas destaca situaciones críticas. Aquí vemos un desplazamiento anómalo detectado hace 5 minutos."

**Acción interactiva:**
- Clic en "Confirmar recepción" de la alerta crítica
- Mostrar cómo desaparece de alertas sin confirmar

> "Los operadores pueden confirmar que han visto las alertas con un solo clic."

---

### 3. AUSCULTACIÓN (4 minutos)

**Transición:**
> "Ahora veamos el módulo de auscultación para analizar datos de sensores en detalle."

**Navegar a: Auscultación**

**Qué mostrar:**
1. Panel lateral con 8 sensores
2. Sensor S002 (Nivel Embalse Norte) - Estado WARNING
3. Gráfico con histórico de 24 horas
4. Líneas de referencia (advertencia y crítico)
5. Estadísticas calculadas

**Qué decir:**

> "El módulo de auscultación permite análisis profundo de cada sensor. Tenemos 8 sensores de diferentes tipos: presión, nivel de agua, sísmico, desplazamiento, temperatura y caudal."

**Selector S002:**
> "Este sensor de nivel de agua está en estado de advertencia. El gráfico nos muestra las últimas 24 horas."

**Señalar umbral naranja:**
> "La línea naranja marca el umbral de advertencia a 185m. El valor actual de 187.5m lo ha superado."

**Cambiar a sensor S004:**
> "Este inclinómetro está en estado crítico. Ha detectado un desplazamiento de 12.3mm cuando el umbral crítico es 10mm."

**Cambiar rango temporal a 7 días:**
> "Podemos ver tendencias en diferentes períodos: 24 horas, 7 días o 30 días."

---

### 4. GESTIÓN DE INCIDENTES (4 minutos)

**Transición:**
> "Cuando se detecta una situación crítica, se crea un incidente formal."

**Navegar a: Incidentes**

**Qué mostrar:**
1. Filtros por estado (mostrar número en cada uno)
2. Lista de incidentes con prioridades
3. Seleccionar INC001 (Desplazamiento Anómalo)
4. Protocolo de actuación
5. Registro de acciones

**Qué decir:**

> "Tenemos 3 incidentes registrados: 1 activo, 1 en monitoreo y 1 resuelto."

**Clic en INC001:**
> "Este incidente activo de prioridad crítica está relacionado con el desplazamiento que vimos en el sensor S004."

**Scroll al protocolo:**
> "Cada incidente sigue un protocolo estructurado con pasos claros de actuación. Esto garantiza respuesta consistente y documentada."

**Leer 2-3 pasos del protocolo:**
1. Verificar lectura con sensores redundantes
2. Notificar al responsable de seguridad estructural
3. Desplegar equipo de inspección visual

**Señalar registro de acciones:**
> "Todas las acciones quedan documentadas para trazabilidad y cumplimiento normativo."

**Mostrar botón "Nuevo Incidente":**
> "Los operadores pueden crear nuevos incidentes fácilmente cuando detectan situaciones anómalas."

---

### 5. MAPA INTERACTIVO (3 minutos)

**Transición:**
> "La visualización espacial es clave para contextualizar los problemas."

**Navegar a: Mapa**

**Qué mostrar:**
1. Vista esquemática de la presa
2. 8 sensores distribuidos geográficamente
3. Código de colores (verde, naranja, rojo, gris)
4. Hover sobre sensor
5. Clic en sensor crítico (S004)

**Qué decir:**

> "El mapa muestra la distribución de sensores en la estructura de la presa. El código de colores permite identificar rápidamente dónde hay problemas."

**Hover sobre S002 (naranja):**
> "Al pasar el cursor vemos información básica del sensor."

**Clic en S004 (rojo parpadeante):**
> "Este punto rojo parpadeante indica el sensor crítico. Al hacer clic vemos detalles completos y podemos acceder directamente a sus gráficos."

---

### 6. ANÁLISIS (2 minutos)

**Transición:**
> "El sistema también proporciona análisis y reportes para toma de decisiones."

**Navegar a: Análisis**

**Qué mostrar:**
1. KPIs agregados
2. Gráfico de alertas por mes
3. Distribución de sensores (pie chart)
4. Tiempo de resolución de incidentes

**Qué decir:**

> "El módulo de análisis proporciona visibilidad histórica y métricas de rendimiento."

**Señalar gráfico de alertas:**
> "Podemos ver tendencias de alertas en los últimos meses. Junio muestra un incremento que requiere atención."

**Señalar KPI de disponibilidad:**
> "El sistema mantiene 98.5% de disponibilidad en el último mes."

---

### 7. CONFIGURACIÓN (2 minutos)

**Transición:**
> "La configuración permite personalizar el sistema según las necesidades específicas de cada presa."

**Navegar a: Configuración**

**Qué mostrar:**
1. Pestañas de configuración
2. Pestaña "Umbrales de Alerta"
3. Configuración de un sensor
4. Pestaña "Notificaciones"

**Qué decir:**

> "Los administradores pueden configurar umbrales específicos para cada sensor."

**Mostrar sensor S001:**
> "Para cada sensor definimos valores mínimo, máximo, advertencia y crítico. Estos determinan cuándo se generan alertas."

**Cambiar a pestaña Notificaciones:**
> "El sistema puede enviar notificaciones por email según el nivel de prioridad."

---

### 8. CIERRE (1-2 minutos)

**Volver a: Dashboard**

**Qué decir:**

> "En resumen, este prototipo demuestra un sistema completo para la gestión de seguridad de presas con:"

- ✅ **Monitorización en tiempo real** de 8 tipos diferentes de sensores
- ✅ **Sistema de alertas** con niveles de prioridad
- ✅ **Gestión estructurada de incidentes** con protocolos
- ✅ **Visualización espacial** intuitiva
- ✅ **Análisis histórico** y reportes
- ✅ **Configuración flexible** por sensor

> "El sistema está diseñado con foco en usabilidad y experiencia del usuario final. Los operadores tienen toda la información crítica a un clic de distancia."

**Pausa para preguntas**

> "¿Qué preguntas tienen sobre el prototipo o el proyecto?"

---

## 🎯 Puntos Clave a Enfatizar

1. **Prototipo funcional navegable** (no slides estáticos)
2. **Datos realistas simulados** (listos para conectar con sistemas reales)
3. **Diseño centrado en el usuario** (operadores de presa)
4. **Cumplimiento normativo** (trazabilidad, documentación)
5. **Escalable y extensible** (arquitectura modular)

---

## ❓ Preparación para Preguntas

### "¿Los datos son reales?"
> "Son datos simulados realistas para demostración. En producción se conectarían a sistemas SCADA y sensores reales mediante OPC UA o Modbus."

### "¿Cuántos sensores soporta?"
> "La arquitectura es escalable. Este prototipo muestra 8 sensores, pero puede manejar decenas o cientos según las necesidades."

### "¿Funciona en móviles?"
> "Este prototipo está optimizado para desktop y tablet. Una versión móvil dedicada sería parte de las siguientes fases."

### "¿Se integra con sistemas existentes?"
> "Sí, está diseñado para integrarse con APIs REST estándar, sistemas SCADA, bases de datos históricas y otros sistemas de terceros."

### "¿Qué pasa si se pierde conexión?"
> "En producción implementaríamos cache local, alertas offline y sincronización automática al recuperar conexión."

### "¿Puede exportar reportes?"
> "El prototipo muestra el botón de exportación. En producción generaría PDFs, Excel y exportaría datos históricos en múltiples formatos."

### "¿Cuánto tiempo de implementación?"
> "Depende del alcance final y las integraciones. Este prototipo valida viabilidad técnica. La implementación completa típicamente toma 4-6 meses."

---

## ⏱️ Timing Detallado

| Sección | Tiempo | Acumulado |
|---------|--------|-----------|
| Apertura | 0:30 | 0:30 |
| Dashboard | 3:00 | 3:30 |
| Auscultación | 4:00 | 7:30 |
| Incidentes | 4:00 | 11:30 |
| Mapa | 3:00 | 14:30 |
| Análisis | 2:00 | 16:30 |
| Configuración | 2:00 | 18:30 |
| Cierre | 1:30 | 20:00 |

**Total: ~20 minutos + preguntas**

---

## 🎨 Atajos de Navegación

Durante la demo, puedes navegar rápidamente:

- **Dashboard**: Clic en logo o icono Home
- **Auscultación**: Desde alertas → "Ver sensor"
- **Incidentes**: Desde dashboard → botón "Ver Incidentes"
- **Mapa**: Sidebar → icono Mapa
- **Análisis**: Sidebar → icono Análisis
- **Configuración**: Sidebar → icono Configuración

---

## 💡 Tips de Presentación

1. ✅ **Hablar despacio y claro**
2. ✅ **Señalar con el cursor** lo que se menciona
3. ✅ **Pausar después de cada acción** para que se vea
4. ✅ **Mantener contacto visual** con la audiencia
5. ✅ **Sonreír y mostrar entusiasmo**
6. ✅ **Si algo falla, mantener la calma** y usar backup

---

## 🚨 Plan B

Si algo falla técnicamente:
1. F5 para recargar página
2. Abrir nueva pestaña con localhost:5173
3. Usar segundo dispositivo de backup
4. Explicar verbalmente mientras se soluciona
5. Tener screenshots como último recurso

---

## ✅ Checklist Post-Demo

- [ ] Agradecer la atención
- [ ] Ofrecer demo personalizada posterior
- [ ] Compartir documentación técnica
- [ ] Agendar sesión de Q&A detallada
- [ ] Solicitar feedback

---

**¡Éxito en la presentación! 🚀**
