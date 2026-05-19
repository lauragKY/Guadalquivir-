import React, { useState, useRef } from 'react';
import { X, Upload, CheckCircle2, AlertTriangle, ChevronDown, Folder } from 'lucide-react';
import { FOLDERS } from './mockData';
import { DOCTYPE_LABELS } from './helpers';
import type { DocType, Criticality } from './types';

interface Props {
  onClose: () => void;
}

type UploadState = 'idle' | 'uploading' | 'new_version' | 'done' | 'error';

const EXISTING_NAMES = ['Plan de Emergencia Bembézar.pdf', 'Plano de compuertas.dwg', 'Cartografía zonas inundables.pdf'];

export default function ModalUpload({ onClose }: Props) {
  const [fileName, setFileName] = useState('');
  const [fileSize, setFileSize] = useState('');
  const [docType, setDocType] = useState<DocType | ''>('');
  const [folderId, setFolderId] = useState('');
  const [criticality, setCriticality] = useState<Criticality | ''>('');
  const [description, setDescription] = useState('');
  const [versionReason, setVersionReason] = useState('');
  const [uploadState, setUploadState] = useState<UploadState>('idle');
  const [progress, setProgress] = useState(0);
  const [isNewVersion, setIsNewVersion] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    setFileSize((file.size / (1024 * 1024)).toFixed(1) + ' MB');
    if (EXISTING_NAMES.includes(file.name)) {
      setIsNewVersion(true);
    } else {
      setIsNewVersion(false);
    }
  };

  const validate = () => {
    if (!fileName) return 'Seleccione un archivo';
    if (!docType) return 'Seleccione el tipo documental';
    if (!folderId) return 'Seleccione la carpeta destino';
    if (!criticality) return 'Seleccione la criticidad';
    if (isNewVersion && !versionReason) return 'Indique el motivo del cambio de versión';
    return null;
  };

  const handleUpload = () => {
    const err = validate();
    if (err) { alert(err); return; }
    setUploadState('uploading');
    setProgress(0);

    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          if (isNewVersion) {
            setUploadState('new_version');
          } else {
            setUploadState('done');
          }
          return 100;
        }
        return prev + Math.random() * 18 + 5;
      });
    }, 180);
  };

  const rootFolders = FOLDERS.filter(f => f.parentId === null);
  const subFolders = FOLDERS.filter(f => f.parentId !== null);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
            <Upload size={18} className="text-blue-600" />
            {isNewVersion ? 'Nueva versión de documento' : 'Subir documento'}
          </h3>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"><X size={18} /></button>
        </div>

        <div className="p-6 space-y-5">
          {uploadState === 'done' && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center gap-3">
              <CheckCircle2 size={20} className="text-emerald-600" />
              <div>
                <p className="font-semibold text-emerald-800 text-sm">Documento subido correctamente</p>
                <p className="text-xs text-emerald-700 mt-0.5">Sincronizado con Alfresco ECM · Registrado en auditoría · {fileName}</p>
              </div>
            </div>
          )}

          {uploadState === 'new_version' && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 space-y-3">
              <div className="flex items-center gap-3">
                <CheckCircle2 size={20} className="text-blue-600" />
                <div>
                  <p className="font-semibold text-blue-800 text-sm">Nueva versión creada correctamente</p>
                  <p className="text-xs text-blue-700 mt-0.5">Versión anterior archivada. Nueva versión activa en Alfresco.</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3 text-xs border-t border-blue-200 pt-3">
                <div><span className="text-blue-500 block">Versión anterior</span><span className="font-bold text-blue-800">v2.0</span></div>
                <div><span className="text-blue-500 block">Nueva versión</span><span className="font-bold text-blue-800">v3.0</span></div>
                <div><span className="text-blue-500 block">Usuario</span><span className="font-bold text-blue-800">Usuario actual</span></div>
                <div className="col-span-3"><span className="text-blue-500 block">Motivo</span><span className="font-medium text-blue-800">{versionReason}</span></div>
              </div>
            </div>
          )}

          {/* Zona de archivo */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wide text-slate-500 mb-2">Archivo *</label>
            <div
              onClick={() => fileRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${
                fileName ? 'border-blue-300 bg-blue-50' : 'border-slate-300 hover:border-blue-300 hover:bg-blue-50/30'
              }`}
            >
              {fileName ? (
                <div className="flex items-center justify-center gap-2">
                  <CheckCircle2 size={18} className="text-blue-600" />
                  <span className="font-medium text-blue-800 text-sm">{fileName}</span>
                  <span className="text-xs text-slate-400">{fileSize}</span>
                </div>
              ) : (
                <>
                  <Upload size={24} className="text-slate-400 mx-auto mb-2" />
                  <p className="text-sm text-slate-600">Arrastra el archivo o <span className="text-blue-600 font-semibold">haz clic para seleccionar</span></p>
                  <p className="text-xs text-slate-400 mt-1">PDF, DWG, XLSX, DOC — máx. 100 MB</p>
                </>
              )}
            </div>
            <input ref={fileRef} type="file" className="hidden" onChange={handleFileChange} accept=".pdf,.dwg,.xlsx,.doc,.docx,.jpg,.png,.zip" />
          </div>

          {isNewVersion && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
              <AlertTriangle size={16} className="text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-amber-800">
                <p className="font-semibold">Documento existente detectado</p>
                <p className="text-xs mt-0.5">Ya existe un documento con este nombre. Si continúa, se creará una <strong>nueva versión</strong>. La versión anterior quedará archivada.</p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            {/* Tipo documental */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wide text-slate-500 mb-1.5">Tipo documental *</label>
              <div className="relative">
                <select value={docType} onChange={e => setDocType(e.target.value as DocType)} className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-sm appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">Seleccionar...</option>
                  {Object.entries(DOCTYPE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                </select>
                <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </div>

            {/* Criticidad */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wide text-slate-500 mb-1.5">Criticidad *</label>
              <div className="relative">
                <select value={criticality} onChange={e => setCriticality(e.target.value as Criticality)} className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-sm appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">Seleccionar...</option>
                  <option value="baja">Baja — Acceso general</option>
                  <option value="media">Media — Perfiles internos</option>
                  <option value="alta">Alta — Acceso restringido</option>
                  <option value="critica">Crítica — Necesidad de conocer</option>
                </select>
                <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Carpeta destino */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wide text-slate-500 mb-1.5">Carpeta destino *</label>
            <div className="relative">
              <Folder size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-500 pointer-events-none" />
              <select value={folderId} onChange={e => setFolderId(e.target.value)} className="w-full pl-8 pr-3 py-2.5 border border-slate-300 rounded-lg text-sm appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Seleccionar carpeta...</option>
                <optgroup label="Carpetas raíz">
                  {rootFolders.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
                </optgroup>
                <optgroup label="Subcarpetas">
                  {subFolders.map(f => {
                    const parent = FOLDERS.find(p => p.id === f.parentId);
                    return <option key={f.id} value={f.id}>{parent?.name} / {f.name}</option>;
                  })}
                </optgroup>
              </select>
            </div>
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wide text-slate-500 mb-1.5">Descripción</label>
            <textarea value={description} onChange={e => setDescription(e.target.value)} rows={2} placeholder="Descripción del documento..." className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
          </div>

          {/* Motivo versión */}
          {isNewVersion && (
            <div>
              <label className="block text-xs font-bold uppercase tracking-wide text-slate-500 mb-1.5">Motivo del cambio de versión *</label>
              <textarea value={versionReason} onChange={e => setVersionReason(e.target.value)} rows={2} placeholder="Describa el motivo de esta nueva versión..." className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
            </div>
          )}

          {/* Barra de progreso */}
          {uploadState === 'uploading' && (
            <div>
              <div className="flex justify-between text-xs text-slate-500 mb-1.5">
                <span>Subiendo a Alfresco ECM...</span>
                <span>{Math.min(100, Math.round(progress))}%</span>
              </div>
              <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-blue-600 rounded-full transition-all duration-200" style={{ width: `${Math.min(100, progress)}%` }} />
              </div>
              <p className="text-xs text-slate-400 mt-1">Procesando metadatos y sincronizando con SIPRESAS...</p>
            </div>
          )}

          {/* Acciones */}
          <div className="flex gap-3 pt-2 border-t border-slate-100">
            <button onClick={onClose} className="flex-1 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm rounded-xl transition-colors">
              {uploadState === 'done' || uploadState === 'new_version' ? 'Cerrar' : 'Cancelar'}
            </button>
            {uploadState !== 'done' && uploadState !== 'new_version' && (
              <button
                onClick={handleUpload}
                disabled={uploadState === 'uploading'}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold text-sm rounded-xl transition-colors"
              >
                <Upload size={15} />
                {uploadState === 'uploading' ? 'Subiendo...' : isNewVersion ? 'Crear nueva versión' : 'Subir documento'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
