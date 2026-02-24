# SIPRESAS - Guía de Identidad Visual Corporativa

## Colores Corporativos

### Paleta Principal

| Color | Hex Code | Uso |
|-------|----------|-----|
| **Azul Primario** | `#1e5a8e` | Botones principales, títulos, navegación |
| **Azul Secundario** | `#2874b5` | Enlaces, hover states, elementos interactivos |
| **Azul Claro** | `#4a9fd8` | Fondos activos, highlights, selección |
| **Azul Muy Claro** | `#a4c8e1` | Bordes, separadores sutiles |
| **Azul Ultraclaro** | `#e8f2f9` | Fondos de contenedor, sidebar |
| **Azul Oscuro** | `#0d3859` | Texto importante, headers principales |
| **Azul Más Oscuro** | `#082841` | Gradientes, fondos oscuros |

### Colores de Estado

| Estado | Color | Uso |
|--------|-------|-----|
| **Información** | Azul Primario | Mensajes informativos, datos generales |
| **Éxito** | Verde `#16a34a` | Operaciones exitosas, estado operativo |
| **Advertencia** | Amarillo `#ca8a04` | Alertas, precauciones |
| **Error/Crítico** | Rojo `#dc2626` | Errores, estados críticos |

## Tipografía

### Fuente Principal
**Inter** - Moderna, legible, profesional

```css
font-family: 'Inter', system-ui, -apple-system, sans-serif;
```

### Jerarquía Tipográfica

- **Título Principal (H1)**: 24px, Bold, Color: Azul Oscuro
- **Subtítulo (H2)**: 18px, SemiBold, Color: Azul Primario
- **Título de Sección (H3)**: 16px, SemiBold, Color: Azul Oscuro
- **Texto de Cuerpo**: 14px, Regular, Color: Gris `#374151`
- **Texto Pequeño**: 12px, Regular, Color: Gris Claro `#6b7280`

## Componentes UI

### Botones

#### Botón Primario
```html
<button class="btn-sipresas-primary">
  Acción Principal
</button>
```
- Fondo: Azul Primario
- Texto: Blanco
- Hover: Azul Secundario
- Sombra sutil

#### Botón Secundario
```html
<button class="btn-sipresas-secondary">
  Acción Secundaria
</button>
```
- Fondo: Blanco
- Borde: Azul Primario
- Texto: Azul Primario
- Hover: Fondo Azul Ultraclaro

#### Botón Outline
```html
<button class="btn-sipresas-outline">
  Acción Terciaria
</button>
```
- Fondo: Transparente
- Borde: Azul Muy Claro
- Texto: Azul Primario
- Hover: Fondo Azul Ultraclaro

### Tablas

```html
<table class="table-sipresas">
  <thead>
    <tr>
      <th>Columna 1</th>
      <th>Columna 2</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Dato 1</td>
      <td>Dato 2</td>
    </tr>
  </tbody>
</table>
```

**Características:**
- Cabecera: Fondo Azul Ultraclaro
- Texto cabecera: Mayúsculas, pequeño, bold, Azul Oscuro
- Filas: Hover con fondo Azul Ultraclaro al 30%
- Bordes sutiles en gris claro

### Alertas

#### Información
```html
<div class="alert-sipresas-info">
  Mensaje informativo
</div>
```

#### Éxito
```html
<div class="alert-sipresas-success">
  Operación exitosa
</div>
```

#### Advertencia
```html
<div class="alert-sipresas-warning">
  Precaución necesaria
</div>
```

#### Error
```html
<div class="alert-sipresas-error">
  Error detectado
</div>
```

**Características:**
- Borde izquierdo grueso (4px) del color correspondiente
- Fondo claro del color correspondiente
- Padding consistente
- Bordes redondeados a la derecha

### Tarjetas

```html
<div class="card-sipresas">
  <!-- Contenido -->
</div>
```

**Características:**
- Fondo blanco
- Bordes redondeados
- Sombra sutil
- Borde gris claro
- Padding de 24px

### Inputs

```html
<input type="text" class="input-sipresas" placeholder="Texto..." />
```

**Características:**
- Borde gris claro
- Focus: Ring azul claro, borde transparente
- Padding consistente
- Bordes redondeados

### Badges

```html
<span class="badge-sipresas-primary">Primario</span>
<span class="badge-sipresas-success">Éxito</span>
<span class="badge-sipresas-warning">Advertencia</span>
<span class="badge-sipresas-error">Error</span>
```

**Características:**
- Redondeados completamente
- Texto pequeño (12px)
- Padding horizontal mayor que vertical
- Colores según estado

## Layout

### Header Principal
- **Altura**: 56px (3.5rem)
- **Fondo**: Gradiente de Azul Oscuro a Azul Secundario
- **Logo**: Icono con fondo translúcido blanco + texto "SIPRESAS" en blanco
- **Elementos**: Logos institucionales (Gobierno de España, Ministerio)
- **Información de usuario**: Texto blanco, rol en azul claro

### Sidebar
- **Ancho**: 256px (16rem)
- **Fondo**: Azul Ultraclaro `#e8f2f9`
- **Items inactivos**: Texto Azul Oscuro, hover con fondo Azul Muy Claro al 50%
- **Items activos**: Fondo Azul Claro, texto blanco, sombra sutil
- **Iconos**: 18px, alineados a la izquierda

### Área de Contenido
- **Fondo**: Gris claro `#f9fafb`
- **Padding**: 24px (1.5rem)
- **Espaciado entre secciones**: Consistente

## Logos Institucionales

### Logo SIPRESAS
- Icono de gota de agua en círculo
- Colores: Blanco sobre fondo azul translúcido
- Tipografía: "SIPRESAS" en mayúsculas, bold

### Logos del Gobierno
En la cabecera superior derecha:
1. **Gobierno de España**
   - Rectángulo amarillo: "GOBIERNO"
   - Rectángulo rojo: "DE ESPAÑA"

2. **Ministerio**
   - Texto en blanco sobre fondo azul
   - Multilinea: "MINISTERIO PARA LA / TRANSICIÓN ECOLÓGICA Y / EL RETO DEMOGRÁFICO"

## Principios de Diseño

1. **Sobriedad**: Evitar elementos decorativos innecesarios
2. **Institucional**: Mantener profesionalismo y seriedad
3. **Claridad**: Información jerárquica y fácil de leer
4. **Consistencia**: Usar los mismos patrones en toda la aplicación
5. **Accesibilidad**: Contraste adecuado para lectura
6. **Eficiencia**: Interfaz funcional, no llamativa

## Espaciado

Usar el sistema de espaciado de 4px:
- **xs**: 4px
- **sm**: 8px
- **md**: 16px
- **lg**: 24px
- **xl**: 32px
- **2xl**: 48px

## Sombras

- **Sutil**: `shadow-sm` - Para tarjetas y botones
- **Media**: `shadow-md` - Para header y elementos elevados
- **Ninguna**: Para elementos integrados en el fondo

## Estados Interactivos

### Hover
- Transición suave (200-300ms)
- Cambio sutil de color (10-15% más claro/oscuro)
- Sin cambios bruscos

### Active/Selected
- Fondo Azul Claro
- Texto blanco
- Sombra sutil para elevar

### Disabled
- Opacidad 50%
- Cursor not-allowed
- Sin hover

## Iconografía

- **Librería**: Lucide React
- **Tamaño estándar**: 20px
- **Tamaño pequeño**: 16px
- **Tamaño grande**: 24px
- **Color**: Heredar del contenedor o Azul Primario
