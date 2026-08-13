import { Link } from 'react-router-dom';

const SIZES = {
  sm: 'h-7',
  md: 'h-9',
  lg: 'h-11',
} as const;

export function DuVisasLogo({
  className = '',
  size = 'md',
  to = '/home',
  variant = 'color',
}: {
  className?: string;
  size?: keyof typeof SIZES;
  to?: string;
  variant?: 'color' | 'white';
}) {
  const src = variant === 'white' ? '/du-visas-logo-white.png' : '/du-visas-logo.png';

  return (
    <Link to={to} className={`inline-flex items-center ${className}`}>
      <img
        src={src}
        alt="DU Visas"
        className={`${SIZES[size]} w-auto object-contain`}
      />
    </Link>
  );
}

export function DuVisasLogoMark({
  className = '',
  size = 'md',
  variant = 'white',
}: {
  className?: string;
  size?: keyof typeof SIZES;
  variant?: 'color' | 'white';
}) {
  const src = variant === 'white' ? '/du-visas-logo-white.png' : '/du-visas-logo.png';

  return (
    <img
      src={src}
      alt="DU Visas"
      className={`${SIZES[size]} w-auto object-contain ${className}`}
    />
  );
}
