import type {FC, PropsWithChildren} from 'react';

export const InlineMeta: FC<PropsWithChildren> = ({children}) => {
  return (
    <div className="flex items-center space-x-4 text-sm text-gray-500">
      {children}
    </div>
  );
};
