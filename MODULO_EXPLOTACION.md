# Módulo de Explotación - SIPRESAS

El Módulo de Explotación de SIPRESAS es un sistema integral para la gestión de recursos hídricos y operación de embalses conforme a los estándares de la Confederación Hidrográfica del Guadalquivir (CHG).

## Características Principales

### 1. Acceso y Navegación
- ✅ Integrado en el menú vertical principal del sistema
- ✅ Accesible desde cualquier punto de la aplicación
- ✅ Icono distintivo (TrendingUp) en el menú de navegación

### 2. Funcionalidades Implementadas

#### Panel de Control (Dashboard)
- Visualización en tiempo real de indicadores clave:
  - **Nivel Actual**: Altura del agua en metros
  - **Volumen Embalsado**: Cantidad de agua almacenada en hm³
  - **Aportaciones**: Caudal de entrada en m³/s
  - **Alertas Activas**: Número de situaciones de riesgo
- Tabla de datos recientes con historial de los últimos 10 registros
- Indicadores visuales de estado de riesgo con código de colores

#### Entrada de Datos
Formulario manual completo para registro de datos operacionales:

**Datos Básicos:**
- Selección de presa
- Fecha del registro
- Nivel de riesgo de avenida (Normal, Vigilancia, Prevención, Alerta, Emergencia)

**Niveles y Volúmenes:**
- Nivel de agua (m)
- Volumen embalsado (hm³)
- Superficie (ha)
- Volumen útil (hm³)

**Caudales (m³/s):**
- Aportaciones totales
- Salidas totales
- **Categorización por naturaleza:**
  - Abastecimientos
  - Aprovechamientos hidroeléctricos
  - Caudales ecológicos
  - Regadíos
  - Otros usos

**Datos Meteorológicos:**
- Evaporación (mm)
- Lluvia (mm)
- Temperatura del aire (°C)
- Temperatura del agua (°C)

**Observaciones:**
- Campo de texto libre para notas adicionales

#### Sistema de Informes

Seis tipos de informes implementados:

1. **Informe de detalle diario del embalse**
   - Datos por rango de fechas especificado
   - Selección de presa específica
   - Fechas de inicio y fin configurables

2. **Informe diario de zona**
   - Datos de un día específico
   - Todos los embalses de una zona geográfica
   - Selección de zona

3. **Informe diario por sistema de explotación**
   - Datos de un día específico
   - Todos los embalses de un sistema de explotación
   - Selección de sistema

4. **Informe-resumen anual de zona**
   - Datos del año hidrológico completo (octubre-septiembre)
   - Zona específica seleccionable
   - Año hidrológico configurable

5. **Informe-resumen anual de sistemas de explotación**
   - Datos del año hidrológico
   - Todos los embalses de un sistema
   - Análisis agregado del sistema

6. **Informe-resumen anual de Dirección de Explotación**
   - Datos consolidados para dirección
   - Todos los embalses bajo un Director de Explotación
   - Visión global de la gestión

**Formatos de Exportación:**
- 📊 Excel (.xlsx)
- 📄 Word (.docx)
- 📈 Gráficos (visualización)

### 3. Sistema de Detección de Riesgos

El módulo implementa un sistema de 5 niveles para detección automática de riesgos de avenida:

| Nivel | Color | Descripción |
|-------|-------|-------------|
| Normal | Verde | Operación normal del embalse |
| Vigilancia | Azul | Situación a monitorear |
| Prevención | Amarillo | Activar protocolos preventivos |
| Alerta | Naranja | Situación de riesgo elevado |
| Emergencia | Rojo | Máximo nivel de alerta |

### 4. Gestión de Recursos Hídricos

El sistema permite:
- Monitoreo continuo de niveles y volúmenes
- Seguimiento de aportaciones y salidas
- Balance hídrico automático
- Categorización de usos del agua
- Trazabilidad completa de operaciones

## Arquitectura de Datos

### Base de Datos

**Tablas Creadas:**

1. **exploitation_systems**
   - Sistemas de explotación de presas
   - Vinculación con directores de explotación
   - Código único y descripción

2. **exploitation_zones**
   - Zonas geográficas de agrupación
   - Pertenencia a sistemas de explotación
   - Código único y metadatos

3. **exploitation_daily_data**
   - Registros diarios de operación
   - 20+ campos de datos operacionales
   - Nivel de riesgo y observaciones
   - Auditoría completa (registrado por, verificado por)
   - Restricción única por presa y fecha

### API Functions

Funciones implementadas en `src/services/api.ts`:

- `getExploitationSystems()`: Obtener todos los sistemas
- `getExploitationZones(systemId?)`: Obtener zonas (opcionalmente filtradas)
- `getExploitationDailyData(damId?, startDate?, endDate?)`: Datos diarios con filtros
- `getExploitationDailyDataByDate(date, zoneId?, systemId?)`: Datos de una fecha específica
- `createExploitationDailyData(data)`: Crear nuevo registro
- `updateExploitationDailyData(id, updates)`: Actualizar registro
- `getExploitationDataForAnnualReport(year, zoneId?, systemId?)`: Datos anuales

### TypeScript Types

Tipos definidos en `src/types/index.ts`:

