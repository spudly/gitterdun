import {FC, ReactNode} from 'react';
import clsx from 'clsx';

export interface FormCardProps {
  children: ReactNode;
  title?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const SIZE_STYLES = {sm: 'max-w-sm', md: 'max-w-md', lg: 'max-w-lg'};

export const FormCard: FC<FormCardProps> = ({
  children,
  title,
  className = '',
  size = 'md',
}) => {
  return (
    <div
      className={clsx(
        'mx-auto bg-white rounded-lg shadow p-6',
        SIZE_STYLES[size],
        className,
      )}
    >
      {title && <h2 className="text-2xl font-semibold mb-4">{title}</h2>}
      {children}
    </div>
  );
};

export default FormCard;
