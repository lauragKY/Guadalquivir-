import React from 'react';
import { FileText, Folder, ShieldAlert, Clock, Upload, MoveRight, Shield, History, CheckCircle2, AlertTriangle, Activity } from 'lucide-react';
import type { Document } from './types';
import { DOCUMENTS, AUDIT_EVENTS } from './mockData';
import { FOLDERS } from './mockData';
import { CriticalityBadge, StatusBadge, FileIcon, DOCTYPE_LABELS } from './helpers';

interface Props {
  onNavigate: (screen: string, docId?: string) => void;
}

export default function ScreenDashboard({ onNavigate }: Props) {
  const totalDocs   = DOCUMENTS.length;
  const totalFolders = FOLDERS.length;
  const critDocs    = DOCUMENTS.filter(d => d.criticality === 'critica' || d.criticality === 'alta').length;
  const recentDocs  = DOCUMENTS.filter(d => d.updatedAt.includes('2026')).length;
  const recentAudit = AUDIT_EVENTS.slice(0, 5);
  const recentDocs5 = [...DOCUMENTS].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)).slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: FileText, label: 'Documentos',         value: totalDocs,   color: 'text-blue-600',    bg: 'bg-blue-50',    border: 'border-blue-100' },
          { icon: Folder,   label: 'Carpetas',           value: totalFolders,color: 'text-slate-600',   bg: 'bg-slate-50',   border: 'border-slate-200' },
          { icon: ShieldAlert,label:'Alta / Crítica',    value: critDocs,    color: 'text-red-600',     bg: 'bg-red-50',     border: 'border-red-100' },
          { icon: Clock,    label: 'Actualizados 2026',  value: recentDocs,  color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' },
        ].map(({ icon: Icon, label, value, color, bg, border }) => (
          <div key={label} className={`bg-white rounded-xl border ${border} p-5 shadow-sm flex items-center gap-4`}>
            <div className={`w-12 h-12 rounded-xl ${bg} flex items-center justify-center flex-shrink-0`}>
              <Icon size={22} className={color} />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{value}</p>
              <p className="text-xs text-slate-500 mt-0.5">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Integración Alfresco */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-emerald-100 flex items-center justify-center">
            <Activity size={18} className="text-emerald-600" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-800">Integración Alfresco ECM</p>
            <p className="text-xs text-slate-500">alfresco.chguadalquivir.es · Site: sipresas-gdm</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Conectado
          </span>
          <span className="text-xs text-slate-400">Última sincronización: 18/04/2026 11:33</span>
        </div>
      </div>

      {/* Accesos rápidos */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { icon: Upload,    label: 'Subir documento',       color: 'bg-blue-600 hover:bg-blue-700',    screen: 'upload' },
          { icon: MoveRight, label: 'Mover documento',       color: 'bg-amber-500 hover:bg-amber-600',  screen: 'explorer' },
          { icon: Shield,    label: 'Gestionar criticidad',  color: 'bg-red-600 hover:bg-red-700',      screen: 'criticidad' },
          { icon: History,   label: 'Ver auditoría',         color: 'bg-slate-700 hover:bg-slate-800',  screen: 'auditoria' },
        ].map(({ icon: Icon, label, color, screen }) => (
          <button
            key={label}
            onClick={() => onNavigate(screen)}
            className={`flex flex-col items-center gap-2 p-4 rounded-xl text-white font-semibold text-sm transition-all shadow-sm ${color}`}
          >
            <Icon size={22} />
            {label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Documentos recientes */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
              <Clock size={16} className="text-blue-600" />
              Documentos actualizados recientemente
            </h3>
            <button onClick={() => onNavigate('explorer')} className="text-xs text-blue-600 hover:underline font-medium">Ver todos</button>
          </div>
          <div className="divide-y divide-slate-100">
            {recentDocs5.map(doc => (
              <button
                key={doc.id}
                onClick={() => onNavigate('detail', doc.id)}
                className="w-full flex items-start gap-3 px-4 py-3 hover:bg-slate-50 transition-colors text-left"
              >
                <FileIcon format={doc.format} size={18} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-800 truncate">{doc.name}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{doc.folderPath} · v{doc.version}</p>
                </div>
                <div className="flex flex-col items-end gap-1 flex-shrink-0">
                  <CriticalityBadge value={doc.criticality} size="xs" />
                  <span className="text-xs text-slate-400">{doc.updatedAt}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Últimas acciones de auditoría */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
              <History size={16} className="text-blue-600" />
              Últimas acciones registradas
            </h3>
            <button onClick={() => onNavigate('auditoria')} className="text-xs text-blue-600 hover:underline font-medium">Ver auditoría completa</button>
          </div>
          <div className="divide-y divide-slate-100">
            {recentAudit.map(ev => (
              <div key={ev.id} className="flex items-start gap-3 px-4 py-3">
                <div className={`mt-0.5 w-2 h-2 rounded-full flex-shrink-0 ${ev.result === 'denegado' ? 'bg-red-500' : 'bg-emerald-500'}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-slate-800">{ev.document}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{ev.detail}</p>
                </div>
                <div className="flex flex-col items-end gap-1 flex-shrink-0">
                  <span className="text-xs text-slate-400">{ev.date} {ev.time}</span>
                  {ev.result === 'denegado' && (
                    <span className="text-xs font-semibold text-red-600 flex items-center gap-0.5">
                      <AlertTriangle size={10} /> Denegado
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Distribución por criticidad */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 bg-slate-50">
          <h3 className="font-bold text-slate-800 flex items-center gap-2">
            <Shield size={16} className="text-blue-600" />
            Distribución por criticidad
          </h3>
        </div>
        <div className="p-5 grid grid-cols-2 md:grid-cols-4 gap-4">
          {(['baja', 'media', 'alta', 'critica'] as const).map(crit => {
            const count = DOCUMENTS.filter(d => d.criticality === crit).length;
            const pct = Math.round((count / totalDocs) * 100);
            const colors = {
              baja:    { bar: 'bg-emerald-500', bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700' },
              media:   { bar: 'bg-blue-500',    bg: 'bg-blue-50',    border: 'border-blue-200',    text: 'text-blue-700' },
              alta:    { bar: 'bg-amber-500',   bg: 'bg-amber-50',   border: 'border-amber-200',   text: 'text-amber-700' },
              critica: { bar: 'bg-red-600',     bg: 'bg-red-50',     border: 'border-red-200',     text: 'text-red-700' },
            }[crit];
            return (
              <div key={crit} className={`rounded-xl border ${colors.border} ${colors.bg} p-4`}>
                <div className="flex items-center justify-between mb-2">
                  <p className={`text-xs font-bold uppercase tracking-wide ${colors.text}`}>
                    {crit.charAt(0).toUpperCase() + crit.slice(1)}
                  </p>
                  <p className={`text-xl font-bold ${colors.text}`}>{count}</p>
                </div>
                <div className="h-1.5 bg-white rounded-full overflow-hidden">
                  <div className={`h-full ${colors.bar} rounded-full`} style={{ width: `${pct}%` }} />
                </div>
                <p className={`text-xs mt-1 ${colors.text} opacity-70`}>{pct}% del total</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
