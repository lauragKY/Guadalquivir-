import { useEffect, useState } from 'react';
import { Loader } from 'lucide-react';

export default function SetupDemoUsers() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Inicializando usuarios de demostración...');
  const [results, setResults] = useState<any[]>([]);

  useEffect(() => {
    setupUsers();
  }, []);

  const setupUsers = async () => {
    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

      const response = await fetch(
        `${supabaseUrl}/functions/v1/setup-demo-users`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${anonKey}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const data = await response.json();

      if (response.ok && data.success) {
        setStatus('success');
        setMessage('Usuarios de demostración creados correctamente');
        setResults(data.results);
        setTimeout(() => {
          window.location.href = '/login';
        }, 2000);
      } else {
        setStatus('error');
        setMessage('Error al crear usuarios: ' + (data.error || 'Error desconocido'));
      }
    } catch (error) {
      setStatus('error');
      setMessage('Error de conexión: ' + (error instanceof Error ? error.message : 'Error desconocido'));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
        {status === 'loading' && (
          <>
            <Loader className="w-12 h-12 text-[#0066A1] animate-spin mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Inicializando Sistema</h2>
            <p className="text-gray-600">{message}</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-green-600 text-2xl">✓</span>
            </div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">¡Listo!</h2>
            <p className="text-gray-600 mb-4">{message}</p>
            <div className="bg-gray-50 rounded p-4 text-left text-sm mb-4">
              {results.map((result, i) => (
                <div key={i} className="py-2 border-b last:border-b-0">
                  <p className="font-medium text-gray-700">{result.email}</p>
                  <p className="text-gray-600 text-xs">{result.message}</p>
                </div>
              ))}
            </div>
            <p className="text-gray-500 text-xs">Redirigiendo al login...</p>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-red-600 text-2xl">!</span>
            </div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Error</h2>
            <p className="text-gray-600 mb-4">{message}</p>
            <button
              onClick={setupUsers}
              className="w-full bg-[#0066A1] text-white py-2 px-4 rounded hover:bg-[#004d7a] transition-colors"
            >
              Intentar de Nuevo
            </button>
            <a
              href="/login"
              className="block mt-3 text-[#0066A1] hover:underline text-sm"
            >
              Ir al Login
            </a>
          </>
        )}
      </div>
    </div>
  );
}
