import { useState } from 'react';
import { useDamSelection } from '../contexts/DamSelectionContext';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import {
  Box,
  Layers,
  Eye,
  EyeOff,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Maximize2,
  Filter,
  AlertCircle,
  CheckCircle,
  Clock,
  FileText,
  Activity,
  TrendingUp,
  MapPin,
  Grid3x3
} from 'lucide-react';

const equipmentCategories = [
  { id: 'transformers', name: 'Centros de Transformación', count: 2, visible: true },
  { id: 'electrical', name: 'Cuadros Eléctricos', count: 5, visible: true },
  { id: 'generators', name: 'Grupos Electrógenos', count: 3, visible: true },
  { id: 'discharge', name: 'Órganos de Desagüe', count: 8, visible: true },
  { id: 'pumping', name: 'Sistemas de Achique', count: 4, visible: true },
  { id: 'ventilation', name: 'Ventilación Forzada', count: 6, visible: true },
  { id: 'sensors', name: 'Equipos de Auscultación', count: 45, visible: false }
];

const mockEquipment = [
  {
    id: '1',
    code: 'CT-01',
    name: 'Centro Transformación Principal',
    category: 'transformers',
    status: 'operational',
    lastInspection: '2026-01-15',
    situation: 'normal',
    position: { x: 100, y: 200, z: 50 }
  },
  {
    id: '2',
    code: 'GE-01',
    name: 'Grupo Electrógeno 1',
    category: 'generators',
    status: 'operational',
    lastInspection: '2026-01-20',
    situation: 'normal',
    position: { x: 150, y: 180, z: 45 }
  },
  {
    id: '3',
    code: 'AL-01',
    name: 'Aliviadero de Compuertas',
    category: 'discharge',
    status: 'operational',
    lastInspection: '2026-02-01',
    situation: 'normal',
    position: { x: 200, y: 220, z: 80 }
  },
  {
    id: '4',
    code: 'DF-01',
    name: 'Desagüe de Fondo',
    category: 'discharge',
    status: 'maintenance',
    lastInspection: '2026-01-10',
    situation: 'normal',
    position: { x: 180, y: 190, z: 30 }
  },
  {
    id: '5',
    code: 'PZ-12',
    name: 'Piezómetro PZ-12',
    category: 'sensors',
    status: 'operational',
    lastInspection: '2026-02-05',
    situation: 'normal',
    alertLevel: 'caution',
    position: { x: 120, y: 210, z: 55 }
  }
];

const viewpoints = [
  { id: 'front', name: 'Vista Frontal', icon: Eye },
  { id: 'top', name: 'Vista Superior', icon: Grid3x3 },
  { id: 'section', name: 'Vista Sección', icon: Layers },
  { id: 'galleries', name: 'Vista Galerías', icon: Box }
];

