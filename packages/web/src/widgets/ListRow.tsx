import {FC, ReactNode} from 'react';

export interface ListRowProps {
  left?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  right?: ReactNode;
  className?: string;
}

export const ListRow: FC<ListRowProps> = ({
  left,
  title,
  description,
  right,
  className = '',
}) => {
  return (
    <div className={`px-6 py-4 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          {left && <div className="mr-3">{left}</div>}
          <div>
            <h3 className="text-sm font-medium text-gray-900">{title}</h3>
            {description && (
              <p className="text-sm text-gray-500 mt-1">{description}</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">{right}</div>
      </div>
    </div>
  );
};

export default ListRow;
