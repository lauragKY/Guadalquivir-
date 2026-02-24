# Integración con Alfresco ECM

SIPRESAS ahora incluye integración completa con Alfresco ECM (Enterprise Content Management) mediante API REST para la gestión avanzada de documentos técnicos.

## Características Implementadas

### 1. Servicio de Alfresco (`src/services/alfrescoService.ts`)

Clase completa que proporciona acceso a la API REST de Alfresco:

- **Gestión de Carpetas**
  - Crear carpetas con propiedades personalizadas
  - Crear estructura jerárquica de carpetas
  - Navegar por el árbol de carpetas

- **Gestión de Documentos**
  - Subir documentos con metadatos personalizados
  - Descargar documentos
  - Actualizar propiedades de documentos
  - Eliminar documentos (temporal o permanente)
  - Mover y copiar documentos

- **Búsqueda y Consulta**
  - Búsqueda por texto completo usando AFTS (Alfresco Full Text Search)
  - Búsqueda por metadatos específicos
  - Consulta de nodos y sus propiedades

### 2. Servicio de Integración (`src/services/documentService.ts`)

Puente entre Alfresco y Supabase que proporciona:

- **Subida a Alfresco**: Sube documentos a Alfresco y registra metadatos en Supabase
- **Descarga desde Alfresco**: Descarga documentos almacenados en Alfresco
- **Sincronización**: Sincroniza documentos entre Alfresco y Supabase
- **Gestión Híbrida**: Maneja documentos en ambos sistemas transparentemente

### 3. Base de Datos

Se han añadido campos a la tabla `technical_documents`:

- `alfresco_node_id`: ID único del nodo en Alfresco
- `storage_location`: Indica dónde está almacenado ('alfresco' o 'supabase')
- `alfresco_metadata`: Metadatos adicionales del documento en Alfresco

### 4. Interfaz de Usuario

El módulo de **Archivo Técnico** incluye:

- **Indicador de Conexión**: Muestra el estado de conexión con Alfresco
- **Filtro por Almacenamiento**: Filtra documentos por ubicación (Alfresco/Supabase)
- **Estadísticas**: Muestra cantidad de documentos en cada sistema
- **Botón de Carga**: Sube documentos directamente a Alfresco
- **Descarga Inteligente**: Descarga desde el sistema correspondiente
- **Etiquetas Visuales**: Indica claramente dónde está cada documento

## Configuración

### Variables de Entorno

Añada estas variables a su archivo `.env`:

```env
VITE_ALFRESCO_URL=http://localhost:8080
VITE_ALFRESCO_USERNAME=admin
VITE_ALFRESCO_PASSWORD=admin
VITE_ALFRESCO_SITE_ID=sipresas
```

### Configuración de Alfresco

1. **Servidor Alfresco**: Debe tener Alfresco Community o Enterprise Edition en ejecución
2. **API REST**: La API REST de Alfresco debe estar habilitada (puerto 8080 por defecto)
3. **Credenciales**: Use credenciales de un usuario con permisos para crear/modificar documentos
4. **Sitio**: Cree un sitio llamado "sipresas" (o use el nombre configurado en VITE_ALFRESCO_SITE_ID)

### Modelo de Contenido Personalizado (Opcional)

Para aprovechar al máximo la integración, puede crear un modelo de contenido personalizado en Alfresco:

```xml
<model name="sipresas:model" xmlns="http://www.alfresco.org/model/dictionary/1.0">
  <namespaces>
    <namespace uri="http://www.chg.es/model/sipresas/1.0" prefix="sipresas"/>
  </namespaces>

  <types>
    <type name="sipresas:technicalDocument">
      <parent>cm:content</parent>
      <properties>
        <property name="sipresas:damId">
          <type>d:text</type>
          <mandatory>false</mandatory>
        </property>
        <property name="sipresas:documentType">
          <type>d:text</type>
          <mandatory>false</mandatory>
        </property>
        <property name="sipresas:version">
          <type>d:text</type>
          <mandatory>false</mandatory>
        </property>
        <property name="sipresas:tags">
          <type>d:text</type>
          <multiple>true</multiple>
        </property>
      </properties>
    </type>
  </types>
</model>
```

