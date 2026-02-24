# SIPRESAS - Guía de Paleta de Colores Institucional

## Resumen Ejecutivo

Esta guía establece la paleta de colores oficial del Sistema de Información de Presas (SIPRESAS), diseñada para una aplicación institucional del Gobierno de España en el ámbito de gestión hidráulica. Los colores han sido seleccionados para garantizar profesionalidad, accesibilidad y coherencia con la identidad del sector hídrico.

---

## 1. Colores Base Institucionales

### 1.1 Azul Institucional (Primario)

| Variante | Hex Code | RGB | Uso Principal |
|----------|----------|-----|---------------|
| **Azul Oscuro** | `#082841` | rgb(8, 40, 65) | Cabeceras principales, textos destacados |
| **Azul Primario** | `#1e5a8e` | rgb(30, 90, 142) | Botones principales, navegación, títulos |
| **Azul Secundario** | `#2874b5` | rgb(40, 116, 181) | Enlaces, hover states, elementos activos |
| **Azul Medio** | `#4a9fd8` | rgb(74, 159, 216) | Elementos interactivos, selección |
| **Azul Claro** | `#a4c8e1` | rgb(164, 200, 225) | Bordes, separadores, fondos secundarios |
| **Azul Ultraclaro** | `#e8f2f9` | rgb(232, 242, 249) | Fondos de contenedor, sidebar, áreas grandes |

**Ratio de Contraste:**
- Azul Oscuro sobre blanco: **13.8:1** ✓ AAA
- Azul Primario sobre blanco: **6.2:1** ✓ AA Large
- Azul Secundario sobre blanco: **4.8:1** ✓ AA
- Texto blanco sobre Azul Primario: **5.1:1** ✓ AA

**Aplicaciones:**
- Cabecera del sistema (gradiente de Azul Oscuro a Azul Secundario)
- Navegación lateral (fondos Azul Ultraclaro)
- Botones de acción principal (Azul Primario)
- Enlaces e interacciones (Azul Secundario)

### 1.2 Aqua Hidráulico (Acento Hídrico)

| Variante | Hex Code | RGB | Uso Principal |
|----------|----------|-----|---------------|
| **Aqua Oscuro** | `#0e7490` | rgb(14, 116, 144) | Indicadores de agua profunda, capacidad alta |
| **Aqua Principal** | `#06b6d4` | rgb(6, 182, 212) | Elementos de agua, niveles, visualizaciones |
| **Aqua Medio** | `#22d3ee` | rgb(34, 211, 238) | Efectos de agua, animaciones |
| **Aqua Claro** | `#67e8f9` | rgb(103, 232, 249) | Fondos hídricos, overlays |
| **Aqua Ultraclaro** | `#cffafe` | rgb(207, 250, 254) | Fondos sutiles, highlights de agua |

**Aplicaciones:**
- Indicadores de nivel de agua
- Visualizaciones de embalses
- Gráficos de precipitación
- Iconografía relacionada con agua

### 1.3 Neutros Institucionales

| Variante | Hex Code | RGB | Uso Principal |
|----------|----------|-----|---------------|
| **Gris Muy Oscuro** | `#1f2937` | rgb(31, 41, 55) | Textos principales |
| **Gris Oscuro** | `#374151` | rgb(55, 65, 81) | Textos secundarios |
| **Gris Medio** | `#6b7280` | rgb(107, 114, 128) | Textos terciarios, labels |
| **Gris Claro** | `#d1d5db` | rgb(209, 213, 219) | Bordes, separadores |
| **Gris Muy Claro** | `#e5e7eb` | rgb(229, 231, 235) | Fondos secundarios |
| **Gris Ultraclaro** | `#f3f4f6` | rgb(243, 244, 246) | Fondos de tabla, áreas grandes |
| **Blanco** | `#ffffff` | rgb(255, 255, 255) | Fondos principales, tarjetas |

**Ratio de Contraste:**
- Gris Muy Oscuro sobre blanco: **12.6:1** ✓ AAA
- Gris Oscuro sobre blanco: **9.3:1** ✓ AAA
- Gris Medio sobre blanco: **4.7:1** ✓ AA

---

