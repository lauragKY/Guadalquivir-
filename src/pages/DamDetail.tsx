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
import { getDamById, getEmergenciesByDam, getMaintenanceWorkOrders, getExploitationDailyData } from '../services/api';
import { supabase } from '../lib/supabase';
import { mockDams } from '../data/mockData';
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, PieChart, Pie
} from 'recharts';

// ── Types ────────────────────────────────────────────────────────────────────

interface MaintenanceReport {
  id: string;
  performed_at: string;
  observations: string | null;
  issues_found: string | null;
  work_order: {
    code: string;
    title: string;
    order_type: string;
    status: string;
  };
}

interface ExploitationDay {
  date: string;
  water_level: number | null;
  stored_volume: number | null;
  inflow_total: number | null;
  outflow_total: number | null;
  rainfall: number | null;
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function getHydraulicYear(date = new Date()) {
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  const startYear = month >= 10 ? year : year - 1;
  return {
    startYear,
    endYear: startYear + 1,
    startDate: `${startYear}-10-01`,
    endDate: `${startYear + 1}-09-30`,
    label: `01/10/${startYear} — 30/09/${startYear + 1}`,
  };
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('es-ES', {
    day: '2-digit', month: '2-digit', year: 'numeric',
  });
}

function abbrevMonth(iso: string) {
  return new Date(iso).toLocaleDateString('es-ES', { month: 'short', day: 'numeric' });
}

// ── Component ────────────────────────────────────────────────────────────────

export default function DamDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [dam, setDam] = useState<Dam | null>(null);
  const [emergencies, setEmergencies] = useState<Emergency[]>([]);
  const [exploitationData, setExploitationData] = useState<ExploitationDay[]>([]);
  const [workOrders, setWorkOrders] = useState<any[]>([]);
  const [incidents, setIncidents] = useState<MaintenanceReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [incidentsPage, setIncidentsPage] = useState(0);
  const [incidentsPerPage, setIncidentsPerPage] = useState(5);

  const hydraulicYear = getHydraulicYear();

  useEffect(() => {
    if (!id) { setLoading(false); return; }
    loadAll(id);
  }, [id]);

