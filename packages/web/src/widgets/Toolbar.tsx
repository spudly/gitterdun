import type {FC, ReactNode} from 'react';

type ToolbarProps = {readonly children: ReactNode};

export const Toolbar: FC<ToolbarProps> = ({children}) => {
  return <div className="flex items-center gap-2">{children}</div>;
};

export default Toolbar;
