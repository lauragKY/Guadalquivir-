import React from 'react';
import type { Criticality, DocStatus, DocType, AuditAction, ModuleLink } from './types';

export const CRITICALITY_CONFIG: Record<Criticality, { label: string; cls: string; dot: string; badge: string; border: string }> = {
  baja:   { label: 'Baja',   cls: 'bg-emerald-100 text-emerald-700', dot: 'bg-emerald-500', badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',   border: 'border-emerald-300' },
  media:  { label: 'Media',  cls: 'bg-blue-100 text-blue-700',       dot: 'bg-blue-500',    badge: 'bg-blue-50 text-blue-700 border-blue-200',             border: 'border-blue-300' },
  alta:   { label: 'Alta',   cls: 'bg-amber-100 text-amber-800',     dot: 'bg-amber-500',   badge: 'bg-amber-50 text-amber-800 border-amber-300',          border: 'border-amber-400' },
  critica:{ label: 'Crítica',cls: 'bg-red-100 text-red-700',         dot: 'bg-red-600',     badge: 'bg-red-50 text-red-700 border-red-300',                border: 'border-red-500' },
};

export const STATUS_CONFIG: Record<DocStatus, { label: string; cls: string }> = {
  aprobado: { label: 'Aprobado',  cls: 'bg-emerald-100 text-emerald-700' },
  borrador: { label: 'Borrador',  cls: 'bg-slate-100 text-slate-600' },
  revision: { label: 'En revisión', cls: 'bg-amber-100 text-amber-700' },
  obsoleto: { label: 'Obsoleto',  cls: 'bg-red-100 text-red-600' },
};

export const DOCTYPE_LABELS: Record<DocType, string> = {
  plan_emergencia:  'Plan de Emergencia',
  norma_explotacion:'Norma de Explotación',
  plano:            'Plano',
  informe:          'Informe',
  manual:           'Manual',
  certificado:      'Certificado',
  acta:             'Acta',
  cartografia:      'Cartografía',
  proyecto:         'Proyecto',
  otro:             'Otro',
};

export const AUDIT_ACTION_CONFIG: Record<AuditAction, { label: string; cls: string }> = {
  subida:              { label: 'Subida',              cls: 'bg-blue-100 text-blue-700' },
  descarga:            { label: 'Descarga',            cls: 'bg-emerald-100 text-emerald-700' },
  movido:              { label: 'Movido',              cls: 'bg-amber-100 text-amber-700' },
  criticidad_cambiada: { label: 'Criticidad cambiada', cls: 'bg-orange-100 text-orange-700' },
  acceso_denegado:     { label: 'Acceso denegado',     cls: 'bg-red-100 text-red-700' },
  nueva_version:       { label: 'Nueva versión',       cls: 'bg-slate-100 text-slate-700' },
  vinculado:           { label: 'Vinculado',           cls: 'bg-teal-100 text-teal-700' },
  metadatos_editados:  { label: 'Metadatos editados',  cls: 'bg-slate-100 text-slate-600' },
  version_restaurada:  { label: 'Versión restaurada',  cls: 'bg-amber-100 text-amber-800' },
};

export const MODULE_LABELS: Record<ModuleLink, string> = {
  inventario:   'Inventario',
  mantenimiento:'Mantenimiento',
  emergencias:  'Emergencias',
  auscultacion: 'Auscultación',
  bim:          'BIM',
  gis:          'GIS',
};

export const MODULE_COLORS: Record<ModuleLink, string> = {
  inventario:   'bg-blue-100 text-blue-700',
  mantenimiento:'bg-amber-100 text-amber-700',
  emergencias:  'bg-red-100 text-red-700',
  auscultacion: 'bg-teal-100 text-teal-700',
  bim:          'bg-slate-100 text-slate-700',
  gis:          'bg-emerald-100 text-emerald-700',
};

export function CriticalityBadge({ value, size = 'sm' }: { value: Criticality; size?: 'xs' | 'sm' }) {
  const c = CRITICALITY_CONFIG[value];
  const px = size === 'xs' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs';
  return (
    <span className={`inline-flex items-center gap-1.5 font-semibold rounded-full border ${px} ${c.badge}`}>
      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${c.dot}`} />
      {c.label}
    </span>
  );
}

export function StatusBadge({ value }: { value: DocStatus }) {
  const s = STATUS_CONFIG[value];
  return (
    <span className={`inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full ${s.cls}`}>
      {s.label}
    </span>
  );
}

export function FileIcon({ format, size = 20 }: { format: string; size?: number }) {
  const colors: Record<string, string> = {
    PDF: 'text-red-500', DWG: 'text-blue-600', XLSX: 'text-emerald-600',
    DOC: 'text-blue-500', DOCX: 'text-blue-500', JPG: 'text-amber-500',
    PNG: 'text-amber-500', ZIP: 'text-slate-500',
  };
  const color = colors[format.toUpperCase()] || 'text-slate-400';
  return (
    <svg width={size} height={size} viewBox="0 0 20 24" fill="none" className={`flex-shrink-0 ${color}`}>
      <path d="M2 0h12l6 6v18H2V0z" fill="currentColor" fillOpacity={0.15} stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M14 0l6 6h-6V0z" fill="currentColor" fillOpacity={0.35} />
      <text x="10" y="17" textAnchor="middle" fontSize="5" fontWeight="bold" fill="currentColor" fontFamily="system-ui">{format.slice(0, 3)}</text>
    </svg>
  );
}
