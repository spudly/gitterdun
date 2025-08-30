import type {FC, ReactNode} from 'react';
import {clsx} from 'clsx';

type SectionHeaderProps = {
  readonly title: string;
  readonly subtitle?: string;
  readonly children?: ReactNode;
  readonly variant?: 'default' | 'large' | 'compact';
  readonly tone?:
    | 'default'
    | 'blue'
    | 'indigo'
    | 'red'
    | 'green'
    | 'yellow'
    | 'gray';
};

const VARIANT_STYLES = {
  default: 'text-lg font-semibold',
  large: 'text-xl font-semibold',
  compact: 'text-base font-semibold',
};

export const SectionHeader: FC<SectionHeaderProps> = ({
  title,
  subtitle,
  children,
  variant = 'default',
  tone = 'default',
}) => {
  const TONE_STYLES: Record<NonNullable<SectionHeaderProps['tone']>, string> = {
    default: 'text-gray-900',
    blue: 'text-blue-600',
    indigo: 'text-indigo-600',
    red: 'text-red-600',
    green: 'text-green-600',
    yellow: 'text-yellow-600',
    gray: 'text-gray-700',
  };
  const baseStyles = clsx(VARIANT_STYLES[variant], TONE_STYLES[tone]);

  return (
    <div className="flex items-center justify-between">
      <div>
        <h3 className={baseStyles}>{title}</h3>

        {typeof subtitle === 'string' && subtitle.length > 0 ? (
          <p className="text-sm text-gray-600">{subtitle}</p>
        ) : null}
      </div>

      {children != null ? (
        <div className="flex items-center gap-2">{children}</div>
      ) : null}
    </div>
  );
};