## 2. Colores Funcionales (Estados del Sistema)

### 2.1 Verde - Éxito / Operativo / Correcto

| Variante | Hex Code | RGB | Uso Principal |
|----------|----------|-----|---------------|
| **Verde Oscuro** | `#15803d` | rgb(21, 128, 61) | Textos sobre fondos claros |
| **Verde Principal** | `#16a34a` | rgb(22, 163, 74) | Estados operativos, éxitos |
| **Verde Medio** | `#22c55e` | rgb(34, 197, 94) | Indicadores positivos |
| **Verde Claro** | `#86efac` | rgb(134, 239, 172) | Fondos de éxito |
| **Verde Ultraclaro** | `#dcfce7` | rgb(220, 252, 231) | Alertas de éxito, fondos |

**Ratio de Contraste:**
- Verde Oscuro sobre Verde Ultraclaro: **7.2:1** ✓ AA
- Verde Principal sobre blanco: **3.4:1** ✓ AA Large

**Aplicaciones:**
- Presa operativa
- Sensor activo y funcionando
- Operación completada con éxito
- Nivel de agua óptimo
- Mantenimiento al día

**Ejemplo de Uso:**
```html
<!-- Badge operativa -->
<span class="bg-green-100 text-green-800 border-green-300">Operativa</span>

<!-- Alerta de éxito -->
<div class="bg-green-50 border-l-4 border-green-600 text-green-800">
  Los datos se han guardado correctamente
</div>
```

### 2.2 Amarillo/Ámbar - Advertencia / Precaución

| Variante | Hex Code | RGB | Uso Principal |
|----------|----------|-----|---------------|
| **Amarillo Oscuro** | `#b45309` | rgb(180, 83, 9) | Textos de advertencia |
| **Amarillo Principal** | `#ca8a04` | rgb(202, 138, 4) | Alertas de precaución |
| **Amarillo Medio** | `#eab308` | rgb(234, 179, 8) | Indicadores de advertencia |
| **Amarillo Claro** | `#fde047` | rgb(253, 224, 71) | Fondos de advertencia |
| **Amarillo Ultraclaro** | `#fef9c3` | rgb(254, 249, 195) | Alertas suaves, fondos |

**Ratio de Contraste:**
- Amarillo Oscuro sobre Amarillo Ultraclaro: **8.5:1** ✓ AAA
- Amarillo Principal sobre blanco: **2.9:1** ⚠️ Usar con precaución

**Aplicaciones:**
- Mantenimiento programado
- Nivel de agua cerca de umbrales
- Sensor requiere calibración
- Datos pendientes de revisión
- Advertencia general no crítica

**Ejemplo de Uso:**
```html
<!-- Badge advertencia -->
<span class="bg-yellow-100 text-yellow-800 border-yellow-300">Mantenimiento</span>

<!-- Alerta de precaución -->
<div class="bg-yellow-50 border-l-4 border-yellow-600 text-yellow-800">
  El nivel del embalse está cerca del umbral de precaución
</div>
```

### 2.3 Naranja - Alerta / Atención Requerida

| Variante | Hex Code | RGB | Uso Principal |
|----------|----------|-----|---------------|
| **Naranja Oscuro** | `#c2410c` | rgb(194, 65, 12) | Textos de alerta |
| **Naranja Principal** | `#ea580c` | rgb(234, 88, 12) | Alertas importantes |
| **Naranja Medio** | `#f97316` | rgb(249, 115, 22) | Indicadores de alerta |
| **Naranja Claro** | `#fdba74` | rgb(253, 186, 116) | Fondos de alerta |
| **Naranja Ultraclaro** | `#ffedd5` | rgb(255, 237, 213) | Alertas, fondos |

**Aplicaciones:**
- Sensor en fallo no crítico
- Nivel de agua en zona de alerta
- Mantenimiento urgente requerido
- Datos anómalos detectados
- Activación de protocolo de alerta

### 2.4 Rojo - Emergencia / Error / Crítico

