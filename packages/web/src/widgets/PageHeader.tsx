import type {FC, ReactNode} from 'react';
import clsx from 'clsx';

export type PageHeaderProps = {
  readonly title: ReactNode;
  readonly subtitle?: ReactNode;
  readonly actions?: ReactNode;
  readonly className?: string;
};

export const PageHeader: FC<PageHeaderProps> = ({
  title,
  subtitle,
  actions,
  className = '',
}) => {
  return (
    <div className={clsx('mb-8', className)}>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{title}</h1>

          {subtitle ?  (
            <p className="mt-1 text-gray-600">{subtitle}</p>
          ) : null}
        </div>

        {actions ?  (
          <div className="flex items-center gap-2">{actions}</div>
        ) : null}
      </div>
    </div>
  );
};

export default PageHeader;
