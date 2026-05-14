import React, { useState } from 'react';
import { Shield, CreditCard as Edit2, CheckCircle2, AlertTriangle, Info, ChevronDown } from 'lucide-react';
import { DOCUMENTS } from './mockData';
import type { Document, Criticality } from './types';
import { CriticalityBadge, StatusBadge, FileIcon, DOCTYPE_LABELS, CRITICALITY_CONFIG } from './helpers';

const RULES: Record<Criticality, { label: string; desc: string; icon: React.ReactNode; cls: string }> = {
  baja:    { label: 'Baja',   desc: 'Acceso general autorizado a todos los perfiles de SIPRESAS.',                                                           icon: <CheckCircle2 size={14} />, cls: 'bg-emerald-50 border-emerald-200 text-emerald-800' },
  media:   { label: 'Media',  desc: 'Acceso a perfiles internos autorizados: técnicos, explotación, dirección.',                                            icon: <Info size={14} />,         cls: 'bg-blue-50 border-blue-200 text-blue-800' },
  alta:    { label: 'Alta',   desc: 'Acceso restringido a personal técnico senior, directivos y Director del Plan. Descarga registrada.',                   icon: <AlertTriangle size={14} />, cls: 'bg-amber-50 border-amber-200 text-amber-800' },
  critica: { label: 'Crítica',desc: 'Acceso exclusivo por necesidad de conocer documentada. Toda descarga requiere aceptación de responsabilidad y queda auditada.', icon: <Shield size={14} />,       cls: 'bg-red-50 border-red-200 text-red-800' },
};

interface EditModal {
  docs: Document[];
  newCrit: Criticality | '';
  reason: string;
}

