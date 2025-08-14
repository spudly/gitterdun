import {FC, ReactNode} from 'react';
import clsx from 'clsx';

export interface PodiumItem {
  id: string | number;
  rank: number;
  content: ReactNode;
  score?: string | number;
  subtitle?: string;
}

export interface PodiumProps {
  items: PodiumItem[];
  className?: string;
  showMedals?: boolean;
}

const RANK_STYLES = {
  1: 'order-2 bg-yellow-500',
  2: 'order-1 bg-gray-400',
  3: 'order-3 bg-orange-500',
};

const MEDALS = {1: '🥇', 2: '🥈', 3: '🥉'};

export const Podium: FC<PodiumProps> = ({
  items,
  className = '',
  showMedals = true,
}) => {
  return (
    <div
      className={clsx('grid grid-cols-1 md:grid-cols-3 gap-6 mb-8', className)}
    >
      {items.slice(0, 3).map(item => (
        <div
          key={item.id}
          className={clsx(
            'text-center',
            item.rank === 1
              ? 'order-2'
              : item.rank === 2
                ? 'order-1'
                : 'order-3',
          )}
        >
          <div
            className={clsx(
              'relative mx-auto w-24 h-24 rounded-full flex items-center justify-center text-2xl font-bold text-white',
              RANK_STYLES[item.rank as keyof typeof RANK_STYLES],
            )}
          >
            {showMedals ? MEDALS[item.rank as keyof typeof MEDALS] : item.rank}
          </div>
          <div className="mt-4">
            {item.content}
            {item.score && <p className="text-gray-600">{item.score} points</p>}
            {item.subtitle && (
              <p className="text-sm text-gray-500">{item.subtitle}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Podium;
