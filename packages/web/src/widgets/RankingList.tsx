import type {FC, ReactNode} from 'react';
import clsx from 'clsx';

export type RankingItem = {
  id: string | number;
  rank: number;
  content: ReactNode;
  score?: string | number;
  subtitle?: ReactNode;
  metadata?: ReactNode;
};

export type RankingListProps = {
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
        'bg-white rounded-lg shadow',
        outlined ? OUTLINE_CLASSES[outlineColor] : null,
      )}
    >
      {title != null || subtitle != null ? (
        <div className="px-6 py-4 border-b border-gray-200">
          {title != null ? (
            <h2 className="text-lg font-medium text-gray-900">{title}</h2>
          ) : null}

          {subtitle != null ? (
            <p className="text-sm text-gray-500">{subtitle}</p>
          ) : null}
        </div>
      ) : null}

      <div className="divide-y divide-gray-200">
        {items.map(item => (
          <div className="px-6 py-4" key={item.id}>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                {showRank ? (
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-sm font-medium text-gray-700 mr-4">
                    {item.rank}
                  </div>
                ) : null}

                <div>
                  {item.content}

                  {item.subtitle != null ? (
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      {item.subtitle}
                    </div>
                  ) : null}
                </div>
              </div>

              <div className="text-right">
                {item.score != null ? (
                  <p className="text-lg font-semibold text-gray-900">
                    {item.score}
                  </p>
                ) : null}

                {item.metadata != null ? (
                  <div className="text-sm text-gray-500">{item.metadata}</div>
                ) : null}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RankingList;
