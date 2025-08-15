import type {FC, ReactNode} from 'react';
import clsx from 'clsx';

export type StackGap = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

const GAP_MAP: Record<StackGap, string> = {
  xs: 'space-y-1',
  sm: 'space-y-2',
  md: 'space-y-4',
  lg: 'space-y-6',
  xl: 'space-y-8',
};

export type StackProps = {readonly children: ReactNode; readonly gap?: StackGap};

export const Stack: FC<StackProps> = ({children, gap = 'md'}) => {
  return <div className={clsx(GAP_MAP[gap])}>{children}</div>;
};

export default Stack;
