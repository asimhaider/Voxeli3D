const stroke = '#0B0B0C';

export function StemIcon() {
  return (
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
      <circle cx="18" cy="18" r="4" fill="#FFC700" />
      <ellipse cx="18" cy="18" rx="15" ry="6" stroke={stroke} strokeWidth="1.6" />
      <ellipse cx="18" cy="18" rx="15" ry="6" stroke={stroke} strokeWidth="1.6" transform="rotate(60 18 18)" />
      <ellipse cx="18" cy="18" rx="15" ry="6" stroke={stroke} strokeWidth="1.6" transform="rotate(120 18 18)" />
    </svg>
  );
}

export function IndustrialIcon() {
  return (
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
      <path d="M6 30V18l7 4v-4l7 4v-4l7 4v8H6z" stroke={stroke} strokeWidth="1.6" strokeLinejoin="round" />
      <circle cx="26" cy="10" r="5" stroke={stroke} strokeWidth="1.6" />
      <path d="M26 6.5V4M26 16v-2.5M22.5 10H20M32 10h-2.5" stroke="#FFC700" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

export function PrototypeIcon() {
  return (
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
      <path d="M18 5 30 12v12L18 31 6 24V12z" stroke={stroke} strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M18 5v13M18 18 6 12M18 18l12-6M18 18v13" stroke={stroke} strokeWidth="1.2" opacity="0.4" />
      <circle cx="18" cy="18" r="3.2" fill="#FFC700" />
    </svg>
  );
}

export function DevotionalIcon() {
  return (
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
      <path d="M18 6c3 4 6 8 6 13a6 6 0 1 1-12 0c0-5 3-9 6-13Z" stroke={stroke} strokeWidth="1.6" strokeLinejoin="round" />
      <circle cx="18" cy="19" r="2" fill="#FFC700" />
      <path d="M9 30h18" stroke={stroke} strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}
