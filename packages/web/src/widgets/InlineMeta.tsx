import type {FC, ReactNode} from 'react';

type InlineMetaProps = {readonly children: ReactNode};

export const InlineMeta: FC<InlineMetaProps> = ({children}) => {
  return (
    <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
      {children}
    </div>
  );
};

export default InlineMeta;
