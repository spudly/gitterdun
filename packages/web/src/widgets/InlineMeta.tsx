import type {FC, PropsWithChildren} from 'react';

export const InlineMeta: FC<PropsWithChildren> = ({children}) => {
  return (
    <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
      {children}
    </div>
  );
};
