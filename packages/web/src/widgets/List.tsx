import type {FC, ReactNode} from 'react';
import clsx from 'clsx';

type ListProps = {
  readonly children: ReactNode | ReadonlyArray<ReactNode>;
  readonly className?: string;
};

export const List: FC<ListProps> = ({children, className = ''}) => {
  return (
    <div className={clsx('rounded bg-white shadow', className)}>
      <div className="divide-y divide-gray-200">
        {Array.isArray(children) ? children : children}
      </div>
    </div>
  );
};
