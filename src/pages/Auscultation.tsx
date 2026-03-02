import { useState, useEffect } from 'react';
import { useDamSelection } from '../contexts/DamSelectionContext';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import {
  Activity,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Minus,
  Download,
  Upload,
  FileText,
  Calendar,
  Filter,
  CheckCircle
} from 'lucide-react';

interface Reading {
  id: string;
  device_code: string;
  device_type: string;
  location: string;
  parameter: string;
  value: number;
  unit: string;
  measured_at: string;
  status: 'normal' | 'warning' | 'alert';
  trend: 'up' | 'down' | 'stable';
}

export default function Auscultation() {
  const { selectedDam } = useDamSelection();
  const [activeTab, setActiveTab] = useState<'readings' | 'devices' | 'reports'>('readings');
  const [readings, setReadings] = useState<Reading[]>([]);
  const [loading, setLoading] = useState(false);

  const mockReadings: Reading[] = [
    {
      id: '1',
      device_code: 'PZ-01',
      device_type: 'Piezómetro',
      location: 'Cuerpo de presa - Margen izquierda',
      parameter: 'Nivel piezométrico',
      value: 345.67,
      unit: 'm.s.n.m',
      measured_at: new Date().toISOString(),
      status: 'normal',
      trend: 'stable'
    },
    {
      id: '2',
      device_code: 'INC-03',
      device_type: 'Inclinómetro',
      location: 'Corona de presa',
      parameter: 'Desplazamiento horizontal',
      value: 2.3,
      unit: 'mm',
      measured_at: new Date().toISOString(),
      status: 'warning',
      trend: 'up'
    },
    {
      id: '3',
      device_code: 'PND-05',
      device_type: 'Péndulo',
      location: 'Aliviadero',
      parameter: 'Desplazamiento radial',
      value: 1.8,
      unit: 'mm',
      measured_at: new Date().toISOString(),
      status: 'normal',
      trend: 'down'
    },
    {
      id: '4',
      device_code: 'AFO-02',
      device_type: 'Aforador',
      location: 'Drenaje margen derecha',
      parameter: 'Caudal de filtración',
      value: 15.4,
      unit: 'l/s',
      measured_at: new Date().toISOString(),
      status: 'normal',
      trend: 'stable'
    }
  ];

  useEffect(() => {
    if (selectedDam) {
      setReadings(mockReadings);
    } else {
      setReadings([]);
    }
  }, [selectedDam]);

  const getStatusColor = (status: Reading['status']) => {
    switch (status) {
      case 'normal': return 'bg-green-100 text-green-800 border-green-200';
      case 'warning': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'alert': return 'bg-red-100 text-red-800 border-red-200';
    }
  };

  const getStatusIcon = (status: Reading['status']) => {
    switch (status) {
      case 'normal': return CheckCircle;
      case 'warning': return AlertTriangle;
      case 'alert': return AlertTriangle;
    }
  };

  const getTrendIcon = (trend: Reading['trend']) => {
    switch (trend) {
      case 'up': return TrendingUp;
      case 'down': return TrendingDown;
      case 'stable': return Minus;
    }
  };

  const getTrendColor = (trend: Reading['trend']) => {
    switch (trend) {
      case 'up': return 'text-red-600';
      case 'down': return 'text-green-600';
      case 'stable': return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Auscultación</h1>
        <p className="mt-2 text-gray-600">
          {selectedDam ? `Instrumentación y monitorización - ${selectedDam.name}` : 'Seleccione una presa'}
        </p>
      </div>

      {!selectedDam ? (
        <Card className="p-8 text-center">
          <Activity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Seleccione una presa para ver los datos de auscultación</p>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Dispositivos Activos</p>
                  <p className="text-2xl font-bold text-gray-900">24</p>
                </div>
                <Activity className="w-8 h-8 text-blue-600" />
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Lecturas Hoy</p>
                  <p className="text-2xl font-bold text-gray-900">96</p>
                </div>
                <FileText className="w-8 h-8 text-green-600" />
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">En Alerta</p>
                  <p className="text-2xl font-bold text-yellow-600">1</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-yellow-600" />
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Estado General</p>
                  <p className="text-2xl font-bold text-green-600">Normal</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </Card>
          </div>

          <div className="flex gap-4 border-b border-gray-200">
            <button
              onClick={() => setActiveTab('readings')}
              className={`px-4 py-3 font-medium transition-colors ${
                activeTab === 'readings'
                  ? 'text-chg-blue border-b-2 border-chg-blue'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Activity className="w-4 h-4 inline mr-2" />
              Lecturas Recientes
            </button>
            <button
              onClick={() => setActiveTab('devices')}
              className={`px-4 py-3 font-medium transition-colors ${
                activeTab === 'devices'
                  ? 'text-chg-blue border-b-2 border-chg-blue'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Filter className="w-4 h-4 inline mr-2" />
              Dispositivos
            </button>
            <button
              onClick={() => setActiveTab('reports')}
              className={`px-4 py-3 font-medium transition-colors ${
                activeTab === 'reports'
                  ? 'text-chg-blue border-b-2 border-chg-blue'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <FileText className="w-4 h-4 inline mr-2" />
              Informes
            </button>
          </div>

          {activeTab === 'readings' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900">Últimas Lecturas</h2>
                <div className="flex gap-2">
                  <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
                    <Upload className="w-4 h-4" />
                    Importar Datos
                  </button>
                  <button className="px-4 py-2 bg-chg-blue text-white rounded-lg hover:bg-chg-blue-dark transition-colors flex items-center gap-2">
                    <Download className="w-4 h-4" />
                    Exportar
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {readings.map((reading) => {
                  const StatusIcon = getStatusIcon(reading.status);
                  const TrendIcon = getTrendIcon(reading.trend);

                  return (
                    <Card key={reading.id} className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-bold text-gray-900">{reading.device_code}</h3>
                            <Badge variant="default">{reading.device_type}</Badge>
                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(reading.status)}`}>
                              {reading.status === 'normal' ? 'Normal' : reading.status === 'warning' ? 'Advertencia' : 'Alerta'}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-3">{reading.location}</p>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-xs text-gray-500">Parámetro</p>
                              <p className="text-sm font-medium text-gray-900">{reading.parameter}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">Última medición</p>
                              <p className="text-sm font-medium text-gray-900">
                                {new Date(reading.measured_at).toLocaleString('es-ES')}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="text-right ml-6">
                          <div className="flex items-center gap-2 justify-end mb-2">
                            <StatusIcon className={`w-5 h-5 ${reading.status === 'normal' ? 'text-green-600' : reading.status === 'warning' ? 'text-yellow-600' : 'text-red-600'}`} />
                            <TrendIcon className={`w-5 h-5 ${getTrendColor(reading.trend)}`} />
                          </div>
                          <p className="text-3xl font-bold text-gray-900">{reading.value}</p>
                          <p className="text-sm text-gray-600">{reading.unit}</p>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'devices' && (
            <Card className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Inventario de Dispositivos</h2>
              <div className="text-center py-12 text-gray-500">
                <Activity className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                <p>Listado de dispositivos de auscultación</p>
              </div>
            </Card>
          )}

          {activeTab === 'reports' && (
            <Card className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Informes de Auscultación</h2>
              <div className="text-center py-12 text-gray-500">
                <FileText className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                <p>Informes periódicos y análisis de tendencias</p>
              </div>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
