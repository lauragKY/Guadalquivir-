import { useState } from 'react';
import { X, Mail, Send, AlertCircle, CheckCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface EmergencyNotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  damId: string;
  scenarioLevel: string;
  scenarioId?: string;
}

interface Recipient {
  name: string;
  email: string;
  role: string;
}

const defaultRecipients: Recipient[] = [
  { name: 'Director del Plan', email: 'director.plan@miteco.es', role: 'director' },
  { name: 'Protección Civil Provincial', email: 'proteccion.civil@junta.es', role: 'authority' },
  { name: 'Subdelegación del Gobierno', email: 'subdelega@correo.gob.es', role: 'authority' },
  { name: 'Alcalde/sa', email: 'alcalde@ayuntamiento.es', role: 'local_authority' },
  { name: 'Guardia Civil', email: 'guardia.civil@interior.es', role: 'security' },
  { name: 'Personal de Guardia', email: 'guardia@operacion.es', role: 'operator' }
];

export default function EmergencyNotificationModal({
  isOpen,
  onClose,
  damId,
  scenarioLevel,
  scenarioId
}: EmergencyNotificationModalProps) {
  const [communicationType, setCommunicationType] = useState<'email' | 'sms'>('email');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [selectedRecipients, setSelectedRecipients] = useState<string[]>(
    defaultRecipients.map(r => r.email)
  );
  const [isSending, setIsSending] = useState(false);
  const [sendStatus, setSendStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleToggleRecipient = (email: string) => {
    setSelectedRecipients(prev =>
      prev.includes(email)
        ? prev.filter(e => e !== email)
        : [...prev, email]
    );
  };

  const handleSend = async () => {
    if (!subject.trim() || !message.trim() || selectedRecipients.length === 0) {
      alert('Por favor, complete todos los campos y seleccione al menos un destinatario');
      return;
    }

    setIsSending(true);
    setSendStatus('idle');

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

      const recipientsData = defaultRecipients
        .filter(r => selectedRecipients.includes(r.email))
        .map(r => ({
          name: r.name,
          email: r.email,
          role: r.role
        }));

      const { error: commError } = await supabase
        .from('emergency_communications')
        .insert({
          scenario_id: activeScenarioId,
          communication_type: communicationType,
          subject,
          body: message,
          recipients: recipientsData,
          delivery_status: 'sent',
          created_by: user?.id
        });

      if (commError) throw commError;

      setSendStatus('success');
      setTimeout(() => {
        onClose();
        setSubject('');
        setMessage('');
        setSendStatus('idle');
      }, 2000);
    } catch (error) {
      console.error('Error sending notification:', error);
      setSendStatus('error');
    } finally {
      setIsSending(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Mail className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-bold text-gray-900">Enviar Aviso de Emergencia</h2>
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
              <div>
                <p className="font-semibold text-orange-900">Aviso de {scenarioLevel.toUpperCase()}</p>
                <p className="text-sm text-orange-700 mt-1">
                  Este mensaje se enviará a las autoridades y personal designado según el protocolo del Plan de Emergencia
                </p>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de Comunicación
            </label>
            <div className="flex gap-4">
              <button
                onClick={() => setCommunicationType('email')}
                className={`flex-1 px-4 py-3 rounded-lg border-2 transition-colors ${
                  communicationType === 'email'
                    ? 'border-blue-500 bg-blue-50 text-blue-900'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                }`}
              >
                <Mail className="w-5 h-5 inline mr-2" />
                Email
              </button>
              <button
                onClick={() => setCommunicationType('sms')}
                className={`flex-1 px-4 py-3 rounded-lg border-2 transition-colors ${
                  communicationType === 'sms'
                    ? 'border-blue-500 bg-blue-50 text-blue-900'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                }`}
              >
                <Send className="w-5 h-5 inline mr-2" />
                SMS
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Destinatarios *
            </label>
            <div className="space-y-2 max-h-48 overflow-y-auto border border-gray-200 rounded-lg p-3">
              {defaultRecipients.map(recipient => (
                <label key={recipient.email} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedRecipients.includes(recipient.email)}
                    onChange={() => handleToggleRecipient(recipient.email)}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{recipient.name}</p>
                    <p className="text-sm text-gray-600">{recipient.email}</p>
                  </div>
                </label>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-2">
              {selectedRecipients.length} destinatario(s) seleccionado(s)
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Asunto *
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder={`ALERTA: Activación ${scenarioLevel.toUpperCase()}`}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mensaje *
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={8}
              placeholder="Escriba el mensaje de aviso..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
            <p className="text-xs text-gray-500 mt-2">
              {message.length} caracteres
            </p>
          </div>

          {sendStatus === 'success' && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <p className="text-green-800 font-medium">Aviso enviado correctamente</p>
            </div>
          )}

          {sendStatus === 'error' && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <p className="text-red-800 font-medium">Error al enviar el aviso. Inténtelo de nuevo.</p>
            </div>
          )}
        </div>

        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex gap-3 justify-end">
          <button
            onClick={onClose}
            disabled={isSending}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            onClick={handleSend}
            disabled={isSending || !subject.trim() || !message.trim() || selectedRecipients.length === 0}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isSending ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Enviando...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Enviar Aviso
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}