export default function BIMViewer() {
  const { selectedDam } = useDamSelection();
  const [selectedEquipment, setSelectedEquipment] = useState<string | null>(null);
  const [visibleCategories, setVisibleCategories] = useState<Set<string>>(
    new Set(equipmentCategories.filter(c => c.visible).map(c => c.id))
  );
  const [activeViewpoint, setActiveViewpoint] = useState('front');
  const [showFilters, setShowFilters] = useState(false);

  const toggleCategory = (categoryId: string) => {
    const newVisible = new Set(visibleCategories);
    if (newVisible.has(categoryId)) {
      newVisible.delete(categoryId);
    } else {
      newVisible.add(categoryId);
    }
    setVisibleCategories(newVisible);
  };

  const selected = mockEquipment.find(e => e.id === selectedEquipment);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'operational': return 'text-green-500';
      case 'maintenance': return 'text-yellow-500';
      case 'alert': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'operational': return 'success';
      case 'maintenance': return 'warning';
      case 'alert': return 'error';
      default: return 'default';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Modelo BIM</h1>
          <p className="mt-2 text-gray-600">
            {selectedDam ? `Gemelo Digital - ${selectedDam.name}` : 'Seleccione una presa'}
          </p>
        </div>
        {selectedDam && (
          <div className="flex items-center gap-2">
            <Badge variant="default">
              <Box className="w-3 h-3 mr-1" />
              LOD 300
            </Badge>
            <Badge variant={selectedDam.operational_status === 'operational' ? 'success' : 'warning'}>
              {selectedDam.operational_status === 'operational' ? 'Normal' : 'Extraordinaria'}
            </Badge>
          </div>
        )}
      </div>

      {!selectedDam ? (
        <Card className="p-8 text-center">
          <Box className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Seleccione una presa para visualizar el modelo BIM</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3 space-y-6">
            <Card className="p-0 overflow-hidden">
              <div className="bg-gray-900 p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <button className="p-2 bg-gray-800 text-white rounded hover:bg-gray-700 transition-colors">
                    <RotateCw className="w-5 h-5" />
                  </button>
                  <button className="p-2 bg-gray-800 text-white rounded hover:bg-gray-700 transition-colors">
                    <ZoomIn className="w-5 h-5" />
                  </button>
                  <button className="p-2 bg-gray-800 text-white rounded hover:bg-gray-700 transition-colors">
                    <ZoomOut className="w-5 h-5" />
                  </button>
                  <div className="h-6 w-px bg-gray-700" />
                  {viewpoints.map(vp => {
                    const VpIcon = vp.icon;
                    return (
                      <button
                        key={vp.id}
                        onClick={() => setActiveViewpoint(vp.id)}
                        className={`p-2 rounded transition-colors ${
                          activeViewpoint === vp.id
                            ? 'bg-chg-blue text-white'
                            : 'bg-gray-800 text-white hover:bg-gray-700'
                        }`}
                        title={vp.name}
                      >
                        <VpIcon className="w-5 h-5" />
                      </button>
                    );
                  })}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className={`p-2 rounded transition-colors ${
                      showFilters ? 'bg-chg-blue text-white' : 'bg-gray-800 text-white hover:bg-gray-700'
                    }`}
                  >
                    <Filter className="w-5 h-5" />
                  </button>
                  <button className="p-2 bg-gray-800 text-white rounded hover:bg-gray-700 transition-colors">
                    <Maximize2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {showFilters && (
                <div className="bg-gray-800 p-4 border-t border-gray-700">
                  <h3 className="text-sm font-semibold text-white mb-3">Capas Visibles</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {equipmentCategories.map(category => (
                      <button
                        key={category.id}
                        onClick={() => toggleCategory(category.id)}
                        className={`flex items-center gap-2 px-3 py-2 rounded text-sm transition-colors ${
                          visibleCategories.has(category.id)
                            ? 'bg-chg-blue text-white'
                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        }`}
                      >
                        {visibleCategories.has(category.id) ? (
                          <Eye className="w-4 h-4" />
                        ) : (
                          <EyeOff className="w-4 h-4" />
                        )}
                        <span className="truncate">{category.name}</span>
                        <span className="ml-auto text-xs">({category.count})</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="relative aspect-video bg-gradient-to-br from-gray-800 via-gray-700 to-gray-900">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <Box className="w-20 h-20 text-gray-600 mx-auto mb-4 animate-pulse" />
                    <p className="text-gray-400 mb-2">Visualizador 3D - {activeViewpoint}</p>
                    <p className="text-sm text-gray-500">Modelo: Presa_CHG_{selectedDam.code}_v2.0.gltf</p>
                  </div>
                </div>

                <svg className="absolute inset-0 w-full h-full opacity-30">
                  {mockEquipment
                    .filter(eq => visibleCategories.has(eq.category))
                    .map(eq => (
                      <g key={eq.id}>
                        <circle
                          cx={eq.position.x + 100}
                          cy={eq.position.y + 50}
                          r="8"
                          className={`cursor-pointer transition-all ${
                            selectedEquipment === eq.id
                              ? 'fill-blue-500 stroke-blue-300'
                              : eq.status === 'operational'
                              ? 'fill-green-500 stroke-green-300'
                              : eq.status === 'maintenance'
                              ? 'fill-yellow-500 stroke-yellow-300'
                              : 'fill-red-500 stroke-red-300'
                          }`}
                          strokeWidth="2"
                          onClick={() => setSelectedEquipment(eq.id)}
                        />
                        {selectedEquipment === eq.id && (
                          <text
                            x={eq.position.x + 100}
                            y={eq.position.y + 35}
                            className="fill-white text-xs"
                            textAnchor="middle"
                          >
                            {eq.code}
                          </text>
                        )}
                      </g>
                    ))}
                </svg>

                <div className="absolute bottom-4 left-4 bg-black bg-opacity-70 rounded-lg p-3 text-white text-sm">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-green-500" />
                      <span>Operativo</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-yellow-500" />
                      <span>Mantenimiento</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-500" />
                      <span>Alerta</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-blue-500" />
                      <span>Seleccionado</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {selected && (
              <Card className="p-6">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">{selected.name}</h3>
                    <p className="text-gray-600 mt-1">Código: {selected.code}</p>
                  </div>
                  <Badge variant={getStatusBadge(selected.status)}>
                    {selected.status === 'operational' ? 'Operativo' : 'Mantenimiento'}
                  </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      Datos de Inventario
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Categoría:</span>
                        <span className="font-medium text-gray-900">
                          {equipmentCategories.find(c => c.id === selected.category)?.name}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Estado:</span>
                        <span className={`font-medium ${getStatusColor(selected.status)}`}>
                          {selected.status === 'operational' ? 'Operativo' : 'Mantenimiento'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Ubicación:</span>
                        <span className="font-medium text-gray-900">Galería Principal</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Último Mantenimiento
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Fecha:</span>
                        <span className="font-medium text-gray-900">
                          {new Date(selected.lastInspection).toLocaleDateString('es-ES')}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Resultado:</span>
                        <span className="font-medium text-green-600">Conforme</span>
                      </div>
                      <button className="w-full mt-2 px-3 py-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors">
                        <FileText className="w-4 h-4 inline mr-1" />
                        Ver Parte PDF
                      </button>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                      <Activity className="w-4 h-4" />
                      Estado Operacional
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Situación:</span>
                        <Badge variant="success">Normal</Badge>
                      </div>
                      {selected.category === 'sensors' && selected.alertLevel && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Nivel Alerta:</span>
                          <Badge variant="warning">Precaución</Badge>
                        </div>
                      )}
                      {selected.category === 'sensors' && (
                        <button className="w-full mt-2 px-3 py-2 bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors">
                          <TrendingUp className="w-4 h-4 inline mr-1" />
                          Ver Gráficos
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
                  <p className="text-sm text-blue-900">
                    <strong>Integración:</strong> Este elemento está sincronizado con los módulos de Inventario, Mantenimiento, Explotación y Auscultación.
                  </p>
                </div>
              </Card>
            )}
          </div>

          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Equipos Críticos</h3>
              <div className="space-y-2">
                {mockEquipment.slice(0, 5).map(eq => (
                  <button
                    key={eq.id}
                    onClick={() => setSelectedEquipment(eq.id)}
                    className={`w-full p-3 rounded-lg text-left transition-colors ${
                      selectedEquipment === eq.id
                        ? 'bg-chg-blue text-white'
                        : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {eq.status === 'operational' ? (
                        <CheckCircle className="w-4 h-4 flex-shrink-0" />
                      ) : (
                        <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{eq.code}</p>
                        <p className={`text-xs truncate ${
                          selectedEquipment === eq.id ? 'text-blue-100' : 'text-gray-600'
                        }`}>
                          {eq.name}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Estadísticas</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Equipos Operativos</span>
                    <span className="font-semibold text-gray-900">
                      {mockEquipment.filter(e => e.status === 'operational').length}/
                      {mockEquipment.length}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full"
                      style={{
                        width: `${
                          (mockEquipment.filter(e => e.status === 'operational').length /
                            mockEquipment.length) *
                          100
                        }%`
                      }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">En Mantenimiento</span>
                    <span className="font-semibold text-gray-900">
                      {mockEquipment.filter(e => e.status === 'maintenance').length}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-yellow-500 h-2 rounded-full"
                      style={{
                        width: `${
                          (mockEquipment.filter(e => e.status === 'maintenance').length /
                            mockEquipment.length) *
                          100
                        }%`
                      }}
                    />
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Acciones Rápidas</h3>
              <div className="space-y-2">
                <button className="w-full px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-left text-sm">
                  <MapPin className="w-4 h-4 inline mr-2" />
                  Localizar Elemento
                </button>
                <button className="w-full px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors text-left text-sm">
                  <FileText className="w-4 h-4 inline mr-2" />
                  Exportar Informe
                </button>
                <button className="w-full px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors text-left text-sm">
                  <Layers className="w-4 h-4 inline mr-2" />
                  Gestionar Capas
                </button>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-3">Información del Modelo</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Versión:</span>
                  <span className="font-medium text-gray-900">2.0</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Fecha Escaneo:</span>
                  <span className="font-medium text-gray-900">Enero 2026</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">LOD:</span>
                  <span className="font-medium text-gray-900">300</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Elementos:</span>
                  <span className="font-medium text-gray-900">73</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
