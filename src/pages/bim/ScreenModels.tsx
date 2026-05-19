import React, { useState } from 'react';
import {
  Database, Upload, Download, RefreshCw, CheckCircle, Clock,
  Info, Archive, ArrowRight, FileText, Eye
} from 'lucide-react';
import { BIM_MODELS } from './mockData';
import { ModelStateBadge } from './helpers';
import type { Screen, BimModel, ModelState } from './types';

interface Props { onNavigate: (s: Screen) => void; }

const FORMAT_COLOR: Record<string, string> = {
  IFC:  'bg-blue-100 text-blue-700 border-blue-200',
  RVT:  'bg-slate-100 text-slate-600 border-slate-200',
  DWG:  'bg-orange-100 text-orange-700 border-orange-200',
  FBX:  'bg-teal-100 text-teal-700 border-teal-200',
  glTF: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  NWD:  'bg-cyan-100 text-cyan-700 border-cyan-200',
};

const WORKFLOW_STEPS: { id: ModelState; label: string; desc: string }[] = [
  { id: 'pending',    label: '1. Cargar modelo',             desc: 'Subir archivo BIM original. Almacenado en Archivo Técnico.' },
  { id: 'processing', label: '2. Procesar modelo',           desc: 'Extracción de elementos críticos y verificación de formato.' },
  { id: 'optimized',  label: '3. Generar modelo optimizado', desc: 'Conversión a glTF/FBX con nivel de detalle operativo reducido.' },
  { id: 'published',  label: '4. Publicar en visor BIM',     desc: 'Publicación del modelo optimizado. Disponible en todos los visores.' },
];