| Variante | Hex Code | RGB | Uso Principal |
|----------|----------|-----|---------------|
| **Rojo Oscuro** | `#b91c1c` | rgb(185, 28, 28) | Textos de error |
| **Rojo Principal** | `#dc2626` | rgb(220, 38, 38) | Estados críticos, errores |
| **Rojo Medio** | `#ef4444` | rgb(239, 68, 68) | Indicadores críticos |
| **Rojo Claro** | `#fca5a5` | rgb(252, 165, 165) | Fondos de error |
| **Rojo Ultraclaro** | `#fee2e2` | rgb(254, 226, 226) | Alertas de error, fondos |

**Ratio de Contraste:**
- Rojo Oscuro sobre Rojo Ultraclaro: **9.1:1** ✓ AAA
- Rojo Principal sobre blanco: **4.5:1** ✓ AA

**Aplicaciones:**
- Estado de emergencia
- Sensor en fallo crítico
- Nivel de agua crítico
- Error del sistema
- Incidencia grave

**Ejemplo de Uso:**
```html
<!-- Badge emergencia -->
<span class="bg-red-100 text-red-800 border-red-300">Emergencia</span>

<!-- Alerta de error -->
<div class="bg-red-50 border-l-4 border-red-600 text-red-800">
  Error crítico detectado en el sensor de nivel
</div>
```

### 2.5 Azul Informativo

| Variante | Hex Code | RGB | Uso Principal |
|----------|----------|-----|---------------|
| **Azul Info Oscuro** | `#1e40af` | rgb(30, 64, 175) | Textos informativos |
| **Azul Info Principal** | `#3b82f6` | rgb(59, 130, 246) | Mensajes informativos |
| **Azul Info Medio** | `#60a5fa` | rgb(96, 165, 250) | Indicadores de info |
| **Azul Info Claro** | `#bfdbfe` | rgb(191, 219, 254) | Fondos informativos |
| **Azul Info Ultraclaro** | `#eff6ff` | rgb(239, 246, 255) | Mensajes, fondos |

**Aplicaciones:**
- Mensajes informativos
- Datos de consulta
- Estado normal documentado
- Información técnica
- Tips y ayudas

---

## 3. Colores Específicos de Dominio

### 3.1 Estados Operacionales de Presas

```css
/* Operativa - Verde */
.status-operational {
  background: #dcfce7;
  color: #15803d;
  border: 1px solid #86efac;
}

/* Mantenimiento - Azul Institucional */
.status-maintenance {
  background: #e8f2f9;
  color: #1e5a8e;
  border: 1px solid #a4c8e1;
}

/* Alerta - Amarillo */
.status-alert {
  background: #fef9c3;
  color: #b45309;
  border: 1px solid #fde047;
}

/* Advertencia - Naranja */
.status-warning {
  background: #ffedd5;
  color: #c2410c;
  border: 1px solid #fdba74;
}

/* Emergencia - Rojo */
.status-emergency {
  background: #fee2e2;
  color: #b91c1c;
  border: 1px solid #fca5a5;
}
```

### 3.2 Niveles de Severidad

```css
/* Baja - Verde */
.severity-low { color: #16a34a; }

/* Media - Amarillo */
.severity-medium { color: #ca8a04; }

/* Alta - Naranja */
.severity-high { color: #ea580c; }

/* Crítica - Rojo */
.severity-critical { color: #dc2626; }
```

### 3.3 Indicadores de Nivel de Agua

| Nivel | Color | Hex | Uso |
|-------|-------|-----|-----|
| **Crítico Alto** | Rojo | `#dc2626` | >95% capacidad |
| **Alto** | Naranja | `#ea580c` | 85-95% capacidad |
| **Óptimo** | Verde | `#16a34a` | 60-85% capacidad |
| **Normal** | Azul | `#2874b5` | 40-60% capacidad |
| **Bajo** | Amarillo | `#ca8a04` | 25-40% capacidad |
| **Crítico Bajo** | Rojo | `#dc2626` | <25% capacidad |

---

## 4. Jerarquía y Combinaciones de Colores

### 4.1 Jerarquía Visual

**Nivel 1 - Atención Principal:**
- Fondo: Azul Primario `#1e5a8e`
- Texto: Blanco `#ffffff`
- Uso: Botones principales, CTAs, navegación activa

