import {FC, ReactNode} from 'react';
import clsx from 'clsx';

type Indent = 'sm' | 'md' | 'lg';
type Density = 'tight' | 'normal';

const INDENT: Record<Indent, string> = {sm: 'ml-4', md: 'ml-6', lg: 'ml-8'};

const DENSITY: Record<Density, string> = {
  tight: 'space-y-1',
  normal: 'space-y-2',
};

export interface BulletListProps {
  children: ReactNode;
  indent?: Indent;
  density?: Density;
}

export const BulletList: FC<BulletListProps> = ({
  children,
  indent = 'md',
  density = 'tight',
}) => {
  return (
    <ul className={clsx('list-disc', INDENT[indent], DENSITY[density])}>
      {children}
    </ul>
  );
};

export default BulletList;
