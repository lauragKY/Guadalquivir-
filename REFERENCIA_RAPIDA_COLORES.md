# Referencia Rápida - Colores SIPRESAS

## Guía de Uso Diario para Desarrolladores

### Colores Institucionales (Azul)

```tsx
// PRIMARIOS - Navegación, Botones, Estructura
bg-sipresas-primary      // #1e5a8e - Botón principal
bg-sipresas-secondary    // #2874b5 - Hover, links
bg-sipresas-dark         // #0d3859 - Títulos importantes
bg-sipresas-darker       // #082841 - Header gradientes

// CLAROS - Fondos, Áreas secundarias
bg-sipresas-lightest     // #e8f2f9 - Sidebar, fondos grandes
bg-sipresas-lighter      // #a4c8e1 - Bordes sutiles
bg-sipresas-light        // #4a9fd8 - Selección, activo

// TEXTO
text-sipresas-primary    // Azul primario
text-sipresas-dark       // Azul oscuro para títulos
```

### Colores Hidráulicos (Aqua/Cyan)

```tsx
// Para elementos relacionados con agua
bg-aqua                  // #06b6d4 - Principal
bg-aqua-dark            // #0e7490 - Agua profunda
bg-aqua-light           // #67e8f9 - Efectos de agua
bg-cyan-100             // Fondos de agua claros

// Iconos de agua
<Droplet className="text-cyan-500" />
```

### Estados del Sistema

#### Verde - Éxito/Operativo
```tsx
// Presa operativa, operación exitosa
bg-green-100 text-green-800      // Badges
bg-green-600 hover:bg-green-700  // Botones
border-green-300                 // Bordes
```

#### Amarillo - Advertencia
```tsx
// Mantenimiento, precaución
bg-yellow-100 text-yellow-800    // Badges
bg-yellow-50 border-yellow-600   // Alertas
text-yellow-600                  // Texto de advertencia
```

#### Naranja - Alerta
```tsx
// Atención requerida, alerta
bg-orange-100 text-orange-800    // Badges
bg-orange-50 border-orange-600   // Alertas
text-orange-600                  // Texto de alerta
```

#### Rojo - Emergencia/Error
```tsx
// Crítico, emergencia, error
bg-red-100 text-red-800          // Badges
bg-red-600 hover:bg-red-700      // Botones peligro
border-red-300                   // Bordes de error
```

#### Azul - Información
```tsx
// Mensajes informativos
bg-blue-50 text-blue-900         // Alertas info
bg-blue-100 text-blue-800        // Badges info
```

---

## Componentes Comunes

### 1. Botón Principal
```tsx
<button className="btn-sipresas-primary">
  Guardar
</button>
```

### 2. Botón Secundario
```tsx
<button className="btn-sipresas-secondary">
  Cancelar
</button>
```

### 3. Badge Operativo
```tsx
<span className="status-operational">
  <CheckCircle size={14} />
  Operativa
</span>
```

### 4. Badge Mantenimiento
```tsx
<span className="status-maintenance">
  <Activity size={14} />
  Mantenimiento
</span>
```

### 5. Badge Emergencia
```tsx
<span className="status-emergency">
  <XCircle size={14} />
  Emergencia
</span>
```

### 6. Alerta de Éxito
```tsx
<div className="alert-sipresas-success">
  <div className="flex items-start gap-3">
    <CheckCircle className="w-5 h-5 mt-0.5" />
    <div>
      <h3 className="font-medium text-sm">Operación exitosa</h3>
      <p className="text-sm mt-1">Los cambios se guardaron.</p>
    </div>
  </div>
</div>
```

### 7. Alerta de Error
```tsx
<div className="alert-sipresas-error">
  <div className="flex items-start gap-3">
    <XCircle className="w-5 h-5 mt-0.5" />
    <div>
      <h3 className="font-medium text-sm">Error</h3>
      <p className="text-sm mt-1">No se pudo completar.</p>
    </div>
  </div>
</div>
```

### 8. Tabla
```tsx
<table className="table-sipresas">
  <thead>
    <tr>
      <th>Código</th>
      <th>Nombre</th>
      <th>Estado</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>CHE801</td>
      <td>LA BREÑA II</td>
      <td>
        <span className="status-operational">
          <CheckCircle size={12} />
          Operativa
        </span>
      </td>
    </tr>
  </tbody>
</table>
```

### 9. Input
```tsx
<input
  type="text"
  className="input-sipresas"
  placeholder="Ingrese el valor..."
/>
```

### 10. Select
```tsx
<select className="select-sipresas">
  <option>Opción 1</option>
  <option>Opción 2</option>
</select>
```

### 11. Tarjeta
```tsx
<div className="card-sipresas">
  <h3 className="title-sipresas">Título</h3>
  <p className="text-sipresas-muted">Descripción</p>
</div>
```

