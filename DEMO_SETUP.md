# Configuración de Demostración - SIPRESAS

## Prototipo Kick-off: Módulo de Emergencias y Auscultación

Este documento describe cómo configurar y ejecutar el prototipo para la presentación del kick-off.

---

## 1. Requisitos Previos

- Node.js 18+ instalado
- Cuenta de Supabase configurada
- Variables de entorno configuradas en `.env`

---

## 2. Instalación

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

---

## 3. Usuarios de Demostración

### Usuarios Precreados

Los usuarios de demostración ya están creados y listos para usar:

#### 3.1 Usuario Administrador
- **Email**: `admin@sipresas.es`
- **Contraseña**: `demo123`
- **Rol**: `admin`
- **Nombre**: Juan García Administrador

#### 3.2 Usuario Técnico
- **Email**: `tecnico@sipresas.es`
- **Contraseña**: `demo123`
- **Rol**: `technician`
- **Nombre**: María López Técnico

#### 3.3 Usuario Operador
- **Email**: `operador@sipresas.es`
- **Contraseña**: `demo123`
- **Rol**: `operator`
- **Nombre**: Carlos Martínez Operador

#### 3.4 Usuario Consulta
- **Email**: `consulta@sipresas.es`
- **Contraseña**: `demo123`
- **Rol**: `consultation`
- **Nombre**: Ana Rodríguez Consulta

### Regenerar Usuarios (si es necesario)

Si necesitas recrear los usuarios de demostración, ejecuta:

```bash
curl -X POST "{SUPABASE_URL}/functions/v1/setup-demo-users" \
  -H "Authorization: Bearer {SUPABASE_ANON_KEY}" \
  -H "Content-Type: application/json"
```

Reemplaza `{SUPABASE_URL}` y `{SUPABASE_ANON_KEY}` con los valores de tu archivo `.env`.

---

## 4. Datos de Demostración

El prototipo incluye datos precargados:

### Presas (8 presas reales españolas)
- Embalse de Alarcón (Cuenca)
- Embalse de Almendra (Zamora)
- Embalse del Atazar (Madrid)
- Embalse de Buendía (Cuenca/Guadalajara)
- Embalse de la Serena (Badajoz)
- Embalse de Mequinenza (Zaragoza)
- Embalse de Ricobayo (Zamora)
- Embalse de Yesa (Navarra)

### Emergencias Activas (3)
- Filtración en Buendía (Alta severidad, En gestión)
- Mantenimiento en La Serena (Baja severidad, En resolución)
- Crecida en Alarcón (Media severidad, Activación)

### Sensores de Auscultación (12 sensores)
- Piezómetros
- Inclinómetros
- Extensómetros
- Caudalímetros
- Acelerómetros
- Estaciones meteorológicas

### Lecturas de Sensores
- 72 horas de datos históricos simulados
- Alertas activas en sensores de Buendía

---

## 5. Flujo de Demostración Recomendado

### 5.1 Login y Dashboard (3 min)
1. Acceder con usuario técnico: `tecnico@sipresas.es` / `demo123`
2. Mostrar Dashboard principal con KPIs
3. Destacar:
   - 8 presas monitorizadas
   - 3 emergencias activas
   - Nivel medio de embalses: 68.5%
   - Sensores con alertas

### 5.2 Módulo de Emergencias (5 min)
1. Navegar a "Emergencias"
2. Mostrar lista de emergencias con filtros
3. Filtrar por severidad "Alta" → Ver filtración en Buendía
4. Hacer clic para ver detalles completos
5. Mostrar flujo de estados:
   - Detección → Evaluación → Activación → Gestión → Resolución → Cerrada

### 5.3 Sistema de Auscultación (4 min)
1. Navegar a "Auscultación"
2. Seleccionar sensor con alerta: INC-CU-002 (Inclinómetro en Buendía)
3. Mostrar:
   - Gráfico histórico de 24h
   - Umbrales de alerta visibles
   - Valor actual vs. umbrales
   - Estadísticas del sensor
4. Cambiar rango temporal (7 días, 30 días)

### 5.4 Visualización en Mapa (2 min)
1. Navegar a "Mapa"
2. Mostrar representación visual de sensores
3. Hacer clic en sensores con diferentes estados
4. Mostrar detalles y acceso directo a gráficos

### 5.5 Roles y Permisos (1 min)
1. Cerrar sesión
2. Iniciar sesión con usuario de consulta: `consulta@sipresas.es`
3. Mostrar que puede ver datos pero no modificar
4. Destacar el nombre y rol en la barra superior

---

## 6. Puntos Clave para Destacar

### Funcionalidades Implementadas
✅ Autenticación y control de acceso por roles
✅ Dashboard con KPIs en tiempo real
✅ Gestión completa de emergencias con workflow
✅ Sistema de auscultación con visualización de sensores
✅ Alertas automáticas basadas en umbrales
✅ Datos históricos y gráficos interactivos
✅ Filtrado y búsqueda avanzada
✅ Diseño responsive y moderno
✅ Base de datos Supabase con RLS
✅ Datos realistas de presas españolas

### Escalabilidad
- Arquitectura modular y componentes reutilizables
- Base de datos relacional con políticas de seguridad
- API REST con Supabase
- Frontend construido con React + TypeScript
- Diseño preparado para ampliación

---

## 7. Estructura del Proyecto

```
src/
├── components/          # Componentes reutilizables
│   ├── ui/             # Componentes de UI (Badge, Card, StatusBadge, etc.)
│   ├── Layout.tsx      # Layout principal con navegación
│   └── ProtectedRoute.tsx
├── contexts/           # Contextos de React
│   └── AuthContext.tsx # Gestión de autenticación
├── lib/               # Librerías y configuración
│   └── supabase.ts    # Cliente de Supabase
├── pages/             # Páginas de la aplicación
│   ├── Login.tsx      # Página de login
│   ├── Dashboard.tsx  # Dashboard principal
│   ├── Incidents.tsx  # Gestión de emergencias
│   ├── Auscultation.tsx # Sistema de auscultación
│   ├── Map.tsx        # Mapa de sensores
│   ├── Analytics.tsx  # Análisis y reportes
│   └── Settings.tsx   # Configuración
├── services/          # Servicios y API
│   └── api.ts         # Funciones de API con Supabase
├── types/             # Tipos TypeScript
│   └── index.ts       # Definiciones de tipos
└── App.tsx            # Componente principal
```

---

## 8. Tecnologías Utilizadas

- **Frontend**: React 18, TypeScript, Vite
- **Estilos**: Tailwind CSS
- **Routing**: React Router v7
- **Gráficos**: Recharts
- **Iconos**: Lucide React
- **Backend**: Supabase (PostgreSQL + Auth + RLS)
- **Hosting**: Compatible con Vercel, Netlify, etc.

---

## 9. Próximos Pasos (Post Kick-off)

### Módulos Adicionales
- Gestión de Planes de Emergencia (visualización de PDFs)
- Módulo de Mantenimiento Preventivo
- Sistema de Notificaciones en tiempo real
- Exportación de informes (PDF, Excel)
- Integración con sistemas externos (BIM)

### Mejoras Técnicas
- Optimización de carga de datos
- Caché y paginación
- Tests automatizados
- CI/CD pipeline
- Documentación de API

---

## 10. Soporte

Para preguntas o problemas durante la demostración, contactar con el equipo de desarrollo.

**Nota**: Este es un prototipo para kick-off. Los datos son simulados y el sistema está optimizado para demostración, no para producción.
