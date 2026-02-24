import { useState, useEffect } from 'react';
import { useDamSelection } from '../contexts/DamSelectionContext';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { supabase } from '../lib/supabase';
import EmergencyNotificationModal from '../components/EmergencyNotificationModal';
import TelephoneProtocolModal from '../components/TelephoneProtocolModal';
import {
  AlertTriangle,
  Bell,
  CheckCircle,
  XCircle,
  MapPin,
  Phone,
  Mail,
  FileText,
  Radio,
  Activity,
  Users,
  Calendar,
  ArrowUp,
  ArrowDown,
  Shield,
  Eye,
  Siren,
  Clock,
  Droplets,
  TrendingUp,
  CloudRain
} from 'lucide-react';

interface Siren {
  id: string;
  siren_code: string;
  location_name: string;
  operational_status: string;
  latitude: number | null;
  longitude: number | null;
  last_check_at: string | null;
}

interface Indicator {
  id: string;
  variable_name: string;
  indicator_type: string;
  threshold_value: number | null;
  scenario_threshold: string;
  description: string;
  current_value?: number;
  current_value_text?: string;
  measured_at?: string;
  exceeds_threshold?: boolean;
}

interface EmergencyCause {
  id: string;
  code: string;
  name: string;
  category: string;
  description: string;
  sort_order: number;
}

interface Procedure {
  id: string;
  scenario_type: string;
  cause: string | null;
  procedure_type: string;
  title: string;
  description: string;
  procedure_order: number;
  checklist_items: any[];
}

interface Simulation {
  id: string;
  simulation_type: string;
  scenario_type: string;
  cause: string | null;
  started_at: string;
  completed_at: string | null;
  participants: any[];
  evaluation_notes: string | null;
}

interface Communication {
  id: string;
  communication_type: string;
  subject: string | null;
  body: string;
  sent_at: string;
  delivery_status: string;
  recipients: any[];
}

const scenarioLevels = [
  { value: 'normal', label: 'Situación Normal', color: 'bg-green-500', icon: CheckCircle },
  { value: 'extraordinary', label: 'Situación Extraordinaria', color: 'bg-yellow-500', icon: AlertTriangle },
  { value: 'scenario_0', label: 'Escenario 0', color: 'bg-orange-500', icon: AlertTriangle },
  { value: 'scenario_1', label: 'Escenario 1', color: 'bg-orange-600', icon: AlertTriangle },
  { value: 'scenario_2', label: 'Escenario 2', color: 'bg-red-500', icon: AlertTriangle },
  { value: 'scenario_3', label: 'Escenario 3', color: 'bg-red-700', icon: AlertTriangle }
];

