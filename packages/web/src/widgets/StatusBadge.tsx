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

export const getStatusClass = (status: StatusType): string => {
  switch (status) {
    case 'success':
      return STATUS_STYLES.success;
    case 'error':
      return STATUS_STYLES.error;
    case 'warning':
      return STATUS_STYLES.warning;
    case 'info':
      return STATUS_STYLES.info;
    case 'pending':
      return STATUS_STYLES.pending;
    case 'completed':
      return STATUS_STYLES.completed;
    case 'approved':
      return STATUS_STYLES.approved;
    default:
      return STATUS_STYLES.info;
  }
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
    getStatusClass(status),
    SIZE_STYLES[size],
    className,
  );

  return <span className={baseStyles}>{children || status}</span>;
};

export default StatusBadge;
