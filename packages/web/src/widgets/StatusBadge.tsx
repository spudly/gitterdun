import {FC, ReactNode} from 'react';
import clsx from 'clsx';

export type StatusType =
  | 'success'
  | 'error'
  | 'warning'
  | 'info'
  | 'pending'
  | 'completed'
  | 'approved';

export interface StatusBadgeProps {
  status: StatusType;
  children?: ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const STATUS_STYLES: Record<StatusType, string> = {
  success: 'bg-green-100 text-green-800',
  error: 'bg-red-100 text-red-800',
  warning: 'bg-yellow-100 text-yellow-800',
  info: 'bg-blue-100 text-blue-800',
  pending: 'bg-yellow-100 text-yellow-800',
  completed: 'bg-green-100 text-green-800',
  approved: 'bg-blue-100 text-blue-800',
};

const SIZE_STYLES = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-0.5 text-sm',
  lg: 'px-3 py-1 text-base',
};

export const StatusBadge: FC<StatusBadgeProps> = ({
  status,
  children,
  className = '',
  size = 'md',
}) => {
  const baseStyles = clsx(
    'inline-flex items-center rounded-full font-medium',
    STATUS_STYLES[status],
    SIZE_STYLES[size],
    className,
  );

  return <span className={baseStyles}>{children || status}</span>;
};

export default StatusBadge;
