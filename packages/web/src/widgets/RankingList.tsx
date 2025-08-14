import {FC, ReactNode} from 'react';
import clsx from 'clsx';

export interface RankingItem {
  id: string | number;
  rank: number;
  content: ReactNode;
  score?: string | number;
  subtitle?: ReactNode;
  metadata?: ReactNode;
}

export interface RankingListProps {
  items: RankingItem[];
  title?: string;
  subtitle?: string;
  className?: string;
  showRank?: boolean;
}

export const RankingList: FC<RankingListProps> = ({
  items,
  title,
  subtitle,
  className = '',
  showRank = true,
}) => {
  return (
    <div className={clsx('bg-white rounded-lg shadow', className)}>
      {(title || subtitle) && (
        <div className="px-6 py-4 border-b border-gray-200">
          {title && (
            <h2 className="text-lg font-medium text-gray-900">{title}</h2>
          )}
          {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
        </div>
      )}
      <div className="divide-y divide-gray-200">
        {items.map(item => (
          <div key={item.id} className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                {showRank && (
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-sm font-medium text-gray-700 mr-4">
                    {item.rank}
                  </div>
                )}
                <div>
                  {item.content}
                  {item.subtitle && (
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      {item.subtitle}
                    </div>
                  )}
                </div>
              </div>
              <div className="text-right">
                {item.score && (
                  <p className="text-lg font-semibold text-gray-900">
                    {item.score}
                  </p>
                )}
                {item.metadata && (
                  <div className="text-sm text-gray-500">{item.metadata}</div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RankingList;