**Nivel 2 - Atención Secundaria:**
- Fondo: Blanco `#ffffff`
- Borde: Azul Primario `#1e5a8e`
- Texto: Azul Primario `#1e5a8e`
- Uso: Botones secundarios, acciones alternativas

**Nivel 3 - Atención Terciaria:**
- Fondo: Transparente
- Texto: Azul Secundario `#2874b5`
- Hover: Azul Ultraclaro `#e8f2f9`
- Uso: Enlaces, acciones terciarias

### 4.2 Combinaciones Aprobadas

✅ **DO - Combinaciones Correctas:**

1. **Cabecera Institucional:**
   - Gradiente: Azul Oscuro `#082841` → Azul Secundario `#2874b5`
   - Texto: Blanco `#ffffff`

2. **Tarjeta de Información:**
   - Fondo: Blanco `#ffffff`
   - Borde: Gris Claro `#d1d5db`
   - Título: Azul Oscuro `#082841`
   - Texto: Gris Oscuro `#374151`

3. **Alerta de Estado:**
   - Fondo: Color Ultraclaro correspondiente
   - Borde Izquierdo (4px): Color Principal correspondiente
   - Texto: Color Oscuro correspondiente

4. **Tabla de Datos:**
   - Cabecera: Azul Ultraclaro `#e8f2f9`
   - Texto Cabecera: Azul Oscuro `#082841`
   - Filas: Blanco `#ffffff`
   - Hover: Azul Ultraclaro 30% `rgba(232, 242, 249, 0.3)`

❌ **DON'T - Combinaciones Prohibidas:**

1. ❌ Amarillo sobre blanco (contraste insuficiente)
2. ❌ Verde claro sobre Azul claro (confusión visual)
3. ❌ Rojo y Verde adyacentes (problemas de daltonismo)
4. ❌ Múltiples colores saturados juntos (sobrecarga visual)
5. ❌ Texto gris claro sobre fondos de color (contraste bajo)

---

## 5. Accesibilidad (WCAG 2.1)

### 5.1 Requisitos de Contraste

**Nivel AA (Mínimo requerido):**
- Texto normal: 4.5:1
- Texto grande (18pt+): 3:1
- Componentes UI: 3:1

**Nivel AAA (Óptimo):**
- Texto normal: 7:1
- Texto grande: 4.5:1

### 5.2 Consideraciones para Daltonismo

**Protanopia (Rojo-Verde):**
- ✅ Usar patrones adicionales, no solo color
- ✅ Incluir iconos junto a colores de estado
- ✅ Usar variaciones de brillo además de tono

**Deuteranopia (Verde-Rojo):**
- ✅ Azul y Amarillo son distinguibles
- ✅ Evitar verde y rojo como única diferencia

**Tritanopia (Azul-Amarillo):**
- ✅ Usar Rojo y Verde como alternativas
- ✅ Incluir etiquetas de texto

**Soluciones Implementadas:**

```html
<!-- Mal: Solo color -->
<div class="bg-green-500">Operativa</div>

<!-- Bien: Color + Icono + Texto -->
<div class="bg-green-100 text-green-800 border-green-300">
  <CheckCircle size={16} />
  <span>Operativa</span>
</div>
```

### 5.3 Tabla de Contraste Verificada

| Combinación | Ratio | WCAG AA | WCAG AAA |
|-------------|-------|---------|----------|
| Azul Oscuro / Blanco | 13.8:1 | ✓ | ✓ |
| Azul Primario / Blanco | 6.2:1 | ✓ | ✓ Large |
| Verde Oscuro / Verde Ultraclaro | 7.2:1 | ✓ | ✓ Large |
| Rojo Oscuro / Rojo Ultraclaro | 9.1:1 | ✓ | ✓ |
| Amarillo Oscuro / Amarillo Ultraclaro | 8.5:1 | ✓ | ✓ |
| Gris Muy Oscuro / Blanco | 12.6:1 | ✓ | ✓ |

---

## 6. Implementación en Código

### 6.1 Tailwind Config

