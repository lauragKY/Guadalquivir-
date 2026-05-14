import React, { useState } from 'react';
import { Folder, FolderOpen, ChevronRight, ChevronDown, Search, Filter, Eye, Download, CreditCard as Edit2, MoveRight, GitBranch, Link2, GripVertical, CheckCircle2, X, AlertTriangle } from 'lucide-react';
import { DOCUMENTS, FOLDERS } from './mockData';
import type { Document, Folder as FolderType } from './types';
import { CriticalityBadge, StatusBadge, FileIcon, DOCTYPE_LABELS, CRITICALITY_CONFIG } from './helpers';

interface Props {
  onViewDoc: (docId: string) => void;
  onMoveDoc: (docId: string) => void;
  onUpload: () => void;
}

function buildTree(folders: FolderType[]): (FolderType & { children: FolderType[] })[] {
  const map = new Map<string, FolderType & { children: FolderType[] }>();
  folders.forEach(f => map.set(f.id, { ...f, children: [] }));
  const roots: (FolderType & { children: FolderType[] })[] = [];
  map.forEach(f => {
    if (f.parentId && map.has(f.parentId)) {
      map.get(f.parentId)!.children.push(f);
    } else if (!f.parentId) {
      roots.push(f);
    }
  });
  return roots.sort((a, b) => a.order - b.order);
}

