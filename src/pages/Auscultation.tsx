import React, { useState } from 'react';
import {
  Activity, Bell, Settings, Shield, History, FileText,
  BarChart3, AlertTriangle, Database, ChevronRight, ClipboardCheck,
  TrendingUp, AlertOctagon
} from 'lucide-react';
import { ALERTS, VARIABLES } from './auscultation/mockData';
import type { Screen } from './auscultation/types';

import ScreenDashboard      from './auscultation/ScreenDashboard';
import ScreenVariables      from './auscultation/ScreenVariables';
import ScreenVariableDetail from './auscultation/ScreenVariableDetail';
import ScreenEvaluation     from './auscultation/ScreenEvaluation';
import ScreenAlerts         from './auscultation/ScreenAlerts';
import ScreenEmergencyComm  from './auscultation/ScreenEmergencyComm';
import ScreenValidation     from './auscultation/ScreenValidation';
import ScreenTrends         from './auscultation/ScreenTrends';
import ScreenDataQuality    from './auscultation/ScreenDataQuality';
import ScreenHistoric       from './auscultation/ScreenHistoric';
import ScreenAudit          from './auscultation/ScreenAudit';
import ScreenConfig         from './auscultation/ScreenConfig';

const NAV_ITEMS: { screen: Screen; label: string; icon: React.ReactNode; group: string }[] = [
  { screen: 'dashboard',      label: 'Panel principal',           icon: <BarChart3 size={16} />,      group: 'Principal' },
  { screen: 'variables',      label: 'Variables críticas',        icon: <Activity size={16} />,       group: 'Monitorización' },
  { screen: 'evaluation',     label: 'Evaluación de umbrales',    icon: <AlertTriangle size={16} />,  group: 'Monitorización' },
  { screen: 'trends',         label: 'Gráficos de tendencia',     icon: <TrendingUp size={16} />,     group: 'Monitorización' },
  { screen: 'alerts',         label: 'Avisos al Director/a',      icon: <Bell size={16} />,           group: 'Decisión' },
  { screen: 'validation',     label: 'Validación de seguridad',   icon: <ClipboardCheck size={16} />, group: 'Decisión' },
  { screen: 'emergency_comm', label: 'Comunicar Plan Emergencia', icon: <Shield size={16} />,         group: 'Decisión' },
  { screen: 'data_quality',   label: 'Calidad de datos',          icon: <Database size={16} />,       group: 'Calidad' },
  { screen: 'historic',       label: 'Histórico de eventos',      icon: <History size={16} />,        group: 'Trazabilidad' },
  { screen: 'audit',          label: 'Auditoría',                 icon: <FileText size={16} />,       group: 'Trazabilidad' },
  { screen: 'config',         label: 'Configuración umbrales',    icon: <Settings size={16} />,       group: 'Administración' },
];

const GROUPS = ['Principal', 'Monitorización', 'Decisión', 'Calidad', 'Trazabilidad', 'Administración'];

export default function Auscultation() {
  const [screen, setScreen]   = useState<Screen>('dashboard');
  const [varId, setVarId]     = useState<string | undefined>(undefined);

  const pendingAlerts = ALERTS.filter(a => a.alert_status === 'pending').length;
  const hasExtraordinary = VARIABLES.some(v => v.status === 'extraordinary' || v.status === 'scenario_0');

  const navigate = (s: Screen, id?: string) => {
    setScreen(s);
    if (id) setVarId(id);
  };

  const renderScreen = () => {
    switch (screen) {
      case 'dashboard':      return <ScreenDashboard onNavigate={navigate} />;
      case 'variables':      return <ScreenVariables onNavigate={navigate} />;
      case 'variable_detail':return <ScreenVariableDetail varId={varId ?? VARIABLES[0].id} onNavigate={navigate} />;
      case 'evaluation':     return <ScreenEvaluation varId={varId} onNavigate={navigate} />;
      case 'alerts':         return <ScreenAlerts onNavigate={navigate} />;
      case 'emergency_comm': return <ScreenEmergencyComm onNavigate={navigate} />;
      case 'validation':     return <ScreenValidation onNavigate={navigate} />;
      case 'trends':         return <ScreenTrends onNavigate={navigate} />;
      case 'data_quality':   return <ScreenDataQuality onNavigate={navigate} />;
      case 'historic':       return <ScreenHistoric onNavigate={navigate} />;
      case 'audit':          return <ScreenAudit onNavigate={navigate} />;
      case 'config':         return <ScreenConfig onNavigate={navigate} />;
      default:               return <ScreenDashboard onNavigate={navigate} />;
    }
  };

  return (
    <div className="flex h-full min-h-0 gap-0">
      {/* Sidebar */}
      <aside className="w-56 flex-shrink-0 bg-white border-r border-slate-200 flex flex-col overflow-y-auto">
        {/* Header */}
        <div className="px-4 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2 mb-1">
            <Activity size={16} className="text-blue-600" />
            <p className="text-sm font-bold text-slate-900">Auscultación</p>
          </div>
          <p className="text-xs text-slate-500">Presa de Guadalmena</p>
          {hasExtraordinary && (
            <div className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-2 py-1">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse flex-shrink-0" />
              S.E. activa
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-2 py-3 space-y-4">
          {GROUPS.map(group => {
            const items = NAV_ITEMS.filter(n => n.group === group);
            if (!items.length) return null;
            return (
              <div key={group}>
                <p className="px-2 py-1 text-xs font-bold uppercase tracking-wider text-slate-400">{group}</p>
                <div className="space-y-0.5">
                  {items.map(item => {
                    const isActive = screen === item.screen || (item.screen === 'variables' && screen === 'variable_detail');
                    const hasBadge = item.screen === 'alerts' && pendingAlerts > 0;
                    return (
                      <button
                        key={item.screen}
                        onClick={() => navigate(item.screen)}
                        className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all text-left ${
                          isActive
                            ? 'bg-blue-600 text-white font-semibold shadow-sm'
                            : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                        }`}
                      >
                        <span className={isActive ? 'text-white' : 'text-slate-400'}>{item.icon}</span>
                        <span className="flex-1 truncate text-xs">{item.label}</span>
                        {hasBadge && (
                          <span className={`text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${isActive ? 'bg-white text-blue-600' : 'bg-amber-500 text-white'}`}>
                            {pendingAlerts}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-slate-100">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>DAMDATA + SAIH conectados</span>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto bg-slate-50 p-6 min-w-0">
        {renderScreen()}
      </main>
    </div>
  );
}