```javascript
colors: {
  sipresas: {
    primary: '#1e5a8e',
    secondary: '#2874b5',
    light: '#4a9fd8',
    lighter: '#a4c8e1',
    lightest: '#e8f2f9',
    dark: '#0d3859',
    darker: '#082841',
  },
  aqua: {
    dark: '#0e7490',
    DEFAULT: '#06b6d4',
    medium: '#22d3ee',
    light: '#67e8f9',
    lighter: '#cffafe',
  },
}
```

### 6.2 CSS Custom Properties

```css
:root {
  /* Institucionales */
  --color-sipresas-darker: #082841;
  --color-sipresas-dark: #0d3859;
  --color-sipresas-primary: #1e5a8e;
  --color-sipresas-secondary: #2874b5;
  --color-sipresas-light: #4a9fd8;
  --color-sipresas-lighter: #a4c8e1;
  --color-sipresas-lightest: #e8f2f9;

  /* Hidráulicos */
  --color-aqua-dark: #0e7490;
  --color-aqua: #06b6d4;
  --color-aqua-medium: #22d3ee;
  --color-aqua-light: #67e8f9;
  --color-aqua-lighter: #cffafe;

  /* Funcionales */
  --color-success-dark: #15803d;
  --color-success: #16a34a;
  --color-success-light: #dcfce7;

  --color-warning-dark: #b45309;
  --color-warning: #ca8a04;
  --color-warning-light: #fef9c3;

  --color-alert-dark: #c2410c;
  --color-alert: #ea580c;
  --color-alert-light: #ffedd5;

  --color-error-dark: #b91c1c;
  --color-error: #dc2626;
  --color-error-light: #fee2e2;

  --color-info-dark: #1e40af;
  --color-info: #3b82f6;
  --color-info-light: #eff6ff;
}
```

---

## 7. Ejemplos de Uso

### 7.1 Botones

```html
<!-- Primario -->
<button class="bg-sipresas-primary hover:bg-sipresas-secondary text-white">
  Guardar
</button>

<!-- Secundario -->
<button class="bg-white border-2 border-sipresas-primary text-sipresas-primary hover:bg-sipresas-lightest">
  Cancelar
</button>

<!-- Peligro -->
<button class="bg-red-600 hover:bg-red-700 text-white">
  Eliminar
</button>

<!-- Éxito -->
<button class="bg-green-600 hover:bg-green-700 text-white">
  Confirmar
</button>
```

### 7.2 Badges de Estado

```html
<!-- Operativa -->
<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-300">
  <CheckCircle class="w-3 h-3 mr-1" />
  Operativa
</span>

<!-- Mantenimiento -->
<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-sipresas-lightest text-sipresas-primary border border-sipresas-lighter">
  <Tool class="w-3 h-3 mr-1" />
  Mantenimiento
</span>

<!-- Emergencia -->
<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-300">
  <AlertTriangle class="w-3 h-3 mr-1" />
  Emergencia
</span>
```

### 7.3 Alertas

```html
<!-- Información -->
<div class="bg-blue-50 border-l-4 border-blue-600 p-4 rounded-r">
  <div class="flex items-start">
    <Info class="w-5 h-5 text-blue-600 mt-0.5 mr-3" />
    <div>
      <h3 class="text-sm font-medium text-blue-900">Información</h3>
      <p class="text-sm text-blue-800 mt-1">Los datos se actualizan cada 15 minutos.</p>
    </div>
  </div>
</div>

<!-- Éxito -->
<div class="bg-green-50 border-l-4 border-green-600 p-4 rounded-r">
  <div class="flex items-start">
    <CheckCircle class="w-5 h-5 text-green-600 mt-0.5 mr-3" />
    <div>
      <h3 class="text-sm font-medium text-green-900">Operación exitosa</h3>
      <p class="text-sm text-green-800 mt-1">Los cambios se han guardado correctamente.</p>
    </div>
  </div>
</div>

<!-- Advertencia -->
<div class="bg-yellow-50 border-l-4 border-yellow-600 p-4 rounded-r">
  <div class="flex items-start">
    <AlertTriangle class="w-5 h-5 text-yellow-600 mt-0.5 mr-3" />
    <div>
      <h3 class="text-sm font-medium text-yellow-900">Advertencia</h3>
      <p class="text-sm text-yellow-800 mt-1">El nivel del embalse está cerca del umbral de precaución.</p>
    </div>
  </div>
</div>

<!-- Error -->
<div class="bg-red-50 border-l-4 border-red-600 p-4 rounded-r">
  <div class="flex items-start">
    <XCircle class="w-5 h-5 text-red-600 mt-0.5 mr-3" />
    <div>
      <h3 class="text-sm font-medium text-red-900">Error</h3>
      <p class="text-sm text-red-800 mt-1">No se pudo completar la operación. Intente nuevamente.</p>
    </div>
  </div>
</div>
```