export default function ScreenModels({ onNavigate }: Props) {
  const [selected, setSelected] = useState<BimModel | null>(BIM_MODELS[0]);
  const [showUpload, setShowUpload] = useState(false);
  const [uploadStep, setUploadStep] = useState(0);

  const simulateUpload = () => {
    setUploadStep(1);
    setTimeout(() => setUploadStep(2), 1200);
    setTimeout(() => setUploadStep(3), 2400);
    setTimeout(() => setUploadStep(4), 3600);
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Gestión de modelos BIM</h2>
          <p className="text-sm text-slate-500 mt-0.5">Versiones, flujo de publicación, sincronización SAIH</p>
        </div>
        <button onClick={() => setShowUpload(!showUpload)} className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl transition-colors">
          <Upload size={14} /> Subir nuevo modelo
        </button>
      </div>

      {/* Architecture notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
        <Info size={16} className="text-blue-600 flex-shrink-0 mt-0.5" />
        <div className="text-xs">
          <p className="font-bold text-blue-900 mb-1">Arquitectura BIM de SIPRESAS</p>
          <p className="text-blue-800">El modelo original (IFC/RVT, hasta varios GB) <strong>se conserva en Archivo Técnico</strong> y nunca se carga directamente en el visor. El visor BIM utiliza una <strong>versión optimizada</strong> (glTF/FBX, ~88 MB) para garantizar rendimiento. Los elementos críticos del modelo optimizado se vinculan a Inventario, Mantenimiento y Auscultación.</p>
          <div className="mt-2 flex items-center gap-1 text-blue-700">
            <Archive size={12} /> Ruta: <span className="font-mono ml-1">Archivo Técnico → BIM → Bembézar → Modelos originales</span>
          </div>
        </div>
      </div>

      {/* Workflow */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
        <h3 className="font-bold text-slate-900 text-sm mb-4">Flujo de publicación de modelo BIM</h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {WORKFLOW_STEPS.map((step, i) => {
            const states: ModelState[] = ['pending', 'processing', 'optimized', 'published'];
            const currentProgress = BIM_MODELS.filter(m => states.slice(0, i + 1).includes(m.state)).length;
            const isDone = BIM_MODELS.some(m => m.state === 'published') && i <= 3;
            return (
              <div key={step.id} className={`rounded-xl border p-3 text-xs ${isDone ? 'bg-emerald-50 border-emerald-200' : 'bg-slate-50 border-slate-200'}`}>
                <div className="flex items-center gap-2 mb-1.5">
                  {isDone
                    ? <CheckCircle size={13} className="text-emerald-600 flex-shrink-0" />
                    : <div className="w-3.5 h-3.5 rounded-full border-2 border-slate-400 flex-shrink-0" />
                  }
                  <p className="font-bold text-slate-800">{step.label}</p>
                </div>
                <p className="text-slate-600">{step.desc}</p>
                {i < 3 && <ArrowRight size={12} className="text-slate-400 mt-1.5 ml-auto" />}
              </div>
            );
          })}
        </div>
      </div>

      {/* Upload form */}
      {showUpload && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 space-y-4">
          <p className="font-bold text-blue-900 text-sm">Cargar nuevo modelo BIM</p>

          {uploadStep === 0 && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Nombre del modelo</label>
                  <input className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Bembézar_BIM_IFC_v2.ifc" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Formato</label>
                  <select className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none">
                    <option>IFC</option><option>RVT</option><option>DWG</option><option>NWD</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Versión</label>
                  <input className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="2.0" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Resumen de cambios</label>
                  <input className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Descripción de novedades..." />
                </div>
              </div>
              <div className="border-2 border-dashed border-blue-300 rounded-xl p-6 text-center">
                <Upload size={24} className="mx-auto text-blue-400 mb-2" />
                <p className="text-sm text-blue-700 font-semibold">Arrastra el archivo aquí o haz clic</p>
                <p className="text-xs text-blue-500 mt-0.5">El archivo se almacenará automáticamente en Archivo Técnico.</p>
                <p className="text-xs text-blue-400">Formatos: IFC, RVT, DWG, NWD · Máx. 2 GB</p>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setShowUpload(false)} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold rounded-xl">Cancelar</button>
                <button onClick={simulateUpload} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl">Validar y cargar modelo</button>
              </div>
            </>
          )}

          {uploadStep > 0 && (
            <div className="space-y-3">
              {[
                { step: 1, label: 'Almacenando en Archivo Técnico...', done: uploadStep > 1 },
                { step: 2, label: 'Procesando modelo y extrayendo elementos...', done: uploadStep > 2 },
                { step: 3, label: 'Generando modelo optimizado glTF...', done: uploadStep > 3 },
                { step: 4, label: 'Listo para publicar en visor BIM', done: uploadStep >= 4 },
              ].map(s => (
                <div key={s.step} className={`flex items-center gap-3 p-3 rounded-xl border text-sm ${s.done ? 'bg-emerald-50 border-emerald-200' : uploadStep === s.step ? 'bg-blue-50 border-blue-200' : 'bg-slate-50 border-slate-200'}`}>
                  {s.done
                    ? <CheckCircle size={16} className="text-emerald-600 flex-shrink-0" />
                    : uploadStep === s.step
                      ? <RefreshCw size={16} className="text-blue-600 animate-spin flex-shrink-0" />
                      : <Clock size={16} className="text-slate-400 flex-shrink-0" />
                  }
                  <span className={s.done ? 'text-emerald-800 font-semibold' : uploadStep === s.step ? 'text-blue-800 font-semibold' : 'text-slate-500'}>{s.label}</span>
                </div>
              ))}
              {uploadStep >= 4 && (
                <button className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold rounded-xl flex items-center gap-2">
                  <CheckCircle size={14} /> Aprobar y publicar en visor BIM
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Publicados',   value: BIM_MODELS.filter(m => m.state === 'published').length, bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
          { label: 'Optimizados', value: BIM_MODELS.filter(m => m.state === 'optimized').length,  bg: 'bg-amber-50',   text: 'text-amber-700',   border: 'border-amber-200' },
          { label: 'En revisión',  value: BIM_MODELS.filter(m => m.state === 'review').length,    bg: 'bg-blue-50',    text: 'text-blue-700',    border: 'border-blue-200' },
          { label: 'Obsoletos',   value: BIM_MODELS.filter(m => m.state === 'obsolete').length,   bg: 'bg-slate-50',   text: 'text-slate-600',   border: 'border-slate-200' },
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
            <button key={model.id} onClick={() => setSelected(model)}
              className={`w-full text-left rounded-xl border p-4 transition-all ${selected?.id === model.id ? 'border-blue-400 bg-blue-50 shadow-sm' : 'border-slate-200 bg-white hover:bg-slate-50'}`}>
              <div className="flex items-start justify-between gap-2 mb-2">
                <ModelStateBadge state={model.state} />
                <span className={`text-xs px-2 py-0.5 rounded border font-semibold ${FORMAT_COLOR[model.format_original]}`}>{model.format_original}</span>
              </div>
              <p className="text-xs font-bold text-slate-800 mb-0.5 font-mono">{model.name}</p>
              <p className="text-xs text-slate-400">v{model.version} · {model.size_original_mb} MB</p>
              {model.saih_sync && (
                <div className="flex items-center gap-1 mt-1 text-xs text-teal-600">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse" />SAIH sync
                </div>
              )}
            </button>
          ))}
        </div>

        {/* Model detail */}
        {selected && (
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
              <div className="flex items-start justify-between mb-4 flex-wrap gap-2">
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h3 className="font-bold text-slate-900 text-base font-mono">{selected.name}</h3>
                    <ModelStateBadge state={selected.state} />
                    <span className={`text-xs px-2 py-0.5 rounded border font-semibold ${FORMAT_COLOR[selected.format_original]}`}>{selected.format_original}</span>
                    {selected.format_optimized && (
                      <>
                        <ArrowRight size={12} className="text-slate-400" />
                        <span className={`text-xs px-2 py-0.5 rounded border font-semibold ${FORMAT_COLOR[selected.format_optimized]}`}>{selected.format_optimized} (optimizado)</span>
                      </>
                    )}
                  </div>
                  <p className="text-xs text-slate-500">v{selected.version} · {selected.version_date}</p>
                </div>
              </div>

              <p className="text-sm text-slate-700 mb-4">{selected.description}</p>

              <div className="grid grid-cols-2 gap-4 mb-4 text-xs">
                {[
                  { label: 'Tamaño original', value: `${selected.size_original_mb} MB` },
                  ...(selected.size_optimized_mb ? [{ label: 'Tamaño optimizado', value: `${selected.size_optimized_mb} MB` }] : []),
                  { label: 'Elementos', value: selected.elements_count.toLocaleString() },
                  { label: 'Autor', value: selected.author },
                  ...(selected.published_by ? [{ label: 'Publicado por', value: selected.published_by }] : []),
                  ...(selected.published_date ? [{ label: 'Fecha publicación', value: selected.published_date }] : []),
                  { label: 'Ruta Archivo Técnico', value: selected.archive_path },
                ].map(item => (
                  <div key={item.label}>
                    <p className="font-bold text-slate-500 uppercase tracking-wide mb-0.5">{item.label}</p>
                    <p className="text-slate-800 font-mono">{item.value}</p>
                  </div>
                ))}
              </div>

              {selected.changes_summary && (
                <div className="bg-slate-50 rounded-xl border border-slate-200 p-3 mb-4 text-xs">
                  <p className="font-bold text-slate-500 uppercase tracking-wide mb-1">Resumen de cambios</p>
                  <p className="text-slate-700">{selected.changes_summary}</p>
                </div>
              )}

              {selected.saih_sync ? (
                <div className="bg-teal-50 border border-teal-200 rounded-xl p-3 mb-4 flex items-start gap-2 text-xs">
                  <RefreshCw size={13} className="text-teal-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-bold text-teal-900">Sincronización SAIH activa</p>
                    {selected.last_sync && <p className="text-teal-700">Última: {selected.last_sync}</p>}
                  </div>
                </div>
              ) : (
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-2 mb-4 flex items-center gap-2 text-xs text-slate-500">
                  <Info size={12} /> Sincronización SAIH no activa para este modelo
                </div>
              )}

              <div className="flex flex-wrap gap-2">
                {selected.state === 'optimized' && (
                  <>
                    <button className="flex items-center gap-1.5 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold rounded-xl">
                      <CheckCircle size={13} /> Aprobar y publicar
                    </button>
                    <button className="flex items-center gap-1.5 px-4 py-2.5 bg-slate-600 hover:bg-slate-700 text-white text-sm font-bold rounded-xl">
                      Rechazar
                    </button>
                  </>
                )}
                {selected.state === 'published' && (
                  <>
                    <button className="flex items-center gap-1.5 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl">
                      <Eye size={13} /> Abrir en visor
                    </button>
                    <button className="flex items-center gap-1.5 px-4 py-2.5 bg-slate-600 hover:bg-slate-700 text-white text-sm font-bold rounded-xl">
                      <Download size={13} /> Descargar original
                    </button>
                    <button className="flex items-center gap-1.5 px-4 py-2.5 bg-slate-200 text-slate-600 text-sm font-bold rounded-xl">
                      <Clock size={13} /> Marcar obsoleto
                    </button>
                  </>
                )}
                {(selected.state === 'obsolete') && (
                  <button className="flex items-center gap-1.5 px-4 py-2.5 bg-slate-200 text-slate-500 text-sm font-bold rounded-xl" disabled>
                    Modelo obsoleto · Solo lectura
                  </button>
                )}
                <button className="flex items-center gap-1.5 px-4 py-2.5 bg-slate-50 border border-slate-300 text-slate-700 text-sm font-semibold rounded-xl">
                  <Archive size={13} /> Ver en Archivo Técnico
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
