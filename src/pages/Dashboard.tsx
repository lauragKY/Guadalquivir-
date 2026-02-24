import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  AlertTriangle,
  Activity,
  Droplet,
  Building2,
  Clock,
  CheckCircle,
  Bell,
  Package,
  Wrench,
  FolderOpen,
  TrendingUp,
  Box,
  ArrowRight,
} from 'lucide-react';
import { useDamSelection } from '../contexts/DamSelectionContext';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { StatusBadge } from '../components/ui/StatusBadge';
import { getDashboardStats, getActiveEmergencies, getAlertsFromSensors, getDams } from '../services/api';
import { Emergency, SensorReading, DashboardStats, Dam } from '../types';

export default function Dashboard() {
  const { selectedDam } = useDamSelection();
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [emergencies, setEmergencies] = useState<Emergency[]>([]);
  const [alerts, setAlerts] = useState<SensorReading[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!selectedDam) {
      navigate('/map');
    }
  }, [selectedDam, navigate]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [statsData, emergenciesData, alertsData] = await Promise.all([
        getDashboardStats(),
        getActiveEmergencies(),
        getAlertsFromSensors(),
      ]);
      setStats(statsData);
      setEmergencies(emergenciesData.slice(0, 3));
      setAlerts(alertsData.slice(0, 5));
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTimeSince = (timestamp: string) => {
    const minutes = Math.floor((Date.now() - new Date(timestamp).getTime()) / 60000);
    if (minutes < 60) return `Hace ${minutes} min`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `Hace ${hours} h`;
    const days = Math.floor(hours / 24);
    return `Hace ${days} d`;
  };

  const moduleCards = [
    {
      path: '/inventory',
      icon: Package,
      label: 'Inventario',
      description: 'Gestión de activos y elementos',
      color: 'from-blue-500 to-blue-600',
      bgLight: 'bg-blue-50',
      textColor: 'text-blue-700',
    },
    {
      path: '/maintenance',
      icon: Wrench,
      label: 'Mantenimiento',
      description: 'Planes y órdenes de trabajo',
      color: 'from-orange-500 to-orange-600',
      bgLight: 'bg-orange-50',
      textColor: 'text-orange-700',
    },
    {
      path: '/technical-archive',
      icon: FolderOpen,
      label: 'Archivo Técnico',
      description: 'Documentación y planos',
      color: 'from-purple-500 to-purple-600',
      bgLight: 'bg-purple-50',
      textColor: 'text-purple-700',
    },
    {
      path: '/auscultation',
      icon: Activity,
      label: 'Auscultación',
      description: 'Monitorización de sensores',
      color: 'from-green-500 to-green-600',
      bgLight: 'bg-green-50',
      textColor: 'text-green-700',
    },
    {
      path: '/exploitation',
      icon: TrendingUp,
      label: 'Explotación',
      description: 'Datos hidráulicos y operación',
      color: 'from-cyan-500 to-cyan-600',
      bgLight: 'bg-cyan-50',
      textColor: 'text-cyan-700',
    },
    {
      path: '/incidents',
      icon: AlertTriangle,
      label: 'Emergencias',
      description: 'Gestión de incidencias',
      color: 'from-red-500 to-red-600',
      bgLight: 'bg-red-50',
      textColor: 'text-red-700',
    },
    {
      path: '/bim',
      icon: Box,
      label: 'BIM',
      description: 'Modelos 3D y visualización',
      color: 'from-indigo-500 to-indigo-600',
      bgLight: 'bg-indigo-50',
      textColor: 'text-indigo-700',
    },
  ];

  if (!selectedDam) {
    return null;
  }

  if (loading || !stats) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Cargando dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header con información de la presa */}
      <div className="bg-gradient-to-r from-[#0066A1] to-[#004d7a] rounded-lg shadow-lg p-8 text-white">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <Building2 size={32} />
              <div>
                <h2 className="text-3xl font-bold">{selectedDam.code} - {selectedDam.name}</h2>
                <p className="text-blue-100 mt-1">{selectedDam.province} - {selectedDam.river}</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-6 mt-6">
              <div>
                <p className="text-blue-200 text-sm">Nivel Actual</p>
                <p className="text-2xl font-bold">{selectedDam.current_level}%</p>
              </div>
              <div>
                <p className="text-blue-200 text-sm">Estado Operacional</p>
                <div className="mt-1">
                  <StatusBadge status={selectedDam.operational_status} />
                </div>
              </div>
              <div>
                <p className="text-blue-200 text-sm">Capacidad</p>
                <p className="text-2xl font-bold">{selectedDam.capacity_hm3} hm³</p>
              </div>
            </div>
          </div>
          <div className="text-right bg-white/10 px-6 py-4 rounded-lg backdrop-blur-sm">
            <div className="flex items-center gap-2 justify-end mb-1">
              <Clock size={20} />
              <span className="text-2xl font-bold">
                {currentTime.toLocaleTimeString('es-ES')}
              </span>
            </div>
            <p className="text-xs text-blue-100">
              {currentTime.toLocaleDateString('es-ES', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </p>
          </div>
        </div>
      </div>

      {/* Tarjetas de acceso a módulos */}
      <div>
        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <span className="w-1 h-6 bg-[#0066A1] rounded"></span>
          Módulos de Gestión
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {moduleCards.map((module) => {
            const Icon = module.icon;
            return (
              <Link
                key={module.path}
                to={module.path}
                className="group relative overflow-hidden bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-[#0066A1] hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className={`absolute top-0 right-0 w-32 h-32 ${module.bgLight} rounded-full -mr-16 -mt-16 opacity-50 group-hover:opacity-100 transition-opacity`}></div>
                <div className="relative">
                  <div className={`inline-flex p-3 rounded-lg bg-gradient-to-br ${module.color} text-white mb-4 shadow-lg`}>
                    <Icon size={28} />
                  </div>
                  <h4 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-[#0066A1] transition-colors">
                    {module.label}
                  </h4>
                  <p className="text-sm text-gray-600 mb-4">
                    {module.description}
                  </p>
                  <div className="flex items-center text-[#0066A1] font-semibold text-sm group-hover:gap-2 transition-all">
                    <span>Acceder</span>
                    <ArrowRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Estado general del sistema */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border-2 border-[#0066A1] p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <Building2 className="w-8 h-8 text-[#0066A1]" />
            <span className="text-3xl font-bold text-[#0066A1]">{stats.totalDams}</span>
          </div>
          <h3 className="text-sm font-semibold text-gray-700">Presas Totales</h3>
          <p className="text-xs text-gray-600 mt-1">{stats.operationalDams} operativas</p>
        </div>

        <div className={`bg-white rounded-lg border-2 p-5 shadow-sm ${
          stats.criticalEmergencies > 0 ? 'border-red-500' : 'border-green-500'
        }`}>
          <div className="flex items-center justify-between mb-3">
            <AlertTriangle className={`w-8 h-8 ${stats.criticalEmergencies > 0 ? 'text-red-600' : 'text-green-600'}`} />
            <span className={`text-3xl font-bold ${stats.criticalEmergencies > 0 ? 'text-red-600' : 'text-green-600'}`}>
              {stats.activeEmergencies}
            </span>
          </div>
          <h3 className="text-sm font-semibold text-gray-700">Emergencias Activas</h3>
          <p className="text-xs text-gray-600 mt-1">
            {stats.criticalEmergencies > 0 ? `${stats.criticalEmergencies} críticas` : 'Sin emergencias críticas'}
          </p>
        </div>

        <div className={`bg-white rounded-lg border-2 p-5 shadow-sm ${
          stats.avgReservoirLevel > 80 ? 'border-green-500' :
          stats.avgReservoirLevel > 50 ? 'border-yellow-500' : 'border-red-500'
        }`}>
          <div className="flex items-center justify-between mb-3">
            <Droplet className={`w-8 h-8 ${
              stats.avgReservoirLevel > 80 ? 'text-green-600' :
              stats.avgReservoirLevel > 50 ? 'text-yellow-600' : 'text-red-600'
            }`} />
            <span className={`text-3xl font-bold ${
              stats.avgReservoirLevel > 80 ? 'text-green-600' :
              stats.avgReservoirLevel > 50 ? 'text-yellow-600' : 'text-red-600'
            }`}>
              {stats.avgReservoirLevel}%
            </span>
          </div>
          <h3 className="text-sm font-semibold text-gray-700">Nivel Medio Embalses</h3>
          <p className="text-xs text-gray-600 mt-1">Capacidad promedio</p>
        </div>

        <div className={`bg-white rounded-lg border-2 p-5 shadow-sm ${
          stats.sensorsInAlert > 0 ? 'border-yellow-500' : 'border-green-500'
        }`}>
          <div className="flex items-center justify-between mb-3">
            <Activity className={`w-8 h-8 ${stats.sensorsInAlert > 0 ? 'text-yellow-600' : 'text-green-600'}`} />
            <span className={`text-3xl font-bold ${stats.sensorsInAlert > 0 ? 'text-yellow-600' : 'text-green-600'}`}>
              {stats.totalSensors}
            </span>
          </div>
          <h3 className="text-sm font-semibold text-gray-700">Sensores Activos</h3>
          <p className="text-xs text-gray-600 mt-1">
            {stats.sensorsInAlert > 0 ? `${stats.sensorsInAlert} en alerta` : 'Todos operativos'}
          </p>
        </div>
      </div>

      {/* Alertas recientes y emergencias */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Emergencias Recientes</CardTitle>
              {emergencies.length > 0 && (
                <Link
                  to="/incidents"
                  className="text-sm font-medium text-blue-600 hover:text-blue-700"
                >
                  Ver todas →
                </Link>
              )}
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-slate-200">
              {emergencies.length === 0 ? (
                <div className="p-8 text-center">
                  <CheckCircle className="mx-auto text-green-500 mb-3" size={48} />
                  <p className="text-slate-600 font-medium">No hay emergencias activas</p>
                  <p className="text-sm text-slate-500 mt-1">
                    Todos los sistemas operan normalmente
                  </p>
                </div>
              ) : (
                emergencies.map((emergency) => (
                  <Link
                    key={emergency.id}
                    to={`/incidents?id=${emergency.id}`}
                    className="block p-4 hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-slate-900">{emergency.title}</h4>
                          <span className="text-xs text-slate-500">{emergency.code}</span>
                        </div>
                        <p className="text-sm text-slate-600 mb-2">
                          {emergency.dam?.name} - {emergency.dam?.province}
                        </p>
                      </div>
                      <span className="text-xs text-slate-500">
                        {getTimeSince(emergency.detected_at)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <StatusBadge status={emergency.severity} type="severity" />
                      <StatusBadge status={emergency.status} type="emergency" />
                    </div>
                  </Link>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Alertas de Sensores</CardTitle>
              {alerts.length > 0 && (
                <div className="flex items-center gap-1 px-2 py-1 bg-orange-50 text-orange-700 rounded-md border border-orange-200">
                  <Bell size={14} />
                  <span className="text-xs font-medium">{alerts.length}</span>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-slate-200 max-h-80 overflow-y-auto">
              {alerts.length === 0 ? (
                <div className="p-6 text-center">
                  <CheckCircle className="mx-auto text-green-500 mb-2" size={36} />
                  <p className="text-sm text-slate-600">Sin alertas activas</p>
                </div>
              ) : (
                alerts.map((alert) => (
                  <Link
                    key={alert.id}
                    to={`/auscultation?sensor=${alert.sensor_id}`}
                    className="block p-3 hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-slate-900">
                          {alert.sensor?.name}
                        </p>
                        <p className="text-xs text-slate-600 mt-1">
                          {alert.sensor?.dam?.name}
                        </p>
                      </div>
                      <StatusBadge status={alert.alert_level} type="alert" />
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500">
                        Valor: {alert.value.toFixed(2)} {alert.sensor?.unit}
                      </span>
                      <span className="text-slate-500">
                        {getTimeSince(alert.timestamp)}
                      </span>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
