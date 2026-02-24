export function SipresasLogo({
  className = "",
  size = 40,
  showText = true,
  textColor = "auto"
}: {
  className?: string;
  size?: number;
  showText?: boolean;
  textColor?: "white" | "dark" | "auto";
}) {
  return (
    <div className={`flex flex-col items-center ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 120 120"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="SIPRESAS Logo"
      >
        <defs>
          <radialGradient id="outerRing" cx="50%" cy="50%">
            <stop offset="0%" stopColor="#7dc8f0" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#4db8e8" stopOpacity="0.6" />
          </radialGradient>

          <radialGradient id="middleRing" cx="50%" cy="50%">
            <stop offset="0%" stopColor="#3ba9dd" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#2b8fc9" stopOpacity="0.95" />
          </radialGradient>

          <radialGradient id="innerRing" cx="50%" cy="50%">
            <stop offset="0%" stopColor="#1d6fa8" />
            <stop offset="100%" stopColor="#0f5280" />
          </radialGradient>

          <radialGradient id="centerCircle" cx="50%" cy="40%">
            <stop offset="0%" stopColor="#2b8fc9" />
            <stop offset="60%" stopColor="#1d6fa8" />
            <stop offset="100%" stopColor="#0d4470" />
          </radialGradient>
        </defs>

        {/* Anillo exterior - azul muy claro */}
        <circle
          cx="60"
          cy="60"
          r="56"
          fill="url(#outerRing)"
        />

        {/* Espacio blanco/transparente */}
        <circle
          cx="60"
          cy="60"
          r="48"
          fill="white"
          fillOpacity="0.95"
        />

        {/* Anillo medio - azul medio */}
        <circle
          cx="60"
          cy="60"
          r="45"
          fill="url(#middleRing)"
        />

        {/* Espacio blanco/transparente */}
        <circle
          cx="60"
          cy="60"
          r="35"
          fill="white"
          fillOpacity="0.98"
        />

        {/* Anillo interior - azul oscuro */}
        <circle
          cx="60"
          cy="60"
          r="32"
          fill="url(#innerRing)"
        />

        {/* Espacio blanco/transparente muy sutil */}
        <circle
          cx="60"
          cy="60"
          r="20"
          fill="white"
          fillOpacity="0.15"
        />

        {/* Centro - círculo sólido azul oscuro con gradiente */}
        <circle
          cx="60"
          cy="60"
          r="18"
          fill="url(#centerCircle)"
        />

        {/* Efecto de brillo en el centro */}
        <ellipse
          cx="60"
          cy="54"
          rx="8"
          ry="6"
          fill="white"
          opacity="0.35"
        />
      </svg>

      {/* Texto SIPRESAS */}
      {showText && (
        <span
          className={`mt-1.5 text-xs font-bold tracking-wider ${
            textColor === 'white'
              ? 'text-white'
              : textColor === 'dark'
              ? 'text-gray-600'
              : 'text-gray-600'
          }`}
          style={{
            letterSpacing: '0.2em',
            fontFamily: 'system-ui, -apple-system, sans-serif'
          }}
        >
          SIPRESAS
        </span>
      )}
    </div>
  );
}