  const loadAll = async (damId: string) => {
    try {
      const [damData, emergenciesData] = await Promise.all([
        getDamById(damId),
        getEmergenciesByDam(damId),
      ]);

      if (damData) {
        setDam(damData);
        setEmergencies(emergenciesData);
      } else {
        const mockDam = mockDams.find(d => d.id === damId);
        if (mockDam) {
          setDam({
            id: mockDam.id, code: mockDam.codigo, name: mockDam.nombre,
            province: mockDam.provincia, municipality: mockDam.municipio,
            river: mockDam.rio, dam_type: mockDam.tipo, height: mockDam.altura,
            max_capacity: mockDam.capacidad_maxima, current_level: mockDam.nivel_actual,
            current_volume: mockDam.volumen_actual,
            operational_status: mockDam.estado_operacional as any,
            latitude: mockDam.lat, longitude: mockDam.lon,
            created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
          });
        }
      }

      // Exploitation daily data for current hydraulic year
      const expData = await getExploitationDailyData(damId, hydraulicYear.startDate, hydraulicYear.endDate);
      setExploitationData(expData as unknown as ExploitationDay[]);

      // Maintenance work orders for current calendar year
      const currentYear = new Date().getFullYear();
      const orders = await getMaintenanceWorkOrders(damId, currentYear);
      setWorkOrders(orders);

      // Incidents = maintenance reports that have issues_found
      const { data: reportData } = await supabase
        .from('maintenance_reports')
        .select(`
          id, performed_at, observations, issues_found,
          work_order:maintenance_work_orders!maintenance_reports_work_order_id_fkey(code, title, order_type, status)
        `)
        .eq('maintenance_work_orders.dam_id', damId)
        .not('issues_found', 'is', null)
        .order('performed_at', { ascending: false });

      // Filter client-side for the dam since the join filter may not propagate
      const { data: allReports } = await supabase
        .from('maintenance_reports')
        .select(`
          id, performed_at, observations, issues_found,
          work_order:maintenance_work_orders!maintenance_reports_work_order_id_fkey(code, title, order_type, status, dam_id)
        `)
        .not('issues_found', 'is', null)
        .order('performed_at', { ascending: false });

      const filtered = (allReports || []).filter(
        (r: any) => r.work_order?.dam_id === damId
      );
      setIncidents(filtered as unknown as MaintenanceReport[]);

    } catch (err) {
      console.error('Error loading dam detail:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (!dam) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Presa no encontrada</p>
        <button onClick={() => navigate('/dashboard')} className="mt-4 text-blue-600 hover:text-blue-700">
          Volver al Dashboard
        </button>
      </div>
    );
  }

  // ── Derived stats ─────────────────────────────────────────────────────────

  const getLevelStatus = (level: number) => {
    if (level >= 90) return { color: 'text-red-600', icon: AlertTriangle, label: 'Nivel Crítico' };
    if (level >= 75) return { color: 'text-green-600', icon: TrendingUp, label: 'Nivel Óptimo' };
    if (level >= 50) return { color: 'text-blue-600', icon: Activity, label: 'Nivel Normal' };
    return { color: 'text-orange-600', icon: TrendingDown, label: 'Nivel Bajo' };
  };

  const levelStatus = getLevelStatus(dam.current_level);
  const LevelIcon = levelStatus.icon;

  const preventive = workOrders.filter(o => o.order_type === 'preventive');
  const corrective = workOrders.filter(o => o.order_type === 'corrective');

  const piePreventive = [
    { name: 'No realizado', value: preventive.filter(o => o.status === 'pending').length, fill: '#ef4444' },
    { name: 'Realizado',    value: preventive.filter(o => o.status === 'completed').length, fill: '#10b981' },
    { name: 'En curso',     value: preventive.filter(o => o.status === 'in_progress').length, fill: '#f59e0b' },
    { name: 'Cancelado',    value: preventive.filter(o => o.status === 'cancelled').length, fill: '#d1d5db' },
  ].filter(e => e.value > 0);

  const pieCorrective = [
    { name: 'No realizado', value: corrective.filter(o => o.status === 'pending').length, fill: '#ef4444' },
    { name: 'Realizado',    value: corrective.filter(o => o.status === 'completed').length, fill: '#10b981' },
    { name: 'En curso',     value: corrective.filter(o => o.status === 'in_progress').length, fill: '#f59e0b' },
    { name: 'Cancelado',    value: corrective.filter(o => o.status === 'cancelled').length, fill: '#d1d5db' },
  ].filter(e => e.value > 0);

  const MONTHS_ES = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];

  // Monthly aggregation for cronograma charts
  const monthlyOrders = MONTHS_ES.map((mes, i) => ({
    mes,
    preventivo: preventive.filter(o => o.scheduled_month === i + 1).length,
    correctivo: corrective.filter(o => o.scheduled_month === i + 1).length,
  }));

  // Exploitation chart data (last 20 records)
  const chartExpData = [...exploitationData]
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(-20)
    .map(d => ({
      fecha: abbrevMonth(d.date),
      nivel: d.water_level ?? 0,
      precipitacion: d.rainfall ?? 0,
      aportacion: d.inflow_total ?? 0,
      desembalse: d.outflow_total ?? 0,
    }));

  // Latest reading for value table
  const latestExp = exploitationData.length > 0
    ? [...exploitationData].sort((a, b) => b.date.localeCompare(a.date))[0]
    : null;

  // Incidents pagination
  const pagedIncidents = incidents.slice(
    incidentsPage * incidentsPerPage,
    (incidentsPage + 1) * incidentsPerPage
  );

  const managementModules = [
    { name: 'Inventario',      icon: Package,       path: '/inventory' },
    { name: 'Mantenimiento',   icon: Wrench,        path: '/maintenance' },
    { name: 'Archivo Técnico', icon: FolderOpen,    path: '/technical-archive' },
    { name: 'Auscultación',    icon: LineChartIcon, path: '/auscultation' },
    { name: 'Explotación',     icon: Gauge,         path: '/exploitation' },
    { name: 'BIM',             icon: Box,           path: '/bim' },
    { name: 'Documentación',   icon: FileText,      path: '/documentation' },
    { name: 'Incidencias',     icon: AlertCircle,   path: '/incidents' },
  ];

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-800 to-blue-900 text-white px-6 py-4 rounded-xl shadow-lg">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/map')} className="p-2 hover:bg-blue-700 rounded-lg transition-colors">
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

