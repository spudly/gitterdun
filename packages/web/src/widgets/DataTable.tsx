import type {ReactNode} from 'react';
import {FormattedMessage} from 'react-intl';
import clsx from 'clsx';
import {isReactNode} from '../utils/isReactNode';

export type Column<T> = {
  key: string;
  header: string;
  render?: (item: T, index: number) => ReactNode;
  align?: 'left' | 'center' | 'right';
};

type DataTableProps<T> = {
  readonly data: Array<T>;
  readonly columns: Array<Column<T>>;
  readonly emptyMessage?: string;
  readonly loading?: boolean;
  readonly onRowClick?: (item: T, index: number) => void;
  readonly rowVariant?: 'default' | 'hoverable';
};

const get = <OBJ extends object, PROP extends string | number | symbol>(
  obj: OBJ,
  prop: PROP,
): PROP extends keyof OBJ ? OBJ[PROP] : undefined => {
  if (prop in obj) {
    // @ts-expect-error: prop may not be a key of obj, so we allow undefined
    return obj[prop]; // eslint-disable-line @typescript-eslint/no-unsafe-return -- not unsafe
  }

  // @ts-expect-error: ts just isn't smart enough to understand my syntax, or I'm not smart enough to write it correctly, lol
  return undefined;
};

const isObjectWithId = (item: unknown): item is {id: string | number} => {
  return (
    typeof item === 'object'
    && item !== null
    && 'id' in item
    && ['string', 'number'].includes(typeof item.id)
  );
};

export const DataTable = <T extends object>({
  data,
  columns,
  emptyMessage = 'No data available',
  loading = false,
  onRowClick,
  rowVariant = 'hoverable',
}: DataTableProps<T>) => {
  if (loading) {
    return (
      <div className="overflow-hidden bg-white shadow sm:rounded-md">
        <div className="px-4 py-8 text-center">
          <div className="mx-auto size-8 animate-spin rounded-full border-b-2 border-indigo-600" />

          <p className="mt-2 text-gray-600">
            <FormattedMessage
              defaultMessage="Loading..."
              id="datatable.loading"
            />
          </p>
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="overflow-hidden bg-white shadow sm:rounded-md">
        <div className="px-4 py-8 text-center">
          <p className="text-gray-500">{emptyMessage}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={clsx('overflow-hidden bg-white shadow sm:rounded-md')}>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map(column => (
              <th
                className={clsx(
                  'px-6 py-3 text-xs font-medium uppercase tracking-wider text-gray-500',
                  {
                    left: 'text-left',
                    center: 'text-center',
                    right: 'text-right',
                  }[column.align ?? 'left'],
                )}
                key={column.key}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-200 bg-white">
          {data.map((item, index) => (
            <tr
              className={clsx(
                onRowClick && 'cursor-pointer',
                rowVariant === 'hoverable' && 'hover:bg-gray-50',
              )}
              key={isObjectWithId(item) ? item.id : `row-${index}`}
              onClick={() => onRowClick?.(item, index)}
            >
              {columns.map(column => {
                const columnValue = get(item, column.key);
                return (
                  <td
                    className={clsx(
                      'whitespace-nowrap px-6 py-4 text-sm text-gray-900',
                      {
                        left: 'text-left',
                        center: 'text-center',
                        right: 'text-right',
                      }[column.align ?? 'left'],
                    )}
                    key={`${column.key}-${isObjectWithId(item) ? item.id : index}`}
                  >
                    {column.render
                      ? column.render(item, index)
                      : isReactNode(columnValue)
                        ? columnValue
                        : null}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
