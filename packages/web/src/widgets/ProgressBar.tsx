import {FC} from 'react';
import clsx from 'clsx';

export interface ProgressBarProps {
  value: number;
  max: number;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'success' | 'warning' | 'danger';
  showLabel?: boolean;
  showPercentage?: boolean;
  className?: string;
}

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
  className = '',
}) => {
  const percentage = Math.min((value / max) * 100, 100);
  const progressWidth = `${percentage}%`;

  return (
    <div className={clsx('space-y-2', className)}>
      {(showLabel || showPercentage) && (
        <div className="flex justify-between text-sm">
          {showLabel && <span className="text-gray-500">Progress</span>}
          {showPercentage && (
            <span className="font-medium">{Math.round(percentage)}%</span>
          )}
        </div>
      )}
      <div
        className={clsx('w-full bg-gray-200 rounded-full', SIZE_STYLES[size])}
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