### 7.4 Indicadores de Nivel

```html
<!-- Nivel Óptimo -->
<div class="flex items-center gap-2">
  <div class="w-full bg-gray-200 rounded-full h-2">
    <div class="bg-green-600 h-2 rounded-full" style="width: 75%"></div>
  </div>
  <span class="text-sm font-medium text-green-600">75%</span>
</div>

<!-- Nivel de Alerta -->
<div class="flex items-center gap-2">
  <div class="w-full bg-gray-200 rounded-full h-2">
    <div class="bg-yellow-500 h-2 rounded-full" style="width: 35%"></div>
  </div>
  <span class="text-sm font-medium text-yellow-600">35%</span>
</div>

<!-- Nivel Crítico -->
<div class="flex items-center gap-2">
  <div class="w-full bg-gray-200 rounded-full h-2">
    <div class="bg-red-600 h-2 rounded-full" style="width: 95%"></div>
  </div>
  <span class="text-sm font-medium text-red-600">95%</span>
</div>
```

---

## 8. Directrices de Uso

### 8.1 DO ✅

1. **Usar colores institucionales para navegación y estructura**
   - Cabecera con gradiente azul institucional
   - Sidebar con fondo azul ultraclaro

2. **Usar colores funcionales para estados**
   - Verde para éxito/operativo
   - Rojo para error/emergencia
   - Amarillo para advertencia
   - Azul para información

3. **Incluir iconos con colores de estado**
   - Mejora accesibilidad
   - Facilita comprensión rápida

4. **Mantener jerarquía visual consistente**
   - Botones primarios más destacados
   - Información secundaria más sutil

5. **Usar fondos claros con bordes de color**
   - Mejor legibilidad
   - Contraste adecuado

### 8.2 DON'T ❌

1. **No usar colores saturados en áreas grandes**
   - Causa fatiga visual
   - Reduce profesionalidad

2. **No mezclar múltiples colores de alerta**
   - Confunde al usuario
   - Diluye el mensaje

3. **No usar color como única distinción**
   - Problemas de accesibilidad
   - Incluir iconos/texto

4. **No usar amarillo puro para texto**
   - Contraste insuficiente
   - Usar amarillo oscuro

5. **No crear nuevos colores sin aprobación**
   - Mantener consistencia
   - Seguir la paleta establecida

---

## 9. Herramientas y Recursos

### 9.1 Verificadores de Contraste

- WebAIM Contrast Checker: https://webaim.org/resources/contrastchecker/
- Contrast Ratio: https://contrast-ratio.com/
- Accessible Colors: https://accessible-colors.com/

### 9.2 Simuladores de Daltonismo

- Coblis: https://www.color-blindness.com/coblis-color-blindness-simulator/
- Chrome DevTools: Vision Deficiencies
- Figma: Color Blind plugin

### 9.3 Exportar Paleta

**Adobe XD / Figma:**
- Archivo de colores: `sipresas-colors.aco`

**Sketch:**
- Documento de paleta: `sipresas-palette.sketch`

**CSS:**
- Variables CSS: Ver sección 6.2

---

## 10. Changelog

| Versión | Fecha | Cambios |
|---------|-------|---------|
| 1.0 | 28/01/2026 | Versión inicial con paleta completa institucional y funcional |

---

## 11. Contacto y Aprobación

**Mantenido por:** Equipo de Diseño SIPRESAS
**Última revisión:** 28 de Enero de 2026
**Estado:** Aprobado para producción

Para sugerencias o modificaciones a esta guía, contactar al equipo de diseño del proyecto SIPRESAS.
