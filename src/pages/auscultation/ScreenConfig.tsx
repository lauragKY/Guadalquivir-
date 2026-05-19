import React, { useState } from 'react';
import { CheckCircle, Save, Plus, ChevronDown, ChevronUp, AlertTriangle, Settings } from 'lucide-react';
import { VARIABLES, FORMULA_VERSIONS } from './mockData';
import type { Screen } from './types';

interface Props { onNavigate: (s: Screen) => void; }

export default function ScreenConfig({ onNavigate }: Props) {
  const [selectedVar, setSelectedVar] = useState(VARIABLES[0].id);
  const [expandedVersions, setExpandedVersions] = useState(false);
  const [formulaSE, setFormulaSE] = useState(VARIABLES[0].formula_se);
  const [formulaE0, setFormulaE0] = useState(VARIABLES[0].formula_e0);
  const [formulaE1, setFormulaE1] = useState('Q > 4×10⁻¹³ × exp(0,0563 × NE) + 175,47');
  const [changeReason, setChangeReason] = useState('');
  const [syntaxOk, setSyntaxOk] = useState<boolean | null>(null);
  const [saved, setSaved] = useState(false);

  const v = VARIABLES.find(x => x.id === selectedVar) || VARIABLES[0];

  const handleVarChange = (id: string) => {
    const nv = VARIABLES.find(x => x.id === id);
    if (nv) { setSelectedVar(id); setFormulaSE(nv.formula_se); setFormulaE0(nv.formula_e0); setSyntaxOk(null); setSaved(false); }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Configuración de umbrales</h2>
          <p className="text-sm text-slate-500 mt-0.5">Solo el Administrador SIPRESAS puede modificar fórmulas</p>
        </div>
        <span className="px-3 py-1.5 rounded-full text-xs font-bold bg-slate-700 text-white">Administrador SIPRESAS</span>
      </div>

      {/* Variable selector */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
        <label className="block text-xs font-bold uppercase tracking-wide text-slate-500 mb-2">Variable de auscultación</label>
        <select
          value={selectedVar}
          onChange={e => handleVarChange(e.target.value)}
          className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {VARIABLES.map(v => <option key={v.id} value={v.id}>{v.name} ({v.code})</option>)}
        </select>

        <div className="mt-4 grid grid-cols-3 gap-3 text-xs">
          {[
            { label: 'Sensor', value: v.sensor_code },
            { label: 'Unidad', value: v.unit },
            { label: 'Versión activa', value: `v${FORMULA_VERSIONS[0].version}` },
          ].map(item => (
            <div key={item.label} className="bg-slate-50 rounded-lg p-3 border border-slate-100">
              <p className="text-slate-400 font-semibold uppercase tracking-wide mb-0.5">{item.label}</p>
              <p className="font-bold text-slate-700">{item.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Variables dependientes */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
        <h3 className="font-bold text-slate-800 text-sm mb-3">Variables dependientes configuradas</h3>
        <div className="grid grid-cols-3 gap-3">
          {[
            { symbol: 'Q', description: 'Filtración total', unit: v.unit, source: 'DAMDATA' },
            { symbol: 'NE', description: 'Nivel de embalse', unit: 'm.s.n.m.', source: 'SAIH' },
            { symbol: 'T', description: 'Temperatura ambiente', unit: '°C', source: 'SAIH' },
          ].map(dep => (
            <div key={dep.symbol} className="rounded-xl border border-slate-200 p-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-lg font-bold text-blue-700 font-mono">{dep.symbol}</span>
                <span className={`text-xs px-2 py-0.5 rounded font-semibold border ${dep.source === 'DAMDATA' ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-teal-50 text-teal-700 border-teal-200'}`}>{dep.source}</span>
              </div>
              <p className="text-xs text-slate-600">{dep.description}</p>
              <p className="text-xs text-slate-400">{dep.unit}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Formula editor */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4">
        <h3 className="font-bold text-slate-800 text-sm">Editor de fórmulas</h3>

        {[
          { label: 'Situación Extraordinaria', val: formulaSE, set: setFormulaSE, color: 'amber', placeholder: 'Ej: Q > 4×10⁻¹³ × exp(0,0563 × NE) + 58,49' },
          { label: 'Escenario 0',              val: formulaE0, set: setFormulaE0, color: 'red',   placeholder: 'Ej: Q > 4×10⁻¹³ × exp(0,0563 × NE) + 116,98' },
          { label: 'Escenario 1',              val: formulaE1, set: setFormulaE1, color: 'red',   placeholder: 'Ej: Q > 4×10⁻¹³ × exp(0,0563 × NE) + 175,47' },
        ].map(item => (
          <div key={item.label}>
            <label className={`block text-xs font-bold uppercase tracking-wide mb-1.5 ${item.color === 'amber' ? 'text-amber-700' : 'text-red-700'}`}>
              {item.label}
            </label>
            <div className="relative">
              <input
                value={item.val}
                onChange={e => { item.set(e.target.value); setSyntaxOk(null); setSaved(false); }}
                className={`w-full px-3 py-2.5 border rounded-lg text-sm font-mono focus:outline-none focus:ring-2 ${item.color === 'amber' ? 'border-amber-300 focus:ring-amber-500 bg-amber-50' : 'border-red-300 focus:ring-red-500 bg-red-50'}`}
                placeholder={item.placeholder}
              />
            </div>
          </div>
        ))}

        {/* Validation */}
        {syntaxOk === true && (
          <div className="flex items-center gap-2 text-sm text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg p-3">
            <CheckCircle size={15} /> Sintaxis validada correctamente. Fórmula lista para guardar.
          </div>
        )}
        {syntaxOk === false && (
          <div className="flex items-center gap-2 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg p-3">
            <AlertTriangle size={15} /> Error de sintaxis detectado. Verifique la expresión matemática.
          </div>
        )}

        {/* Change reason */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wide text-slate-500 mb-1.5">Motivo del cambio (obligatorio para guardar)</label>
          <textarea
            value={changeReason}
            onChange={e => setChangeReason(e.target.value)}
            rows={2}
            placeholder="Describa el motivo de la modificación de la fórmula..."
            className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => setSyntaxOk(true)}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl transition-colors"
          >
            Validar fórmula
          </button>
          <button
            onClick={() => { if (syntaxOk && changeReason.trim()) setSaved(true); }}
            disabled={!syntaxOk || !changeReason.trim()}
            className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-300 text-white text-sm font-bold rounded-xl transition-colors"
          >
            <Save size={14} /> Guardar nueva versión
          </button>
        </div>

        {saved && (
          <div className="flex items-center gap-2 text-sm text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg p-3">
            <CheckCircle size={15} /> Nueva versión guardada. Registrada en auditoría. Activa inmediatamente.
          </div>
        )}
      </div>

      {/* Version history */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <button
          onClick={() => setExpandedVersions(v => !v)}
          className="w-full flex items-center justify-between px-5 py-4 hover:bg-slate-50 transition-colors"
        >
          <h3 className="font-bold text-slate-800 text-sm">Histórico de versiones de la fórmula</h3>
          {expandedVersions ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
        </button>
        {expandedVersions && (
          <div className="border-t border-slate-100">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-2.5 text-left text-xs font-semibold text-slate-500">Versión</th>
                  <th className="px-4 py-2.5 text-left text-xs font-semibold text-slate-500">Fórmula S.E.</th>
                  <th className="px-4 py-2.5 text-left text-xs font-semibold text-slate-500">Usuario</th>
                  <th className="px-4 py-2.5 text-left text-xs font-semibold text-slate-500">Fecha</th>
                  <th className="px-4 py-2.5 text-left text-xs font-semibold text-slate-500">Motivo</th>
                  <th className="px-4 py-2.5 text-center text-xs font-semibold text-slate-500">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {FORMULA_VERSIONS.map((fv, i) => (
                  <tr key={fv.version} className={i === 0 ? 'bg-blue-50/30' : ''}>
                    <td className="px-4 py-3">
                      <span className="font-bold text-slate-800 font-mono">v{fv.version}</span>
                      {i === 0 && <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded font-semibold">Activa</span>}
                    </td>
                    <td className="px-4 py-3 text-xs font-mono text-slate-600 max-w-xs truncate">{fv.formula_se}</td>
                    <td className="px-4 py-3 text-xs text-slate-600">{fv.user}</td>
                    <td className="px-4 py-3 text-xs text-slate-500 font-mono">{fv.date}</td>
                    <td className="px-4 py-3 text-xs text-slate-500 max-w-xs truncate">{fv.reason}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${fv.approved ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                        {fv.approved ? 'Aprobada' : 'Pendiente'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
