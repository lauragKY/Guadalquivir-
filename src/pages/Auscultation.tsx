import { useState, useEffect } from 'react';
import { useDamSelection } from '../contexts/DamSelectionContext';
import { supabase } from '../lib/supabase';
import {
  Activity, AlertTriangle, TrendingUp, TrendingDown, Minus,
  Download, Upload, FileText, CheckCircle, Settings, Bell,
  ChevronDown, ChevronUp, Shield, Zap, X, Eye, BarChart3,
  Info, Clock, Database, Link2
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

// ─── Types ───────────────────────────────────────────────────────────────────

type Screen = 'dashboard' | 'sensors' | 'alerts' | 'config';
type AlertLevel = 'normal' | 'caution' | 'alert' | 'critical';
type SeverityLevel = 'extraordinary' | 'scenario_0' | 'scenario_1';
type EventStatus = 'pending' | 'confirmed' | 'rejected' | 'auto_resolved';

interface Sensor {
  id: string;
  name: string;
  sensor_type: string;
  location: string;
  unit: string;
  status: string;
  threshold_normal: number;
  threshold_caution: number;
  threshold_alert: number;
  threshold_critical: number;
}

interface Reading {
  id: string;
  sensor_id: string;
  reading_value: number;
  reading_date: string;
  alert_level: AlertLevel;
  data_source: string;
  notes: string | null;
}

interface ThresholdRule {
  id: string;
  sensor_id: string | null;
  variable_name: string;
  variable_code: string;
  variable_unit: string;
  severity_level: SeverityLevel;
  condition_type: string;
  formula_expression: string;
  formula_description: string;
  dependent_variable: string | null;
  dependent_variable_source: string | null;
  is_active: boolean;
  version: number;
}

interface ThresholdEvent {
  id: string;
  rule_id: string;
  sensor_id: string | null;
  detected_at: string;
  measured_value: number;
  threshold_value: number;
  dependent_value: number | null;
  formula_evaluated: string;
  severity_level: SeverityLevel;
  status: EventStatus;
  confirmed_at: string | null;
  rejection_reason: string | null;
  notes: string | null;
}

interface AlertLogEntry {
  id: string;
  event_id: string | null;
  action_type: string;
  actor_name: string | null;
  description: string;
  metadata: Record<string, any>;
  created_at: string;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const SENSOR_TYPE_LABEL: Record<string, string> = {
  piezometer: 'Piezómetro',
  flowmeter: 'Aforador',
  inclinometer: 'Inclinómetro',
  extensometer: 'Extensómetro',
  accelerometer: 'Acelerómetro',
  weather_station: 'Estación meteo',
};

const ALERT_CFG: Record<AlertLevel, { label: string; dot: string; badge: string; border: string }> = {
  normal:   { label: 'Normal',   dot: 'bg-emerald-500', badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',  border: 'border-emerald-200' },
  caution:  { label: 'Aviso',    dot: 'bg-amber-400',   badge: 'bg-amber-50 text-amber-700 border-amber-200',        border: 'border-amber-300' },
  alert:    { label: 'Alerta',   dot: 'bg-red-500',     badge: 'bg-red-50 text-red-700 border-red-200',              border: 'border-red-300' },
  critical: { label: 'Crítico',  dot: 'bg-red-700',     badge: 'bg-red-100 text-red-800 border-red-400',             border: 'border-red-500' },
};

const SEVERITY_CFG: Record<SeverityLevel, { label: string; short: string; color: string; bg: string; border: string }> = {
  extraordinary: { label: 'Situación Extraordinaria', short: 'S.E.',      color: 'text-amber-700', bg: 'bg-amber-50',  border: 'border-amber-300' },
  scenario_0:    { label: 'Escenario 0 PEP',           short: 'Esc. 0',   color: 'text-red-700',   bg: 'bg-red-50',    border: 'border-red-300' },
  scenario_1:    { label: 'Escenario 1 PEP',           short: 'Esc. 1',   color: 'text-red-900',   bg: 'bg-red-100',   border: 'border-red-500' },
};

const EVENT_STATUS_CFG: Record<EventStatus, { label: string; cls: string }> = {
  pending:       { label: 'Pendiente',     cls: 'bg-amber-100 text-amber-800' },
  confirmed:     { label: 'Confirmado',    cls: 'bg-red-100 text-red-800' },
  rejected:      { label: 'Rechazado',     cls: 'bg-slate-100 text-slate-600' },
  auto_resolved: { label: 'Auto-resuelto', cls: 'bg-emerald-100 text-emerald-700' },
};

const ACTION_CFG: Record<string, { label: string; icon: string }> = {
  threshold_exceeded: { label: 'Umbral superado',      icon: '⚠' },
  notification_sent:  { label: 'Notificación enviada', icon: '🔔' },
  scenario_proposed:  { label: 'Escenario propuesto',  icon: '📋' },
  scenario_confirmed: { label: 'Escenario confirmado', icon: '✓' },
  scenario_rejected:  { label: 'Rechazado',            icon: '✗' },
  manual_override:    { label: 'Intervención manual',  icon: '👤' },
  auto_resolved:      { label: 'Auto-resuelto',        icon: '↩' },
};

function AlertBadge({ level }: { level: AlertLevel }) {
  const c = ALERT_CFG[level];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-semibold border ${c.badge}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
      {c.label}
    </span>
  );
}

function SeverityBadge({ level }: { level: SeverityLevel }) {
  const c = SEVERITY_CFG[level];
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold border ${c.bg} ${c.color} ${c.border}`}>
      {c.short}
    </span>
  );
}

// ─── Current level bar for a sensor ──────────────────────────────────────────

function SensorBar({ sensor, lastReading }: { sensor: Sensor; lastReading?: Reading }) {
  if (!lastReading) return <span className="text-xs text-slate-400">Sin lectura</span>;
  const val = lastReading.reading_value;
  const max = sensor.threshold_critical * 1.2;
  const pct = Math.min(100, (val / max) * 100);
  const col = lastReading.alert_level === 'normal' ? 'bg-emerald-500'
    : lastReading.alert_level === 'caution' ? 'bg-amber-400'
    : lastReading.alert_level === 'alert' ? 'bg-red-500' : 'bg-red-700';
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all ${col}`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs font-mono font-semibold text-slate-700 w-20 text-right">
        {val.toFixed(1)} {sensor.unit}
      </span>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function Auscultation() {
  const { selectedDam } = useDamSelection();
  const [screen, setScreen] = useState<Screen>('dashboard');
  const [sensors, setSensors] = useState<Sensor[]>([]);
  const [readings, setReadings] = useState<Reading[]>([]);
  const [rules, setRules] = useState<ThresholdRule[]>([]);
  const [events, setEvents] = useState<ThresholdEvent[]>([]);
  const [alertLog, setAlertLog] = useState<AlertLogEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedSensor, setSelectedSensor] = useState<Sensor | null>(null);

  useEffect(() => {
    if (selectedDam) {
      loadAll(selectedDam.id);
    } else {
      setSensors([]); setReadings([]); setRules([]); setEvents([]); setAlertLog([]);
    }
  }, [selectedDam]);

  const loadAll = async (damId: string) => {
    setLoading(true);
    try {
      const [
        { data: sData },
        { data: rData },
        { data: ruData },
        { data: eData },
        { data: lData },
      ] = await Promise.all([
        supabase.from('sensors').select('*').eq('dam_id', damId).eq('status', 'active').order('name'),
        supabase.from('auscultation_readings').select('*').eq('dam_id', damId).order('reading_date', { ascending: false }).limit(200),
        supabase.from('auscultation_threshold_rules').select('*').eq('dam_id', damId).eq('is_active', true).order('severity_level'),
        supabase.from('auscultation_threshold_events').select('*').eq('dam_id', damId).order('detected_at', { ascending: false }),
        supabase.from('auscultation_alert_log').select('*').eq('dam_id', damId).order('created_at', { ascending: false }).limit(50),
      ]);
      setSensors(sData || []);
      setReadings(rData || []);
      setRules(ruData || []);
      setEvents(eData || []);
      setAlertLog(lData || []);
    } finally {
      setLoading(false);
    }
  };

  const latestReadingBySensor = (sensorId: string) =>
    readings.filter(r => r.sensor_id === sensorId)[0];

  const readingsBySensor = (sensorId: string) =>
    readings.filter(r => r.sensor_id === sensorId).slice(0, 20).reverse();

  const pendingEvents = events.filter(e => e.status === 'pending');
  const alertSensors = sensors.filter(s => {
    const lr = latestReadingBySensor(s.id);
    return lr && (lr.alert_level === 'alert' || lr.alert_level === 'critical');
  });
  const warnSensors = sensors.filter(s => {
    const lr = latestReadingBySensor(s.id);
    return lr && lr.alert_level === 'caution';
  });

  if (!selectedDam) {
    return (
      <div className="flex flex-col items-center justify-center h-80 gap-4">
        <Activity className="w-12 h-12 text-slate-300" />
        <p className="text-slate-500 font-medium">Seleccione una presa para acceder al módulo de auscultación</p>
      </div>
    );
  }

  const NAV: { id: Screen; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: 'dashboard', label: 'Estado general',      icon: <BarChart3 size={16} /> },
    { id: 'sensors',   label: 'Sensores y lecturas',  icon: <Activity size={16} /> },
    { id: 'alerts',    label: 'Umbrales y alertas',   icon: <Bell size={16} />, badge: pendingEvents.length || undefined },
    { id: 'config',    label: 'Configuración',         icon: <Settings size={16} /> },
  ];

  return (
    <div className="flex gap-0 min-h-[calc(100vh-120px)]">
      {/* Sidebar */}
      <aside className="w-56 flex-shrink-0 bg-white border-r border-slate-200 flex flex-col">
        <div className="px-4 py-5 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-teal-600 flex items-center justify-center flex-shrink-0">
              <Activity size={16} className="text-white" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-800 leading-tight">Auscultación</p>
              <p className="text-xs text-slate-500 leading-tight truncate max-w-[110px]">{selectedDam.name}</p>
            </div>
          </div>
        </div>
        <nav className="flex-1 p-2 space-y-0.5">
          {NAV.map(item => (
            <button
              key={item.id}
              onClick={() => setScreen(item.id)}
              className={`w-full flex items-center justify-between gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                screen === item.id
                  ? 'bg-teal-50 text-teal-700'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800'
              }`}
            >
              <span className="flex items-center gap-2">
                {item.icon}
                {item.label}
              </span>
              {item.badge ? (
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-amber-500 text-white text-xs font-bold flex items-center justify-center">
                  {item.badge}
                </span>
              ) : null}
            </button>
          ))}
        </nav>
        <div className="p-3 border-t border-slate-100">
          <div className="rounded-lg bg-teal-50 border border-teal-200 px-3 py-2.5 flex items-start gap-2">
            <Database size={13} className="text-teal-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-semibold text-teal-800">Damdata</p>
              <p className="text-xs text-teal-600">Sincronizado</p>
              <p className="text-xs text-teal-500">Hace 5 min</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Content */}
      <main className="flex-1 p-6 bg-slate-50 overflow-auto">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-8 h-8 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : screen === 'dashboard' ? (
          <ScreenDashboard
            sensors={sensors}
            events={events}
            alertLog={alertLog}
            latestReadingBySensor={latestReadingBySensor}
            alertSensors={alertSensors}
            warnSensors={warnSensors}
            pendingEvents={pendingEvents}
            onNavigate={setScreen}
          />
        ) : screen === 'sensors' ? (
          <ScreenSensors
            sensors={sensors}
            readings={readings}
            latestReadingBySensor={latestReadingBySensor}
            readingsBySensor={readingsBySensor}
            selectedSensor={selectedSensor}
            onSelectSensor={setSelectedSensor}
          />
        ) : screen === 'alerts' ? (
          <ScreenAlerts
            events={events}
            alertLog={alertLog}
            sensors={sensors}
            rules={rules}
            onRefresh={() => selectedDam && loadAll(selectedDam.id)}
          />
        ) : (
          <ScreenConfig rules={rules} sensors={sensors} />
        )}
      </main>
    </div>
  );
}