export default function ScreenCriticidad() {
  const [docs, setDocs]             = useState<Document[]>(DOCUMENTS);
  const [selected, setSelected]     = useState<Set<string>>(new Set());
  const [editModal, setEditModal]   = useState<EditModal | null>(null);
  const [saved, setSaved]           = useState<string | null>(null);

  const toggleSelect = (id: string) => {
    setSelected(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  };
  const toggleAll = () => {
    if (selected.size === docs.length) setSelected(new Set());
    else setSelected(new Set(docs.map(d => d.id)));
  };

  const openEdit = (single?: Document) => {
    const target = single ? [single] : docs.filter(d => selected.has(d.id));
    if (!target.length) return;
    setEditModal({ docs: target, newCrit: '', reason: '' });
  };

  const confirmEdit = () => {
    if (!editModal || !editModal.newCrit || !editModal.reason) return;
    const ids = new Set(editModal.docs.map(d => d.id));
    setDocs(prev => prev.map(d => ids.has(d.id) ? { ...d, criticality: editModal.newCrit as Criticality } : d));
    setSaved(editModal.docs.length === 1 ? editModal.docs[0].name : `${editModal.docs.length} documentos`);
    setEditModal(null);
    setSelected(new Set());
    setTimeout(() => setSaved(null), 3000);
  };

  return (
    <div className="space-y-5">
      {/* Reglas de acceso */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {(Object.entries(RULES) as [Criticality, typeof RULES[Criticality]][]).map(([crit, rule]) => (
          <div key={crit} className={`rounded-xl border p-4 ${rule.cls}`}>
            <div className="flex items-center gap-2 mb-2">
              {rule.icon}
              <p className="font-bold text-sm">{rule.label}</p>
            </div>
            <p className="text-xs leading-relaxed opacity-90">{rule.desc}</p>
          </div>
        ))}
      </div>

      {/* Aviso */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex items-start gap-2 text-xs text-slate-700">
        <Shield size={14} className="text-blue-600 flex-shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold">Sección de administrador. </span>
          Los cambios de criticidad quedan registrados en el sistema de auditoría e implican modificaciones en los permisos de acceso y descarga de forma inmediata.
        </div>
      </div>

      {saved && (
        <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3 text-sm text-emerald-800 font-semibold">
          <CheckCircle2 size={16} className="text-emerald-600" />
          Criticidad actualizada para: {saved}. Cambio registrado en auditoría.
        </div>
      )}

      {/* Tabla */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between gap-3 flex-wrap">
          <h3 className="font-bold text-slate-800 flex items-center gap-2"><Shield size={16} className="text-blue-600" /> Documentos — Gestión de criticidad</h3>
          {selected.size > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500">{selected.size} seleccionado{selected.size > 1 ? 's' : ''}</span>
              <button
                onClick={() => openEdit()}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition-colors"
              >
                <Edit2 size={12} /> Cambiar criticidad ({selected.size})
              </button>
            </div>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-4 py-3 w-10">
                  <input type="checkbox" checked={selected.size === docs.length} onChange={toggleAll} className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Documento</th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Tipo</th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Ruta</th>
                <th className="text-center px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Estado</th>
                <th className="text-center px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Criticidad actual</th>
                <th className="text-center px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {docs.map(doc => (
                <tr key={doc.id} className={`hover:bg-slate-50 transition-colors ${selected.has(doc.id) ? 'bg-blue-50/30' : ''}`}>
                  <td className="px-4 py-3 text-center">
                    <input type="checkbox" checked={selected.has(doc.id)} onChange={() => toggleSelect(doc.id)} className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <FileIcon format={doc.format} size={16} />
                      <span className="font-medium text-slate-800 truncate max-w-[200px]">{doc.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-600">{DOCTYPE_LABELS[doc.type]}</td>
                  <td className="px-4 py-3 text-xs text-slate-500 max-w-[160px] truncate">{doc.folderPath}</td>
                  <td className="px-4 py-3 text-center"><StatusBadge value={doc.status} /></td>
                  <td className="px-4 py-3 text-center"><CriticalityBadge value={doc.criticality} /></td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => openEdit(doc)}
                      className="flex items-center gap-1 text-xs text-blue-600 hover:underline font-semibold mx-auto"
                    >
                      <Edit2 size={12} /> Cambiar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de cambio de criticidad */}
      {editModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                <Shield size={20} className="text-blue-600" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900">Cambiar criticidad</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {editModal.docs.length === 1 ? editModal.docs[0].name : `${editModal.docs.length} documentos seleccionados`}
                </p>
              </div>
            </div>

            {editModal.docs.length === 1 && (
              <div className="flex items-center gap-3 text-xs">
                <span className="text-slate-400">Criticidad actual:</span>
                <CriticalityBadge value={editModal.docs[0].criticality} />
              </div>
            )}

            <div>
              <label className="block text-xs font-bold uppercase tracking-wide text-slate-500 mb-1.5">Nueva criticidad *</label>
              <div className="relative">
                <select
                  value={editModal.newCrit}
                  onChange={e => setEditModal(prev => prev ? { ...prev, newCrit: e.target.value as Criticality } : null)}
                  className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-sm appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Seleccionar...</option>
                  <option value="baja">Baja — Acceso general</option>
                  <option value="media">Media — Perfiles internos</option>
                  <option value="alta">Alta — Acceso restringido</option>
                  <option value="critica">Crítica — Necesidad de conocer</option>
                </select>
                <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </div>

            {editModal.newCrit && (
              <div className={`rounded-xl border p-3 text-xs ${RULES[editModal.newCrit].cls}`}>
                {RULES[editModal.newCrit].desc}
              </div>
            )}

            <div>
              <label className="block text-xs font-bold uppercase tracking-wide text-slate-500 mb-1.5">Motivo del cambio *</label>
              <textarea
                value={editModal.reason}
                onChange={e => setEditModal(prev => prev ? { ...prev, reason: e.target.value } : null)}
                rows={3}
                placeholder="Indique el motivo del cambio de criticidad..."
                className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>

            <div className="flex gap-3 pt-2 border-t border-slate-100">
              <button onClick={() => setEditModal(null)} className="flex-1 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm rounded-xl transition-colors">Cancelar</button>
              <button
                onClick={confirmEdit}
                disabled={!editModal.newCrit || !editModal.reason}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold text-sm rounded-xl transition-colors"
              >
                <Shield size={15} /> Confirmar cambio
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
