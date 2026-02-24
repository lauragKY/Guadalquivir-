export function MinisterioLogo({ className = "", height = 50 }: { className?: string; height?: number }) {
  return (
    <svg
      viewBox="0 0 575 85"
      height={height}
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Gobierno de España - Ministerio para la Transición Ecológica y el Reto Demográfico"
    >
      {/* Fondo amarillo */}
      <rect width="575" height="85" fill="#F9E547" />

      {/* Bandera de España - lado izquierdo */}
      <g>
        {/* Franja azul con estrellas de la UE */}
        <rect x="0" y="0" width="28" height="85" fill="#003399" />

        {/* Estrellas de la UE (simplificadas) */}
        <circle cx="14" cy="12" r="1.5" fill="#FFCC00" />
        <circle cx="14" cy="22" r="1.5" fill="#FFCC00" />
        <circle cx="14" cy="32" r="1.5" fill="#FFCC00" />
        <circle cx="14" cy="42" r="1.5" fill="#FFCC00" />
        <circle cx="14" cy="52" r="1.5" fill="#FFCC00" />
        <circle cx="14" cy="62" r="1.5" fill="#FFCC00" />
        <circle cx="14" cy="72" r="1.5" fill="#FFCC00" />

        {/* Franja roja superior */}
        <rect x="28" y="0" width="18" height="21.25" fill="#C8102E" />

        {/* Franja amarilla media */}
        <rect x="28" y="21.25" width="18" height="42.5" fill="#FFD700" />

        {/* Franja roja inferior */}
        <rect x="28" y="63.75" width="18" height="21.25" fill="#C8102E" />
      </g>

      {/* Escudo de España (simplificado) */}
      <g transform="translate(80, 15)">
        {/* Corona */}
        <path d="M 0,0 L 3,5 L 6,3 L 9,5 L 12,0" fill="#FFD700" stroke="#C8102E" strokeWidth="0.5" />

        {/* Escudo principal */}
        <rect x="-2" y="5" width="16" height="20" rx="2" fill="#C8102E" stroke="#FFD700" strokeWidth="1" />

        {/* Castillo (simplificado) */}
        <rect x="2" y="10" width="3" height="3" fill="#FFD700" />
        <rect x="9" y="10" width="3" height="3" fill="#FFD700" />

        {/* León (simplificado) */}
        <circle cx="6" cy="18" r="2" fill="#FFD700" />

        {/* Columnas de Hércules */}
        <rect x="-4" y="12" width="2" height="10" fill="#C8102E" />
        <rect x="14" y="12" width="2" height="10" fill="#C8102E" />
      </g>

      {/* Separador vertical */}
      <line x1="268" y1="10" x2="268" y2="75" stroke="#8B7355" strokeWidth="1.5" />

      {/* Texto GOBIERNO DE ESPAÑA */}
      <text x="170" y="32" fontFamily="Arial, sans-serif" fontSize="16" fontWeight="bold" fill="#000000">
        GOBIERNO
      </text>
      <text x="170" y="52" fontFamily="Arial, sans-serif" fontSize="16" fontWeight="bold" fill="#000000">
        DE ESPAÑA
      </text>

      {/* Texto MINISTERIO */}
      <text x="285" y="24" fontFamily="Arial, sans-serif" fontSize="13" fontWeight="600" fill="#000000">
        MINISTERIO
      </text>
      <text x="285" y="40" fontFamily="Arial, sans-serif" fontSize="13" fontWeight="600" fill="#000000">
        PARA LA TRANSICIÓN ECOLÓGICA
      </text>
      <text x="285" y="56" fontFamily="Arial, sans-serif" fontSize="13" fontWeight="600" fill="#000000">
        Y EL RETO DEMOGRÁFICO
      </text>
    </svg>
  );
}
