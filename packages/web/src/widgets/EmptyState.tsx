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
  return (
    <div className={clsx('text-center py-12', className)}>
      {icon != null ? <div className="text-gray-400 mb-4">{icon}</div> : null}

      <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>

      {description != null ? (
        <p className="text-gray-500 mb-4">{description}</p>
      ) : null}

      {action}
    </div>
  );
};

export default EmptyState;
