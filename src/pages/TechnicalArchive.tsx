import { useState } from 'react';
import {
  LayoutDashboard, FolderOpen, Shield, History, Upload, ChevronRight, Search, X
} from 'lucide-react';
import ScreenDashboard from './archive/ScreenDashboard';
import ScreenExplorer from './archive/ScreenExplorer';
import ScreenDocDetail from './archive/ScreenDocDetail';
import ScreenCriticidad from './archive/ScreenCriticidad';
import ScreenAuditoria from './archive/ScreenAuditoria';
import ModalUpload from './archive/ModalUpload';
import ModalMoveDoc from './archive/ModalMoveDoc';

type Screen = 'dashboard' | 'explorer' | 'detail' | 'criticidad' | 'auditoria' | 'upload';

const NAV_ITEMS: { id: Screen; label: string; icon: React.ReactNode }[] = [
  { id: 'dashboard',  label: 'Panel principal',       icon: <LayoutDashboard size={16} /> },
  { id: 'explorer',   label: 'Explorador documental', icon: <FolderOpen size={16} /> },
  { id: 'criticidad', label: 'Gestión de criticidad', icon: <Shield size={16} /> },
  { id: 'auditoria',  label: 'Auditoría y trazabilidad', icon: <History size={16} /> },
];

const SCREEN_LABELS: Partial<Record<Screen, string>> = {
  dashboard:  'Panel principal',
  explorer:   'Explorador documental',
  detail:     'Detalle del documento',
  criticidad: 'Gestión de criticidad',
  auditoria:  'Auditoría y trazabilidad',
};

export default function TechnicalArchive() {
  const [screen, setScreen]         = useState<Screen>('dashboard');
  const [detailDocId, setDetailDocId] = useState<string | null>(null);
  const [moveDocId, setMoveDocId]   = useState<string | null>(null);
  const [showUpload, setShowUpload] = useState(false);
  const [globalSearch, setGlobalSearch] = useState('');

  const navigate = (target: string, docId?: string) => {
    if (target === 'detail' && docId) {
      setDetailDocId(docId);
      setScreen('detail');
    } else if (target === 'upload') {
      setShowUpload(true);
    } else {
      setScreen(target as Screen);
    }
  };

  const handleMove = (docId: string) => {
    setMoveDocId(docId);
  };

  return (
    <div className="flex h-full min-h-screen bg-slate-50 -mx-4 -mt-4 sm:-mx-6 sm:-mt-6">
      {/* Sidebar */}
      <aside className="w-60 flex-shrink-0 bg-white border-r border-slate-200 flex flex-col">
        {/* Header */}
        <div className="px-5 py-5 border-b border-slate-100 bg-slate-50">
          <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">Archivo Técnico</p>
          <p className="text-sm font-bold text-slate-900 leading-tight">Presa de Bembézar</p>
          <div className="mt-2 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs text-slate-500">Alfresco ECM conectado</span>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {NAV_ITEMS.map(item => (
            <button
              key={item.id}
              onClick={() => setScreen(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left text-sm transition-all ${
                screen === item.id
                  ? 'bg-blue-50 text-blue-700 font-semibold'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <span className={screen === item.id ? 'text-blue-600' : 'text-slate-400'}>{item.icon}</span>
              {item.label}
            </button>
          ))}

          <div className="pt-3 mt-1 border-t border-slate-100">
            <button
              onClick={() => setShowUpload(true)}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left text-sm bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-all"
            >
              <Upload size={15} className="flex-shrink-0" />
              Subir documento
            </button>
          </div>
        </nav>

        <div className="px-5 py-4 border-t border-slate-100 text-xs text-slate-400">
          SIPRESAS v2.0 · CHG
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto">
        {/* Top bar */}
        <div className="sticky top-0 z-10 bg-white border-b border-slate-200 px-6 py-3 flex items-center gap-4">
          {/* Breadcrumb */}
          <div className="flex items-center gap-1.5 text-xs text-slate-500 flex-1">
            <span>Archivo Técnico</span>
            <ChevronRight size={12} />
            <span className="font-semibold text-slate-800">{SCREEN_LABELS[screen] || screen}</span>
          </div>

          {/* Búsqueda global */}
          <div className="relative w-72">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={globalSearch}
              onChange={e => setGlobalSearch(e.target.value)}
              placeholder="Buscar en el archivo..."
              className="w-full pl-8 pr-8 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {globalSearch && (
              <button onClick={() => setGlobalSearch('')} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                <X size={13} />
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        <div className={`p-6 ${screen === 'explorer' ? '' : 'max-w-6xl mx-auto'}`}>
          {screen === 'dashboard' && (
            <ScreenDashboard onNavigate={navigate} />
          )}

          {screen === 'explorer' && (
            <ScreenExplorer
              onViewDoc={id => navigate('detail', id)}
              onMoveDoc={handleMove}
              onUpload={() => setShowUpload(true)}
            />
          )}

          {screen === 'detail' && detailDocId && (
            <ScreenDocDetail
              docId={detailDocId}
              onBack={() => setScreen('explorer')}
              onMove={id => { setMoveDocId(id); }}
            />
          )}

          {screen === 'criticidad' && (
            <ScreenCriticidad />
          )}

          {screen === 'auditoria' && (
            <ScreenAuditoria />
          )}
        </div>
      </main>

      {/* Modales */}
      {showUpload && <ModalUpload onClose={() => setShowUpload(false)} />}
      {moveDocId  && <ModalMoveDoc docId={moveDocId} onClose={() => setMoveDocId(null)} />}
    </div>
  );
}
