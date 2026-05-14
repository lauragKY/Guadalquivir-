import React, { useState } from 'react';
import { Send, Save, Eye, CheckCircle2, Clock, Mail, AlertTriangle, Users, FileText } from 'lucide-react';
import type { EmergencyState, Recipient, CommunicationRecord } from './types';
import { SCENARIO_LABELS, CAUSE_LABELS } from './types';
import { Dam } from '../../types';

interface Props {
  dam: Dam;
  state: EmergencyState;
  recipients: Recipient[];
  comms: CommunicationRecord[];
  onToggleRecipient: (id: string) => void;
  onSend: () => void;
  onNext: () => void;
}

const commStatusConfig = {
  borrador:        { label: 'Borrador',        badge: 'bg-slate-100 text-slate-600 border-slate-200', icon: <Clock size={12} /> },
  enviado:         { label: 'Enviado',          badge: 'bg-blue-100 text-blue-700 border-blue-200',   icon: <Send size={12} /> },
  acuse_recibido:  { label: 'Acuse recibido',   badge: 'bg-emerald-100 text-emerald-700 border-emerald-200', icon: <CheckCircle2 size={12} /> },
  fallido:         { label: 'Fallido',          badge: 'bg-red-100 text-red-600 border-red-200',      icon: <AlertTriangle size={12} /> },
};

