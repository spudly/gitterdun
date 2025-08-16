import type {FC} from 'react';
import clsx from 'clsx';

export type ProgressBarProps = {
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
  const percentage = Math.min((value / max) * 100, 100);
  const progressWidth = `${percentage}%`;

  return (
    <div className={clsx('space-y-2', padded ? 'p-4' : null)}>
      {showLabel || showPercentage ? (
        <div className="flex justify-between text-sm">
          {showLabel ? <span className="text-gray-500">Progress</span> : null}

          {showPercentage ? (
            <span className="font-medium">{Math.round(percentage)}%</span>
          ) : null}
        </div>
      ) : null}

      <div
        className={clsx('w-full rounded-full bg-gray-200', SIZE_STYLES[size])}
      >
        <div
          className={clsx(
            'rounded-full transition-all duration-300',
            VARIANT_STYLES[variant],
            SIZE_STYLES[size],
          )}
          style={{width: progressWidth}}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
