# SIPRESAS - Sistema de Información de Presas
## Prototipo Kick-off: Módulo de Emergencias y Auscultación

Prototipo funcional de alta fidelidad para el **Módulo de Gestión de Emergencias y Auscultación** del Sistema de Información de Presas (SIPRESAS).

---

## 🎯 Descripción

Este prototipo demuestra las capacidades de un sistema completo para la gestión de seguridad de presas hidráulicas, incluyendo:

- **Dashboard en Tiempo Real**: Monitorización del estado global con KPIs
- **Gestión de Emergencias**: Workflow completo de 6 estados
- **Sistema de Auscultación**: Análisis de sensores con gráficos históricos
- **Mapa Interactivo**: Visualización espacial de instrumentación
- **Control de Acceso**: Autenticación y roles (Admin, Técnico, Operador, Consulta)
- **Alertas Automáticas**: Basadas en umbrales configurables

---

## 🚀 Inicio Rápido

### Requisitos Previos
- Node.js 18+ instalado
- Cuenta de Supabase configurada
- Variables de entorno en `.env`

### Instalación

```bash
# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run dev

# Construir para producción
npm run build
```

El prototipo estará disponible en: **http://localhost:5173**

---

## 🔑 Acceso al Sistema

### Credenciales de Demostración

| Rol | Email | Contraseña | Permisos |
|-----|-------|------------|----------|
| **Técnico** | tecnico@sipresas.es | demo123 | Gestión completa |
| **Admin** | admin@sipresas.es | demo123 | Configuración sistema |
| **Operador** | operador@sipresas.es | demo123 | Operaciones |
| **Consulta** | consulta@sipresas.es | demo123 | Solo lectura |

**Nota**: Los usuarios deben ser creados en Supabase. Ver `DEMO_SETUP.md` para instrucciones completas.

---

## 📊 Datos Precargados

### 8 Presas Reales Españolas
- Embalse de Alarcón (Cuenca)
- Embalse de Almendra (Zamora)
- Embalse del Atazar (Madrid)
- Embalse de Buendía (Cuenca/Guadalajara) ⚠️
- Embalse de la Serena (Badajoz) 🔧
- Embalse de Mequinenza (Zaragoza)
- Embalse de Ricobayo (Zamora)
- Embalse de Yesa (Navarra)

### 3 Emergencias Activas
- **EMG-2024-001**: Filtración en Buendía (Alta, En gestión)
- **EMG-2024-002**: Mantenimiento en La Serena (Baja, En resolución)
- **EMG-2024-003**: Crecida en Alarcón (Media, Activación)

### 12 Sensores de Auscultación
- Piezómetros (presión intersticial)
- Inclinómetros (desplazamientos)
- Extensómetros (juntas)
- Caudalímetros (caudales)
- Acelerómetros (actividad sísmica)
- Estaciones meteorológicas

### 72 Horas de Datos Históricos
- Lecturas cada 2 horas
- 2 sensores con alertas activas
- Umbrales configurables por sensor

---

## 📁 Estructura del Proyecto

```
src/
├── components/
│   ├── ui/                      # Componentes reutilizables
│   │   ├── Badge.tsx
│   │   ├── Card.tsx
│   │   ├── StatCard.tsx
│   │   └── StatusBadge.tsx
│   ├── Layout.tsx               # Layout con navegación
│   └── ProtectedRoute.tsx       # Rutas protegidas
├── contexts/
│   └── AuthContext.tsx          # Gestión de autenticación
├── lib/
│   └── supabase.ts              # Cliente Supabase
├── pages/
│   ├── Login.tsx                # Autenticación
│   ├── Dashboard.tsx            # Panel de control
│   ├── Incidents.tsx            # Gestión de emergencias
│   ├── Auscultation.tsx         # Sistema de auscultación
│   ├── Map.tsx                  # Mapa de sensores
│   ├── Analytics.tsx            # Análisis y reportes
│   └── Settings.tsx             # Configuración
├── services/
│   └── api.ts                   # Funciones de API
├── types/
│   └── index.ts                 # Tipos TypeScript
└── App.tsx                      # Configuración de rutas
```

---

## 🎨 Características Principales

### ✅ Dashboard
- KPIs en tiempo real (presas, emergencias, sensores, nivel medio)
- Lista de emergencias recientes con estados visuales
- Alertas de sensores con enlaces directos
- Reloj en tiempo real
- Banners de atención para emergencias críticas

### ✅ Gestión de Emergencias
- Workflow de 6 estados: Detección → Evaluación → Activación → Gestión → Resolución → Cerrada
- Filtros por severidad, estado y búsqueda
- Detalles completos con presa afectada
- Badges visuales de estado y severidad
- Responsables asignados

### ✅ Sistema de Auscultación
- Lista de 12 sensores con estados visuales
- Gráficos históricos interactivos (Recharts)
- Rangos temporales: 24h, 7 días, 30 días
- Umbrales de alerta visibles en gráficos
- Estadísticas calculadas automáticamente
- Estados: activo, inactivo, mantenimiento, fallo

### ✅ Mapa Interactivo
- Representación visual de perfil de presa
- Sensores geolocalizados con código de colores
- Tooltips informativos al hover
- Panel de detalles al seleccionar
- Animación para sensores críticos

