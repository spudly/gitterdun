import type {FC, ReactNode} from 'react';
import {FormattedMessage} from 'react-intl';
import {clsx} from 'clsx';
import {GOLD_RANK, SILVER_RANK, BRONZE_RANK, RANKS} from '../constants';

export type PodiumItem = {
  id: string | number;
  rank: typeof GOLD_RANK | typeof SILVER_RANK | typeof BRONZE_RANK;
  content: ReactNode;
  score?: string | number;
  subtitle?: string;
};

type PodiumProps = {
  readonly items: Array<PodiumItem>;
  readonly showMedals?: boolean;
};

const RANK_STYLES = {
  [GOLD_RANK]: 'order-2 bg-yellow-500',
  [SILVER_RANK]: 'order-1 bg-gray-400',
  [BRONZE_RANK]: 'order-3 bg-orange-500',
};

const MEDALS = {[GOLD_RANK]: '🥇', [SILVER_RANK]: '🥈', [BRONZE_RANK]: '🥉'};

export const Podium: FC<PodiumProps> = ({items, showMedals = true}) => {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
      {items.slice(0, RANKS.length).map(item => (
        <div
          className={clsx(
            'flex flex-col items-center gap-4',
            item.rank === GOLD_RANK
              ? 'order-2'
              : item.rank === SILVER_RANK
                ? 'order-1'
                : 'order-3',
          )}
          key={item.id}
        >
          <div
            className={clsx(
              'relative flex size-24 items-center justify-center rounded-full text-2xl font-bold text-white',
              RANK_STYLES[item.rank],
            )}
          >
            {showMedals ? MEDALS[item.rank] : item.rank}
          </div>

          <div className="text-center">
            {item.content}

            {typeof item.score === 'number'
            || (typeof item.score === 'string' && item.score.length > 0) ? (
              <p className="text-gray-600">
                <FormattedMessage
                  defaultMessage="{score} points"
                  id="podium.points"
                  values={{score: item.score}}
                />
              </p>
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
