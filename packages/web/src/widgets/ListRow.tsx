import type {FC, ReactNode} from 'react';
import clsx from 'clsx';

export type ListRowProps = {
  readonly left?: ReactNode;
  readonly title: ReactNode;
  readonly titleRight?: ReactNode;
  readonly description?: ReactNode;
  readonly meta?: ReactNode;
  readonly right?: ReactNode;
  readonly className?: string;
};

export const ListRow: FC<ListRowProps> = ({
  left,
  title,
  titleRight,
  description,
  meta,
  right,
  className = '',
}) => {
  const hasLeft = left !== null && left !== undefined;
  const hasDescription = description !== null && description !== undefined;
  const hasMeta = meta !== null && meta !== undefined;

  return (
    <div className={clsx('px-6 py-4', className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          {hasLeft ? <div className="mr-3">{left}</div> : null}

          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-medium text-gray-900">{title}</h3>

              {titleRight}
            </div>

            {hasDescription ? (
              <p className="mt-1 text-sm text-gray-500">{description}</p>
            ) : null}

            {hasMeta ? (
              <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                {meta}
              </div>
            ) : null}
          </div>
        </div>

        <div className="flex items-center gap-2">{right}</div>
      </div>
    </div>
  );
};

export default ListRow;
