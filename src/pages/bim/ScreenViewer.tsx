import React, { useState } from 'react';
import {
  Layers, Filter, X, ChevronRight, Wrench, Activity, Database,
  FileText, AlertTriangle, CheckCircle, Info, ZoomIn, ZoomOut, RotateCw, Maximize2
} from 'lucide-react';
import { BIM_ELEMENTS } from './mockData';
import {
  ELEMENT_STATUS_CFG, CATEGORY_CFG, CRITICALITY_CFG,
  ElementStatusBadge, CategoryBadge, AlertSourceBadge
} from './helpers';
import type { Screen, BimElement, ActiveFilters, ElementCategory, ElementStatus, LayerSource } from './types';

interface Props { onNavigate: (s: Screen) => void; }

const LEGEND = [
  { status: 'operational'        as ElementStatus, label: 'Operativo' },
  { status: 'revision_pending'   as ElementStatus, label: 'Revisión pendiente' },
  { status: 'failure'            as ElementStatus, label: 'Avería' },
  { status: 'threshold_exceeded' as ElementStatus, label: 'Umbral superado' },
  { status: 'no_data'            as ElementStatus, label: 'Sin datos' },
];

export default function ScreenViewer({ onNavigate }: Props) {
  const [selected, setSelected] = useState<BimElement | null>(null);
  const [filters, setFilters] = useState<ActiveFilters>({ category: 'all', status: 'all', criticality: 'all', layer: 'all' });
  const [showFilters, setShowFilters] = useState(false);
  const [activeTab, setActiveTab] = useState<'info' | 'maintenance' | 'auscultation' | 'exploitation' | 'archive'>('info');

  const visible = BIM_ELEMENTS.filter(e => {
    if (filters.category !== 'all' && e.category !== filters.category) return false;
    if (filters.status !== 'all' && e.status !== filters.status) return false;
    if (filters.criticality !== 'all' && e.criticality !== filters.criticality) return false;
    if (filters.layer !== 'all' && !e.layer.includes(filters.layer as LayerSource)) return false;
    return true;
  });

  const visibleIds = new Set(visible.map(e => e.id));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-900">Visor BIM — Sección transversal</h2>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 px-3 py-1.5 text-sm font-semibold rounded-lg border transition-colors ${showFilters ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'}`}
        >
          <Filter size={13} /> Filtros
        </button>
      </div>

      {/* Filters panel */}
      {showFilters && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 grid grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Category */}
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-slate-500 mb-1.5">Categoría</p>
            <select value={filters.category} onChange={e => setFilters(f => ({ ...f, category: e.target.value as ElementCategory | 'all' }))} className="w-full text-xs border border-slate-300 rounded-lg px-2 py-1.5 focus:outline-none">
              <option value="all">Todas</option>
              {Object.entries(CATEGORY_CFG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
            </select>
          </div>
          {/* Status */}
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-slate-500 mb-1.5">Estado</p>
            <select value={filters.status} onChange={e => setFilters(f => ({ ...f, status: e.target.value as ElementStatus | 'all' }))} className="w-full text-xs border border-slate-300 rounded-lg px-2 py-1.5 focus:outline-none">
              <option value="all">Todos</option>
              {Object.entries(ELEMENT_STATUS_CFG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
            </select>
          </div>
          {/* Criticality */}
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-slate-500 mb-1.5">Criticidad</p>
            <select value={filters.criticality} onChange={e => setFilters(f => ({ ...f, criticality: e.target.value as ActiveFilters['criticality'] }))} className="w-full text-xs border border-slate-300 rounded-lg px-2 py-1.5 focus:outline-none">
              <option value="all">Todas</option>
              {Object.entries(CRITICALITY_CFG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
            </select>
          </div>
          {/* Layer */}
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-slate-500 mb-1.5">Módulo/capa</p>
            <select value={filters.layer} onChange={e => setFilters(f => ({ ...f, layer: e.target.value as LayerSource | 'all' }))} className="w-full text-xs border border-slate-300 rounded-lg px-2 py-1.5 focus:outline-none">
              <option value="all">Todos</option>
              <option value="inventory">Inventario</option>
              <option value="maintenance">Mantenimiento</option>
              <option value="exploitation">Explotación</option>
              <option value="auscultation">Auscultación</option>
              <option value="archive">Archivo Técnico</option>
            </select>
          </div>
        </div>
      )}

      <div className="flex gap-4">
        {/* SVG Viewer */}
        <div className="flex-1 bg-gradient-to-b from-sky-100 to-slate-100 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden" style={{ minHeight: 440 }}>
          {/* Toolbar */}
          <div className="absolute top-3 left-3 flex gap-1.5 z-10">
            {[<ZoomIn size={14} />, <ZoomOut size={14} />, <RotateCw size={14} />, <Maximize2 size={14} />].map((icon, i) => (
              <button key={i} className="p-1.5 bg-white rounded-lg border border-slate-300 shadow-sm hover:bg-slate-50 transition-colors text-slate-600">{icon}</button>
            ))}
          </div>

          {/* Legend */}
          <div className="absolute top-3 right-3 bg-white rounded-lg border border-slate-200 shadow-sm p-2 z-10">
            <p className="text-xs font-bold text-slate-600 mb-1.5">Leyenda</p>
            <div className="space-y-1">
              {LEGEND.map(l => (
                <div key={l.status} className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ backgroundColor: ELEMENT_STATUS_CFG[l.status].svgFill, border: `1.5px solid ${ELEMENT_STATUS_CFG[l.status].svgStroke}` }} />
                  <span className="text-xs text-slate-600">{l.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* SVG cross-section */}
          <svg viewBox="0 30 600 380" className="w-full h-full" style={{ minHeight: 400 }}>
            {/* Water / reservoir */}
            <rect x="0" y="220" width="200" height="170" fill="#bfdbfe" opacity="0.7" />
            <text x="60" y="310" fontSize="9" fill="#1e40af" fontWeight="bold">EMBALSE</text>
            <text x="45" y="323" fontSize="8" fill="#1e40af">NE = 600.92m</text>
            {/* Water surface line */}
            <line x1="0" y1="220" x2="200" y2="220" stroke="#3b82f6" strokeWidth="1.5" strokeDasharray="4 2" />

            {/* River / downstream */}
            <rect x="480" y="340" width="120" height="50" fill="#bfdbfe" opacity="0.5" />
            <text x="502" y="365" fontSize="8" fill="#1e40af">Río Guadalmena</text>

            {/* Ground */}
            <rect x="0" y="360" width="600" height="30" fill="#78716c" opacity="0.3" />

            {/* Render each BIM element */}
            {BIM_ELEMENTS.map(el => {
              const isVisible = visibleIds.has(el.id);
              const cfg = ELEMENT_STATUS_CFG[el.status];
              const isSelected = selected?.id === el.id;
              const opacity = isVisible ? 1 : 0.15;

              if (el.svgType === 'polygon' && el.points) {
                return (
                  <g key={el.id} style={{ cursor: 'pointer', opacity }} onClick={() => isVisible && setSelected(isSelected ? null : el)}>
                    <polygon
                      points={el.points}
                      fill={cfg.svgFill}
                      stroke={isSelected ? '#1d4ed8' : cfg.svgStroke}
                      strokeWidth={isSelected ? 2.5 : 1.5}
                    />
                    <text x="300" y="270" fontSize="8" fill="#334155" textAnchor="middle" fontWeight="bold">{el.code}</text>
                  </g>
                );
              }
              if (el.svgType === 'ellipse') {
                const cx = el.x + el.width / 2;
                const cy = el.y + el.height / 2;
                const rx = el.width / 2;
                const ry = el.height / 2;
                return (
                  <g key={el.id} style={{ cursor: 'pointer', opacity }} onClick={() => isVisible && setSelected(isSelected ? null : el)}>
                    <ellipse
                      cx={cx} cy={cy} rx={rx} ry={ry}
                      fill={cfg.svgFill}
                      stroke={isSelected ? '#1d4ed8' : cfg.svgStroke}
                      strokeWidth={isSelected ? 2.5 : 1.5}
                    />
                    {isSelected && <circle cx={cx} cy={cy} r={Math.max(rx, ry) + 4} fill="none" stroke="#1d4ed8" strokeWidth="1.5" strokeDasharray="3 2" />}
                  </g>
                );
              }
              // rect
              return (
                <g key={el.id} style={{ cursor: 'pointer', opacity }} onClick={() => isVisible && setSelected(isSelected ? null : el)}>
                  <rect
                    x={el.x} y={el.y} width={el.width} height={el.height}
                    fill={cfg.svgFill}
                    stroke={isSelected ? '#1d4ed8' : cfg.svgStroke}
                    strokeWidth={isSelected ? 2.5 : 1.5}
                    rx="2"
                  />
                  {isSelected && (
                    <rect x={el.x - 3} y={el.y - 3} width={el.width + 6} height={el.height + 6} fill="none" stroke="#1d4ed8" strokeWidth="1.5" strokeDasharray="3 2" rx="3" />
                  )}
                </g>
              );
            })}

            {/* Labels for key items */}
            <text x="185" y="147" fontSize="7" fill="#475569">Coronación 610m</text>
            <text x="185" y="364" fontSize="7" fill="#475569">Cota 535m</text>
            <text x="510" y="358" fontSize="7" fill="#475569" textAnchor="middle">Aguas abajo</text>
          </svg>

          {/* Hint */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-white/90 text-xs text-slate-500 px-3 py-1 rounded-full border border-slate-200 shadow-sm">
            Haz clic en un elemento para ver su ficha integrada
          </div>
        </div>

        {/* Context panel */}
        {selected && (
          <div className="w-80 flex-shrink-0 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col overflow-hidden" style={{ maxHeight: 480, overflowY: 'auto' }}>
            <div className="px-4 py-3 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="min-w-0">
                <p className="text-xs font-bold text-slate-800 truncate">{selected.name}</p>
                <p className="text-xs text-slate-400">{selected.code}</p>
              </div>
              <button onClick={() => setSelected(null)} className="text-slate-400 hover:text-slate-700 flex-shrink-0 ml-2"><X size={14} /></button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-slate-200 overflow-x-auto">
              {[
                { id: 'info' as const, label: 'Info', icon: <Info size={11} /> },
                selected.maintenance_last_date ? { id: 'maintenance' as const, label: 'Mant.', icon: <Wrench size={11} /> } : null,
                selected.auscultation_variable  ? { id: 'auscultation' as const, label: 'Ausc.', icon: <Activity size={11} /> } : null,
                selected.exploitation_status    ? { id: 'exploitation' as const, label: 'Explot.', icon: <Database size={11} /> } : null,
                selected.archive_docs           ? { id: 'archive' as const, label: 'Archivo', icon: <FileText size={11} /> } : null,
              ].filter(Boolean).map(tab => tab && (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1 px-3 py-2 text-xs font-semibold whitespace-nowrap transition-colors border-b-2 ${activeTab === tab.id ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                >
                  {tab.icon} {tab.label}
                </button>
              ))}
            </div>

            <div className="p-4 flex-1 space-y-3 text-xs">
              {activeTab === 'info' && (
                <>
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    <ElementStatusBadge status={selected.status} />
                    <CategoryBadge category={selected.category} />
                    <span className={`text-xs px-2 py-0.5 rounded border font-semibold ${CRITICALITY_CFG[selected.criticality].color}`}>
                      Criticidad {CRITICALITY_CFG[selected.criticality].label.toLowerCase()}
                    </span>
                  </div>
                  <p className="text-slate-700">{selected.description}</p>
                  {selected.material && <div><p className="font-bold text-slate-500 uppercase tracking-wide mb-0.5">Material</p><p className="text-slate-800">{selected.material}</p></div>}
                  {selected.dimensions && <div><p className="font-bold text-slate-500 uppercase tracking-wide mb-0.5">Dimensiones</p><p className="text-slate-800">{selected.dimensions}</p></div>}
                  {selected.last_inspection && <div><p className="font-bold text-slate-500 uppercase tracking-wide mb-0.5">Última inspección</p><p className="text-slate-800">{selected.last_inspection}</p></div>}
                </>
              )}

              {activeTab === 'maintenance' && (
                <>
                  <p className="font-bold text-slate-500 uppercase tracking-wide">Módulo Mantenimiento</p>
                  {selected.maintenance_status && (
                    <div className={`rounded-lg border p-2 ${selected.maintenance_status.includes('AVERIA') ? 'bg-red-50 border-red-200' : selected.maintenance_status.includes('pendiente') ? 'bg-amber-50 border-amber-200' : 'bg-emerald-50 border-emerald-200'}`}>
                      <p className="font-semibold text-slate-800">{selected.maintenance_status}</p>
                    </div>
                  )}
                  {selected.maintenance_last_date && <div><p className="text-slate-500 mb-0.5">Última actuación</p><p className="font-semibold text-slate-800">{selected.maintenance_last_date}</p></div>}
                  {selected.maintenance_next_date && <div><p className="text-slate-500 mb-0.5">Próxima actuación</p><p className="font-semibold text-slate-800">{selected.maintenance_next_date}</p></div>}
                  {selected.maintenance_last_pdf && (
                    <button className="flex items-center gap-1.5 text-blue-600 hover:text-blue-800 font-semibold">
                      <FileText size={12} /> Descargar último informe PDF
                    </button>
                  )}
                </>
              )}

              {activeTab === 'auscultation' && (
                <>
                  <p className="font-bold text-slate-500 uppercase tracking-wide">Módulo Auscultación</p>
                  {selected.auscultation_variable && <div><p className="text-slate-500 mb-0.5">Variable</p><p className="font-semibold text-slate-800">{selected.auscultation_variable}</p></div>}
                  {selected.auscultation_value && (
                    <div className="grid grid-cols-2 gap-2">
                      <div className="bg-slate-50 rounded-lg p-2 border border-slate-200">
                        <p className="text-slate-500 mb-0.5">Valor actual</p>
                        <p className="font-bold text-slate-900 font-mono">{selected.auscultation_value} {selected.auscultation_unit}</p>
                      </div>
                      <div className="bg-slate-50 rounded-lg p-2 border border-slate-200">
                        <p className="text-slate-500 mb-0.5">Umbral S.E.</p>
                        <p className="font-bold text-slate-900 font-mono">{selected.auscultation_threshold} {selected.auscultation_unit}</p>
                      </div>
                    </div>
                  )}
                  {selected.auscultation_status && (
                    <div className={`rounded-lg border p-2 ${selected.status === 'threshold_exceeded' ? 'bg-orange-50 border-orange-200' : 'bg-emerald-50 border-emerald-200'}`}>
                      <p className="font-semibold text-slate-800">{selected.auscultation_status}</p>
                    </div>
                  )}
                </>
              )}

              {activeTab === 'exploitation' && (
                <>
                  <p className="font-bold text-slate-500 uppercase tracking-wide">Módulo Explotación</p>
                  {selected.exploitation_status && (
                    <div className={`rounded-lg border p-2 ${selected.exploitation_status.includes('S. Extraordinaria') || selected.exploitation_status.includes('Avenida') ? 'bg-amber-50 border-amber-200' : 'bg-emerald-50 border-emerald-200'}`}>
                      <p className="font-semibold text-slate-800">{selected.exploitation_status}</p>
                    </div>
                  )}
                </>
              )}

              {activeTab === 'archive' && (
                <>
                  <p className="font-bold text-slate-500 uppercase tracking-wide">Archivo Técnico</p>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-2">
                    <p className="font-semibold text-blue-800">{selected.archive_docs} documento(s) vinculado(s)</p>
                  </div>
                  {[
                    { name: 'Plano constructivo', type: 'DWG', date: '2018' },
                    { name: 'Manual operación', type: 'PDF', date: '2022' },
                    { name: 'Ficha técnica', type: 'PDF', date: '2024' },
                  ].slice(0, selected.archive_docs ?? 0).map((d, i) => (
                    <div key={i} className="flex items-center gap-2 px-2 py-1.5 bg-slate-50 rounded border border-slate-200">
                      <FileText size={11} className="text-slate-400 flex-shrink-0" />
                      <span className="flex-1 truncate text-slate-700">{d.name}</span>
                      <span className="text-slate-400 text-xs">{d.type} · {d.date}</span>
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Element list below viewer */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <p className="text-sm font-bold text-slate-900">Elementos ({visible.length})</p>
          <p className="text-xs text-slate-400">Haz clic para seleccionar en el visor</p>
        </div>
        <div className="divide-y divide-slate-100">
          {visible.map(el => (
            <button
              key={el.id}
              onClick={() => setSelected(el.id === selected?.id ? null : el)}
              className={`w-full text-left flex items-center gap-3 px-4 py-2.5 transition-colors ${selected?.id === el.id ? 'bg-blue-50' : 'hover:bg-slate-50'}`}
            >
              <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: ELEMENT_STATUS_CFG[el.status].svgFill, border: `1.5px solid ${ELEMENT_STATUS_CFG[el.status].svgStroke}` }} />
              <span className="text-xs font-bold text-slate-700 w-32 flex-shrink-0 truncate">{el.name}</span>
              <span className="text-xs text-slate-400 w-28 flex-shrink-0">{el.code}</span>
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
