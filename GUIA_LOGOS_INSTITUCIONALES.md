# Guía de Logos Institucionales SIPRESAS

## Logos Oficiales Implementados

Esta guía documenta los logos institucionales oficiales utilizados en el sistema SIPRESAS.

---

## 1. Logo SIPRESAS

### Descripción
El logo de SIPRESAS representa ondas de agua mediante círculos concéntricos en tonos azules institucionales, simbolizando la naturaleza hídrica del sistema.

### Componente
**Archivo:** `src/components/logos/SipresasLogo.tsx`

### Características Visuales
- **Diseño:** Anillos concéntricos (ondas de agua radiantes)
- **Técnica:** Gradientes radiales con efecto de profundidad 3D
- **Colores (de exterior a interior):**
  - **Anillo exterior:** Gradiente de `#7dc8f0` a `#4db8e8` (Azul Celeste)
  - **Anillo medio:** Gradiente de `#3ba9dd` a `#2b8fc9` (Azul Medio)
  - **Anillo interior:** Gradiente de `#1d6fa8` a `#0f5280` (Azul Primario Oscuro)
  - **Centro:** Gradiente de `#2b8fc9` a `#0d4470` (Azul Oscuro Profundo)
  - **Brillo central:** Elipse blanca con 35% opacidad
- **Espaciado:** Anillos separados por espacios blancos semi-transparentes
- **Texto:** "SIPRESAS" en mayúsculas, bold, tracking amplio (0.2em)
- **Tipografía:** System UI, sans-serif

### Uso del Componente

```tsx
import { SipresasLogo } from '@/components/logos/SipresasLogo';

// Logo completo con texto blanco (para fondos oscuros)
<SipresasLogo size={40} showText={true} textColor="white" />

// Logo con texto oscuro (para fondos claros)
<SipresasLogo size={48} showText={true} textColor="dark" />

// Logo con texto automático (gris oscuro por defecto)
<SipresasLogo size={40} showText={true} textColor="auto" />

// Solo el icono sin texto
<SipresasLogo size={36} showText={false} />
```

### Props

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `size` | `number` | `40` | Tamaño del logo en píxeles |
| `showText` | `boolean` | `true` | Mostrar/ocultar texto "SIPRESAS" |
| `textColor` | `"white" \| "dark" \| "auto"` | `"auto"` | Color del texto (auto = gris oscuro) |
| `className` | `string` | `""` | Clases CSS adicionales |

### Ubicaciones en la App
- **Cabecera principal:** Esquina superior izquierda (36px, texto blanco)
- **Favicon:** Versión simplificada
- **Login:** Versión grande centrada

---

## 2. Logo del Ministerio para la Transición Ecológica y el Reto Demográfico

### Descripción
Logo oficial del Gobierno de España y el Ministerio para la Transición Ecológica y el Reto Demográfico.

### Componente
**Archivo:** `src/components/logos/MinisterioLogo.tsx`

### Características Visuales

#### Elementos del Logo:

1. **Bandera de España (Izquierda):**
   - Franja azul con estrellas de la UE: `#003399` con estrellas `#FFCC00`
   - Franja roja superior: `#C8102E`
   - Franja amarilla central: `#FFD700`
   - Franja roja inferior: `#C8102E`

2. **Escudo de España (Centro Izquierda):**
   - Corona dorada
   - Escudo rojo con elementos amarillos
   - Castillo y león heráldicos
   - Columnas de Hércules

3. **Fondo:**
   - Amarillo institucional: `#F9E547`

4. **Texto "GOBIERNO DE ESPAÑA":**
   - Color: Negro
   - Fuente: Arial, bold
   - Tamaño: 16px
   - Disposición: Dos líneas

5. **Separador Vertical:**
   - Color: `#8B7355` (marrón)
   - Grosor: 1.5px

6. **Texto del Ministerio:**
   - Color: Negro
   - Fuente: Arial, semibold
   - Tamaño: 13px
   - Disposición: Tres líneas
     - "MINISTERIO"
     - "PARA LA TRANSICIÓN ECOLÓGICA"
     - "Y EL RETO DEMOGRÁFICO"

