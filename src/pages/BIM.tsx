import React, { useState } from 'react';
import {
  Box, LayoutDashboard, Eye, AlertTriangle, Database,
  History, Shield, Activity, Zap
} from 'lucide-react';
import type { Screen } from './bim/types';

import ScreenDashboard    from './bim/ScreenDashboard';
import ScreenViewer       from './bim/ScreenViewer';
import ScreenAlerts       from './bim/ScreenAlerts';
import ScreenModels       from './bim/ScreenModels';
import ScreenIntegrations from './bim/ScreenIntegrations';
import ScreenSimulation   from './bim/ScreenSimulation';
import ScreenHistoric     from './bim/ScreenHistoric';
import ScreenAudit        from './bim/ScreenAudit';

const NAV_ITEMS: { screen: Screen; label: string; icon: React.ReactNode; group: string; badge?: number }[] = [
  { screen: 'dashboard',    label: 'Panel BIM',           icon: <LayoutDashboard size={15} />, group: 'Principal' },
  { screen: 'viewer',       label: 'Visor 3D interactivo', icon: <Eye size={15} />,            group: 'Principal' },
  { screen: 'alerts',       label: 'Alertas BIM',         icon: <AlertTriangle size={15} />,   group: 'Operación', badge: 6 },
  { screen: 'simulation',   label: 'Simulación',          icon: <Zap size={15} />,             group: 'Operación' },
  { screen: 'models',       label: 'Modelos BIM',         icon: <Database size={15} />,        group: 'Gestión' },
  { screen: 'integrations', label: 'Integraciones',       icon: <Activity size={15} />,        group: 'Gestión' },
  { screen: 'historic',     label: 'Histórico',           icon: <History size={15} />,         group: 'Trazabilidad' },
  { screen: 'audit',        label: 'Auditoría',           icon: <Shield size={15} />,          group: 'Trazabilidad' },
];

const GROUPS = ['Principal', 'Operación', 'Gestión', 'Trazabilidad'];

export default function BIM() {
  const [screen, setScreen] = useState<Screen>('dashboard');
  const navigate = (s: Screen) => setScreen(s);

  const renderScreen = () => {
    switch (screen) {
      case 'dashboard':    return <ScreenDashboard onNavigate={navigate} />;
      case 'viewer':       return <ScreenViewer onNavigate={navigate} />;
      case 'alerts':       return <ScreenAlerts onNavigate={navigate} />;
      case 'models':       return <ScreenModels onNavigate={navigate} />;
      case 'integrations': return <ScreenIntegrations onNavigate={navigate} />;
      case 'simulation':   return <ScreenSimulation onNavigate={navigate} />;
      case 'historic':     return <ScreenHistoric onNavigate={navigate} />;
      case 'audit':        return <ScreenAudit onNavigate={navigate} />;
      default:             return <ScreenDashboard onNavigate={navigate} />;
    }
  };

  return (
    <div className="flex h-full min-h-0 gap-0">
      {/* Sidebar */}
      <aside className="w-56 flex-shrink-0 bg-white border-r border-slate-200 flex flex-col overflow-y-auto">
        <div className="px-4 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2 mb-1">
            <Box size={16} className="text-blue-600" />
            <p className="text-sm font-bold text-slate-900">BIM / Gemelo Digital</p>
          </div>
          <p className="text-xs text-slate-500">Presa de Bembézar</p>
          <div className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-2 py-1">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse flex-shrink-0" />
            S.E. activa · 2 alertas críticas
          </div>
        </div>

        <nav className="flex-1 px-2 py-3 space-y-4">
          {GROUPS.map(group => {
            const items = NAV_ITEMS.filter(n => n.group === group);
            if (!items.length) return null;
            return (
              <div key={group}>
                <p className="px-2 py-1 text-xs font-bold uppercase tracking-wider text-slate-400">{group}</p>
                <div className="space-y-0.5">
                  {items.map(item => {
                    const isActive = screen === item.screen;
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
                        {item.badge && (
                          <span className={`text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${isActive ? 'bg-white text-blue-600' : 'bg-orange-500 text-white'}`}>
                            {item.badge}
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

        <div className="px-4 py-3 border-t border-slate-100">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>SAIH · DAMDATA conectados</span>
          </div>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto bg-slate-50 p-6 min-w-0">
        {renderScreen()}
      </main>
    </div>
  );
}