      {/* Top row: image + values + pie charts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Image + values */}
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
                  {new Date().toLocaleDateString('es-ES', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' })}
                </p>
              </div>
            </div>

            <div className="mt-3">
              <div className="flex items-center justify-between mb-2 pb-2 border-b-2 border-slate-300">
                <span className="text-xs font-bold text-slate-900">
                  {latestExp ? formatDate(latestExp.date) : new Date().toLocaleDateString('es-ES')}
                </span>
                <span className="text-xs font-bold text-slate-900">VALORES</span>
              </div>
              <div className="space-y-0.5 text-xs max-h-[400px] overflow-y-auto">
                {[
                  ['NIVEL DE EMBALSE (m.s.n.m)',             latestExp?.water_level?.toFixed(2)],
                  ['VOLUMEN EMBALSADO (hm³)',                 latestExp?.stored_volume?.toFixed(2)],
                  ['PRECIPITACIÓN (mm)',                      latestExp?.rainfall?.toFixed(1)],
                  ['APORTACIÓN AL EMBALSE (hm³/día)',         latestExp?.inflow_total?.toFixed(3)],
                  ['DESEMBALSE TOTAL (hm³/día)',              latestExp?.outflow_total?.toFixed(3)],
                ].map(([label, val]) => (
                  <div key={label as string} className="flex justify-between py-1.5 border-b border-slate-200">
                    <span className="text-slate-600">{label}</span>
                    <span className="font-semibold text-slate-900">{val ?? '—'}</span>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>

        {/* Pie charts */}
        <div className="lg:col-span-7">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-full">
            {/* Preventivo pie */}
            <Card className="flex flex-col p-5">
              <h3 className="text-base font-semibold text-slate-900 mb-1">Órdenes de Trabajo Preventivo</h3>
              <p className="text-xs text-slate-500 mb-1">Año hidráulico en mantenimientos</p>
              <p className="text-xs text-slate-400 mb-3">{hydraulicYear.label}</p>
              <div className="flex-1 flex items-center justify-center min-h-[200px]">
                {piePreventive.length > 0 ? (
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie data={piePreventive} cx="50%" cy="50%" innerRadius={45} outerRadius={75}
                        paddingAngle={2} dataKey="value" label={e => `${e.value}`} />
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="text-slate-400 text-sm">Sin órdenes</p>
                )}
              </div>
              <div className="flex flex-wrap justify-center gap-2 text-xs mt-2">
                {[['bg-red-500','No realizado'],['bg-green-500','Realizado'],['bg-yellow-400','En curso'],['bg-gray-300','Cancelado']].map(([cls,lbl]) => (
                  <div key={lbl} className="flex items-center gap-1">
                    <div className={`w-2.5 h-2.5 rounded-full ${cls}`} />
                    <span>{lbl}</span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Correctivo pie */}
            <Card className="flex flex-col p-5">
              <h3 className="text-base font-semibold text-slate-900 mb-1">Correctivos y Mejoras</h3>
              <p className="text-xs text-slate-500 mb-1">Año hidráulico en mantenimientos</p>
              <p className="text-xs text-slate-400 mb-3">{hydraulicYear.label}</p>
              <div className="flex-1 flex items-center justify-center min-h-[200px]">
                {pieCorrective.length > 0 ? (
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie data={pieCorrective} cx="50%" cy="50%" innerRadius={45} outerRadius={75}
                        paddingAngle={2} dataKey="value" label={e => `${e.value}`} />
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="text-slate-400 text-sm">Sin órdenes</p>
                )}
              </div>
              <div className="flex flex-wrap justify-center gap-2 text-xs mt-2">
                {[['bg-red-500','No realizado'],['bg-green-500','Realizado'],['bg-yellow-400','En curso'],['bg-gray-300','Cancelado']].map(([cls,lbl]) => (
                  <div key={lbl} className="flex items-center gap-1">
                    <div className={`w-2.5 h-2.5 rounded-full ${cls}`} />
                    <span>{lbl}</span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Legend */}
            <Card className="flex flex-col p-5">
              <h3 className="text-base font-semibold text-slate-900 mb-3">Leyenda Cronogramas</h3>
              <div className="space-y-3 text-xs overflow-y-auto max-h-[400px]">
                <div>
                  <p className="text-xs font-bold text-slate-700 mb-2">Periodicidad:</p>
                  <div className="grid grid-cols-2 gap-x-3 gap-y-1.5">
                    {[['D','Diaria'],['S','Semanal'],['Q','Quincenal'],['M','Mensual'],['2M','Bimestral'],['3M','Trimestral'],['6M','Semestral'],['A','Anual'],['2A','Bianual']].map(([code,label]) => (
                      <div key={code} className="flex items-center gap-1.5">
                        <span className="font-bold text-slate-900 bg-slate-100 px-1.5 py-0.5 rounded min-w-[24px] text-center">{code}</span>
                        <span>{label}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="pt-2 border-t border-slate-200">
                  <p className="text-xs font-bold text-slate-700 mb-2">Estado:</p>
                  <div className="space-y-1.5">
                    {[['bg-yellow-400','Asignado'],['bg-orange-500','En curso'],['bg-green-500','Realizado'],['bg-red-600','No realizado'],['bg-slate-900','Rechazado']].map(([cls,lbl]) => (
                      <div key={lbl} className="flex items-center gap-2">
                        <div className={`w-4 h-4 rounded ${cls}`} />
                        <span>{lbl}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="pt-2 border-t border-slate-200">
                  <p className="text-xs font-bold text-slate-700 mb-2">Tipo de personal:</p>
                  <div className="flex gap-2 flex-wrap">
                    {['PP','EE','OCA'].map(t => (
                      <div key={t} className="px-2 py-1 bg-slate-200 text-slate-900 text-xs rounded font-bold">{t}</div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Exploitation charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="p-5">
          <h3 className="text-base font-semibold text-slate-900 mb-1">Nivel de Embalse / Precipitación</h3>
          <p className="text-xs text-slate-500 mb-4">Año hidrológico · {hydraulicYear.label}</p>
          {chartExpData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={chartExpData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="fecha" tick={{ fontSize: 10 }} />
                <YAxis yAxisId="left" tick={{ fontSize: 10 }} domain={['auto','auto']} label={{ value: 'msnm', angle: -90, position: 'insideLeft', fontSize: 10 }} />
                <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 10 }} label={{ value: 'mm', angle: 90, position: 'insideRight', fontSize: 10 }} />
                <Tooltip contentStyle={{ fontSize: '11px' }} />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Line yAxisId="left" type="monotone" dataKey="nivel" stroke="#3b82f6" name="Nivel (msnm)" dot={false} strokeWidth={2} />
                <Bar yAxisId="right" dataKey="precipitacion" fill="#93c5fd" name="Precipitación (mm)" />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[220px] bg-slate-50 rounded border border-slate-200">
              <p className="text-slate-400 text-sm">Sin registros</p>
            </div>
          )}
        </Card>

        <Card className="p-5">
          <h3 className="text-base font-semibold text-slate-900 mb-1">Aportación / Desembalse</h3>
          <p className="text-xs text-slate-500 mb-4">Año hidrológico · {hydraulicYear.label}</p>
          {chartExpData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={chartExpData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="fecha" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} label={{ value: 'hm³/día', angle: -90, position: 'insideLeft', fontSize: 10 }} />
                <Tooltip contentStyle={{ fontSize: '11px' }} />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Line type="monotone" dataKey="aportacion" stroke="#10b981" name="Aportación" dot={false} strokeWidth={2} />
                <Line type="monotone" dataKey="desembalse" stroke="#f59e0b" name="Desembalse" dot={false} strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[220px] bg-slate-50 rounded border border-slate-200">
              <p className="text-slate-400 text-sm">Sin registros</p>
            </div>
          )}
        </Card>
      </div>

      {/* Maintenance schedule charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="p-5">
          <h3 className="text-base font-semibold text-slate-900 mb-4">Cronograma Preventivos</h3>
          <div className="bg-blue-50 border-l-4 border-blue-500 p-3 mb-4">
            <p className="text-sm font-semibold text-blue-900">Año {new Date().getFullYear()}</p>
            <p className="text-xs text-blue-700 mt-1">Órdenes de trabajo preventivas programadas por mes</p>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={monthlyOrders}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="mes" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
              <Tooltip contentStyle={{ fontSize: '11px' }} />
              <Legend wrapperStyle={{ fontSize: '11px' }} />
              <Bar dataKey="preventivo" fill="#3b82f6" name="Preventivos" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-5">
          <h3 className="text-base font-semibold text-slate-900 mb-4">Cronograma Correctivos</h3>
          <div className="bg-green-50 border-l-4 border-green-500 p-3 mb-4">
            <p className="text-sm font-semibold text-green-900">Año {new Date().getFullYear()}</p>
            <p className="text-xs text-green-700 mt-1">Órdenes de trabajo correctivas realizadas por mes</p>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={monthlyOrders}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="mes" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
              <Tooltip contentStyle={{ fontSize: '11px' }} />
              <Legend wrapperStyle={{ fontSize: '11px' }} />
              <Bar dataKey="correctivo" fill="#10b981" name="Correctivos" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Incidents table */}
      <Card className="p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold text-slate-900">Incidencias</h3>
          <span className="text-sm text-slate-600 bg-slate-100 px-3 py-1 rounded-full">
            Fichas de mantenimientos: <span className="font-bold text-blue-700">{incidents.length}</span>
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-slate-100 border-b-2 border-slate-300">
                <th className="text-left py-2 px-3 text-sm font-semibold text-slate-700">Código</th>
                <th className="text-left py-2 px-3 text-sm font-semibold text-slate-700">Nombre</th>
                <th className="text-left py-2 px-3 text-sm font-semibold text-slate-700">Estado</th>
                <th className="text-left py-2 px-3 text-sm font-semibold text-slate-700">Fecha Alta</th>
                <th className="text-left py-2 px-3 text-sm font-semibold text-slate-700">Correctivo</th>
              </tr>
            </thead>
            <tbody>
              {pagedIncidents.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-slate-500 text-sm bg-slate-50">
                    Sin registros.
                  </td>
                </tr>
              ) : pagedIncidents.map(inc => (
                <tr key={inc.id} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="py-2 px-3 text-sm font-mono text-blue-700">{(inc.work_order as any)?.code ?? '—'}</td>
                  <td className="py-2 px-3 text-sm text-slate-800 max-w-[200px] truncate">{(inc.work_order as any)?.title ?? '—'}</td>
                  <td className="py-2 px-3 text-sm">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                      (inc.work_order as any)?.status === 'completed' ? 'bg-green-100 text-green-800' :
                      (inc.work_order as any)?.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                      'bg-orange-100 text-orange-800'
                    }`}>
                      {(inc.work_order as any)?.status === 'completed' ? 'Realizada' :
                       (inc.work_order as any)?.status === 'in_progress' ? 'En curso' : 'Pendiente'}
                    </span>
                  </td>
                  <td className="py-2 px-3 text-sm text-slate-600">{formatDate(inc.performed_at)}</td>
                  <td className="py-2 px-3 text-sm text-slate-600 max-w-[220px] truncate">{inc.issues_found ?? '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-3 flex items-center justify-between border-t border-slate-200 pt-3">
          <span className="text-xs text-slate-500">
            Mostrando {Math.min(incidentsPage * incidentsPerPage + 1, incidents.length)}–{Math.min((incidentsPage + 1) * incidentsPerPage, incidents.length)} de {incidents.length} registros
          </span>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIncidentsPage(p => Math.max(0, p - 1))}
              disabled={incidentsPage === 0}
              className="text-xs px-2 py-1 border border-slate-300 rounded disabled:opacity-40"
            >Ant.</button>
            <button
              onClick={() => setIncidentsPage(p => p + 1)}
              disabled={(incidentsPage + 1) * incidentsPerPage >= incidents.length}
              className="text-xs px-2 py-1 border border-slate-300 rounded disabled:opacity-40"
            >Sig.</button>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-600">Filas por página:</span>
              <select
                value={incidentsPerPage}
                onChange={e => { setIncidentsPerPage(Number(e.target.value)); setIncidentsPage(0); }}
                className="border border-slate-300 rounded px-2 py-1 text-xs"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
