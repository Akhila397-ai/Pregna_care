import React from 'react';
import { TableProps } from './Table.types';

export const Table = <T extends object>({
  columns,
  data,
  keyExtractor,
  loading = false,
  emptyMessage = 'No data found.',
  emptyIcon,
  pagination,
  className = '',
  onRowClick,
}: TableProps<T>): React.ReactElement => {
  const getRowKey = (row: T, index: number): string => {
    if (keyExtractor) return keyExtractor(row, index);
    const item = row as Record<string, unknown>;
    if (typeof item._id === 'string') return item._id;
    if (typeof item.id === 'string') return item.id;
    return `row-${index}`;
  };

  return (
    <div
      className={`w-full bg-[var(--bg-card)] rounded-2xl shadow-xs border border-[var(--border-primary)] overflow-hidden transition-colors duration-200 ${className}`}
    >
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-[var(--bg-muted)]/70 border-b border-[var(--border-primary)]">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`px-6 py-3.5 text-[11px] font-semibold text-[var(--text-secondary)] uppercase tracking-wider ${
                    col.headerClassName || ''
                  }`}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border-subtle)]">
            {loading ? (
              Array.from({ length: 5 }).map((_, rIdx) => (
                <tr key={`skeleton-${rIdx}`} className="animate-pulse">
                  {columns.map((_, cIdx) => (
                    <td key={`skeleton-cell-${rIdx}-${cIdx}`} className="px-6 py-4">
                      <div className="h-4 bg-[var(--bg-muted)] rounded-md w-3/4" />
                    </td>
                  ))}
                </tr>
              ))
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-6 py-16 text-center">
                  <div className="flex flex-col items-center justify-center gap-2.5 max-w-sm mx-auto">
                    {emptyIcon || (
                      <div className="w-12 h-12 rounded-2xl bg-[var(--bg-muted)] border border-[var(--border-primary)] flex items-center justify-center text-[var(--text-muted)]">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.75}
                            d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                          />
                        </svg>
                      </div>
                    )}
                    <p className="text-sm font-semibold text-[var(--text-primary)]">{emptyMessage}</p>
                    <p className="text-xs text-[var(--text-muted)]">There are no records matching your current filter criteria.</p>
                  </div>
                </td>
              </tr>
            ) : (
              data.map((row, index) => {
                const rowKey = getRowKey(row, index);
                return (
                  <tr
                    key={rowKey}
                    onClick={() => onRowClick?.(row)}
                    className={`transition-colors duration-150 ${
                      onRowClick ? 'cursor-pointer hover:bg-[var(--brand-light)]' : 'hover:bg-[var(--bg-hover)]'
                    }`}
                  >
                    {columns.map((col) => {
                      const item = row as Record<string, unknown>;
                      return (
                        <td
                          key={`${rowKey}-${col.key}`}
                          className={`px-6 py-4 text-sm text-[var(--text-primary)] ${col.className || ''}`}
                        >
                          {col.render
                            ? col.render(row, index)
                            : col.accessor
                            ? String(item[col.accessor as string] ?? '—')
                            : '—'}
                        </td>
                      );
                    })}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 bg-[var(--bg-muted)]/30 border-t border-[var(--border-primary)]">
          <span className="text-xs text-[var(--text-secondary)]">
            Showing Page <strong className="text-[var(--text-primary)] font-semibold">{pagination.currentPage}</strong> of{' '}
            <strong className="text-[var(--text-primary)] font-semibold">{pagination.totalPages}</strong>
            {pagination.totalItems !== undefined && ` (${pagination.totalItems} total items)`}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => pagination.onPageChange(pagination.currentPage - 1)}
              disabled={pagination.currentPage <= 1 || loading}
              className="px-3.5 py-1.5 rounded-xl border border-[var(--border-primary)] bg-[var(--bg-card)] text-xs font-semibold text-[var(--text-primary)]
                hover:bg-[var(--bg-hover)] disabled:opacity-40 disabled:cursor-not-allowed transition shadow-2xs"
            >
              ← Previous
            </button>
            <button
              onClick={() => pagination.onPageChange(pagination.currentPage + 1)}
              disabled={pagination.currentPage >= pagination.totalPages || loading}
              className="px-3.5 py-1.5 rounded-xl border border-[var(--border-primary)] bg-[var(--bg-card)] text-xs font-semibold text-[var(--text-primary)]
                hover:bg-[var(--bg-hover)] disabled:opacity-40 disabled:cursor-not-allowed transition shadow-2xs"
            >
              Next →
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
