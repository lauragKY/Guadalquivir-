import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { AlertCircle, Lock } from 'lucide-react';
import { SipresasLogo } from '../components/logos/SipresasLogo';
import { MinisterioLogo } from '../components/logos/MinisterioLogo';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { error } = await signIn(email, password);
      if (error) {
        setError('Credenciales incorrectas. Por favor, intenta de nuevo.');
      } else {
        navigate('/');
      }
    } catch (err) {
      setError('Error al iniciar sesión. Por favor, intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex flex-col">
      {/* Header institucional */}
      <header className="bg-white border-b-2 border-[#0066A1] shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Logo CHG */}
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-[#0066A1] rounded flex items-center justify-center">
              <span className="text-white font-bold">CHG</span>
            </div>
            <div>
              <h1 className="text-lg font-bold text-[#0066A1]">
                Confederación Hidrográfica del Guadalquivir
              </h1>
              <p className="text-xs text-gray-600">Sistema Automático de Información Hidrológica</p>
            </div>
          </div>

          {/* Logo Ministerio */}
          <div>
            <MinisterioLogo height={55} />
          </div>
        </div>
      </header>

      {/* Contenido principal */}
      <main className="flex-1 flex items-center justify-center p-8">
        <div className="max-w-5xl w-full grid md:grid-cols-2 gap-8 items-center">
          {/* Panel izquierdo - Información */}
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <SipresasLogo size={60} showText={false} />
              <div>
                <h2 className="text-3xl font-bold text-[#0066A1]">SIPRESAS</h2>
                <p className="text-lg text-gray-700">Sistema Integral de Presas y Seguridad</p>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-[#0066A1] mb-3">
                Módulos del Sistema
              </h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-[#0066A1] mt-1">•</span>
                  <span><strong>Inventario y Gestión:</strong> Control completo de presas y embalses</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#0066A1] mt-1">•</span>
                  <span><strong>Auscultación:</strong> Monitorización en tiempo real de sensores</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#0066A1] mt-1">•</span>
                  <span><strong>Emergencias:</strong> Gestión de incidentes y planes de emergencia</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#0066A1] mt-1">•</span>
                  <span><strong>Explotación:</strong> Control de operaciones y gestión hídrica</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#0066A1] mt-1">•</span>
                  <span><strong>BIM:</strong> Modelos 3D y documentación técnica avanzada</span>
                </li>
              </ul>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-xs text-blue-900">
                <strong>Nota:</strong> Los datos del sistema se obtienen mediante estaciones automáticas
                y deben ser contrastados antes de su uso oficial.
              </p>
            </div>
          </div>

          {/* Panel derecho - Formulario de login */}
          <div className="bg-white rounded-lg border-2 border-[#0066A1] shadow-lg overflow-hidden">
            {/* Header del formulario */}
            <div className="bg-[#0066A1] px-6 py-4 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-white/10 rounded-full mb-2">
                <Lock className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white">Inicio de Sesión</h3>
              <p className="text-sm text-blue-100 mt-1">Acceso al Sistema SIPRESAS</p>
            </div>

            {/* Formulario */}
            <div className="p-6">
              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-start gap-2">
                  <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Usuario *
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0066A1] focus:border-transparent"
                    placeholder="usuario@ejemplo.es"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Contraseña *
                  </label>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0066A1] focus:border-transparent"
                    placeholder="••••••••"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#0066A1] hover:bg-[#004d7a] text-white font-medium py-3 px-4 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Accediendo...' : 'Iniciar Sesión'}
                </button>
              </form>

              {/* Botón de configuración */}
              <a
                href="/setup-demo"
                className="block w-full mt-4 text-center bg-blue-50 hover:bg-blue-100 text-[#0066A1] font-medium py-2 px-4 rounded-md border border-blue-200 transition-colors text-sm"
              >
                Configurar Usuarios de Demostración
              </a>

              {/* Credenciales de demostración */}
              <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-md">
                <p className="text-xs font-semibold text-gray-700 mb-2">
                  Credenciales de Demostración:
                </p>
                <div className="space-y-1.5 text-xs text-gray-600">
                  <div className="flex items-center gap-2">
                    <span className="font-medium w-20">Admin:</span>
                    <code className="bg-white px-2 py-1 rounded border border-gray-200 text-[10px]">
                      admin@sipresas.es
                    </code>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium w-20">Técnico:</span>
                    <code className="bg-white px-2 py-1 rounded border border-gray-200 text-[10px]">
                      tecnico@sipresas.es
                    </code>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium w-20">Operador:</span>
                    <code className="bg-white px-2 py-1 rounded border border-gray-200 text-[10px]">
                      operador@sipresas.es
                    </code>
                  </div>
                  <div className="flex items-center gap-2 pt-1 border-t border-gray-300 mt-2">
                    <span className="font-medium w-20">Contraseña:</span>
                    <code className="bg-white px-2 py-1 rounded border border-gray-200 text-[10px]">
                      demo123
                    </code>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-4">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between text-xs text-gray-600">
          <div>
            <p>© 2026 CHG - Confederación Hidrográfica del Guadalquivir</p>
            <p className="text-[10px] mt-0.5">SIPRESAS v2.0 - Sistema Integral de Presas y Seguridad</p>
          </div>
          <div className="text-right">
            <p>Ministerio para la Transición Ecológica</p>
            <p className="text-[10px] mt-0.5">y el Reto Demográfico</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
