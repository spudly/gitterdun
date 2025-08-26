import type {ChangeEvent, FC, InputHTMLAttributes, ReactNode} from 'react';
import clsx from 'clsx';

type TextInputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'onChange' | 'className'
> & {
  readonly error?: string | null;
  readonly leftIcon?: ReactNode;
  readonly rightIcon?: ReactNode;
  readonly onChange?: (
    value: string,
    event: ChangeEvent<HTMLInputElement>,
  ) => void;
};

export const TextInput: FC<TextInputProps> = ({
  error,
  leftIcon,
  rightIcon,
  onChange,
  ...rest
}) => {
  const base =
    'w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500';

  const hasError = error !== undefined && error !== null && error !== '';
  const errorCls = hasError
    ? 'border-red-500 focus:ring-red-500'
    : 'border-gray-300';

  const hasLeftIcon = leftIcon !== undefined && leftIcon !== null;
  const hasRightIcon = rightIcon !== undefined && rightIcon !== null;
  const paddingLeft = hasLeftIcon ? 'pl-9' : '';
  const paddingRight = hasRightIcon ? 'pr-9' : '';

  return (
    <div className="flex flex-col gap-1">
      <div className="relative">
        {hasLeftIcon ? (
          <span className="absolute inset-y-0 left-0 flex items-center pl-2 text-gray-400">
            {leftIcon}
          </span>
        ) : null}

        <input
          className={clsx(base, errorCls, paddingLeft, paddingRight)}
          onChange={event => onChange?.(event.target.value, event)}
          {...rest}
        />

        {hasRightIcon ? (
          <span className="absolute inset-y-0 right-0 flex items-center pr-2 text-gray-400">
            {rightIcon}
          </span>
        ) : null}
      </div>

      {hasError ? <div className="text-xs text-red-600">{error}</div> : null}
    </div>
  );
};
