import { useState } from 'react';
import { X, Phone, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface TelephoneProtocolModalProps {
  isOpen: boolean;
  onClose: () => void;
  damId: string;
  scenarioLevel: string;
  scenarioId?: string;
}

interface Contact {
  name: string;
  role: string;
  phone: string;
  priority: number;
}

const protocolContacts: Contact[] = [
  { name: 'Director del Plan', role: 'director', phone: '+34 900 123 456', priority: 1 },
  { name: 'Protección Civil Provincial', role: 'authority', phone: '+34 900 234 567', priority: 2 },
  { name: 'Subdelegación del Gobierno', role: 'authority', phone: '+34 900 345 678', priority: 3 },
  { name: 'Alcalde/sa del Municipio', role: 'local_authority', phone: '+34 900 456 789', priority: 4 },
  { name: 'Guardia Civil - Puesto Local', role: 'security', phone: '+34 900 567 890', priority: 5 },
  { name: '112 - Emergencias', role: 'emergency', phone: '112', priority: 6 }
];

export default function TelephoneProtocolModal({
  isOpen,
  onClose,
  damId,
  scenarioLevel,
  scenarioId
}: TelephoneProtocolModalProps) {
  const [callLog, setCallLog] = useState<{ [key: string]: { status: 'pending' | 'completed' | 'no_answer'; time?: string; notes?: string } }>({});
  const [currentMessage, setCurrentMessage] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleMarkCall = (phone: string, status: 'completed' | 'no_answer') => {
    setCallLog(prev => ({
      ...prev,
      [phone]: {
        status,
        time: new Date().toLocaleTimeString('es-ES')
      }
    }));
  };

  const handleSaveProtocol = async () => {
    if (Object.keys(callLog).length === 0) {
      alert('Por favor, registre al menos una llamada antes de guardar');
      return;
    }

    setIsSaving(true);
    setSaveStatus('idle');

    try {
      const { data: { user } } = await supabase.auth.getUser();

      let activeScenarioId = scenarioId;

      if (!activeScenarioId) {
        const { data: scenarioData, error: scenarioError } = await supabase
          .from('emergency_scenarios')
          .insert({
            dam_id: damId,
            scenario_type: scenarioLevel,
            activation_mode: 'manual',
            activated_by: user?.id,
            status: 'active'
          })
          .select()
          .single();

        if (scenarioError) throw scenarioError;
        activeScenarioId = scenarioData.id;
      }

      const callDetails = protocolContacts.map(contact => ({
        name: contact.name,
        role: contact.role,
        phone: contact.phone,
        status: callLog[contact.phone]?.status || 'pending',
        time: callLog[contact.phone]?.time || null,
        notes: callLog[contact.phone]?.notes || null
      }));

      const { error: commError } = await supabase
        .from('emergency_communications')
        .insert({
          scenario_id: activeScenarioId,
          communication_type: 'phone',
          subject: `Protocolo Telefónico - ${scenarioLevel.toUpperCase()}`,
          body: currentMessage || 'Protocolo telefónico ejecutado según el Plan de Emergencia',
          recipients: callDetails,
          delivery_status: 'sent',
          created_by: user?.id
        });

      if (commError) throw commError;

      setSaveStatus('success');
      setTimeout(() => {
        onClose();
        setCallLog({});
        setCurrentMessage('');
        setSaveStatus('idle');
      }, 2000);
    } catch (error) {
      console.error('Error saving telephone protocol:', error);
      setSaveStatus('error');
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  const completedCalls = Object.values(callLog).filter(c => c.status === 'completed').length;
  const totalContacts = protocolContacts.length;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Phone className="w-6 h-6 text-green-600" />
            <h2 className="text-xl font-bold text-gray-900">Protocolo Telefónico de Emergencia</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-semibold text-orange-900">Protocolo de Activación: {scenarioLevel.toUpperCase()}</p>
                <p className="text-sm text-orange-700 mt-1">
                  Realice las llamadas siguiendo el orden de prioridad establecido. Registre el estado de cada llamada.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-2">Progreso de Llamadas</h3>
            <div className="flex items-center gap-4">
              <div className="flex-1 bg-gray-200 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-green-500 h-full transition-all duration-300"
                  style={{ width: `${(completedCalls / totalContacts) * 100}%` }}
                />
              </div>
              <span className="text-sm font-medium text-blue-900">
                {completedCalls} / {totalContacts}
              </span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Mensaje a Comunicar
            </label>
            <textarea
              value={currentMessage}
              onChange={(e) => setCurrentMessage(e.target.value)}
              rows={3}
              placeholder="Escriba el mensaje que comunicará telefónicamente..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
            />
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Contactos del Protocolo</h3>
            <div className="space-y-3">
              {protocolContacts.map(contact => {
                const callStatus = callLog[contact.phone];
                return (
                  <div
                    key={contact.phone}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      callStatus?.status === 'completed'
                        ? 'bg-green-50 border-green-300'
                        : callStatus?.status === 'no_answer'
                        ? 'bg-yellow-50 border-yellow-300'
                        : 'bg-white border-gray-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 flex-1">
                        <div className="w-10 h-10 bg-green-100 text-green-700 rounded-full flex items-center justify-center font-bold">
                          {contact.priority}
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900">{contact.name}</p>
                          <p className="text-sm text-gray-600">{contact.phone}</p>
                          {callStatus?.time && (
                            <div className="flex items-center gap-1 mt-1 text-xs text-gray-500">
                              <Clock className="w-3 h-3" />
                              <span>{callStatus.time}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {!callStatus || callStatus.status === 'pending' ? (
                          <>
                            <button
                              onClick={() => handleMarkCall(contact.phone, 'completed')}
                              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                            >
                              <CheckCircle className="w-4 h-4 inline mr-1" />
                              Contactado
                            </button>
                            <button
                              onClick={() => handleMarkCall(contact.phone, 'no_answer')}
                              className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors text-sm font-medium"
                            >
                              Sin Respuesta
                            </button>
                          </>
                        ) : (
                          <div className="flex items-center gap-2">
                            {callStatus.status === 'completed' ? (
                              <span className="flex items-center gap-1 text-green-700 font-medium text-sm">
                                <CheckCircle className="w-4 h-4" />
                                Contactado
                              </span>
                            ) : (
                              <span className="flex items-center gap-1 text-yellow-700 font-medium text-sm">
                                <AlertCircle className="w-4 h-4" />
                                Sin respuesta
                              </span>
                            )}
                            <button
                              onClick={() => {
                                const newLog = { ...callLog };
                                delete newLog[contact.phone];
                                setCallLog(newLog);
                              }}
                              className="ml-2 text-xs text-gray-500 hover:text-gray-700 underline"
                            >
                              Reintentar
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {saveStatus === 'success' && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <p className="text-green-800 font-medium">Protocolo telefónico registrado correctamente</p>
            </div>
          )}

          {saveStatus === 'error' && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <p className="text-red-800 font-medium">Error al registrar el protocolo. Inténtelo de nuevo.</p>
            </div>
          )}
        </div>

        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex gap-3 justify-end">
          <button
            onClick={onClose}
            disabled={isSaving}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            onClick={handleSaveProtocol}
            disabled={isSaving || Object.keys(callLog).length === 0}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isSaving ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Guardando...
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4" />
                Guardar Protocolo
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}