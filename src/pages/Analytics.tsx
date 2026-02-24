import React from 'react';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { TrendingUp, TrendingDown, Activity, AlertTriangle } from 'lucide-react';
import { mockSensors, mockAlerts, mockIncidents } from '../data/mockData';

export default function Analytics() {
  const sensorsByType = mockSensors.reduce((acc, sensor) => {
    const type = sensor.type;
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const sensorTypeData = Object.entries(sensorsByType).map(([type, count]) => ({
    name: type === 'pressure' ? 'Presión' :
          type === 'water_level' ? 'Nivel' :
          type === 'seismic' ? 'Sísmico' :
          type === 'displacement' ? 'Desplazamiento' :
          type === 'temperature' ? 'Temperatura' : 'Caudal',
    value: count
  }));

  const alertsByMonth = [
    { month: 'Ene', critical: 2, high: 5, medium: 8 },
    { month: 'Feb', critical: 1, high: 4, medium: 6 },
    { month: 'Mar', critical: 3, high: 7, medium: 10 },
    { month: 'Abr', critical: 1, high: 3, medium: 5 },
    { month: 'May', critical: 2, high: 6, medium: 9 },
    { month: 'Jun', critical: 4, high: 8, medium: 12 }
  ];

  const incidentResolutionTime = [
    { category: '< 1h', count: 12 },
    { category: '1-4h', count: 8 },
    { category: '4-12h', count: 5 },
    { category: '12-24h', count: 3 },
    { category: '> 24h', count: 2 }
  ];

  const COLORS = ['#3b82f6', '#06b6d4', '#8b5cf6', '#f59e0b', '#10b981', '#ef4444'];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-slate-900">Análisis y Reportes</h2>
        <p className="text-slate-600 mt-1">Estadísticas y tendencias del sistema</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Activity className="text-blue-600" size={20} />
            </div>
            <TrendingUp className="text-green-500" size={20} />
          </div>
          <p className="text-sm text-slate-600">Total Sensores</p>
          <p className="text-3xl font-bold text-slate-900 mt-1">{mockSensors.length}</p>
          <p className="text-xs text-green-600 mt-2">+2 este mes</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <AlertTriangle className="text-orange-600" size={20} />
            </div>
            <TrendingDown className="text-green-500" size={20} />
          </div>
          <p className="text-sm text-slate-600">Alertas este mes</p>
          <p className="text-3xl font-bold text-slate-900 mt-1">24</p>
          <p className="text-xs text-green-600 mt-2">-15% vs mes anterior</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <AlertTriangle className="text-red-600" size={20} />
            </div>
            <TrendingUp className="text-red-500" size={20} />
          </div>
          <p className="text-sm text-slate-600">Incidentes Activos</p>
          <p className="text-3xl font-bold text-slate-900 mt-1">{mockIncidents.filter(i => i.status === 'active').length}</p>
          <p className="text-xs text-red-600 mt-2">Requieren atención</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Activity className="text-green-600" size={20} />
            </div>
            <TrendingUp className="text-green-500" size={20} />
          </div>
          <p className="text-sm text-slate-600">Disponibilidad</p>
          <p className="text-3xl font-bold text-slate-900 mt-1">98.5%</p>
          <p className="text-xs text-green-600 mt-2">Último mes</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold text-slate-900 mb-4">Alertas por Mes</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={alertsByMonth}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" stroke="#64748b" style={{ fontSize: '12px' }} />
              <YAxis stroke="#64748b" style={{ fontSize: '12px' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px'
                }}
              />
              <Legend />
              <Bar dataKey="critical" name="Críticas" fill="#ef4444" />
              <Bar dataKey="high" name="Altas" fill="#f97316" />
              <Bar dataKey="medium" name="Medias" fill="#fbbf24" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold text-slate-900 mb-4">Distribución de Sensores</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={sensorTypeData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {sensorTypeData.map((_entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold text-slate-900 mb-4">Tiempo de Resolución de Incidentes</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={incidentResolutionTime} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis type="number" stroke="#64748b" style={{ fontSize: '12px' }} />
              <YAxis dataKey="category" type="category" stroke="#64748b" style={{ fontSize: '12px' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px'
                }}
              />
              <Bar dataKey="count" name="Incidentes" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold text-slate-900 mb-4">Resumen de Estado</h3>
          <div className="space-y-4 mt-6">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-slate-600">Sensores Operacionales</span>
                <span className="text-sm font-medium text-slate-900">
                  {mockSensors.filter(s => s.status === 'operational').length} / {mockSensors.length}
                </span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full"
                  style={{
                    width: `${(mockSensors.filter(s => s.status === 'operational').length / mockSensors.length) * 100}%`
                  }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-slate-600">Incidentes Resueltos</span>
                <span className="text-sm font-medium text-slate-900">
                  {mockIncidents.filter(i => i.status === 'resolved' || i.status === 'closed').length} / {mockIncidents.length}
                </span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full"
                  style={{
                    width: `${(mockIncidents.filter(i => i.status === 'resolved' || i.status === 'closed').length / mockIncidents.length) * 100}%`
                  }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-slate-600">Alertas Confirmadas</span>
                <span className="text-sm font-medium text-slate-900">
                  {mockAlerts.filter(a => a.acknowledged).length} / {mockAlerts.length}
                </span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div
                  className="bg-orange-500 h-2 rounded-full"
                  style={{
                    width: `${(mockAlerts.filter(a => a.acknowledged).length / mockAlerts.length) * 100}%`
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
