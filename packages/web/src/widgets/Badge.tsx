import type {FC, ReactNode} from 'react';
import clsx from 'clsx';

type BadgeVariant =
  | 'success'
  | 'info'
  | 'warning'
  | 'danger'
  | 'purple'
  | 'neutral';

export type BadgeProps = {
  readonly children: ReactNode;
  readonly variant?: BadgeVariant;
  readonly className?: string;
};

const VARIANTS: Record<BadgeVariant, string> = {
  success: 'bg-green-100 text-green-800',
  info: 'bg-blue-100 text-blue-800',
  warning: 'bg-yellow-100 text-yellow-800',
  danger: 'bg-red-100 text-red-800',
  purple: 'bg-purple-100 text-purple-800',
  neutral: 'bg-gray-100 text-gray-800',
};

export const Badge: FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  className = '',
}) => {
  return (
    <span
      className={clsx(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
        VARIANTS[variant],
        className,
      )}
    >
      {children}
    </span>
  );
};

export default Badge;
