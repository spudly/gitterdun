import {FC, ReactNode} from 'react';

export interface ListRowProps {
  left?: ReactNode;
  title: ReactNode;
  titleRight?: ReactNode;
  description?: ReactNode;
  meta?: ReactNode;
  right?: ReactNode;
  className?: string;
}

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
    <div className={`px-6 py-4 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          {left && <div className="mr-3">{left}</div>}
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-medium text-gray-900">{title}</h3>
              {titleRight}
            </div>
            {description && (
              <p className="text-sm text-gray-500 mt-1">{description}</p>
            )}
            {meta && (
              <div className="flex items-center mt-2 space-x-4 text-sm text-gray-500">
                {meta}
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">{right}</div>
      </div>
    </div>
  );
};

export default ListRow;
