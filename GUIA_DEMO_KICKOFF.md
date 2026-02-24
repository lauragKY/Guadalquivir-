# Guía Rápida - Demo Kick-off SIPRESAS

## 🎯 Objetivo
Demostrar el prototipo del **Módulo de Emergencias y Auscultación** para SIPRESAS en 15 minutos.

---

## 📋 Checklist Pre-Demo

- [ ] Servidor de desarrollo ejecutándose (`npm run dev`)
- [ ] Usuarios de demo creados en Supabase
- [ ] Navegador abierto en `http://localhost:5173`
- [ ] Datos de prueba cargados en base de datos
- [ ] Conexión a internet estable (para Supabase)

---

## 🎬 Guión de Demostración (15 min)

### 1️⃣ **Introducción** (1 min)
"Bienvenidos al prototipo del Módulo de Emergencias y Auscultación para SIPRESAS. Este sistema permite la monitorización en tiempo real de presas hidráulicas, gestión de emergencias y análisis de datos de sensores de auscultación."

### 2️⃣ **Autenticación y Roles** (2 min)

**Acción**: Iniciar sesión
- Email: `tecnico@sipresas.es`
- Contraseña: `demo123`

**Puntos a destacar**:
- Sistema de autenticación seguro
- 4 roles: Administrador, Técnico, Operador, Consulta
- Permisos diferenciados por rol

### 3️⃣ **Dashboard Principal** (3 min)

**Lo que se muestra**:
- **KPIs principales**:
  - 8 presas totales
  - 3 emergencias activas (1 crítica)
  - Nivel medio embalses: 68.5%
  - 12 sensores activos
- **Emergencias recientes** con códigos y estados
- **Alertas de sensores** en tiempo real
- **Reloj en tiempo real**

**Mensaje clave**: "Vista unificada del estado global del sistema con acceso rápido a información crítica"

### 4️⃣ **Módulo de Emergencias** (5 min)

**Navegación**: Clic en "Emergencias" en el menú lateral

**Demostrar**:
1. **Filtros avanzados**:
   - Buscar por código: "EMG-2024-001"
   - Filtrar por severidad: "Alta"
   - Filtrar por estado: "Gestión"

2. **Lista de emergencias**:
   - EMG-2024-001: Filtración en Buendía (Alta, En gestión)
   - EMG-2024-002: Mantenimiento en La Serena (Baja, En resolución)
   - EMG-2024-003: Crecida en Alarcón (Media, Activación)

3. **Detalle de emergencia** (clic en EMG-2024-001):
   - Información completa
   - Presa afectada: Buendía
   - Estados con badges visuales
   - Tipo: Estructural
   - Responsable asignado
   - Fechas de detección

**Mensaje clave**: "Workflow completo de 6 estados: Detección → Evaluación → Activación → Gestión → Resolución → Cerrada"

### 5️⃣ **Sistema de Auscultación** (4 min)

**Navegación**: Clic en "Auscultación"

**Demostrar**:
1. **Lista de sensores** (panel izquierdo):
   - 12 sensores diferentes
   - Estados visuales (verde/amarillo/rojo)
   - Sensor en alerta: INC-CU-002

2. **Seleccionar sensor con alerta**: INC-CU-002
   - Tipo: Inclinómetro
   - Ubicación: Aliviadero de Buendía
   - Valor actual: 11.2 mm (en zona de alerta)

3. **Gráfico histórico**:
   - Mostrar última 24 horas
   - Líneas de umbral (Advertencia y Crítico)
   - Cambiar a 7 días
   - Área coloreada con tendencia

4. **Estadísticas**:
   - Valor promedio
   - Valores máximo y mínimo
   - Última actualización

**Mensaje clave**: "Monitorización continua con alertas automáticas basadas en umbrales configurables"

### 6️⃣ **Visualización en Mapa** (2 min)

**Navegación**: Clic en "Mapa"

**Demostrar**:
- Representación visual de la presa
- 12 sensores posicionados en el perfil
- Códigos de color por estado
- Hover para ver información rápida
- Clic para ver detalles completos
- Botón "Ver Gráficos" → Enlace directo a Auscultación

**Mensaje clave**: "Vista espacial para localización rápida de anomalías"

### 7️⃣ **Control de Acceso por Roles** (1 min)

**Acción**: Cerrar sesión y entrar con usuario de consulta
- Email: `consulta@sipresas.es`
- Contraseña: `demo123`

**Demostrar**:
- Usuario "Ana Rodríguez - Consulta" en header
- Puede visualizar toda la información
- Navegación completa disponible
- (Implícito: No puede modificar datos)

**Mensaje clave**: "Seguridad granular con Row Level Security (RLS) en base de datos"

