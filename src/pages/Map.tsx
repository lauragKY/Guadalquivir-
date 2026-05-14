import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Search, Info, ChevronRight, Layers, X } from 'lucide-react';
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
  capacidad_maxima?: number;
  nivel_actual?: number;
  volumen_actual?: number;
  altura?: number;
  operational_status?: string;
}

// X,Y en % sobre el contenedor del mapa (viewBox 1000x680)
const damCoordinates: Record<string, { x: number; y: number }> = {
  'GQ-001': { x: 56, y: 66 },  // Iznájar — S Córdoba/N Granada
  'GQ-002': { x: 80, y: 28 },  // Tranco de Beas — NE Jaén
  'GQ-003': { x: 55, y: 44 },  // Guadalmellato — Córdoba
  'GQ-004': { x: 74, y: 37 },  // Doña Aldonza — Jaén
  'GQ-005': { x: 61, y: 32 },  // Jándula — N Jaén
  'GQ-006': { x: 77, y: 60 },  // Negratín — NE Granada
  'GQ-007': { x: 44, y: 35 },  // Puente Nuevo — NO Córdoba
  'GQ-008': { x: 38, y: 46 },  // Breña II — O Córdoba
  'GQ-009': { x: 34, y: 51 },  // Bembézar — O Córdoba
  'GQ-010': { x: 51, y: 41 },  // Encinarejo — Córdoba
  'GQ-011': { x: 54, y: 70 },  // Benamejí — S Córdoba
  'GQ-012': { x: 65, y: 74 },  // Bermejales — O Granada
  'GQ-013': { x: 66, y: 82 },  // Rules — S Granada
  'GQ-014': { x: 75, y: 65 },  // Quéntar — Granada capital
  'GQ-015': { x: 68, y: 57 },  // Colomera — N Granada
  'GQ-016': { x: 83, y: 36 },  // Pedro Marín — SE Jaén
  'GQ-017': { x: 67, y: 38 },  // Guadalén — Jaén
  'GQ-018': { x: 73, y: 30 },  // Giribaile — N Jaén
  'GQ-019': { x: 47, y: 54 },  // Malpasillo — SE Sevilla
  'GQ-020': { x: 32, y: 42 },  // El Pintado — N Sevilla
};

const statusColors: Record<string, { fill: string; stroke: string; label: string }> = {
  operational: { fill: '#2563eb', stroke: '#1e40af', label: 'Operacional' },
  maintenance:  { fill: '#d97706', stroke: '#92400e', label: 'Mantenimiento' },
  alert:        { fill: '#dc2626', stroke: '#991b1b', label: 'Alerta' },
  emergency:    { fill: '#7f1d1d', stroke: '#450a0a', label: 'Emergencia' },
};

// Path de Andalucía — coordenadas reales, sentido horario, sin bucles.
// Truco para evitar el bucle de las marismas del Guadalquivir:
// el lado oeste va por tierra (interior) desde Sanlúcar hasta Portugal,
// sin seguir los meandros costeros de Huelva.
const ANDALUCIA =
  'M 77,0 '    + // Sierra Aracena — pico norte (-7.07°,38.73°)
  'L 173,20 '  + // Extremadura W (-6.50,38.65)
  'L 259,56 '  + // Extremadura E (-6.00,38.50)
  'L 344,81 '  + // N Sevilla (-5.50,38.40)
  'L 429,110 ' + // N Córdoba (-5.00,38.28)
  'L 514,135 ' + // N Córdoba-Jaén (-4.50,38.18)
  'L 599,149 ' + // N Jaén (-4.00,38.12)
  'L 684,169 ' + // N Jaén E (-3.50,38.04)
  'L 769,188 ' + // N Jaén-CastillaMancha (-3.00,37.96)
  'L 845,218 ' + // NE Jaén-Murcia (-2.55,37.84)
  'L 879,252 ' + // Frontera Murcia S (-2.35,37.70)
  'L 918,301 ' + // Murcia SE (-2.12,37.50)
  'L 956,355 ' + // Murcia-Almería (-1.90,37.28)
  'L 990,399 ' + // Almería NE (-1.70,37.10)
  'L 964,453 ' + // Costa Almería SE (-1.85,36.88)
  'L 918,501 ' + // Almería sur (-2.12,36.68)
  'L 845,516 ' + // Almería-Granada (-2.55,36.62)
  'L 786,472 ' + // Costa Granada (-2.90,36.80)
  'L 701,453 ' + // Motril (-3.40,36.88)
  'L 616,472 ' + // Granada-Málaga (-3.90,36.80)
  'L 548,492 ' + // Costa Málaga E (-4.30,36.72)
  'L 463,509 ' + // Málaga ciudad (-4.80,36.65)
  'L 412,533 ' + // Málaga O (-5.10,36.55)
  'L 369,575 ' + // Estepona (-5.35,36.38)
  'L 335,648 ' + // Algeciras (-5.55,36.08)
  'L 306,668 ' + // Tarifa — extremo S (-5.72,36.00)
  'L 259,638 ' + // Costa atlántica (-6.00,36.12)
  'L 233,582 ' + // Cádiz S (-6.15,36.35)
  'L 207,516 ' + // Cádiz (-6.30,36.62)
  'L 190,453 ' + // Cádiz N (-6.40,36.88)
  'L 187,394 ' + // Sanlúcar (-6.42,37.12)
  'L 204,338 ' + // Sanlúcar N (-6.35,37.35)
  // Desde aquí va por tierra interior hacia Portugal (evita las marismas)
  'L 156,296 ' + // Huelva interior W (-6.62,37.62)
  'L 122,237 ' + // Huelva N (-6.80,38.00)
  'L 88,166 '  + // Portugal S (-7.00,38.35)
  'L 51,93 '   + // Portugal N (-7.22,38.56)
  'L 77,0 Z';    // cierre

