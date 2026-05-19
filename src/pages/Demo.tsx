import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft, ArrowRight, Play, CheckCircle, AlertTriangle,
  FolderOpen, Wrench, Activity, TrendingUp, Box, Shield,
  Building2, Droplets, Zap, FileText, Info, ChevronRight,
  X, Download, Lock, Clock, BarChart3, Radio, Eye,
  MapPin, Waves
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

// ── Step definitions ─────────────────────────────────────────────────────────

const STEPS = [
  { id: 0, label: 'Inicio',          icon: Building2, short: 'Inicio' },
  { id: 1, label: 'Vista general',   icon: Building2, short: '1. Presa' },
  { id: 2, label: 'Archivo Técnico', icon: FolderOpen, short: '2. Archivo' },
  { id: 3, label: 'Mantenimiento',   icon: Wrench,    short: '3. Mant.' },
  { id: 4, label: 'Auscultación',    icon: Activity,  short: '4. Ausc.' },
  { id: 5, label: 'Explotación',     icon: TrendingUp,short: '5. Expl.' },
  { id: 6, label: 'BIM',             icon: Box,       short: '6. BIM' },
  { id: 7, label: 'Emergencias',     icon: Shield,    short: '7. Emer.' },
  { id: 8, label: 'Cierre',          icon: CheckCircle,short: 'Valor' },
];

// ── Trend data for auscultation chart ────────────────────────────────────────
const TREND_DATA = [
  { d: '07/05', q: 82.3, se: 166.2 },
  { d: '09/05', q: 103.8, se: 166.8 },
  { d: '11/05', q: 128.9, se: 167.1 },
  { d: '13/05', q: 162.4, se: 167.4 },
  { d: '15/05', q: 183.1, se: 168.0 },
  { d: '17/05', q: 198.4, se: 168.7 },
  { d: '19/05', q: 212.7, se: 169.1 },
];

// ── Sub-components ────────────────────────────────────────────────────────────

function DemoCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-5">
      <div className="flex items-center gap-2 mb-2">
        <Info size={14} className="text-blue-600 flex-shrink-0" />
        <p className="text-xs font-bold text-blue-800 uppercase tracking-wide">{title}</p>
      </div>
      <p className="text-xs text-blue-700 leading-relaxed">{children}</p>
    </div>
  );
}

