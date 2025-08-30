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
  const hasSubtitle =
    subtitle !== null
    && subtitle !== undefined
    && (!Array.isArray(subtitle) || subtitle.length > 0);
  const hasActions =
    actions !== null
    && actions !== undefined
    && (!Array.isArray(actions) || actions.length > 0);

  return (
    <div className={clsx('mb-8', className)}>
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold text-gray-900">{title}</h1>

          {hasSubtitle ? (
            Array.isArray(subtitle) ? (
              <div className="flex gap-2 text-gray-600">{subtitle}</div>
            ) : (
              <p className="text-gray-600">{subtitle}</p>
            )
          ) : null}
        </div>

        {hasActions ? (
          <div className="flex items-center gap-2">
            {Array.isArray(actions) ? actions : actions}
          </div>
        ) : null}
      </div>
    </div>
  );
};