export default function Screen4Comunicacion({ dam, state, recipients, comms, onToggleRecipient, onSend, onNext }: Props) {
  const [situacion, setSituacion] = useState(
    `Se han superado los umbrales establecidos para la activación del ${SCENARIO_LABELS[state.scenario]} en la ${dam.name}. El nivel del embalse se encuentra en 600,95 m (umbral: 600,87 m), el caudal entrante es de 1.420 m³/s y se han registrado 86 mm de precipitación en las últimas 24 horas.`
  );
  const [medidas, setMedidas] = useState(
    `Se ha activado la vigilancia permanente del embalse (PV-1). Se está procediendo a la prueba de los sistemas de desagüe y grupos electrógenos. El Director/a del Plan ha sido notificado y se han iniciado las actuaciones correspondientes al ${SCENARIO_LABELS[state.scenario]}.`
  );
  const [sent, setSent] = useState(comms.length > 0);
  const [preview, setPreview] = useState(false);

  const selectedRecipients = recipients.filter(r => r.selected);

  if (!state.active) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <AlertTriangle className="text-amber-400 mb-4" size={48} />
        <p className="text-slate-700 font-semibold text-lg mb-2">Escenario no declarado</p>
        <p className="text-slate-500 text-sm">Debe declarar un escenario para generar comunicaciones.</p>
      </div>
    );
  }

  const handleSend = () => {
    setSent(true);
    onSend();
  };

  return (
    <div className="space-y-6">
      {/* Procedimiento aplicable */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 bg-slate-50">
          <h3 className="font-bold text-slate-800 flex items-center gap-2">
            <FileText size={18} className="text-blue-600" />
            Procedimiento aplicable
          </h3>
        </div>
        <div className="p-5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-xs text-slate-400 mb-0.5">Procedimiento</p>
              <p className="font-bold text-blue-700 text-base">PC-3</p>
            </div>
            <div>
              <p className="text-xs text-slate-400 mb-0.5">Tipo</p>
              <p className="font-semibold text-slate-800">Comunicación de declaración de {SCENARIO_LABELS[state.scenario]}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400 mb-0.5">Responsable directo</p>
              <p className="font-semibold text-slate-800">Director/a del Plan</p>
            </div>
            <div>
              <p className="text-xs text-slate-400 mb-0.5">Personal necesario</p>
              <p className="font-semibold text-slate-800">Auxiliar de Comunicaciones</p>
            </div>
            <div>
              <p className="text-xs text-slate-400 mb-0.5">Medios</p>
              <p className="font-semibold text-slate-800">Correo electrónico / fax</p>
            </div>
            <div>
              <p className="text-xs text-slate-400 mb-0.5">Formulario</p>
              <p className="font-bold text-blue-700">F-2</p>
            </div>
            <div>
              <p className="text-xs text-slate-400 mb-0.5">Escenario declarado</p>
              <p className="font-semibold text-slate-800">{SCENARIO_LABELS[state.scenario]}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400 mb-0.5">Hora declaración</p>
              <p className="font-semibold text-slate-800">{state.declaredAt} h</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Destinatarios */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden h-full">
            <div className="px-5 py-4 border-b border-slate-100 bg-slate-50">
              <h3 className="font-bold text-slate-800 flex items-center gap-2">
                <Users size={16} className="text-blue-600" />
                Destinatarios
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">{selectedRecipients.length} seleccionados</p>
            </div>
            <div className="divide-y divide-slate-100">
              {recipients.map(r => (
                <label key={r.id} className={`flex items-start gap-3 px-4 py-3 cursor-pointer hover:bg-blue-50/50 transition-colors ${r.selected ? 'bg-blue-50/30' : ''}`}>
                  <input
                    type="checkbox"
                    checked={r.selected}
                    onChange={() => !r.required && onToggleRecipient(r.id)}
                    disabled={r.required}
                    className="mt-0.5 w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-800 leading-tight">{r.name}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{r.role}</p>
                    {r.required && <span className="text-xs text-blue-600 font-medium">Obligatorio</span>}
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Formulario F-2 */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
              <h3 className="font-bold text-slate-800 flex items-center gap-2">
                <Mail size={16} className="text-blue-600" />
                Formulario F-2 — Aviso de declaración
              </h3>
              <span className="text-xs text-slate-400">Campos autorrellenados del sistema</span>
            </div>
            <div className="p-5 space-y-4">
              {/* Campos autorrellenados */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {[
                  { label: 'Municipio', value: dam.municipality },
                  { label: 'Provincia', value: dam.province },
                  { label: 'Río', value: dam.river },
                  { label: 'Cuenca', value: 'Guadalquivir' },
                  { label: 'Código de presa', value: dam.code },
                  { label: 'Escenario declarado', value: SCENARIO_LABELS[state.scenario] },
                  { label: 'Causa declarada', value: state.cause ? CAUSE_LABELS[state.cause] : '—' },
                  { label: 'Situación anterior', value: SCENARIO_LABELS['normalidad'] },
                  { label: 'Firmante', value: state.declaredBy || 'Director/a del Plan' },
                ].map(f => (
                  <div key={f.label}>
                    <p className="text-xs text-slate-400 mb-0.5">{f.label}</p>
                    <p className="text-sm font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5">{f.value}</p>
                  </div>
                ))}
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wide text-slate-500 mb-1.5">Descripción de la situación *</label>
                <textarea
                  value={situacion}
                  onChange={e => setSituacion(e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wide text-slate-500 mb-1.5">Medidas adoptadas *</label>
                <textarea
                  value={medidas}
                  onChange={e => setMedidas(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>

              {/* Acciones */}
              <div className="flex items-center gap-3 flex-wrap pt-2 border-t border-slate-100">
                <button className="flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm rounded-lg transition-colors">
                  <Save size={15} /> Guardar borrador
                </button>
                <button
                  onClick={() => setPreview(!preview)}
                  className="flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm rounded-lg transition-colors"
                >
                  <Eye size={15} /> Previsualizar
                </button>
                <button
                  onClick={handleSend}
                  disabled={sent || selectedRecipients.length === 0}
                  className="flex items-center gap-1.5 px-5 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold text-sm rounded-lg transition-colors ml-auto"
                >
                  <Send size={15} />
                  {sent ? 'Enviado' : `Enviar a ${selectedRecipients.length} destinatarios`}
                </button>
              </div>

              {preview && (
                <div className="mt-2 p-4 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 space-y-2">
                  <p className="font-bold text-sm">FORMULARIO F-2 — DECLARACIÓN DE {SCENARIO_LABELS[state.scenario].toUpperCase()}</p>
                  <p><strong>Presa:</strong> {dam.name} ({dam.code}) · {dam.river} · {dam.municipality}, {dam.province}</p>
                  <p><strong>Cuenca:</strong> Confederación Hidrográfica del Guadalquivir</p>
                  <p><strong>Escenario declarado:</strong> {SCENARIO_LABELS[state.scenario]}</p>
                  <p><strong>Causa:</strong> {state.cause ? CAUSE_LABELS[state.cause] : '—'}</p>
                  <p><strong>Hora de declaración:</strong> {state.declaredAt} h</p>
                  <hr className="border-slate-200" />
                  <p><strong>Descripción:</strong> {situacion}</p>
                  <p><strong>Medidas adoptadas:</strong> {medidas}</p>
                  <hr className="border-slate-200" />
                  <p><strong>Firmado:</strong> {state.declaredBy || 'Director/a del Plan'}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Estado de envíos */}
      {sent && comms.length > 0 && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 bg-slate-50">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
              <Send size={16} className="text-blue-600" />
              Registro de envíos
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Destinatario</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Medio</th>
                  <th className="text-center px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Enviado</th>
                  <th className="text-center px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Acuse</th>
                  <th className="text-center px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Estado</th>
                  <th className="text-center px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {comms.map(c => {
                  const cs = commStatusConfig[c.status];
                  return (
                    <tr key={c.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3 font-medium text-slate-800">{c.recipient}</td>
                      <td className="px-4 py-3 text-slate-500">{c.method}</td>
                      <td className="px-4 py-3 text-center text-slate-500">{c.sentAt ? `${c.sentAt} h` : '—'}</td>
                      <td className="px-4 py-3 text-center text-slate-500">{c.ackAt ? `${c.ackAt} h` : '—'}</td>
                      <td className="px-4 py-3 text-center">
                        <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border ${cs.badge}`}>
                          {cs.icon}{cs.label}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        {c.status !== 'acuse_recibido' && (
                          <button className="text-xs text-blue-600 hover:underline font-medium">Registrar acuse</button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="flex justify-end">
        <button onClick={onNext} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-xl text-sm transition-colors">
          Ver registro de emergencia →
        </button>
      </div>
    </div>
  );
}
