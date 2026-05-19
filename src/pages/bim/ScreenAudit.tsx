import React, { useState } from 'react';
import { Search, Shield, Hash, Download, ChevronDown, ChevronUp, FileText } from 'lucide-react';
import { BIM_AUDIT, CURRENT_DATE } from './mockData';
import { ROLE_LABEL } from './helpers';
import type { Screen } from './types';

interface Props { onNavigate: (s: Screen) => void; }

const ACTION_CFG: Record<string, string> = {
  'Consulta elemento BIM':       'bg-blue-100 text-blue-700 border-blue-200',
  'Cambio estado elemento':      'bg-amber-100 text-amber-700 border-amber-200',
  'Actualización modelo BIM':    'bg-blue-100 text-blue-700 border-blue-200',
  'Alerta BIM generada':         'bg-red-100 text-red-700 border-red-200',
  'Publicación modelo BIM':      'bg-emerald-100 text-emerald-700 border-emerald-200',
  'Alerta BIM resuelta':         'bg-teal-100 text-teal-700 border-teal-200',
  'Descarga documento':          'bg-slate-100 text-slate-600 border-slate-200',
  'Descarga documento crítico':  'bg-orange-100 text-orange-700 border-orange-200',
  'Modelo BIM almacenado':       'bg-blue-100 text-blue-700 border-blue-200',
};

export default function ScreenAudit({ onNavigate }: Props) {
  const [search, setSearch] = useState('');
  const [expanded, setExpanded] = useState<string | null>(null);

  const filtered = BIM_AUDIT.filter(e =>
    !search || [e.action, e.user, e.result, e.detail, e.resource].some(f => f.toLowerCase().includes(search.toLowerCase()))
  );

  const handleDownload = (format: 'csv' | 'pdf') => {
    if (format === 'pdf') { alert('Simulación: Exportando auditoría a PDF...'); return; }
    const lines = ['Fecha;Hora;Acción;Usuario;Rol;Recurso;Resultado;IP;Hash'];
    filtered.forEach(e => {
      lines.push(`${e.date};${e.time};"${e.action}";"${e.user}";"${ROLE_LABEL[e.role]}";"${e.resource}";"${e.result}";${e.ip};${e.hash}`);
    });
    const blob = new Blob([lines.join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `auditoria_bim_${CURRENT_DATE.replace(/\//g, '-')}.csv`; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Auditoría y trazabilidad BIM</h2>
          <p className="text-sm text-slate-500 mt-0.5">Registro inmutable de accesos, consultas, descargas y cambios</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => handleDownload('csv')} className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-800 text-white text-sm font-bold rounded-xl transition-colors">
            <Download size={14} /> CSV
          </button>
          <button onClick={() => handleDownload('pdf')} className="flex items-center gap-2 px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white text-sm font-bold rounded-xl transition-colors">
            <FileText size={14} /> PDF
          </button>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
        <Shield size={18} className="text-blue-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-bold text-blue-900 text-sm">Registro sellado con hash de integridad</p>
          <p className="text-xs text-blue-700 mt-0.5">Cada entrada incluye hash SHA-256, IP de origen y usuario. El registro es de solo lectura para todos los roles. Se registran accesos, consultas, descargas (incluidas las denegadas) y cambios de estado.</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Entradas totales',       value: BIM_AUDIT.length, color: 'text-slate-700', bg: 'bg-slate-100' },
          { label: 'Acciones manuales',      value: BIM_AUDIT.filter(e => !e.user.includes('Sistema')).length, color: 'text-blue-700', bg: 'bg-blue-50' },
          { label: 'Accesos denegados',      value: BIM_AUDIT.filter(e => e.result.includes('DENEGADO')).length, color: 'text-red-700', bg: 'bg-red-50' },
        ].map(item => (
          <div key={item.label} className={`rounded-xl border border-slate-200 ${item.bg} p-4 text-center`}>
            <p className={`text-2xl font-bold ${item.color}`}>{item.value}</p>
            <p className="text-xs text-slate-500 mt-0.5">{item.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar en el registro de auditoría BIM..." className="w-full pl-8 pr-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500">Fecha/Hora</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500">Acción</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500">Usuario · Rol</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500">Recurso</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500">IP</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500">Hash</th>
                <th className="px-4 py-3 w-8" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map(entry => {
                const cfg = ACTION_CFG[entry.action];
                const isExp = expanded === entry.id;
                const isDenied = entry.result.includes('DENEGADO');
                return (
                  <React.Fragment key={entry.id}>
                    <tr className={`cursor-pointer transition-colors ${isDenied ? 'bg-red-50 hover:bg-red-100' : 'hover:bg-slate-50'}`} onClick={() => setExpanded(isExp ? null : entry.id)}>
                      <td className="px-4 py-3 text-xs font-mono text-slate-600 whitespace-nowrap">{entry.date} {entry.time}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2 py-0.5 rounded border font-semibold ${cfg ?? 'bg-slate-100 text-slate-600 border-slate-200'}`}>{entry.action}</span>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-xs font-bold text-slate-800">{entry.user}</p>
                        <p className="text-xs text-slate-400">{ROLE_LABEL[entry.role]}</p>
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-700 max-w-xs truncate">{entry.resource}</td>
                      <td className="px-4 py-3 text-xs font-mono text-slate-400">{entry.ip}</td>
                      <td className="px-4 py-3">
                        <span className="flex items-center gap-1 text-xs font-mono text-slate-400">
                          <Hash size={10} />{entry.hash.replace('sha256:', '').substring(0, 10)}...
                        </span>
                      </td>
                      <td className="px-4 py-3">{isExp ? <ChevronUp size={14} className="text-slate-400" /> : <ChevronDown size={14} className="text-slate-400" />}</td>
                    </tr>
                    {isExp && (
                      <tr className={isDenied ? 'bg-red-50' : 'bg-slate-50'}>
                        <td colSpan={7} className="px-6 py-4">
                          <div className="grid grid-cols-2 gap-4 text-xs mb-3">
                            <div><p className="font-bold text-slate-500 uppercase tracking-wide mb-1">Resultado</p><p className={isDenied ? 'text-red-800 font-bold' : 'text-slate-800'}>{entry.result}</p></div>
                            <div><p className="font-bold text-slate-500 uppercase tracking-wide mb-1">Detalle / Contexto</p><p className="text-slate-800">{entry.detail}</p></div>
                            {entry.reason && <div><p className="font-bold text-slate-500 uppercase tracking-wide mb-1">Motivo declarado</p><p className="text-slate-800">{entry.reason}</p></div>}
                            <div><p className="font-bold text-slate-500 uppercase tracking-wide mb-1">IP origen</p><p className="text-slate-800 font-mono">{entry.ip}</p></div>
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
                <tr><td colSpan={7} className="px-4 py-10 text-center text-slate-400 text-sm">No hay entradas que coincidan.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
