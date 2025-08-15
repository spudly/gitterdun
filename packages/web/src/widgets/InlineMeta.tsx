import type {FC, ReactNode} from 'react';

export type InlineMetaProps = {readonly children: ReactNode};

export const InlineMeta: FC<InlineMetaProps> = ({children}) => {
  return (
    <div className="flex items-center mt-2 space-x-4 text-sm text-gray-500">
      {children}
    </div>
  );
};

export default InlineMeta;
