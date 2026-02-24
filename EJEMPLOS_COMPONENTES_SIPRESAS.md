# Ejemplos de Componentes con Identidad Visual SIPRESAS

## Botones

### Botón Primario
```tsx
<button className="btn-sipresas-primary">
  Guardar Cambios
</button>
```

### Botón Secundario
```tsx
<button className="btn-sipresas-secondary">
  Cancelar
</button>
```

### Botón Outline
```tsx
<button className="btn-sipresas-outline">
  Ver Detalles
</button>
```

### Con Tailwind CSS
```tsx
<button className="px-4 py-2 bg-sipresas-primary hover:bg-sipresas-secondary text-white font-medium rounded transition-colors">
  Acción Principal
</button>
```

## Tarjetas (Cards)

### Tarjeta Básica
```tsx
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/Card';

<Card>
  <CardHeader>
    <CardTitle>Título de la Tarjeta</CardTitle>
  </CardHeader>
  <CardContent>
    <p>Contenido de la tarjeta</p>
  </CardContent>
</Card>
```

### Tarjeta con Clase Personalizada
```tsx
<div className="card-sipresas">
  <h3 className="header-sipresas">Información de la Presa</h3>
  <p className="text-sipresas-muted">Detalles técnicos...</p>
</div>
```

## Tablas

### Tabla Básica
```tsx
<table className="table-sipresas">
  <thead>
    <tr>
      <th>Código</th>
      <th>Nombre</th>
      <th>Estado</th>
      <th>Fecha</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>CHE801</td>
      <td>LA BREÑA II</td>
      <td>Operativa</td>
      <td>28/01/2026</td>
    </tr>
    <tr>
      <td>CHE802</td>
      <td>SAN CLEMENTE</td>
      <td>Mantenimiento</td>
      <td>27/01/2026</td>
    </tr>
  </tbody>
</table>
```

### Tabla con Tailwind
```tsx
<div className="overflow-x-auto">
  <table className="min-w-full divide-y divide-gray-200 bg-white shadow-sm rounded-lg">
    <thead className="bg-sipresas-lightest">
      <tr>
        <th className="px-4 py-3 text-left text-xs font-semibold text-sipresas-dark uppercase tracking-wider">
          Columna 1
        </th>
        <th className="px-4 py-3 text-left text-xs font-semibold text-sipresas-dark uppercase tracking-wider">
          Columna 2
        </th>
      </tr>
    </thead>
    <tbody className="bg-white divide-y divide-gray-100">
      <tr className="hover:bg-sipresas-lightest/30 transition-colors">
        <td className="px-4 py-3 text-sm text-gray-700">Dato 1</td>
        <td className="px-4 py-3 text-sm text-gray-700">Dato 2</td>
      </tr>
    </tbody>
  </table>
</div>
```

## Alertas

### Alerta Informativa
```tsx
<div className="alert-sipresas-info">
  <div className="flex items-center gap-2">
    <Info size={20} />
    <p className="font-medium">Información importante</p>
  </div>
  <p className="text-sm mt-1">Este es un mensaje informativo para el usuario.</p>
</div>
```

### Alerta de Éxito
```tsx
<div className="alert-sipresas-success">
  <div className="flex items-center gap-2">
    <CheckCircle size={20} />
    <p className="font-medium">Operación exitosa</p>
  </div>
  <p className="text-sm mt-1">Los datos se han guardado correctamente.</p>
</div>
```

### Alerta de Advertencia
```tsx
<div className="alert-sipresas-warning">
  <div className="flex items-center gap-2">
    <AlertTriangle size={20} />
    <p className="font-medium">Advertencia</p>
  </div>
  <p className="text-sm mt-1">El nivel del embalse está cerca del umbral de advertencia.</p>
</div>
```

### Alerta de Error
```tsx
<div className="alert-sipresas-error">
  <div className="flex items-center gap-2">
    <XCircle size={20} />
    <p className="font-medium">Error</p>
  </div>
  <p className="text-sm mt-1">No se pudo completar la operación. Intente nuevamente.</p>
</div>
```

## Badges

### Badge con Componente
```tsx
import { Badge } from '@/components/ui/Badge';

<Badge variant="info">Nuevo</Badge>
<Badge variant="success">Operativa</Badge>
<Badge variant="warning">Mantenimiento</Badge>
<Badge variant="danger">Crítico</Badge>
<Badge variant="secondary">Inactivo</Badge>
```

### Badge con Clases CSS
```tsx
<span className="badge-sipresas-primary">Primario</span>
<span className="badge-sipresas-success">Éxito</span>
<span className="badge-sipresas-warning">Advertencia</span>
<span className="badge-sipresas-error">Error</span>
```

## Inputs

### Input de Texto
```tsx
<div className="space-y-2">
  <label className="block text-sm font-medium text-sipresas-dark">
    Nombre de la Presa
  </label>
  <input
    type="text"
    className="input-sipresas"
    placeholder="Ingrese el nombre..."
  />
</div>
```