function StatusPill({ label, color }: { label: string; color: 'amber' | 'red' | 'emerald' | 'slate' }) {
  const cls = {
    amber:   'bg-amber-100 text-amber-800 border-amber-300',
    red:     'bg-red-100 text-red-800 border-red-300',
    emerald: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    slate:   'bg-slate-100 text-slate-700 border-slate-300',
  }[color];
  return <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${cls}`}>{label}</span>;
}

// ── Step 0: Landing ───────────────────────────────────────────────────────────
function StepLanding({ onStart }: { onStart: () => void }) {
  const modules = [
    { icon: Building2, label: 'Vista general' },
    { icon: FolderOpen, label: 'Archivo Técnico' },
    { icon: Wrench, label: 'Mantenimiento' },
    { icon: Activity, label: 'Auscultación' },
    { icon: TrendingUp, label: 'Explotación' },
    { icon: Box, label: 'BIM' },
    { icon: Shield, label: 'Gestión de Emergencias' },
  ];
  return (
    <div className="flex flex-col items-center justify-center min-h-full py-10 px-6 text-center">
      <div className="bg-blue-600 text-white rounded-2xl px-5 py-2 text-xs font-bold uppercase tracking-widest mb-6">
        SIPRESAS · Demo ejecutiva
      </div>
      <h1 className="text-4xl font-bold text-slate-900 mb-2">Recorrido demo</h1>
      <h2 className="text-2xl font-bold text-blue-600 mb-2">Presa de Bembézar</h2>
      <p className="text-slate-500 mb-1 flex items-center justify-center gap-1.5 text-sm">
        <MapPin size={14} /> Río Bembézar · Córdoba · Cuenca del Guadalquivir
      </p>
      <div className="flex items-center justify-center gap-3 mb-8 mt-2">
        <StatusPill label="Situación Extraordinaria · Avenida" color="amber" />
        <span className="text-slate-300">|</span>
        <span className="text-sm text-slate-500 flex items-center gap-1"><Clock size={13} /> ~10 min</span>
      </div>

      <div className="grid grid-cols-4 gap-3 mb-10 max-w-xl w-full">
        {modules.map(m => (
          <div key={m.label} className="bg-white rounded-xl border border-slate-200 p-3 flex flex-col items-center gap-1.5 shadow-sm">
            <m.icon size={20} className="text-blue-600" />
            <p className="text-xs font-semibold text-slate-700 text-center leading-tight">{m.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 max-w-lg w-full mb-8 text-sm text-slate-600 text-left">
        <p className="font-bold text-slate-800 mb-1.5">Historia operativa</p>
        Una avenida activa en Bembézar. Los sistemas de auscultación detectan una filtración fuera de umbral.
        La explotación evalúa la situación y gestiona los órganos de desagüe. El gemelo digital BIM refleja
        el estado de cada elemento. Si los indicadores se consolidan, el módulo de Emergencias prepara
        la declaración de Escenario 0.
      </div>

      <button
        onClick={onStart}
        className="flex items-center gap-3 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold text-base rounded-2xl shadow-lg transition-all hover:scale-105"
      >
        <Play size={18} /> Iniciar recorrido
      </button>
    </div>
  );
}

// ── Step 1: Vista general ─────────────────────────────────────────────────────
function StepOverview() {
  const organs = [
    { name: 'Aliviadero compuertas', ok: true },
    { name: 'Compuerta nº1',         ok: true },
    { name: 'Compuerta nº2',         ok: false, note: 'Rev. pendiente' },
    { name: 'Compuerta nº3',         ok: false, note: 'No operativa' },
    { name: 'Desagüe de fondo',      ok: true },
  ];
  return (
    <div className="space-y-5">
      <DemoCard title="Qué se demuestra aquí">
        SIPRESAS centraliza en un único punto la información operativa, documental, técnica y de seguridad de una presa.
        El cliente ve de un vistazo el estado real de la presa y accede a cualquier módulo desde aquí.
      </DemoCard>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Ficha presa */}
        <div className="lg:col-span-1 bg-white rounded-xl border border-slate-200 shadow-sm p-5">
          <div className="flex items-start gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
              <Building2 size={20} className="text-blue-600" />
            </div>
            <div>
              <p className="font-bold text-slate-900 text-base">Presa de Bembézar</p>
              <p className="text-xs text-slate-500">GQ-009 · Arco · Córdoba</p>
            </div>
          </div>
          <div className="space-y-2 text-xs">
            {[
              ['Río', 'Bembézar'],
              ['Sistema', 'Guadalquivir'],
              ['Tipo', 'Arco de hormigón'],
              ['Altura', '84 m sobre cauce'],
              ['Coronación', '385,00 m.s.n.m.'],
              ['Capacidad', '235 hm³'],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between">
                <span className="text-slate-500">{k}</span>
                <span className="font-semibold text-slate-800">{v}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Estado operativo */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle size={16} className="text-amber-600" />
              <span className="font-bold text-amber-900 text-sm">Situación Extraordinaria · Avenida en seguimiento</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: 'NE embalse', value: '383,6 m', sub: 'SAIH · 09:15' },
                { label: 'Aportación 1h', value: '480 m³/s', sub: '+12% vs. ayer' },
                { label: 'Máx. 48h', value: '620 m³/s', sub: '18/05 22:30' },
                { label: 'Precipitación 24h', value: '74 mm', sub: 'Umbral: 70 mm' },
              ].map(item => (
                <div key={item.label} className="bg-white rounded-lg p-3 border border-amber-100">
                  <p className="text-amber-600 text-xs">{item.label}</p>
                  <p className="text-amber-900 font-bold text-base">{item.value}</p>
                  <p className="text-amber-500 text-xs">{item.sub}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Órganos */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
            <p className="text-xs font-bold text-slate-700 uppercase tracking-wide mb-3">Órganos de desagüe</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {organs.map(o => (
                <div key={o.name} className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-xs ${o.ok ? 'bg-emerald-50 border-emerald-200' : 'bg-amber-50 border-amber-200'}`}>
                  <span className={`w-2 h-2 rounded-full flex-shrink-0 ${o.ok ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                  <span className="font-semibold text-slate-800">{o.name}</span>
                  {!o.ok && <span className="ml-auto text-amber-600">{o.note}</span>}
                  {o.ok && <span className="ml-auto text-emerald-600">Operativo</span>}
                </div>
              ))}
            </div>
          </div>

          {/* Alertas */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
            <p className="text-xs font-bold text-slate-700 uppercase tracking-wide mb-3">Alertas activas</p>
            <div className="space-y-2">
              {[
                { sev: 'red', msg: 'Grupo electrógeno: fallo arranque automático · OT-2026-023' },
                { sev: 'orange', msg: 'Filtración Total Q: 212,7 l/s > umbral S.E. 169,1 l/s' },
                { sev: 'amber', msg: 'Compuerta nº2: revisión semestral vencida' },
              ].map((a, i) => (
                <div key={i} className="flex items-start gap-2 text-xs">
                  <span className={`w-2 h-2 rounded-full flex-shrink-0 mt-0.5 ${a.sev === 'red' ? 'bg-red-500' : a.sev === 'orange' ? 'bg-orange-500' : 'bg-amber-400'}`} />
                  <span className="text-slate-700">{a.msg}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Step 2: Archivo Técnico ───────────────────────────────────────────────────
function StepArchive() {
  const [selected, setSelected] = useState('d1');
  const docs = [
    { id: 'd1', name: 'Plan de Emergencia Bembézar.pdf', crit: 'Alta', status: 'Aprobado', ver: '3.0', date: '15/04/2026', folder: 'Planes de Emergencia', tag: 'PEP' },
    { id: 'd2', name: 'Norma de Explotación Bembézar.pdf', crit: 'Media', status: 'Aprobado', ver: '2.0', date: '20/09/2024', folder: 'Normas de Explotación', tag: 'Norma' },
    { id: 'd3', name: 'Plano de compuertas.pdf', crit: 'Media', status: 'Aprobado', ver: '2.0', date: '08/01/2025', folder: 'Planos / Planos hidráulicos', tag: 'Plano' },
    { id: 'd4', name: 'Parte_OT-2026-014_Compuerta_2.pdf', crit: 'Baja', status: 'Aprobado', ver: '1.0', date: '10/02/2026', folder: 'Mantenimiento / Partes', tag: 'Parte' },
    { id: 'd5', name: 'Cartografía zonas inundables.pdf', crit: 'Crítica', status: 'Aprobado', ver: '4.1', date: '02/03/2026', folder: 'Cartografía', tag: 'Crítico' },
  ];
  const sel = docs.find(d => d.id === selected)!;
  const critColor: Record<string, string> = {
    'Crítica': 'bg-red-100 text-red-700 border-red-200',
    'Alta': 'bg-orange-100 text-orange-700 border-orange-200',
    'Media': 'bg-amber-100 text-amber-700 border-amber-200',
    'Baja': 'bg-slate-100 text-slate-600 border-slate-200',
  };
  return (
    <div className="space-y-4">
      <DemoCard title="Qué se demuestra aquí">
        Documentación técnica centralizada, clasificada por criticidad y con trazabilidad completa. Los documentos
        pueden moverse entre carpetas sin borrar y volver a subir. El acceso se registra y hay control por nivel de criticidad.
      </DemoCard>
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <div className="lg:col-span-2 space-y-1.5">
          {docs.map(d => (
            <button key={d.id} onClick={() => setSelected(d.id)}
              className={`w-full text-left rounded-xl border p-3 transition-all ${selected === d.id ? 'border-blue-400 bg-blue-50' : 'border-slate-200 bg-white hover:bg-slate-50'}`}>
              <div className="flex items-start justify-between gap-2 mb-1">
                <p className="text-xs font-bold text-slate-800 leading-tight">{d.name}</p>
                <span className={`text-xs px-1.5 py-0.5 rounded border font-semibold flex-shrink-0 ${critColor[d.crit]}`}>{d.crit}</span>
              </div>
              <p className="text-xs text-slate-500">{d.folder}</p>
            </button>
          ))}
        </div>
        <div className="lg:col-span-3 bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <FileText size={16} className="text-slate-400" />
                <p className="font-bold text-slate-900">{sel.name}</p>
              </div>
              <p className="text-xs text-slate-500">{sel.folder} · v{sel.ver} · {sel.date}</p>
            </div>
            <span className={`text-xs px-2 py-1 rounded border font-bold ${critColor[sel.crit]}`}>{sel.crit}</span>
          </div>
          <div className="grid grid-cols-2 gap-3 text-xs">
            {[
              ['Estado', sel.status], ['Versión', sel.ver],
              ['Última modificación', sel.date], ['Categoría', sel.tag],
            ].map(([k, v]) => (
              <div key={k} className="bg-slate-50 rounded-lg p-2.5">
                <p className="text-slate-500">{k}</p>
                <p className="font-semibold text-slate-800 mt-0.5">{v}</p>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            <button className="flex items-center gap-1.5 text-xs px-3 py-2 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700">
              <Download size={12} /> Descargar
            </button>
            <button className="flex items-center gap-1.5 text-xs px-3 py-2 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200 border border-slate-300">
              <ChevronRight size={12} /> Mover carpeta
            </button>
          </div>
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs">
            <p className="font-bold text-slate-700 uppercase tracking-wide mb-2">Última actividad de auditoría</p>
            <div className="space-y-1.5">
              {[
                ['15/04/2026 09:15', 'J. García', 'Nueva versión 3.0 aprobada'],
                ['10/03/2026 10:05', 'Usuario ext.', 'Acceso denegado · criticidad insuficiente'],
                ['02/03/2026 14:20', 'Admin', 'Criticidad cambiada a Crítica'],
              ].map(([t, u, a]) => (
                <div key={t} className="flex items-start gap-2">
                  <span className="text-slate-400 flex-shrink-0 font-mono">{t}</span>
                  <span className="font-semibold text-slate-700 flex-shrink-0">{u}</span>
                  <span className="text-slate-600">{a}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Step 3: Mantenimiento ─────────────────────────────────────────────────────
function StepMaintenance() {
  const [closed, setClosed] = useState(false);
  const [showModal, setShowModal] = useState(false);
  return (
    <div className="space-y-4">
      <DemoCard title="Qué se demuestra aquí">
        Orden de trabajo OT-2026-014 para la Compuerta nº2. Se muestra el cierre formal con bloqueo de datos,
        la generación automática de un parte PDF y su vinculación con Archivo Técnico y el módulo BIM.
      </DemoCard>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold bg-amber-100 text-amber-700 border border-amber-200 rounded px-2 py-0.5">Preventiva</span>
                {closed
                  ? <span className="text-xs font-bold bg-emerald-100 text-emerald-700 border border-emerald-200 rounded px-2 py-0.5 flex items-center gap-1"><Lock size={10}/> Cerrada</span>
                  : <span className="text-xs font-bold bg-blue-100 text-blue-700 border border-blue-200 rounded px-2 py-0.5">Pendiente cierre</span>
                }
              </div>
              <p className="font-bold text-slate-900">OT-2026-014: Inspección preventiva Compuerta nº2</p>
              <p className="text-xs text-slate-500 mt-0.5">Compuerta Taintor · Aliviadero vano 2 · GQ-009</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            {[
              ['Programada', '10/02/2026'], ['Responsable', 'Miguel Torres'],
              ['Tipo personal', 'EE (empresa externa)'], ['Prioridad', 'Media'],
            ].map(([k, v]) => (
              <div key={k} className="bg-slate-50 rounded-lg p-2">
                <p className="text-slate-500">{k}</p>
                <p className="font-semibold text-slate-800">{v}</p>
              </div>
            ))}
          </div>

          <div className="space-y-2 text-xs">
            <p className="font-bold text-slate-700 uppercase tracking-wide">Actividades</p>
            {[
              { name: 'Inspección visual estado superficial', done: true },
              { name: 'Comprobación juntas de estanqueidad', done: true },
              { name: 'Prueba accionamiento electrohidráulico', done: false },
              { name: 'Revisión sistema de emergencia manual', done: false },
            ].map(a => (
              <div key={a.name} className={`flex items-center gap-2 p-2 rounded-lg ${a.done ? 'bg-emerald-50 border border-emerald-100' : 'bg-slate-50 border border-slate-200'}`}>
                {a.done
                  ? <CheckCircle size={13} className="text-emerald-500 flex-shrink-0" />
                  : <span className="w-3.5 h-3.5 rounded-full border-2 border-slate-300 flex-shrink-0" />}
                <span className={a.done ? 'text-slate-700' : 'text-slate-500'}>{a.name}</span>
              </div>
            ))}
          </div>

          {!closed ? (
            <button onClick={() => setShowModal(true)}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl transition-colors flex items-center justify-center gap-2">
              <Lock size={14} /> Cerrar actividad y generar parte PDF
            </button>
          ) : (
            <div className="space-y-2">
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 flex items-start gap-2 text-xs">
                <CheckCircle size={14} className="text-emerald-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-emerald-800">Parte PDF generado · Datos bloqueados</p>
                  <p className="text-emerald-700 mt-0.5">Parte_OT-2026-014_Compuerta_2.pdf · 1,2 MB</p>
                </div>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-xs text-blue-800">
                Disponible en <strong>Archivo Técnico &gt; Mantenimiento &gt; Partes</strong> y vinculado al elemento BIM <strong>E-004 · Compuerta nº2</strong>.
              </div>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
            <p className="text-xs font-bold text-slate-700 uppercase tracking-wide mb-3">Cronograma 2026 — Presa de Bembézar</p>
            <div className="space-y-1.5">
              {[
                { date: '08/01', title: 'Inspección visual enero 2026', done: true },
                { date: '15/01', title: 'Reparación fuga galería drenaje', done: true },
                { date: '22/04', title: 'Revisión semestral compuertas', done: true },
                { date: '10/02', title: 'OT-2026-014: Compuerta nº2', done: closed },
                { date: '13/05', title: 'Mantenimiento auscultación Q2', done: true },
                { date: '05/06', title: 'Inspección visual junio 2026', done: false },
              ].map(e => (
                <div key={e.date} className={`flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-xs ${e.done ? 'bg-emerald-50' : 'bg-slate-50 border border-slate-100'}`}>
                  {e.done
                    ? <CheckCircle size={12} className="text-emerald-500 flex-shrink-0" />
                    : <Clock size={12} className="text-slate-400 flex-shrink-0" />}
                  <span className="text-slate-400 font-mono flex-shrink-0">{e.date}</span>
                  <span className={e.done ? 'text-slate-700' : 'text-slate-500'}>{e.title}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs text-slate-600">
            <p className="font-bold text-slate-700 mb-1">Vinculaciones</p>
            <div className="space-y-1">
              <p>· <strong>Archivo Técnico:</strong> Parte PDF en Mantenimiento/Partes</p>
              <p>· <strong>BIM:</strong> Elemento E-004 Compuerta nº2 — estado actualizado</p>
              <p>· <strong>Inventario:</strong> Ficha activo ORG-CMP-002</p>
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <div className="flex items-center gap-2 mb-4">
              <Lock size={18} className="text-amber-600" />
              <h3 className="font-bold text-slate-900">Confirmar cierre de actividad</h3>
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-4 text-sm text-amber-800">
              Al cerrar la actividad, <strong>los datos quedarán bloqueados</strong> y no podrán modificarse. Se generará automáticamente el parte PDF y se vinculará con Archivo Técnico y BIM.
            </div>
            <div className="flex gap-3">
              <button onClick={() => { setShowModal(false); setClosed(true); }}
                className="flex-1 py-2.5 bg-blue-600 text-white font-bold rounded-xl text-sm hover:bg-blue-700">
                Confirmar y generar parte
              </button>
              <button onClick={() => setShowModal(false)}
                className="flex-1 py-2.5 bg-slate-100 text-slate-700 font-bold rounded-xl text-sm hover:bg-slate-200">
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Step 4: Auscultación ──────────────────────────────────────────────────────
function StepAuscultation() {
  const [sent, setSent] = useState(false);
  const thr = 169.1;
  return (
    <div className="space-y-4">
      <DemoCard title="Qué se demuestra aquí">
        El sistema recibe datos de DAMDATA, calcula umbrales dinámicos usando el NE del SAIH y detecta
        que la Filtración Total supera el umbral de Situación Extraordinaria. Genera un aviso al Director/a de Explotación
        con trazabilidad completa del cálculo.
      </DemoCard>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="space-y-4">
          {/* Variable crítica */}
          <div className="bg-orange-50 border border-orange-300 rounded-xl p-5">
            <div className="flex items-start justify-between gap-3 mb-3">
              <div>
                <p className="text-xs text-orange-600 font-semibold uppercase tracking-wide">Variable crítica</p>
                <p className="font-bold text-slate-900 text-lg">Filtración Total Q</p>
                <p className="text-xs text-slate-500">Caudalímetro CAU-FT-001 · DAMDATA</p>
              </div>
              <StatusPill label="S. Extraordinaria" color="amber" />
            </div>
            <div className="grid grid-cols-3 gap-3 mb-3">
              {[
                { label: 'Valor actual', val: '212,7 l/s', hi: true },
                { label: 'Umbral S.E.', val: '169,1 l/s', hi: false },
                { label: 'NE (SAIH)', val: '383,6 m', hi: false },
              ].map(item => (
                <div key={item.label} className={`rounded-lg p-2.5 border text-center ${item.hi ? 'bg-orange-100 border-orange-300' : 'bg-white border-slate-200'}`}>
                  <p className={`text-lg font-bold ${item.hi ? 'text-orange-700' : 'text-slate-800'}`}>{item.val}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{item.label}</p>
                </div>
              ))}
            </div>
            <div className="bg-white border border-orange-200 rounded-lg p-3 text-xs">
              <p className="font-bold text-slate-700 mb-1">Fórmula umbral S.E.</p>
              <p className="font-mono text-slate-600">Q &gt; 4×10⁻¹³ × exp(0,0563 × NE) + 58,49</p>
              <p className="font-mono text-orange-700 mt-1">212,7 &gt; 169,1 → <strong>Umbral superado · +25,8%</strong></p>
            </div>
          </div>

          {/* Aviso */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
            <p className="text-xs font-bold text-slate-700 uppercase tracking-wide mb-3">Aviso generado</p>
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs mb-3">
              <div className="flex items-start gap-2">
                <AlertTriangle size={13} className="text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-amber-900">Situación Extraordinaria detectada</p>
                  <p className="text-amber-700 mt-0.5">Destinatario: <strong>Director/a de Explotación</strong></p>
                  <p className="text-amber-700">Fecha: 19/05/2026 08:43 · AUS-Q-FT-001</p>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              {!sent ? (
                <button onClick={() => setSent(true)}
                  className="flex items-center gap-1.5 px-3 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl">
                  <Radio size={12} /> Enviar a Explotación / Emergencias
                </button>
              ) : (
                <div className="flex items-center gap-2 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-xl px-3 py-2">
                  <CheckCircle size={13} /> Comunicación enviada · Registrada en auditoría
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Chart */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
          <p className="text-sm font-bold text-slate-800 mb-1">Tendencia Filtración Total Q</p>
          <p className="text-xs text-slate-500 mb-4">Últimas lecturas · NE actual 383,6 m.s.n.m.</p>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={TREND_DATA}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="d" tick={{ fontSize: 10 }} />
              <YAxis domain={[60, 230]} tick={{ fontSize: 10 }} />
              <Tooltip formatter={(v: number, n: string) => [v + ' l/s', n === 'q' ? 'Q actual' : 'Umbral S.E.']} />
              <ReferenceLine y={thr} stroke="#ea580c" strokeDasharray="4 3" label={{ value: 'Umbral S.E.', position: 'insideTopRight', fontSize: 10, fill: '#ea580c' }} />
              <Line type="monotone" dataKey="q" stroke="#1d4ed8" strokeWidth={2} dot={{ r: 3 }} name="q" />
            </LineChart>
          </ResponsiveContainer>
          <div className="mt-3 bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs">
            <p className="font-bold text-slate-700 mb-1">Trazabilidad del cálculo</p>
            <div className="space-y-1 text-slate-600">
              <p>1. DAMDATA → Q = 212,7 l/s (08:42)</p>
              <p>2. SAIH → NE = 383,6 m (08:42)</p>
              <p>3. Fórmula evaluada → umbral = 169,1 l/s</p>
              <p>4. Aviso generado → pendiente validación Director/a</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Step 5: Explotación ───────────────────────────────────────────────────────
function StepExploitation() {
  const [communicated, setCommunicated] = useState(false);
  const organs = [
    { name: 'Compuerta nº1',   open: '35%', flow: '120 m³/s', ok: true },
    { name: 'Compuerta nº2',   open: '35%', flow: '120 m³/s', ok: true },
    { name: 'Compuerta nº3',   open: '—',   flow: '—',        ok: false, note: 'No operativa' },
    { name: 'Desagüe de fondo',open: '60%', flow: '54 m³/s',  ok: true },
  ];
  return (
    <div className="space-y-4">
      <DemoCard title="Qué se demuestra aquí">
        Panel operativo de la presa con datos SAIH en tiempo real. El sistema evalúa la Situación Extraordinaria,
        muestra el resguardo estacional superado, el estado de los órganos de desagüe y genera una recomendación de maniobra.
        La decisión final siempre corresponde al Director/a de Explotación.
      </DemoCard>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
        <AlertTriangle size={16} className="text-amber-600 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <p className="font-bold text-amber-900 text-sm">Situación Extraordinaria · Avenida en seguimiento</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-2">
            {[
              { l: 'NE embalse', v: '383,6 m' },
              { l: 'Aportación 1h', v: '480 m³/s' },
              { l: 'Máx. 48h', v: '620 m³/s' },
              { l: 'Precipitación 24h', v: '74 mm' },
            ].map(i => (
              <div key={i.l} className="bg-white rounded-lg p-2 border border-amber-100 text-center">
                <p className="text-amber-700 font-bold text-sm">{i.v}</p>
                <p className="text-amber-600 text-xs mt-0.5">{i.l}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Órganos */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
          <p className="text-sm font-bold text-slate-800 mb-3">Órganos de desagüe</p>
          <div className="space-y-2">
            {organs.map(o => (
              <div key={o.name} className={`flex items-center gap-3 px-3 py-2.5 rounded-xl border text-xs ${o.ok ? 'bg-emerald-50 border-emerald-200' : 'bg-slate-100 border-slate-300'}`}>
                <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${o.ok ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                <span className="font-bold text-slate-800 flex-1">{o.name}</span>
                {o.ok ? (
                  <>
                    <span className="text-slate-500">{o.open} abierta</span>
                    <span className="font-bold text-slate-700">{o.flow}</span>
                  </>
                ) : (
                  <span className="text-slate-500">{o.note}</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Recomendación + resguardo */}
        <div className="space-y-3">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
            <p className="text-sm font-bold text-slate-800 mb-1">Resguardo estacional</p>
            <div className="flex items-center gap-3 mb-3">
              <div className="flex-1 bg-slate-100 rounded-full h-3 overflow-hidden">
                <div className="bg-amber-500 h-full rounded-full" style={{ width: '90%' }} />
              </div>
              <span className="text-xs font-bold text-amber-700">383,6 m / 381,5 m ref. Mayo</span>
            </div>
            <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-1.5">
              Nivel actual supera resguardo estacional de mayo (+2,1 m). Vigilancia intensificada.
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <p className="text-xs font-bold text-blue-800 uppercase tracking-wide mb-1">Recomendación sistema</p>
            <p className="text-sm font-bold text-blue-900 mb-1">Desembalse recomendado: 220 m³/s</p>
            <p className="text-xs text-blue-700">Laminación activa · Órganos: Fondo + Hidro + Compuerta nº1</p>
            <div className="bg-white border border-blue-300 rounded-lg p-2.5 mt-2 text-xs text-blue-900 font-semibold">
              Las consignas de explotación son recomendaciones. La decisión final corresponde al Director/a de Explotación.
            </div>
          </div>

          {!communicated ? (
            <button onClick={() => setCommunicated(true)}
              className="w-full py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2">
              <Shield size={14} /> Comunicar a Gestión de Emergencias
            </button>
          ) : (
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 flex items-center gap-2 text-sm text-emerald-800">
              <CheckCircle size={14} className="text-emerald-600" />
              Comunicado enviado a Gestión de Emergencias · 09:15
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Step 6: BIM ───────────────────────────────────────────────────────────────
function StepBIM() {
  const [selected, setSelected] = useState<string | null>('E-004');
  const elements = [
    { id: 'E-001', name: 'Cuerpo de Presa',          color: '#059669', dot: '#d1fae5', status: 'Operativo' },
    { id: 'E-003', name: 'Compuerta nº1',             color: '#059669', dot: '#d1fae5', status: 'Operativo · 35% abierta' },
    { id: 'E-004', name: 'Compuerta nº2',             color: '#d97706', dot: '#fef3c7', status: 'Revisión pendiente' },
    { id: 'E-006', name: 'Grupo electrógeno',         color: '#dc2626', dot: '#fee2e2', status: 'AVERÍA CRÍTICA' },
    { id: 'E-010', name: 'Piezómetro P-14',           color: '#ea580c', dot: '#ffedd5', status: 'Umbral S.E. superado' },
    { id: 'E-011', name: 'Caudalímetro filtraciones', color: '#ea580c', dot: '#ffedd5', status: 'S. Extraordinaria' },
  ];
  const detail: Record<string, React.ReactNode> = {
    'E-004': (
      <div className="space-y-3 text-xs">
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
          <p className="font-bold text-amber-900">Compuerta nº2 · Revisión pendiente</p>
          <p className="text-amber-700 mt-0.5">OT-2026-018 pendiente · Vano 2 aliviadero</p>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {[['Tipo', 'Compuerta Taintor'], ['Fabricante', 'HIDROSTANK S.A.'], ['Modelo', 'TN-1000'], ['S/N', 'HS-2003-0422'], ['Instalación', '10/04/2003'], ['Criticidad', 'Crítica']].map(([k, v]) => (
            <div key={k} className="bg-slate-50 rounded p-2"><p className="text-slate-400">{k}</p><p className="font-semibold text-slate-800">{v}</p></div>
          ))}
        </div>
        <div className="bg-white border border-slate-200 rounded-lg p-2.5">
          <p className="font-bold text-slate-700 mb-1.5">Último parte de mantenimiento</p>
          <div className="flex items-center gap-2">
            <FileText size={13} className="text-slate-400" />
            <span className="text-blue-700 font-semibold">Parte_OT-2026-014_Compuerta_2.pdf</span>
            <button className="ml-auto text-blue-600 font-bold hover:text-blue-800">Ver</button>
          </div>
        </div>
      </div>
    ),
    'E-010': (
      <div className="space-y-3 text-xs">
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
          <p className="font-bold text-orange-900">Piezómetro P-14 · Umbral S.E.</p>
          <p className="text-orange-700 mt-0.5">2,18 kg/cm² &gt; 2,00 kg/cm² · Bloque 7</p>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {[['Valor actual', '2,18 kg/cm²', true], ['Umbral S.E.', '2,00 kg/cm²', false], ['Umbral E.0', '2,50 kg/cm²', false]].map(([k, v, hi]) => (
            <div key={k as string} className={`rounded p-2 border text-center ${hi ? 'bg-orange-50 border-orange-200' : 'bg-slate-50 border-slate-200'}`}>
              <p className={`font-bold ${hi ? 'text-orange-700' : 'text-slate-800'}`}>{v as string}</p>
              <p className="text-slate-500 mt-0.5">{k as string}</p>
            </div>
          ))}
        </div>
        <div className="bg-white border border-slate-200 rounded-lg p-2.5">
          <p className="font-bold text-slate-700 mb-1">Tendencia</p>
          <ResponsiveContainer width="100%" height={80}>
            <LineChart data={[{d:'12/05',v:1.82},{d:'14/05',v:1.96},{d:'16/05',v:2.05},{d:'18/05',v:2.10},{d:'19/05',v:2.18}]}>
              <XAxis dataKey="d" tick={{ fontSize: 9 }} />
              <YAxis domain={[1.6, 2.4]} tick={{ fontSize: 9 }} />
              <ReferenceLine y={2.00} stroke="#ea580c" strokeDasharray="3 2" />
              <Line type="monotone" dataKey="v" stroke="#1d4ed8" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    ),
    'E-006': (
      <div className="space-y-3 text-xs">
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <p className="font-bold text-red-900">Grupo electrógeno · AVERÍA CRÍTICA</p>
          <p className="text-red-700 mt-0.5">OT urgente 2026-023 · Fallo arranque automático</p>
        </div>
        {[['Fabricante', 'SDMO INDUSTRIES'], ['Modelo', 'J150K'], ['Potencia', '150 kVA'], ['Instalación', '20/03/2015']].map(([k, v]) => (
          <div key={k} className="flex justify-between bg-slate-50 rounded p-2"><span className="text-slate-500">{k}</span><span className="font-semibold text-slate-800">{v}</span></div>
        ))}
      </div>
    ),
  };

  return (
    <div className="space-y-4">
      <DemoCard title="Qué se demuestra aquí">
        El gemelo digital BIM muestra el estado en tiempo real de cada elemento de la presa. Al seleccionar
        la Compuerta nº2 se accede a su ficha de inventario y al último parte de mantenimiento. Al seleccionar
        el Piezómetro P-14 se ve el valor de auscultación y el umbral superado.
      </DemoCard>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* SVG viewer */}
        <div className="lg:col-span-3 bg-gradient-to-b from-sky-100 to-slate-200 rounded-xl border border-slate-200 overflow-hidden" style={{ minHeight: 280 }}>
          <div className="absolute-not pointer-events-none select-none">
            <svg viewBox="0 20 600 360" className="w-full" style={{ minHeight: 260 }}>
              <rect x="0" y="215" width="200" height="155" fill="#bfdbfe" opacity="0.65" />
              <rect x="0" y="358" width="600" height="30" fill="#78716c" opacity="0.25" />
              <rect x="480" y="338" width="120" height="52" fill="#bfdbfe" opacity="0.45" />
              {/* Dam body */}
              <polygon points="120,360 200,155 400,155 480,360"
                fill={selected === 'E-001' ? '#d1fae5' : '#e2e8f0'}
                stroke="#059669" strokeWidth="2"
                className="cursor-pointer"
                onClick={() => setSelected('E-001')} />
              {/* Coronation */}
              <rect x="195" y="145" width="210" height="18" rx="2"
                fill="#f1f5f9" stroke="#94a3b8" strokeWidth="1.5" />
              {/* Compuerta 1 */}
              <rect x="248" y="132" width="28" height="28" rx="2"
                fill={selected === 'E-003' ? '#d1fae5' : '#ecfdf5'}
                stroke="#059669" strokeWidth={selected === 'E-003' ? 3 : 1.5}
                className="cursor-pointer" onClick={() => setSelected('E-003')} />
              {/* Compuerta 2 — amber */}
              <rect x="320" y="132" width="28" height="28" rx="2"
                fill={selected === 'E-004' ? '#fef3c7' : '#fffbeb'}
                stroke="#d97706" strokeWidth={selected === 'E-004' ? 3 : 1.5}
                className="cursor-pointer" onClick={() => setSelected('E-004')} />
              {/* Grupo electrógeno — red */}
              <rect x="185" y="245" width="46" height="34" rx="2"
                fill={selected === 'E-006' ? '#fee2e2' : '#fff1f2'}
                stroke="#dc2626" strokeWidth={selected === 'E-006' ? 3 : 1.5}
                className="cursor-pointer" onClick={() => setSelected('E-006')}>
                <animate attributeName="opacity" values="1;0.6;1" dur="1.8s" repeatCount="indefinite" />
              </rect>
              {/* Piezómetro P-14 — orange ellipse */}
              <ellipse cx="285" cy="272" rx="11" ry="11"
                fill={selected === 'E-010' ? '#ffedd5' : '#fff7ed'}
                stroke="#ea580c" strokeWidth={selected === 'E-010' ? 3 : 1.5}
                className="cursor-pointer" onClick={() => setSelected('E-010')}>
                <animate attributeName="opacity" values="1;0.5;1" dur="1.4s" repeatCount="indefinite" />
              </ellipse>
              {/* Caudalímetro — orange ellipse */}
              <ellipse cx="432" cy="312" rx="12" ry="12"
                fill={selected === 'E-011' ? '#ffedd5' : '#fff7ed'}
                stroke="#ea580c" strokeWidth={selected === 'E-011' ? 3 : 1.5}
                className="cursor-pointer" onClick={() => setSelected('E-011')}>
                <animate attributeName="opacity" values="1;0.5;1" dur="1.6s" repeatCount="indefinite" />
              </ellipse>
              {/* Labels */}
              <text x="278" y="148" fontSize="8" fill="#1e3a5f" textAnchor="middle">C1</text>
              <text x="334" y="148" fontSize="8" fill="#92400e" textAnchor="middle">C2</text>
              <text x="208" y="267" fontSize="7" fill="#991b1b" textAnchor="middle">GE</text>
              <text x="285" y="295" fontSize="7" fill="#9a3412" textAnchor="middle">P-14</text>
              <text x="505" y="365" fontSize="8" fill="#1e40af">Río Bembézar</text>
            </svg>
          </div>
          {/* Legend */}
          <div className="flex flex-wrap gap-3 px-4 pb-3 text-xs">
            {[['#059669','Operativo'],['#d97706','Rev. pendiente'],['#dc2626','Avería'],['#ea580c','Umbral superado']].map(([c,l]) => (
              <div key={l} className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: c }} />
                <span className="text-slate-600">{l}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Element list + detail */}
        <div className="lg:col-span-2 space-y-3">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <p className="text-xs font-bold text-slate-700 uppercase tracking-wide px-4 py-2.5 border-b border-slate-100 bg-slate-50">Elementos críticos</p>
            <div className="divide-y divide-slate-100">
              {elements.map(el => (
                <button key={el.id} onClick={() => setSelected(el.id)}
                  className={`w-full text-left px-4 py-2.5 flex items-center gap-2.5 hover:bg-slate-50 transition-colors ${selected === el.id ? 'bg-blue-50' : ''}`}>
                  <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: el.color }} />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-slate-800 truncate">{el.name}</p>
                    <p className="text-xs text-slate-500 truncate">{el.status}</p>
                  </div>
                  <ChevronRight size={12} className="text-slate-400 flex-shrink-0" />
                </button>
              ))}
            </div>
          </div>

          {selected && detail[selected] && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
              <p className="text-xs font-bold text-slate-700 uppercase tracking-wide mb-3">
                {elements.find(e => e.id === selected)?.name}
              </p>
              {detail[selected]}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Step 7: Emergencias ───────────────────────────────────────────────────────
function StepEmergency() {
  const [declared, setDeclared] = useState(false);
  const [commSent, setCommSent] = useState(false);
  const actions = [
    { n: 1, name: 'Vigilancia permanente nivel embalse', done: true },
    { n: 2, name: 'Prueba de desagües y toma hidroeléctrica', done: declared },
    { n: 3, name: 'Prueba grupos electrógenos', done: false },
    { n: 4, name: 'Inspección visual presa y aliviadero', done: false },
    { n: 5, name: 'Notificación Director/a del Plan', done: declared },
    { n: 6, name: 'Activación auscultación automática', done: true },
  ];
  return (
    <div className="space-y-4">
      <DemoCard title="Qué se demuestra aquí">
        El sistema propone automáticamente el Escenario 0 a partir de los indicadores de auscultación y explotación.
        El Director/a del Plan lo valida manualmente, activa las actuaciones y genera las comunicaciones reglamentarias,
        todo con registro completo de trazabilidad.
      </DemoCard>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Propuesta */}
        <div className="space-y-4">
          <div className="bg-red-50 border border-red-300 rounded-xl p-5">
            <div className="flex items-start gap-3 mb-4">
              <AlertTriangle size={20} className="text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-red-900">Propuesta de Escenario 0</p>
                <p className="text-xs text-red-700 mt-0.5">Causa: Eventos hidrológicos + umbral auscultación</p>
                <p className="text-xs text-red-600 font-semibold mt-1">Confianza: Alta</p>
              </div>
            </div>
            <div className="space-y-1.5 mb-4">
              {[
                { name: 'Nivel embalse 383,95 m > umbral 383,50 m', ok: true },
                { name: 'Caudal entrante 480 m³/s > umbral 450 m³/s', ok: true },
                { name: 'Precipitación 24h 74 mm > umbral 70 mm', ok: true },
                { name: 'Filtración Total: S.E. activa', ok: true },
                { name: 'Aceleración sísmica 0,008g < umbral 0,05g', ok: false },
              ].map(i => (
                <div key={i.name} className={`flex items-center gap-2 text-xs px-2.5 py-1.5 rounded-lg ${i.ok ? 'bg-red-100 text-red-800' : 'bg-white text-slate-600 border border-slate-200'}`}>
                  {i.ok ? <AlertTriangle size={11} className="text-red-600 flex-shrink-0" /> : <CheckCircle size={11} className="text-slate-400 flex-shrink-0" />}
                  {i.name}
                </div>
              ))}
            </div>
            {!declared ? (
              <button onClick={() => setDeclared(true)}
                className="w-full py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2">
                <Shield size={14} /> Declarar Escenario 0 — Director/a del Plan
              </button>
            ) : (
              <div className="bg-red-600 text-white rounded-xl p-3 text-sm font-bold text-center flex items-center justify-center gap-2">
                <CheckCircle size={15} /> ESCENARIO 0 DECLARADO · 09:17
              </div>
            )}
          </div>

          {declared && !commSent && (
            <button onClick={() => setCommSent(true)}
              className="w-full py-2.5 bg-slate-800 hover:bg-slate-900 text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2">
              <Radio size={14} /> Generar comunicación F-2 (3 destinatarios)
            </button>
          )}
          {commSent && (
            <div className="bg-white rounded-xl border border-emerald-200 shadow-sm p-4 space-y-2 text-xs">
              <p className="font-bold text-slate-700 uppercase tracking-wide mb-1">Comunicaciones enviadas</p>
              {[
                { r: 'Centro Control Sevilla / SAIH', st: 'Acuse recibido · 09:31' },
                { r: 'Jefe/a Área Explotación', st: 'Enviado · 09:20' },
                { r: 'Comité Permanente', st: 'Enviado · 09:20' },
              ].map(c => (
                <div key={c.r} className="flex items-center gap-2">
                  <CheckCircle size={12} className="text-emerald-500 flex-shrink-0" />
                  <span className="font-semibold text-slate-700">{c.r}</span>
                  <span className="ml-auto text-emerald-600">{c.st}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Actuaciones + timeline */}
        <div className="space-y-3">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
            <p className="text-xs font-bold text-slate-700 uppercase tracking-wide mb-3">Actuaciones recomendadas</p>
            <div className="space-y-1.5">
              {actions.map(a => (
                <div key={a.n} className={`flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs ${a.done ? 'bg-emerald-50 border border-emerald-100' : 'bg-slate-50 border border-slate-200'}`}>
                  {a.done
                    ? <CheckCircle size={13} className="text-emerald-500 flex-shrink-0" />
                    : <span className="w-4 h-4 rounded-full border-2 border-slate-300 flex items-center justify-center flex-shrink-0 text-xs text-slate-400">{a.n}</span>}
                  <span className={a.done ? 'text-slate-700' : 'text-slate-500'}>{a.name}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
            <p className="text-xs font-bold text-slate-700 uppercase tracking-wide mb-3">Registro de actuaciones</p>
            <div className="space-y-2">
              {[
                { t: '09:08', e: 'Umbral NE superado · propuesta Esc. 0', type: 'sistema' },
                { t: '09:12', e: 'Propuesta revisada — J. García', type: 'decision' },
                { t: '09:17', e: declared ? 'Escenario 0 declarado — J. García' : '— pendiente declaración —', type: declared ? 'decision' : 'pending' },
                { t: '09:20', e: commSent ? 'Comunicación F-2 enviada · 3 destinatarios' : '— pendiente comunicación —', type: commSent ? 'comunicacion' : 'pending' },
              ].map(ev => (
                <div key={ev.t} className={`flex items-start gap-2 text-xs ${ev.type === 'pending' ? 'opacity-40' : ''}`}>
                  <span className={`w-2 h-2 rounded-full flex-shrink-0 mt-1 ${ev.type === 'sistema' ? 'bg-slate-400' : ev.type === 'decision' ? 'bg-red-500' : ev.type === 'comunicacion' ? 'bg-blue-500' : 'bg-slate-200'}`} />
                  <span className="text-slate-400 font-mono flex-shrink-0">{ev.t}</span>
                  <span className="text-slate-700">{ev.e}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Step 8: Closing ───────────────────────────────────────────────────────────
function StepClosing() {
  const values = [
    { n: '01', title: 'Información centralizada por presa', desc: 'Una única fuente de verdad para toda la información operativa, técnica y documental de cada presa.' },
    { n: '02', title: 'Documentación segura y trazable', desc: 'Archivo técnico con control de versiones, clasificación por criticidad, auditoría de acceso y movilidad de documentos sin pérdida de trazabilidad.' },
    { n: '03', title: 'Mantenimiento formal con partes PDF', desc: 'Cierre controlado de órdenes de trabajo, bloqueo de datos y generación automática de parte PDF vinculado a BIM y Archivo Técnico.' },
    { n: '04', title: 'Anticipación de riesgos en auscultación y explotación', desc: 'Cálculo dinámico de umbrales, evaluación de la situación y recomendaciones operativas antes de que el riesgo se materialice.' },
    { n: '05', title: 'BIM y Emergencias para la toma de decisiones', desc: 'Gemelo digital que refleja el estado real de cada elemento. Módulo de emergencias que propone, guía y registra todo el proceso de gestión.' },
  ];
  return (
    <div className="space-y-6 py-2">
      <div className="text-center">
        <div className="inline-flex items-center gap-2 bg-blue-600 text-white rounded-xl px-5 py-2 text-sm font-bold mb-4">
          <CheckCircle size={16} /> Demo completada
        </div>
        <h2 className="text-3xl font-bold text-slate-900 mb-2">Valor del nuevo SIPRESAS</h2>
        <p className="text-slate-500 max-w-lg mx-auto text-sm">Un sistema integrado que transforma la gestión de presas: de información dispersa a conocimiento accionable.</p>
      </div>

      <div className="space-y-3 max-w-2xl mx-auto">
        {values.map(v => (
          <div key={v.n} className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex items-start gap-4">
            <span className="text-2xl font-bold text-blue-100 flex-shrink-0 leading-none">{v.n}</span>
            <div>
              <p className="font-bold text-slate-900 text-sm mb-1">{v.title}</p>
              <p className="text-xs text-slate-600 leading-relaxed">{v.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Main Demo component ───────────────────────────────────────────────────────
export default function Demo() {
  const [step, setStep] = useState(0);
  const navigate = useNavigate();
  const total = STEPS.length;

  const stepContent = [
    <StepLanding onStart={() => setStep(1)} />,
    <StepOverview />,
    <StepArchive />,
    <StepMaintenance />,
    <StepAuscultation />,
    <StepExploitation />,
    <StepBIM />,
    <StepEmergency />,
    <StepClosing />,
  ];

  const isLanding = step === 0;
  const isClosing = step === total - 1;
  const progressPct = step === 0 ? 0 : Math.round(((step) / (total - 1)) * 100);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center gap-4">
          <button onClick={() => navigate('/')} className="text-slate-400 hover:text-slate-700 flex-shrink-0">
            <X size={18} />
          </button>
          <div className="flex items-center gap-2 flex-shrink-0">
            <Building2 size={16} className="text-blue-600" />
            <span className="font-bold text-slate-800 text-sm">Presa de Bembézar</span>
            <span className="text-slate-300 mx-1">|</span>
            <StatusPill label="S. Extraordinaria" color="amber" />
          </div>

          {/* Progress bar */}
          {!isLanding && (
            <div className="flex-1 flex items-center gap-3 ml-2">
              <div className="flex-1 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                <div className="bg-blue-500 h-full rounded-full transition-all duration-500" style={{ width: `${progressPct}%` }} />
              </div>
              <span className="text-xs text-slate-500 flex-shrink-0">{step}/{total - 1}</span>
            </div>
          )}

          {/* Module steps */}
          <div className="hidden lg:flex items-center gap-1 ml-auto">
            {STEPS.slice(1, -1).map((s, i) => {
              const stepIdx = i + 1;
              const done = step > stepIdx;
              const active = step === stepIdx;
              return (
                <button key={s.id} onClick={() => setStep(stepIdx)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${active ? 'bg-blue-600 text-white' : done ? 'bg-emerald-100 text-emerald-700' : 'text-slate-400 hover:text-slate-600'}`}>
                  {s.short}
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-6 overflow-y-auto">
        {!isLanding && (
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-xl font-bold text-slate-900">{STEPS[step].label}</h2>
              <p className="text-xs text-slate-500 mt-0.5">Módulo {step} de {total - 2} · Presa de Bembézar</p>
            </div>
            {/* mobile steps */}
            <div className="flex items-center gap-1 lg:hidden">
              {STEPS.slice(1, -1).map((_, i) => {
                const si = i + 1;
                return <span key={si} className={`w-2 h-2 rounded-full ${step === si ? 'bg-blue-600' : step > si ? 'bg-emerald-400' : 'bg-slate-200'}`} />;
              })}
            </div>
          </div>
        )}
        {stepContent[step]}
      </main>

      {/* Footer nav */}
      {!isLanding && (
        <footer className="bg-white border-t border-slate-200 sticky bottom-0 z-30">
          <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
            <button
              onClick={() => setStep(s => Math.max(0, s - 1))}
              disabled={step <= 1}
              className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 disabled:opacity-40 rounded-xl transition-colors"
            >
              <ArrowLeft size={14} /> Anterior
            </button>

            <div className="flex items-center gap-2">
              {STEPS.slice(1, -1).map((_, i) => {
                const si = i + 1;
                return <span key={si} className={`w-2 h-2 rounded-full transition-all ${step === si ? 'bg-blue-600 w-4' : step > si ? 'bg-emerald-400' : 'bg-slate-200'}`} />;
              })}
            </div>

            {!isClosing ? (
              <button
                onClick={() => setStep(s => Math.min(total - 1, s + 1))}
                className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors"
              >
                Siguiente <ArrowRight size={14} />
              </button>
            ) : (
              <button
                onClick={() => navigate('/dashboard')}
                className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-colors"
              >
                Ir al sistema completo <ArrowRight size={14} />
              </button>
            )}
          </div>
        </footer>
      )}
    </div>
  );
}