### Uso del Componente

```tsx
import { MinisterioLogo } from '@/components/logos/MinisterioLogo';

// Tamaño estándar
<MinisterioLogo height={50} />

// Tamaño para cabecera
<MinisterioLogo height={48} />

// Tamaño grande para páginas institucionales
<MinisterioLogo height={70} />

// Con clase CSS adicional
<MinisterioLogo height={50} className="my-4" />
```

### Props

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `height` | `number` | `50` | Altura del logo en píxeles (ancho se ajusta automáticamente) |
| `className` | `string` | `""` | Clases CSS adicionales |

### Ubicaciones en la App
- **Cabecera principal:** Esquina superior derecha (48px)
- **Páginas institucionales:** Encabezados de informes y documentos oficiales
- **Footer:** Versión reducida en pie de página

---

## 3. Directrices de Uso

### Espaciado y Tamaños

#### Logo SIPRESAS
- **Mínimo:** 32px (iconos pequeños)
- **Estándar:** 40px (navegación)
- **Grande:** 64px (landing pages)
- **Espaciado:** Mínimo 8px alrededor del logo

#### Logo del Ministerio
- **Mínimo:** 40px (no recomendado menor por legibilidad)
- **Estándar:** 48-50px (cabecera)
- **Grande:** 70-80px (documentos institucionales)
- **Espaciado:** Mínimo 12px alrededor del logo

### Fondos Recomendados

#### Logo SIPRESAS
| Fondo | Configuración |
|-------|---------------|
| Azul oscuro/primario | `textColor="white"` ✓ Óptimo |
| Blanco/claro | `textColor="dark"` o `textColor="auto"` ✓ Óptimo |
| Fondos gradiente | `textColor="white"` para gradientes oscuros |
| Fondos de color | Evaluar contraste y elegir white/dark según luminosidad |

#### Logo del Ministerio
- **Preferido:** Sobre fondo blanco o muy claro
- **Aceptable:** Sobre fondos con buena luminosidad
- **Evitar:** Fondos oscuros (el logo tiene fondo amarillo integrado)

### Restricciones

❌ **NO PERMITIDO:**

1. **Logo SIPRESAS:**
   - Cambiar los colores de los anillos o gradientes
   - Distorsionar las proporciones
   - Rotar el logo
   - Añadir efectos externos de sombra o resplandor
   - Cambiar la tipografía del texto
   - Modificar el espaciado entre anillos
   - Eliminar el efecto de gradiente radial

2. **Logo del Ministerio:**
   - Modificar cualquier elemento del logo
   - Cambiar colores oficiales
   - Separar elementos (bandera, escudo, texto)
   - Redimensionar desproporcionadamente
   - Añadir fondos de color diferentes al integrado

✅ **PERMITIDO:**

1. Escalar proporcionalmente ambos logos
2. Usar en diferentes contextos (digital, impreso)
3. Aplicar opacidad si es necesario (mínimo 80%)
4. Para SIPRESAS: Mostrar/ocultar texto según necesidad

---

## 4. Implementación Técnica

### Estructura de Archivos

```
src/
└── components/
    └── logos/
        ├── SipresasLogo.tsx      # Logo SIPRESAS
        └── MinisterioLogo.tsx    # Logo Ministerio
```

### Formato de Archivos

Ambos logos están implementados como:
- **Formato:** Componentes React con SVG inline
- **Ventajas:**
  - Escalado perfecto a cualquier tamaño
  - Sin dependencias de archivos externos
  - Optimización automática
  - Fácil modificación de colores y tamaños
  - Mejor rendimiento

### Integración en el Layout

El archivo `src/components/Layout.tsx` importa y utiliza ambos logos:

```tsx
import { SipresasLogo } from './logos/SipresasLogo';
import { MinisterioLogo } from './logos/MinisterioLogo';

// En la cabecera:
<SipresasLogo size={36} showText={true} textColor="white" />
<MinisterioLogo height={48} />
```

---

