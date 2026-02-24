import { useState } from 'react';
import { FileText, BookOpen, Palette, Code, Layers, AlertCircle, Settings as SettingsIcon } from 'lucide-react';
import { Card } from '../components/ui/Card';

interface DocumentItem {
  id: string;
  title: string;
  description: string;
  category: 'design' | 'technical' | 'planning' | 'guide';
  icon: React.ElementType;
  path: string;
}

const documents: DocumentItem[] = [
  {
    id: 'logos',
    title: 'Guía de Logos Institucionales',
    description: 'Especificaciones completas de los logos de SIPRESAS y el Ministerio, incluyendo usos, colores y restricciones.',
    category: 'design',
    icon: Palette,
    path: '/GUIA_LOGOS_INSTITUCIONALES.md'
  },
  {
    id: 'colores',
    title: 'Paleta de Colores SIPRESAS',
    description: 'Sistema de colores institucional con especificaciones para desarrollo y diseño.',
    category: 'design',
    icon: Palette,
    path: '/GUIA_PALETA_COLORES_SIPRESAS.md'
  },
  {
    id: 'identidad',
    title: 'Guía de Identidad Visual',
    description: 'Directrices completas de identidad visual para el sistema SIPRESAS.',
    category: 'design',
    icon: Palette,
    path: '/GUIA_IDENTIDAD_VISUAL.md'
  },
  {
    id: 'referencia-colores',
    title: 'Referencia Rápida de Colores',
    description: 'Guía rápida de colores con códigos hexadecimales y CSS.',
    category: 'design',
    icon: Palette,
    path: '/REFERENCIA_RAPIDA_COLORES.md'
  },
  {
    id: 'componentes',
    title: 'Ejemplos de Componentes SIPRESAS',
    description: 'Catálogo de componentes UI reutilizables con ejemplos de código.',
    category: 'technical',
    icon: Code,
    path: '/EJEMPLOS_COMPONENTES_SIPRESAS.md'
  },
  {
    id: 'propuesta',
    title: 'Propuesta Técnica SIPRESAS',
    description: 'Documento técnico completo del proyecto con arquitectura y especificaciones.',
    category: 'technical',
    icon: FileText,
    path: '/PROPUESTA_TECNICA_SIPRESAS.md'
  },
  {
    id: 'estrategia',
    title: 'Estrategia de Implementación',
    description: 'Plan estratégico para la implementación del sistema por fases.',
    category: 'planning',
    icon: Layers,
    path: '/ESTRATEGIA_IMPLEMENTACION.md'
  },
  {
    id: 'primer-incremento',
    title: 'Backlog del Primer Incremento',
    description: 'Planificación detallada del primer incremento del proyecto.',
    category: 'planning',
    icon: FileText,
    path: '/BACKLOG_PRIMER_INCREMENTO.md'
  },
  {
    id: 'modulo-auscultacion',
    title: 'Backlog Módulo Auscultación',
    description: 'Especificaciones y planificación del módulo de auscultación.',
    category: 'planning',
    icon: FileText,
    path: '/BACKLOG_MODULO_AUSCULTACION.md'
  },
  {
    id: 'modulo-emergencias',
    title: 'Backlog Módulo Emergencias',
    description: 'Especificaciones y planificación del módulo de emergencias.',
    category: 'planning',
    icon: AlertCircle,
    path: '/BACKLOG_MODULO_EMERGENCIAS.md'
  },
  {
    id: 'modulos-adicionales',
    title: 'Backlog Módulos Adicionales',
    description: 'Planificación de módulos complementarios del sistema.',
    category: 'planning',
    icon: FileText,
    path: '/BACKLOG_MODULOS_ADICIONALES.md'
  },
  {
    id: 'modulo-explotacion',
    title: 'Módulo de Explotación',
    description: 'Especificación completa del módulo de explotación de presas.',
    category: 'technical',
    icon: SettingsIcon,
    path: '/MODULO_EXPLOTACION.md'
  },
  {
    id: 'modulo-bim',
    title: 'Módulo BIM - Especificación',
    description: 'Especificación técnica del módulo de Building Information Modeling.',
    category: 'technical',
    icon: Layers,
    path: '/MODULO_BIM_ESPECIFICACION.md'
  },
  {
    id: 'alfresco',
    title: 'Integración con Alfresco',
    description: 'Documentación de integración con el sistema de gestión documental Alfresco.',
    category: 'technical',
    icon: FileText,
    path: '/ALFRESCO_INTEGRATION.md'
  },
  {
    id: 'demo-setup',
    title: 'Configuración de Demo',
    description: 'Guía para configurar el entorno de demostración.',
    category: 'guide',
    icon: BookOpen,
    path: '/DEMO_SETUP.md'
  },
  {
    id: 'guia-demo',
    title: 'Guía Rápida de Demo',
    description: 'Guía rápida para realizar demostraciones del sistema.',
    category: 'guide',
    icon: BookOpen,
    path: '/GUIA_RAPIDA_DEMO.md'
  },
  {
    id: 'kickoff',
    title: 'Guía Demo Kickoff',
    description: 'Presentación y guía para la reunión de kickoff del proyecto.',
    category: 'guide',
    icon: BookOpen,
    path: '/GUIA_DEMO_KICKOFF.md'
  },
  {
    id: 'presentacion-kickoff',
    title: 'Presentación Kickoff',
    description: 'Contenido de la presentación para el kickoff del proyecto.',
    category: 'guide',
    icon: BookOpen,
    path: '/PRESENTACION_KICKOFF.md'
  }
];

