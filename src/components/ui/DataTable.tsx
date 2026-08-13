import type { ReactNode } from 'react';
import { EmptyState } from './layout';

export interface Column<T> {
  key: string;
  header: ReactNode;
  render?: (row: T, index: number) => ReactNode;
  className?: string;
  headerClassName?: string;
}

export function DataTable<T extends Record<string, any>>({
  columns,
  rows,
  emptyMessage = 'No data found',
  headerVariant = 'gray',
  className = '',
}: {
  columns: Column<T>[];
  rows: T[];
  emptyMessage?: string;
  headerVariant?: 'gray' | 'blue';
  className?: string;
}) {
  const headerBg = headerVariant === 'blue' ? 'bg-brand-blue text-white' : 'bg-[#F4F5F7] text-[#374151]';
  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className="w-full border-collapse min-w-full">
        <thead>
          <tr>
            {columns.map((c) => (
              <th key={c.key} className={`text-[11px] font-semibold px-3 py-2 text-left border border-[#E1E4E8] whitespace-nowrap ${headerBg} ${c.headerClassName ?? ''}`}>
                {c.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="border border-[#E1E4E8]">
                <EmptyState message={emptyMessage} />
              </td>
            </tr>
          ) : (
            rows.map((row, i) => (
              <tr key={i} className="hover:bg-[#FAFAFA]">
                {columns.map((c) => (
                  <td key={c.key} className={`text-[11px] text-ink px-3 py-2 border border-[#E1E4E8] whitespace-nowrap ${c.className ?? ''}`}>
                    {c.render ? c.render(row, i) : (row[c.key] as ReactNode)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
