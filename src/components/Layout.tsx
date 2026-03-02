import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Home,
  Activity,
  AlertTriangle,
  Settings,
  Menu,
  X,
  Map,
  BarChart3,
  LogOut,
  Package,
  Wrench,
  FolderOpen,
  TrendingUp,
  Box,
  ExternalLink,
  ChevronRight,
  Info,
  Shield,
  Layout as LayoutIcon,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useDamSelection } from '../contexts/DamSelectionContext';
import { SipresasLogo } from './logos/SipresasLogo';
import { MinisterioLogo } from './logos/MinisterioLogo';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { profile, signOut } = useAuth();
  const { selectedDam, clearSelection } = useDamSelection();

  const navItems = [
    { path: '/map', icon: Map, label: 'Seleccionar Presa' },
    { path: '/dashboard', icon: Home, label: 'Ficha Principal', requiresDam: true },
    { path: '/inventory', icon: Package, label: 'Inventario', section: 'Módulos', requiresDam: true },
    { path: '/maintenance', icon: Wrench, label: 'Mantenimiento', section: 'Módulos', requiresDam: true },
    { path: '/technical-archive', icon: FolderOpen, label: 'Archivo Técnico', section: 'Módulos', requiresDam: true },
    { path: '/exploitation', icon: TrendingUp, label: 'Explotación', section: 'Módulos', requiresDam: true },
    { path: '/emergency', icon: Shield, label: 'Gestión de Emergencias', section: 'Módulos', requiresDam: true },
    { path: '/bim', icon: Box, label: 'BIM', section: 'Módulos', requiresDam: true },
    { path: '/settings', icon: Settings, label: 'Configuración' }
  ];

  const externalLinks = [
    { label: 'CHG', url: 'https://www.chguadalquivir.es/' },
    { label: 'SAIH Guadalquivir', url: 'https://www.chguadalquivir.es/saih/' },
    { label: 'MITECO', url: 'https://www.miteco.gob.es/es/' },
    { label: 'IDE-CHG', url: 'https://idechg.chguadalquivir.es/' },
  ];

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  const getRoleLabel = (role: string) => {
    const labels: Record<string, string> = {
      admin: 'Administrador',
      technician: 'Técnico',
      operator: 'Operador',
      consultation: 'Consulta'
    };
    return labels[role] || role;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Institucional - Estilo SAIH */}
      <header className="bg-white border-b-2 border-[#0066A1] shadow-sm">
        {/* Barra superior con logos institucionales */}
        <div className="bg-white px-4 py-2 flex items-center justify-between border-b border-gray-200">
          <div className="flex items-center gap-6">
            {/* Logo CHG */}
            <div className="flex items-center gap-2">
              <div className="w-12 h-12 bg-[#0066A1] rounded flex items-center justify-center">
                <span className="text-white font-bold text-sm">CHG</span>
              </div>
            </div>

            {/* Separador */}
            <div className="h-10 w-px bg-gray-300"></div>

            {/* Logo y título SIPRESAS */}
            <div className="flex items-center gap-3">
              <SipresasLogo size={40} showText={false} />
              <div>
                <h1 className="text-xl font-bold text-[#0066A1]">SIPRESAS</h1>
                <p className="text-xs text-gray-600">Sistema Integral de Presas y Seguridad</p>
              </div>
            </div>

            {/* Presa seleccionada */}
            {selectedDam && (
              <>
                <div className="h-10 w-px bg-gray-300"></div>
                <div className="flex items-center gap-2 bg-blue-50 px-3 py-2 rounded">
                  <div>
                    <p className="text-xs text-gray-500">Presa Seleccionada</p>
                    <p className="text-sm font-semibold text-[#0066A1]">{selectedDam.code} - {selectedDam.name}</p>
                  </div>
                  <button
                    onClick={() => {
                      clearSelection();
                      navigate('/map');
                    }}
                    className="ml-2 p-1 hover:bg-blue-100 rounded transition-colors"
                    title="Cambiar presa"
                  >
                    <X size={16} className="text-gray-600" />
                  </button>
                </div>
              </>
            )}
          </div>

          <div className="flex items-center gap-4">
            {/* Logo Ministerio */}
            <MinisterioLogo height={50} />
          </div>
        </div>

        {/* Barra de navegación principal */}
        <div className="bg-[#0066A1] px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="flex items-center gap-2 px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded transition-colors text-sm"
            >
              <Menu size={18} />
              <span>Menú</span>
            </button>

            {/* Enlaces rápidos estilo SAIH */}
            <div className="flex items-center gap-1">
              {externalLinks.slice(0, 2).map((link, idx) => (
                <a
                  key={idx}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 text-white hover:bg-white/10 rounded transition-colors text-sm flex items-center gap-1"
                >
                  {link.label}
                  <ExternalLink size={12} />
                </a>
              ))}
            </div>
          </div>

          {profile && (
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm font-medium text-white">{profile.full_name}</p>
                <p className="text-xs text-blue-100">{getRoleLabel(profile.role)}</p>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 hover:bg-white/10 text-white rounded transition-colors flex items-center gap-1 text-sm"
                title="Cerrar sesión"
              >
                <LogOut size={16} />
              </button>
            </div>
          )}
        </div>

        {/* Aviso de Datos NO Contrastados - Estilo SAIH */}
        <div className="bg-yellow-50 border-b border-yellow-200 px-4 py-1.5 flex items-center justify-center gap-2">
          <Info size={16} className="text-yellow-700" />
          <p className="text-xs text-yellow-800 font-medium">
            Los datos del portal web se obtienen mediante estaciones automáticas y <strong>NO están contrastados</strong>
          </p>
        </div>

        {/* Módulos principales - Acceso directo */}
        {selectedDam && (
          <div className="bg-white border-b border-gray-200 px-6 py-4">
            <div className="flex items-center gap-3 overflow-x-auto">
              {/* Botón destacado para volver a Ficha Principal */}
              <Link
                to="/dashboard"
                className={`flex flex-col items-center justify-center gap-2 px-6 py-3 rounded-lg text-sm font-medium transition-all whitespace-nowrap min-w-[120px] shadow-sm border-2 ${
                  location.pathname === '/dashboard'
                    ? 'bg-[#0066A1] text-white border-[#0066A1] shadow-md transform scale-105'
                    : 'bg-gradient-to-br from-blue-50 to-blue-100 text-[#0066A1] border-blue-300 hover:bg-blue-100 hover:shadow-md hover:border-[#0066A1]'
                }`}
              >
                <Home size={22} strokeWidth={2} />
                <span className="text-xs font-semibold">Ficha Principal</span>
              </Link>

              {/* Separador visual */}
              <div className="h-16 w-px bg-gray-300 mx-2"></div>

              {/* Resto de módulos */}
              {navItems.filter(item => item.requiresDam && item.path !== '/dashboard').map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex flex-col items-center justify-center gap-2 px-6 py-3 rounded-lg text-sm font-medium transition-all whitespace-nowrap min-w-[120px] shadow-sm ${
                      isActive
                        ? 'bg-[#0066A1] text-white shadow-md transform scale-105'
                        : 'bg-blue-50 text-[#0066A1] hover:bg-blue-100 hover:shadow-md'
                    }`}
                  >
                    <Icon size={22} strokeWidth={2} />
                    <span className="text-xs font-semibold">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </header>

      {/* Layout principal */}
      <div className="flex">
        {/* Contenido principal */}
        <main className="flex-1 p-6 min-h-screen">
          {children}
        </main>

        {/* Sidebar izquierdo - Estilo SAIH */}
        <aside
          className={`fixed left-0 top-0 bottom-0 bg-white border-r border-gray-200 shadow-lg transition-all duration-300 z-40 ${
            sidebarOpen ? 'w-72' : 'w-0'
          } overflow-hidden`}
          style={{ top: selectedDam ? '230px' : '146px' }}
        >
          <div className="h-full overflow-y-auto">
            {/* Header del sidebar */}
            <div className="sticky top-0 bg-[#0066A1] text-white px-4 py-3 flex items-center justify-between z-10">
              <h3 className="font-semibold text-sm">Módulos SIPRESAS</h3>
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-1 hover:bg-white/10 rounded transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Navegación agrupada por secciones */}
            <nav className="p-3">
              {/* Principal */}
              <div className="mb-4">
                <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2 px-2">Principal</h4>
                {navItems.filter(item => !item.section).slice(0, 2).map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;
                  const isDisabled = item.requiresDam && !selectedDam;

                  if (isDisabled) {
                    return (
                      <div
                        key={item.path}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-md mb-1 text-sm text-gray-400 cursor-not-allowed opacity-50"
                        title="Seleccione una presa primero"
                      >
                        <Icon size={16} />
                        <span>{item.label}</span>
                      </div>
                    );
                  }

                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-md mb-1 transition-all text-sm ${
                        isActive
                          ? 'bg-[#0066A1] text-white shadow-sm'
                          : 'text-gray-700 hover:bg-blue-50 hover:text-[#0066A1]'
                      }`}
                    >
                      <Icon size={16} />
                      <span>{item.label}</span>
                      <ChevronRight size={14} className="ml-auto" />
                    </Link>
                  );
                })}
              </div>

              {/* Módulos */}
              <div className="mb-4">
                <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2 px-2">Módulos</h4>
                {navItems.filter(item => item.section === 'Módulos').map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;
                  const isDisabled = item.requiresDam && !selectedDam;

                  if (isDisabled) {
                    return (
                      <div
                        key={item.path}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-md mb-1 text-sm text-gray-400 cursor-not-allowed opacity-50"
                        title="Seleccione una presa primero"
                      >
                        <Icon size={16} />
                        <span>{item.label}</span>
                      </div>
                    );
                  }

                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-md mb-1 transition-all text-sm ${
                        isActive
                          ? 'bg-[#0066A1] text-white shadow-sm'
                          : 'text-gray-700 hover:bg-blue-50 hover:text-[#0066A1]'
                      }`}
                    >
                      <Icon size={16} />
                      <span>{item.label}</span>
                      <ChevronRight size={14} className="ml-auto" />
                    </Link>
                  );
                })}
              </div>

              {/* Otros */}
              <div className="mb-4">
                <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2 px-2">Otros</h4>
                {navItems.filter(item => !item.section).slice(2).map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;
                  const isDisabled = item.requiresDam && !selectedDam;

                  if (isDisabled) {
                    return (
                      <div
                        key={item.path}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-md mb-1 text-sm text-gray-400 cursor-not-allowed opacity-50"
                        title="Seleccione una presa primero"
                      >
                        <Icon size={16} />
                        <span>{item.label}</span>
                      </div>
                    );
                  }

                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-md mb-1 transition-all text-sm ${
                        isActive
                          ? 'bg-[#0066A1] text-white shadow-sm'
                          : 'text-gray-700 hover:bg-blue-50 hover:text-[#0066A1]'
                      }`}
                    >
                      <Icon size={16} />
                      <span>{item.label}</span>
                      <ChevronRight size={14} className="ml-auto" />
                    </Link>
                  );
                })}
              </div>

              {/* Enlaces externos */}
              <div className="border-t border-gray-200 pt-4 mt-4">
                <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2 px-2">Enlaces Externos</h4>
                {externalLinks.map((link, idx) => (
                  <a
                    key={idx}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 px-3 py-2.5 rounded-md mb-1 text-sm text-gray-700 hover:bg-blue-50 hover:text-[#0066A1] transition-all"
                  >
                    <ExternalLink size={16} />
                    <span>{link.label}</span>
                  </a>
                ))}
              </div>
            </nav>

            {/* Footer del sidebar */}
            <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 p-4 text-center">
              <p className="text-xs text-gray-600">
                <strong className="text-[#0066A1]">SIPRESAS v2.0</strong>
                <br />
                CHG - Confederación Hidrográfica del Guadalquivir
                <br />
                © 2026
              </p>
            </div>
          </div>
        </aside>

        {/* Overlay cuando el sidebar está abierto */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/20 z-30"
            style={{ top: selectedDam ? '230px' : '146px' }}
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </div>
    </div>
  );
};
