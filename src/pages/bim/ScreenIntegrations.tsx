import React, { useState } from 'react';
import { Activity, CheckCircle, AlertTriangle, Clock, ArrowRight, RefreshCw, Zap } from 'lucide-react';
import { MODULE_INTEGRATIONS } from './mockData';
import { IntegrationStatusBadge } from './helpers';
import type { Screen, ModuleIntegration } from './types';

interface Props { onNavigate: (s: Screen) => void; }

const EVENT_TYPE_CFG: Record<string, { label: string; color: string }> = {
  evento_parte_cerrado:                { label: 'Parte cerrado',         color: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
  evento_estado_presa:                 { label: 'Estado presa',          color: 'bg-amber-100 text-amber-700 border-amber-200' },
  evento_umbral_superado:              { label: 'Umbral superado',        color: 'bg-orange-100 text-orange-700 border-orange-200' },
  evento_ficha_inventario_actualizada: { label: 'Ficha inventario',       color: 'bg-blue-100 text-blue-700 border-blue-200' },
  evento_documento_actualizado:        { label: 'Documento actualizado',  color: 'bg-teal-100 text-teal-700 border-teal-200' },
};

const ROLES_TABLE = [
  { role: 'Visualizador',            viewer: true, maintenance: false, auscultation: false, director: false, bim_admin: false, sipresas: false },
  { role: 'Técnico Mantenimiento',   viewer: true, maintenance: true,  auscultation: false, director: false, bim_admin: false, sipresas: false },
  { role: 'Técnico Auscultación',    viewer: true, maintenance: false, auscultation: true,  director: false, bim_admin: false, sipresas: false },
  { role: 'Director/a Explotación',  viewer: true, maintenance: true,  auscultation: true,  director: true,  bim_admin: false, sipresas: false },
  { role: 'Administrador BIM',       viewer: true, maintenance: true,  auscultation: true,  director: true,  bim_admin: true,  sipresas: false },
  { role: 'Admin SIPRESAS',          viewer: true, maintenance: true,  auscultation: true,  director: true,  bim_admin: true,  sipresas: true  },
];

const PERMISSIONS = [
  'Consulta modelo y estados no críticos',
  'Consultar partes y crear incidencias',
  'Consultar sensores y gráficos',
  'Estado global, alertas críticas, escenarios',
  'Cargar/publicar modelos, gestionar mapeos',
  'Acceso completo',
];

export default function ScreenIntegrations({ onNavigate }: Props) {
  const [selected, setSelected] = useState<ModuleIntegration | null>(MODULE_INTEGRATIONS[0]);
  const [activeSection, setActiveSection] = useState<'integrations' | 'roles'>('integrations');
  const [simulatingAccess, setSimulatingAccess] = useState(false);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-900">Integraciones y seguridad BIM</h2>
      </div>

      {/* Section tabs */}
      <div className="flex gap-2">
        {[
          { id: 'integrations' as const, label: 'Módulos integrados' },
          { id: 'roles' as const, label: 'Roles y permisos' },
        ].map(s => (
          <button key={s.id} onClick={() => setActiveSection(s.id)}
            className={`px-4 py-2 text-sm font-bold rounded-xl border transition-colors ${activeSection === s.id ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'}`}>
            {s.label}
          </button>
        ))}
      </div>

      {activeSection === 'integrations' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Integration list */}
          <div className="space-y-2">
            {MODULE_INTEGRATIONS.map(m => (
              <button key={m.id} onClick={() => setSelected(m)}
                className={`w-full text-left rounded-xl border p-4 transition-all ${selected?.id === m.id ? 'border-blue-400 bg-blue-50 shadow-sm' : 'border-slate-200 bg-white hover:bg-slate-50'}`}>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-sm font-bold text-slate-800">{m.name}</span>
                  <IntegrationStatusBadge status={m.status} />
                </div>
                <p className="text-xs text-slate-500 line-clamp-2">{m.description}</p>
                <div className="flex gap-3 mt-2 text-xs text-slate-400">
                  <span>{m.elements_linked} elem.</span>
                  {m.docs_linked && <span>{m.docs_linked} docs</span>}
                  {m.last_sync && <span>{m.last_sync}</span>}
                </div>
              </button>
            ))}
          </div>

          {/* Detail */}
          {selected && (
            <div className="lg:col-span-2 space-y-4">
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-slate-900 text-base">Módulo: {selected.name}</h3>
                      <IntegrationStatusBadge status={selected.status} />
                    </div>
                    {selected.last_sync && (
                      <div className="flex items-center gap-1 text-xs text-teal-600">
                        <RefreshCw size={11} /> Última sincronización: {selected.last_sync}
                      </div>
                    )}
                  </div>
                </div>

                <p className="text-sm text-slate-700 mb-4">{selected.description}</p>

                {/* What this integration provides */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-4 text-xs">
                  <p className="font-bold text-slate-700 uppercase tracking-wide mb-2">Datos intercambiados</p>
                  {selected.id === 'int-inv' && (
                    <ul className="space-y-1 text-slate-600">
                      <li>· Ficha técnica del activo (código, tipo, fabricante, serie)</li>
                      <li>· Estado inventarial y ubicación funcional</li>
                      <li>· Vinculación UUID BIM ↔ identificador de activo en Inventario</li>
                    </ul>
                  )}
                  {selected.id === 'int-maint' && (
                    <ul className="space-y-1 text-slate-600">
                      <li>· Estado de mantenimiento y últimas inspecciones</li>
                      <li>· Último parte PDF de inspección (acceso desde visor BIM)</li>
                      <li>· Órdenes de trabajo abiertas e incidencias</li>
                      <li>· Estadísticas históricas de mantenimiento</li>
                    </ul>
                  )}
                  {selected.id === 'int-expl' && (
                    <ul className="space-y-1 text-slate-600">
                      <li>· Estado global de la presa: Normalidad / S.E. / Escenario 0</li>
                      <li>· Nivel embalse, aportación y caudal desembalsado</li>
                      <li>· Estado de órganos de desagüe en operación</li>
                      <li>· Avisos activos de Explotación</li>
                    </ul>
                  )}
                  {selected.id === 'int-ausc' && (
                    <ul className="space-y-1 text-slate-600">
                      <li>· Valores en tiempo real de variables críticas (DAMDATA/SAIH)</li>
                      <li>· Umbrales S.E. y E.0 calculados según NE actual</li>
                      <li>· Estado del sensor: normal / umbral superado</li>
                      <li>· Gráfico histórico embebido con líneas de umbral</li>
                    </ul>
                  )}
                  {selected.id === 'int-arch' && (
                    <ul className="space-y-1 text-slate-600">
                      <li>· Modelos BIM originales (IFC/RVT/DWG) almacenados</li>
                      <li>· Modelos optimizados para visor (glTF/FBX)</li>
                      <li>· Planos, manuales, partes de inspección e informes</li>
                      <li>· Control de acceso por criticidad del documento</li>
                    </ul>
                  )}
                  {selected.id === 'int-emerg' && (
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-2">
                      <p className="text-amber-800 font-semibold">Esta integración se activa únicamente cuando Explotación declara Escenario 0. En ese momento, el visor BIM muestra un enlace directo al módulo de Gestión de Emergencias.</p>
                    </div>
                  )}
                </div>

                {/* Events received */}
                {selected.events_received.length > 0 && (
                  <div>
                    <p className="font-bold text-slate-700 text-xs uppercase tracking-wide mb-2">Eventos recibidos recientes</p>
                    <div className="space-y-2">
                      {selected.events_received.map(ev => {
                        const cfg = EVENT_TYPE_CFG[ev.event_type];
                        return (
                          <div key={ev.id} className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                            <span className={`text-xs px-2 py-0.5 rounded border font-semibold flex-shrink-0 ${cfg?.color ?? 'bg-slate-100 text-slate-600 border-slate-200'}`}>
                              {cfg?.label ?? ev.event_type}
                            </span>
                            <div className="flex-1 min-w-0">
                              <p className="text-slate-800">{ev.description}</p>
                              {ev.element && <p className="text-slate-400 mt-0.5">Elemento: {ev.element}</p>}
                            </div>
                            <p className="text-slate-400 flex-shrink-0 font-mono">{ev.date} {ev.time}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {selected.id === 'int-emerg' && (
                  <div className="mt-4 p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-600">
                    <Zap size={14} className="text-slate-400 inline mr-1" />
                    Sin eventos activos. La integración se activará si Explotación declara Escenario 0.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {activeSection === 'roles' && (
        <div className="space-y-5">
          {/* Access denied simulation */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
            <h3 className="font-bold text-slate-900 text-sm mb-3">Simulación de control de acceso</h3>
            <div className="flex flex-wrap gap-3 mb-4 items-end">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Usuario simulado</label>
                <select className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none">
                  <option>Visualizador</option>
                  <option>Técnico Mantenimiento</option>
                  <option>Director/a Explotación</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Acción a simular</label>
                <select className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none">
                  <option>Descargar documento crítico</option>
                  <option>Publicar modelo BIM</option>
                  <option>Ver sensor de auscultación</option>
                </select>
              </div>
              <button onClick={() => setSimulatingAccess(true)} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl">Simular acceso</button>
            </div>

            {simulatingAccess && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
                <AlertTriangle size={16} className="text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-red-900 text-sm">Acceso denegado</p>
                  <p className="text-xs text-red-700 mt-0.5">El rol <strong>Visualizador</strong> no tiene permisos para descargar documentos críticos. Se requiere rol mínimo: <strong>Director/a Explotación</strong>.</p>
                  <p className="text-xs text-red-600 mt-1 font-mono">Acción registrada en auditoría BIM · IP: 10.0.14.88 · {new Date().toLocaleTimeString()}</p>
                </div>
              </div>
            )}
          </div>

          {/* Roles table */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-5 py-3 border-b border-slate-200 bg-slate-50">
              <p className="text-sm font-bold text-slate-900">Tabla de permisos por rol</p>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-xs">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-slate-500">Permiso</th>
                    <th className="px-4 py-3 text-center font-semibold text-slate-500">Visualiz.</th>
                    <th className="px-4 py-3 text-center font-semibold text-slate-500">Tec. Mant.</th>
                    <th className="px-4 py-3 text-center font-semibold text-slate-500">Tec. Ausc.</th>
                    <th className="px-4 py-3 text-center font-semibold text-slate-500">Director</th>
                    <th className="px-4 py-3 text-center font-semibold text-slate-500">BIM Admin</th>
                    <th className="px-4 py-3 text-center font-semibold text-slate-500">SIPRESAS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {PERMISSIONS.map((perm, i) => {
                    const row = ROLES_TABLE[i];
                    return (
                      <tr key={perm} className="hover:bg-slate-50">
                        <td className="px-4 py-3 text-slate-700">{perm}</td>
                        {[row.viewer, row.maintenance, row.auscultation, row.director, row.bim_admin, row.sipresas].map((has, j) => (
                          <td key={j} className="px-4 py-3 text-center">
                            {has
                              ? <CheckCircle size={14} className="text-emerald-500 mx-auto" />
                              : <span className="text-slate-300 mx-auto block text-center">—</span>
                            }
                          </td>
                        ))}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
