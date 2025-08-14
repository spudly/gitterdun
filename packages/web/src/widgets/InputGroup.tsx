import {FC, ReactNode} from 'react';
import clsx from 'clsx';

export interface InputGroupProps {
  children: ReactNode;
  className?: string;
  error?: string;
  helpText?: string;
  layout?: 'vertical' | 'horizontal';
}

export const InputGroup: FC<InputGroupProps> = ({
  children,
  className = '',
  error,
  helpText,
  layout = 'vertical',
}) => {
  const baseStyles = clsx(
    layout === 'horizontal' ? 'flex items-center gap-3' : 'space-y-1',
  );

  return (
    <div className={clsx(baseStyles, className)}>
      <div className={layout === 'horizontal' ? 'flex-1' : ''}>{children}</div>
      {helpText && <p className="text-sm text-gray-500">{helpText}</p>}
      {error && (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};

export default InputGroup;
