import type {FC, ReactNode} from 'react';
import clsx from 'clsx';

export type FormSectionProps = {
  readonly title?: string;
  readonly children: ReactNode;
  readonly variant?: 'default' | 'compact' | 'spacious';
};

const VARIANT_STYLES = {
  default: 'p-4 bg-white rounded shadow',
  compact: 'p-3 bg-white rounded shadow',
  spacious: 'p-6 bg-white rounded shadow',
};

export const FormSection: FC<FormSectionProps> = ({
  title,
  children,
  variant = 'default',
}) => {
  const baseStyles = clsx(VARIANT_STYLES[variant]);

  return (
    <div className={baseStyles}>
      {title ? (
        <h3 className="mb-3 text-lg font-semibold text-gray-900">{title}</h3>
      ) : null}

      {children}
    </div>
  );
};

export default FormSection;
