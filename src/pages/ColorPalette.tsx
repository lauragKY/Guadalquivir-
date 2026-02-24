import { CheckCircle, AlertTriangle, XCircle, Info, Droplet, Activity } from 'lucide-react';

export default function ColorPalette() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="header-sipresas">Guía de Paleta de Colores SIPRESAS</h1>
        <p className="text-sipresas-muted">Referencia visual completa de colores institucionales y funcionales</p>
      </div>

      {/* Colores Institucionales */}
      <section className="section-sipresas">
        <h2 className="subheader-sipresas">Colores Institucionales</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-7 gap-4">
          <div className="space-y-2">
            <div className="h-24 bg-sipresas-darker rounded-lg shadow-sm flex items-center justify-center">
              <span className="text-white text-xs font-medium">Azul Más Oscuro</span>
            </div>
            <p className="text-xs text-center font-mono">#082841</p>
          </div>
          <div className="space-y-2">
            <div className="h-24 bg-sipresas-dark rounded-lg shadow-sm flex items-center justify-center">
              <span className="text-white text-xs font-medium">Azul Oscuro</span>
            </div>
            <p className="text-xs text-center font-mono">#0d3859</p>
          </div>
          <div className="space-y-2">
            <div className="h-24 bg-sipresas-primary rounded-lg shadow-sm flex items-center justify-center">
              <span className="text-white text-xs font-medium">Azul Primario</span>
            </div>
            <p className="text-xs text-center font-mono">#1e5a8e</p>
          </div>
          <div className="space-y-2">
            <div className="h-24 bg-sipresas-secondary rounded-lg shadow-sm flex items-center justify-center">
              <span className="text-white text-xs font-medium">Azul Secundario</span>
            </div>
            <p className="text-xs text-center font-mono">#2874b5</p>
          </div>
          <div className="space-y-2">
            <div className="h-24 bg-sipresas-light rounded-lg shadow-sm border border-gray-200 flex items-center justify-center">
              <span className="text-white text-xs font-medium">Azul Medio</span>
            </div>
            <p className="text-xs text-center font-mono">#4a9fd8</p>
          </div>
          <div className="space-y-2">
            <div className="h-24 bg-sipresas-lighter rounded-lg shadow-sm border border-gray-200 flex items-center justify-center">
              <span className="text-sipresas-dark text-xs font-medium">Azul Claro</span>
            </div>
            <p className="text-xs text-center font-mono">#a4c8e1</p>
          </div>
          <div className="space-y-2">
            <div className="h-24 bg-sipresas-lightest rounded-lg shadow-sm border border-gray-200 flex items-center justify-center">
              <span className="text-sipresas-dark text-xs font-medium">Azul Ultraclaro</span>
            </div>
            <p className="text-xs text-center font-mono">#e8f2f9</p>
          </div>
        </div>
      </section>

      {/* Colores Hidráulicos */}
      <section className="section-sipresas">
        <h2 className="subheader-sipresas">Colores Hidráulicos (Aqua)</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <div className="space-y-2">
            <div className="h-24 bg-cyan-700 rounded-lg shadow-sm flex items-center justify-center">
              <span className="text-white text-xs font-medium">Aqua Oscuro</span>
            </div>
            <p className="text-xs text-center font-mono">#0e7490</p>
          </div>
          <div className="space-y-2">
            <div className="h-24 bg-cyan-500 rounded-lg shadow-sm flex items-center justify-center">
              <span className="text-white text-xs font-medium">Aqua Principal</span>
            </div>
            <p className="text-xs text-center font-mono">#06b6d4</p>
          </div>
          <div className="space-y-2">
            <div className="h-24 bg-cyan-400 rounded-lg shadow-sm border border-gray-200 flex items-center justify-center">
              <span className="text-white text-xs font-medium">Aqua Medio</span>
            </div>
            <p className="text-xs text-center font-mono">#22d3ee</p>
          </div>
          <div className="space-y-2">
            <div className="h-24 bg-cyan-300 rounded-lg shadow-sm border border-gray-200 flex items-center justify-center">
              <span className="text-gray-900 text-xs font-medium">Aqua Claro</span>
            </div>
            <p className="text-xs text-center font-mono">#67e8f9</p>
          </div>
          <div className="space-y-2">
            <div className="h-24 bg-cyan-100 rounded-lg shadow-sm border border-gray-200 flex items-center justify-center">
              <span className="text-gray-900 text-xs font-medium">Aqua Ultraclaro</span>
            </div>
            <p className="text-xs text-center font-mono">#cffafe</p>
          </div>
        </div>
      </section>

      {/* Colores Funcionales */}
      <section className="section-sipresas">
        <h2 className="subheader-sipresas">Colores Funcionales</h2>

        {/* Verde - Éxito */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Verde - Éxito / Operativo</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="space-y-2">
              <div className="h-20 bg-green-800 rounded-lg shadow-sm flex items-center justify-center">
                <span className="text-white text-xs">Verde Oscuro</span>
              </div>
              <p className="text-xs text-center font-mono">#15803d</p>
            </div>
            <div className="space-y-2">
              <div className="h-20 bg-green-600 rounded-lg shadow-sm flex items-center justify-center">
                <span className="text-white text-xs">Verde Principal</span>
              </div>
              <p className="text-xs text-center font-mono">#16a34a</p>
            </div>
            <div className="space-y-2">
              <div className="h-20 bg-green-500 rounded-lg shadow-sm flex items-center justify-center">
                <span className="text-white text-xs">Verde Medio</span>
              </div>
              <p className="text-xs text-center font-mono">#22c55e</p>
            </div>
            <div className="space-y-2">
              <div className="h-20 bg-green-300 rounded-lg shadow-sm border border-gray-200 flex items-center justify-center">
                <span className="text-gray-900 text-xs">Verde Claro</span>
              </div>
              <p className="text-xs text-center font-mono">#86efac</p>
            </div>
            <div className="space-y-2">
              <div className="h-20 bg-green-100 rounded-lg shadow-sm border border-gray-200 flex items-center justify-center">
                <span className="text-gray-900 text-xs">Verde Ultraclaro</span>
              </div>
              <p className="text-xs text-center font-mono">#dcfce7</p>
            </div>
          </div>
        </div>

        {/* Amarillo - Advertencia */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Amarillo - Advertencia / Precaución</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="space-y-2">
              <div className="h-20 bg-yellow-700 rounded-lg shadow-sm flex items-center justify-center">
                <span className="text-white text-xs">Amarillo Oscuro</span>
              </div>
              <p className="text-xs text-center font-mono">#b45309</p>
            </div>
            <div className="space-y-2">
              <div className="h-20 bg-yellow-600 rounded-lg shadow-sm flex items-center justify-center">
                <span className="text-white text-xs">Amarillo Principal</span>
              </div>
              <p className="text-xs text-center font-mono">#ca8a04</p>
            </div>
            <div className="space-y-2">
              <div className="h-20 bg-yellow-500 rounded-lg shadow-sm flex items-center justify-center">
                <span className="text-gray-900 text-xs">Amarillo Medio</span>
              </div>
              <p className="text-xs text-center font-mono">#eab308</p>
            </div>
            <div className="space-y-2">
              <div className="h-20 bg-yellow-300 rounded-lg shadow-sm border border-gray-200 flex items-center justify-center">
                <span className="text-gray-900 text-xs">Amarillo Claro</span>
              </div>
              <p className="text-xs text-center font-mono">#fde047</p>
            </div>
            <div className="space-y-2">
              <div className="h-20 bg-yellow-100 rounded-lg shadow-sm border border-gray-200 flex items-center justify-center">
                <span className="text-gray-900 text-xs">Amarillo Ultraclaro</span>
              </div>
              <p className="text-xs text-center font-mono">#fef9c3</p>
            </div>
          </div>
        </div>

        {/* Naranja - Alerta */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Naranja - Alerta / Atención</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="space-y-2">
              <div className="h-20 bg-orange-800 rounded-lg shadow-sm flex items-center justify-center">
                <span className="text-white text-xs">Naranja Oscuro</span>
              </div>
              <p className="text-xs text-center font-mono">#c2410c</p>
            </div>
            <div className="space-y-2">
              <div className="h-20 bg-orange-600 rounded-lg shadow-sm flex items-center justify-center">
                <span className="text-white text-xs">Naranja Principal</span>
              </div>
              <p className="text-xs text-center font-mono">#ea580c</p>
            </div>
            <div className="space-y-2">
              <div className="h-20 bg-orange-500 rounded-lg shadow-sm flex items-center justify-center">
                <span className="text-white text-xs">Naranja Medio</span>
              </div>
              <p className="text-xs text-center font-mono">#f97316</p>
            </div>
            <div className="space-y-2">
              <div className="h-20 bg-orange-300 rounded-lg shadow-sm border border-gray-200 flex items-center justify-center">
                <span className="text-gray-900 text-xs">Naranja Claro</span>
              </div>
              <p className="text-xs text-center font-mono">#fdba74</p>
            </div>
            <div className="space-y-2">
              <div className="h-20 bg-orange-100 rounded-lg shadow-sm border border-gray-200 flex items-center justify-center">
                <span className="text-gray-900 text-xs">Naranja Ultraclaro</span>
              </div>
              <p className="text-xs text-center font-mono">#ffedd5</p>
            </div>
          </div>
        </div>

        {/* Rojo - Error */}
        <div>
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Rojo - Error / Emergencia / Crítico</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="space-y-2">
              <div className="h-20 bg-red-800 rounded-lg shadow-sm flex items-center justify-center">
                <span className="text-white text-xs">Rojo Oscuro</span>
              </div>
              <p className="text-xs text-center font-mono">#b91c1c</p>
            </div>
            <div className="space-y-2">
              <div className="h-20 bg-red-600 rounded-lg shadow-sm flex items-center justify-center">
                <span className="text-white text-xs">Rojo Principal</span>
              </div>
              <p className="text-xs text-center font-mono">#dc2626</p>
            </div>
            <div className="space-y-2">
              <div className="h-20 bg-red-500 rounded-lg shadow-sm flex items-center justify-center">
                <span className="text-white text-xs">Rojo Medio</span>
              </div>
              <p className="text-xs text-center font-mono">#ef4444</p>
            </div>
            <div className="space-y-2">
              <div className="h-20 bg-red-300 rounded-lg shadow-sm border border-gray-200 flex items-center justify-center">
                <span className="text-gray-900 text-xs">Rojo Claro</span>
              </div>
              <p className="text-xs text-center font-mono">#fca5a5</p>
            </div>
            <div className="space-y-2">
              <div className="h-20 bg-red-100 rounded-lg shadow-sm border border-gray-200 flex items-center justify-center">
                <span className="text-gray-900 text-xs">Rojo Ultraclaro</span>
              </div>
              <p className="text-xs text-center font-mono">#fee2e2</p>
            </div>
          </div>
        </div>
      </section>

      {/* Ejemplos de Botones */}
      <section className="section-sipresas">
        <h2 className="subheader-sipresas">Botones</h2>
        <div className="flex flex-wrap gap-3">
          <button className="btn-sipresas-primary">Primario</button>
          <button className="btn-sipresas-secondary">Secundario</button>
          <button className="btn-sipresas-outline">Outline</button>
          <button className="btn-sipresas-success">Éxito</button>
          <button className="btn-sipresas-warning">Advertencia</button>
          <button className="btn-sipresas-danger">Peligro</button>
        </div>
      </section>

      {/* Ejemplos de Badges */}
      <section className="section-sipresas">
        <h2 className="subheader-sipresas">Badges y Estados</h2>
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-2">Estados Operacionales</h3>
            <div className="flex flex-wrap gap-2">
              <span className="status-operational">
                <CheckCircle size={14} />
                Operativa
              </span>
              <span className="status-maintenance">
                <Activity size={14} />
                Mantenimiento
              </span>
              <span className="status-alert">
                <AlertTriangle size={14} />
                Alerta
              </span>
              <span className="status-warning">
                <AlertTriangle size={14} />
                Advertencia
              </span>
              <span className="status-emergency">
                <XCircle size={14} />
                Emergencia
              </span>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-2">Badges Funcionales</h3>
            <div className="flex flex-wrap gap-2">
              <span className="badge-sipresas-primary">Primario</span>
              <span className="badge-sipresas-success">Éxito</span>
              <span className="badge-sipresas-warning">Advertencia</span>
              <span className="badge-sipresas-alert">Alerta</span>
              <span className="badge-sipresas-error">Error</span>
              <span className="badge-sipresas-info">Información</span>
              <span className="badge-sipresas-aqua">Hidráulico</span>
            </div>
          </div>
        </div>
      </section>

      {/* Ejemplos de Alertas */}
      <section className="section-sipresas">
        <h2 className="subheader-sipresas">Alertas</h2>
        <div className="space-y-4">
          <div className="alert-sipresas-info flex items-start gap-3">
            <Info className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-medium text-sm">Información</h3>
              <p className="text-sm mt-1">Los datos se actualizan cada 15 minutos automáticamente.</p>
            </div>
          </div>

          <div className="alert-sipresas-success flex items-start gap-3">
            <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-medium text-sm">Operación exitosa</h3>
              <p className="text-sm mt-1">Los cambios se han guardado correctamente en el sistema.</p>
            </div>
          </div>

          <div className="alert-sipresas-warning flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-medium text-sm">Advertencia</h3>
              <p className="text-sm mt-1">El nivel del embalse está cerca del umbral de precaución.</p>
            </div>
          </div>

          <div className="alert-sipresas-alert flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-medium text-sm">Alerta</h3>
              <p className="text-sm mt-1">Se requiere atención inmediata en el sensor de nivel.</p>
            </div>
          </div>

          <div className="alert-sipresas-error flex items-start gap-3">
            <XCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-medium text-sm">Error crítico</h3>
              <p className="text-sm mt-1">No se pudo completar la operación. Contacte al administrador.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Indicadores de Nivel */}
      <section className="section-sipresas">
        <h2 className="subheader-sipresas">Indicadores de Nivel de Agua</h2>
        <div className="space-y-4">
          <div className="level-indicator">
            <div className="level-bar">
              <div className="level-fill-critical-high" style={{ width: '95%' }}></div>
            </div>
            <span className="text-sm font-medium text-red-600">95% - Crítico Alto</span>
          </div>

          <div className="level-indicator">
            <div className="level-bar">
              <div className="level-fill-high" style={{ width: '88%' }}></div>
            </div>
            <span className="text-sm font-medium text-orange-600">88% - Alto</span>
          </div>

          <div className="level-indicator">
            <div className="level-bar">
              <div className="level-fill-optimal" style={{ width: '75%' }}></div>
            </div>
            <span className="text-sm font-medium text-green-600">75% - Óptimo</span>
          </div>

          <div className="level-indicator">
            <div className="level-bar">
              <div className="level-fill-normal" style={{ width: '50%' }}></div>
            </div>
            <span className="text-sm font-medium text-sipresas-secondary">50% - Normal</span>
          </div>

          <div className="level-indicator">
            <div className="level-bar">
              <div className="level-fill-low" style={{ width: '30%' }}></div>
            </div>
            <span className="text-sm font-medium text-yellow-600">30% - Bajo</span>
          </div>

          <div className="level-indicator">
            <div className="level-bar">
              <div className="level-fill-critical-low" style={{ width: '15%' }}></div>
            </div>
            <span className="text-sm font-medium text-red-600">15% - Crítico Bajo</span>
          </div>
        </div>
      </section>

      {/* Tabla de Ejemplo */}
      <section className="section-sipresas">
        <h2 className="subheader-sipresas">Tabla de Ejemplo</h2>
        <table className="table-sipresas">
          <thead>
            <tr>
              <th>Código</th>
              <th>Nombre</th>
              <th>Estado</th>
              <th>Nivel</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="font-medium">CHE801</td>
              <td>LA BREÑA II</td>
              <td><span className="status-operational"><CheckCircle size={12} />Operativa</span></td>
              <td><span className="severity-low">75%</span></td>
            </tr>
            <tr>
              <td className="font-medium">CHE802</td>
              <td>SAN CLEMENTE</td>
              <td><span className="status-maintenance"><Activity size={12} />Mantenimiento</span></td>
              <td><span className="severity-medium">45%</span></td>
            </tr>
            <tr>
              <td className="font-medium">CHE803</td>
              <td>ALCÁNTARA</td>
              <td><span className="status-alert"><AlertTriangle size={12} />Alerta</span></td>
              <td><span className="severity-high">92%</span></td>
            </tr>
          </tbody>
        </table>
      </section>

      {/* Gradientes */}
      <section className="section-sipresas">
        <h2 className="subheader-sipresas">Gradientes</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="h-24 gradient-header rounded-lg shadow-sm flex items-center justify-center">
            <span className="text-white text-sm font-medium">Header</span>
          </div>
          <div className="h-24 gradient-aqua rounded-lg shadow-sm flex items-center justify-center">
            <span className="text-white text-sm font-medium">Aqua</span>
          </div>
          <div className="h-24 gradient-success rounded-lg shadow-sm flex items-center justify-center">
            <span className="text-white text-sm font-medium">Success</span>
          </div>
          <div className="h-24 gradient-error rounded-lg shadow-sm flex items-center justify-center">
            <span className="text-white text-sm font-medium">Error</span>
          </div>
        </div>
      </section>
    </div>
  );
}
