import type { ReactNode } from 'react';
import { Inbox } from 'lucide-react';

/* ---------- PageContainer ---------- */
export function PageContainer({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`w-full mx-auto max-w-content px-[5%] py-5 ${className}`}>{children}</div>
  );
}

/* ---------- PageCard ---------- */
export function PageCard({
  children,
  className = '',
  title,
  icon,
  headerStrip = 'gray',
  actions,
}: {
  children: ReactNode;
  className?: string;
  title?: ReactNode;
  icon?: ReactNode;
  headerStrip?: 'gray' | 'blue';
  actions?: ReactNode;
}) {
  const strip =
    headerStrip === 'blue'
      ? 'bg-gradient-to-r from-brand-blue to-brand-dark'
      : 'bg-[#6B747D]';
  return (
    <div className={`vb-card overflow-hidden ${className}`}>
      {title && (
        <div className={`flex items-center justify-between px-4 py-2.5 text-white ${strip}`}>
          <h3 className="text-[13px] font-semibold flex items-center gap-2">
            {icon}
            {title}
          </h3>
          {actions}
        </div>
      )}
      {children}
    </div>
  );
}

/* ---------- SectionHeader ---------- */
export function SectionHeader({
  title,
  icon,
  className = '',
}: {
  title: string;
  icon?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`flex items-center gap-2 px-4 py-2 rounded-t-[12px] bg-gradient-to-r from-brand-light to-blue-100 border border-[#E0E0E0] border-b-0 text-[13px] font-semibold text-[#3B3F45] ${className}`}
    >
      {icon}
      {title}
    </div>
  );
}

/* ---------- EmptyState ---------- */
export function EmptyState({
  message = 'No data found',
  icon,
  className = '',
}: {
  message?: string;
  icon?: ReactNode;
  className?: string;
}) {
  return (
    <div className={`flex flex-col items-center justify-center gap-2 py-10 text-sub ${className}`}>
      <Inbox className="w-8 h-8 text-gray-300" />
      {icon}
      <p className="text-[12px]">{message}</p>
    </div>
  );
}

/* ---------- CardBody padding helper ---------- */
export function CardBody({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`p-4 ${className}`}>{children}</div>;
}
