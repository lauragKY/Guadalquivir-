import React, { useState } from 'react';
import { ArrowLeft, Download, CreditCard as Edit2, MoveRight, Link2, GitBranch, CheckCircle2, AlertTriangle, Clock, User, Calendar, Tag, Info, RotateCcw, ExternalLink } from 'lucide-react';
import type { Document } from './types';
import { DOCUMENTS } from './mockData';
import { CriticalityBadge, StatusBadge, FileIcon, DOCTYPE_LABELS, MODULE_LABELS, MODULE_COLORS, CRITICALITY_CONFIG } from './helpers';

type Tab = 'detalle' | 'versiones' | 'vinculos';

interface Props {
  docId: string;
  onBack: () => void;
  onMove: (docId: string) => void;
}

function AccessDeniedBanner() {
  return (
    <div className="bg-red-50 border-2 border-red-300 rounded-xl p-4 flex items-start gap-3 mt-4">
      <AlertTriangle size={20} className="text-red-600 flex-shrink-0 mt-0.5" />
      <div>
        <p className="font-bold text-red-800 text-sm">Acceso denegado</p>
        <p className="text-xs text-red-700 mt-0.5">Este documento está clasificado como <strong>Crítico</strong>. Solo puede acceder personal con perfil autorizado y necesidad de conocer documentada. Solicite acceso al Administrador SIPRESAS.</p>
      </div>
    </div>
  );
}

