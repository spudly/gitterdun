import {FC, ReactNode} from 'react';
import clsx from 'clsx';

export interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  children?: ReactNode;
  className?: string;
  variant?: 'default' | 'large' | 'compact';
}

const VARIANT_STYLES = {
  default: 'text-lg font-semibold mb-3',
  large: 'text-xl font-semibold mb-4',
  compact: 'text-base font-semibold mb-2',
};

export const SectionHeader: FC<SectionHeaderProps> = ({
  title,
  subtitle,
  children,
  className = '',
  variant = 'default',
}) => {
  const baseStyles = clsx(VARIANT_STYLES[variant], 'text-gray-900', className);

  return (
    <div className="flex items-center justify-between">
      <div>
        <h3 className={baseStyles}>{title}</h3>
        {subtitle && <p className="text-sm text-gray-600">{subtitle}</p>}
      </div>
      {children && <div className="flex items-center gap-2">{children}</div>}
    </div>
  );
};

export default SectionHeader;
