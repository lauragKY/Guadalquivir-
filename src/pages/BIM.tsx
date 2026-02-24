import React, { useState, useEffect } from 'react';
import {
  Box,
  Upload,
  Eye,
  Layers,
  Ruler,
  Tag,
  Search,
  Filter,
  Download,
  Info,
  FileText,
  Map as MapIcon,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Home,
  Maximize2,
  Settings,
  ExternalLink
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { supabase } from '../lib/supabase';
import { useDamSelection } from '../contexts/DamSelectionContext';

interface BIMModel {
  id: string;
  presaId: string;
  presaNombre: string;
  nombre: string;
  version: string;
  formato: 'IFC' | 'RVT' | 'DWG' | 'FBX';
  tamaño: string;
  fechaSubida: string;
  estado: 'activo' | 'revision' | 'obsoleto';
  elementos: number;
  niveles: number;
}

interface BIMElement {
  id: string;
  tipo: string;
  categoria: string;
  nombre: string;
  nivel: string;
  propiedades: Record<string, string>;
}

export default function BIM() {
  const { selectedDam } = useDamSelection();
  const [selectedModel, setSelectedModel] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'3d' | 'plano' | 'lista'>('3d');
  const [showProperties, setShowProperties] = useState(true);
  const [selectedElement, setSelectedElement] = useState<BIMElement | null>(null);
  const [latestMaintenancePdf, setLatestMaintenancePdf] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const mockModels: BIMModel[] = [
    {
      id: '1',
      presaId: 'P001',
      presaNombre: 'Presa de la Breña II',
      nombre: 'Modelo BIM Principal',
      version: '2.0',
      formato: 'IFC',
      tamaño: '1.2 GB',
      fechaSubida: '2024-01-15',
      estado: 'activo',
      elementos: 12456,
      niveles: 8
    },
    {
      id: '2',
      presaId: 'P001',
      presaNombre: 'Presa de la Breña II',
      nombre: 'Aliviadero',
      version: '1.5',
      formato: 'IFC',
      tamaño: '450 MB',
      fechaSubida: '2023-11-20',
      estado: 'activo',
      elementos: 3245,
      niveles: 4
    },
    {
      id: '3',
      presaId: 'P002',
      presaNombre: 'Presa del Pintado',
      nombre: 'Modelo General',
      version: '1.0',
      formato: 'RVT',
      tamaño: '890 MB',
      fechaSubida: '2023-08-10',
      estado: 'revision',
      elementos: 8932,
      niveles: 6
    }
  ];

  const mockElements: BIMElement[] = [
    {
      id: 'E001',
      tipo: 'IfcWall',
      categoria: 'Estructura',
      nombre: 'Muro Cortina - Corona',
      nivel: 'Nivel +125.00',
      propiedades: {
        'Material': 'Hormigón Armado HA-30',
        'Espesor': '3.5 m',
        'Longitud': '312.5 m',
        'Altura': '8.0 m',
        'Volumen': '8,750 m³',
        'Código': 'EST-MUR-001'
      }
    },
    {
      id: 'E002',
      tipo: 'IfcBeam',
      categoria: 'Estructura',
      nombre: 'Viga Aliviadero',
      nivel: 'Nivel +118.00',
      propiedades: {
        'Material': 'Hormigón Armado HA-35',
        'Sección': '1.2 m × 0.8 m',
        'Longitud': '45.0 m',
        'Volumen': '43.2 m³',
        'Código': 'EST-VIG-012'
      }
    }
  ];

  const getStatusColor = (estado: BIMModel['estado']) => {
    const colors = {
      activo: 'bg-green-100 text-green-800 border-green-200',
      revision: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      obsoleto: 'bg-red-100 text-red-800 border-red-200'
    };
    return colors[estado];
  };

  const getFormatoColor = (formato: BIMModel['formato']) => {
    const colors = {
      IFC: 'bg-blue-100 text-blue-800 border-blue-200',
      RVT: 'bg-purple-100 text-purple-800 border-purple-200',
      DWG: 'bg-orange-100 text-orange-800 border-orange-200',
      FBX: 'bg-teal-100 text-teal-800 border-teal-200'
    };
    return colors[formato];
  };

  useEffect(() => {
    async function fetchLatestMaintenancePdf() {
      if (!selectedDam?.id) {
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('maintenance_reports')
          .select(`
            id,
            pdf_url,
            performed_at,
            work_order:maintenance_work_orders!inner (
              code,
              title,
              dam_id
            )
          `)
          .eq('work_order.dam_id', selectedDam.id)
          .not('pdf_url', 'is', null)
          .order('performed_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (error) {
          console.error('Error fetching maintenance PDF:', error);
        } else if (data?.pdf_url) {
          setLatestMaintenancePdf(data.pdf_url);
        }
      } catch (err) {
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchLatestMaintenancePdf();
  }, [selectedDam]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl flex items-center justify-center shadow-lg">
              <Box className="text-white" size={24} />
            </div>
            Módulo BIM
          </h1>
          <p className="text-slate-600 mt-1">
            Building Information Modeling - Visualización y gestión de modelos 3D
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors shadow-md">
          <Upload size={20} />
          Subir Modelo BIM
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600 font-medium mb-1">Modelos Activos</p>
              <p className="text-3xl font-bold text-blue-900">8</p>
            </div>
            <Box className="text-blue-600" size={32} />
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600 font-medium mb-1">Elementos Totales</p>
              <p className="text-3xl font-bold text-green-900">24,633</p>
            </div>
            <Layers className="text-green-600" size={32} />
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-600 font-medium mb-1">Tamaño Total</p>
              <p className="text-3xl font-bold text-purple-900">2.54 GB</p>
            </div>
            <FileText className="text-purple-600" size={32} />
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-orange-600 font-medium mb-1">Presas con BIM</p>
              <p className="text-3xl font-bold text-orange-900">6</p>
            </div>
            <MapIcon className="text-orange-600" size={32} />
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card className="h-full">
            <div className="p-4 border-b border-slate-200 bg-slate-50">
              <h2 className="font-semibold text-slate-900 flex items-center gap-2">
                <FileText size={20} />
                Modelos BIM Disponibles
              </h2>
            </div>
            <div className="p-4">
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input
                  type="text"
                  placeholder="Buscar modelos..."
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="space-y-3 max-h-[600px] overflow-y-auto">
                {mockModels.map((model) => (
                  <div
                    key={model.id}
                    onClick={() => setSelectedModel(model.id)}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      selectedModel === model.id
                        ? 'border-purple-500 bg-purple-50 shadow-md'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Box size={16} className="text-purple-600" />
                        <h3 className="font-semibold text-slate-900 text-sm">{model.nombre}</h3>
                      </div>
                      <Badge className={getStatusColor(model.estado)}>
                        {model.estado}
                      </Badge>
                    </div>

                    <p className="text-xs text-slate-600 mb-3">{model.presaNombre}</p>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="flex items-center gap-1">
                        <Badge className={getFormatoColor(model.formato)}>
                          {model.formato}
                        </Badge>
                        <span className="text-slate-600">v{model.version}</span>
                      </div>
                      <div className="text-slate-600 text-right">{model.tamaño}</div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-slate-200 text-xs text-slate-600">
                      <div className="flex items-center gap-1">
                        <Layers size={12} />
                        {model.elementos.toLocaleString()} elementos
                      </div>
                      <div className="flex items-center gap-1 justify-end">
                        <MapIcon size={12} />
                        {model.niveles} niveles
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card className="h-full">
            <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
              <h2 className="font-semibold text-slate-900 flex items-center gap-2">
                <Eye size={20} />
                Visor BIM 3D
              </h2>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 bg-white border border-slate-300 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('3d')}
                    className={`px-3 py-1.5 rounded text-sm transition-colors ${
                      viewMode === '3d'
                        ? 'bg-purple-600 text-white'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    3D
                  </button>
                  <button
                    onClick={() => setViewMode('plano')}
                    className={`px-3 py-1.5 rounded text-sm transition-colors ${
                      viewMode === 'plano'
                        ? 'bg-purple-600 text-white'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    Plano
                  </button>
                  <button
                    onClick={() => setViewMode('lista')}
                    className={`px-3 py-1.5 rounded text-sm transition-colors ${
                      viewMode === 'lista'
                        ? 'bg-purple-600 text-white'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    Lista
                  </button>
                </div>
                <button
                  onClick={() => setShowProperties(!showProperties)}
                  className="px-3 py-1.5 border border-slate-300 rounded-lg text-sm hover:bg-slate-100 transition-colors"
                >
                  <Settings size={16} />
                </button>
              </div>
            </div>

            <div className="relative bg-gradient-to-br from-slate-100 to-slate-200 h-[500px]">
              {selectedModel ? (
                <>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-purple-600 to-purple-700 rounded-2xl flex items-center justify-center shadow-2xl animate-pulse">
                        <Box className="text-white" size={48} />
                      </div>
                      <p className="text-slate-600 font-medium text-lg mb-2">Visor BIM en Desarrollo</p>
                      <p className="text-slate-500 text-sm max-w-md">
                        El visor 3D interactivo se integrará en la siguiente fase del proyecto.
                        Soportará modelos IFC, RVT, DWG y FBX con navegación completa.
                      </p>
                    </div>
                  </div>

                  <div className="absolute top-4 left-4 flex gap-2">
                    <button className="p-2 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors shadow-sm">
                      <ZoomIn size={20} />
                    </button>
                    <button className="p-2 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors shadow-sm">
                      <ZoomOut size={20} />
                    </button>
                    <button className="p-2 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors shadow-sm">
                      <RotateCw size={20} />
                    </button>
                    <button className="p-2 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors shadow-sm">
                      <Home size={20} />
                    </button>
                    <button className="p-2 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors shadow-sm">
                      <Maximize2 size={20} />
                    </button>
                  </div>

                  <div className="absolute bottom-4 left-4 bg-white border border-slate-300 rounded-lg p-3 shadow-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Info size={16} className="text-purple-600" />
                      <span className="font-semibold text-sm">Información del Modelo</span>
                    </div>
                    <div className="space-y-1 text-xs text-slate-600">
                      <p>Modelo: {mockModels.find(m => m.id === selectedModel)?.nombre}</p>
                      <p>Elementos: {mockModels.find(m => m.id === selectedModel)?.elementos.toLocaleString()}</p>
                      <p>Formato: {mockModels.find(m => m.id === selectedModel)?.formato}</p>
                    </div>
                  </div>
                </>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <Box className="mx-auto mb-4 text-slate-400" size={64} />
                    <p className="text-slate-600 font-medium">Selecciona un modelo BIM para visualizar</p>
                    <p className="text-slate-500 text-sm mt-1">
                      Elige un modelo de la lista de la izquierda
                    </p>
                  </div>
                </div>
              )}
            </div>

            {showProperties && selectedModel && (
              <div className="p-4 border-t border-slate-200 bg-slate-50">
                <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                  <Tag size={18} />
                  Propiedades del Elemento
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {mockElements.map((element) => (
                    <div
                      key={element.id}
                      className="p-3 bg-white border border-slate-200 rounded-lg hover:border-purple-300 transition-colors cursor-pointer"
                      onClick={() => setSelectedElement(element)}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <Layers size={14} className="text-purple-600" />
                        <span className="font-semibold text-sm text-slate-900">{element.nombre}</span>
                      </div>
                      <div className="space-y-1 text-xs text-slate-600">
                        <p>Tipo: {element.tipo}</p>
                        <p>Categoría: {element.categoria}</p>
                        <p>Nivel: {element.nivel}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>

      {selectedElement && (
        <Card>
          <div className="p-4 border-b border-slate-200 bg-slate-50">
            <h2 className="font-semibold text-slate-900 flex items-center gap-2">
              <Ruler size={20} />
              Propiedades Detalladas: {selectedElement.nombre}
            </h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-3 gap-4">
              {Object.entries(selectedElement.propiedades).map(([key, value]) => (
                <div key={key} className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
                  <p className="text-sm text-slate-600 mb-1">{key}</p>
                  <p className="font-semibold text-slate-900">{value}</p>
                </div>
              ))}
            </div>
            <div className="mt-6 flex gap-3">
              <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <Download size={18} />
                Exportar Propiedades
              </button>
              <button className="flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors">
                <FileText size={18} />
                Generar Informe
              </button>
            </div>
          </div>
        </Card>
      )}

      {latestMaintenancePdf && !loading && (
        <Card>
          <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
            <h2 className="font-semibold text-slate-900 flex items-center gap-2">
              <FileText size={20} />
              Último Informe de Mantenimiento
            </h2>
            <a
              href={latestMaintenancePdf}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
            >
              <ExternalLink size={16} />
              Abrir en Nueva Pestaña
            </a>
          </div>
          <div className="p-6">
            <div className="bg-slate-100 rounded-lg overflow-hidden" style={{ height: '800px' }}>
              <iframe
                src={latestMaintenancePdf}
                className="w-full h-full"
                title="Último Informe de Mantenimiento"
              />
            </div>
          </div>
        </Card>
      )}

    </div>
  );
}
