import {FC, ReactNode} from 'react';
import clsx from 'clsx';

export interface FormSectionProps {
  title?: string;
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'compact' | 'spacious';
}

const VARIANT_STYLES = {
  default: 'p-4 bg-white rounded shadow',
  compact: 'p-3 bg-white rounded shadow',
  spacious: 'p-6 bg-white rounded shadow',
};

export const FormSection: FC<FormSectionProps> = ({
  title,
  children,
  className = '',
  variant = 'default',
}) => {
  const baseStyles = clsx(VARIANT_STYLES[variant], className);

  return (
    <div className={baseStyles}>
      {title && (
        <h3 className="text-lg font-semibold mb-3 text-gray-900">{title}</h3>
      )}
      {children}
    </div>
  );
};

export default FormSection;