// ─── Screen: Dashboard ────────────────────────────────────────────────────────

function ScreenDashboard({ sensors, events, alertLog, latestReadingBySensor, alertSensors, warnSensors, pendingEvents, onNavigate }: {
  sensors: Sensor[];
  events: ThresholdEvent[];
  alertLog: AlertLogEntry[];
  latestReadingBySensor: (id: string) => Reading | undefined;
  alertSensors: Sensor[];
  warnSensors: Sensor[];
  pendingEvents: ThresholdEvent[];
  onNavigate: (s: Screen) => void;
}) {
  const normalSensors = sensors.length - alertSensors.length - warnSensors.length;
  const totalEvents = events.length;
  const confirmedEvents = events.filter(e => e.status === 'confirmed').length;

  const overallStatus = alertSensors.length > 0 ? 'alert'
    : pendingEvents.length > 0 ? 'caution'
    : warnSensors.length > 0 ? 'caution' : 'normal';

  const statusConfig = {
    normal:  { label: 'Normal',    bg: 'bg-emerald-50',  border: 'border-emerald-200', text: 'text-emerald-700', dot: 'bg-emerald-500' },
    caution: { label: 'Aviso',     bg: 'bg-amber-50',    border: 'border-amber-200',   text: 'text-amber-700',   dot: 'bg-amber-400' },
    alert:   { label: 'Alerta',    bg: 'bg-red-50',      border: 'border-red-200',     text: 'text-red-700',     dot: 'bg-red-500' },
  };
  const sc = statusConfig[overallStatus];

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Estado general de auscultación</h2>
          <p className="text-sm text-slate-500 mt-0.5">Integración DAMDATA · Última sincronización hace 5 min</p>
        </div>
        <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border ${sc.bg} ${sc.border}`}>
          <span className={`w-2.5 h-2.5 rounded-full ${sc.dot} ${overallStatus !== 'normal' ? 'animate-pulse' : ''}`} />
          <span className={`text-sm font-bold ${sc.text}`}>{sc.label}</span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Sensores activos',   value: sensors.length,       color: 'text-teal-600',    bg: 'bg-teal-50',    icon: <Activity size={20} className="text-teal-600" /> },
          { label: 'Sensores en alerta', value: alertSensors.length,  color: 'text-red-600',     bg: 'bg-red-50',     icon: <AlertTriangle size={20} className="text-red-600" /> },
          { label: 'Superaciones activas', value: pendingEvents.length, color: 'text-amber-600', bg: 'bg-amber-50',   icon: <Bell size={20} className="text-amber-600" /> },
          { label: 'SE confirmadas 2026', value: confirmedEvents,     color: 'text-slate-600',   bg: 'bg-slate-100',  icon: <FileText size={20} className="text-slate-600" /> },
        ].map(item => (
          <div key={item.label} className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl ${item.bg} flex items-center justify-center flex-shrink-0`}>
              {item.icon}
            </div>
            <div>
              <p className={`text-2xl font-bold ${item.color}`}>{item.value}</p>
              <p className="text-xs text-slate-500 mt-0.5">{item.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Pending events banner */}
      {pendingEvents.length > 0 && (
        <div className="bg-amber-50 border border-amber-300 rounded-xl p-4 flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0">
              <Bell size={18} className="text-amber-700" />
            </div>
            <div>
              <p className="font-bold text-amber-900 text-sm">
                {pendingEvents.length} superación{pendingEvents.length > 1 ? 'es' : ''} de umbral pendiente{pendingEvents.length > 1 ? 's' : ''} de validación
              </p>
              <p className="text-xs text-amber-700 mt-0.5">
                Requiere confirmación o rechazo por el Director/a de Explotación
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigate('alerts')}
            className="flex-shrink-0 px-3 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-lg transition-colors"
          >
            Revisar
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sensor status list */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
              <Activity size={15} className="text-teal-600" />
              Estado de sensores
            </h3>
            <button onClick={() => onNavigate('sensors')} className="text-xs text-teal-600 hover:underline font-medium">
              Ver todos
            </button>
          </div>
          <div className="divide-y divide-slate-100">
            {sensors.slice(0, 8).map(s => {
              const lr = latestReadingBySensor(s.id);
              return (
                <div key={s.id} className="flex items-center gap-3 px-5 py-3">
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 ${lr ? ALERT_CFG[lr.alert_level].dot : 'bg-slate-300'}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-slate-800 truncate">{s.name}</p>
                    <p className="text-xs text-slate-400 truncate">{s.location}</p>
                  </div>
                  {lr && <AlertBadge level={lr.alert_level} />}
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent alert log */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
              <Clock size={15} className="text-teal-600" />
              Últimas notificaciones
            </h3>
            <button onClick={() => onNavigate('alerts')} className="text-xs text-teal-600 hover:underline font-medium">
              Ver log completo
            </button>
          </div>
          <div className="divide-y divide-slate-100">
            {alertLog.slice(0, 8).map(entry => (
              <div key={entry.id} className="flex items-start gap-3 px-5 py-3">
                <span className="text-sm mt-0.5">{ACTION_CFG[entry.action_type]?.icon || '•'}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-slate-800">{ACTION_CFG[entry.action_type]?.label || entry.action_type}</p>
                  <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{entry.description}</p>
                </div>
                <span className="text-xs text-slate-400 flex-shrink-0">
                  {new Date(entry.created_at).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick access */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Sensores y lecturas', icon: <Activity size={20} />, target: 'sensors' as Screen, color: 'bg-teal-600 hover:bg-teal-700' },
          { label: 'Umbrales y alertas',  icon: <Bell size={20} />,     target: 'alerts'  as Screen, color: 'bg-amber-500 hover:bg-amber-600' },
          { label: 'Configuración',       icon: <Settings size={20} />, target: 'config'  as Screen, color: 'bg-slate-700 hover:bg-slate-800' },
        ].map(item => (
          <button
            key={item.label}
            onClick={() => onNavigate(item.target)}
            className={`flex flex-col items-center gap-2 p-5 rounded-xl text-white font-semibold text-sm transition-all shadow-sm ${item.color}`}
          >
            {item.icon}
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Screen: Sensors & Readings ───────────────────────────────────────────────

function ScreenSensors({ sensors, readings, latestReadingBySensor, readingsBySensor, selectedSensor, onSelectSensor }: {
  sensors: Sensor[];
  readings: Reading[];
  latestReadingBySensor: (id: string) => Reading | undefined;
  readingsBySensor: (id: string) => Reading[];
  selectedSensor: Sensor | null;
  onSelectSensor: (s: Sensor | null) => void;
}) {
  const [typeFilter, setTypeFilter] = useState('all');
  const types = Array.from(new Set(sensors.map(s => s.sensor_type)));

  const filtered = typeFilter === 'all' ? sensors : sensors.filter(s => s.sensor_type === typeFilter);

  const chartData = selectedSensor
    ? readingsBySensor(selectedSensor.id).map(r => ({
        date: new Date(r.reading_date).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' }),
        value: r.reading_value,
        alert_level: r.alert_level,
      }))
    : [];

  const sensorCfg = selectedSensor
    ? { caution: selectedSensor.threshold_caution, alert: selectedSensor.threshold_alert }
    : null;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-900">Sensores y lecturas</h2>
        <div className="flex items-center gap-2">
          <select
            value={typeFilter}
            onChange={e => setTypeFilter(e.target.value)}
            className="px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="all">Todos los tipos</option>
            {types.map(t => <option key={t} value={t}>{SENSOR_TYPE_LABEL[t] || t}</option>)}
          </select>
          <button className="flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-600 hover:bg-slate-50 transition-colors">
            <Upload size={14} />
            Importar
          </button>
          <button className="flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-600 hover:bg-slate-50 transition-colors">
            <Download size={14} />
            Exportar
          </button>
        </div>
      </div>

      <div className="flex gap-5">
        {/* Sensor list */}
        <div className="w-72 flex-shrink-0 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-100 bg-slate-50">
            <p className="text-xs font-bold uppercase tracking-wide text-slate-500">{filtered.length} sensores</p>
          </div>
          <div className="divide-y divide-slate-100 max-h-[600px] overflow-y-auto">
            {filtered.map(s => {
              const lr = latestReadingBySensor(s.id);
              const isSelected = selectedSensor?.id === s.id;
              return (
                <button
                  key={s.id}
                  onClick={() => onSelectSensor(isSelected ? null : s)}
                  className={`w-full text-left px-4 py-3 transition-colors ${isSelected ? 'bg-teal-50' : 'hover:bg-slate-50'}`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`w-2 h-2 rounded-full flex-shrink-0 ${lr ? ALERT_CFG[lr.alert_level].dot : 'bg-slate-300'}`} />
                    <span className="text-xs font-bold text-slate-800 truncate">{s.name}</span>
                  </div>
                  <p className="text-xs text-slate-500 mb-2 pl-4 truncate">{s.location}</p>
                  <div className="pl-4">
                    <SensorBar sensor={s} lastReading={lr} />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Detail / chart */}
        <div className="flex-1">
          {selectedSensor ? (
            <div className="space-y-4">
              {/* Sensor header */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-bold text-slate-900 text-base">{selectedSensor.name}</h3>
                    <p className="text-sm text-slate-500">{selectedSensor.location}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-teal-50 text-teal-700 border border-teal-200">
                      {SENSOR_TYPE_LABEL[selectedSensor.sensor_type] || selectedSensor.sensor_type}
                    </span>
                    {(() => {
                      const lr = latestReadingBySensor(selectedSensor.id);
                      return lr ? <AlertBadge level={lr.alert_level} /> : null;
                    })()}
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-3">
                  {[
                    { label: 'Normal', val: selectedSensor.threshold_normal, color: 'text-emerald-600' },
                    { label: 'Aviso',  val: selectedSensor.threshold_caution, color: 'text-amber-600' },
                    { label: 'Alerta', val: selectedSensor.threshold_alert, color: 'text-red-600' },
                    { label: 'Crítico', val: selectedSensor.threshold_critical, color: 'text-red-800' },
                  ].map(t => (
                    <div key={t.label} className="text-center p-2 rounded-lg bg-slate-50 border border-slate-100">
                      <p className="text-xs text-slate-500">{t.label}</p>
                      <p className={`text-sm font-bold ${t.color}`}>{t.val} {selectedSensor.unit}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Chart */}
              {chartData.length > 0 && (
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
                  <p className="text-sm font-bold text-slate-700 mb-4">Evolución temporal — {selectedSensor.unit}</p>
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                      <YAxis tick={{ fontSize: 10 }} />
                      <Tooltip
                        contentStyle={{ fontSize: 12, borderRadius: 8 }}
                        formatter={(v: number) => [`${v} ${selectedSensor.unit}`, 'Valor']}
                      />
                      {sensorCfg && <ReferenceLine y={sensorCfg.caution} stroke="#f59e0b" strokeDasharray="4 2" label={{ value: 'Aviso', fontSize: 10, fill: '#f59e0b' }} />}
                      {sensorCfg && <ReferenceLine y={sensorCfg.alert}  stroke="#ef4444" strokeDasharray="4 2" label={{ value: 'Alerta', fontSize: 10, fill: '#ef4444' }} />}
                      <Line type="monotone" dataKey="value" stroke="#0d9488" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}

              {/* Reading table */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-5 py-3 border-b border-slate-100 bg-slate-50">
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Historial de lecturas</p>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead className="bg-slate-50 border-b border-slate-200">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-semibold text-slate-500">Fecha</th>
                        <th className="px-4 py-2 text-right text-xs font-semibold text-slate-500">Valor</th>
                        <th className="px-4 py-2 text-center text-xs font-semibold text-slate-500">Estado</th>
                        <th className="px-4 py-2 text-left text-xs font-semibold text-slate-500">Fuente</th>
                        <th className="px-4 py-2 text-left text-xs font-semibold text-slate-500">Notas</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {readingsBySensor(selectedSensor.id).slice().reverse().map(r => (
                        <tr key={r.id} className="hover:bg-slate-50">
                          <td className="px-4 py-2 text-xs text-slate-600 font-mono">
                            {new Date(r.reading_date).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: '2-digit' })}
                          </td>
                          <td className="px-4 py-2 text-right text-xs font-bold text-slate-800 font-mono">
                            {r.reading_value.toFixed(1)} {selectedSensor.unit}
                          </td>
                          <td className="px-4 py-2 text-center"><AlertBadge level={r.alert_level} /></td>
                          <td className="px-4 py-2 text-xs text-slate-500">{r.data_source}</td>
                          <td className="px-4 py-2 text-xs text-slate-500">{r.notes || '—'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 bg-white rounded-xl border border-slate-200 shadow-sm gap-3">
              <Eye size={32} className="text-slate-300" />
              <p className="text-sm text-slate-400">Selecciona un sensor para ver su detalle y evolución temporal</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Screen: Alerts & Thresholds ──────────────────────────────────────────────

function ScreenAlerts({ events, alertLog, sensors, rules, onRefresh }: {
  events: ThresholdEvent[];
  alertLog: AlertLogEntry[];
  sensors: Sensor[];
  rules: ThresholdRule[];
  onRefresh: () => void;
}) {
  const [tab, setTab] = useState<'events' | 'log'>('events');
  const [actionEvent, setActionEvent] = useState<ThresholdEvent | null>(null);
  const [actionType, setActionType] = useState<'confirm' | 'reject' | null>(null);
  const [actionNote, setActionNote] = useState('');
  const [processing, setProcessing] = useState(false);

  const sensorById = (id: string | null) => sensors.find(s => s.id === id);
  const ruleById = (id: string) => rules.find(r => r.id === id);

  const pending = events.filter(e => e.status === 'pending');
  const resolved = events.filter(e => e.status !== 'pending');

  const handleAction = async () => {
    if (!actionEvent || !actionType) return;
    setProcessing(true);
    const newStatus = actionType === 'confirm' ? 'confirmed' : 'rejected';
    await supabase
      .from('auscultation_threshold_events')
      .update({ status: newStatus, confirmed_at: new Date().toISOString(), rejection_reason: actionNote || null })
      .eq('id', actionEvent.id);
    await supabase.from('auscultation_alert_log').insert({
      event_id: actionEvent.id,
      dam_id: actionEvent.dam_id,
      action_type: actionType === 'confirm' ? 'scenario_confirmed' : 'scenario_rejected',
      description: actionType === 'confirm'
        ? `Situación Extraordinaria confirmada por el Director/a de Explotación. ${actionNote}`
        : `Evento rechazado por el Director/a de Explotación. Motivo: ${actionNote}`,
    });
    setActionEvent(null);
    setActionType(null);
    setActionNote('');
    setProcessing(false);
    onRefresh();
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-900">Umbrales y alertas</h2>
        <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-lg p-1">
          {(['events', 'log'] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${tab === t ? 'bg-teal-600 text-white' : 'text-slate-600 hover:text-slate-800'}`}
            >
              {t === 'events' ? 'Superaciones' : 'Log de auditoría'}
              {t === 'events' && pending.length > 0 && (
                <span className="ml-1.5 px-1.5 py-0.5 rounded-full bg-amber-500 text-white text-xs font-bold">{pending.length}</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {tab === 'events' && (
        <div className="space-y-4">
          {/* Pending */}
          {pending.length > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl overflow-hidden">
              <div className="px-5 py-3 border-b border-amber-200 bg-amber-100 flex items-center gap-2">
                <Bell size={14} className="text-amber-700" />
                <p className="text-xs font-bold uppercase tracking-wide text-amber-700">
                  {pending.length} pendiente{pending.length > 1 ? 's' : ''} de validación del Director/a de Explotación
                </p>
              </div>
              <div className="divide-y divide-amber-100">
                {pending.map(ev => {
                  const sensor = sensorById(ev.sensor_id);
                  const rule = ruleById(ev.rule_id);
                  return (
                    <div key={ev.id} className="p-5">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-2 flex-wrap">
                            <SeverityBadge level={ev.severity_level} />
                            {sensor && <span className="text-xs font-semibold text-slate-700">{sensor.name}</span>}
                            <span className="text-xs text-slate-500">
                              {new Date(ev.detected_at).toLocaleString('es-ES', { day: '2-digit', month: 'short', year: '2-digit', hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          <div className="grid grid-cols-3 gap-3 text-xs">
                            <div className="bg-white rounded-lg p-2 border border-amber-200">
                              <p className="text-amber-600 font-semibold">Valor medido</p>
                              <p className="font-bold text-slate-800 font-mono">{ev.measured_value.toFixed(1)} {sensor?.unit || ''}</p>
                            </div>
                            <div className="bg-white rounded-lg p-2 border border-amber-200">
                              <p className="text-amber-600 font-semibold">Umbral calculado</p>
                              <p className="font-bold text-slate-800 font-mono">{ev.threshold_value.toFixed(1)} {sensor?.unit || ''}</p>
                            </div>
                            {ev.dependent_value && (
                              <div className="bg-white rounded-lg p-2 border border-amber-200">
                                <p className="text-amber-600 font-semibold">Nivel embalse</p>
                                <p className="font-bold text-slate-800 font-mono">{ev.dependent_value.toFixed(1)} m.s.n.m.</p>
                              </div>
                            )}
                          </div>
                          <div className="bg-white border border-amber-200 rounded-lg px-3 py-2">
                            <p className="text-xs font-mono text-slate-600">{ev.formula_evaluated}</p>
                          </div>
                          {ev.notes && <p className="text-xs text-slate-500">{ev.notes}</p>}
                        </div>
                        <div className="flex flex-col gap-2 flex-shrink-0">
                          <button
                            onClick={() => { setActionEvent(ev); setActionType('confirm'); }}
                            className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1"
                          >
                            <Shield size={12} /> Confirmar S.E.
                          </button>
                          <button
                            onClick={() => { setActionEvent(ev); setActionType('reject'); }}
                            className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold rounded-lg transition-colors flex items-center gap-1"
                          >
                            <X size={12} /> Rechazar
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Resolved events */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-5 py-3 border-b border-slate-100 bg-slate-50">
              <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Historial de superaciones</p>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-slate-500">Fecha detección</th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-slate-500">Sensor</th>
                    <th className="px-4 py-2 text-center text-xs font-semibold text-slate-500">Nivel</th>
                    <th className="px-4 py-2 text-right text-xs font-semibold text-slate-500">Valor medido</th>
                    <th className="px-4 py-2 text-right text-xs font-semibold text-slate-500">Umbral</th>
                    <th className="px-4 py-2 text-center text-xs font-semibold text-slate-500">Estado</th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-slate-500">Notas</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {[...pending, ...resolved].map(ev => {
                    const sensor = sensorById(ev.sensor_id);
                    const esc = EVENT_STATUS_CFG[ev.status];
                    return (
                      <tr key={ev.id} className="hover:bg-slate-50">
                        <td className="px-4 py-2.5 text-xs text-slate-600 font-mono">
                          {new Date(ev.detected_at).toLocaleString('es-ES', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                        </td>
                        <td className="px-4 py-2.5 text-xs font-medium text-slate-800">{sensor?.name || '—'}</td>
                        <td className="px-4 py-2.5 text-center"><SeverityBadge level={ev.severity_level} /></td>
                        <td className="px-4 py-2.5 text-right text-xs font-mono font-bold text-slate-800">{ev.measured_value.toFixed(1)}</td>
                        <td className="px-4 py-2.5 text-right text-xs font-mono text-slate-500">{ev.threshold_value.toFixed(1)}</td>
                        <td className="px-4 py-2.5 text-center">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${esc.cls}`}>{esc.label}</span>
                        </td>
                        <td className="px-4 py-2.5 text-xs text-slate-500 max-w-xs truncate">{ev.notes || '—'}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {tab === 'log' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-5 py-3 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Log de auditoría</p>
            <span className="text-xs text-slate-400">{alertLog.length} entradas</span>
          </div>
          <div className="divide-y divide-slate-100">
            {alertLog.map(entry => (
              <div key={entry.id} className="flex items-start gap-3 px-5 py-3">
                <span className="text-base mt-0.5 flex-shrink-0">{ACTION_CFG[entry.action_type]?.icon || '•'}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-0.5">
                    <span className="text-xs font-bold text-slate-800">{ACTION_CFG[entry.action_type]?.label || entry.action_type}</span>
                    <span className="text-xs text-slate-400">{entry.actor_name || 'Sistema'}</span>
                  </div>
                  <p className="text-xs text-slate-600">{entry.description}</p>
                </div>
                <span className="text-xs text-slate-400 font-mono flex-shrink-0">
                  {new Date(entry.created_at).toLocaleString('es-ES', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Confirmation modal */}
      {actionEvent && actionType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${actionType === 'confirm' ? 'bg-red-50' : 'bg-slate-100'}`}>
                {actionType === 'confirm' ? <Shield size={20} className="text-red-600" /> : <X size={20} className="text-slate-600" />}
              </div>
              <div>
                <h3 className="font-bold text-slate-900">
                  {actionType === 'confirm' ? 'Confirmar Situación Extraordinaria' : 'Rechazar superación de umbral'}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Sensor: {sensorById(actionEvent.sensor_id)?.name} · {actionEvent.measured_value.toFixed(1)} {sensorById(actionEvent.sensor_id)?.unit}
                </p>
              </div>
            </div>

            {actionType === 'confirm' && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-800">
                Al confirmar, se registrará la Situación Extraordinaria en el sistema y se activará el protocolo de seguimiento intensificado. Esta acción queda registrada en el log de auditoría.
              </div>
            )}

            <div>
              <label className="block text-xs font-bold uppercase tracking-wide text-slate-500 mb-1.5">
                {actionType === 'confirm' ? 'Observaciones (opcional)' : 'Motivo del rechazo *'}
              </label>
              <textarea
                value={actionNote}
                onChange={e => setActionNote(e.target.value)}
                rows={3}
                placeholder={actionType === 'confirm' ? 'Añada observaciones...' : 'Describa el motivo del rechazo...'}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
              />
            </div>

            <div className="flex gap-3 pt-1">
              <button
                onClick={() => { setActionEvent(null); setActionType(null); setActionNote(''); }}
                className="flex-1 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm rounded-xl transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleAction}
                disabled={processing || (actionType === 'reject' && !actionNote.trim())}
                className={`flex-1 px-4 py-2.5 font-bold text-sm rounded-xl transition-colors disabled:opacity-50 ${
                  actionType === 'confirm'
                    ? 'bg-red-600 hover:bg-red-700 text-white'
                    : 'bg-slate-700 hover:bg-slate-800 text-white'
                }`}
              >
                {processing ? 'Guardando...' : actionType === 'confirm' ? 'Confirmar S.E.' : 'Rechazar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Screen: Configuration ────────────────────────────────────────────────────

function ScreenConfig({ rules, sensors }: { rules: ThresholdRule[]; sensors: Sensor[] }) {
  const [expanded, setExpanded] = useState<string | null>(null);
  const sensorById = (id: string | null) => sensors.find(s => s.id === id);

  const rulesByVariable = rules.reduce<Record<string, ThresholdRule[]>>((acc, r) => {
    const k = r.variable_name;
    if (!acc[k]) acc[k] = [];
    acc[k].push(r);
    return acc;
  }, {});

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Configuración de umbrales</h2>
          <p className="text-sm text-slate-500 mt-0.5">Expresiones matemáticas configurables según Normas de Explotación</p>
        </div>
        <button className="flex items-center gap-1.5 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold rounded-lg transition-colors">
          <Zap size={14} />
          Nueva regla
        </button>
      </div>

      {/* Integration info */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex items-start gap-4">
        <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center flex-shrink-0">
          <Link2 size={18} className="text-teal-600" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-slate-800">Integración DAMDATA + SAIH</p>
          <p className="text-xs text-slate-500 mt-0.5">
            Las variables dependientes (NE — nivel de embalse, temperatura) se obtienen de DAMDATA o SAIH mediante API REST autenticada.
            La evaluación de expresiones se realiza localmente en SIPRESAS cada 5 minutos.
          </p>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Activa
        </div>
      </div>

      {/* Rules by variable */}
      {Object.entries(rulesByVariable).map(([varName, varRules]) => {
        const sensor = sensorById(varRules[0].sensor_id);
        const isOpen = expanded === varName;
        return (
          <div key={varName} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <button
              onClick={() => setExpanded(isOpen ? null : varName)}
              className="w-full flex items-center justify-between px-5 py-4 hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center">
                  <Activity size={15} className="text-teal-600" />
                </div>
                <div className="text-left">
                  <p className="font-bold text-slate-800 text-sm">{varName}</p>
                  <p className="text-xs text-slate-500">{sensor?.location || ''} · {varRules[0].variable_unit} · {varRules.length} reglas activas</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex gap-1">
                  {Array.from(new Set(varRules.map(r => r.severity_level))).map(sl => (
                    <SeverityBadge key={sl} level={sl} />
                  ))}
                </div>
                {isOpen ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
              </div>
            </button>

            {isOpen && (
              <div className="border-t border-slate-100 divide-y divide-slate-100">
                {varRules.map(rule => {
                  const sc = SEVERITY_CFG[rule.severity_level];
                  return (
                    <div key={rule.id} className="px-5 py-4">
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div className="flex items-center gap-2">
                          <SeverityBadge level={rule.severity_level} />
                          <span className="text-xs text-slate-500 capitalize">{rule.condition_type.replace('_', ' ')}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${rule.is_active ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                            {rule.is_active ? 'Activa' : 'Inactiva'}
                          </span>
                          <span className="text-xs text-slate-400">v{rule.version}</span>
                          <button className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-600 transition-colors">
                            <Settings size={13} />
                          </button>
                        </div>
                      </div>

                      {/* Formula */}
                      <div className={`rounded-xl border ${sc.border} ${sc.bg} px-4 py-3 mb-3`}>
                        <p className="text-xs font-mono font-bold text-slate-800 mb-1">{rule.formula_expression}</p>
                        <p className="text-xs text-slate-600">{rule.formula_description}</p>
                      </div>

                      {rule.dependent_variable && (
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                          <Info size={12} />
                          <span>Variable dependiente: <strong>{rule.dependent_variable}</strong> — fuente: <strong>{rule.dependent_variable_source?.toUpperCase()}</strong></span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}

      {rules.length === 0 && (
        <div className="flex flex-col items-center justify-center h-48 bg-white rounded-xl border border-slate-200 gap-3">
          <Settings size={32} className="text-slate-300" />
          <p className="text-sm text-slate-400">No hay reglas de umbral configuradas para esta presa</p>
          <button className="px-4 py-2 bg-teal-600 text-white text-sm font-semibold rounded-lg hover:bg-teal-700 transition-colors">
            Crear primera regla
          </button>
        </div>
      )}
    </div>
  );
}
