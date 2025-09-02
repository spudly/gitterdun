import type {FC} from 'react';
import {FormattedMessage} from 'react-intl';
import {clsx} from 'clsx';

type ProgressBarProps = {
  readonly value: number;
  readonly max: number;
  readonly size?: 'sm' | 'md' | 'lg';
  readonly variant?: 'default' | 'success' | 'warning' | 'danger';
  readonly showLabel?: boolean;
  readonly showPercentage?: boolean;
  readonly padded?: boolean; // adds outer spacing if true
};

const SIZE_STYLES = {sm: 'h-1', md: 'h-2', lg: 'h-3'};

const VARIANT_STYLES = {
  default: 'bg-blue-600',
  success: 'bg-green-600',
  warning: 'bg-yellow-600',
  danger: 'bg-red-600',
};

export const ProgressBar: FC<ProgressBarProps> = ({
  value,
  max,
  size = 'md',
  variant = 'default',
  showLabel = false,
  showPercentage = false,
  padded = false,
}) => {
  const PERCENT_MAX = 100;
  const percentage = Math.min((value / max) * PERCENT_MAX, PERCENT_MAX);

  return (
    <div className={clsx('space-y-2', padded ? 'p-4' : null)}>
      {showLabel || showPercentage ? (
        <div className="flex justify-between text-sm">
          {showLabel ? (
            <span className="text-gray-500">
              <FormattedMessage defaultMessage="Progress" id="progress.label" />
            </span>
          ) : null}

          {showPercentage ? (
            <span className="font-medium">{Math.round(percentage)}%</span>
          ) : null}
        </div>
      ) : null}

      <progress
        className={clsx(
          'w-full appearance-none overflow-hidden rounded-full',
          SIZE_STYLES[size],
          // Progress element styling
          '[&::-webkit-progress-bar]:rounded-full [&::-webkit-progress-bar]:bg-gray-200',
          '[&::-webkit-progress-value]:rounded-full [&::-webkit-progress-value]:transition-all [&::-webkit-progress-value]:duration-300',
          `[&::-webkit-progress-value]:${VARIANT_STYLES[variant]}`,
          // Firefox styling
          '[&::-moz-progress-bar]:rounded-full [&::-moz-progress-bar]:transition-all [&::-moz-progress-bar]:duration-300',
          `[&::-moz-progress-bar]:${VARIANT_STYLES[variant]}`,
        )}
        max={max}
        value={value}
      />
    </div>
  );
};
