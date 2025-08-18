import type {ButtonHTMLAttributes, FC, ReactNode} from 'react';
import clsx from 'clsx';

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  readonly variant?: ButtonVariant;
  readonly size?: ButtonSize;
  readonly fullWidth?: boolean;
  readonly loading?: boolean;
  readonly leftIcon?: ReactNode;
  readonly rightIcon?: ReactNode;
};

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
      className={clsx(
        base,
        VARIANT_CLASSNAMES[variant],
        SIZE_CLASSNAMES[size],
        width,
      )}
      disabled={(disabled ?? false) || loading}
      type="button"
      {...rest}
    >
      {loading ? (
        <span
          aria-hidden="true"
          className="absolute inline-block size-4 animate-spin rounded-full border-2 border-white border-b-transparent"
        />
      ) : null}
      <span className={clsx('flex items-center gap-2', contentOpacity)}>
        {leftIcon}

        {children}

        {rightIcon}
      </span>
    </button>
  );
};
