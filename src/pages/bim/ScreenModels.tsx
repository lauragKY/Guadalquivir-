import React, { useState } from 'react';
import { Database, Upload, Download, RefreshCw, CheckCircle, Clock, AlertTriangle, Info } from 'lucide-react';
import { BIM_MODELS } from './mockData';
import { ModelStateBadge } from './helpers';
import type { Screen, BimModel } from './types';

interface Props { onNavigate: (s: Screen) => void; }

const FORMAT_COLOR: Record<string, string> = {
  IFC: 'bg-blue-100 text-blue-700 border-blue-200',
  RVT: 'bg-slate-100 text-slate-600 border-slate-200',
  DWG: 'bg-orange-100 text-orange-700 border-orange-200',
  FBX: 'bg-teal-100 text-teal-700 border-teal-200',
};

export default function ScreenModels({ onNavigate }: Props) {
  const [selected, setSelected] = useState<BimModel | null>(BIM_MODELS[0]);
  const [showUpload, setShowUpload] = useState(false);

  const published = BIM_MODELS.filter(m => m.state === 'published');
  const inReview  = BIM_MODELS.filter(m => m.state === 'review');
  const obsolete  = BIM_MODELS.filter(m => m.state === 'obsolete');

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Gestión de modelos BIM</h2>
          <p className="text-sm text-slate-500 mt-0.5">Versiones, publicación y sincronización SAIH</p>
        </div>
        <button
          onClick={() => setShowUpload(!showUpload)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl transition-colors"
        >
          <Upload size={14} /> Subir nuevo modelo
        </button>
      </div>

      {/* Upload form */}
      {showUpload && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 space-y-3">
          <p className="font-bold text-blue-900 text-sm">Subir nuevo modelo BIM</p>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Nombre del modelo</label>
              <input className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Nombre descriptivo..." />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Formato</label>
              <select className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>IFC</option><option>RVT</option><option>DWG</option><option>FBX</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Versión</label>
              <input className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. 3.3" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Descripción del cambio</label>
              <input className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Resumen de cambios..." />
            </div>
          </div>
          <div className="border-2 border-dashed border-blue-300 rounded-xl p-6 text-center">
            <Upload size={24} className="mx-auto text-blue-400 mb-2" />
            <p className="text-sm text-blue-700 font-semibold">Arrastra el archivo aquí o haz clic para seleccionar</p>
            <p className="text-xs text-blue-500 mt-0.5">Formatos: IFC, RVT, DWG, FBX · Máx. 2 GB</p>
          </div>
          <div className="flex gap-3">
            <button onClick={() => setShowUpload(false)} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold rounded-xl">Cancelar</button>
            <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl">Validar y subir</button>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Publicados', value: published.length, bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
          { label: 'En revisión', value: inReview.length,  bg: 'bg-amber-50',   text: 'text-amber-700',   border: 'border-amber-200' },
          { label: 'Obsoletos',  value: obsolete.length,  bg: 'bg-slate-50',   text: 'text-slate-600',   border: 'border-slate-200' },
        ].map(s => (
          <div key={s.label} className={`rounded-xl border ${s.border} ${s.bg} p-4 text-center`}>
            <p className={`text-2xl font-bold ${s.text}`}>{s.value}</p>
            <p className="text-xs text-slate-500 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Model list */}
        <div className="lg:col-span-1 space-y-2">
          {BIM_MODELS.map(model => (
            <button
              key={model.id}
              onClick={() => setSelected(model)}
              className={`w-full text-left rounded-xl border p-4 transition-all ${selected?.id === model.id ? 'border-blue-400 bg-blue-50 shadow-sm' : 'border-slate-200 bg-white hover:bg-slate-50'}`}
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <ModelStateBadge state={model.state} />
                <span className={`text-xs px-2 py-0.5 rounded border font-semibold ${FORMAT_COLOR[model.format]}`}>{model.format}</span>
              </div>
              <p className="text-xs font-bold text-slate-800 mb-0.5">{model.name}</p>
              <p className="text-xs text-slate-400">v{model.version} · {model.size_mb} MB · {model.elements_count.toLocaleString()} elem.</p>
              {model.saih_sync && (
                <div className="flex items-center gap-1 mt-1.5 text-xs text-teal-600">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse" />
                  SAIH sync
                </div>
              )}
            </button>
          ))}
        </div>

        {/* Model detail */}
        {selected && (
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-slate-900 text-base">{selected.name}</h3>
                    <ModelStateBadge state={selected.state} />
                    <span className={`text-xs px-2 py-0.5 rounded border font-semibold ${FORMAT_COLOR[selected.format]}`}>{selected.format}</span>
                  </div>
                  <p className="text-xs text-slate-500">v{selected.version} · {selected.version_date}</p>
                </div>
              </div>

              <p className="text-sm text-slate-700 mb-4">{selected.description}</p>

              <div className="grid grid-cols-2 gap-4 mb-4">
                {[
                  { label: 'Elementos', value: selected.elements_count.toLocaleString() },
                  { label: 'Tamaño', value: `${selected.size_mb} MB` },
                  { label: 'Autor', value: selected.author },
                  { label: 'Fecha versión', value: selected.version_date },
                  ...(selected.published_by ? [{ label: 'Publicado por', value: selected.published_by }] : []),
                  ...(selected.published_date ? [{ label: 'Fecha publicación', value: selected.published_date }] : []),
                ].map(item => (
                  <div key={item.label}>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-0.5">{item.label}</p>
                    <p className="text-sm text-slate-800">{item.value}</p>
                  </div>
                ))}
              </div>

              {selected.changes_summary && (
                <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 mb-4">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">Resumen de cambios</p>
                  <p className="text-sm text-slate-700">{selected.changes_summary}</p>
                </div>
              )}

              {/* SAIH sync */}
              {selected.saih_sync ? (
                <div className="bg-teal-50 border border-teal-200 rounded-xl p-4 mb-4 flex items-start gap-3">
                  <RefreshCw size={15} className="text-teal-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-bold text-teal-900 text-sm">Sincronización SAIH activa</p>
                    {selected.last_sync && <p className="text-xs text-teal-700 mt-0.5">Última sincronización: {selected.last_sync}</p>}
                    <p className="text-xs text-teal-600 mt-0.5">Los valores de sensores SAIH se actualizan automáticamente sobre este modelo.</p>
                  </div>
                </div>
              ) : (
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 mb-4 flex items-center gap-2 text-xs text-slate-500">
                  <Info size={13} /> Sincronización SAIH no habilitada para este modelo
                </div>
              )}

              {/* Status-specific actions */}
              <div className="flex flex-wrap gap-3">
                {selected.state === 'review' && (
                  <>
                    <button className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold rounded-xl">
                      <CheckCircle size={14} /> Aprobar y publicar
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2.5 bg-slate-600 hover:bg-slate-700 text-white text-sm font-bold rounded-xl">
                      Rechazar revisión
                    </button>
                  </>
                )}
                {selected.state === 'published' && (
                  <>
                    <button className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl">
                      <Download size={14} /> Descargar
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2.5 bg-slate-600 hover:bg-slate-700 text-white text-sm font-bold rounded-xl">
                      <Clock size={14} /> Marcar obsoleto
                    </button>
                  </>
                )}
                {selected.state === 'obsolete' && (
                  <button className="flex items-center gap-2 px-4 py-2.5 bg-slate-200 text-slate-500 text-sm font-bold rounded-xl cursor-not-allowed" disabled>
                    Modelo obsoleto · Solo lectura
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
