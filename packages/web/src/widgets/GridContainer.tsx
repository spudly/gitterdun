import type {FC, ReactNode} from 'react';
import {clsx} from 'clsx';

type GridCols = 1 | 2 | 3 | 4 | 5 | 6;

type GridContainerProps = {
  readonly children: ReactNode;
  readonly cols?: GridCols;
  readonly gap?: 'sm' | 'md' | 'lg' | 'xl';
};

const GAP_STYLES = {sm: 'gap-2', md: 'gap-4', lg: 'gap-6', xl: 'gap-8'};

const GRID_COLS_1 = 'grid-cols-1';
const GRID_COLS_2 = 'md:grid-cols-2';
const GRID_COLS_3 = 'lg:grid-cols-3';
const GRID_COLS_4 = 'lg:grid-cols-4';
const GRID_COLS_5 = 'xl:grid-cols-5';
const GRID_COLS_6 = 'xl:grid-cols-6';

const GRID_STYLES: Record<GridCols, string> = {
  1: GRID_COLS_1,
  2: `${GRID_COLS_1} ${GRID_COLS_2}`,
  3: `${GRID_COLS_1} ${GRID_COLS_2} ${GRID_COLS_3}`,
  4: `${GRID_COLS_1} ${GRID_COLS_2} ${GRID_COLS_4}`,
  5: `${GRID_COLS_1} ${GRID_COLS_2} ${GRID_COLS_3} ${GRID_COLS_5}`,
  6: `${GRID_COLS_1} ${GRID_COLS_2} ${GRID_COLS_3} ${GRID_COLS_6}`,
} as const;

export const GridContainer: FC<GridContainerProps> = ({
  children,
  cols = 2,
  gap = 'md',
}) => {
  const baseStyles = clsx('grid', GRID_STYLES[cols], GAP_STYLES[gap]);

  return <div className={baseStyles}>{children}</div>;
};
