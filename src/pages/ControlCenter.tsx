import { useState, useEffect } from 'react';
import { useDamSelection } from '../contexts/DamSelectionContext';
import { supabase } from '../lib/supabase';
import { Card } from '../components/ui/Card';
import { StatusBadge } from '../components/ui/StatusBadge';
import {
  AlertTriangle,
  Droplet,
  Activity,
  Bell,
  Wrench,
  TrendingUp,
  Clock,
  MapPin
} from 'lucide-react';

interface ControlCenterData {
  damStatus: string;
  waterLevel: number;
  capacityHm3: number;
  maxContribution48h: number;
  spillwayStatus: string;
  sirenStatus: string;
  lastMaintenance: string;
  criticalIndicators: Array<{ sensor: string; value: number; threshold: number }>;
  activeAlerts: Array<{ type: string; message: string; timestamp: Date }>;
}

export default function ControlCenter() {
  const { selectedDam } = useDamSelection();
  const [controlData, setControlData] = useState<ControlCenterData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (selectedDam) {
      loadControlCenterData();
    } else {
      setLoading(false);
      setControlData(null);
    }
  }, [selectedDam]);

  const loadControlCenterData = async () => {
    if (!selectedDam) return;

    setLoading(true);
    try {
      const [
        { data: maintenanceData },
        { data: alertsData },
        { data: spillwayData },
        { data: sirenData }
      ] = await Promise.all([
        supabase
          .from('maintenance_operations')
          .select('scheduled_date')
          .eq('dam_id', selectedDam.id)
          .eq('status', 'completed')
          .order('scheduled_date', { ascending: false })
          .limit(1)
          .maybeSingle(),
        supabase
          .from('emergency_situations')
          .select('id, situation_type, declared_at')
          .eq('dam_id', selectedDam.id)
          .eq('status', 'active')
          .order('declared_at', { ascending: false }),
        supabase
          .from('spillway_gates')
          .select('operational_status')
          .eq('dam_id', selectedDam.id)
          .limit(1)
          .maybeSingle(),
        supabase
          .from('warning_sirens')
          .select('operational_status')
          .eq('dam_id', selectedDam.id)
          .limit(1)
          .maybeSingle()
      ]);

      const activeAlerts = (alertsData || []).map((alert: any) => ({
        type: alert.situation_type,
        message: `Situación ${alert.situation_type} activa`,
        timestamp: new Date(alert.declared_at)
      }));

      const mockCriticalIndicators = [
        { sensor: 'PZ-001', value: 42.5, threshold: 45.0 },
        { sensor: 'INC-003', value: 3.2, threshold: 5.0 },
        { sensor: 'ACE-002', value: 8.5, threshold: 10.0 }
      ];

      const newControlData = {
        damStatus: selectedDam.operational_status || 'normal',
        waterLevel: selectedDam.current_level || 0,
        capacityHm3: selectedDam.capacity_hm3 || 0,
        maxContribution48h: 125.5,
        spillwayStatus: spillwayData?.operational_status || 'closed',
        sirenStatus: sirenData?.operational_status || 'operational',
        lastMaintenance: maintenanceData?.scheduled_date
          ? new Date(maintenanceData.scheduled_date).toLocaleDateString('es-ES')
          : 'No disponible',
        criticalIndicators: mockCriticalIndicators,
        activeAlerts
      };

      console.log('Control Center Data loaded:', newControlData);
      setControlData(newControlData);
    } catch (error) {
      console.error('Error loading control center data:', error);
      setControlData(null);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'normal': return 'bg-green-100 text-green-800';
      case 'warning': return 'bg-orange-100 text-orange-800';
      case 'extraordinary': return 'bg-orange-100 text-orange-800';
      case 'emergency_0': return 'bg-red-100 text-red-800';
      case 'emergency_1': return 'bg-red-100 text-red-800';
      case 'emergency_2': return 'bg-red-100 text-red-800';
      case 'emergency_3': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status.toLowerCase()) {
      case 'normal': return 'Normal';
      case 'warning': return 'Advertencia';
      case 'extraordinary': return 'Extraordinaria';
      case 'emergency_0': return 'Escenario 0';
      case 'emergency_1': return 'Escenario 1';
      case 'emergency_2': return 'Escenario 2';
      case 'emergency_3': return 'Escenario 3';
      default: return status;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <div className="h-8 w-96 bg-gray-200 rounded animate-pulse mb-2"></div>
            <div className="h-4 w-64 bg-gray-200 rounded animate-pulse"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="animate-pulse">
                <div className="p-6">
                  <div className="w-12 h-12 bg-gray-200 rounded-lg mb-4"></div>
                  <div className="h-4 w-24 bg-gray-200 rounded mb-2"></div>
                  <div className="h-8 w-32 bg-gray-200 rounded"></div>
                </div>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="animate-pulse">
                <div className="p-6">
                  <div className="h-6 w-48 bg-gray-200 rounded mb-4"></div>
                  <div className="space-y-3">
                    <div className="h-16 bg-gray-200 rounded"></div>
                    <div className="h-16 bg-gray-200 rounded"></div>
                    <div className="h-16 bg-gray-200 rounded"></div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!selectedDam || !controlData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <MapPin size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Seleccione una presa</h3>
          <p className="text-gray-600">Por favor seleccione una presa para ver el centro de control.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Centro de Control Integral</h1>
              <p className="text-gray-600">Vista ejecutiva consolidada de {selectedDam.name}</p>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500">Última actualización</div>
              <div className="text-lg font-semibold text-gray-900">
                {new Date().toLocaleTimeString('es-ES')}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <Card className="bg-gradient-to-br from-blue-50 to-white border-blue-200">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="h-6 w-6 text-blue-600" />
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(controlData.damStatus)}`}>
                  {getStatusText(controlData.damStatus)}
                </span>
              </div>
              <h3 className="text-sm font-medium text-gray-600 mb-1">Estado Global</h3>
              <p className="text-2xl font-bold text-gray-900">
                {getStatusText(controlData.damStatus)}
              </p>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-cyan-50 to-white border-cyan-200">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-cyan-100 rounded-lg flex items-center justify-center">
                  <Droplet className="h-6 w-6 text-cyan-600" />
                </div>
              </div>
              <h3 className="text-sm font-medium text-gray-600 mb-1">Nivel Actual</h3>
              <p className="text-2xl font-bold text-gray-900">
                {controlData.waterLevel.toFixed(2)} m
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Capacidad: {controlData.capacityHm3.toFixed(0)} hm³
              </p>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-indigo-50 to-white border-indigo-200">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-indigo-600" />
                </div>
              </div>
              <h3 className="text-sm font-medium text-gray-600 mb-1">Aportación 48h</h3>
              <p className="text-2xl font-bold text-gray-900">
                {controlData.maxContribution48h} m³/s
              </p>
              <p className="text-xs text-gray-500 mt-1">Máxima registrada</p>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-amber-50 to-white border-amber-200">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                  <Bell className="h-6 w-6 text-amber-600" />
                </div>
              </div>
              <h3 className="text-sm font-medium text-gray-600 mb-1">Alertas Activas</h3>
              <p className="text-2xl font-bold text-gray-900">
                {controlData.activeAlerts.length}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {controlData.activeAlerts.length === 0 ? 'Sistema normal' : 'Requieren atención'}
              </p>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <Card>
            <div className="p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Activity className="h-5 w-5 text-blue-600" />
                Estado de Órganos de Desagüe
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">Compuertas de Aliviadero</p>
                    <p className="text-sm text-gray-600">Estado operacional</p>
                  </div>
                  <StatusBadge status={controlData.spillwayStatus} />
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">Desagüe de Fondo</p>
                    <p className="text-sm text-gray-600">Estado operacional</p>
                  </div>
                  <StatusBadge status="closed" />
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">Tomas de Agua</p>
                    <p className="text-sm text-gray-600">Estado operacional</p>
                  </div>
                  <StatusBadge status="operational" />
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <div className="p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Bell className="h-5 w-5 text-blue-600" />
                Estado de Sirenas
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">Sistema de Sirenas</p>
                    <p className="text-sm text-gray-600">Estado general del sistema</p>
                  </div>
                  <StatusBadge status={controlData.sirenStatus} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                    <p className="text-xs text-green-600 font-medium mb-1">Operativas</p>
                    <p className="text-2xl font-bold text-green-700">4</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-xs text-gray-600 font-medium mb-1">En mantenimiento</p>
                    <p className="text-2xl font-bold text-gray-700">0</p>
                  </div>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-xs text-blue-600 font-medium mb-1">Última prueba</p>
                  <p className="text-sm font-semibold text-blue-900">
                    {new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toLocaleDateString('es-ES')}
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <div className="p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Wrench className="h-5 w-5 text-blue-600" />
                Última Inspección de Mantenimiento
              </h3>
              <div className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-lg border border-gray-200">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                    <Clock className="h-8 w-8 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Fecha de última inspección</p>
                    <p className="text-2xl font-bold text-gray-900">{controlData.lastMaintenance}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="p-3 bg-green-50 rounded-lg">
                    <p className="text-xs text-green-600 font-medium mb-1">Inspecciones OK</p>
                    <p className="text-xl font-bold text-green-700">12</p>
                  </div>
                  <div className="p-3 bg-amber-50 rounded-lg">
                    <p className="text-xs text-amber-600 font-medium mb-1">Pendientes</p>
                    <p className="text-xl font-bold text-amber-700">2</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <div className="p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Activity className="h-5 w-5 text-blue-600" />
                Indicadores Críticos de Auscultación
              </h3>
              <div className="space-y-3">
                {controlData.criticalIndicators.map((indicator, index) => {
                  const percentage = (indicator.value / indicator.threshold) * 100;
                  const isWarning = percentage > 80;

                  return (
                    <div key={index} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-gray-900">{indicator.sensor}</span>
                        <span className={`text-sm font-semibold ${isWarning ? 'text-orange-600' : 'text-green-600'}`}>
                          {indicator.value} / {indicator.threshold}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all ${isWarning ? 'bg-orange-500' : 'bg-green-500'}`}
                          style={{ width: `${Math.min(percentage, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </Card>
        </div>

        {controlData.activeAlerts.length > 0 && (
          <Card className="mt-6 border-red-200 bg-red-50">
            <div className="p-6">
              <h3 className="text-lg font-bold text-red-900 mb-4 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                Alertas Activas
              </h3>
              <div className="space-y-3">
                {controlData.activeAlerts.map((alert, index) => (
                  <div key={index} className="flex items-start gap-3 p-4 bg-white rounded-lg border border-red-200">
                    <Bell className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{alert.message}</p>
                      <p className="text-sm text-gray-600 mt-1">
                        {alert.timestamp.toLocaleString('es-ES')}
                      </p>
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800">
                      {alert.type}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