### Input con Tailwind
```tsx
<input
  type="text"
  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-sipresas-light focus:border-transparent"
  placeholder="Buscar..."
/>
```

## Títulos y Textos

### Títulos
```tsx
<h1 className="header-sipresas">Título Principal</h1>
<h2 className="subheader-sipresas">Subtítulo de Sección</h2>
<h3 className="text-lg font-semibold text-sipresas-dark">Título Terciario</h3>
```

### Texto
```tsx
<p className="text-gray-700">Texto de cuerpo normal</p>
<p className="text-sipresas-muted">Texto secundario o explicativo</p>
<p className="text-sm text-gray-600">Texto pequeño</p>
```

## Layout Components

### Panel de Información
```tsx
<div className="bg-sipresas-lightest border border-sipresas-lighter rounded-lg p-6">
  <div className="flex items-center gap-3 mb-4">
    <div className="w-10 h-10 bg-sipresas-light rounded-lg flex items-center justify-center">
      <Droplet className="text-white" size={24} />
    </div>
    <div>
      <h3 className="font-semibold text-sipresas-dark">Información de la Presa</h3>
      <p className="text-sm text-gray-600">CHE.E15 GUADALMENA</p>
    </div>
  </div>
  <div className="space-y-2">
    <div className="flex justify-between text-sm">
      <span className="text-gray-600">Provincia:</span>
      <span className="font-medium text-gray-900">Jaén</span>
    </div>
    <div className="flex justify-between text-sm">
      <span className="text-gray-600">Río:</span>
      <span className="font-medium text-gray-900">Guadalmena</span>
    </div>
  </div>
</div>
```

### Contenedor de Sección
```tsx
<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
  <div className="border-b border-gray-200 pb-3 mb-4">
    <h2 className="text-lg font-semibold text-sipresas-dark">Título de Sección</h2>
    <p className="text-sm text-gray-600 mt-1">Descripción de la sección</p>
  </div>
  <div>
    {/* Contenido */}
  </div>
</div>
```

## Colores Directos en Código

### Fondos
```tsx
<div className="bg-sipresas-primary">Fondo Primario</div>
<div className="bg-sipresas-secondary">Fondo Secundario</div>
<div className="bg-sipresas-light">Fondo Claro</div>
<div className="bg-sipresas-lightest">Fondo Muy Claro</div>
<div className="bg-sipresas-dark">Fondo Oscuro</div>
```

### Texto
```tsx
<p className="text-sipresas-primary">Texto Primario</p>
<p className="text-sipresas-secondary">Texto Secundario</p>
<p className="text-sipresas-dark">Texto Oscuro</p>
```

### Bordes
```tsx
<div className="border border-sipresas-lighter">Borde Claro</div>
<div className="border-2 border-sipresas-primary">Borde Primario</div>
<div className="border-l-4 border-sipresas-light">Borde Izquierdo</div>
```

## Navegación

### Elemento de Menú Activo
```tsx
<a
  href="/dashboard"
  className="flex items-center gap-3 px-4 py-2.5 bg-sipresas-light text-white font-medium rounded shadow-sm"
>
  <Home size={18} />
  <span className="text-sm">Dashboard</span>
</a>
```

### Elemento de Menú Inactivo
```tsx
<a
  href="/settings"
  className="flex items-center gap-3 px-4 py-2.5 text-sipresas-dark hover:bg-sipresas-lighter/50 hover:text-sipresas-primary rounded transition-all"
>
  <Settings size={18} />
  <span className="text-sm">Configuración</span>
</a>
```

## Combinaciones Comunes

### Cabecera de Página
```tsx
<div className="bg-gradient-to-r from-sipresas-dark via-sipresas-primary to-sipresas-secondary text-white px-6 py-4 rounded-lg shadow-md mb-6">
  <div className="flex items-center justify-between">
    <div>
      <h1 className="text-2xl font-bold">CHE.E15 GUADALMENA</h1>
      <p className="text-blue-100 text-sm mt-1">Cuenca del Guadalquivir</p>
    </div>
    <Badge variant="success">Operativa</Badge>
  </div>
</div>
```

### Panel de Estadísticas
```tsx
<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
  <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
    <p className="text-sm text-gray-600 mb-1">Nivel Actual</p>
    <p className="text-2xl font-bold text-sipresas-primary">75.3%</p>
  </div>
  <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
    <p className="text-sm text-gray-600 mb-1">Capacidad</p>
    <p className="text-2xl font-bold text-sipresas-primary">834 hm³</p>
  </div>
  <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
    <p className="text-sm text-gray-600 mb-1">Estado</p>
    <Badge variant="success" className="mt-1">Operativa</Badge>
  </div>
  <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
    <p className="text-sm text-gray-600 mb-1">Alertas</p>
    <p className="text-2xl font-bold text-green-600">0</p>
  </div>
</div>
```
