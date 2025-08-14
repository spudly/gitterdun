import {FC, ReactNode} from 'react';

export interface ToolbarProps {
  children: ReactNode;
}

export const Toolbar: FC<ToolbarProps> = ({children}) => {
  return <div className="flex gap-2 items-center">{children}</div>;
};

export default Toolbar;
