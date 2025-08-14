import {FC, ReactNode, ButtonHTMLAttributes} from 'react';
import clsx from 'clsx';

export interface IconButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: ReactNode;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  label?: string;
}

const VARIANT_STYLES = {
  primary: 'bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500',
  secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500',
  danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
  ghost: 'bg-transparent text-gray-600 hover:bg-gray-100 focus:ring-gray-500',
};

const SIZE_STYLES = {sm: 'p-1.5', md: 'p-2', lg: 'p-3'};

const ICON_SIZE_STYLES = {sm: 'w-4 h-4', md: 'w-5 h-5', lg: 'w-6 h-6'};

export const IconButton: FC<IconButtonProps> = ({
  icon,
  variant = 'primary',
  size = 'md',
  className = '',
  label,
  disabled,
  ...props
}) => {
  const baseStyles = clsx(
    'inline-flex items-center justify-center rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors',
    VARIANT_STYLES[variant],
    SIZE_STYLES[size],
    className,
  );
  const disabledStyles = disabled ? 'opacity-50 cursor-not-allowed' : '';

  return (
    <button
      type="button"
      className={clsx(baseStyles, disabledStyles)}
      disabled={disabled}
      aria-label={label}
      {...props}
    >
      <div className={ICON_SIZE_STYLES[size]}>{icon}</div>
    </button>
  );
};

export default IconButton;