```typescript
export type FloodRiskLevel = 'normal' | 'watch' | 'warning' | 'alert' | 'emergency';

export interface ExploitationSystem {
  id: string;
  code: string;
  name: string;
  description: string | null;
  director_id: string | null;
  created_at: string;
  updated_at: string;
  director?: UserProfile;
}

export interface ExploitationZone {
  id: string;
  code: string;
  name: string;
  description: string | null;
  system_id: string | null;
  created_at: string;
  updated_at: string;
  system?: ExploitationSystem;
}

export interface ExploitationDailyData {
  // 20+ campos de datos operacionales
  // Niveles, volúmenes, caudales, meteorología
  // Gestión de riesgo y auditoría
}
```

## Seguridad y Permisos

### Row Level Security (RLS)

Todas las tablas tienen RLS habilitado:

- **Lectura**: Todos los usuarios autenticados pueden consultar datos
- **Inserción**: Solo usuarios autenticados pueden crear registros
- **Actualización**: Los usuarios solo pueden modificar sus propios registros
- **Administración**: Usuarios administradores tienen control total

### Auditoría Completa

Cada registro incluye:
- Usuario que registró los datos
- Fecha y hora de creación
- Usuario verificador (opcional)
- Fecha y hora de verificación
- Historial de actualizaciones

## Integración con el Sistema

### Relación con otros módulos

El Módulo de Explotación se integra con:

1. **Inventario**: Datos de presas y embalses
2. **Auscultación**: Complementa lecturas de sensores
3. **Emergencias**: Activa alertas por niveles de riesgo
4. **Dashboard**: Provee datos para indicadores principales
5. **Análisis**: Fuente de datos para reportes estadísticos

### Vinculación de Presas

Se han añadido campos a la tabla `dams`:
- `exploitation_zone_id`: Zona a la que pertenece
- `exploitation_system_id`: Sistema de explotación

## Flujo de Trabajo

### Operación Diaria

1. **Registro de Datos**
   - Personal de mantenimiento accede al módulo
   - Selecciona la presa
   - Ingresa datos operacionales del día
   - Sistema valida y almacena información

2. **Revisión y Verificación**
   - Supervisor revisa datos ingresados
   - Verifica exactitud de mediciones
   - Aprueba el registro

3. **Detección Automática**
   - Sistema evalúa niveles de riesgo
   - Genera alertas si es necesario
   - Notifica a responsables

4. **Generación de Informes**
   - Usuario configura parámetros del informe
   - Selecciona formato de exportación
   - Sistema genera y descarga informe

## Requisitos Técnicos Cumplidos

✅ **Interfaz Intuitiva y Responsive**
- Diseño adaptativo para todos los dispositivos
- Navegación clara y organizada por pestañas
- Controles visuales con feedback inmediato

✅ **Procesamiento de Grandes Volúmenes**
- Índices optimizados en base de datos
- Consultas eficientes con filtros
- Paginación en tablas de datos

✅ **Búsqueda y Filtrado Avanzado**
- Filtros por presa, fecha, zona, sistema
- Rangos de fechas configurables
- Filtros combinables

✅ **Sistema de Alertas**
- 5 niveles de riesgo
- Indicadores visuales codificados por color
- Registro de observaciones de riesgo

✅ **Trazabilidad Completa**
- Registro de usuario que ingresa datos
- Timestamp de creación y actualización
- Sistema de verificación
- Historial completo de operaciones

## Próximas Mejoras (Fuera de Alcance Actual)

Las siguientes funcionalidades están identificadas para futuras versiones:

- [ ] Integración automática con SAIH (Sistema Automático de Información Hidrológica)
- [ ] Sincronización con calculadoras hidráulicas
- [ ] Exportación real a Excel/Word (actualmente con placeholders)
- [ ] Generación de gráficos estadísticos
- [ ] Alertas automáticas por email/SMS
- [ ] Predicción de caudales con ML
- [ ] Dashboard de director con KPIs agregados
- [ ] Comparativas interanuales
- [ ] API pública para datos abiertos

## Uso del Módulo

### Acceso

1. Inicie sesión en SIPRESAS
2. En el menú lateral, haga clic en "Explotación"
3. Seleccione la pestaña deseada:
   - **Panel de Control**: Visualización de datos actuales
   - **Entrada de Datos**: Registro de nuevos datos
   - **Informes**: Generación de reportes

### Registro de Datos Diarios

1. Vaya a la pestaña "Entrada de Datos"
2. Seleccione la presa
3. Ingrese la fecha del registro
4. Complete todos los campos requeridos
5. Revise los datos ingresados
6. Haga clic en "Guardar Registro"

### Generación de Informes

1. Vaya a la pestaña "Informes"
2. Seleccione el tipo de informe deseado
3. Configure los parámetros según el tipo:
   - Fechas para informes diarios
   - Año hidrológico para informes anuales
   - Zona o sistema según corresponda
4. Haga clic en el botón de exportación deseado

## Soporte y Contacto

Para preguntas o soporte sobre el Módulo de Explotación:
- Consulte la documentación del sistema
- Contacte al administrador del sistema
- Revise los logs de auditoría para trazabilidad

---

**Desarrollado para la Confederación Hidrográfica del Guadalquivir (CHG)**
**Sistema SIPRESAS - Módulo de Explotación v1.0**