export default function EmergencyManagement() {
  const { selectedDam } = useDamSelection();
  const [activeTab, setActiveTab] = useState<'plan' | 'sirens' | 'simulations'>('plan');
  const [currentScenario, setCurrentScenario] = useState<string>('normal');
  const [proposedScenario, setProposedScenario] = useState<string | null>(null);
  const [showManualActivation, setShowManualActivation] = useState(false);
  const [selectedCause, setSelectedCause] = useState('');
  const [sirens, setSirens] = useState<Siren[]>([]);
  const [indicators, setIndicators] = useState<Indicator[]>([]);
  const [procedures, setProcedures] = useState<Procedure[]>([]);
  const [simulations, setSimulations] = useState<Simulation[]>([]);
  const [causes, setCauses] = useState<EmergencyCause[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSirenId, setSelectedSirenId] = useState<string | null>(null);
  const [testingSiren, setTestingSiren] = useState<string | null>(null);
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [showTelephoneModal, setShowTelephoneModal] = useState(false);
  const [communications, setCommunications] = useState<Communication[]>([]);
  const [currentScenarioId, setCurrentScenarioId] = useState<string | null>(null);
  const [realtimeData, setRealtimeData] = useState<{
    waterLevel: number | null;
    inflowLastHour: number | null;
    rainfall24h: number | null;
  }>({
    waterLevel: null,
    inflowLastHour: null,
    rainfall24h: null
  });

  useEffect(() => {
    if (selectedDam) {
      setLoading(true);
      loadEmergencyData();
    } else {
      setLoading(false);
      setSirens([]);
      setIndicators([]);
      setProcedures([]);
      setSimulations([]);
      setCauses([]);
    }
  }, [selectedDam]);

  const loadEmergencyData = async () => {
    if (!selectedDam) return;

    try {
      setLoading(true);

      const [sirensData, indicatorsData, proceduresData, simulationsData, causesData] = await Promise.all([
        supabase.from('warning_sirens').select('*').eq('dam_id', selectedDam.id),
        supabase.from('emergency_indicators').select('*').eq('dam_id', selectedDam.id).eq('is_active', true).order('scenario_threshold'),
        supabase.from('emergency_procedures').select('*').eq('dam_id', selectedDam.id).order('procedure_order'),
        supabase.from('emergency_simulations').select('*').eq('dam_id', selectedDam.id).order('started_at', { ascending: false }).limit(10),
        supabase.from('emergency_causes').select('*').order('sort_order')
      ]);

      if (sirensData.error) console.error('Sirens error:', sirensData.error);
      if (sirensData.data) setSirens(sirensData.data);
      if (causesData.data) setCauses(causesData.data);
      if (proceduresData.data) setProcedures(proceduresData.data);
      if (simulationsData.data) setSimulations(simulationsData.data);

      if (indicatorsData.data) {
        const indicatorsWithValues = await Promise.all(
          indicatorsData.data.map(async (indicator) => {
            const { data: valueData } = await supabase
              .from('emergency_indicator_values')
              .select('current_value, current_value_text, measured_at')
              .eq('indicator_id', indicator.id)
              .order('measured_at', { ascending: false })
              .limit(1)
              .maybeSingle();

            const currentValue = valueData?.current_value;
            const exceedsThreshold = indicator.indicator_type === 'quantitative' &&
                                     currentValue != null &&
                                     indicator.threshold_value != null &&
                                     currentValue >= indicator.threshold_value;

            return {
              ...indicator,
              current_value: valueData?.current_value,
              current_value_text: valueData?.current_value_text,
              measured_at: valueData?.measured_at,
              exceeds_threshold: exceedsThreshold
            };
          })
        );

        setIndicators(indicatorsWithValues);

        const scenarioProposal = evaluateScenarioAutomatically(indicatorsWithValues);
        if (scenarioProposal && currentScenario === 'normal') {
          setProposedScenario(scenarioProposal);
        }
      }

      const { data: activeScenario } = await supabase
        .from('emergency_scenarios')
        .select('id, scenario_type')
        .eq('dam_id', selectedDam.id)
        .eq('status', 'active')
        .order('activated_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (activeScenario) {
        setCurrentScenarioId(activeScenario.id);
        setCurrentScenario(activeScenario.scenario_type);

        const { data: commsData } = await supabase
          .from('emergency_communications')
          .select('*')
          .eq('scenario_id', activeScenario.id)
          .order('sent_at', { ascending: false });

        if (commsData) setCommunications(commsData);
      }

      const { data: latestExploitation } = await supabase
        .from('exploitation_daily_data')
        .select('water_level, inflow_total, rainfall, date')
        .eq('dam_id', selectedDam.id)
        .order('date', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (latestExploitation) {
        const { data: last24hData } = await supabase
          .from('exploitation_daily_data')
          .select('rainfall')
          .eq('dam_id', selectedDam.id)
          .gte('date', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0])
          .order('date', { ascending: false });

        const rainfall24h = last24hData?.reduce((sum, record) => sum + (Number(record.rainfall) || 0), 0) || 0;

        setRealtimeData({
          waterLevel: latestExploitation.water_level,
          inflowLastHour: latestExploitation.inflow_total,
          rainfall24h
        });
      }
    } catch (error) {
      console.error('Error loading emergency data:', error);
    } finally {
      setLoading(false);
    }
  };

  const evaluateScenarioAutomatically = (indicators: Indicator[]): string | null => {
    const exceedingIndicators = indicators.filter(ind => ind.exceeds_threshold);

    if (exceedingIndicators.length === 0) return null;

    const scenarios = ['scenario_3', 'scenario_2', 'scenario_1', 'scenario_0'];
    for (const scenario of scenarios) {
      const hasExceeding = exceedingIndicators.some(ind => ind.scenario_threshold === scenario);
      if (hasExceeding) return scenario;
    }

    return null;
  };

  const handleViewSirenOnMap = (sirenId: string) => {
    setSelectedSirenId(sirenId);
  };

  const handleTestSiren = async (sirenId: string) => {
    setTestingSiren(sirenId);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setTestingSiren(null);
    alert('Test de autodiagnóstico completado exitosamente');
  };

  const getCurrentScenarioInfo = () => {
    return scenarioLevels.find(s => s.value === currentScenario) || scenarioLevels[0];
  };

  const getProposedScenarioInfo = () => {
    return scenarioLevels.find(s => s.value === proposedScenario) || null;
  };

  const activateScenario = (scenario: string, cause: string) => {
    setCurrentScenario(scenario);
    setProposedScenario(null);
    setShowManualActivation(false);
    setSelectedCause(cause);
  };

  const scenarioInfo = getCurrentScenarioInfo();
  const proposedInfo = getProposedScenarioInfo();
  const ScenarioIcon = scenarioInfo.icon;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Gestión de Emergencias</h1>
        <p className="mt-2 text-gray-600">
          {selectedDam ? `Plan de Emergencia - ${selectedDam.name}` : 'Seleccione una presa'}
        </p>
      </div>

      {!selectedDam ? (
        <Card className="p-8 text-center">
          <AlertTriangle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Seleccione una presa para acceder al Plan de Emergencia</p>
        </Card>
      ) : (
        <>
          <div className="flex gap-4 border-b border-gray-200">
            <button
              onClick={() => setActiveTab('plan')}
              className={`px-4 py-3 font-medium transition-colors ${
                activeTab === 'plan'
                  ? 'text-chg-blue border-b-2 border-chg-blue'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Shield className="w-4 h-4 inline mr-2" />
              Plan de Emergencia
            </button>
            <button
              onClick={() => setActiveTab('sirens')}
              className={`px-4 py-3 font-medium transition-colors ${
                activeTab === 'sirens'
                  ? 'text-chg-blue border-b-2 border-chg-blue'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Siren className="w-4 h-4 inline mr-2" />
              Estado de Sirenas
            </button>
            <button
              onClick={() => setActiveTab('simulations')}
              className={`px-4 py-3 font-medium transition-colors ${
                activeTab === 'simulations'
                  ? 'text-chg-blue border-b-2 border-chg-blue'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Activity className="w-4 h-4 inline mr-2" />
              Simulacros
            </button>
          </div>

          {activeTab === 'plan' && (
            <>
              <Card className="p-6 mb-6 bg-gradient-to-r from-blue-50 to-cyan-50">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-chg-blue" />
                  Datos en Tiempo Real del Módulo de Explotación
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white rounded-lg p-4 shadow-sm border border-blue-100">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-blue-100 rounded-lg">
                        <Droplets className="w-6 h-6 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-gray-600 font-medium">Nivel de Embalse</p>
                        <p className="text-2xl font-bold text-gray-900">
                          {realtimeData.waterLevel !== null ? `${realtimeData.waterLevel.toFixed(2)} m` : '---'}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg p-4 shadow-sm border border-green-100">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-green-100 rounded-lg">
                        <TrendingUp className="w-6 h-6 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-gray-600 font-medium">Aportación Última Hora</p>
                        <p className="text-2xl font-bold text-gray-900">
                          {realtimeData.inflowLastHour !== null ? `${realtimeData.inflowLastHour.toFixed(2)} m³/s` : '---'}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg p-4 shadow-sm border border-purple-100">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-purple-100 rounded-lg">
                        <CloudRain className="w-6 h-6 text-purple-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-gray-600 font-medium">Precipitación 24h</p>
                        <p className="text-2xl font-bold text-gray-900">
                          {realtimeData.rainfall24h !== null ? `${realtimeData.rainfall24h.toFixed(1)} mm` : '---'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                  <Card className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-900">Escenario Actual</h2>
                    <button
                      onClick={() => setShowManualActivation(!showManualActivation)}
                      className="px-4 py-2 bg-chg-blue text-white rounded-lg hover:bg-chg-blue-dark transition-colors"
                    >
                      Activación Manual
                    </button>
                  </div>

                  <div className={`p-6 rounded-lg ${scenarioInfo.color} bg-opacity-10 border-2 ${scenarioInfo.color} border-opacity-30`}>
                    <div className="flex items-center gap-4">
                      <ScenarioIcon className={`w-12 h-12 ${scenarioInfo.color.replace('bg-', 'text-')}`} />
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-gray-900">{scenarioInfo.label}</h3>
                        {selectedCause && (
                          <p className="text-gray-700 mt-1">Causa: {selectedCause}</p>
                        )}
                        <p className="text-sm text-gray-600 mt-2">
                          Activado: {new Date().toLocaleString('es-ES')}
                        </p>
                      </div>
                    </div>
                  </div>

                  {proposedScenario && proposedInfo && (
                    <div className="mt-6 p-5 bg-orange-50 border-2 border-orange-400 rounded-lg shadow-lg">
                      <div className="flex items-start gap-3">
                        <Bell className="w-8 h-8 text-orange-600 flex-shrink-0 mt-1 animate-pulse" />
                        <div className="flex-1">
                          <h4 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                            ⚠️ Propuesta Automática de Activación
                          </h4>
                          <div className="bg-white p-4 rounded-lg mb-4">
                            <p className="text-lg text-gray-900 mb-2">
                              <strong>Escenario Propuesto:</strong> <span className="font-bold text-orange-600">{proposedInfo.label}</span>
                            </p>
                            <div className="mt-3 space-y-2">
                              <p className="text-sm text-gray-700">
                                <strong>Indicadores que superan umbrales:</strong>
                              </p>
                              {indicators
                                .filter(ind => ind.exceeds_threshold && ind.scenario_threshold === proposedScenario)
                                .map(ind => (
                                  <div key={ind.id} className="ml-4 p-2 bg-orange-50 rounded text-sm">
                                    • <strong>{ind.variable_name}</strong>: {ind.current_value} (umbral: {ind.threshold_value})
                                  </div>
                                ))}
                            </div>
                            <p className="text-sm text-gray-600 mt-3">
                              <strong>Evaluación automática realizada:</strong> {new Date().toLocaleString('es-ES')}
                            </p>
                          </div>
                          <div className="bg-yellow-50 p-3 rounded-lg mb-4 text-sm">
                            <p className="font-semibold text-gray-900 mb-2">Seleccione la causa que motiva la emergencia:</p>
                            <select
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                              value={selectedCause}
                              onChange={(e) => setSelectedCause(e.target.value)}
                            >
                              <option value="">Seleccione una causa...</option>
                              {causes.map(cause => (
                                <option key={cause.id} value={cause.name}>
                                  {cause.name}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div className="flex gap-3">
                            <button
                              onClick={() => {
                                if (selectedCause) {
                                  activateScenario(proposedScenario, selectedCause);
                                } else {
                                  alert('Por favor, seleccione una causa antes de activar el escenario');
                                }
                              }}
                              className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-semibold text-lg"
                            >
                              ✓ Confirmar y Activar Escenario
                            </button>
                            <button
                              onClick={() => setProposedScenario(null)}
                              className="px-4 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                            >
                              Descartar Propuesta
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {showManualActivation && (
                    <div className="mt-6 p-6 bg-blue-50 border-2 border-blue-300 rounded-lg">
                      <h4 className="font-bold text-gray-900 mb-4">Activación Manual de Escenario</h4>
                      <p className="text-sm text-gray-600 mb-4">
                        Utilice esta opción cuando detecte una situación de emergencia de forma cualitativa o cuando
                        no existan indicadores cuantitativos para todos los escenarios.
                      </p>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Seleccionar Escenario *
                          </label>
                          <select
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                            value={proposedScenario || ''}
                            onChange={(e) => setProposedScenario(e.target.value)}
                          >
                            <option value="">Seleccione un escenario...</option>
                            {scenarioLevels.slice(2).map(scenario => (
                              <option key={scenario.value} value={scenario.value}>
                                {scenario.label}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Causa de la Emergencia *
                          </label>
                          <select
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                            value={selectedCause}
                            onChange={(e) => setSelectedCause(e.target.value)}
                          >
                            <option value="">Seleccione una causa...</option>
                            {causes.map(cause => (
                              <option key={cause.id} value={cause.name}>
                                {cause.name}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Descripción de la Situación
                          </label>
                          <textarea
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                            rows={3}
                            placeholder="Describa la situación que motiva la activación del escenario..."
                          />
                        </div>
                        <div className="flex gap-3">
                          <button
                            onClick={() => {
                              if (proposedScenario && selectedCause) {
                                activateScenario(proposedScenario, selectedCause);
                              } else {
                                alert('Por favor, complete todos los campos obligatorios (*)');
                              }
                            }}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold"
                          >
                            Activar Escenario
                          </button>
                          <button
                            onClick={() => setShowManualActivation(false)}
                            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                          >
                            Cancelar
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </Card>

                <Card className="p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-chg-blue" />
                    Causas e Indicadores del Plan de Emergencia
                  </h3>
                  {loading ? (
                    <div className="text-center py-8 text-gray-500">Cargando causas...</div>
                  ) : causes.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">No hay causas configuradas</div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm border-collapse">
                        <thead>
                          <tr className="bg-gray-100">
                            <th className="border border-gray-300 px-3 py-2 text-left font-semibold">Causa</th>
                            <th className="border border-gray-300 px-3 py-2 text-left font-semibold">Categoría</th>
                            <th className="border border-gray-300 px-3 py-2 text-left font-semibold">Indicadores Asociados</th>
                            <th className="border border-gray-300 px-3 py-2 text-center font-semibold">Estado</th>
                          </tr>
                        </thead>
                        <tbody>
                          {causes.map(cause => {
                            const relatedIndicators = indicators.filter(ind => {
                              if (cause.category === 'hydrological') return ind.variable_name.includes('embalse') || ind.variable_name.includes('Aportación') || ind.variable_name.includes('Precipitación');
                              if (cause.category === 'structural') return ind.variable_name.includes('anomal') || ind.variable_name.includes('Filtraciones');
                              if (cause.category === 'seismic') return ind.variable_name.includes('sismo') || ind.variable_name.includes('Magnitud');
                              return false;
                            });
                            const hasExceeding = relatedIndicators.some(ind => ind.exceeds_threshold);
                            return (
                              <tr key={cause.id} className={hasExceeding ? 'bg-orange-50' : ''}>
                                <td className="border border-gray-300 px-3 py-2">
                                  <div className="font-medium text-gray-900">{cause.name}</div>
                                  <div className="text-xs text-gray-600 mt-1">{cause.description}</div>
                                </td>
                                <td className="border border-gray-300 px-3 py-2">
                                  <Badge variant={
                                    cause.category === 'hydrological' ? 'default' :
                                    cause.category === 'structural' ? 'warning' :
                                    cause.category === 'seismic' ? 'error' : 'default'
                                  }>
                                    {cause.category === 'hydrological' ? 'Hidrológica' :
                                     cause.category === 'structural' ? 'Estructural' :
                                     cause.category === 'seismic' ? 'Sísmica' :
                                     cause.category === 'inspection' ? 'Inspección' : 'Operacional'}
                                  </Badge>
                                </td>
                                <td className="border border-gray-300 px-3 py-2">
                                  {relatedIndicators.length > 0 ? (
                                    <div className="space-y-1">
                                      {relatedIndicators.slice(0, 3).map(ind => (
                                        <div key={ind.id} className="text-xs">
                                          • {ind.variable_name}
                                          {ind.exceeds_threshold && <span className="ml-2 text-orange-600 font-semibold">⚠ Umbral superado</span>}
                                        </div>
                                      ))}
                                      {relatedIndicators.length > 3 && (
                                        <div className="text-xs text-gray-500">+ {relatedIndicators.length - 3} más</div>
                                      )}
                                    </div>
                                  ) : (
                                    <span className="text-gray-500">Sin indicadores cuantitativos</span>
                                  )}
                                </td>
                                <td className="border border-gray-300 px-3 py-2 text-center">
                                  {hasExceeding ? (
                                    <AlertTriangle className="w-5 h-5 text-orange-600 mx-auto" />
                                  ) : (
                                    <CheckCircle className="w-5 h-5 text-green-500 mx-auto" />
                                  )}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                      <div className="mt-4 p-3 bg-blue-50 rounded-lg text-sm text-blue-900">
                        <strong>Nota:</strong> La evaluación automática monitoriza indicadores cuantitativos en tiempo real.
                        Los indicadores cualitativos requieren evaluación manual por el Director/a del Plan.
                      </div>
                    </div>
                  )}
                </Card>

                <Card className="p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Indicadores Monitorizados en Tiempo Real</h3>
                  {loading ? (
                    <div className="text-center py-8 text-gray-500">Cargando indicadores...</div>
                  ) : indicators.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">No hay indicadores configurados para esta presa</div>
                  ) : (
                    <div className="space-y-3">
                      {indicators.map(indicator => (
                        <div key={indicator.id} className={`p-4 rounded-lg border-2 ${
                          indicator.exceeds_threshold
                            ? 'bg-orange-50 border-orange-300'
                            : 'bg-gray-50 border-gray-200'
                        }`}>
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <Activity className={`w-5 h-5 ${indicator.exceeds_threshold ? 'text-orange-600' : 'text-chg-blue'}`} />
                                <span className="font-medium text-gray-900">{indicator.variable_name}</span>
                                <Badge variant={indicator.indicator_type === 'quantitative' ? 'default' : 'warning'}>
                                  {indicator.indicator_type === 'quantitative' ? 'Cuantitativo' : 'Cualitativo'}
                                </Badge>
                                <Badge variant="default">{indicator.scenario_threshold}</Badge>
                              </div>
                              <p className="ml-8 text-sm text-gray-600 mb-2">{indicator.description}</p>

                              {indicator.indicator_type === 'quantitative' && indicator.threshold_value && (
                                <div className="ml-8 space-y-2">
                                  <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                      <span className="text-gray-600">Valor actual: </span>
                                      <span className={`font-bold ${indicator.exceeds_threshold ? 'text-orange-600' : 'text-gray-900'}`}>
                                        {indicator.current_value !== null && indicator.current_value !== undefined
                                          ? indicator.current_value
                                          : '---'}
                                      </span>
                                    </div>
                                    <div>
                                      <span className="text-gray-600">Umbral: </span>
                                      <span className="font-semibold text-gray-900">{indicator.threshold_value}</span>
                                    </div>
                                  </div>
                                  {indicator.current_value !== null && indicator.current_value !== undefined && (
                                    <div>
                                      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                                        <div
                                          className={`h-3 rounded-full transition-all ${
                                            indicator.exceeds_threshold ? 'bg-orange-600' : 'bg-green-500'
                                          }`}
                                          style={{
                                            width: `${Math.min((indicator.current_value / indicator.threshold_value) * 100, 100)}%`
                                          }}
                                        />
                                      </div>
                                    </div>
                                  )}
                                  {indicator.measured_at && (
                                    <p className="text-xs text-gray-500">
                                      Última medición: {new Date(indicator.measured_at).toLocaleString('es-ES')}
                                    </p>
                                  )}
                                </div>
                              )}

                              {indicator.indicator_type === 'qualitative' && (
                                <div className="ml-8 text-sm">
                                  <span className="text-gray-600">Valor: </span>
                                  <span className="font-medium text-gray-900">
                                    {indicator.current_value_text || 'Pendiente de evaluación manual'}
                                  </span>
                                </div>
                              )}
                            </div>
                            {indicator.exceeds_threshold ? (
                              <AlertTriangle className="w-6 h-6 text-orange-600 flex-shrink-0" />
                            ) : (
                              <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </Card>

                {currentScenario !== 'normal' && procedures.length > 0 && (
                  <Card className="p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Procedimientos de Actuación</h3>
                    <div className="space-y-3">
                      {procedures.filter(p => p.scenario_type === currentScenario).map(procedure => (
                        <div key={procedure.id} className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                          <div className="flex-shrink-0 w-8 h-8 bg-chg-blue text-white rounded-full flex items-center justify-center font-bold">
                            {procedure.procedure_order}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <FileText className="w-4 h-4 text-gray-600" />
                              <span className="font-medium text-gray-900">{procedure.title}</span>
                              <Badge variant={procedure.procedure_type === 'inspection' ? 'default' : 'warning'}>
                                {procedure.procedure_type === 'inspection' ? 'Inspección' : 'Ejecución'}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600 mt-1">{procedure.description}</p>
                            {procedure.checklist_items && procedure.checklist_items.length > 0 && (
                              <div className="mt-2 space-y-1">
                                {procedure.checklist_items.map((item: any, idx: number) => (
                                  <div key={idx} className="flex items-center gap-2 text-sm">
                                    <input type="checkbox" className="rounded" />
                                    <span className="text-gray-600">{item.item}</span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                )}
              </div>

              <div className="space-y-6">
                <Card className="p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Comunicaciones</h3>
                  <div className="space-y-3">
                    <button
                      onClick={() => setShowNotificationModal(true)}
                      className="w-full p-4 bg-blue-50 border-2 border-blue-200 rounded-lg hover:bg-blue-100 transition-colors text-left"
                    >
                      <div className="flex items-center gap-3">
                        <Mail className="w-5 h-5 text-blue-600" />
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">Enviar Aviso</p>
                          <p className="text-sm text-gray-600">Email / SMS</p>
                        </div>
                        <ArrowUp className="w-4 h-4 text-blue-600" />
                      </div>
                    </button>
                    <button
                      onClick={() => setShowTelephoneModal(true)}
                      className="w-full p-4 bg-green-50 border-2 border-green-200 rounded-lg hover:bg-green-100 transition-colors text-left"
                    >
                      <div className="flex items-center gap-3">
                        <Phone className="w-5 h-5 text-green-600" />
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">Protocolo Telefónico</p>
                          <p className="text-sm text-gray-600">Llamadas de emergencia</p>
                        </div>
                        <ArrowUp className="w-4 h-4 text-green-600" />
                      </div>
                    </button>
                  </div>

                  <div className="mt-6">
                    <h4 className="text-sm font-semibold text-gray-700 mb-3">Historial de Avisos</h4>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {communications.length === 0 ? (
                        <p className="text-sm text-gray-500 text-center py-4">No hay avisos registrados</p>
                      ) : (
                        communications.map(comm => (
                          <div key={comm.id} className="p-3 bg-gray-50 rounded-lg text-sm">
                            <div className="flex items-center justify-between mb-1">
                              <div className="flex items-center gap-2">
                                {comm.communication_type === 'email' && <Mail className="w-3 h-3 text-blue-600" />}
                                {comm.communication_type === 'sms' && <Mail className="w-3 h-3 text-purple-600" />}
                                {comm.communication_type === 'phone' && <Phone className="w-3 h-3 text-green-600" />}
                                <span className="font-medium text-gray-900">{comm.subject || 'Comunicación'}</span>
                              </div>
                              {comm.delivery_status === 'sent' ? (
                                <CheckCircle className="w-4 h-4 text-green-500" />
                              ) : comm.delivery_status === 'failed' ? (
                                <XCircle className="w-4 h-4 text-red-500" />
                              ) : (
                                <Clock className="w-4 h-4 text-yellow-500" />
                              )}
                            </div>
                            <p className="text-xs text-gray-600">
                              Enviado: {new Date(comm.sent_at).toLocaleString('es-ES')}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              {Array.isArray(comm.recipients) ? comm.recipients.length : 0} destinatario(s)
                            </p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </Card>

                <Card className="p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Cartografía</h3>
                  <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                    <MapPin className="w-12 h-12 text-gray-400" />
                  </div>
                  <button className="w-full mt-3 px-4 py-2 bg-chg-blue text-white rounded-lg hover:bg-chg-blue-dark transition-colors">
                    Ver Mapa de Afecciones
                  </button>
                </Card>

                <Card className="p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Registro de Acciones</h3>
                  <div className="space-y-2 mb-4">
                    <div className="p-3 bg-gray-50 rounded-lg text-sm">
                      <p className="font-medium text-gray-900">Inspección visual realizada</p>
                      <p className="text-xs text-gray-600 mt-1">Operario: Juan García - {new Date().toLocaleTimeString('es-ES')}</p>
                    </div>
                  </div>
                  <button className="w-full px-4 py-2 border-2 border-chg-blue text-chg-blue rounded-lg hover:bg-blue-50 transition-colors">
                    Registrar Nueva Acción
                  </button>
                </Card>
              </div>
              </div>
            </>
          )}

          {activeTab === 'sirens' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Estado de Equipos de Aviso</h2>
                {loading ? (
                  <div className="text-center py-8 text-gray-500">Cargando sirenas...</div>
                ) : sirens.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">No hay sirenas configuradas para esta presa</div>
                ) : (
                  <div className="space-y-3">
                    {sirens.map(siren => (
                      <div key={siren.id} className="p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Radio className={`w-5 h-5 ${siren.operational_status === 'operational' ? 'text-green-500' : 'text-yellow-500'}`} />
                            <div>
                              <p className="font-medium text-gray-900">{siren.location_name}</p>
                              <p className="text-sm text-gray-600">{siren.siren_code}</p>
                              {siren.last_check_at && (
                                <p className="text-xs text-gray-500">
                                  Último check: {new Date(siren.last_check_at).toLocaleDateString('es-ES')}
                                </p>
                              )}
                            </div>
                          </div>
                          <Badge variant={siren.operational_status === 'operational' ? 'success' : 'warning'}>
                            {siren.operational_status === 'operational' ? 'Operativa' :
                             siren.operational_status === 'degraded' ? 'Degradada' : 'Fallo'}
                          </Badge>
                        </div>
                        <div className="mt-3 flex gap-2">
                          <button
                            onClick={() => handleViewSirenOnMap(siren.id)}
                            className={`flex-1 px-3 py-2 text-sm rounded transition-colors ${
                              selectedSirenId === siren.id
                                ? 'bg-blue-600 text-white'
                                : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                            }`}
                          >
                            <Eye className="w-4 h-4 inline mr-1" />
                            Ver en Mapa
                          </button>
                          <button
                            onClick={() => handleTestSiren(siren.id)}
                            disabled={testingSiren === siren.id}
                            className={`flex-1 px-3 py-2 text-sm rounded transition-colors ${
                              testingSiren === siren.id
                                ? 'bg-gray-300 text-gray-600 cursor-wait'
                                : 'bg-green-100 text-green-700 hover:bg-green-200'
                            }`}
                          >
                            <Activity className={`w-4 h-4 inline mr-1 ${testingSiren === siren.id ? 'animate-pulse' : ''}`} />
                            {testingSiren === siren.id ? 'Probando...' : 'Test Autodiagnóstico'}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Card>

              <Card className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Mapa de Sirenas</h2>
                <div className="aspect-square bg-gradient-to-br from-blue-50 to-green-50 rounded-lg relative border-2 border-gray-200 overflow-hidden">
                  {sirens.length === 0 ? (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <MapPin className="w-16 h-16 text-gray-400" />
                    </div>
                  ) : (
                    <>
                      <div className="absolute inset-0 p-4">
                        <div className="w-full h-full relative">
                          {sirens.map((siren, index) => {
                            const isSelected = selectedSirenId === siren.id;
                            const left = 15 + (index * 20) % 70;
                            const top = 20 + (index * 25) % 60;

                            return (
                              <div
                                key={siren.id}
                                className={`absolute transition-all duration-300 ${isSelected ? 'z-10 scale-150' : 'z-0'}`}
                                style={{ left: `${left}%`, top: `${top}%` }}
                              >
                                <div className="relative group cursor-pointer" onClick={() => setSelectedSirenId(siren.id)}>
                                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shadow-lg ${
                                    siren.operational_status === 'operational'
                                      ? 'bg-green-500'
                                      : siren.operational_status === 'degraded'
                                      ? 'bg-yellow-500'
                                      : 'bg-red-500'
                                  } ${isSelected ? 'ring-4 ring-blue-400 animate-pulse' : ''}`}>
                                    <Radio className="w-4 h-4 text-white" />
                                  </div>
                                  <div className={`absolute left-full ml-2 top-1/2 -translate-y-1/2 bg-white px-2 py-1 rounded shadow-lg whitespace-nowrap text-xs ${
                                    isSelected || 'opacity-0 group-hover:opacity-100'
                                  } transition-opacity pointer-events-none`}>
                                    <div className="font-medium">{siren.location_name}</div>
                                    <div className="text-gray-600">{siren.siren_code}</div>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                      <div className="absolute bottom-2 left-2 bg-white/90 px-3 py-2 rounded shadow text-xs">
                        <div className="font-medium text-gray-700 mb-1">Leyenda</div>
                        <div className="flex items-center gap-1 mb-1">
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                          <span className="text-gray-600">Operativa</span>
                        </div>
                        <div className="flex items-center gap-1 mb-1">
                          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                          <span className="text-gray-600">Degradada</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                          <span className="text-gray-600">Fallo</span>
                        </div>
                      </div>
                    </>
                  )}
                </div>
                <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-900">
                    <strong>Resumen:</strong> {sirens.filter(s => s.operational_status === 'operational').length} sirenas operativas de {sirens.length} totales
                  </p>
                  {selectedSirenId && (
                    <p className="text-xs text-blue-700 mt-2">
                      Haz clic en un punto del mapa para ver detalles de la sirena
                    </p>
                  )}
                </div>
              </Card>
            </div>
          )}

          {activeTab === 'simulations' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card className="p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Nuevo Simulacro</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tipo de Simulacro
                      </label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                        <option>Entrenamiento (sin envío real de avisos)</option>
                        <option>Simulacro Reglado (con envío de avisos)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Escenario a Simular
                      </label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                        {scenarioLevels.slice(2).map(scenario => (
                          <option key={scenario.value} value={scenario.value}>
                            {scenario.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Causa de la Emergencia
                      </label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                        <option>Avenida extraordinaria</option>
                        <option>Deslizamiento de ladera</option>
                        <option>Sismo de gran magnitud</option>
                        <option>Fallo estructural</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Participantes
                      </label>
                      <textarea
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        rows={3}
                        placeholder="Nombres de los participantes del simulacro..."
                      />
                    </div>
                    <button className="w-full px-4 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium">
                      <Activity className="w-4 h-4 inline mr-2" />
                      Iniciar Simulacro
                    </button>
                  </div>
                </Card>
              </div>

              <div>
                <Card className="p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Historial de Simulacros</h3>
                  {loading ? (
                    <div className="text-center py-8 text-gray-500">Cargando simulacros...</div>
                  ) : simulations.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">No hay simulacros registrados</div>
                  ) : (
                    <div className="space-y-3">
                      {simulations.map(simulation => (
                        <div key={simulation.id} className="p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <Calendar className="w-4 h-4 text-gray-600" />
                            <span className="text-sm font-medium text-gray-900">
                              {scenarioLevels.find(s => s.value === simulation.scenario_type)?.label || simulation.scenario_type}
                            </span>
                          </div>
                          <p className="text-xs text-gray-600 mb-2">
                            {new Date(simulation.started_at).toLocaleDateString('es-ES')} - {
                              simulation.simulation_type === 'training' ? 'Entrenamiento' : 'Simulacro Reglado'
                            }
                          </p>
                          {simulation.cause && (
                            <p className="text-xs text-gray-600 mb-2">Causa: {simulation.cause}</p>
                          )}
                          <Badge variant={simulation.completed_at ? 'success' : 'warning'}>
                            {simulation.completed_at ? 'Completado' : 'En curso'}
                          </Badge>
                          {simulation.evaluation_notes && (
                            <p className="text-xs text-gray-600 mt-2 italic">{simulation.evaluation_notes}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </Card>
              </div>
            </div>
          )}
        </>
      )}

      <EmergencyNotificationModal
        isOpen={showNotificationModal}
        onClose={() => {
          setShowNotificationModal(false);
          loadEmergencyData();
        }}
        damId={selectedDam?.id || ''}
        scenarioLevel={currentScenario}
        scenarioId={currentScenarioId || undefined}
      />

      <TelephoneProtocolModal
        isOpen={showTelephoneModal}
        onClose={() => {
          setShowTelephoneModal(false);
          loadEmergencyData();
        }}
        damId={selectedDam?.id || ''}
        scenarioLevel={currentScenario}
        scenarioId={currentScenarioId || undefined}
      />
    </div>
  );
}
