import type {FC, ReactNode} from 'react';
import {clsx} from 'clsx';

type PageHeaderProps = {
  readonly title: ReactNode;
  readonly subtitle?: ReactNode | ReadonlyArray<ReactNode>;
  readonly actions?: ReactNode | ReadonlyArray<ReactNode>;
  readonly className?: string;
};

export const PageHeader: FC<PageHeaderProps> = ({
  title,
  subtitle,
  actions,
  className = '',
}) => {
  const subtitleItems: ReadonlyArray<ReactNode> =
    subtitle === null || subtitle === undefined
      ? []
      : Array.isArray(subtitle)
        ? subtitle
        : [subtitle];
  const actionItems: ReadonlyArray<ReactNode> =
    actions === null || actions === undefined
      ? []
      : Array.isArray(actions)
        ? actions
        : [actions];
  const hasSubtitle = subtitleItems.length > 0;
  const hasActions = actionItems.length > 0;

  return (
    <div className={clsx('mb-8', className)}>
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold text-gray-900">{title}</h1>

          {hasSubtitle ? (
            subtitleItems.length > 1 ? (
              <div className="flex gap-2 text-gray-600">{subtitleItems}</div>
            ) : (
              <p className="text-gray-600">{subtitleItems[0]}</p>
            )
          ) : null}
        </div>

        {hasActions ? (
          <div className="flex items-center gap-2">{actionItems}</div>
        ) : null}
      </div>
    </div>
  );
};
