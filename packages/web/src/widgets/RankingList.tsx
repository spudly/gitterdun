import type {FC, ReactNode} from 'react';
import {clsx} from 'clsx';

export type RankingItem = {
  id: string | number;
  rank: number;
  content: ReactNode;
  score?: string | number;
  subtitle?: ReactNode;
  metadata?: ReactNode;
};

type RankingListProps = {
  readonly items: Array<RankingItem>;
  readonly title?: string;
  readonly subtitle?: string;
  readonly showRank?: boolean;
  readonly outlined?: boolean;
  readonly outlineColor?:
    | 'gray'
    | 'blue'
    | 'indigo'
    | 'red'
    | 'green'
    | 'yellow';
};

export const RankingList: FC<RankingListProps> = ({
  items,
  title,
  subtitle,
  showRank = true,
  outlined = false,
  outlineColor = 'gray',
}) => {
  const OUTLINE_CLASSES: Record<
    NonNullable<RankingListProps['outlineColor']>,
    string
  > = {
    gray: 'border-2 border-gray-200',
    blue: 'border-2 border-blue-200',
    indigo: 'border-2 border-indigo-200',
    red: 'border-2 border-red-200',
    green: 'border-2 border-green-200',
    yellow: 'border-2 border-yellow-200',
  };
  return (
    <div
      className={clsx(
        'rounded-lg bg-white shadow',
        outlined ? OUTLINE_CLASSES[outlineColor] : null,
      )}
    >
      {(typeof title === 'string' && title.length > 0)
      || (typeof subtitle === 'string' && subtitle.length > 0) ? (
        <div className="border-b border-gray-200 px-6 py-4">
          {typeof title === 'string' && title.length > 0 ? (
            <h2 className="text-lg font-medium text-gray-900">{title}</h2>
          ) : null}

          {typeof subtitle === 'string' && subtitle.length > 0 ? (
            <p className="text-sm text-gray-500">{subtitle}</p>
          ) : null}
        </div>
      ) : null}

      <div className="divide-y divide-gray-200">
        {items.map(item => (
          <div className="px-6 py-4" key={item.id}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {showRank ? (
                  <div className="flex size-8 items-center justify-center rounded-full bg-gray-100 text-sm font-medium text-gray-700">
                    {item.rank}
                  </div>
                ) : null}

                <div>
                  {item.content}

                  {item.subtitle === undefined ? null : (
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      {item.subtitle}
                    </div>
                  )}
                </div>
              </div>

              <div className="text-right">
                {item.score === undefined ? null : (
                  <p className="text-lg font-semibold text-gray-900">
                    {item.score}
                  </p>
                )}

                {item.metadata === undefined ? null : (
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