const categories = [
  { id: 'all', label: 'Todos', color: 'bg-gray-500' },
  { id: 'design', label: 'Diseño', color: 'bg-purple-500' },
  { id: 'technical', label: 'Técnico', color: 'bg-blue-500' },
  { id: 'planning', label: 'Planificación', color: 'bg-green-500' },
  { id: 'guide', label: 'Guías', color: 'bg-orange-500' }
];

export default function Documentation() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredDocuments = documents.filter(doc => {
    const matchesCategory = selectedCategory === 'all' || doc.category === selectedCategory;
    const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleDownload = (path: string, title: string) => {
    const link = document.createElement('a');
    link.href = path;
    link.download = path.split('/').pop() || 'documento.md';
    link.click();
  };

  const getCategoryBadge = (category: string) => {
    const cat = categories.find(c => c.id === category);
    return cat ? (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-white ${cat.color}`}>
        {cat.label}
      </span>
    ) : null;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Documentación</h1>
          <p className="text-gray-600 mt-1">Guías, especificaciones y documentación técnica del proyecto SIPRESAS</p>
        </div>
      </div>

      {/* Search and Filters */}
      <Card>
        <div className="space-y-4">
          {/* Search */}
          <div>
            <input
              type="text"
              placeholder="Buscar documentos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sipresas-primary focus:border-transparent"
            />
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  selectedCategory === category.id
                    ? `${category.color} text-white shadow-md`
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category.label}
                {category.id !== 'all' && (
                  <span className="ml-2 text-xs opacity-75">
                    ({documents.filter(d => d.category === category.id).length})
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Document Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDocuments.map(doc => {
          const Icon = doc.icon;
          return (
            <Card key={doc.id} className="hover:shadow-lg transition-shadow">
              <div className="space-y-4">
                {/* Icon and Category */}
                <div className="flex items-start justify-between">
                  <div className="p-3 bg-sipresas-lightest rounded-lg">
                    <Icon className="text-sipresas-primary" size={24} />
                  </div>
                  {getCategoryBadge(doc.category)}
                </div>

                {/* Title and Description */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{doc.title}</h3>
                  <p className="text-sm text-gray-600 line-clamp-3">{doc.description}</p>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2 border-t border-gray-200">
                  <a
                    href={doc.path}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 text-center px-4 py-2 bg-sipresas-primary text-white rounded-lg hover:bg-sipresas-dark transition-colors text-sm font-medium"
                  >
                    Ver Documento
                  </a>
                  <button
                    onClick={() => handleDownload(doc.path, doc.title)}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
                  >
                    Descargar
                  </button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* No Results */}
      {filteredDocuments.length === 0 && (
        <Card>
          <div className="text-center py-12">
            <FileText className="mx-auto text-gray-400 mb-4" size={48} />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron documentos</h3>
            <p className="text-gray-600">
              Intenta con otros términos de búsqueda o selecciona otra categoría
            </p>
          </div>
        </Card>
      )}

      {/* Document Count */}
      <div className="text-center text-sm text-gray-500">
        Mostrando {filteredDocuments.length} de {documents.length} documentos
      </div>
    </div>
  );
}
