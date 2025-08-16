import type {FC, ReactNode, ButtonHTMLAttributes} from 'react';
import clsx from 'clsx';

export type IconButtonProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  'className'
> & {
  readonly icon: ReactNode;
  readonly variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  readonly size?: 'sm' | 'md' | 'lg';
  readonly label?: string;
  readonly rounded?: boolean; // extra-rounded
  readonly fullWidth?: boolean;
  readonly gradient?: boolean;
};

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
  label,
  rounded = false,
  fullWidth = false,
  disabled = false,
  gradient = false,
  ...props
}) => {
  const baseStyles = clsx(
    'inline-flex items-center justify-center font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2',
    VARIANT_STYLES[variant],
    SIZE_STYLES[size],
    rounded ? 'rounded-full' : 'rounded-md',
    fullWidth ? 'w-full' : null,
    gradient
      ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600'
      : null,
  );
  const disabledStyles = disabled ? 'opacity-50 cursor-not-allowed' : '';

  return (
    <button
      aria-label={label}
      className={clsx(baseStyles, disabledStyles)}
      disabled={disabled}
      type="button"
      {...props}
    >
      <div className={ICON_SIZE_STYLES[size]}>{icon}</div>
    </button>
  );
};

export default IconButton;
