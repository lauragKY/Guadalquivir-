import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  AlertTriangle,
  Clock,
  MapPin,
  User,
  FileText,
  Filter,
  Search,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { StatusBadge } from '../components/ui/StatusBadge';
import { getEmergencies } from '../services/api';
import { Emergency, EmergencySeverity, EmergencyStatus } from '../types';

export default function Incidents() {
  const [searchParams] = useSearchParams();
  const [emergencies, setEmergencies] = useState<Emergency[]>([]);
  const [filteredEmergencies, setFilteredEmergencies] = useState<Emergency[]>([]);
  const [selectedEmergency, setSelectedEmergency] = useState<Emergency | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [severityFilter, setSeverityFilter] = useState<EmergencySeverity | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<EmergencyStatus | 'all'>('all');

  useEffect(() => {
    loadEmergencies();
  }, []);

  useEffect(() => {
    const id = searchParams.get('id');
    if (id && emergencies.length > 0) {
      const emergency = emergencies.find((e) => e.id === id);
      if (emergency) {
        setSelectedEmergency(emergency);
      }
    }
  }, [searchParams, emergencies]);

  useEffect(() => {
    filterEmergencies();
  }, [emergencies, searchTerm, severityFilter, statusFilter]);

  const loadEmergencies = async () => {
    try {
      setLoading(true);
      const data = await getEmergencies();
      setEmergencies(data);
      setFilteredEmergencies(data);
    } catch (error) {
      console.error('Error loading emergencies:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterEmergencies = () => {
    let filtered = emergencies;

    if (searchTerm) {
      filtered = filtered.filter(
        (e) =>
          e.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          e.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
          e.dam?.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (severityFilter !== 'all') {
      filtered = filtered.filter((e) => e.severity === severityFilter);
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter((e) => e.status === statusFilter);
    }

    setFilteredEmergencies(filtered);
  };

  const getEmergencyTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      structural: 'Estructural',
      hydrological: 'Hidrológica',
      seismic: 'Sísmica',
      operational: 'Operacional',
      environmental: 'Ambiental',
    };
    return labels[type] || type;
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Cargando emergencias...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-slate-900">Gestión de Emergencias</h2>
        <p className="text-slate-600 mt-1">
          Monitorización y gestión del ciclo completo de emergencias
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Filtros</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Buscar
                </label>
                <div className="relative">
                  <Search
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    size={18}
                  />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Código, título o presa..."
                    className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Severidad
                </label>
                <select
                  value={severityFilter}
                  onChange={(e) =>
                    setSeverityFilter(e.target.value as EmergencySeverity | 'all')
                  }
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">Todas</option>
                  <option value="critical">Crítica</option>
                  <option value="high">Alta</option>
                  <option value="medium">Media</option>
                  <option value="low">Baja</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Estado
                </label>
                <select
                  value={statusFilter}
                  onChange={(e) =>
                    setStatusFilter(e.target.value as EmergencyStatus | 'all')
                  }
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">Todos</option>
                  <option value="detection">Detección</option>
                  <option value="evaluation">Evaluación</option>
                  <option value="activation">Activación</option>
                  <option value="management">Gestión</option>
                  <option value="resolution">Resolución</option>
                  <option value="closed">Cerrada</option>
                </select>
              </div>

              <div className="pt-4 border-t border-slate-200">
                <p className="text-sm text-slate-600">
                  <span className="font-medium">{filteredEmergencies.length}</span> de{' '}
                  <span className="font-medium">{emergencies.length}</span> emergencias
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-4">
          {filteredEmergencies.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <AlertTriangle className="mx-auto text-slate-300 mb-3" size={48} />
                <p className="text-slate-600 font-medium">
                  No se encontraron emergencias
                </p>
                <p className="text-sm text-slate-500 mt-1">
                  Intenta ajustar los filtros de búsqueda
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredEmergencies.map((emergency) => (
              <Card
                key={emergency.id}
                onClick={() => setSelectedEmergency(emergency)}
                className="cursor-pointer"
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-semibold text-slate-900">
                          {emergency.title}
                        </h3>
                        <span className="text-sm text-slate-500">{emergency.code}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-600 mb-3">
                        <MapPin size={14} />
                        <span>
                          {emergency.dam?.name} - {emergency.dam?.province}
                        </span>
                      </div>
                      {emergency.description && (
                        <p className="text-sm text-slate-600 mb-3">
                          {emergency.description}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mb-3">
                    <StatusBadge status={emergency.severity} type="severity" />
                    <StatusBadge status={emergency.status} type="emergency" />
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                      {getEmergencyTypeLabel(emergency.emergency_type)}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-slate-500">
                    <div className="flex items-center gap-1">
                      <Clock size={12} />
                      <span>Detectada: {formatDate(emergency.detected_at)}</span>
                    </div>
                    {emergency.responsible && (
                      <div className="flex items-center gap-1">
                        <User size={12} />
                        <span>{emergency.responsible.full_name}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>

      {selectedEmergency && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200 sticky top-0 bg-white">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-1">
                    {selectedEmergency.title}
                  </h3>
                  <p className="text-slate-600">{selectedEmergency.code}</p>
                </div>
                <button
                  onClick={() => setSelectedEmergency(null)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <h4 className="text-sm font-medium text-slate-700 mb-2">Estado Actual</h4>
                <div className="flex items-center gap-2">
                  <StatusBadge status={selectedEmergency.severity} type="severity" />
                  <StatusBadge status={selectedEmergency.status} type="emergency" />
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-slate-700 mb-2">Presa Afectada</h4>
                <div className="p-4 bg-slate-50 rounded-lg">
                  <p className="font-medium text-slate-900">
                    {selectedEmergency.dam?.name}
                  </p>
                  <p className="text-sm text-slate-600 mt-1">
                    {selectedEmergency.dam?.municipality},{' '}
                    {selectedEmergency.dam?.province}
                  </p>
                  <p className="text-sm text-slate-600">
                    Río: {selectedEmergency.dam?.river}
                  </p>
                </div>
              </div>

              {selectedEmergency.description && (
                <div>
                  <h4 className="text-sm font-medium text-slate-700 mb-2">Descripción</h4>
                  <p className="text-slate-600">{selectedEmergency.description}</p>
                </div>
              )}

              <div>
                <h4 className="text-sm font-medium text-slate-700 mb-2">Información</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-slate-500">Tipo de Emergencia</p>
                    <p className="text-sm font-medium text-slate-900">
                      {getEmergencyTypeLabel(selectedEmergency.emergency_type)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Fecha de Detección</p>
                    <p className="text-sm font-medium text-slate-900">
                      {formatDate(selectedEmergency.detected_at)}
                    </p>
                  </div>
                  {selectedEmergency.responsible && (
                    <div>
                      <p className="text-xs text-slate-500">Responsable</p>
                      <p className="text-sm font-medium text-slate-900">
                        {selectedEmergency.responsible.full_name}
                      </p>
                    </div>
                  )}
                  {selectedEmergency.resolved_at && (
                    <div>
                      <p className="text-xs text-slate-500">Fecha de Resolución</p>
                      <p className="text-sm font-medium text-slate-900">
                        {formatDate(selectedEmergency.resolved_at)}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
