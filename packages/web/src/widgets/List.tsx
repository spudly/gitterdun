import {FC, ReactNode} from 'react';

export interface ListProps {
  children: ReactNode;
  className?: string;
}

export const List: FC<ListProps> = ({children, className = ''}) => {
  return (
    <div className={`bg-white rounded shadow ${className}`}>
      <div className="divide-y divide-gray-200">{children}</div>
    </div>
  );
};

export default List;
