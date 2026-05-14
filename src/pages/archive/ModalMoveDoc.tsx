import React, { useState } from 'react';
import { X, MoveRight, Folder, ChevronRight, CheckCircle2, AlertTriangle, Info } from 'lucide-react';
import { DOCUMENTS, FOLDERS } from './mockData';
import { MODULE_LABELS, FileIcon } from './helpers';
import type { Folder as FolderType } from './types';

interface Props {
  docId: string;
  onClose: () => void;
}

function FolderPicker({ selected, onSelect }: { selected: string; onSelect: (id: string) => void }) {
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  const roots = FOLDERS.filter(f => f.parentId === null).sort((a, b) => a.order - b.order);
  const toggle = (id: string) => setExpanded(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });

  const renderFolder = (f: FolderType, level = 0): React.ReactNode => {
    const children = FOLDERS.filter(c => c.parentId === f.id);
    const isExpanded = expanded.has(f.id);
    const isSelected = selected === f.id;
    return (
      <div key={f.id}>
        <button
          onClick={() => { onSelect(f.id); if (children.length) toggle(f.id); }}
          style={{ paddingLeft: `${level * 16 + 8}px` }}
          className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-sm transition-colors ${isSelected ? 'bg-blue-100 text-blue-800 font-semibold' : 'text-slate-700 hover:bg-slate-100'}`}
        >
          {children.length > 0
            ? (isExpanded ? <ChevronRight size={12} className="rotate-90 text-slate-400" /> : <ChevronRight size={12} className="text-slate-400" />)
            : <span className="w-3" />
          }
          <Folder size={13} className="text-amber-400 flex-shrink-0" />
          <span className="flex-1 truncate">{f.name}</span>
        </button>
        {isExpanded && children.map(c => renderFolder(c, level + 1))}
      </div>
    );
  };

  return <div className="space-y-0.5">{roots.map(f => renderFolder(f))}</div>;
}

export default function ModalMoveDoc({ docId, onClose }: Props) {
  const doc = DOCUMENTS.find(d => d.id === docId);
  const [newFolderId, setNewFolderId] = useState('');
  const [reason, setReason] = useState('');
  const [confirmed, setConfirmed] = useState(false);
  const [moved, setMoved] = useState(false);

  if (!doc) return null;

  const newFolder = FOLDERS.find(f => f.id === newFolderId);
  const newPath = newFolder
    ? (FOLDERS.find(p => p.id === newFolder.parentId)?.name
        ? `${FOLDERS.find(p => p.id === newFolder.parentId)!.name} / ${newFolder.name}`
        : newFolder.name)
    : '';

  const handleConfirm = () => {
    if (!newFolderId || !reason || !confirmed) return;
    setMoved(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h3 className="font-bold text-slate-900 flex items-center gap-2">
            <MoveRight size={18} className="text-amber-500" /> Cambiar ubicación del documento
          </h3>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 transition-colors"><X size={18} /></button>
        </div>

        <div className="p-6 space-y-5">
          {moved ? (
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 space-y-3">
              <div className="flex items-center gap-3">
                <CheckCircle2 size={22} className="text-emerald-600" />
                <div>
                  <p className="font-bold text-emerald-800">Documento movido correctamente</p>
                  <p className="text-xs text-emerald-700 mt-0.5">Referencias internas actualizadas · Acción registrada en auditoría</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 text-xs border-t border-emerald-200 pt-3">
                <div><span className="text-emerald-600 block">Ruta anterior</span><span className="font-medium text-emerald-900">{doc.folderPath}</span></div>
                <div><span className="text-emerald-600 block">Nueva ruta</span><span className="font-medium text-emerald-900">{newPath}</span></div>
                <div><span className="text-emerald-600 block">Motivo</span><span className="font-medium text-emerald-900">{reason}</span></div>
                <div><span className="text-emerald-600 block">Referencias actualizadas</span><span className="font-medium text-emerald-900">{doc.links.length} módulos</span></div>
              </div>
              <button onClick={onClose} className="w-full px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm rounded-xl transition-colors">Cerrar</button>
            </div>
          ) : (
            <>
              {/* Documento */}
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                <FileIcon format={doc.format} size={20} />
                <div>
                  <p className="font-semibold text-slate-800 text-sm">{doc.name}</p>
                  <p className="text-xs text-slate-500">v{doc.version} · {doc.folderPath}</p>
                </div>
              </div>

              {/* Rutas */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <p className="text-xs text-slate-400 mb-1 font-semibold uppercase tracking-wide">Ruta actual</p>
                  <div className="flex items-center gap-1.5 text-sm text-slate-600">
                    <Folder size={13} className="text-amber-400" />
                    {doc.folderPath}
                  </div>
                </div>
                <div className={`p-3 rounded-xl border ${newPath ? 'bg-blue-50 border-blue-200' : 'bg-slate-50 border-slate-200 border-dashed'}`}>
                  <p className="text-xs text-slate-400 mb-1 font-semibold uppercase tracking-wide">Nueva ruta</p>
                  {newPath ? (
                    <div className="flex items-center gap-1.5 text-sm text-blue-700 font-semibold">
                      <Folder size={13} className="text-blue-500" />
                      {newPath}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400 italic">Seleccione carpeta de destino</p>
                  )}
                </div>
              </div>

              {/* Aviso */}
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-start gap-2 text-xs text-amber-800">
                <Info size={14} className="flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold">El cambio de ruta actualizará las referencias internas del documento.</p>
                  {doc.links.length > 0 && (
                    <p className="mt-1">Módulos vinculados afectados: {doc.links.map(l => MODULE_LABELS[l.module]).join(', ')}.</p>
                  )}
                </div>
              </div>

              {/* Árbol de carpetas */}
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-slate-500 mb-2">Seleccionar nueva ubicación</p>
                <div className="border border-slate-200 rounded-xl p-3 max-h-48 overflow-y-auto bg-white">
                  <FolderPicker selected={newFolderId} onSelect={setNewFolderId} />
                </div>
              </div>

              {/* Motivo */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wide text-slate-500 mb-1.5">Motivo del cambio de ubicación *</label>
                <textarea
                  value={reason}
                  onChange={e => setReason(e.target.value)}
                  rows={2}
                  placeholder="Indique el motivo de la reubicación..."
                  className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>

              <label className="flex items-start gap-3 cursor-pointer">
                <input type="checkbox" checked={confirmed} onChange={e => setConfirmed(e.target.checked)} className="mt-0.5 w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                <span className="text-sm text-slate-700">Confirmo el cambio de ubicación. Entiendo que las referencias internas serán actualizadas automáticamente.</span>
              </label>

              <div className="flex gap-3 pt-2 border-t border-slate-100">
                <button onClick={onClose} className="flex-1 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm rounded-xl transition-colors">Cancelar</button>
                <button
                  onClick={handleConfirm}
                  disabled={!newFolderId || !reason || !confirmed}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-600 disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold text-sm rounded-xl transition-colors"
                >
                  <MoveRight size={15} /> Confirmar cambio de ubicación
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
