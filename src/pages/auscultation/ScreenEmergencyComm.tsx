import React, { useState } from 'react';
import { Shield, Send, CheckCircle, AlertTriangle, AlertOctagon, FileText, Clock, User, ChevronDown, ChevronUp } from 'lucide-react';
import { ALERTS, VARIABLES, CURRENT_DATE, CURRENT_TIME, CURRENT_NE, calcThresholdSE, calcThresholdE0 } from './mockData';
import type { Screen } from './types';

interface Props { onNavigate: (s: Screen, id?: string) => void; }

const EMERGENCY_LOG = [
  { id: 'ec1', date: '06/05/2026 11:35', scenario: 'S. Extraordinaria', user: 'Director/a Explotación', notes: 'Comunicación informativa. PEP no activado. Seguimiento diario activado.', sent: true },
];

export default function ScreenEmergencyComm({ onNavigate }: Props) {
  const [scenario, setScenario] = useState<'extraordinary' | 'scenario_0' | 'scenario_1'>('extraordinary');
  const [notes, setNotes] = useState('');
  const [sent, setSent] = useState(false);
  const [showLog, setShowLog] = useState(false);

  const urgentVar = VARIABLES.find(v => v.status === 'extraordinary' || v.status === 'scenario_0');
  const tSE = calcThresholdSE(CURRENT_NE);
  const tE0 = calcThresholdE0(CURRENT_NE);

  const SCENARIO_CFG = {
    extraordinary: { label: 'Situación Extraordinaria', color: 'amber', icon: <AlertTriangle size={18} className="text-amber-600" />, bg: 'bg-amber-50', border: 'border-amber-300', text: 'text-amber-900', description: 'Superación del umbral de Situación Extraordinaria. No activa el PEP pero requiere notificación y vigilancia intensificada.' },
    scenario_0:    { label: 'Escenario 0',              color: 'red',   icon: <AlertOctagon size={18} className="text-red-600" />, bg: 'bg-red-50', border: 'border-red-300', text: 'text-red-900', description: 'Superación del umbral de Escenario 0. Propuesta de activación del PEP al Organismo de Cuenca.' },
    scenario_1:    { label: 'Escenario 1',              color: 'red',   icon: <AlertOctagon size={18} className="text-red-700" />, bg: 'bg-red-100', border: 'border-red-400', text: 'text-red-900', description: 'Escenario de rotura inminente. Activación inmediata del PEP. Coordinación con Protección Civil.' },
  };
  const cfg = SCENARIO_CFG[scenario];

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-900">Comunicación al Plan de Emergencia</h2>
        <span className="text-xs text-slate-500">Presa de Bembézar · CHGuadalquivir</span>
      </div>

      {/* Active situation summary */}
      {urgentVar && (
        <div className="bg-amber-50 border border-amber-300 rounded-xl p-4 flex items-start gap-3">
          <AlertTriangle size={18} className="text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-amber-900 text-sm">Situación activa: {urgentVar.name}</p>
            <p className="text-xs text-amber-700 mt-0.5">
              Valor actual: <strong>{urgentVar.current_value.toFixed(1)} {urgentVar.unit}</strong>
              {' '}· Umbral S.E.: <strong>{tSE.toFixed(1)}</strong>
              {' '}· Umbral E.0: <strong>{tE0.toFixed(1)}</strong>
              {' '}· NE: <strong>{CURRENT_NE} m.s.n.m.</strong>
            </p>
          </div>
        </div>
      )}

      {/* Communication form */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4">
        <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
          <Shield size={14} className="text-red-600" /> Formulario de comunicación al PEP
        </h3>

        {/* Scenario selector */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wide text-slate-500 mb-2">Escenario a comunicar</label>
          <div className="grid grid-cols-3 gap-3">
            {(Object.keys(SCENARIO_CFG) as Array<keyof typeof SCENARIO_CFG>).map(s => (
              <button
                key={s}
                onClick={() => setScenario(s)}
                className={`rounded-xl border-2 p-3 text-left transition-all ${scenario === s ? `${SCENARIO_CFG[s].border} ${SCENARIO_CFG[s].bg}` : 'border-slate-200 bg-white hover:bg-slate-50'}`}
              >
                <div className="flex items-center gap-2 mb-1">
                  {SCENARIO_CFG[s].icon}
                  <span className={`text-xs font-bold ${scenario === s ? SCENARIO_CFG[s].text : 'text-slate-700'}`}>{SCENARIO_CFG[s].label}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Scenario info */}
        <div className={`rounded-xl border p-4 ${cfg.bg} ${cfg.border}`}>
          <p className={`text-xs font-bold uppercase tracking-wide mb-1 ${cfg.text}`}>{cfg.label}</p>
          <p className={`text-sm ${cfg.text}`}>{cfg.description}</p>
        </div>

        {/* Computed data */}
        <div className="bg-slate-50 rounded-xl border border-slate-200 p-4">
          <p className="text-xs font-bold uppercase tracking-wide text-slate-500 mb-3">Datos técnicos que se incluirán en la comunicación</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: 'Presa', value: 'Bembézar' },
              { label: 'Fecha/Hora', value: `${CURRENT_DATE} ${CURRENT_TIME}` },
              { label: 'Variable crítica', value: urgentVar?.name ?? '—' },
              { label: 'Valor medido', value: urgentVar ? `${urgentVar.current_value.toFixed(1)} ${urgentVar.unit}` : '—' },
              { label: 'NE actual (SAIH)', value: `${CURRENT_NE} m.s.n.m.` },
              { label: 'Umbral S.E.', value: `${tSE.toFixed(1)} lts/min` },
              { label: 'Umbral E.0', value: `${tE0.toFixed(1)} lts/min` },
              { label: 'Escenario propuesto', value: cfg.label },
            ].map(item => (
              <div key={item.label}>
                <p className="text-xs text-slate-400 font-semibold uppercase tracking-wide mb-0.5">{item.label}</p>
                <p className="text-xs font-bold text-slate-700">{item.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Recipient */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-slate-50 rounded-xl border border-slate-200 p-4">
            <p className="text-xs font-bold uppercase tracking-wide text-slate-500 mb-2 flex items-center gap-1"><User size={12} /> Destinatario principal</p>
            <p className="text-sm font-bold text-slate-800">Director/a Técnico/a de PEP</p>
            <p className="text-xs text-slate-500">CHGuadalquivir · Área de Seguridad de Presas</p>
          </div>
          <div className="bg-slate-50 rounded-xl border border-slate-200 p-4">
            <p className="text-xs font-bold uppercase tracking-wide text-slate-500 mb-2 flex items-center gap-1"><Clock size={12} /> Plazo de respuesta</p>
            <p className="text-sm font-bold text-slate-800">
              {scenario === 'extraordinary' ? '24 horas' : '2 horas'}
            </p>
            <p className="text-xs text-slate-500">Según procedimiento Norma de Explotación</p>
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wide text-slate-500 mb-1.5">Observaciones adicionales (opcional)</label>
          <textarea
            value={notes}
            onChange={e => setNotes(e.target.value)}
            rows={3}
            placeholder="Añada cualquier observación técnica relevante para el receptor del PEP..."
            className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
        </div>

        {/* Supporting docs */}
        <div className="bg-slate-50 rounded-xl border border-slate-200 p-4">
          <p className="text-xs font-bold uppercase tracking-wide text-slate-500 mb-2 flex items-center gap-2"><FileText size={12} /> Documentación adjunta automática</p>
          <div className="space-y-1">
            {[
              'Histórico de lecturas AUS-Q-FT-001 (últimos 30 días)',
              'Cálculo de umbrales con NE actual (SAIH)',
              'Registro de avisos previos (avisos a1, a2, a3)',
              'Ficha de la presa — Bembézar',
            ].map(doc => (
              <div key={doc} className="flex items-center gap-2 text-xs text-slate-600">
                <CheckCircle size={11} className="text-emerald-500 flex-shrink-0" />
                {doc}
              </div>
            ))}
          </div>
        </div>

        {/* Send button */}
        {!sent ? (
          <button
            onClick={() => setSent(true)}
            className="flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-colors shadow-sm"
          >
            <Send size={16} /> Enviar comunicación a Plan de Emergencia
          </button>
        ) : (
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center gap-3">
            <CheckCircle size={20} className="text-emerald-600 flex-shrink-0" />
            <div>
              <p className="font-bold text-emerald-900 text-sm">Comunicación enviada correctamente</p>
              <p className="text-xs text-emerald-700 mt-0.5">
                Registrada en auditoría · {CURRENT_DATE} {CURRENT_TIME} · Destinatario: Director/a Técnico PEP · Hash de integridad generado.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Log */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <button
          onClick={() => setShowLog(v => !v)}
          className="w-full flex items-center justify-between px-5 py-4 hover:bg-slate-50 transition-colors"
        >
          <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
            <Clock size={14} className="text-slate-500" /> Historial de comunicaciones enviadas
          </h3>
          {showLog ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
        </button>
        {showLog && (
          <div className="border-t border-slate-100">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-2.5 text-left text-xs font-semibold text-slate-500">Fecha/Hora</th>
                  <th className="px-4 py-2.5 text-left text-xs font-semibold text-slate-500">Escenario</th>
                  <th className="px-4 py-2.5 text-left text-xs font-semibold text-slate-500">Enviado por</th>
                  <th className="px-4 py-2.5 text-left text-xs font-semibold text-slate-500">Observaciones</th>
                  <th className="px-4 py-2.5 text-center text-xs font-semibold text-slate-500">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {EMERGENCY_LOG.map(entry => (
                  <tr key={entry.id}>
                    <td className="px-4 py-3 text-xs font-mono text-slate-600">{entry.date}</td>
                    <td className="px-4 py-3">
                      <span className="text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded">{entry.scenario}</span>
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-600">{entry.user}</td>
                    <td className="px-4 py-3 text-xs text-slate-500 max-w-xs truncate">{entry.notes}</td>
                    <td className="px-4 py-3 text-center">
                      <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-semibold">Enviada</span>
                    </td>
                  </tr>
                ))}
                {sent && (
                  <tr className="bg-emerald-50/30">
                    <td className="px-4 py-3 text-xs font-mono text-slate-600">{CURRENT_DATE} {CURRENT_TIME}</td>
                    <td className="px-4 py-3">
                      <span className="text-xs font-semibold text-red-700 bg-red-50 border border-red-200 px-2 py-0.5 rounded">{cfg.label}</span>
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-600">Técnico Auscultación</td>
                    <td className="px-4 py-3 text-xs text-slate-500">{notes || '—'}</td>
                    <td className="px-4 py-3 text-center">
                      <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-semibold">Enviada</span>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
