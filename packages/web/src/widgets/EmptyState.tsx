import type {FC, ReactNode} from 'react';
import clsx from 'clsx';

export type EmptyStateProps = {
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
    <div className={clsx('py-12 text-center', className)}>
      {hasIcon ? <div className="mb-4 text-gray-400">{icon}</div> : null}

      <h3 className="mb-2 text-lg font-medium text-gray-900">{title}</h3>

      {hasDescription ? (
        <p className="mb-4 text-gray-500">{description}</p>
      ) : null}

      {action}
    </div>
  );
};

export default EmptyState;
