import type {FC, ReactNode} from 'react';
import {clsx} from 'clsx';

type InputGroupProps = {
  readonly children: ReactNode;
  readonly error?: string;
  readonly helpText?: string;
  readonly layout?: 'vertical' | 'horizontal';
};

export const InputGroup: FC<InputGroupProps> = ({
  children,
  error,
  helpText,
  layout = 'vertical',
}) => {
  const baseStyles = clsx(
    layout === 'horizontal' ? 'flex items-center gap-3' : 'space-y-1',
  );

  return (
    <div className={baseStyles}>
      <div className={layout === 'horizontal' ? 'flex-1' : ''}>{children}</div>

      {typeof helpText === 'string' && helpText.length > 0 ? (
        <p className="text-sm text-gray-500">{helpText}</p>
      ) : null}

      {typeof error === 'string' && error.length > 0 ? (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
};
