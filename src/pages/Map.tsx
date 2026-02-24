import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Search, Droplet, Info, ChevronRight } from 'lucide-react';
import { useDamSelection } from '../contexts/DamSelectionContext';
import { Card } from '../components/ui/Card';
import { Dam } from '../types';
import { supabase } from '../lib/supabase';

interface MapDam {
  id: string;
  codigo: string;
  nombre: string;
  cuenca: string;
  provincia: string;
  municipio: string;
  rio: string;
  x: number;
  y: number;
  lat?: number;
  lon?: number;
  capacidad_maxima?: number;
  nivel_actual?: number;
  volumen_actual?: number;
  altura?: number;
}

// Coordenadas aproximadas de las presas del Guadalquivir en el mapa SVG
const damCoordinates: Record<string, { x: number; y: number }> = {
  'GQ-001': { x: 52, y: 60 },  // Iznájar (Córdoba)
  'GQ-002': { x: 75, y: 32 },  // Tranco de Beas (Jaén)
  'GQ-003': { x: 58, y: 44 },  // Guadalmellato (Córdoba)
  'GQ-004': { x: 72, y: 38 },  // Doña Aldonza (Jaén)
  'GQ-005': { x: 56, y: 35 },  // Jándula (Jaén)
  'GQ-006': { x: 70, y: 55 },  // Negratín (Granada)
};

