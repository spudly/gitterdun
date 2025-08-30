import type {FC, ReactNode} from 'react';
import {clsx} from 'clsx';

type FormSectionProps = {
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
    <div className={clsx(baseStyles, 'flex flex-col gap-3')}>
      {typeof title === 'string' && title.length > 0 ? (
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      ) : null}

      {children}
    </div>
  );
};
