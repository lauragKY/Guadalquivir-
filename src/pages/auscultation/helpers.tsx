import React from 'react';
import type { VarStatus, AlertStatus, EventType } from './types';

export const VAR_STATUS_CFG: Record<VarStatus, { label: string; short: string; dot: string; badge: string; border: string; row: string }> = {
  normal:        { label: 'Normal',                   short: 'Normal',   dot: 'bg-emerald-500', badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',  border: 'border-emerald-300', row: '' },
  extraordinary: { label: 'Situación Extraordinaria', short: 'S.E.',     dot: 'bg-amber-400',   badge: 'bg-amber-50 text-amber-800 border-amber-300',        border: 'border-amber-400',   row: 'bg-amber-50/40' },
  scenario_0:    { label: 'Escenario 0',              short: 'Esc. 0',   dot: 'bg-red-500',     badge: 'bg-red-50 text-red-700 border-red-300',              border: 'border-red-400',     row: 'bg-red-50/40' },
  scenario_1:    { label: 'Escenario 1',              short: 'Esc. 1',   dot: 'bg-red-700',     badge: 'bg-red-100 text-red-900 border-red-500',             border: 'border-red-600',     row: 'bg-red-100/40' },
  incoherent:    { label: 'Dato incoherente',         short: 'Incoh.',   dot: 'bg-orange-500',  badge: 'bg-orange-50 text-orange-700 border-orange-300',     border: 'border-orange-400',  row: 'bg-orange-50/30' },
  no_data:       { label: 'Sin dato',                 short: 'N/D',      dot: 'bg-slate-400',   badge: 'bg-slate-100 text-slate-600 border-slate-300',       border: 'border-slate-300',   row: 'bg-slate-50/40' },
};

export const ALERT_STATUS_CFG: Record<AlertStatus, { label: string; cls: string }> = {
  pending:   { label: 'Pendiente',   cls: 'bg-amber-100 text-amber-800' },
  sent:      { label: 'Enviado',     cls: 'bg-blue-100 text-blue-800' },
  confirmed: { label: 'Confirmado',  cls: 'bg-red-100 text-red-800' },
  rejected:  { label: 'Rechazado',   cls: 'bg-slate-100 text-slate-600' },
};

export const EVENT_TYPE_CFG: Record<EventType, { label: string; icon: string; color: string }> = {
  data_received:          { label: 'Dato recibido',            icon: '↓', color: 'text-slate-500' },
  threshold_calculated:   { label: 'Umbral calculado',         icon: '⚙', color: 'text-blue-600' },
  extraordinary_detected: { label: 'S.E. detectada',           icon: '⚠', color: 'text-amber-600' },
  scenario_0_proposed:    { label: 'Esc. 0 propuesto',         icon: '🔴', color: 'text-red-600' },
  scenario_1_proposed:    { label: 'Esc. 1 propuesto',         icon: '🔴', color: 'text-red-800' },
  alert_sent:             { label: 'Aviso enviado',            icon: '🔔', color: 'text-amber-600' },
  emergency_comm:         { label: 'Com. a Emergencias',       icon: '📡', color: 'text-red-700' },
  manual_validation:      { label: 'Validación manual',        icon: '✓', color: 'text-emerald-600' },
  activation_rejected:    { label: 'Activación rechazada',     icon: '✗', color: 'text-slate-600' },
  data_blocked:           { label: 'Datos bloqueados',         icon: '🔒', color: 'text-slate-700' },
  formula_modified:       { label: 'Fórmula modificada',       icon: '✎', color: 'text-blue-700' },
  manual_data_entry:      { label: 'Dato manual introducido',  icon: '👤', color: 'text-orange-600' },
  data_incoherent:        { label: 'Dato incoherente',         icon: '⚡', color: 'text-orange-700' },
};

export function VarStatusBadge({ status }: { status: VarStatus }) {
  const c = VAR_STATUS_CFG[status];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${c.badge}`}>
      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${c.dot}`} />
      {c.short}
    </span>
  );
}

export function AlertStatusBadge({ status }: { status: AlertStatus }) {
  const c = ALERT_STATUS_CFG[status];
  return <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${c.cls}`}>{c.label}</span>;
}

export function SourceBadge({ source }: { source: string }) {
  const cfg: Record<string, string> = {
    DAMDATA: 'bg-blue-50 text-blue-700 border-blue-200',
    SAIH:    'bg-teal-50 text-teal-700 border-teal-200',
    Manual:  'bg-orange-50 text-orange-700 border-orange-200',
  };
  return (
    <span className={`px-2 py-0.5 rounded-md text-xs font-semibold border ${cfg[source] || 'bg-slate-100 text-slate-600 border-slate-200'}`}>
      {source}
    </span>
  );
}