## Uso

### Subir un Documento a Alfresco

```typescript
import { documentService } from './services/documentService';

const file = // File object from input
await documentService.uploadDocumentToAlfresco(file, {
  damId: 'dam-uuid',
  folderId: 'folder-uuid',
  documentType: 'Informe',
  title: 'Informe de Seguridad',
  description: 'Informe anual de seguridad',
  version: '1.0',
  tags: ['seguridad', 'informe', 'anual']
});
```

### Descargar un Documento

```typescript
const { blob, document } = await documentService.downloadDocumentFromAlfresco(documentId);

// Crear URL para descarga
const url = window.URL.createObjectURL(blob);
const a = document.createElement('a');
a.href = url;
a.download = document.file_name;
a.click();
```

### Sincronizar desde Alfresco

```typescript
// Sincronizar un documento específico
await documentService.syncDocumentFromAlfresco(nodeId, damId, folderId);

// Sincronizar una carpeta completa
await documentService.syncFolderFromAlfresco(alfrescoFolderId, damId, supabaseFolderId);
```

## Arquitectura

### Flujo de Subida

1. Usuario selecciona archivo en la interfaz
2. `documentService.uploadDocumentToAlfresco()` se ejecuta:
   - Sube el archivo a Alfresco usando `alfrescoService`
   - Obtiene el `node_id` del documento en Alfresco
   - Registra los metadatos en la tabla `technical_documents` de Supabase
   - Marca `storage_location = 'alfresco'`
3. El documento aparece en la lista con el indicador de Alfresco

### Flujo de Descarga

1. Usuario hace clic en botón de descarga
2. Sistema verifica `storage_location` del documento
3. Si es Alfresco:
   - `documentService.downloadDocumentFromAlfresco()` obtiene el blob
   - Se crea un enlace de descarga temporal
4. Si es Supabase:
   - Se descarga desde Supabase Storage

### Sincronización

La sincronización mantiene consistencia entre ambos sistemas:

- Documentos en Alfresco tienen referencia en Supabase
- Cambios en Alfresco pueden sincronizarse bajo demanda
- Los metadatos se mantienen en ambos sistemas

## Ventajas de la Integración

1. **Control de Versiones**: Alfresco proporciona control avanzado de versiones
2. **Flujos de Trabajo**: Aproveche los flujos de trabajo de Alfresco
3. **Gestión Empresarial**: Use las capacidades ECM completas de Alfresco
4. **Escalabilidad**: Alfresco está diseñado para gestionar millones de documentos
5. **Seguridad**: Permisos granulares y auditoría completa
6. **Búsqueda Avanzada**: Motor de búsqueda Solr integrado
7. **Transformaciones**: Conversión automática de formatos de documentos
8. **Retención**: Políticas de retención y gestión del ciclo de vida

## Consideraciones de Seguridad

1. **Autenticación**: Use siempre conexión HTTPS en producción
2. **Credenciales**: Nunca exponga credenciales en el frontend
3. **Proxy Backend**: En producción, use un proxy backend para las llamadas a Alfresco
4. **Permisos**: Configure permisos apropiados en Alfresco
5. **Validación**: Valide todos los archivos antes de subirlos

## Próximas Mejoras

- [ ] Implementar preview de documentos desde Alfresco
- [ ] Soporte para versionado de documentos
- [ ] Implementar flujos de aprobación
- [ ] Búsqueda híbrida (Alfresco + Supabase)
- [ ] Migración masiva de documentos entre sistemas
- [ ] Integración con transformaciones de Alfresco
- [ ] Soporte para metadatos personalizados avanzados
- [ ] Sincronización automática bidireccional

## Soporte

Para más información sobre la API de Alfresco:
- [Documentación oficial de Alfresco REST API](https://docs.alfresco.com/content-services/latest/develop/rest-api-guide/)
- [Alfresco Developer Portal](https://developer.alfresco.com/)
