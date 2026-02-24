import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, AlertTriangle, TrendingUp, TrendingDown, Activity, MapPin,
  Package, Wrench, FolderOpen, LineChart as LineChartIcon, Gauge, Box, FileText, AlertCircle
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { StatusBadge } from '../components/ui/StatusBadge';
import { Badge } from '../components/ui/Badge';
import { Dam, Emergency } from '../types';
import { getDamById, getEmergenciesByDam } from '../services/api';
import { mockDams, mockMaintenanceStats, mockMaintenanceByMonth, preventiveScheduleData, scheduleTypeLegend } from '../data/mockData';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export default function DamDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [dam, setDam] = useState<Dam | null>(null);
  const [emergencies, setEmergencies] = useState<Emergency[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDamData = async () => {
      if (!id) {
        setLoading(false);
        return;
      }

      try {
        console.log('Loading dam with ID:', id);
        const [damData, emergenciesData] = await Promise.all([
          getDamById(id),
          getEmergenciesByDam(id)
        ]);

        console.log('Dam data loaded:', damData);
        if (damData) {
          setDam(damData);
          setEmergencies(emergenciesData);
        } else {
          console.log('Dam data not found, trying mock data...');
          const mockDam = mockDams.find(d => d.id === id);

          if (mockDam) {
            const mappedDam: Dam = {
              id: mockDam.id,
              code: mockDam.codigo,
              name: mockDam.nombre,
              province: mockDam.provincia,
              municipality: mockDam.municipio,
              river: mockDam.rio,
              dam_type: mockDam.tipo,
              height: mockDam.altura,
              max_capacity: mockDam.capacidad_maxima,
              current_level: mockDam.nivel_actual,
              current_volume: mockDam.volumen_actual,
              operational_status: mockDam.estado_operacional as any,
              latitude: mockDam.lat,
              longitude: mockDam.lon,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            };
            setDam(mappedDam);
            setEmergencies([]);
          }
        }
      } catch (error) {
        console.error('Error loading dam data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDamData();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!dam) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Presa no encontrada</p>
        <button
          onClick={() => navigate('/dashboard')}
          className="mt-4 text-blue-600 hover:text-blue-700"
        >
          Volver al Dashboard
        </button>
      </div>
    );
  }


  const getLevelStatus = (level: number) => {
    if (level >= 90) return { color: 'text-red-600', icon: AlertTriangle, label: 'Nivel Crítico' };
    if (level >= 75) return { color: 'text-green-600', icon: TrendingUp, label: 'Nivel Óptimo' };
    if (level >= 50) return { color: 'text-blue-600', icon: Activity, label: 'Nivel Normal' };
    return { color: 'text-orange-600', icon: TrendingDown, label: 'Nivel Bajo' };
  };

  const levelStatus = getLevelStatus(dam.current_level);
  const LevelIcon = levelStatus.icon;

  const managementModules = [
    { name: 'Inventario', icon: Package, path: '/inventory' },
    { name: 'Mantenimiento', icon: Wrench, path: '/maintenance' },
    { name: 'Archivo Técnico', icon: FolderOpen, path: '/technical-archive' },
    { name: 'Auscultación', icon: LineChartIcon, path: '/auscultation' },
    { name: 'Explotación', icon: Gauge, path: '/exploitation' },
    { name: 'BIM', icon: Box, path: '/bim' },
    { name: 'Documentación', icon: FileText, path: '/documentation' },
    { name: 'Incidencias', icon: AlertCircle, path: '/incidents' }
  ];

  return (
    <div className="space-y-4">
      <div className="bg-gradient-to-r from-blue-800 to-blue-900 text-white px-6 py-4 rounded-xl shadow-lg">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/map')}
            className="p-2 hover:bg-blue-700 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold">{dam.code}</h1>
              <StatusBadge status={dam.operational_status} />
            </div>
            <p className="text-blue-100 mt-1">{dam.name}</p>
          </div>
          <MapPin className="h-6 w-6 text-blue-300" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className="lg:col-span-5">
          <Card className="h-full p-3">
            <div className="relative">
              <div className="aspect-[4/3] rounded-lg overflow-hidden">
                <img
                  src="https://images.pexels.com/photos/1624496/pexels-photo-1624496.jpeg?auto=compress&cs=tinysrgb&w=800"
                  alt={dam.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute bottom-3 left-3 bg-slate-900 bg-opacity-80 text-white px-2 py-1 rounded text-xs font-semibold">
                Vista aérea de la presa
              </div>
              <div className="absolute bottom-3 right-3 bg-white px-3 py-1.5 rounded-lg shadow-lg border-2 border-blue-500">
                <p className="text-xs font-bold text-blue-900">
                  {new Date().toLocaleDateString('es-ES', {
                    weekday: 'long',
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric'
                  })}
                </p>
              </div>
            </div>

            <div className="mt-3">
              <div className="flex items-center justify-between mb-2 pb-2 border-b-2 border-slate-300">
                <span className="text-xs font-bold text-slate-900">{new Date().toLocaleDateString('es-ES')}</span>
                <span className="text-xs font-bold text-slate-900">VALORES</span>
              </div>
              <div className="space-y-0.5 text-xs max-h-[400px] overflow-y-auto">
                <div className="flex justify-between py-1.5 border-b border-slate-200">
                  <span className="text-slate-600">NIVEL DE EMBALSE (m.s.n.m)</span>
                  <span className="font-semibold text-slate-900">--</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-200">
                  <span className="text-slate-600">VOLUMEN EMBALSADO (hm3)</span>
                  <span className="font-semibold text-slate-900">--</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-200">
                  <span className="text-slate-600">SUPERFICIE DEL EMBALSE (m2)</span>
                  <span className="font-semibold text-slate-900">--</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-200">
                  <span className="text-slate-600">PRECIPITACIÓN (l/m2)</span>
                  <span className="font-semibold text-slate-900">--</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-200">
                  <span className="text-slate-600">APORTACIÓN AL EMBALSE (m3/día)</span>
                  <span className="font-semibold text-slate-900">--</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-200">
                  <span className="text-slate-600">DESEMBALSE TOTAL (m3/día)</span>
                  <span className="font-semibold text-slate-900">--</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-200">
                  <span className="text-slate-600">TEMPERATURA MÍNIMA (°C)</span>
                  <span className="font-semibold text-slate-900">--</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-200">
                  <span className="text-slate-600">TEMPERATURA MÁXIMA (°C)</span>
                  <span className="font-semibold text-slate-900">--</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-200">
                  <span className="text-slate-600">TEMPERATURA MEDIA (°C)</span>
                  <span className="font-semibold text-slate-900">--</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-200">
                  <span className="text-slate-600">NIVEL TANQUE EVAPORACIÓN (mm)</span>
                  <span className="font-semibold text-slate-900">--</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-200">
                  <span className="text-slate-600">ALTURA EVAPORADA (mm/día)</span>
                  <span className="font-semibold text-slate-900">--</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-200">
                  <span className="text-slate-600">VOLUMEN EVAPORADO (m3/día)</span>
                  <span className="font-semibold text-slate-900">--</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-200">
                  <span className="text-slate-600">TOTAL DESAGÜE DE FONDO (m3/día)</span>
                  <span className="font-semibold text-slate-900">--</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-200">
                  <span className="text-slate-600">TOTAL ALIVIADERO (m3/día)</span>
                  <span className="font-semibold text-slate-900">--</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-200">
                  <span className="text-slate-600">TOTAL DESAGÜE AUXILIAR (m3/día)</span>
                  <span className="font-semibold text-slate-900">--</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-200">
                  <span className="text-slate-600">TOTAL DESAGÜE INTERMEDIO (m3/día)</span>
                  <span className="font-semibold text-slate-900">--</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-200">
                  <span className="text-slate-600">TOTAL TOMAS (m3/día)</span>
                  <span className="font-semibold text-slate-900">--</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-200">
                  <span className="text-slate-600">TOTAL TURBINADO (m3/día)</span>
                  <span className="font-semibold text-slate-900">--</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-200">
                  <span className="text-slate-600">BOMBEO DE ENTRADA (m3/día)</span>
                  <span className="font-semibold text-slate-900">--</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-200">
                  <span className="text-slate-600">FILTRACIONES/PÉRDIDAS CONTROLADAS (m3/día)</span>
                  <span className="font-semibold text-slate-900">--</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-200">
                  <span className="text-slate-600">AJUSTES/DESFASES (m3/día)</span>
                  <span className="font-semibold text-slate-900">--</span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-slate-600">TOTAL DESTINO ABASTECIMIENTO (m3/día)</span>
                  <span className="font-semibold text-slate-900">--</span>
                </div>
              </div>
            </div>
          </Card>
        </div>

        <div className="lg:col-span-7">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-full">
            <Card className="flex flex-col p-5">
              <h3 className="text-base font-semibold text-slate-900 mb-1">Órdenes de Trabajo Preventivo</h3>
              <p className="text-xs text-slate-500 mb-2">Sin datos. Año hidráulico en mantenimientos</p>
              <p className="text-xs text-slate-500 mb-3">Desde: 01/10/2018 Hasta: 07/02/2020</p>
              <div className="flex-1 flex items-center justify-center min-h-[200px]">
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'No realizado', value: mockMaintenanceStats.preventivo.pendientes, fill: '#ef4444' },
                        { name: 'Realizado', value: mockMaintenanceStats.preventivo.completadas, fill: '#10b981' },
                        { name: 'Evaluado', value: mockMaintenanceStats.preventivo.canceladas, fill: '#f59e0b' },
                        { name: 'En curso', value: 5, fill: '#fbbf24' },
                        { name: 'Aplazado', value: 2, fill: '#d1d5db' }
                      ]}
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={75}
                      paddingAngle={2}
                      dataKey="value"
                      label={(entry) => `${entry.value}`}
                    >
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-center gap-2 text-xs mt-2 flex-wrap">
                <div className="flex items-center gap-1">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
                  <span>No realizado</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
                  <span>Realizado</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2.5 h-2.5 rounded-full bg-orange-500"></div>
                  <span>Evaluado</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-400"></div>
                  <span>En curso</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2.5 h-2.5 rounded-full bg-gray-300"></div>
                  <span>Aplazado</span>
                </div>
              </div>
            </Card>

            <Card className="flex flex-col p-5">
              <h3 className="text-base font-semibold text-slate-900 mb-1">Correctivos y Mejoras</h3>
              <p className="text-xs text-slate-500 mb-2">Sin datos. Año hidráulico en mantenimientos</p>
              <p className="text-xs text-slate-500 mb-3">Desde: 01/10/2018 Hasta: 07/02/2020</p>
              <div className="flex-1 flex items-center justify-center min-h-[200px]">
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Detenido', value: 0, fill: '#ef4444' },
                        { name: 'En pausa', value: 0, fill: '#f59e0b' },
                        { name: 'Realizado', value: 100, fill: '#10b981' },
                        { name: 'Evaluado', value: 0, fill: '#fbbf24' },
                        { name: 'En curso', value: 0, fill: '#9ca3af' },
                        { name: 'Planificado', value: 0, fill: '#d1d5db' }
                      ]}
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={75}
                      paddingAngle={0}
                      dataKey="value"
                      label={(entry) => entry.value > 0 ? `${entry.value}%` : ''}
                    >
                    </Pie>
                    <Tooltip formatter={(value) => `${value}%`} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-center gap-2 text-xs mt-2 flex-wrap">
                <div className="flex items-center gap-1">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
                  <span>Detenido</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2.5 h-2.5 rounded-full bg-orange-500"></div>
                  <span>En pausa</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
                  <span>Realizado</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-400"></div>
                  <span>Evaluado</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2.5 h-2.5 rounded-full bg-gray-400"></div>
                  <span>En curso</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2.5 h-2.5 rounded-full bg-gray-300"></div>
                  <span>Planificado</span>
                </div>
              </div>
            </Card>

            <Card className="flex flex-col p-5">
              <h3 className="text-base font-semibold text-slate-900 mb-3">Leyenda Cronogramas</h3>
              <div className="space-y-3 text-xs overflow-y-auto max-h-[400px]">
                <div>
                  <p className="text-xs font-bold text-slate-700 mb-2">Periodicidad:</p>
                  <div className="grid grid-cols-2 gap-x-3 gap-y-1.5">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-slate-900 bg-slate-100 px-1.5 py-0.5 rounded min-w-[24px] text-center">D</span>
                      <span className="text-xs">Diaria</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-slate-900 bg-slate-100 px-1.5 py-0.5 rounded min-w-[24px] text-center">S</span>
                      <span className="text-xs">Semanal</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-slate-900 bg-slate-100 px-1.5 py-0.5 rounded min-w-[24px] text-center">Q</span>
                      <span className="text-xs">Quincenal</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-slate-900 bg-slate-100 px-1.5 py-0.5 rounded min-w-[24px] text-center">M</span>
                      <span className="text-xs">Mensual</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-slate-900 bg-slate-100 px-1.5 py-0.5 rounded min-w-[24px] text-center">2M</span>
                      <span className="text-xs">Bimestral</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-slate-900 bg-slate-100 px-1.5 py-0.5 rounded min-w-[24px] text-center">3M</span>
                      <span className="text-xs">Trimestral</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-slate-900 bg-slate-100 px-1.5 py-0.5 rounded min-w-[24px] text-center">4M</span>
                      <span className="text-xs">Cuatrimestral</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-slate-900 bg-slate-100 px-1.5 py-0.5 rounded min-w-[24px] text-center">6M</span>
                      <span className="text-xs">Semestral</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-slate-900 bg-slate-100 px-1.5 py-0.5 rounded min-w-[24px] text-center">3A</span>
                      <span className="text-xs">Trienal</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-slate-900 bg-slate-100 px-1.5 py-0.5 rounded min-w-[24px] text-center">5A</span>
                      <span className="text-xs">Quinquenal</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-slate-900 bg-slate-100 px-1.5 py-0.5 rounded min-w-[24px] text-center">A</span>
                      <span className="text-xs">Anual</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-slate-900 bg-slate-100 px-1.5 py-0.5 rounded min-w-[24px] text-center">2A</span>
                      <span className="text-xs">Bianual</span>
                    </div>
                  </div>
                </div>
                <div className="pt-2 border-t border-slate-200">
                  <p className="text-xs font-bold text-slate-700 mb-2">Estado:</p>
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded bg-yellow-400"></div>
                      <span className="text-xs">Asignado</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded bg-orange-500"></div>
                      <span className="text-xs">En curso</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded bg-green-500"></div>
                      <span className="text-xs">Realizado</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded bg-red-600"></div>
                      <span className="text-xs">No realizado</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded bg-slate-900"></div>
                      <span className="text-xs">Rechazado</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded border-2 border-slate-400 bg-white"></div>
                      <span className="text-xs">Planificada</span>
                    </div>
                  </div>
                </div>
                <div className="pt-2 border-t border-slate-200">
                  <p className="text-xs font-bold text-slate-700 mb-2">Tipo de personal:</p>
                  <div className="flex gap-2 flex-wrap">
                    <div className="px-2 py-1 bg-slate-200 text-slate-900 text-xs rounded font-bold">PP</div>
                    <div className="px-2 py-1 bg-slate-200 text-slate-900 text-xs rounded font-bold">EE</div>
                    <div className="px-2 py-1 bg-slate-200 text-slate-900 text-xs rounded font-bold">OCA</div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="p-5">
          <h3 className="text-base font-semibold text-slate-900 mb-1">Nivel de Embalse/Precipitación</h3>
          <p className="text-xs text-slate-500 mb-4">Sin datos. Año hidráulico en embalse</p>
          <p className="text-xs text-slate-500 mb-4">Desde: 01/10/2018 Hasta: 07/02/2020</p>
          <div className="flex items-center justify-center h-[220px] bg-slate-50 rounded border border-slate-200">
            <p className="text-slate-400 text-sm">Sin registros</p>
          </div>
        </Card>

        <Card className="p-5">
          <h3 className="text-base font-semibold text-slate-900 mb-1">Aportación Desembalse</h3>
          <p className="text-xs text-slate-500 mb-4">Sin datos. Año hidráulico en embalse</p>
          <p className="text-xs text-slate-500 mb-4">Desde: 01/10/2018 Hasta: 07/02/2020</p>
          <div className="flex items-center justify-center h-[220px] bg-slate-50 rounded border border-slate-200">
            <p className="text-slate-400 text-sm">Sin registros</p>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="p-5">
          <h3 className="text-base font-semibold text-slate-900 mb-4">Cronograma Preventivos</h3>
          <div className="bg-blue-100 border-l-4 border-blue-500 p-3 mb-4">
            <p className="text-sm font-semibold text-blue-900">Quincenas - Febrero</p>
            <p className="text-xs text-blue-700 mt-1">Vista de calendario de mantenimientos preventivos programados</p>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={mockMaintenanceByMonth}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="mes" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip contentStyle={{ fontSize: '11px' }} />
              <Legend wrapperStyle={{ fontSize: '11px' }} />
              <Bar dataKey="preventivo" fill="#3b82f6" name="Preventivos" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-5">
          <h3 className="text-base font-semibold text-slate-900 mb-4">Cronograma Correctivos</h3>
          <div className="bg-green-100 border-l-4 border-green-500 p-3 mb-4">
            <p className="text-sm font-semibold text-green-900">Mantenimientos Correctivos</p>
            <p className="text-xs text-green-700 mt-1">Vista de calendario de mantenimientos correctivos realizados</p>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={mockMaintenanceByMonth}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="mes" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip contentStyle={{ fontSize: '11px' }} />
              <Legend wrapperStyle={{ fontSize: '11px' }} />
              <Bar dataKey="correctivo" fill="#10b981" name="Correctivos" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <Card className="p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold text-slate-900">Incidencias</h3>
          <span className="text-sm text-slate-600 bg-slate-100 px-3 py-1 rounded-full">
            Fichas de mantenimientos: <span className="font-bold text-[#0066A1]">0</span>
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-slate-100 border-b-2 border-slate-300">
                <th className="text-left py-2 px-3 text-sm font-semibold text-slate-700">
                  Código
                </th>
                <th className="text-left py-2 px-3 text-sm font-semibold text-slate-700">
                  Nombre
                </th>
                <th className="text-left py-2 px-3 text-sm font-semibold text-slate-700">
                  Estado
                </th>
                <th className="text-left py-2 px-3 text-sm font-semibold text-slate-700">
                  Fecha Alta
                </th>
                <th className="text-left py-2 px-3 text-sm font-semibold text-slate-700">
                  Correctivo
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={5} className="text-center py-8 text-slate-500 text-sm bg-slate-50">
                  Sin registros.
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mt-3 flex items-center justify-between border-t border-slate-200 pt-3">
          <span className="text-xs text-slate-500">Mostrando 0 registros</span>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-600">Filas por página:</span>
            <select className="border border-slate-300 rounded px-2 py-1 text-xs">
              <option>5</option>
              <option>10</option>
              <option>25</option>
              <option>50</option>
            </select>
          </div>
        </div>
      </Card>
    </div>
  );
}
