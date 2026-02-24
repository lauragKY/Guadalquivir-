import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';
import { Activity, Calendar, Download, AlertCircle, Upload, FileSpreadsheet, Database, ExternalLink, History, Plus } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { mockSensors, generateSensorHistory } from '../data/mockData';
import { Sensor } from '../types';
import { getDams } from '../services/api';

type TabType = 'monitoring' | 'manual' | 'import' | 'history';

export default function Auscultation() {
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState<TabType>('monitoring');
  const [selectedSensor, setSelectedSensor] = useState<Sensor | null>(mockSensors[0] || null);
  const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d'>('24h');
  const [sensorData, setSensorData] = useState(mockSensors[0] ? generateSensorHistory(mockSensors[0].id, 24) : []);
  const [dams, setDams] = useState<any[]>([]);
  const [selectedDamId, setSelectedDamId] = useState<string>('');
  const [manualEntry, setManualEntry] = useState({
    sensor_id: '',
    reading_value: '',
    reading_date: new Date().toISOString().slice(0, 16),
    notes: ''
  });

  useEffect(() => {
    loadDams();
  }, []);

  useEffect(() => {
    const sensorId = searchParams.get('sensor');
    if (sensorId) {
      const sensor = mockSensors.find(s => s.id === sensorId);
      if (sensor) {
        setSelectedSensor(sensor);
        updateSensorData(sensor.id, timeRange);
      }
    }
  }, [searchParams]);

  const loadDams = async () => {
    try {
      const damsData = await getDams();
      setDams(damsData);
      if (damsData.length > 0 && !selectedDamId) {
        setSelectedDamId(damsData[0].id);
      }
    } catch (error) {
      console.error('Error loading dams:', error);
    }
  };

  const updateSensorData = (sensorId: string, range: '24h' | '7d' | '30d') => {
    const hours = range === '24h' ? 24 : range === '7d' ? 168 : 720;
    setSensorData(generateSensorHistory(sensorId, hours));
  };

  const handleSensorChange = (sensorId: string) => {
    const sensor = mockSensors.find(s => s.id === sensorId);
    if (sensor) {
      setSelectedSensor(sensor);
      updateSensorData(sensorId, timeRange);
    }
  };

  const handleTimeRangeChange = (range: '24h' | '7d' | '30d') => {
    setTimeRange(range);
    if (selectedSensor) {
      updateSensorData(selectedSensor.id, range);
    }
  };

  const chartData = sensorData.map(reading => ({
    time: reading.timestamp.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
      ...(timeRange !== '24h' ? { day: '2-digit', month: '2-digit' } : {})
    }),
    value: reading.value,
    warning: selectedSensor.threshold.warning,
    critical: selectedSensor.threshold.critical
  }));

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'operational': return 'text-green-600 bg-green-100';
      case 'warning': return 'text-orange-600 bg-orange-100';
      case 'critical': return 'text-red-600 bg-red-100';
      case 'offline': return 'text-slate-600 bg-slate-100';
      default: return 'text-slate-600 bg-slate-100';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'operational': return 'Operacional';
      case 'warning': return 'Advertencia';
      case 'critical': return 'Crítico';
      case 'offline': return 'Fuera de línea';
      default: return 'Desconocido';
    }
  };

  const getSensorTypeText = (type: string) => {
    const types: Record<string, string> = {
      pressure: 'Presión',
      water_level: 'Nivel de Agua',
      seismic: 'Sísmico',
      displacement: 'Desplazamiento',
      temperature: 'Temperatura',
      flow: 'Caudal'
    };
    return types[type] || type;
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Funcionalidad de guardado en desarrollo. Los datos se guardarán en la base de datos.');
  };

  const renderMonitoringTab = () => {
    if (mockSensors.length === 0) {
      return (
        <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200 text-center">
          <Activity size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay sensores disponibles</h3>
          <p className="text-gray-600">No se han configurado sensores para esta presa.</p>
        </div>
      );
    }

    if (!selectedSensor) {
      return (
        <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200 text-center">
          <Activity size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Seleccione un sensor</h3>
          <p className="text-gray-600">Por favor seleccione un sensor para ver sus lecturas.</p>
        </div>
      );
    }

    return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <h3 className="font-bold text-gray-900">Sensores Disponibles</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {mockSensors.map((sensor) => (
            <button
              key={sensor.id}
              onClick={() => handleSensorChange(sensor.id)}
              className={`w-full text-left p-4 hover:bg-gray-50 transition-colors ${
                selectedSensor?.id === sensor.id ? 'bg-blue-50' : ''
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-900">{sensor.id}</span>
                <div className={`w-2 h-2 rounded-full ${
                  sensor.status === 'operational' ? 'bg-green-500' :
                  sensor.status === 'warning' ? 'bg-orange-500' :
                  sensor.status === 'critical' ? 'bg-red-500' :
                  'bg-gray-400'
                }`}></div>
              </div>
              <p className="text-xs text-gray-600 mb-1">{sensor.name}</p>
              <p className="text-xs font-medium text-gray-900">
                {sensor.currentValue} {sensor.unit}
              </p>
            </button>
          ))}
        </div>
      </div>

      <div className="lg:col-span-3 space-y-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-start justify-between mb-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-2xl font-bold text-gray-900">{selectedSensor.name}</h3>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedSensor.status)}`}>
                  {getStatusText(selectedSensor.status)}
                </span>
              </div>
              <p className="text-gray-600">
                {getSensorTypeText(selectedSensor.type)} - {selectedSensor.location.zone}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <Download size={20} className="text-gray-600" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-600 mb-1">Valor Actual</p>
              <p className="text-2xl font-bold text-gray-900">
                {selectedSensor.currentValue} <span className="text-sm font-normal text-gray-600">{selectedSensor.unit}</span>
              </p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-600 mb-1">Umbral Normal</p>
              <p className="text-lg font-bold text-gray-900">
                {selectedSensor.threshold.min} - {selectedSensor.threshold.max} <span className="text-xs font-normal text-gray-600">{selectedSensor.unit}</span>
              </p>
            </div>
            <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
              <p className="text-xs text-orange-600 mb-1">Advertencia</p>
              <p className="text-lg font-bold text-orange-700">
                {selectedSensor.threshold.warning} <span className="text-xs font-normal text-orange-600">{selectedSensor.unit}</span>
              </p>
            </div>
            <div className="p-4 bg-red-50 rounded-lg border border-red-200">
              <p className="text-xs text-red-600 mb-1">Crítico</p>
              <p className="text-lg font-bold text-red-700">
                {selectedSensor.threshold.critical} <span className="text-xs font-normal text-red-600">{selectedSensor.unit}</span>
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h4 className="text-lg font-bold text-gray-900">Histórico de Mediciones</h4>
            <div className="flex items-center gap-2">
              <Calendar size={18} className="text-gray-600" />
              <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
                {(['24h', '7d', '30d'] as const).map((range) => (
                  <button
                    key={range}
                    onClick={() => handleTimeRangeChange(range)}
                    className={`px-4 py-1.5 text-sm font-medium rounded transition-colors ${
                      timeRange === range
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {range === '24h' ? '24 Horas' : range === '7d' ? '7 Días' : '30 Días'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis
                dataKey="time"
                stroke="#64748b"
                style={{ fontSize: '12px' }}
                interval="preserveStartEnd"
              />
              <YAxis
                stroke="#64748b"
                style={{ fontSize: '12px' }}
                label={{ value: selectedSensor.unit, angle: -90, position: 'insideLeft', style: { fontSize: '12px' } }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                }}
              />
              <Legend />
              <ReferenceLine
                y={selectedSensor.threshold.warning}
                stroke="#f97316"
                strokeDasharray="5 5"
                label={{ value: 'Advertencia', position: 'right', fill: '#f97316', fontSize: 12 }}
              />
              <ReferenceLine
                y={selectedSensor.threshold.critical}
                stroke="#ef4444"
                strokeDasharray="5 5"
                label={{ value: 'Crítico', position: 'right', fill: '#ef4444', fontSize: 12 }}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#3b82f6"
                strokeWidth={2}
                fill="url(#colorValue)"
                name={`${getSensorTypeText(selectedSensor.type)} (${selectedSensor.unit})`}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
    );
  };

  const renderManualEntryTab = () => (
    <Card>
      <div className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <Plus className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">Inserción Manual de Lecturas</h3>
            <p className="text-sm text-gray-600">Registre mediciones individuales de forma manual</p>
          </div>
        </div>

        <form onSubmit={handleManualSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Presa</label>
              <select
                value={selectedDamId}
                onChange={(e) => setSelectedDamId(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Seleccione una presa</option>
                {dams.map((dam) => (
                  <option key={dam.id} value={dam.id}>
                    {dam.code} - {dam.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Sensor</label>
              <select
                value={manualEntry.sensor_id}
                onChange={(e) => setManualEntry({ ...manualEntry, sensor_id: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Seleccione un sensor</option>
                {mockSensors.map((sensor) => (
                  <option key={sensor.id} value={sensor.id}>
                    {sensor.id} - {sensor.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Valor de Lectura</label>
              <input
                type="number"
                step="0.01"
                value={manualEntry.reading_value}
                onChange={(e) => setManualEntry({ ...manualEntry, reading_value: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ingrese el valor"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Fecha y Hora</label>
              <input
                type="datetime-local"
                value={manualEntry.reading_date}
                onChange={(e) => setManualEntry({ ...manualEntry, reading_date: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Observaciones</label>
            <textarea
              value={manualEntry.notes}
              onChange={(e) => setManualEntry({ ...manualEntry, notes: e.target.value })}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ingrese cualquier observación relevante..."
            />
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              onClick={() => setManualEntry({ sensor_id: '', reading_value: '', reading_date: new Date().toISOString().slice(0, 16), notes: '' })}
            >
              Limpiar
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Guardar Lectura
            </button>
          </div>
        </form>
      </div>
    </Card>
  );

  const renderImportTab = () => (
    <div className="space-y-6">
      <Card>
        <div className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <FileSpreadsheet className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Importación Masiva desde Excel</h3>
              <p className="text-sm text-gray-600">Cargue múltiples lecturas desde un archivo Excel</p>
            </div>
          </div>

          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors cursor-pointer">
            <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-sm font-medium text-gray-900 mb-1">
              Arrastre su archivo Excel aquí o haga clic para seleccionar
            </p>
            <p className="text-xs text-gray-500 mb-4">
              Formatos soportados: .xlsx, .xls (máximo 10MB)
            </p>
            <input
              type="file"
              accept=".xlsx,.xls"
              className="hidden"
              id="excel-upload"
            />
            <label
              htmlFor="excel-upload"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer transition-colors"
            >
              <Upload className="h-4 w-4 mr-2" />
              Seleccionar Archivo
            </label>
          </div>

          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex gap-3">
              <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-2">Formato del archivo Excel:</p>
                <ul className="list-disc list-inside space-y-1 text-xs">
                  <li>Columna A: ID del Sensor</li>
                  <li>Columna B: Valor de Lectura</li>
                  <li>Columna C: Fecha y Hora (formato: YYYY-MM-DD HH:MM:SS)</li>
                  <li>Columna D: Observaciones (opcional)</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <Card>
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <Database className="h-5 w-5 text-blue-600" />
            <h4 className="font-semibold text-gray-900">Integración con Damdata</h4>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            Acceda al sistema especializado de auscultación Damdata para la gestión avanzada de sensores y lecturas en tiempo real.
          </p>
          <a
            href="#"
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <ExternalLink className="h-4 w-4" />
            Abrir Damdata
          </a>
          <p className="text-xs text-gray-500 mt-3">
            Nota: Los cambios en el inventario de sensores realizados en Damdata se sincronizarán automáticamente con SIPRESAS.
          </p>
        </div>
      </Card>
    </div>
  );

  const renderHistoryTab = () => (
    <Card>
      <div className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
            <History className="h-6 w-6 text-purple-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">Historial de Importaciones</h3>
            <p className="text-sm text-gray-600">Consulte el registro de cargas masivas realizadas</p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <FileSpreadsheet className="h-5 w-5 text-green-600" />
                <span className="font-medium text-gray-900">lecturas_enero_2024.xlsx</span>
              </div>
              <Badge variant="success">Completado</Badge>
            </div>
            <div className="grid grid-cols-4 gap-4 text-sm text-gray-600">
              <div>
                <span className="text-xs text-gray-500">Fecha:</span>
                <p className="font-medium">15/01/2024 10:30</p>
              </div>
              <div>
                <span className="text-xs text-gray-500">Registros:</span>
                <p className="font-medium">1,234 exitosos</p>
              </div>
              <div>
                <span className="text-xs text-gray-500">Fallidos:</span>
                <p className="font-medium">0</p>
              </div>
              <div>
                <span className="text-xs text-gray-500">Usuario:</span>
                <p className="font-medium">Juan Pérez</p>
              </div>
            </div>
          </div>

          <div className="text-center py-8 text-gray-500">
            <History className="h-12 w-12 mx-auto mb-3 text-gray-400" />
            <p>No hay más registros de importación</p>
          </div>
        </div>
      </div>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Activity className="h-7 w-7 text-blue-600" />
            Auscultación y Monitoreo
          </h2>
          <p className="text-gray-600 mt-1">
            Control de comportamiento de presas mediante medición de sensores
          </p>
        </div>
      </div>

      <div className="border-b border-gray-200">
        <nav className="flex gap-1">
          <button
            onClick={() => setActiveTab('monitoring')}
            className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'monitoring'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Monitoreo
            </div>
          </button>
          <button
            onClick={() => setActiveTab('manual')}
            className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'manual'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <div className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Inserción Manual
            </div>
          </button>
          <button
            onClick={() => setActiveTab('import')}
            className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'import'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <div className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              Importación
            </div>
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'history'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <div className="flex items-center gap-2">
              <History className="h-4 w-4" />
              Historial
            </div>
          </button>
        </nav>
      </div>

      <div>
        {activeTab === 'monitoring' && renderMonitoringTab()}
        {activeTab === 'manual' && renderManualEntryTab()}
        {activeTab === 'import' && renderImportTab()}
        {activeTab === 'history' && renderHistoryTab()}
      </div>
    </div>
  );
}
