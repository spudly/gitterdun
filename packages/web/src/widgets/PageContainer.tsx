import {FC, ReactNode} from 'react';
import clsx from 'clsx';

export interface PageContainerProps {
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'centered' | 'narrow' | 'wide';
}

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
  className = '',
  variant = 'default',
}) => {
  return (
    <div className={clsx(VARIANT_STYLES[variant], className)}>
      <div className={CONTAINER_STYLES[variant]}>{children}</div>
    </div>
  );
};

export default PageContainer;
