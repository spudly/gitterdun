import type {FC, ReactNode} from 'react';
import clsx from 'clsx';

export type PodiumItem = {
  id: string | number;
  rank: 1 | 2 | 3;
  content: ReactNode;
  score?: string | number;
  subtitle?: string;
};

export type PodiumProps = {
  readonly items: Array<PodiumItem>;
  readonly showMedals?: boolean;
};

const RANK_STYLES = {
  1: 'order-2 bg-yellow-500',
  2: 'order-1 bg-gray-400',
  3: 'order-3 bg-orange-500',
};

const MEDALS = {1: '🥇', 2: '🥈', 3: '🥉'};

export const Podium: FC<PodiumProps> = ({items, showMedals = true}) => {
  return (
    <div className={clsx('mb-8 grid grid-cols-1 gap-6 md:grid-cols-3')}>
      {items.slice(0, 3).map(item => (
        <div
          className={clsx(
            'text-center',
            item.rank === 1
              ? 'order-2'
              : item.rank === 2
                ? 'order-1'
                : 'order-3',
          )}
          key={item.id}
        >
          <div
            className={clsx(
              'relative mx-auto flex size-24 items-center justify-center rounded-full text-2xl font-bold text-white',
              RANK_STYLES[item.rank],
            )}
          >
            {showMedals ? MEDALS[item.rank] : item.rank}
          </div>

          <div className="mt-4">
            {item.content}

            {typeof item.score === 'number' || (typeof item.score === 'string' && item.score.length > 0) ? (
              <p className="text-gray-600">{item.score} points</p>
            ) : null}

            {typeof item.subtitle === 'string' && item.subtitle.length > 0 ? (
              <p className="text-sm text-gray-500">{item.subtitle}</p>
            ) : null}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Podium;
