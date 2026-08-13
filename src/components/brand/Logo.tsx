import { Link } from 'react-router-dom';

const SIZES = {
  sm: 'h-7 w-24',
  md: 'h-9 w-28',
  lg: 'h-11 w-32',
} as const;

/** Brand mark slot — intentionally empty (no logo asset). */
export function VisagoLogo({
  className = '',
  size = 'md',
  to = '/home',
}: {
  className?: string;
  size?: keyof typeof SIZES;
  to?: string;
  variant?: 'color' | 'white';
}) {
  return (
    <Link
      to={to}
      aria-label="Visago home"
      className={`inline-block ${SIZES[size]} ${className}`}
    />
  );
}

/** Brand mark slot — intentionally empty (no logo asset). */
export function VisagoLogoMark({
  className = '',
  size = 'md',
}: {
  className?: string;
  size?: keyof typeof SIZES;
  variant?: 'color' | 'white';
}) {
  return (
    <span
      aria-hidden
      className={`inline-block ${SIZES[size]} ${className}`}
    />
  );
}
