import React, { useState } from 'react';
import {
  Layers, Filter, X, Wrench, Activity, Database,
  FileText, AlertTriangle, CheckCircle, Info, ZoomIn, ZoomOut,
  RotateCw, Maximize2, Download, Eye, PlusCircle, ChevronRight
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { BIM_ELEMENTS, DAM_STATUS } from './mockData';
import {
  ELEMENT_STATUS_CFG, CATEGORY_CFG, CRITICALITY_CFG,
  ElementStatusBadge, CategoryBadge, DamStatusBanner
} from './helpers';
import type { Screen, BimElement, ActiveFilters, ActiveLayers, ElementCategory, ElementStatus, LayerKey } from './types';

interface Props { onNavigate: (s: Screen) => void; }

const INITIAL_LAYERS: ActiveLayers = {
  inventory: true, maintenance: true, exploitation: true,
  auscultation: true, electrical: true, safety: true, alerts: true,
};

type ContextTab = 'info' | 'inventory' | 'maintenance' | 'auscultation' | 'exploitation' | 'docs' | 'historic';

export default function ScreenViewer({ onNavigate }: Props) {
  const [selected, setSelected] = useState<BimElement | null>(null);
  const [filters, setFilters] = useState<ActiveFilters>({ category: 'all', status: 'all', criticality: 'all', layer: 'all' });
  const [layers, setLayers] = useState<ActiveLayers>(INITIAL_LAYERS);
  const [showFilters, setShowFilters] = useState(false);
  const [showLayers, setShowLayers] = useState(false);
  const [activeTab, setActiveTab] = useState<ContextTab>('info');

  const visible = BIM_ELEMENTS.filter(e => {
    if (filters.category !== 'all' && e.category !== filters.category) return false;
    if (filters.status !== 'all' && e.status !== filters.status) return false;
    if (filters.criticality !== 'all' && e.criticality !== filters.criticality) return false;
    if (filters.layer !== 'all' && !e.layers.includes(filters.layer as LayerKey)) return false;
    // Layer visibility
    const layerMatch = e.layers.some(l => {
      if (l === 'inventory') return layers.inventory;
      if (l === 'maintenance') return layers.maintenance;
      if (l === 'exploitation') return layers.exploitation;
      if (l === 'auscultation') return layers.auscultation;
      if (l === 'electrical') return layers.electrical;
      if (l === 'safety') return layers.safety;
      return true;
    });
    return layerMatch;
  });

  const visibleIds = new Set(visible.map(e => e.id));

  const chartData = selected?.ausc_trend?.map((v, i) => ({
    date: selected.ausc_trend_dates?.[i] ?? `${i}`,
    value: v,
  })) ?? [];

  const tabs: { id: ContextTab; label: string; icon: React.ReactNode; show: boolean }[] = [
    { id: 'info', label: 'Info', icon: <Info size={11} />, show: true },
    { id: 'inventory', label: 'Inventario', icon: <Database size={11} />, show: !!selected?.inventory_ref },
    { id: 'maintenance', label: 'Mantenimiento', icon: <Wrench size={11} />, show: !!selected?.maint_last_date },
    { id: 'auscultation', label: 'Auscultación', icon: <Activity size={11} />, show: !!selected?.ausc_variable },
    { id: 'exploitation', label: 'Explotación', icon: <Eye size={11} />, show: !!selected?.expl_status },
    { id: 'docs', label: 'Documentación', icon: <FileText size={11} />, show: (selected?.archive_docs?.length ?? 0) > 0 },
    { id: 'historic', label: 'Histórico', icon: <ChevronRight size={11} />, show: (selected?.historic?.length ?? 0) > 0 },
  ];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-bold text-slate-900">Visor BIM — Sección transversal</h2>
          <DamStatusBanner status={DAM_STATUS} />
        </div>
        <div className="flex gap-2">
          <button onClick={() => { setShowLayers(!showLayers); setShowFilters(false); }}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors ${showLayers ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'}`}>
            <Layers size={12} /> Capas
          </button>
          <button onClick={() => { setShowFilters(!showFilters); setShowLayers(false); }}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors ${showFilters ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'}`}>
            <Filter size={12} /> Filtros
          </button>
        </div>
      </div>

      {/* Layers panel */}
      {showLayers && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-bold text-slate-700 uppercase tracking-wide">Capas del visor</p>
            <span className="text-xs text-slate-400">{visible.length} elementos visibles</span>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
            {(Object.keys(layers) as LayerKey[]).map(key => {
              const labels: Record<LayerKey, string> = {
                inventory: 'Inventario', maintenance: 'Mantenimiento', exploitation: 'Explotación',
                auscultation: 'Auscultación', electrical: 'Instalaciones eléctricas',
                safety: 'Sistemas de seguridad', alerts: 'Alertas',
              };
              return (
                <label key={key} className="flex items-center gap-2 cursor-pointer p-2 rounded-lg hover:bg-slate-50">
                  <input type="checkbox" checked={layers[key]} onChange={e => setLayers(l => ({ ...l, [key]: e.target.checked }))} className="rounded" />
                  <span className="text-xs text-slate-700">{labels[key]}</span>
                </label>
              );
            })}
          </div>
        </div>
      )}

      {/* Filters panel */}
      {showFilters && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Categoría', key: 'category' as const, options: [{ value: 'all', label: 'Todas' }, ...Object.entries(CATEGORY_CFG).map(([k, v]) => ({ value: k, label: v.label }))] },
            { label: 'Estado', key: 'status' as const, options: [{ value: 'all', label: 'Todos' }, ...Object.entries(ELEMENT_STATUS_CFG).map(([k, v]) => ({ value: k, label: v.label }))] },
            { label: 'Criticidad', key: 'criticality' as const, options: [{ value: 'all', label: 'Todas' }, ...Object.entries(CRITICALITY_CFG).map(([k, v]) => ({ value: k, label: v.label }))] },
            { label: 'Módulo/capa', key: 'layer' as const, options: [
              { value: 'all', label: 'Todos' }, { value: 'inventory', label: 'Inventario' },
              { value: 'maintenance', label: 'Mantenimiento' }, { value: 'exploitation', label: 'Explotación' },
              { value: 'auscultation', label: 'Auscultación' }, { value: 'electrical', label: 'Eléctrico' },
              { value: 'safety', label: 'Seguridad' },
            ]},
          ].map(f => (
            <div key={f.key}>
              <p className="text-xs font-bold uppercase tracking-wide text-slate-500 mb-1.5">{f.label}</p>
              <select value={filters[f.key]} onChange={e => setFilters(prev => ({ ...prev, [f.key]: e.target.value }))} className="w-full text-xs border border-slate-300 rounded-lg px-2 py-1.5 focus:outline-none">
                {f.options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
          ))}
        </div>
      )}

      <div className="flex gap-4">
        {/* SVG Viewer */}
        <div className="flex-1 bg-gradient-to-b from-sky-100 to-slate-200 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden" style={{ minHeight: 460 }}>
          {/* Toolbar */}
          <div className="absolute top-3 left-3 flex gap-1 z-10">
            {[<ZoomIn size={13} />, <ZoomOut size={13} />, <RotateCw size={13} />, <Maximize2 size={13} />].map((icon, i) => (
              <button key={i} className="p-1.5 bg-white/90 rounded-lg border border-slate-300 shadow-sm hover:bg-white transition-colors text-slate-600">{icon}</button>
            ))}
          </div>

          {/* Legend */}
          <div className="absolute top-3 right-3 bg-white/95 rounded-xl border border-slate-200 shadow-sm p-2.5 z-10">
            <p className="text-xs font-bold text-slate-600 mb-1.5">Leyenda</p>
            <div className="space-y-1">
              {(Object.entries(ELEMENT_STATUS_CFG) as [ElementStatus, typeof ELEMENT_STATUS_CFG[ElementStatus]][]).map(([k, v]) => (
                <div key={k} className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ backgroundColor: v.svgFill, border: `1.5px solid ${v.svgStroke}` }} />
                  <span className="text-xs text-slate-600">{v.label}</span>
                </div>
              ))}
            </div>
          </div>

          <svg viewBox="0 20 600 390" className="w-full" style={{ minHeight: 420 }}>
            {/* Water / reservoir */}
            <rect x="0" y="215" width="200" height="170" fill="#bfdbfe" opacity="0.65" />
            <text x="65" y="310" fontSize="9" fill="#1e40af" fontWeight="bold">EMBALSE</text>
            <text x="42" y="323" fontSize="8" fill="#1e40af">NE = 600.92 m</text>
            <line x1="0" y1="215" x2="200" y2="215" stroke="#3b82f6" strokeWidth="1.5" strokeDasharray="4 2" />

            {/* River downstream */}
            <rect x="480" y="338" width="120" height="52" fill="#bfdbfe" opacity="0.45" />
            <text x="505" y="365" fontSize="8" fill="#1e40af">Río Guadalmena</text>

            {/* Ground */}
            <rect x="0" y="358" width="600" height="30" fill="#78716c" opacity="0.25" />

            {/* Elements */}
            {BIM_ELEMENTS.map(el => {
              const isVis = visibleIds.has(el.id);
              const cfg = ELEMENT_STATUS_CFG[el.status];
              const isSel = selected?.id === el.id;
              const opacity = isVis ? 1 : 0.12;

              const commonProps = {
                fill: cfg.svgFill,
                stroke: isSel ? '#1d4ed8' : cfg.svgStroke,
                strokeWidth: isSel ? 2.5 : 1.5,
                style: { cursor: isVis ? 'pointer' : 'default', opacity },
                onClick: () => isVis && (isSel ? setSelected(null) : (setSelected(el), setActiveTab('info'))),
              };

              if (el.svgType === 'polygon' && el.points) {
                return (
                  <g key={el.id}>
                    <polygon points={el.points} {...commonProps} />
                    <text x="300" y="270" fontSize="7.5" fill="#334155" textAnchor="middle" fontWeight="bold" style={{ pointerEvents: 'none' }}>CUERPO DE PRESA</text>
                    <text x="300" y="282" fontSize="7" fill="#64748b" textAnchor="middle" style={{ pointerEvents: 'none' }}>H=78m · L=380m</text>
                  </g>
                );
              }
              if (el.svgType === 'ellipse') {
                const cx = el.x + el.width / 2;
                const cy = el.y + el.height / 2;
                const rx = el.width / 2;
                const ry = el.height / 2;
                return (
                  <g key={el.id}>
                    <ellipse cx={cx} cy={cy} rx={rx} ry={ry} {...commonProps} />
                    {isSel && <circle cx={cx} cy={cy} r={Math.max(rx, ry) + 5} fill="none" stroke="#1d4ed8" strokeWidth="1.5" strokeDasharray="3 2" />}
                    {/* Alert pulse for non-operational sensors */}
                    {(el.status === 'threshold_exceeded' || el.status === 'failure') && isVis && !isSel && (
                      <circle cx={cx} cy={cy} r={Math.max(rx, ry) + 4} fill="none" stroke={cfg.svgStroke} strokeWidth="1" opacity="0.5">
                        <animate attributeName="r" values={`${Math.max(rx,ry)+2};${Math.max(rx,ry)+7};${Math.max(rx,ry)+2}`} dur="2s" repeatCount="indefinite" />
                        <animate attributeName="opacity" values="0.6;0;0.6" dur="2s" repeatCount="indefinite" />
                      </circle>
                    )}
                  </g>
                );
              }
              return (
                <g key={el.id}>
                  <rect x={el.x} y={el.y} width={el.width} height={el.height} rx="2" {...commonProps} />
                  {isSel && <rect x={el.x-3} y={el.y-3} width={el.width+6} height={el.height+6} fill="none" stroke="#1d4ed8" strokeWidth="1.5" strokeDasharray="3 2" rx="3" />}
                </g>
              );
            })}

            {/* Labels */}
            <text x="180" y="143" fontSize="7" fill="#475569">Cota 610m</text>
            <text x="155" y="363" fontSize="7" fill="#475569">Cota 535m</text>
          </svg>

          <p className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-white/90 text-xs text-slate-500 px-3 py-1 rounded-full border border-slate-200 shadow-sm whitespace-nowrap">
            Haz clic en un elemento para abrir el panel contextual integrado
          </p>
        </div>

        {/* Context panel */}
        {selected && (
          <div className="w-84 flex-shrink-0 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col overflow-hidden" style={{ width: 320, maxHeight: 500, overflowY: 'auto' }}>
            <div className="px-4 py-3 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="min-w-0">
                <p className="text-xs font-bold text-slate-800 truncate">{selected.name}</p>
                <p className="text-xs text-slate-400">{selected.code} · UUID: {selected.uuid.substring(0, 12)}...</p>
              </div>
              <button onClick={() => setSelected(null)} className="text-slate-400 hover:text-slate-700 flex-shrink-0 ml-2"><X size={14} /></button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-slate-200 overflow-x-auto flex-shrink-0">
              {tabs.filter(t => t.show).map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1 px-3 py-2 text-xs font-semibold whitespace-nowrap transition-colors border-b-2 flex-shrink-0 ${activeTab === tab.id ? 'border-blue-600 text-blue-600 bg-blue-50/50' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                >
                  {tab.icon} {tab.label}
                </button>
              ))}
            </div>

            <div className="p-4 flex-1 space-y-3 text-xs overflow-y-auto">
              {/* ── INFO ── */}
              {activeTab === 'info' && (
                <>
                  <div className="flex flex-wrap gap-1.5">
                    <ElementStatusBadge status={selected.status} />
                    <CategoryBadge category={selected.category} />
                    <span className={`text-xs px-2 py-0.5 rounded border font-semibold ${CRITICALITY_CFG[selected.criticality].color}`}>Criticidad {CRITICALITY_CFG[selected.criticality].label.toLowerCase()}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { label: 'Tipo de activo', value: selected.asset_type },
                      { label: 'Ubicación', value: selected.location },
                      { label: 'Módulo origen estado', value: selected.module_origin },
                      { label: 'Última actualización', value: selected.last_updated },
                    ].map(item => (
                      <div key={item.label}>
                        <p className="font-bold text-slate-500 uppercase tracking-wide mb-0.5">{item.label}</p>
                        <p className="text-slate-800">{item.value}</p>
                      </div>
                    ))}
                  </div>
                  <p className="text-slate-700">{selected.description}</p>

                  {/* Quick actions */}
                  <div className="border-t border-slate-100 pt-3 space-y-1.5">
                    <p className="font-bold text-slate-500 uppercase tracking-wide mb-2">Acciones</p>
                    {[
                      { label: 'Ver ficha de inventario', tab: 'inventory' as ContextTab, show: !!selected.inventory_ref, icon: <Database size={11} /> },
                      { label: 'Ver último parte PDF', tab: 'maintenance' as ContextTab, show: !!selected.maint_last_pdf_name, icon: <FileText size={11} /> },
                      { label: 'Ver gráfico de auscultación', tab: 'auscultation' as ContextTab, show: !!selected.ausc_variable, icon: <Activity size={11} /> },
                      { label: 'Ver documentación técnica', tab: 'docs' as ContextTab, show: (selected.archive_docs?.length ?? 0) > 0, icon: <FileText size={11} /> },
                    ].filter(a => a.show).map(a => (
                      <button key={a.label} onClick={() => setActiveTab(a.tab)} className="flex items-center gap-1.5 text-blue-600 hover:text-blue-800 font-semibold w-full">
                        {a.icon} {a.label}
                      </button>
                    ))}
                    <button className="flex items-center gap-1.5 text-amber-600 hover:text-amber-800 font-semibold"><PlusCircle size={11} /> Crear incidencia</button>
                    {!selected.status.includes('operational') && (
                      <button className="flex items-center gap-1.5 text-emerald-600 hover:text-emerald-800 font-semibold"><CheckCircle size={11} /> Marcar alerta como revisada</button>
                    )}
                  </div>
                </>
              )}

              {/* ── INVENTORY ── */}
              {activeTab === 'inventory' && (
                <>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-2 mb-2">
                    <p className="text-blue-800 font-semibold">Elemento BIM vinculado al activo {selected.inventory_ref} mediante identificador único.</p>
                  </div>
                  {[
                    { label: 'Código activo', value: selected.inventory_ref },
                    { label: 'Tipo', value: selected.inv_type },
                    { label: 'Fabricante', value: selected.inv_manufacturer },
                    { label: 'Modelo', value: selected.inv_model },
                    { label: 'Nº de serie', value: selected.inv_serial },
                    { label: 'Fecha instalación', value: selected.inv_install_date },
                    { label: 'Ubicación funcional', value: selected.inv_location_func },
                    { label: 'Estado inventarial', value: 'Activo' },
                  ].filter(i => i.value && i.value !== '—').map(item => (
                    <div key={item.label}>
                      <p className="font-bold text-slate-500 uppercase tracking-wide mb-0.5">{item.label}</p>
                      <p className="text-slate-800">{item.value}</p>
                    </div>
                  ))}
                  <button className="flex items-center gap-1.5 text-blue-600 hover:text-blue-800 font-semibold mt-2"><Database size={11} /> Ver ficha completa en Inventario</button>
                </>
              )}

              {/* ── MAINTENANCE ── */}
              {activeTab === 'maintenance' && (
                <>
                  <p className="font-bold text-slate-500 uppercase tracking-wide">Módulo Mantenimiento</p>
                  {selected.maint_status && (
                    <div className={`rounded-lg border p-2 ${
                      selected.maint_status.includes('AVERÍA') || selected.maint_status.includes('urgente') ? 'bg-red-50 border-red-200' :
                      selected.maint_status.includes('pendiente') || selected.maint_status.includes('vencida') ? 'bg-amber-50 border-amber-200' :
                      'bg-emerald-50 border-emerald-200'
                    }`}>
                      <p className="font-semibold text-slate-800">{selected.maint_status}</p>
                    </div>
                  )}
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { label: 'Última inspección', value: selected.maint_last_date },
                      { label: 'Próxima revisión', value: selected.maint_next_date },
                      { label: 'Incidencias abiertas', value: String(selected.maint_open_incidents ?? 0) },
                      { label: 'Total partes históricos', value: String(selected.maint_total_parts ?? 0) },
                    ].filter(i => i.value).map(item => (
                      <div key={item.label}>
                        <p className="font-bold text-slate-500 uppercase tracking-wide mb-0.5">{item.label}</p>
                        <p className="text-slate-800">{item.value}</p>
                      </div>
                    ))}
                  </div>
                  {selected.maint_last_pdf_name && (
                    <div className="bg-slate-50 border border-slate-200 rounded-lg p-2">
                      <p className="font-bold text-slate-500 mb-1">Último parte PDF</p>
                      <p className="font-semibold text-slate-800 mb-1.5">{selected.maint_last_pdf_name}</p>
                      <p className="text-slate-600 mb-2 italic">El último parte PDF generado en Mantenimiento queda disponible desde el visor BIM.</p>
                      <div className="flex gap-2">
                        <button className="flex items-center gap-1 text-blue-600 hover:text-blue-800 font-semibold"><Eye size={11} /> Ver PDF</button>
                        <button className="flex items-center gap-1 text-blue-600 hover:text-blue-800 font-semibold"><Download size={11} /> Descargar</button>
                      </div>
                    </div>
                  )}
                  <div className="flex gap-2 pt-1">
                    <button className="flex items-center gap-1 text-slate-600 hover:text-slate-800 font-semibold"><FileText size={11} /> Ver histórico</button>
                    <button className="flex items-center gap-1 text-amber-600 hover:text-amber-800 font-semibold"><PlusCircle size={11} /> Crear OT</button>
                  </div>
                </>
              )}

              {/* ── AUSCULTATION ── */}
              {activeTab === 'auscultation' && selected.ausc_variable && (
                <>
                  <p className="font-bold text-slate-500 uppercase tracking-wide">Módulo Auscultación · {selected.ausc_source}</p>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-slate-50 rounded-lg border p-2">
                      <p className="text-slate-500 mb-0.5">Valor actual</p>
                      <p className={`font-bold font-mono ${selected.status === 'threshold_exceeded' ? 'text-orange-700' : 'text-slate-900'}`}>{selected.ausc_value} {selected.ausc_unit}</p>
                    </div>
                    <div className="bg-slate-50 rounded-lg border p-2">
                      <p className="text-slate-500 mb-0.5">Umbral S.E.</p>
                      <p className="font-bold font-mono text-amber-700">{selected.ausc_threshold_se} {selected.ausc_unit}</p>
                    </div>
                    <div className="bg-slate-50 rounded-lg border p-2">
                      <p className="text-slate-500 mb-0.5">Umbral E.0</p>
                      <p className="font-bold font-mono text-red-700">{selected.ausc_threshold_e0} {selected.ausc_unit}</p>
                    </div>
                    <div className={`rounded-lg border p-2 ${selected.status === 'threshold_exceeded' ? 'bg-orange-50 border-orange-200' : 'bg-emerald-50 border-emerald-200'}`}>
                      <p className="text-slate-500 mb-0.5">Estado</p>
                      <p className="font-bold text-slate-800">{selected.ausc_status}</p>
                    </div>
                  </div>

                  {chartData.length > 0 && (
                    <div>
                      <p className="font-bold text-slate-500 uppercase tracking-wide mb-1.5">Gráfico histórico (8 días)</p>
                      <ResponsiveContainer width="100%" height={110}>
                        <LineChart data={chartData} margin={{ top: 4, right: 8, bottom: 0, left: -10 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                          <XAxis dataKey="date" tick={{ fontSize: 8 }} />
                          <YAxis tick={{ fontSize: 8 }} domain={['auto', 'auto']} />
                          <Tooltip contentStyle={{ fontSize: 10, borderRadius: 6 }} />
                          {selected.ausc_threshold_se && <ReferenceLine y={parseFloat(selected.ausc_threshold_se)} stroke="#f59e0b" strokeDasharray="4 2" label={{ value: 'S.E.', fontSize: 8, fill: '#b45309', position: 'right' }} />}
                          {selected.ausc_threshold_e0 && <ReferenceLine y={parseFloat(selected.ausc_threshold_e0)} stroke="#ef4444" strokeDasharray="4 2" label={{ value: 'E.0', fontSize: 8, fill: '#dc2626', position: 'right' }} />}
                          <Line type="monotone" dataKey="value" stroke="#2563eb" strokeWidth={1.5} dot={{ r: 2 }} activeDot={{ r: 3 }} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  )}
                  <p className="text-slate-500 italic">El estado de este sensor procede del módulo de Auscultación y de los umbrales definidos en las NEX.</p>
                  <button className="flex items-center gap-1 text-blue-600 hover:text-blue-800 font-semibold"><Activity size={11} /> Ver detalle en Auscultación</button>
                </>
              )}

              {/* ── EXPLOITATION ── */}
              {activeTab === 'exploitation' && selected.expl_status && (
                <>
                  <p className="font-bold text-slate-500 uppercase tracking-wide">Módulo Explotación</p>
                  <div className={`rounded-lg border p-3 ${
                    selected.expl_status.includes('S. Extraordinaria') || selected.expl_status.includes('Avenida') ? 'bg-amber-50 border-amber-200' :
                    selected.expl_status.includes('Cerrad') || selected.expl_status.includes('pendiente') ? 'bg-amber-50 border-amber-200' :
                    'bg-emerald-50 border-emerald-200'
                  }`}>
                    <p className="font-semibold text-slate-800">{selected.expl_status}</p>
                  </div>
                  <div className="bg-slate-50 border border-slate-200 rounded-lg p-2">
                    <p className="text-slate-600 italic">El estado global de la presa se sincroniza desde el módulo de Explotación.</p>
                  </div>
                </>
              )}

              {/* ── DOCS ── */}
              {activeTab === 'docs' && (
                <>
                  <p className="font-bold text-slate-500 uppercase tracking-wide">Documentación · Archivo Técnico</p>
                  <p className="text-slate-600 italic">Los archivos BIM completos se almacenan en Archivo Técnico, no en el visor.</p>
                  <div className="space-y-1.5">
                    {(selected.archive_docs ?? []).map(doc => (
                      <div key={doc.id} className={`flex items-center gap-2 px-2.5 py-2 rounded-lg border ${doc.critical ? 'bg-amber-50 border-amber-200' : 'bg-slate-50 border-slate-200'}`}>
                        <FileText size={11} className="text-slate-400 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-slate-800 font-semibold truncate">{doc.name}</p>
                          <p className="text-slate-400">{doc.type} · {doc.size} · {doc.path}</p>
                        </div>
                        {doc.critical ? (
                          <span className="text-xs px-1.5 py-0.5 bg-amber-100 text-amber-700 rounded font-bold flex-shrink-0">Crítico</span>
                        ) : (
                          <button className="flex items-center gap-0.5 text-blue-600 hover:text-blue-800 font-semibold flex-shrink-0"><Download size={10} /> DL</button>
                        )}
                      </div>
                    ))}
                  </div>
                </>
              )}

              {/* ── HISTORIC ── */}
              {activeTab === 'historic' && (
                <>
                  <p className="font-bold text-slate-500 uppercase tracking-wide">Línea temporal del elemento</p>
                  <div className="space-y-3">
                    {(selected.historic ?? []).map((ev, i) => (
                      <div key={ev.id} className="relative pl-4">
                        <div className="absolute left-0 top-1.5 w-2 h-2 rounded-full bg-blue-400" />
                        {i < (selected.historic?.length ?? 1) - 1 && <div className="absolute left-0.5 top-3.5 w-px h-full bg-slate-200" />}
                        <p className="font-bold text-slate-800">{ev.action}</p>
                        <p className="text-slate-600">{ev.result}</p>
                        <p className="text-slate-400 mt-0.5">{ev.date} {ev.time} · {ev.user} · {ev.module}</p>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Element list */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <p className="text-sm font-bold text-slate-900">Elementos ({visible.length} visibles)</p>
          <p className="text-xs text-slate-400">Clic para seleccionar</p>
        </div>
        <div className="divide-y divide-slate-100 max-h-56 overflow-y-auto">
          {visible.map(el => (
            <button
              key={el.id}
              onClick={() => { setSelected(el.id === selected?.id ? null : el); setActiveTab('info'); }}
              className={`w-full text-left flex items-center gap-2.5 px-4 py-2.5 transition-colors ${selected?.id === el.id ? 'bg-blue-50' : 'hover:bg-slate-50'}`}
            >
              <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: ELEMENT_STATUS_CFG[el.status].svgFill, border: `1.5px solid ${ELEMENT_STATUS_CFG[el.status].svgStroke}` }} />
              <span className="text-xs font-bold text-slate-700 w-40 flex-shrink-0 truncate">{el.name}</span>
              <span className="text-xs text-slate-400 w-28 flex-shrink-0 hidden lg:block">{el.code}</span>
              <ElementStatusBadge status={el.status} />
              <CategoryBadge category={el.category} />
              <ChevronRight size={12} className="text-slate-300 ml-auto" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
