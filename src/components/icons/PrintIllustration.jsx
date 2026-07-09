export default function PrintIllustration() {
  return (
    <svg viewBox="0 0 420 420" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Illustration of a 3D printer nozzle depositing layers to build an object">
      <rect x="0" y="0" width="420" height="420" fill="none" />

      {/* gantry rail */}
      <rect x="40" y="40" width="340" height="6" rx="3" fill="#0B0B0C" />
      <rect x="40" y="40" width="340" height="6" rx="3" fill="#0B0B0C" opacity="0.08" />

      {/* nozzle carriage */}
      <g className="pi-nozzle">
        <rect x="188" y="46" width="44" height="26" rx="4" fill="#0B0B0C" />
        <polygon points="204,72 216,72 210,96" fill="#0B0B0C" />
        <circle cx="210" cy="98" r="3" fill="#FFC700" />
      </g>

      {/* build plate */}
      <rect x="70" y="330" width="280" height="10" rx="2" fill="#0B0B0C" />

      {/* stacked layers forming a vase-like object, printed bottom to top */}
      <g className="pi-layers">
        <rect x="170" y="316" width="80" height="14" rx="2" fill="#FFC700" />
        <rect x="160" y="300" width="100" height="14" rx="2" fill="#0B0B0C" />
        <rect x="152" y="284" width="116" height="14" rx="2" fill="#FFC700" />
        <rect x="148" y="268" width="124" height="14" rx="2" fill="#0B0B0C" />
        <rect x="150" y="252" width="120" height="14" rx="2" fill="#FFC700" />
        <rect x="158" y="236" width="104" height="14" rx="2" fill="#0B0B0C" />
        <rect x="168" y="220" width="84" height="14" rx="2" fill="#FFC700" />
        <rect x="182" y="204" width="56" height="14" rx="2" fill="#0B0B0C" />
        <rect x="190" y="188" width="40" height="14" rx="2" fill="#FFC700" opacity="0.85" />
      </g>

      {/* dimension marks */}
      <line x1="60" y1="330" x2="60" y2="188" stroke="#0B0B0C" strokeOpacity="0.15" strokeWidth="1.5" strokeDasharray="3 4" />
      <text x="30" y="260" fontFamily="JetBrains Mono, monospace" fontSize="11" fill="#6B6B65" transform="rotate(-90 30 260)">142.00mm</text>
    </svg>
  );
}
