import type {FC, ReactNode} from 'react';
import {clsx} from 'clsx';

type StackGap = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

const GAP_MAP: Record<StackGap, string> = {
  xs: 'space-y-1',
  sm: 'space-y-2',
  md: 'space-y-4',
  lg: 'space-y-6',
  xl: 'space-y-8',
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
  return <div className={clsx(getGapClass(gap))}>{children}</div>;
};
