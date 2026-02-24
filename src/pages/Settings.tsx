import React, { useState } from 'react';
import { Save, Bell, Shield, Database, Users, Mail } from 'lucide-react';
import { mockSensors } from '../data/mockData';

export default function Settings() {
  const [activeTab, setActiveTab] = useState<'alerts' | 'sensors' | 'notifications' | 'security'>('alerts');
  const [showSaved, setShowSaved] = useState(false);

  const handleSave = () => {
    setShowSaved(true);
    setTimeout(() => setShowSaved(false), 3000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-slate-900">Configuración del Sistema</h2>
        <p className="text-slate-600 mt-1">Ajustes de umbrales, alertas y notificaciones</p>
      </div>

      {showSaved && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
          <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
            <Save className="text-white" size={16} />
          </div>
          <div>
            <p className="font-medium text-green-900">Configuración guardada</p>
            <p className="text-sm text-green-700">Los cambios se han aplicado correctamente</p>
          </div>
        </div>
      )}

      <div className="flex gap-2 border-b border-slate-200">
        {[
          { id: 'alerts', label: 'Umbrales de Alerta', icon: Bell },
          { id: 'sensors', label: 'Sensores', icon: Database },
          { id: 'notifications', label: 'Notificaciones', icon: Mail },
          { id: 'security', label: 'Seguridad', icon: Shield }
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-3 font-medium transition-colors border-b-2 ${
                activeTab === tab.id
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <Icon size={18} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {activeTab === 'alerts' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Configuración de Umbrales</h3>
            <p className="text-sm text-slate-600 mb-6">
              Define los valores de advertencia y críticos para cada tipo de sensor
            </p>
            <div className="space-y-4">
              {mockSensors.map((sensor) => (
                <div key={sensor.id} className="p-4 bg-slate-50 rounded-lg">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-semibold text-slate-900">{sensor.name}</h4>
                      <p className="text-sm text-slate-600">{sensor.id}</p>
                    </div>
                    <span className="text-sm px-2 py-1 bg-white rounded border border-slate-200">
                      {sensor.unit}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div>
                      <label className="block text-xs text-slate-600 mb-1">Mínimo</label>
                      <input
                        type="number"
                        defaultValue={sensor.threshold.min}
                        className="w-full px-3 py-2 text-sm border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-600 mb-1">Máximo</label>
                      <input
                        type="number"
                        defaultValue={sensor.threshold.max}
                        className="w-full px-3 py-2 text-sm border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-orange-600 mb-1">Advertencia</label>
                      <input
                        type="number"
                        defaultValue={sensor.threshold.warning}
                        className="w-full px-3 py-2 text-sm border border-orange-300 bg-orange-50 rounded focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-red-600 mb-1">Crítico</label>
                      <input
                        type="number"
                        defaultValue={sensor.threshold.critical}
                        className="w-full px-3 py-2 text-sm border border-red-300 bg-red-50 rounded focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'sensors' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Gestión de Sensores</h3>
            <div className="space-y-4">
              {mockSensors.map((sensor) => (
                <div key={sensor.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className={`w-3 h-3 rounded-full ${
                      sensor.status === 'operational' ? 'bg-green-500' :
                      sensor.status === 'warning' ? 'bg-orange-500' :
                      sensor.status === 'critical' ? 'bg-red-500' :
                      'bg-slate-400'
                    }`}></div>
                    <div>
                      <p className="font-semibold text-slate-900">{sensor.name}</p>
                      <p className="text-sm text-slate-600">{sensor.id} - {sensor.location.zone}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                      Calibrar
                    </button>
                    <button className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                      Configurar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'notifications' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Configuración de Notificaciones</h3>
            <div className="space-y-6">
              <div>
                <h4 className="font-semibold text-slate-900 mb-3">Alertas por Email</h4>
                <div className="space-y-3">
                  <label className="flex items-center gap-3">
                    <input type="checkbox" defaultChecked className="w-4 h-4 text-blue-600" />
                    <span className="text-sm text-slate-700">Alertas críticas</span>
                  </label>
                  <label className="flex items-center gap-3">
                    <input type="checkbox" defaultChecked className="w-4 h-4 text-blue-600" />
                    <span className="text-sm text-slate-700">Alertas de alta prioridad</span>
                  </label>
                  <label className="flex items-center gap-3">
                    <input type="checkbox" className="w-4 h-4 text-blue-600" />
                    <span className="text-sm text-slate-700">Alertas de prioridad media</span>
                  </label>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-slate-900 mb-3">Destinatarios</h4>
                <div className="space-y-2">
                  <input
                    type="email"
                    placeholder="operador@presa.com"
                    defaultValue="operador@presa.com"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <input
                    type="email"
                    placeholder="supervisor@presa.com"
                    defaultValue="supervisor@presa.com"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                    + Agregar destinatario
                  </button>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-slate-900 mb-3">Frecuencia de Reportes</h4>
                <select className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option>Diario</option>
                  <option>Semanal</option>
                  <option>Mensual</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'security' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Configuración de Seguridad</h3>
            <div className="space-y-6">
              <div>
                <h4 className="font-semibold text-slate-900 mb-3">Gestión de Usuarios</h4>
                <div className="space-y-3">
                  {['Operador Principal', 'Supervisor Técnico', 'Técnico de Mantenimiento'].map((user, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Users size={20} className="text-slate-400" />
                        <div>
                          <p className="font-medium text-slate-900">{user}</p>
                          <p className="text-xs text-slate-500">Último acceso: hace {index + 1}h</p>
                        </div>
                      </div>
                      <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                        Editar permisos
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-slate-900 mb-3">Registro de Auditoría</h4>
                <label className="flex items-center gap-3">
                  <input type="checkbox" defaultChecked className="w-4 h-4 text-blue-600" />
                  <span className="text-sm text-slate-700">Registrar todas las acciones del usuario</span>
                </label>
              </div>

              <div>
                <h4 className="font-semibold text-slate-900 mb-3">Sesiones</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Tiempo de sesión inactiva:</span>
                    <span className="font-medium text-slate-900">30 minutos</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Sesiones activas:</span>
                    <span className="font-medium text-slate-900">3</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-end gap-3">
        <button className="px-6 py-2 text-slate-600 font-medium hover:bg-slate-100 rounded-lg transition-colors">
          Cancelar
        </button>
        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Save size={18} />
          Guardar Cambios
        </button>
      </div>
    </div>
  );
}