## 5. Consideraciones de Accesibilidad

### Atributos ARIA

Ambos componentes incluyen:
```tsx
role="img"
aria-label="[Descripción del logo]"
```

### Texto Alternativo

- **Logo SIPRESAS:** "SIPRESAS Logo"
- **Logo Ministerio:** "Gobierno de España - Ministerio para la Transición Ecológica y el Reto Demográfico"

### Contraste

Todos los elementos cumplen con:
- WCAG 2.1 Nivel AA mínimo
- Contraste adecuado en fondos recomendados
- Legibilidad garantizada en tamaños estándar

---

## 6. Mantenimiento y Actualizaciones

### Responsabilidades

- **Diseño:** Cualquier cambio debe ser aprobado por la autoridad competente
- **Implementación:** Equipo de desarrollo SIPRESAS
- **Revisión:** Verificación periódica de cumplimiento con directrices

### Control de Versiones

| Versión | Fecha | Cambios |
|---------|-------|---------|
| 1.0 | 29/01/2026 | Implementación inicial de ambos logos |

### Actualizaciones Futuras

Si se requieren cambios en los logos oficiales:
1. Obtener versión actualizada de la fuente oficial
2. Actualizar componentes SVG correspondientes
3. Verificar que mantienen proporciones y colores
4. Probar en todos los contextos de uso
5. Actualizar esta documentación

---

## 7. Recursos y Referencias

### Enlaces Oficiales

- **Manual de Identidad Visual del Gobierno de España**
  - Disponible en: Portal de Administración Pública

- **Directrices de Uso de Logos Institucionales**
  - Ministerio para la Transición Ecológica y el Reto Demográfico

### Contacto

Para consultas sobre el uso de los logos institucionales:
- **Diseño SIPRESAS:** Equipo de Proyecto
- **Logos Gubernamentales:** Oficina de Comunicación del Ministerio

---

## 8. Ejemplos de Uso

### Cabecera de la Aplicación
```tsx
<nav className="bg-gradient-to-r from-sipresas-dark via-sipresas-primary to-sipresas-secondary">
  <div className="flex items-center justify-between px-6 h-14">
    {/* Logo SIPRESAS - Izquierda */}
    <SipresasLogo size={36} showText={true} textColor="white" />

    {/* Logo Ministerio - Derecha */}
    <div className="flex items-center gap-4">
      <div className="h-10 border-r border-white/20"></div>
      <MinisterioLogo height={48} />
    </div>
  </div>
</nav>
```

### Página de Login
```tsx
<div className="flex flex-col items-center">
  <SipresasLogo size={64} showText={true} textColor="gray" />
  <h1 className="text-2xl font-bold mt-4">Sistema SIPRESAS</h1>
  <MinisterioLogo height={60} className="mt-8" />
</div>
```

### Footer Institucional
```tsx
<footer className="bg-gray-100 py-4">
  <div className="container mx-auto flex items-center justify-between">
    <SipresasLogo size={32} showText={false} />
    <MinisterioLogo height={40} />
  </div>
</footer>
```

---

## Historial de Versiones

### Versión 1.1 - 29 de Enero de 2026
**Mejoras al Logo SIPRESAS:**
- Implementación de anillos sólidos con gradientes radiales (en lugar de strokes)
- Añadido efecto de profundidad 3D con gradientes de múltiples capas
- Mejorada la separación entre anillos con espacios blancos semi-transparentes
- Añadido efecto de brillo en el centro del logo
- Actualizado el esquema de colores para mayor fidelidad al logo original
- Mejorado el espaciado del texto (tracking aumentado a 0.2em)
- Cambiado valor por defecto del textColor a "auto" (gris oscuro)

### Versión 1.0 - 29 de Enero de 2026
- Implementación inicial de ambos logos oficiales
- Logo SIPRESAS con círculos concéntricos básicos
- Logo del Ministerio con todos los elementos oficiales

---

**Última actualización:** 29 de Enero de 2026
**Versión del documento:** 1.1
**Mantenido por:** Equipo de Desarrollo SIPRESAS