function FolderNode({
  node, selected, expanded, onSelect, onToggle, level = 0,
}: {
  node: FolderType & { children: (FolderType & { children: any[] })[] };
  selected: string | null;
  expanded: Set<string>;
  onSelect: (id: string) => void;
  onToggle: (id: string) => void;
  level?: number;
}) {
  const hasChildren = node.children.length > 0;
  const isExpanded = expanded.has(node.id);
  const isSelected = selected === node.id;

  return (
    <div>
      <button
        onClick={() => { onSelect(node.id); if (hasChildren) onToggle(node.id); }}
        className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left transition-colors text-sm ${
          isSelected ? 'bg-blue-100 text-blue-800 font-semibold' : 'text-slate-700 hover:bg-slate-100'
        }`}
        style={{ paddingLeft: `${level * 16 + 12}px` }}
      >
        {hasChildren ? (
          isExpanded ? <ChevronDown size={13} className="flex-shrink-0 text-slate-400" /> : <ChevronRight size={13} className="flex-shrink-0 text-slate-400" />
        ) : (
          <span className="w-3 flex-shrink-0" />
        )}
        {isExpanded ? <FolderOpen size={14} className="flex-shrink-0 text-amber-500" /> : <Folder size={14} className="flex-shrink-0 text-amber-400" />}
        <span className="flex-1 truncate">{node.name}</span>
        <span className="text-xs text-slate-400 flex-shrink-0">{node.docCount}</span>
      </button>
      {isExpanded && node.children.map(child => (
        <FolderNode key={child.id} node={child} selected={selected} expanded={expanded} onSelect={onSelect} onToggle={onToggle} level={level + 1} />
      ))}
    </div>
  );
}

function CriticalDownloadModal({ doc, onConfirm, onCancel }: { doc: Document; onConfirm: () => void; onCancel: () => void }) {
  const [accepted, setAccepted] = useState(false);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center flex-shrink-0">
            <AlertTriangle size={20} className="text-red-600" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-base">Información clasificada como CRÍTICA</h3>
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
          <button onClick={onCancel} className="flex-1 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm rounded-xl transition-colors">
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            disabled={!accepted}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold text-sm rounded-xl transition-colors"
          >
            <Download size={15} /> Aceptar y descargar
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ScreenExplorer({ onViewDoc, onMoveDoc, onUpload }: Props) {
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState('');
  const [filterCrit, setFilterCrit] = useState('');
  const [filterType, setFilterType] = useState('');
  const [critModal, setCritModal] = useState<Document | null>(null);
  const [dragOver, setDragOver] = useState<string | null>(null);
  const [reorderMsg, setReorderMsg] = useState(false);

  const tree = buildTree(FOLDERS);

  const toggleFolder = (id: string) => {
    setExpandedFolders(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  let docs = DOCUMENTS;
  if (selectedFolder) docs = docs.filter(d => d.folderId === selectedFolder);
  if (search) docs = docs.filter(d => d.name.toLowerCase().includes(search.toLowerCase()) || d.description.toLowerCase().includes(search.toLowerCase()));
  if (filterCrit) docs = docs.filter(d => d.criticality === filterCrit);
  if (filterType) docs = docs.filter(d => d.type === filterType);

  const selectedFolderObj = FOLDERS.find(f => f.id === selectedFolder);

  const handleDownload = (doc: Document) => {
    if (doc.criticality === 'critica') {
      setCritModal(doc);
    } else {
      simulateDownload(doc);
    }
  };

  const simulateDownload = (doc: Document) => {
    setCritModal(null);
    alert(`Descarga registrada en auditoría.\nDocumento: ${doc.name}\nVersión: ${doc.version}`);
  };

  return (
    <div className="flex gap-4 h-full">
      {/* Sidebar carpetas */}
      <div className="w-64 flex-shrink-0 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
        <div className="px-4 py-3 border-b border-slate-100 bg-slate-50">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Árbol de carpetas</p>
        </div>
        <div className="flex-1 overflow-y-auto p-2">
          <button
            onClick={() => setSelectedFolder(null)}
            className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left text-sm transition-colors mb-1 ${
              selectedFolder === null ? 'bg-blue-100 text-blue-800 font-semibold' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Folder size={14} className="text-blue-500 flex-shrink-0" />
            Todos los documentos
          </button>
          {tree.map(node => (
            <FolderNode
              key={node.id}
              node={node}
              selected={selectedFolder}
              expanded={expandedFolders}
              onSelect={setSelectedFolder}
              onToggle={toggleFolder}
            />
          ))}
        </div>

        {/* Reordenar carpetas */}
        <div className="px-4 py-3 border-t border-slate-100 bg-slate-50">
          <p className="text-xs text-slate-500 mb-2 font-medium">Reordenar subcarpetas</p>
          {selectedFolderObj && FOLDERS.filter(f => f.parentId === selectedFolderObj.id).length > 0 ? (
            <div className="space-y-1">
              {FOLDERS.filter(f => f.parentId === selectedFolderObj.id).sort((a, b) => a.order - b.order).map(sub => (
                <div
                  key={sub.id}
                  draggable
                  onDragOver={e => { e.preventDefault(); setDragOver(sub.id); }}
                  onDrop={() => { setDragOver(null); setReorderMsg(true); setTimeout(() => setReorderMsg(false), 2000); }}
                  onDragEnd={() => setDragOver(null)}
                  className={`flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs font-medium cursor-grab transition-colors ${
                    dragOver === sub.id ? 'bg-blue-100 text-blue-700' : 'bg-white border border-slate-200 text-slate-600'
                  }`}
                >
                  <GripVertical size={12} className="text-slate-400" />
                  {sub.name}
                </div>
              ))}
              {reorderMsg && (
                <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-semibold mt-1">
                  <CheckCircle2 size={12} /> Orden guardado
                </div>
              )}
            </div>
          ) : (
            <p className="text-xs text-slate-400 italic">Seleccione una carpeta con subcarpetas</p>
          )}
        </div>
      </div>

      {/* Contenido principal */}
      <div className="flex-1 min-w-0 space-y-4">
        {/* Filtros */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 flex items-center gap-3 flex-wrap">
          <div className="relative flex-1 min-w-[200px]">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Buscar documentos..."
              className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select value={filterCrit} onChange={e => setFilterCrit(e.target.value)} className="px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white">
            <option value="">Todas las criticidades</option>
            <option value="baja">Baja</option>
            <option value="media">Media</option>
            <option value="alta">Alta</option>
            <option value="critica">Crítica</option>
          </select>
          <select value={filterType} onChange={e => setFilterType(e.target.value)} className="px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white">
            <option value="">Todos los tipos</option>
            {Object.entries(DOCTYPE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
          <button onClick={onUpload} className="flex items-center gap-1.5 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors ml-auto flex-shrink-0">
            + Subir documento
          </button>
        </div>

        {/* Cabecera */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-slate-600 font-medium">
            {selectedFolderObj ? (
              <span className="flex items-center gap-1.5">
                <Folder size={14} className="text-amber-500" />
                {selectedFolderObj.name}
              </span>
            ) : 'Todos los documentos'}
            <span className="ml-2 text-slate-400">({docs.length})</span>
          </p>
        </div>

        {/* Tabla */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Documento</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Tipo</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Ruta</th>
                  <th className="text-center px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Ver.</th>
                  <th className="text-center px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Criticidad</th>
                  <th className="text-center px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Estado</th>
                  <th className="text-center px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Actualización</th>
                  <th className="text-center px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {docs.length === 0 ? (
                  <tr><td colSpan={8} className="text-center py-12 text-slate-400 text-sm">No se encontraron documentos</td></tr>
                ) : docs.map(doc => (
                  <tr key={doc.id} className={`hover:bg-slate-50 transition-colors ${doc.criticality === 'critica' ? 'bg-red-50/30' : ''}`}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <FileIcon format={doc.format} size={18} />
                        <div className="min-w-0">
                          <p className="font-medium text-slate-800 truncate max-w-[200px]">{doc.name}</p>
                          <p className="text-xs text-slate-400">{doc.size}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-600">{DOCTYPE_LABELS[doc.type]}</td>
                    <td className="px-4 py-3 text-xs text-slate-500 max-w-[160px] truncate">{doc.folderPath}</td>
                    <td className="px-4 py-3 text-center font-mono text-xs font-bold text-slate-600">v{doc.version}</td>
                    <td className="px-4 py-3 text-center"><CriticalityBadge value={doc.criticality} size="xs" /></td>
                    <td className="px-4 py-3 text-center"><StatusBadge value={doc.status} /></td>
                    <td className="px-4 py-3 text-center text-xs text-slate-500">
                      <div>{doc.updatedAt}</div>
                      <div className="text-slate-400 truncate max-w-[100px]">{doc.updatedBy.split(' ')[0]}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-1">
                        <button onClick={() => onViewDoc(doc.id)} title="Ver detalle" className="p-1.5 rounded-lg hover:bg-blue-50 text-slate-400 hover:text-blue-600 transition-colors"><Eye size={14} /></button>
                        <button onClick={() => handleDownload(doc)} title="Descargar" className="p-1.5 rounded-lg hover:bg-emerald-50 text-slate-400 hover:text-emerald-600 transition-colors"><Download size={14} /></button>
                        <button onClick={() => onMoveDoc(doc.id)} title="Cambiar ubicación" className="p-1.5 rounded-lg hover:bg-amber-50 text-slate-400 hover:text-amber-600 transition-colors"><MoveRight size={14} /></button>
                        <button onClick={() => onViewDoc(doc.id)} title="Ver versiones" className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"><GitBranch size={14} /></button>
                        <button onClick={() => onViewDoc(doc.id)} title="Vincular módulos" className="p-1.5 rounded-lg hover:bg-teal-50 text-slate-400 hover:text-teal-600 transition-colors"><Link2 size={14} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {critModal && (
        <CriticalDownloadModal doc={critModal} onConfirm={() => simulateDownload(critModal)} onCancel={() => setCritModal(null)} />
      )}
    </div>
  );
}
