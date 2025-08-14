import {FC, ReactNode} from 'react';
import clsx from 'clsx';

type Indent = 'sm' | 'md' | 'lg';
type Density = 'tight' | 'normal';

const INDENT: Record<Indent, string> = {sm: 'ml-4', md: 'ml-6', lg: 'ml-8'};

const DENSITY: Record<Density, string> = {
  tight: 'space-y-1',
  normal: 'space-y-2',
};

export const getIndentClass = (indent?: Indent): string => {
  switch (indent) {
    case 'sm':
      return INDENT.sm;
    case 'md':
      return INDENT.md;
    case 'lg':
      return INDENT.lg;
    default:
      return INDENT.md;
  }
};

export const getDensityClass = (density?: Density): string => {
  switch (density) {
    case 'tight':
      return DENSITY.tight;
    case 'normal':
      return DENSITY.normal;
    default:
      return DENSITY.tight;
  }
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
  const indentClass = getIndentClass(indent);
  const densityClass = getDensityClass(density);
  return (
    <ul className={clsx('list-disc', indentClass, densityClass)}>{children}</ul>
  );
};

export default BulletList;
