import type {FC, ReactNode} from 'react';
import clsx from 'clsx';

type EmptyStateProps = {
  readonly icon?: ReactNode;
  readonly title: ReactNode;
  readonly description?: ReactNode;
  readonly action?: ReactNode;
  readonly className?: string;
};

export const EmptyState: FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
  className = '',
}) => {
  const hasIcon = icon !== null && icon !== undefined;
  const hasDescription = description !== null && description !== undefined;

  return (
    <div className={clsx('flex flex-col items-center gap-4 py-12', className)}>
      {hasIcon ? <div className="text-gray-400">{icon}</div> : null}

      <div className="flex flex-col items-center gap-2">
        <h3 className="text-lg font-medium text-gray-900">{title}</h3>

        {hasDescription ? <p className="text-gray-500">{description}</p> : null}
      </div>

      {action}
    </div>
  );
};
