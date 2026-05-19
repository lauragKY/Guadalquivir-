import React from 'react';
import type {
  ElementStatus, ElementCategory, ModelState, AlertSeverity, AlertSource,
  UserRole, DamGlobalStatus, IntegrationStatus
} from './types';

export const ELEMENT_STATUS_CFG: Record<ElementStatus, {
  label: string; color: string; dot: string; svgFill: string; svgStroke: string; ringColor: string;
}> = {
  operational:        { label: 'Operativo',          color: 'bg-emerald-100 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500', svgFill: '#d1fae5', svgStroke: '#059669', ringColor: '#059669' },
  revision_pending:   { label: 'Revisión pendiente', color: 'bg-amber-100 text-amber-700 border-amber-200',       dot: 'bg-amber-500',   svgFill: '#fef3c7', svgStroke: '#d97706', ringColor: '#d97706' },
  failure:            { label: 'Avería / Fallo',     color: 'bg-red-100 text-red-700 border-red-200',             dot: 'bg-red-500',     svgFill: '#fee2e2', svgStroke: '#dc2626', ringColor: '#dc2626' },
  threshold_exceeded: { label: 'Umbral superado',    color: 'bg-orange-100 text-orange-700 border-orange-200',    dot: 'bg-orange-500',  svgFill: '#ffedd5', svgStroke: '#ea580c', ringColor: '#ea580c' },
  no_data:            { label: 'Sin datos',          color: 'bg-slate-100 text-slate-500 border-slate-200',       dot: 'bg-slate-400',   svgFill: '#f1f5f9', svgStroke: '#94a3b8', ringColor: '#94a3b8' },
};