export default function ScreenDocDetail({ docId, onBack, onMove }: Props) {
  const doc = DOCUMENTS.find(d => d.id === docId);
  const [tab, setTab] = useState<Tab>('detalle');
  const [showCritDownload, setShowCritDownload] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const [restored, setRestored] = useState<string | null>(null);

  if (!doc) return (
    <div className="text-center py-24 text-slate-500">
      <p>Documento no encontrado</p>
      <button onClick={onBack} className="mt-4 text-blue-600 hover:underline text-sm">← Volver</button>
    </div>
  );

  const critConfig = CRITICALITY_CONFIG[doc.criticality];

  const handleDownload = () => {
    if (doc.criticality === 'critica') {
      setShowCritDownload(true);
    } else {
      alert(`Descarga registrada en auditoría.\nDocumento: ${doc.name}\nVersión: ${doc.version}`);
    }
  };

  const tabs: { id: Tab; label: string }[] = [
    { id: 'detalle',   label: 'Detalle y metadatos' },
    { id: 'versiones', label: `Versiones (${doc.versions.length})` },
    { id: 'vinculos',  label: `Módulos vinculados (${doc.links.length})` },
  ];

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-start gap-3">
        <button onClick={onBack} className="mt-1 p-2 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-700 transition-colors">
          <ArrowLeft size={18} />
        </button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 flex-wrap">
            <FileIcon format={doc.format} size={24} />
            <div>
              <h2 className="text-lg font-bold text-slate-900">{doc.name}</h2>
              <p className="text-xs text-slate-500 mt-0.5">{doc.folderPath} · {doc.alfrescoId}</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0 flex-wrap">
          <CriticalityBadge value={doc.criticality} />
          <StatusBadge value={doc.status} />
          <button onClick={handleDownload} className="flex items-center gap-1.5 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors">
            <Download size={15} /> Descargar
          </button>
          <button onClick={() => onMove(doc.id)} className="flex items-center gap-1.5 px-3 py-2 bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold rounded-lg transition-colors">
            <MoveRight size={15} /> Mover
          </button>
        </div>
      </div>

      {doc.criticality === 'critica' && <AccessDeniedBanner />}

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-100 p-1 rounded-xl w-fit">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${tab === t.id ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab: Detalle */}
      {tab === 'detalle' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
              <h3 className="font-bold text-slate-800 flex items-center gap-2"><Info size={16} className="text-blue-600" /> Metadatos del documento</h3>
              <button className="flex items-center gap-1 text-xs text-blue-600 hover:underline"><Edit2 size={12} /> Editar</button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <p className="text-xs text-slate-400 mb-1">Descripción</p>
                <p className="text-sm text-slate-700 leading-relaxed">{doc.description}</p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                {[
                  { label: 'Tipo documental', value: DOCTYPE_LABELS[doc.type] },
                  { label: 'Formato', value: doc.format },
                  { label: 'Tamaño', value: doc.size },
                  { label: 'Versión actual', value: `v${doc.version}` },
                  { label: 'ID Alfresco', value: doc.alfrescoId },
                  { label: 'Estado', value: doc.status },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <p className="text-xs text-slate-400 mb-0.5">{label}</p>
                    <p className="font-semibold text-slate-700">{value}</p>
                  </div>
                ))}
              </div>
              <div>
                <p className="text-xs text-slate-400 mb-1.5">Etiquetas</p>
                <div className="flex flex-wrap gap-1.5">
                  {doc.tags.map(tag => (
                    <span key={tag} className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                      <Tag size={10} />{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-4 py-3 border-b border-slate-100 bg-slate-50">
                <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Criticidad y acceso</p>
              </div>
              <div className="p-4 space-y-3">
                <div className={`rounded-xl p-3 border ${critConfig.border} ${critConfig.badge}`}>
                  <p className="text-xs font-bold uppercase tracking-wide mb-1">Nivel: {critConfig.label}</p>
                  <p className="text-xs opacity-80">{
                    doc.criticality === 'baja'    ? 'Acceso general autorizado a todos los perfiles.' :
                    doc.criticality === 'media'   ? 'Acceso a perfiles internos autorizados.' :
                    doc.criticality === 'alta'    ? 'Acceso restringido a personal técnico y directivos.' :
                    'Acceso solo por necesidad de conocer. Descarga registrada en auditoría.'
                  }</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-4 py-3 border-b border-slate-100 bg-slate-50">
                <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Trazabilidad</p>
              </div>
              <div className="p-4 space-y-2 text-xs">
                {[
                  { icon: Calendar, label: 'Creado',        value: doc.createdAt, sub: doc.createdBy },
                  { icon: Clock,    label: 'Modificado',    value: doc.updatedAt, sub: doc.updatedBy },
                  { icon: User,     label: 'Responsable',   value: doc.updatedBy },
                ].map(({ icon: Icon, label, value, sub }) => (
                  <div key={label} className="flex items-start gap-2">
                    <Icon size={13} className="text-slate-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="text-slate-400">{label}: </span>
                      <span className="font-medium text-slate-700">{value}</span>
                      {sub && <p className="text-slate-400 text-xs">{sub}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Versiones */}
      {tab === 'versiones' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 bg-slate-50">
            <h3 className="font-bold text-slate-800 flex items-center gap-2"><GitBranch size={16} className="text-blue-600" /> Histórico de versiones</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="text-center px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Versión</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Fecha</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Usuario</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Motivo del cambio</th>
                  <th className="text-center px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Estado</th>
                  <th className="text-center px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {doc.versions.map(v => (
                  <tr key={v.version} className={v.active ? 'bg-blue-50/40' : 'hover:bg-slate-50'}>
                    <td className="px-4 py-3 text-center font-mono font-bold text-slate-700">v{v.version}</td>
                    <td className="px-4 py-3 text-slate-600">{v.date}</td>
                    <td className="px-4 py-3 text-slate-600">{v.user}</td>
                    <td className="px-4 py-3 text-slate-600">{v.reason}</td>
                    <td className="px-4 py-3 text-center">
                      {v.active
                        ? <span className="inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700"><CheckCircle2 size={11} />Activa</span>
                        : <span className="text-xs text-slate-400">Histórica</span>
                      }
                    </td>
                    <td className="px-4 py-3 text-center">
                      {!v.active && (
                        <button
                          onClick={() => setRestored(v.version)}
                          className="flex items-center gap-1 text-xs text-amber-600 hover:underline font-medium mx-auto"
                        >
                          <RotateCcw size={11} /> Restaurar
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {restored && (
            <div className="px-5 py-3 bg-amber-50 border-t border-amber-200 flex items-center gap-2 text-sm text-amber-800">
              <CheckCircle2 size={14} className="text-amber-600" />
              Versión v{restored} restaurada. Acción registrada en auditoría.
              <button onClick={() => setRestored(null)} className="ml-auto"><X size={14} /></button>
            </div>
          )}
        </div>
      )}

      {/* Tab: Vínculos */}
      {tab === 'vinculos' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
            <h3 className="font-bold text-slate-800 flex items-center gap-2"><Link2 size={16} className="text-blue-600" /> Módulos vinculados</h3>
            <button className="flex items-center gap-1.5 text-xs text-blue-600 hover:underline font-medium"><Link2 size={12} /> Añadir vínculo</button>
          </div>
          <div className="p-5">
            {doc.links.length === 0 ? (
              <p className="text-sm text-slate-500 text-center py-8">Sin vínculos configurados</p>
            ) : (
              <div className="space-y-3">
                {doc.links.map((link, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl">
                    <span className={`inline-flex items-center text-xs font-bold px-2.5 py-1 rounded-full ${MODULE_COLORS[link.module]}`}>
                      {MODULE_LABELS[link.module]}
                    </span>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-800">{link.label}</p>
                      <p className="text-xs text-slate-400 font-mono">{link.ref}</p>
                    </div>
                    <button className="text-slate-400 hover:text-blue-600 transition-colors"><ExternalLink size={14} /></button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal descarga crítica */}
      {showCritDownload && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center flex-shrink-0">
                <AlertTriangle size={20} className="text-red-600" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900">Información clasificada como CRÍTICA</h3>
                <p className="text-xs text-slate-500 mt-0.5">{doc.name}</p>
              </div>
            </div>
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-900">
              Este documento está clasificado como <strong>información crítica</strong>. Su acceso y descarga quedan registrados en el sistema de auditoría. Confirme que dispone de autorización y <strong>necesidad de conocer</strong> antes de proceder.
            </div>
            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" checked={accepted} onChange={e => setAccepted(e.target.checked)} className="mt-0.5 w-4 h-4 rounded border-slate-300 text-red-600 focus:ring-red-500" />
              <span className="text-sm text-slate-700">Acepto la responsabilidad del acceso y descarga de este documento y confirmo tener necesidad de conocer.</span>
            </label>
            <div className="flex gap-3 pt-1">
              <button onClick={() => { setShowCritDownload(false); setAccepted(false); }} className="flex-1 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm rounded-xl transition-colors">
                Cancelar
              </button>
              <button
                onClick={() => { setShowCritDownload(false); setAccepted(false); alert('Descarga registrada en auditoría.'); }}
                disabled={!accepted}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold text-sm rounded-xl transition-colors"
              >
                <Download size={15} /> Aceptar y descargar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
