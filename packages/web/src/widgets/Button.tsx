import {ButtonHTMLAttributes, FC, ReactNode} from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  loading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

const VARIANT_CLASSNAMES: Record<ButtonVariant, string> = {
  primary: 'text-white bg-indigo-600 hover:bg-indigo-700 border-transparent',
  secondary: 'text-gray-700 bg-white hover:bg-gray-50 border-gray-300',
  danger: 'text-white bg-red-600 hover:bg-red-700 border-transparent',
  ghost: 'text-indigo-600 bg-transparent hover:bg-indigo-50 border-transparent',
};

const SIZE_CLASSNAMES: Record<ButtonSize, string> = {
  sm: 'px-2.5 py-1.5 text-xs rounded',
  md: 'px-3 py-2 text-sm rounded-md',
  lg: 'px-4 py-2.5 text-base rounded-lg',
};

export const Button: FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  loading = false,
  leftIcon,
  rightIcon,
  className = '',
  disabled,
  children,
  ...rest
}) => {
  const base =
    'inline-flex items-center justify-center border font-medium transition-colors disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-indigo-500';
  const width = fullWidth ? 'w-full' : '';
  const contentOpacity = loading ? 'opacity-0' : 'opacity-100';

  return (
    <button
      type="button"
      className={`${base} ${VARIANT_CLASSNAMES[variant]} ${SIZE_CLASSNAMES[size]} ${width} ${className}`}
      disabled={disabled || loading}
      {...rest}
    >
      {loading && (
        <span
          className="absolute inline-block animate-spin rounded-full border-2 border-b-transparent border-white w-4 h-4"
          aria-hidden="true"
        />
      )}
      <span className={`flex items-center gap-2 ${contentOpacity}`}>
        {leftIcon}
        {children}
        {rightIcon}
      </span>
    </button>
  );
};

export default Button;