export const CATEGORY_CFG: Record<ElementCategory, { label: string; color: string }> = {
  structure:       { label: 'Estructura',        color: 'bg-slate-100 text-slate-700 border-slate-200' },
  organ:           { label: 'Órgano desagüe',    color: 'bg-blue-100 text-blue-700 border-blue-200' },
  sensor:          { label: 'Sensor',            color: 'bg-teal-100 text-teal-700 border-teal-200' },
  instrumentation: { label: 'Instrumentación',   color: 'bg-cyan-100 text-cyan-700 border-cyan-200' },
  electrical:      { label: 'Instalación elec.', color: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
  access:          { label: 'Galería / Acceso',  color: 'bg-stone-100 text-stone-700 border-stone-200' },
  mechanical:      { label: 'Equipo mecánico',   color: 'bg-orange-100 text-orange-700 border-orange-200' },
  safety:          { label: 'Seguridad',         color: 'bg-red-100 text-red-700 border-red-200' },
};

export const MODEL_STATE_CFG: Record<ModelState, { label: string; color: string }> = {
  pending:    { label: 'Pendiente',    color: 'bg-slate-100 text-slate-600 border-slate-200' },
  processing: { label: 'Procesando',  color: 'bg-blue-100 text-blue-700 border-blue-200' },
  optimized:  { label: 'Optimizado',  color: 'bg-amber-100 text-amber-700 border-amber-200' },
  published:  { label: 'Publicado',   color: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
  obsolete:   { label: 'Obsoleto',    color: 'bg-red-100 text-red-600 border-red-200' },
};

export const ALERT_SEVERITY_CFG: Record<AlertSeverity, {
  label: string; color: string; bg: string; icon_color: string;
}> = {
  critical: { label: 'Crítica',     color: 'bg-red-100 text-red-700 border-red-200',       bg: 'bg-red-50 border-red-200',     icon_color: 'text-red-600' },
  warning:  { label: 'Aviso',       color: 'bg-amber-100 text-amber-700 border-amber-200', bg: 'bg-amber-50 border-amber-200', icon_color: 'text-amber-600' },
  info:     { label: 'Informativa', color: 'bg-blue-100 text-blue-700 border-blue-200',    bg: 'bg-blue-50 border-blue-200',   icon_color: 'text-blue-600' },
};

export const ALERT_SOURCE_CFG: Record<AlertSource, { label: string; color: string }> = {
  maintenance:  { label: 'Mantenimiento', color: 'bg-orange-100 text-orange-700 border-orange-200' },
  exploitation: { label: 'Explotación',   color: 'bg-blue-100 text-blue-700 border-blue-200' },
  auscultation: { label: 'Auscultación',  color: 'bg-teal-100 text-teal-700 border-teal-200' },
  inventory:    { label: 'Inventario',    color: 'bg-slate-100 text-slate-600 border-slate-200' },
  archive:      { label: 'Archivo Técn.', color: 'bg-stone-100 text-stone-600 border-stone-200' },
};

export const DAM_STATUS_CFG: Record<DamGlobalStatus, {
  label: string; color: string; bg: string; banner: string;
}> = {
  normal:        { label: 'Normalidad',          color: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-200', banner: 'bg-emerald-600' },
  extraordinary: { label: 'Situación Extraordinaria', color: 'text-amber-700', bg: 'bg-amber-50 border-amber-200', banner: 'bg-amber-600' },
  scenario_0:    { label: 'Escenario 0',         color: 'text-red-700',     bg: 'bg-red-50 border-red-200',     banner: 'bg-red-600' },
};

export const INTEGRATION_STATUS_CFG: Record<IntegrationStatus, { label: string; color: string; dot: string }> = {
  connected: { label: 'Conectada',    color: 'bg-blue-100 text-blue-700 border-blue-200',       dot: 'bg-blue-500' },
  synced:    { label: 'Sincronizada', color: 'bg-emerald-100 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500' },
  pending:   { label: 'Pendiente',    color: 'bg-amber-100 text-amber-700 border-amber-200',     dot: 'bg-amber-400' },
  error:     { label: 'Error',        color: 'bg-red-100 text-red-700 border-red-200',           dot: 'bg-red-500' },
};

export const ROLE_LABEL: Record<UserRole, string> = {
  viewer:            'Visualizador',
  maintenance_tech:  'Técnico Mantenimiento',
  auscultation_tech: 'Técnico Auscultación',
  director:          'Director/a Explotación',
  bim_admin:         'Administrador BIM',
  sipresas_admin:    'Admin SIPRESAS',
};

export const CRITICALITY_CFG = {
  low:      { label: 'Baja',     color: 'bg-slate-100 text-slate-600 border-slate-200' },
  medium:   { label: 'Media',    color: 'bg-blue-100 text-blue-700 border-blue-200' },
  high:     { label: 'Alta',     color: 'bg-amber-100 text-amber-700 border-amber-200' },
  critical: { label: 'Crítica',  color: 'bg-red-100 text-red-700 border-red-200' },
};

export function ElementStatusBadge({ status }: { status: ElementStatus }) {
  const cfg = ELEMENT_STATUS_CFG[status];
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs px-2 py-0.5 rounded border font-semibold ${cfg.color}`}>
      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}

export function CategoryBadge({ category }: { category: ElementCategory }) {
  const cfg = CATEGORY_CFG[category];
  return (
    <span className={`text-xs px-2 py-0.5 rounded border font-semibold ${cfg.color}`}>{cfg.label}</span>
  );
}

export function ModelStateBadge({ state }: { state: ModelState }) {
  const cfg = MODEL_STATE_CFG[state];
  return (
    <span className={`text-xs px-2 py-0.5 rounded border font-semibold ${cfg.color}`}>{cfg.label}</span>
  );
}

export function AlertSeverityBadge({ severity }: { severity: AlertSeverity }) {
  const cfg = ALERT_SEVERITY_CFG[severity];
  return (
    <span className={`text-xs px-2 py-0.5 rounded border font-semibold ${cfg.color}`}>{cfg.label}</span>
  );
}

export function AlertSourceBadge({ source }: { source: AlertSource }) {
  const cfg = ALERT_SOURCE_CFG[source];
  return (
    <span className={`text-xs px-2 py-0.5 rounded border font-semibold ${cfg.color}`}>{cfg.label}</span>
  );
}

export function DamStatusBanner({ status }: { status: DamGlobalStatus }) {
  const cfg = DAM_STATUS_CFG[status];
  return (
    <div className={`flex items-center gap-2 rounded-lg border px-3 py-1.5 ${cfg.bg}`}>
      <span className={`w-2 h-2 rounded-full flex-shrink-0 ${cfg.banner} ${status !== 'normal' ? 'animate-pulse' : ''}`} />
      <span className={`text-xs font-bold ${cfg.color}`}>{cfg.label}</span>
    </div>
  );
}

export function IntegrationStatusBadge({ status }: { status: IntegrationStatus }) {
  const cfg = INTEGRATION_STATUS_CFG[status];
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs px-2 py-0.5 rounded border font-semibold ${cfg.color}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}
