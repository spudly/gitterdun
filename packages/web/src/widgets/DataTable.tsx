import {ReactNode} from 'react';
import clsx from 'clsx';

export interface Column<T> {
  key: string;
  header: string;
  render?: (item: T, index: number) => ReactNode;
  className?: string;
}

export interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  className?: string;
  emptyMessage?: string;
  loading?: boolean;
  onRowClick?: (item: T, index: number) => void;
  rowClassName?: (item: T, index: number) => string;
}

export const DataTable = <T extends Record<string, any>>({
  data,
  columns,
  className = '',
  emptyMessage = 'No data available',
  loading = false,
  onRowClick,
  rowClassName,
}: DataTableProps<T>) => {
  if (loading) {
    return (
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <div className="px-4 py-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto" />
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <div className="px-4 py-8 text-center">
          <p className="text-gray-500">{emptyMessage}</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={clsx(
        'bg-white shadow overflow-hidden sm:rounded-md',
        className,
      )}
    >
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map(column => (
              <th
                key={column.key}
                className={clsx(
                  'px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider',
                  column.className,
                )}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((item, index) => (
            <tr
              key={
                typeof item === 'object' && item !== null && 'id' in item
                  ? (item as any).id
                  : `row-${index}`
              }
              className={clsx(
                onRowClick && 'cursor-pointer hover:bg-gray-50',
                rowClassName && rowClassName(item, index),
              )}
              onClick={() => onRowClick?.(item, index)}
            >
              {columns.map(column => (
                <td
                  key={`${column.key}-${typeof item === 'object' && item !== null && 'id' in item ? (item as any).id : index}`}
                  className={clsx(
                    'px-6 py-4 whitespace-nowrap text-sm text-gray-900',
                    column.className,
                  )}
                >
                  {column.render
                    ? column.render(item, index)
                    : item[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
