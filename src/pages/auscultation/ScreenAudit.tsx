import React, { useState } from 'react';
import { Search, Shield, Hash, Download, ChevronDown, ChevronUp } from 'lucide-react';
import { AUDIT_ENTRIES, CURRENT_DATE } from './mockData';
import type { Screen } from './types';

interface Props { onNavigate: (s: Screen, id?: string) => void; }

const ACTION_CFG: Record<string, { color: string }> = {
  'Consulta DAMDATA':              { color: 'bg-blue-100 text-blue-700 border-blue-200' },
  'Consulta SAIH':                 { color: 'bg-teal-100 text-teal-700 border-teal-200' },
  'Cálculo expresión matemática':  { color: 'bg-slate-100 text-slate-700 border-slate-200' },
  'Aviso generado':                { color: 'bg-amber-100 text-amber-700 border-amber-200' },
  'Aviso confirmado':              { color: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
  'Activación rechazada':          { color: 'bg-slate-100 text-slate-600 border-slate-200' },
  'Fórmula modificada':            { color: 'bg-blue-100 text-blue-700 border-blue-200' },
  'Dato marcado incoherente':      { color: 'bg-orange-100 text-orange-700 border-orange-200' },
  'Dato manual introducido':       { color: 'bg-orange-100 text-orange-700 border-orange-200' },
};

export default function ScreenAudit({ onNavigate }: Props) {
  const [search, setSearch] = useState('');
  const [expanded, setExpanded] = useState<string | null>(null);

  const filtered = AUDIT_ENTRIES.filter(e =>
    !search ||
    e.action.toLowerCase().includes(search.toLowerCase()) ||
    e.user.toLowerCase().includes(search.toLowerCase()) ||
    e.result.toLowerCase().includes(search.toLowerCase())
  );

  const handleDownload = () => {
    const lines = ['Fecha;Hora;Acción;Usuario;Resultado;Motivo;Hash'];
    filtered.forEach(e => {
      lines.push(`${e.date};${e.time};"${e.action}";"${e.user}";"${e.result}";"${e.reason}";${e.hash}`);
    });
    const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `auditoria_auscultacion_${CURRENT_DATE.replace(/\//g, '-')}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Auditoría y trazabilidad</h2>
          <p className="text-sm text-slate-500 mt-0.5">Registro inmutable de todas las acciones del sistema</p>
        </div>
        <button
          onClick={handleDownload}
          className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-800 text-white text-sm font-bold rounded-xl transition-colors"
        >
          <Download size={14} /> Exportar CSV
        </button>
      </div>

      {/* Integrity notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
        <Shield size={18} className="text-blue-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-bold text-blue-900 text-sm">Registro sellado con hash de integridad</p>
          <p className="text-xs text-blue-700 mt-0.5">
            Cada entrada del registro de auditoría incluye un hash SHA-256 generado en el momento del registro. Cualquier modificación posterior sería detectable. El registro es de solo lectura para todos los roles.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Entradas totales', value: AUDIT_ENTRIES.length, color: 'text-slate-700', bg: 'bg-slate-100' },
          { label: 'Acciones manuales', value: AUDIT_ENTRIES.filter(e => !e.user.includes('Sistema')).length, color: 'text-blue-700', bg: 'bg-blue-50' },
          { label: 'Acciones automáticas', value: AUDIT_ENTRIES.filter(e => e.user.includes('Sistema')).length, color: 'text-teal-700', bg: 'bg-teal-50' },
        ].map(item => (
          <div key={item.label} className={`rounded-xl border border-slate-200 ${item.bg} p-4 text-center`}>
            <p className={`text-2xl font-bold ${item.color}`}>{item.value}</p>
            <p className="text-xs text-slate-500 mt-0.5">{item.label}</p>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar en el registro de auditoría..."
            className="w-full pl-8 pr-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Audit table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500">Fecha/Hora</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500">Acción</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500">Usuario</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500">Resultado</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500">Hash</th>
                <th className="px-4 py-3 w-8" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map(entry => {
                const cfg = ACTION_CFG[entry.action];
                const isExp = expanded === entry.id;
                return (
                  <React.Fragment key={entry.id}>
                    <tr
                      className="hover:bg-slate-50 cursor-pointer transition-colors"
                      onClick={() => setExpanded(isExp ? null : entry.id)}
                    >
                      <td className="px-4 py-3 text-xs font-mono text-slate-600 whitespace-nowrap">
                        {entry.date} {entry.time}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2 py-0.5 rounded border font-semibold ${cfg?.color ?? 'bg-slate-100 text-slate-600 border-slate-200'}`}>
                          {entry.action}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-700">{entry.user}</td>
                      <td className="px-4 py-3 text-xs text-slate-700 max-w-xs truncate">{entry.result}</td>
                      <td className="px-4 py-3">
                        <span className="flex items-center gap-1 text-xs font-mono text-slate-400">
                          <Hash size={10} />
                          {entry.hash.replace('sha256:', '').substring(0, 10)}...
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {isExp ? <ChevronUp size={14} className="text-slate-400" /> : <ChevronDown size={14} className="text-slate-400" />}
                      </td>
                    </tr>
                    {isExp && (
                      <tr className="bg-slate-50">
                        <td colSpan={6} className="px-6 py-4">
                          <div className="grid grid-cols-2 gap-4 text-xs mb-3">
                            <div>
                              <p className="font-bold text-slate-500 uppercase tracking-wide mb-1">Resultado completo</p>
                              <p className="text-slate-800">{entry.result}</p>
                            </div>
                            <div>
                              <p className="font-bold text-slate-500 uppercase tracking-wide mb-1">Contexto / Motivo</p>
                              <p className="text-slate-800">{entry.reason}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 py-2">
                            <Hash size={12} className="text-slate-400 flex-shrink-0" />
                            <span className="text-xs font-mono text-slate-600 break-all">{entry.hash}</span>
                            <Shield size={11} className="text-emerald-500 flex-shrink-0 ml-auto" />
                            <span className="text-xs text-emerald-600 font-semibold flex-shrink-0">Integridad verificada</span>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-slate-400 text-sm">
                    No hay entradas que coincidan con la búsqueda.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
