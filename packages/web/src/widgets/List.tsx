import type {FC, ReactNode} from 'react';
import clsx from 'clsx';

export type ListProps = {readonly children: ReactNode; readonly className?: string};

export const List: FC<ListProps> = ({children, className = ''}) => {
  return (
    <div className={clsx('bg-white rounded shadow', className)}>
      <div className="divide-y divide-gray-200">{children}</div>
    </div>
  );
};

export default List;