export default function Map() {
  const [localSelectedDam, setLocalSelectedDam] = useState<string | null>(null);
  const [hoveredDam, setHoveredDam] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [dams, setDams] = useState<MapDam[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { selectDam } = useDamSelection();

  useEffect(() => {
    loadDams();
  }, []);

  const loadDams = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('dams')
        .select('*')
        .order('code');

      if (error) throw error;

      const mapDams: MapDam[] = (data || [])
        .filter(dam => dam.code.startsWith('GQ-'))
        .map(dam => {
          const coords = damCoordinates[dam.code] || { x: 50, y: 50 };
          return {
            id: dam.id,
            codigo: dam.code,
            nombre: dam.name,
            cuenca: 'Guadalquivir',
            provincia: dam.province || '',
            municipio: dam.municipality || '',
            rio: dam.river || '',
            x: coords.x,
            y: coords.y,
            capacidad_maxima: dam.max_capacity,
            nivel_actual: dam.current_level,
            volumen_actual: dam.current_volume,
            altura: dam.height,
          };
        });

      setDams(mapDams);
    } catch (error) {
      console.error('Error loading dams:', error);
    } finally {
      setLoading(false);
    }
  };

  const guadalquivirDams = dams.filter(dam =>
    dam.cuenca === 'Guadalquivir'
  );

  const allFilteredDams = dams.filter(dam =>
    dam.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dam.codigo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredDams = allFilteredDams;

  const handleDamClick = async (damId: string) => {
    setLocalSelectedDam(damId);
    const damData = dams.find(d => d.id === damId);
    if (damData) {
      const { data: dbDam, error } = await supabase
        .from('dams')
        .select('*')
        .eq('id', damId)
        .maybeSingle();

      if (error) {
        console.error('Error fetching dam from database:', error);
        return;
      }

      if (dbDam) {
        const dam: Dam = {
          id: dbDam.id,
          code: dbDam.code,
          name: dbDam.name,
          dam_type: dbDam.dam_type || 'Gravedad',
          province: dbDam.province,
          municipality: dbDam.municipality,
          river: dbDam.river,
          max_capacity: dbDam.max_capacity,
          capacity_hm3: dbDam.capacity_hm3 || dbDam.max_capacity,
          current_level: dbDam.current_level,
          current_volume: dbDam.current_volume,
          operational_status: dbDam.operational_status || 'operational',
          height: dbDam.height,
          coordinates: dbDam.coordinates || '',
          created_at: dbDam.created_at
        };
        selectDam(dam);
        navigate(`/dam/${dbDam.id}`);
      } else {
        console.error(`Dam with id ${damId} not found in database`);
        alert(`La presa ${damData.nombre} no está disponible en la base de datos. Por favor, contacte al administrador.`);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Cargando mapa de presas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg">
              <MapPin className="text-white" size={24} />
            </div>
            Seleccione la Presa
          </h1>
          <p className="text-slate-600 mt-1">
            Mapa interactivo de presas y embalses
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8">
          <Card className="overflow-hidden">
            <div className="p-4 border-b border-slate-200 bg-slate-50">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-slate-900 flex items-center gap-2">
                  <MapPin size={20} />
                  Cuenca del Guadalquivir
                </h2>
                <div className="flex items-center gap-2 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-blue-600 rounded-full"></div>
                    <span className="text-slate-600">Presa</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative bg-gradient-to-br from-sky-100 via-blue-50 to-cyan-50" style={{ height: '700px' }}>
              <svg
                className="absolute inset-0 w-full h-full pointer-events-none"
                viewBox="0 0 1000 800"
                preserveAspectRatio="xMidYMid meet"
              >
                <defs>
                  <linearGradient id="landGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{ stopColor: '#fef3c7', stopOpacity: 1 }} />
                    <stop offset="50%" style={{ stopColor: '#fde68a', stopOpacity: 1 }} />
                    <stop offset="100%" style={{ stopColor: '#fcd34d', stopOpacity: 1 }} />
                  </linearGradient>
                  <filter id="shadow">
                    <feDropShadow dx="2" dy="2" stdDeviation="3" floodOpacity="0.3" />
                  </filter>
                  <filter id="landShadow">
                    <feDropShadow dx="0" dy="4" stdDeviation="8" floodOpacity="0.15" />
                  </filter>
                </defs>

                {/* Mar Mediterráneo y Océano Atlántico */}
                <rect width="1000" height="800" fill="#e0f2fe" />

                {/* Andalucía - Cuenca del Guadalquivir */}
                <path
                  d="M 150,250 L 220,220 L 320,200 L 420,210 L 520,230 L 620,260 L 720,300 L 800,350 L 850,420 L 870,490 L 850,560 L 800,620 L 720,660 L 620,680 L 520,690 L 420,685 L 320,670 L 250,640 L 200,600 L 160,550 L 140,480 L 130,400 L 140,320 Z"
                  fill="url(#landGradient)"
                  stroke="#d97706"
                  strokeWidth="4"
                  filter="url(#landShadow)"
                />

                {/* Frontera con Portugal (oeste) */}
                <path
                  d="M 150,250 L 140,320 L 130,400 L 140,480 L 160,550"
                  fill="none"
                  stroke="#92400e"
                  strokeWidth="4"
                  strokeDasharray="8,6"
                  opacity="0.7"
                />

                {/* Costa Atlántica (Huelva, Cádiz) */}
                <path
                  d="M 160,550 L 180,590 L 200,620 L 230,650 L 270,675 L 310,685"
                  fill="none"
                  stroke="#1e40af"
                  strokeWidth="5"
                  opacity="0.4"
                />

                {/* Estrecho de Gibraltar */}
                <path
                  d="M 310,685 L 340,692 L 370,695 L 400,693"
                  fill="none"
                  stroke="#1e40af"
                  strokeWidth="5"
                  opacity="0.5"
                />
                <circle cx="350" cy="693" r="6" fill="#991b1b" stroke="#7f1d1d" strokeWidth="2">
                  <title>Gibraltar</title>
                </circle>

                {/* Costa Mediterránea (Málaga, Granada, Almería) */}
                <path
                  d="M 400,693 L 450,688 L 520,675 L 600,655 L 680,630 L 720,610"
                  fill="none"
                  stroke="#1e40af"
                  strokeWidth="5"
                  opacity="0.4"
                />

                {/* Frontera este con Murcia */}
                <path
                  d="M 720,610 L 760,560 L 800,500 L 820,440"
                  fill="none"
                  stroke="#92400e"
                  strokeWidth="3"
                  strokeDasharray="6,4"
                  opacity="0.5"
                />

                {/* Frontera norte con Castilla-La Mancha y Extremadura */}
                <path
                  d="M 820,440 L 840,370 L 850,300 L 840,240 L 800,200 L 750,180 L 680,170 L 600,175 L 520,190 L 440,200 L 360,205 L 280,215 L 220,220"
                  fill="none"
                  stroke="#92400e"
                  strokeWidth="3"
                  strokeDasharray="6,4"
                  opacity="0.5"
                />

                {/* Río Guadalquivir - Curso principal */}
                <path
                  d="M 750,250 Q 680,310 600,360 Q 520,400 440,430 Q 360,455 280,470 Q 230,480 190,495"
                  fill="none"
                  stroke="#2563eb"
                  strokeWidth="6"
                  opacity="0.8"
                />

                {/* Afluentes del Guadalquivir */}
                {/* Río Genil */}
                <path
                  d="M 720,580 Q 680,540 640,500 Q 600,470 560,450 L 520,440"
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="4"
                  opacity="0.6"
                />

                {/* Río Guadiana Menor */}
                <path
                  d="M 800,450 Q 760,410 720,380 Q 680,360 640,350"
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="3"
                  opacity="0.6"
                />

                {/* Río Guadalimar */}
                <path
                  d="M 780,320 Q 740,330 700,340 Q 660,350 620,360"
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="3"
                  opacity="0.6"
                />

                {/* Río Jándula */}
                <path
                  d="M 650,240 Q 620,280 590,310 L 560,330"
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="3"
                  opacity="0.6"
                />

                {/* Río Bembézar */}
                <path
                  d="M 480,290 Q 460,330 440,360 L 420,390"
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="3"
                  opacity="0.6"
                />

                {/* Sistemas montañosos */}
                {/* Sierra Morena (norte) */}
                <ellipse cx="500" cy="250" rx="180" ry="45" fill="#78350f" opacity="0.2" />
                <ellipse cx="700" cy="280" rx="120" ry="35" fill="#78350f" opacity="0.2" />

                {/* Cordillera Bética (sur) */}
                <ellipse cx="600" cy="580" rx="160" ry="50" fill="#78350f" opacity="0.25" />
                <ellipse cx="720" cy="520" rx="100" ry="40" fill="#78350f" opacity="0.25" />

                {/* Sierra Nevada */}
                <ellipse cx="680" cy="600" rx="70" ry="35" fill="#92400e" opacity="0.3" />

                {/* Etiquetas de provincias */}
                <text x="240" y="420" fill="#78350f" fontSize="32" fontWeight="bold" opacity="0.35">HUELVA</text>
                <text x="320" y="540" fill="#78350f" fontSize="32" fontWeight="bold" opacity="0.35">CÁDIZ</text>
                <text x="450" cy="490" fill="#78350f" fontSize="32" fontWeight="bold" opacity="0.35">SEVILLA</text>
                <text x="580" y="440" fill="#78350f" fontSize="32" fontWeight="bold" opacity="0.35">CÓRDOBA</text>
                <text x="700" y="400" fill="#78350f" fontSize="32" fontWeight="bold" opacity="0.35">JAÉN</text>
                <text x="550" y="620" fill="#78350f" fontSize="30" fontWeight="bold" opacity="0.35">MÁLAGA</text>
                <text x="700" y="570" fill="#78350f" fontSize="30" fontWeight="bold" opacity="0.35">GRANADA</text>
                <text x="780" y="500" fill="#78350f" fontSize="28" fontWeight="bold" opacity="0.35">ALMERÍA</text>

                {/* Etiqueta del río principal */}
                <text x="380" y="395" fill="#1e40af" fontSize="24" fontWeight="bold" opacity="0.5" transform="rotate(-8 380 395)">
                  RÍO GUADALQUIVIR
                </text>

                {/* Etiquetas sistemas montañosos */}
                <text x="420" y="265" fill="#92400e" fontSize="20" fontWeight="bold" opacity="0.4">SIERRA MORENA</text>
                <text x="560" y="595" fill="#92400e" fontSize="20" fontWeight="bold" opacity="0.4">SIERRA NEVADA</text>
              </svg>

              {guadalquivirDams.map((dam) => {
                const isHovered = hoveredDam === dam.id;
                const isSelected = localSelectedDam === dam.id;

                return (
                  <div
                    key={dam.id}
                    style={{
                      position: 'absolute',
                      left: `${dam.x}%`,
                      top: `${dam.y}%`,
                      transform: 'translate(-50%, -100%)',
                      transition: 'all 0.2s',
                      zIndex: isHovered || isSelected ? 20 : 10
                    }}
                    onMouseEnter={() => setHoveredDam(dam.id)}
                    onMouseLeave={() => setHoveredDam(null)}
                  >
                    <button
                      onClick={() => handleDamClick(dam.id)}
                      className={`relative transform transition-all ${
                        isHovered || isSelected ? 'scale-125' : 'scale-100'
                      }`}
                    >
                      <div className="relative">
                        <div className={`w-8 h-10 flex items-center justify-center transition-all ${
                          isHovered || isSelected ? 'animate-bounce' : ''
                        }`}>
                          <svg width="32" height="40" viewBox="0 0 32 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                              d="M16 0C7.163 0 0 7.163 0 16c0 8.837 16 24 16 24s16-15.163 16-24C32 7.163 24.837 0 16 0z"
                              fill="#2563eb"
                              stroke="#1e40af"
                              strokeWidth="1.5"
                            />
                            <circle cx="16" cy="16" r="6" fill="white" />
                            <Droplet
                              x="11"
                              y="11"
                              width="10"
                              height="10"
                              className="text-blue-600"
                              fill="#2563eb"
                            />
                          </svg>
                        </div>

                        {(isHovered || isSelected) && (
                          <div className="absolute left-1/2 -translate-x-1/2 top-full mt-1 whitespace-nowrap">
                            <div className="bg-white rounded-lg shadow-xl p-3 border-2 border-blue-500 min-w-[200px]">
                              <p className="text-xs font-bold text-blue-900 mb-1">
                                {dam.nombre}
                              </p>
                              <p className="text-xs text-slate-600 mb-1">
                                Código: {dam.codigo}
                              </p>
                              <p className="text-xs text-slate-600">
                                Cuenca: {dam.cuenca}
                              </p>
                              <div className="mt-2 pt-2 border-t border-slate-200">
                                <p className="text-xs text-blue-600 font-medium flex items-center gap-1">
                                  <ChevronRight size={12} />
                                  Click para seleccionar
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </button>
                  </div>
                );
              })}

              <div className="absolute bottom-4 right-4 bg-white border-2 border-slate-300 rounded-lg shadow-lg overflow-hidden">
                <div className="relative w-40 h-32 bg-gradient-to-br from-sky-100 to-cyan-100">
                  <div className="absolute top-1 left-1 text-[8px] font-bold text-slate-700 z-10">ANDALUCÍA</div>
                  <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1000 800">
                    <rect width="1000" height="800" fill="#e0f2fe" />
                    <path
                      d="M 150,250 L 220,220 L 320,200 L 420,210 L 520,230 L 620,260 L 720,300 L 800,350 L 850,420 L 870,490 L 850,560 L 800,620 L 720,660 L 620,680 L 520,690 L 420,685 L 320,670 L 250,640 L 200,600 L 160,550 L 140,480 L 130,400 L 140,320 Z"
                      fill="#fcd34d"
                      stroke="#d97706"
                      strokeWidth="4"
                    />
                    <path
                      d="M 750,250 Q 680,310 600,360 Q 520,400 440,430 Q 360,455 280,470 Q 230,480 190,495"
                      fill="none"
                      stroke="#2563eb"
                      strokeWidth="4"
                      opacity="0.8"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </Card>
        </div>

        <div className="lg:col-span-4">
          <Card className="h-full">
            <div className="p-4 border-b border-slate-200 bg-slate-50">
              <h2 className="font-semibold text-slate-900 mb-3">Lista de Presas</h2>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="text"
                  placeholder="Buscar presa..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="overflow-y-auto" style={{ maxHeight: '640px' }}>
              {filteredDams.length > 0 ? (
                <div className="divide-y divide-slate-200">
                  {filteredDams.map((dam) => (
                    <button
                      key={dam.id}
                      onClick={() => handleDamClick(dam.id)}
                      onMouseEnter={() => setHoveredDam(dam.id)}
                      onMouseLeave={() => setHoveredDam(null)}
                      className={`w-full text-left p-4 hover:bg-blue-50 transition-colors ${
                        hoveredDam === dam.id || localSelectedDam === dam.id
                          ? 'bg-blue-50 border-l-4 border-blue-600'
                          : ''
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                            <p className="font-semibold text-sm text-slate-900">
                              {dam.codigo}
                            </p>
                          </div>
                          <p className="text-xs font-medium text-slate-700 mb-1">
                            {dam.nombre}
                          </p>
                          <p className="text-xs text-slate-500">
                            {dam.cuenca}
                          </p>
                        </div>
                        <ChevronRight
                          size={16}
                          className={`text-slate-400 transition-transform ${
                            hoveredDam === dam.id ? 'translate-x-1' : ''
                          }`}
                        />
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="p-12 text-center">
                  <Search className="mx-auto text-slate-300 mb-3" size={48} />
                  <p className="text-slate-600 font-medium">No se encontraron presas</p>
                  <p className="text-sm text-slate-500 mt-1">
                    Intenta con otro término de búsqueda
                  </p>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>

      <Card className="p-6 bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200">
        <div className="flex gap-4">
          <Info className="text-blue-600 flex-shrink-0" size={24} />
          <div>
            <h3 className="font-semibold text-blue-900 mb-2">
              Mapa Interactivo de Presas
            </h3>
            <p className="text-sm text-blue-700 mb-2">
              Haz clic sobre cualquier marcador azul en el mapa o selecciona una presa de la lista lateral
              para trabajar con ella. Una vez seleccionada, podrás acceder a su ficha técnica completa y
              todos los módulos funcionales del sistema (Inventario, Mantenimiento, Auscultación, etc.).
            </p>
            <div className="flex items-center gap-4 mt-3 text-xs text-blue-600">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                <span>{guadalquivirDams.length} presas en la cuenca del Guadalquivir</span>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
