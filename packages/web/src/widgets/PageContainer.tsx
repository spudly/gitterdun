import type {FC, ReactNode} from 'react';
import {clsx} from 'clsx';

type PageContainerProps = {
  readonly children: ReactNode;
  readonly variant?: 'default' | 'centered' | 'narrow' | 'wide';
  readonly gradient?: 'none' | 'indigo' | 'blue' | 'purple' | 'pink';
};

const VARIANT_STYLES = {
  default: 'min-h-screen bg-gray-50 p-6',
  centered: 'min-h-screen bg-gray-50 flex items-center justify-center p-6',
  narrow: 'min-h-screen bg-gray-50 p-6',
  wide: 'min-h-screen bg-gray-50 p-6',
};

const CONTAINER_STYLES = {
  default: 'max-w-7xl mx-auto',
  centered: 'max-w-md mx-auto',
  narrow: 'max-w-4xl mx-auto',
  wide: 'max-w-5xl mx-auto',
};

export const PageContainer: FC<PageContainerProps> = ({
  children,
  variant = 'default',
  gradient = 'none',
}) => {
  const GRADIENT_STYLES: Record<
    NonNullable<PageContainerProps['gradient']>,
    string
  > = {
    none: '',
    indigo: 'bg-gradient-to-br from-blue-50 to-indigo-100',
    blue: 'bg-gradient-to-br from-sky-50 to-blue-100',
    purple: 'bg-gradient-to-br from-violet-50 to-purple-100',
    pink: 'bg-gradient-to-br from-pink-50 to-rose-100',
  };
  return (
    <div className={clsx(VARIANT_STYLES[variant], GRADIENT_STYLES[gradient])}>
      <div className={clsx(CONTAINER_STYLES[variant], 'flex flex-col gap-2')}>
        {children}
      </div>
    </div>
  );
};