### ✅ Control de Acceso
- Autenticación segura con Supabase Auth
- 4 roles con permisos diferenciados
- Row Level Security (RLS) en base de datos
- Sesiones persistentes
- Logout seguro

---

## 🛠️ Stack Tecnológico

### Frontend
- **React 18**: Framework de UI
- **TypeScript**: Type-safety
- **Vite**: Build tool rápido
- **Tailwind CSS**: Sistema de diseño
- **React Router v7**: Navegación SPA
- **Recharts**: Visualización de datos
- **Lucide React**: Iconografía

### Backend & Base de Datos
- **Supabase**: Backend as a Service
  - PostgreSQL con extensiones
  - Autenticación integrada
  - Row Level Security (RLS)
  - APIs REST automáticas
  - Realtime subscriptions

### Seguridad
- Autenticación JWT
- Políticas RLS por tabla
- Validación de permisos en backend
- Sesiones encriptadas

---

## 📖 Documentación

- **[DEMO_SETUP.md](./DEMO_SETUP.md)**: Configuración completa del prototipo
- **[GUIA_DEMO_KICKOFF.md](./GUIA_DEMO_KICKOFF.md)**: Guía rápida para la presentación (15 min)
- **[scripts/setup-demo-users.sql](./scripts/setup-demo-users.sql)**: Script para crear usuarios de demo

---

## 🎬 Flujo de Demostración Recomendado

1. **Login** (1 min) - Credenciales de técnico
2. **Dashboard** (3 min) - KPIs y vista general
3. **Emergencias** (5 min) - Filtros, detalle y workflow
4. **Auscultación** (4 min) - Gráficos y alertas
5. **Mapa** (2 min) - Visualización espacial

Ver `GUIA_DEMO_KICKOFF.md` para el guión completo.

---

## 🔧 Scripts Disponibles

```bash
# Desarrollo
npm run dev          # Servidor de desarrollo con HMR

# Producción
npm run build        # Build optimizado para producción
npm run preview      # Vista previa del build

# Calidad de Código
npm run lint         # Linting con ESLint
npm run typecheck    # Verificación de tipos TypeScript
```

---

## 📊 Esquema de Base de Datos

### Tablas Principales
- `user_profiles`: Perfiles de usuario con roles
- `dams`: Información de presas
- `emergencies`: Registro de emergencias
- `emergency_plans`: Planes de emergencia
- `sensors`: Instrumentación de auscultación
- `sensor_readings`: Lecturas históricas de sensores

### Políticas RLS
- Autenticación requerida para todas las lecturas
- Roles Admin/Técnico pueden modificar
- Operadores pueden actualizar emergencias asignadas
- Usuarios de Consulta solo lectura

---

## 🎨 Sistema de Diseño

### Colores por Estado
- **Verde (#10b981)**: Operacional, normal
- **Amarillo (#eab308)**: Precaución, advertencia
- **Naranja (#f97316)**: Alerta
- **Rojo (#ef4444)**: Crítico, emergencia
- **Azul (#3b82f6)**: Información, acciones
- **Gris (#64748b)**: Inactivo, offline

### Tipografía
- Sistema de fuentes: Inter (fallback a system fonts)
- Escala responsiva con Tailwind

---

## 🌐 Compatibilidad

- ✅ Chrome/Edge (últimas 2 versiones)
- ✅ Firefox (últimas 2 versiones)
- ✅ Safari (últimas 2 versiones)
- ✅ Responsive: Desktop (1920x1080), Tablet (768px+), Mobile (básico)

---

## 🚀 Próximos Pasos (Post Kick-off)

### Funcionalidades
- [ ] Módulo de Planes de Emergencia con visualización de PDFs
- [ ] Sistema de notificaciones en tiempo real (push/email/SMS)
- [ ] Exportación de informes (PDF, Excel)
- [ ] Módulo de Mantenimiento Preventivo
- [ ] Integración con sistemas BIM
- [ ] Dashboard de análisis avanzado

### Técnicas
- [ ] Tests unitarios y E2E
- [ ] CI/CD pipeline
- [ ] Optimización de rendimiento
- [ ] Caché y paginación
- [ ] Documentación de API
- [ ] Logs y monitorización

---

## 💡 Notas Técnicas

### Datos en Tiempo Real
En producción se integraría con:
- Sistemas SCADA (Modbus, OPC UA)
- Base de datos time-series (TimescaleDB)
- APIs de terceros (meteorología, hidrología)

### Escalabilidad
- Arquitectura modular y componentes reutilizables
- Base de datos con índices optimizados
- Consultas eficientes con Supabase
- Preparado para cientos de presas y miles de sensores

---

## 📞 Soporte

Para preguntas sobre este prototipo:
- Ver `DEMO_SETUP.md` para configuración
- Ver `GUIA_DEMO_KICKOFF.md` para demo
- Código comentado en `/src`

---

**Prototipo desarrollado para Kick-off** 🚀

*Versión 1.0.0 - Prototipo Funcional*
*Ministerio para la Transición Ecológica y el Reto Demográfico*
