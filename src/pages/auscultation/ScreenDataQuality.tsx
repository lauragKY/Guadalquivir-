import React, { useState } from 'react';
import { AlertTriangle, CheckCircle, CreditCard as Edit3, Clock, User, Plus, XCircle } from 'lucide-react';
import { DATA_QUALITY_ISSUES, VARIABLES, CURRENT_DATE, CURRENT_TIME } from './mockData';
import type { Screen, DataQualityIssue } from './types';

interface Props { onNavigate: (s: Screen, id?: string) => void; }

const ISSUE_TYPE_CFG = {
  incoherent:    { label: 'Dato incoherente', color: 'bg-orange-100 text-orange-700 border-orange-200' },
  not_received:  { label: 'Sin dato',         color: 'bg-slate-100 text-slate-600 border-slate-200' },
  out_of_range:  { label: 'Fuera de rango',   color: 'bg-red-100 text-red-700 border-red-200' },
  manual_entry:  { label: 'Dato manual',       color: 'bg-blue-100 text-blue-700 border-blue-200' },
};

export default function ScreenDataQuality({ onNavigate }: Props) {
  const [issues, setIssues] = useState<DataQualityIssue[]>(DATA_QUALITY_ISSUES);
  const [showNewForm, setShowNewForm] = useState(false);
  const [newVarId, setNewVarId] = useState('v1');
  const [newReason, setNewReason] = useState('');
  const [newOrigValue, setNewOrigValue] = useState('');
  const [newIssueType, setNewIssueType] = useState<DataQualityIssue['issue_type']>('incoherent');
  const [selected, setSelected] = useState<DataQualityIssue | null>(issues[0] ?? null);

  const handleNewIssue = () => {
    const newV = VARIABLES.find(v => v.id === newVarId);
    if (!newV || !newReason.trim()) return;
    const issue: DataQualityIssue = {
      id: `dq${Date.now()}`,
      variable_id: newVarId,
      variable_name: newV.name,
      issue_type: newIssueType,
      original_value: newOrigValue ? parseFloat(newOrigValue) : null,
      corrected_value: null,
      user: 'Técnico Auscultación',
      date: `${CURRENT_DATE} ${CURRENT_TIME}`,
      reason: newReason,
      resolved: false,
    };
    setIssues(prev => [issue, ...prev]);
    setSelected(issue);
    setShowNewForm(false);
    setNewReason('');
    setNewOrigValue('');
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-900">Gestión de datos incoherentes</h2>
        <button
          onClick={() => setShowNewForm(v => !v)}
          className="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-bold rounded-xl transition-colors"
        >
          <Plus size={14} /> Registrar incidencia
        </button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total incidencias', value: issues.length,                              color: 'text-slate-700', bg: 'bg-slate-100' },
          { label: 'Resueltas',         value: issues.filter(i => i.resolved).length,      color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Pendientes',        value: issues.filter(i => !i.resolved).length,     color: 'text-orange-600', bg: 'bg-orange-50' },
        ].map(item => (
          <div key={item.label} className={`rounded-xl border border-slate-200 ${item.bg} p-4 text-center`}>
            <p className={`text-2xl font-bold ${item.color}`}>{item.value}</p>
            <p className="text-xs text-slate-500 mt-0.5">{item.label}</p>
          </div>
        ))}
      </div>

      {/* New issue form */}
      {showNewForm && (
        <div className="bg-orange-50 border border-orange-300 rounded-xl p-5 space-y-3">
          <h3 className="font-bold text-orange-900 text-sm flex items-center gap-2">
            <AlertTriangle size={14} /> Nueva incidencia de calidad de dato
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wide text-slate-500 mb-1">Variable afectada</label>
              <select
                value={newVarId}
                onChange={e => setNewVarId(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                {VARIABLES.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wide text-slate-500 mb-1">Tipo de incidencia</label>
              <select
                value={newIssueType}
                onChange={e => setNewIssueType(e.target.value as DataQualityIssue['issue_type'])}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="incoherent">Dato incoherente</option>
                <option value="not_received">Sin dato recibido</option>
                <option value="out_of_range">Fuera de rango</option>
                <option value="manual_entry">Dato manual</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wide text-slate-500 mb-1">Valor original (si procede)</label>
            <input
              type="number"
              value={newOrigValue}
              onChange={e => setNewOrigValue(e.target.value)}
              placeholder="Ej: 0.0"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wide text-slate-500 mb-1">Descripción / motivo (obligatorio)</label>
            <textarea
              value={newReason}
              onChange={e => setNewReason(e.target.value)}
              rows={2}
              placeholder="Describa el problema detectado y las circunstancias..."
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
            />
          </div>
          <div className="flex gap-3">
            <button onClick={() => setShowNewForm(false)} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold rounded-xl">Cancelar</button>
            <button onClick={handleNewIssue} disabled={!newReason.trim()} className="px-4 py-2 bg-orange-600 hover:bg-orange-700 disabled:bg-orange-300 text-white text-sm font-bold rounded-xl">Registrar incidencia</button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Issue list */}
        <div className="lg:col-span-1 space-y-2">
          {issues.map(issue => (
            <button
              key={issue.id}
              onClick={() => setSelected(issue)}
              className={`w-full text-left rounded-xl border p-4 transition-all ${selected?.id === issue.id ? 'border-orange-400 bg-orange-50/40 shadow-sm' : 'border-slate-200 bg-white hover:bg-slate-50'}`}
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className={`text-xs px-2 py-0.5 rounded border font-semibold ${ISSUE_TYPE_CFG[issue.issue_type]?.color ?? 'bg-slate-100 text-slate-600 border-slate-200'}`}>
                  {ISSUE_TYPE_CFG[issue.issue_type]?.label ?? issue.issue_type}
                </span>
                <span className={`text-xs font-bold ${issue.resolved ? 'text-emerald-600' : 'text-orange-600'}`}>
                  {issue.resolved ? 'Resuelta' : 'Pendiente'}
                </span>
              </div>
              <p className="text-xs font-bold text-slate-800">{issue.variable_name}</p>
              <p className="text-xs text-slate-500 font-mono mt-0.5">{issue.date}</p>
            </button>
          ))}
        </div>

        {/* Issue detail */}
        {selected && (
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-xs px-2 py-0.5 rounded border font-semibold ${ISSUE_TYPE_CFG[selected.issue_type]?.color ?? 'bg-slate-100 text-slate-600 border-slate-200'}`}>
                      {ISSUE_TYPE_CFG[selected.issue_type]?.label ?? selected.issue_type}
                    </span>
                    <span className={`text-xs font-bold ${selected.resolved ? 'text-emerald-600' : 'text-orange-600'}`}>
                      {selected.resolved ? 'Resuelta' : 'Pendiente resolución'}
                    </span>
                  </div>
                  <h3 className="font-bold text-slate-900">{selected.variable_name}</h3>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'Fecha/Hora', value: selected.date },
                  { label: 'Registrado por', value: selected.user },
                  { label: 'Valor original', value: selected.original_value !== null ? selected.original_value.toString() : '— (sin dato)' },
                  { label: 'Valor corregido', value: selected.corrected_value !== null ? selected.corrected_value.toString() : '— (pendiente)' },
                ].map(item => (
                  <div key={item.label} className="bg-slate-50 rounded-lg border border-slate-100 p-3">
                    <p className="text-xs text-slate-400 font-semibold uppercase tracking-wide mb-0.5">{item.label}</p>
                    <p className="text-sm font-bold text-slate-700 font-mono">{item.value}</p>
                  </div>
                ))}
              </div>

              <div className="bg-slate-50 rounded-xl border border-slate-200 p-4">
                <p className="text-xs font-bold uppercase tracking-wide text-slate-500 mb-1.5">Descripción / motivo</p>
                <p className="text-sm text-slate-800">{selected.reason}</p>
              </div>

              {selected.resolved ? (
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center gap-2">
                  <CheckCircle size={16} className="text-emerald-600 flex-shrink-0" />
                  <p className="text-sm text-emerald-800 font-semibold">Incidencia resuelta. El valor corregido ha sido validado y aplicado al historial de cálculo.</p>
                </div>
              ) : (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                  <p className="text-xs font-bold uppercase tracking-wide text-amber-700 mb-2 flex items-center gap-1">
                    <AlertTriangle size={12} /> Impacto en el sistema
                  </p>
                  <ul className="space-y-1">
                    <li className="text-xs text-amber-800 flex items-center gap-1.5"><XCircle size={11} className="text-amber-600 flex-shrink-0" /> Dato excluido del cálculo de umbrales hasta resolución</li>
                    <li className="text-xs text-amber-800 flex items-center gap-1.5"><AlertTriangle size={11} className="text-amber-600 flex-shrink-0" /> Incidencia comunicada al módulo de Mantenimiento (ticket generado)</li>
                    <li className="text-xs text-amber-800 flex items-center gap-1.5"><Edit3 size={11} className="text-amber-600 flex-shrink-0" /> Requiere introducción de dato manual o esperar nueva lectura del sensor</li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
