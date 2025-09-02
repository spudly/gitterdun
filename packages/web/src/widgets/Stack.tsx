import type {FC, ReactNode} from 'react';
import {clsx} from 'clsx';

type StackGap = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

const GAP_MAP: Record<StackGap, string> = {
  xs: 'gap-1',
  sm: 'gap-2',
  md: 'gap-4',
  lg: 'gap-6',
  xl: 'gap-8',
};

type StackProps = {readonly children: ReactNode; readonly gap?: StackGap};

export const getGapClass = (gap: StackGap = 'md'): string => {
  switch (gap) {
    case 'xs':
      return GAP_MAP.xs;
    case 'sm':
      return GAP_MAP.sm;
    case 'lg':
      return GAP_MAP.lg;
    case 'xl':
      return GAP_MAP.xl;
    case 'md':
    default:
      return GAP_MAP.md;
  }
};

export const Stack: FC<StackProps> = ({children, gap = 'md'}) => {
  return (
    <div className={clsx('flex flex-col', getGapClass(gap))}>{children}</div>
  );
};