### 8️⃣ **Cierre y Próximos Pasos** (1 min)

**Resumen de lo visto**:
✅ Dashboard con KPIs en tiempo real
✅ Gestión de emergencias con workflow completo
✅ Sistema de auscultación con gráficos y alertas
✅ Visualización espacial en mapa
✅ Control de acceso por roles

**Próximos pasos**:
- Integración con sistemas externos (BIM, etc.)
- Módulo de Planes de Emergencia
- Notificaciones push en tiempo real
- Exportación de informes
- Módulo de Mantenimiento Preventivo

---

## 🔑 Credenciales de Demo

| Rol | Email | Contraseña | Uso |
|-----|-------|------------|-----|
| **Técnico** | tecnico@sipresas.es | demo123 | Demo principal |
| **Admin** | admin@sipresas.es | demo123 | Gestión completa |
| **Operador** | operador@sipresas.es | demo123 | Operaciones |
| **Consulta** | consulta@sipresas.es | demo123 | Solo lectura |

---

## 🗂️ Datos de Referencia Rápida

### Presas Cargadas
1. Embalse de Alarcón (Cuenca) - 68.5%
2. Embalse de Almendra (Zamora) - 82.3%
3. Embalse del Atazar (Madrid) - 91.2%
4. Embalse de Buendía (Cuenca/Guadalajara) - 45.2% ⚠️ **EN ALERTA**
5. Embalse de la Serena (Badajoz) - 38.8% 🔧 **MANTENIMIENTO**
6. Embalse de Mequinenza (Zaragoza) - 73.9%
7. Embalse de Ricobayo (Zamora) - 88.4%
8. Embalse de Yesa (Navarra) - 55.7%

### Emergencias Activas
- **EMG-2024-001**: Filtración en Buendía (🔴 Alta, En gestión)
- **EMG-2024-002**: Mantenimiento en La Serena (🟢 Baja, En resolución)
- **EMG-2024-003**: Crecida en Alarcón (🟡 Media, Activación)

### Sensores con Alertas
- **INC-CU-002**: Inclinómetro en Buendía (⚠️ Alerta - 11.2 mm)
- **PIZ-CU-001**: Piezómetro en Buendía (⚠️ Precaución - 68.3 mca)

---

## 💡 Mensajes Clave para Transmitir

1. **Integración completa**: Base de datos, autenticación, visualizaciones y lógica de negocio integradas
2. **Escalabilidad**: Arquitectura modular lista para crecer
3. **Seguridad**: RLS a nivel de base de datos, no solo frontend
4. **UX profesional**: Diseño moderno, responsive e intuitivo
5. **Datos reales**: Presas españolas reales con datos simulados realistas
6. **Listo para producción**: Con ajustes de rendimiento y más datos, puede desplegarse

---

## ⚠️ Posibles Preguntas

### "¿Cómo se actualizan los datos de sensores?"
"En el prototipo los datos son simulados. En producción, se integraría con los sistemas SCADA existentes mediante APIs o protocolos industriales (Modbus, OPC UA, etc.)"

### "¿Puede escalar a más presas?"
"Absolutamente. La arquitectura está diseñada para soportar cientos de presas. Los componentes son reutilizables y la base de datos está optimizada con índices."

### "¿Cómo se gestionan las notificaciones?"
"El prototipo muestra alertas visuales. En producción se implementarían notificaciones push, emails y SMS usando servicios como Supabase Realtime o WebSockets."

### "¿Qué pasa con los datos históricos?"
"El sistema puede almacenar años de datos. Se implementarían estrategias de archivado y agregación para datos antiguos (promedios diarios/mensuales)."

### "¿Es compatible con móviles?"
"Sí, el diseño es responsive. Para una app nativa, el mismo backend Supabase soporta React Native o Flutter."

---

## 🎯 Tips para una Demo Exitosa

1. **Practica el flujo 2-3 veces** antes de la presentación
2. **Ten pestañas de respaldo abiertas** por si algo falla
3. **Cierra notificaciones y apps innecesarias** durante la demo
4. **Modo presentación**: Zoom 110-125% en navegador para mejor visibilidad
5. **Mencion a que es un prototipo**: Deja claro que es una demostración, no producción final
6. **Gestiona el tiempo**: Deja 3-5 min al final para preguntas
7. **Ten un plan B**: Capturas de pantalla si falla la conexión

---

## 📞 Contacto Post-Demo

Tras la presentación, proporcionar:
- Repositorio de código (si es público)
- Documentación técnica
- Roadmap de desarrollo
- Siguiente reunión de seguimiento

---

**¡Éxito en la demostración! 🚀**
