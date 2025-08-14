import {FC, ReactNode} from 'react';
import clsx from 'clsx';

export interface GridContainerProps {
  children: ReactNode;
  cols?: 1 | 2 | 3 | 4 | 5 | 6;
  gap?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const GAP_STYLES = {sm: 'gap-2', md: 'gap-4', lg: 'gap-6', xl: 'gap-8'};

const GRID_STYLES = {
  1: 'grid-cols-1',
  2: 'grid-cols-1 md:grid-cols-2',
  3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
  4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  5: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5',
  6: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6',
};

export const GridContainer: FC<GridContainerProps> = ({
  children,
  cols = 2,
  gap = 'md',
  className = '',
}) => {
  const baseStyles = clsx(
    'grid',
    GRID_STYLES[cols],
    GAP_STYLES[gap],
    className,
  );

  return <div className={baseStyles}>{children}</div>;
};

export default GridContainer;