export default function Map() {
  const [localSelectedDam, setLocalSelectedDam] = useState<string | null>(null);
  const [hoveredDam, setHoveredDam] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [dams, setDams] = useState<MapDam[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterProvincia, setFilterProvincia] = useState<string>('');
  const navigate = useNavigate();
  const { selectDam } = useDamSelection();

  useEffect(() => { loadDams(); }, []);

  const loadDams = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.from('dams').select('*').order('code');
      if (error) throw error;

      const mapDams: MapDam[] = (data || [])
        .filter(d => d.code.startsWith('GQ-'))
        .map(d => {
          const coords = damCoordinates[d.code] || { x: 50, y: 50 };
          return {
            id: d.id,
            codigo: d.code,
            nombre: d.name,
            cuenca: 'Guadalquivir',
            provincia: d.province || '',
            municipio: d.municipality || '',
            rio: d.river || '',
            x: coords.x,
            y: coords.y,
            capacidad_maxima: d.max_capacity,
            nivel_actual: d.current_level,
            volumen_actual: d.current_volume,
            altura: d.height,
            operational_status: d.operational_status,
          };
        });

      setDams(mapDams);
    } catch (err) {
      console.error('Error loading dams:', err);
    } finally {
      setLoading(false);
    }
  };

  const provincias = Array.from(new Set(dams.map(d => d.provincia))).sort();

  const filteredDams = dams.filter(d => {
    const q = searchTerm.toLowerCase();
    const matchSearch = !q || d.nombre.toLowerCase().includes(q) || d.codigo.toLowerCase().includes(q) || d.rio.toLowerCase().includes(q);
    const matchProv = !filterProvincia || d.provincia === filterProvincia;
    return matchSearch && matchProv;
  });

  const handleDamClick = async (damId: string) => {
    setLocalSelectedDam(damId);
    const { data: dbDam, error } = await supabase.from('dams').select('*').eq('id', damId).maybeSingle();
    if (error || !dbDam) { console.error('Error fetching dam:', error); return; }
    const dam: Dam = {
      id: dbDam.id, code: dbDam.code, name: dbDam.name,
      dam_type: dbDam.dam_type || 'Gravedad',
      province: dbDam.province, municipality: dbDam.municipality,
      river: dbDam.river, max_capacity: dbDam.max_capacity,
      capacity_hm3: dbDam.capacity_hm3 || dbDam.max_capacity,
      current_level: dbDam.current_level, current_volume: dbDam.current_volume,
      operational_status: dbDam.operational_status || 'operational',
      height: dbDam.height, coordinates: dbDam.coordinates || '',
      created_at: dbDam.created_at,
    };
    selectDam(dam);
    navigate(`/dam/${dbDam.id}`);
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
      <div>
        <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg">
            <MapPin className="text-white" size={24} />
          </div>
          Seleccione la Presa
        </h1>
        <p className="text-slate-600 mt-1">Cuenca Hidrográfica del Guadalquivir — {dams.length} presas</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* MAP */}
        <div className="lg:col-span-8">
          <Card className="overflow-hidden">
            <div className="p-3 border-b border-slate-200 bg-slate-50 flex items-center justify-between flex-wrap gap-2">
              <h2 className="font-semibold text-slate-900 flex items-center gap-2">
                <Layers size={17} /> Cuenca del Guadalquivir
              </h2>
              <div className="flex items-center gap-3 text-xs text-slate-600 flex-wrap">
                {Object.entries(statusColors).map(([key, val]) => (
                  <div key={key} className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: val.fill }}></div>
                    <span>{val.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative" style={{ height: '580px', backgroundColor: '#bfdbfe' }}>
              <svg
                className="absolute inset-0 w-full h-full"
                viewBox="0 0 1000 680"
                preserveAspectRatio="xMidYMid meet"
              >
                <defs>
                  <linearGradient id="landGrad" x1="0%" y1="0%" x2="70%" y2="100%">
                    <stop offset="0%" stopColor="#fef9c3" />
                    <stop offset="55%" stopColor="#fde68a" />
                    <stop offset="100%" stopColor="#fbbf24" />
                  </linearGradient>
                  <linearGradient id="sierraGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#78350f" stopOpacity="0.28" />
                    <stop offset="100%" stopColor="#fbbf24" stopOpacity="0" />
                  </linearGradient>
                  <filter id="mapShadow">
                    <feDropShadow dx="0" dy="4" stdDeviation="8" floodOpacity="0.2" />
                  </filter>
                  <clipPath id="andClip">
                    <path d={ANDALUCIA} />
                  </clipPath>
                </defs>

                {/* Fondo mar */}
                <rect width="1000" height="680" fill="#93c5fd" opacity="0.55" />

                {/* Territorio Andalucía */}
                <path d={ANDALUCIA} fill="url(#landGrad)" stroke="#b45309" strokeWidth="2.5" filter="url(#mapShadow)" />

                {/* Franja montañosa Sierra Morena (norte) — clipeada a Andalucía */}
                <path
                  clipPath="url(#andClip)"
                  d="M 85,318 C 130,252 200,210 280,188 L 444,180 L 600,186 L 734,234 L 818,340 L 790,340 C 750,310 700,290 645,278 C 590,266 530,260 468,260 C 406,260 342,266 280,278 C 218,290 162,310 120,340 Z"
                  fill="url(#sierraGrad)"
                />

                {/* Relieve Sistemas Béticos / Sierra Nevada (sur) */}
                <ellipse clipPath="url(#andClip)" cx="700" cy="462" rx="100" ry="38" fill="#78350f" opacity="0.12" />
                <ellipse clipPath="url(#andClip)" cx="700" cy="458" rx="68" ry="24" fill="#fff" opacity="0.28" />
                <text x="644" y="476" fill="#78350f" fontSize="11" fontWeight="700" opacity="0.5" transform="rotate(-5 644 476)">SIERRA NEVADA</text>

                {/* ── RÍOS ── */}
                {/* Guadalquivir principal */}
                <path
                  d="M 770,258 C 730,256 688,260 645,270 C 600,282 554,298 506,316 C 456,336 404,356 350,372 C 296,388 240,400 185,408 C 150,414 118,416 90,414"
                  fill="none" stroke="#1d4ed8" strokeWidth="5.5" opacity="0.72" strokeLinecap="round"
                />
                <text x="340" y="358" fill="#1e3a8a" fontSize="13" fontWeight="700" opacity="0.65" transform="rotate(-5 340 358)">RÍO GUADALQUIVIR</text>

                {/* Genil */}
                <path d="M 720,462 C 696,444 668,428 637,416 C 606,404 572,396 538,394 C 504,392 470,396 440,406" fill="none" stroke="#3b82f6" strokeWidth="3" opacity="0.62" strokeLinecap="round" />
                <text x="566" y="386" fill="#1d4ed8" fontSize="10" fontWeight="600" opacity="0.55" transform="rotate(-4 566 386)">R. GENIL</text>

                {/* Guadiana Menor */}
                <path d="M 818,340 C 800,322 776,308 748,298 C 720,288 690,282 658,280 C 628,278 598,282 570,290" fill="none" stroke="#60a5fa" strokeWidth="2.5" opacity="0.58" strokeLinecap="round" />

                {/* Guadalimar */}
                <path d="M 734,234 C 730,258 724,282 714,304 C 704,326 690,346 672,364 C 654,382 632,397 608,408" fill="none" stroke="#60a5fa" strokeWidth="2.5" opacity="0.58" strokeLinecap="round" />
                <text x="706" y="276" fill="#1d4ed8" fontSize="9" fontWeight="600" opacity="0.5" transform="rotate(62 706 276)">GUADALIMAR</text>

                {/* Jándula */}
                <path d="M 600,188 C 596,214 590,240 582,264 C 574,288 562,312 546,334 C 530,356 510,375 486,390" fill="none" stroke="#60a5fa" strokeWidth="2.5" opacity="0.58" strokeLinecap="round" />
                <text x="578" y="236" fill="#1d4ed8" fontSize="9" fontWeight="600" opacity="0.5" transform="rotate(74 578 236)">JÁNDULA</text>

                {/* Guadiato */}
                <path d="M 420,183 C 418,210 414,238 406,264 C 398,290 386,314 370,336 C 354,358 334,376 310,390" fill="none" stroke="#60a5fa" strokeWidth="2.5" opacity="0.58" strokeLinecap="round" />
                <text x="400" y="228" fill="#1d4ed8" fontSize="9" fontWeight="600" opacity="0.5" transform="rotate(78 400 228)">GUADIATO</text>

                {/* Bembézar */}
                <path d="M 333,186 C 330,214 325,242 317,268 C 309,294 297,318 281,340 C 265,362 245,381 222,396" fill="none" stroke="#93c5fd" strokeWidth="2" opacity="0.52" strokeLinecap="round" />

                {/* Corbones (afluente Sevilla) */}
                <path d="M 400,362 C 404,380 406,400 402,420 C 398,440 388,458 372,472" fill="none" stroke="#93c5fd" strokeWidth="2" opacity="0.5" strokeLinecap="round" />

                {/* ── FRONTERAS ── */}
                {/* Portugal (oeste) */}
                <path d="M 85,318 C 96,286 114,256 138,232 C 162,208 190,188 222,172" fill="none" stroke="#6b7280" strokeWidth="2" strokeDasharray="9,7" opacity="0.5" />

                {/* Frontera norte (Extremadura/C-La Mancha) */}
                <path d="M 222,172 L 300,186 L 370,182 L 444,180 L 518,182 L 584,188 L 642,198 L 692,214 L 734,234" fill="none" stroke="#9ca3af" strokeWidth="1.5" strokeDasharray="7,5" opacity="0.45" />

                {/* Costa sur (muy sutil) */}
                <path d="M 230,726 C 200,718 174,700 155,674 C 136,648 126,616 124,582 C 122,548 128,514 142,482 C 156,450 176,421 200,398 C 224,375 252,358 282,348" fill="none" stroke="#1e40af" strokeWidth="3.5" opacity="0.25" />

                {/* ── ETIQUETAS PROVINCIAS ── */}
                <text x="112" y="360" fill="#92400e" fontSize="17" fontWeight="800" opacity="0.28" letterSpacing="1">HUELVA</text>
                <text x="216" y="428" fill="#92400e" fontSize="17" fontWeight="800" opacity="0.28" letterSpacing="1">SEVILLA</text>
                <text x="248" y="540" fill="#92400e" fontSize="15" fontWeight="800" opacity="0.24" letterSpacing="1">CÁDIZ</text>
                <text x="398" y="398" fill="#92400e" fontSize="17" fontWeight="800" opacity="0.28" letterSpacing="1">CÓRDOBA</text>
                <text x="596" y="316" fill="#92400e" fontSize="17" fontWeight="800" opacity="0.28" letterSpacing="1">JAÉN</text>
                <text x="440" y="492" fill="#92400e" fontSize="15" fontWeight="800" opacity="0.24" letterSpacing="1">MÁLAGA</text>
                <text x="574" y="472" fill="#92400e" fontSize="16" fontWeight="800" opacity="0.26" letterSpacing="1">GRANADA</text>
                <text x="716" y="420" fill="#92400e" fontSize="14" fontWeight="800" opacity="0.22" letterSpacing="1">ALMERÍA</text>

                {/* Sierra Morena */}
                <text x="300" y="214" fill="#78350f" fontSize="12" fontWeight="700" opacity="0.42" letterSpacing="1">SIERRA MORENA</text>

                {/* ── CIUDADES ── */}
                {[
                  { cx: 248, cy: 406, name: 'Sevilla' },
                  { cx: 432, cy: 382, name: 'Córdoba' },
                  { cx: 614, cy: 302, name: 'Jaén' },
                  { cx: 464, cy: 476, name: 'Málaga' },
                  { cx: 608, cy: 452, name: 'Granada' },
                  { cx: 130, cy: 382, name: 'Huelva' },
                  { cx: 286, cy: 542, name: 'Cádiz' },
                  { cx: 748, cy: 406, name: 'Almería' },
                ].map(c => (
                  <g key={c.name}>
                    <circle cx={c.cx} cy={c.cy} r="4" fill="#374151" opacity="0.55" />
                    <text x={c.cx + 7} y={c.cy + 4} fill="#1e293b" fontSize="11" fontWeight="600" opacity="0.7">{c.name}</text>
                  </g>
                ))}

                {/* Brújula */}
                <g transform="translate(950, 42)">
                  <circle cx="0" cy="0" r="22" fill="white" opacity="0.88" stroke="#e2e8f0" strokeWidth="1.5" />
                  <text x="0" y="-7" textAnchor="middle" fill="#1e40af" fontSize="11" fontWeight="900">N</text>
                  <polygon points="0,-18 3,-5 -3,-5" fill="#1e40af" opacity="0.85" />
                  <polygon points="0,18 3,5 -3,5" fill="#94a3b8" opacity="0.5" />
                </g>
              </svg>

              {/* ── MARCADORES DE PRESAS ── */}
              {dams.map((dam) => {
                const isHovered = hoveredDam === dam.id;
                const isSelected = localSelectedDam === dam.id;
                const isFiltered = filteredDams.some(d => d.id === dam.id);
                const isDimmed = (searchTerm || filterProvincia) && !isFiltered;
                const sk = dam.operational_status || 'operational';
                const col = statusColors[sk] || statusColors.operational;

                return (
                  <div
                    key={dam.id}
                    style={{
                      position: 'absolute',
                      left: `${dam.x}%`,
                      top: `${dam.y}%`,
                      transform: `translate(-50%, -100%) scale(${isHovered || isSelected ? 1.35 : 1})`,
                      transition: 'transform 0.15s ease, opacity 0.2s',
                      zIndex: isHovered || isSelected ? 30 : 10,
                      opacity: isDimmed ? 0.25 : 1,
                    }}
                    onMouseEnter={() => setHoveredDam(dam.id)}
                    onMouseLeave={() => setHoveredDam(null)}
                  >
                    <button onClick={() => handleDamClick(dam.id)} className="focus:outline-none">
                      <svg width="28" height="36" viewBox="0 0 28 36">
                        <path
                          d="M14 0C6.268 0 0 6.268 0 14c0 7.732 14 22 14 22S28 21.732 28 14C28 6.268 21.732 0 14 0z"
                          fill={col.fill}
                          stroke={col.stroke}
                          strokeWidth="1.5"
                        />
                        <circle cx="14" cy="14" r="5.5" fill="white" opacity="0.9" />
                        <circle cx="14" cy="14" r="3" fill={col.fill} />
                      </svg>

                      {(isHovered || isSelected) && (
                        <div
                          style={{
                            position: 'absolute',
                            left: '50%',
                            top: '100%',
                            transform: 'translateX(-50%)',
                            marginTop: 4,
                            zIndex: 50,
                            pointerEvents: 'none',
                          }}
                        >
                          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 p-3 w-52">
                            <div className="flex items-start justify-between gap-2 mb-2">
                              <div>
                                <p className="text-xs font-bold text-slate-900 leading-tight">{dam.nombre}</p>
                                <p className="text-xs text-blue-600 font-semibold">{dam.codigo}</p>
                              </div>
                              <span className="text-xs px-1.5 py-0.5 rounded font-semibold whitespace-nowrap" style={{ backgroundColor: col.fill + '22', color: col.stroke }}>
                                {col.label}
                              </span>
                            </div>
                            <div className="space-y-1 text-xs">
                              <div className="flex justify-between">
                                <span className="text-slate-500">Río</span>
                                <span className="font-medium text-slate-700">{dam.rio}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-slate-500">Provincia</span>
                                <span className="font-medium text-slate-700">{dam.provincia}</span>
                              </div>
                              {dam.capacidad_maxima && (
                                <div className="flex justify-between">
                                  <span className="text-slate-500">Capacidad</span>
                                  <span className="font-medium text-slate-700">{dam.capacidad_maxima} hm³</span>
                                </div>
                              )}
                            </div>
                            <div className="mt-2 pt-2 border-t border-slate-100 flex items-center gap-1 text-xs text-blue-600 font-semibold">
                              <ChevronRight size={11} /> Haz clic para seleccionar
                            </div>
                          </div>
                        </div>
                      )}
                    </button>
                  </div>
                );
              })}

              {/* Leyenda ríos */}
              <div className="absolute bottom-3 left-3 bg-white/92 backdrop-blur-sm border border-slate-200 rounded-lg shadow p-2.5 text-xs">
                <p className="font-bold text-slate-700 mb-1.5">Ríos</p>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-1.5 rounded" style={{ backgroundColor: '#1d4ed8' }}></div>
                    <span className="text-slate-600">Guadalquivir</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-px mt-0.5" style={{ backgroundColor: '#3b82f6' }}></div>
                    <span className="text-slate-600">Afluentes</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* LISTA */}
        <div className="lg:col-span-4">
          <Card className="h-full flex flex-col">
            <div className="p-4 border-b border-slate-200 bg-slate-50 space-y-3">
              <h2 className="font-semibold text-slate-900">
                Lista de Presas
                <span className="ml-2 text-xs text-slate-500 font-normal">({filteredDams.length} / {dams.length})</span>
              </h2>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
                <input
                  type="text"
                  placeholder="Buscar presa, río..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-8 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {searchTerm && (
                  <button onClick={() => setSearchTerm('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                    <X size={13} />
                  </button>
                )}
              </div>
              <select
                value={filterProvincia}
                onChange={(e) => setFilterProvincia(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-slate-700"
              >
                <option value="">Todas las provincias</option>
                {provincias.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>

            <div className="overflow-y-auto flex-1" style={{ maxHeight: '510px' }}>
              {filteredDams.length > 0 ? (
                <div className="divide-y divide-slate-100">
                  {filteredDams.map((dam) => {
                    const sk = dam.operational_status || 'operational';
                    const col = statusColors[sk] || statusColors.operational;
                    return (
                      <button
                        key={dam.id}
                        onClick={() => handleDamClick(dam.id)}
                        onMouseEnter={() => setHoveredDam(dam.id)}
                        onMouseLeave={() => setHoveredDam(null)}
                        className={`w-full text-left px-4 py-3 hover:bg-blue-50 transition-colors ${
                          hoveredDam === dam.id || localSelectedDam === dam.id
                            ? 'bg-blue-50 border-l-4 border-blue-600'
                            : 'border-l-4 border-transparent'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-0.5">
                              <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: col.fill }}></div>
                              <p className="font-bold text-xs text-slate-500">{dam.codigo}</p>
                            </div>
                            <p className="text-sm font-semibold text-slate-800 truncate">{dam.nombre}</p>
                            <p className="text-xs text-slate-500 truncate">{dam.rio} · {dam.provincia}</p>
                          </div>
                          <div className="flex flex-col items-end gap-1 flex-shrink-0">
                            {dam.capacidad_maxima && (
                              <span className="text-xs font-semibold text-slate-600 whitespace-nowrap">{dam.capacidad_maxima} hm³</span>
                            )}
                            <ChevronRight size={14} className={`text-slate-400 transition-transform ${hoveredDam === dam.id ? 'translate-x-1' : ''}`} />
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="p-10 text-center">
                  <Search className="mx-auto text-slate-300 mb-3" size={38} />
                  <p className="text-slate-600 font-medium text-sm">No se encontraron presas</p>
                  <button onClick={() => { setSearchTerm(''); setFilterProvincia(''); }} className="mt-2 text-xs text-blue-600 hover:underline">
                    Limpiar filtros
                  </button>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>

      <Card className="p-5 bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200">
        <div className="flex gap-4 items-start">
          <Info className="text-blue-600 flex-shrink-0 mt-0.5" size={20} />
          <div>
            <h3 className="font-semibold text-blue-900 mb-1 text-sm">Mapa Interactivo — Cuenca del Guadalquivir</h3>
            <p className="text-xs text-blue-700">
              Haz clic sobre cualquier marcador en el mapa o selecciona una presa de la lista para acceder a su ficha técnica y todos los módulos del sistema.
            </p>
            <div className="flex flex-wrap gap-4 mt-3">
              {Object.entries(statusColors).map(([key, val]) => (
                <div key={key} className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: val.fill }}></div>
                  <span className="text-xs text-blue-800">{val.label}: {dams.filter(d => d.operational_status === key).length}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
