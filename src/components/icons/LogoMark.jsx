export default function LogoMark({ size = 32, dark = false }) {
  const fill = dark ? '#FFFFFF' : '#0B0B0C';
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="30" width="10" height="6" rx="1" fill={fill} />
      <rect x="15" y="22" width="10" height="6" rx="1" fill="#FFC700" />
      <rect x="28" y="30" width="10" height="6" rx="1" fill={fill} />
      <rect x="15" y="8" width="10" height="12" rx="1" fill={fill} />
    </svg>
  );
}