### 12. Indicador de Nivel
```tsx
<div className="level-indicator">
  <div className="level-bar">
    <div className="level-fill-optimal" style={{ width: '75%' }}></div>
  </div>
  <span className="text-sm font-medium text-green-600">75%</span>
</div>
```

---

## Decisiones Rápidas

### ¿Qué color usar para...?

| Situación | Color | Clase |
|-----------|-------|-------|
| Presa operativa | Verde | `status-operational` |
| Presa en mantenimiento | Azul institucional | `status-maintenance` |
| Alerta de nivel | Amarillo | `status-alert` |
| Advertencia | Naranja | `status-warning` |
| Emergencia | Rojo | `status-emergency` |
| Sensor activo | Verde | `bg-green-100 text-green-800` |
| Sensor en fallo | Rojo | `bg-red-100 text-red-800` |
| Dato informativo | Azul | `bg-blue-50 text-blue-900` |
| Botón principal | Azul primario | `btn-sipresas-primary` |
| Botón cancelar | Blanco con borde | `btn-sipresas-secondary` |
| Botón peligro | Rojo | `btn-sipresas-danger` |
| Nivel de agua óptimo | Verde | `level-fill-optimal` |
| Nivel de agua crítico | Rojo | `level-fill-critical-high` |
| Cabecera principal | Gradiente azul | `gradient-header` |
| Fondo sidebar | Azul ultraclaro | `bg-sipresas-lightest` |
| Texto principal | Gris oscuro | `text-gray-900` |
| Texto secundario | Gris medio | `text-gray-600` |
| Bordes sutiles | Gris claro | `border-gray-200` |

---

## Niveles de Agua (Por Porcentaje)

```tsx
const getWaterLevelColor = (percentage: number) => {
  if (percentage >= 95) return 'level-fill-critical-high';  // Rojo
  if (percentage >= 85) return 'level-fill-high';           // Naranja
  if (percentage >= 60) return 'level-fill-optimal';        // Verde
  if (percentage >= 40) return 'level-fill-normal';         // Azul
  if (percentage >= 25) return 'level-fill-low';            // Amarillo
  return 'level-fill-critical-low';                          // Rojo
};
```

---

## Contraste y Accesibilidad

### ✅ Combinaciones Seguras (WCAG AA+)

```tsx
// Texto oscuro sobre fondos claros
text-sipresas-dark on bg-sipresas-lightest  // ✓ Excelente
text-gray-900 on bg-white                    // ✓ Excelente
text-green-800 on bg-green-100              // ✓ Bueno
text-red-800 on bg-red-100                  // ✓ Bueno

// Texto claro sobre fondos oscuros
text-white on bg-sipresas-primary           // ✓ Bueno
text-white on bg-green-600                  // ✓ Excelente
text-white on bg-red-600                    // ✓ Excelente
```

### ❌ Evitar

```tsx
// Contraste insuficiente
text-yellow-500 on bg-white                 // ❌ Pobre
text-gray-400 on bg-white                   // ❌ Pobre
text-sipresas-light on bg-white             // ❌ Límite
```

---

## CSS Variables Disponibles

```css
/* Institucionales */
var(--sipresas-darker)      /* #082841 */
var(--sipresas-dark)        /* #0d3859 */
var(--sipresas-primary)     /* #1e5a8e */
var(--sipresas-secondary)   /* #2874b5 */
var(--sipresas-light)       /* #4a9fd8 */
var(--sipresas-lighter)     /* #a4c8e1 */
var(--sipresas-lightest)    /* #e8f2f9 */

/* Hidráulicos */
var(--aqua-dark)            /* #0e7490 */
var(--aqua)                 /* #06b6d4 */
var(--aqua-light)           /* #67e8f9 */

/* Funcionales */
var(--success)              /* #16a34a */
var(--warning)              /* #ca8a04 */
var(--alert)                /* #ea580c */
var(--error)                /* #dc2626 */
var(--info)                 /* #3b82f6 */
```

---

## Tips de Uso

1. **Siempre incluir iconos con estados** - Mejora accesibilidad
2. **Usar fondos claros con bordes de color** - Mejor legibilidad
3. **No usar solo color para diferenciar** - Añadir iconos/texto
4. **Preferir clases predefinidas** - Mantiene consistencia
5. **Gradientes solo en headers** - No abusar
6. **Bordes sutiles en tablas** - Profesionalismo

---

## Herramientas de Debug

### Ver todos los colores en uso
Navegar a: `/color-palette` (componente de demostración)

### Verificar contraste
- Chrome DevTools > Accessibility
- https://webaim.org/resources/contrastchecker/

### Simular daltonismo
- Chrome DevTools > Rendering > Emulate vision deficiencies
