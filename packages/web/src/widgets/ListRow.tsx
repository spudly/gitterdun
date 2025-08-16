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
  return (
    <div className={clsx('px-6 py-4', className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          {left ? <div className="mr-3">{left}</div> : null}

          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-medium text-gray-900">{title}</h3>

              {titleRight}
            </div>

            {description ? (
              <p className="mt-1 text-sm text-gray-500">{description}</p>
            ) : null}

            {meta ? (
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
