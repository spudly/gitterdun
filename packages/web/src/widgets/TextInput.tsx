import type {ChangeEvent, FC, InputHTMLAttributes, ReactNode} from 'react';
import clsx from 'clsx';

export type TextInputProps = Omit<
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
  const errorCls =
    error != null ? 'border-red-500 focus:ring-red-500' : 'border-gray-300';
  const paddingLeft = leftIcon != null ? 'pl-9' : '';
  const paddingRight = rightIcon != null ? 'pr-9' : '';
  return (
    <div className={clsx('relative')}>
      {leftIcon != null ? (
        <span className="absolute inset-y-0 left-0 pl-2 flex items-center text-gray-400">
          {leftIcon}
        </span>
      ) : null}

      <input
        className={clsx(base, errorCls, paddingLeft, paddingRight)}
        onChange={e => onChange?.(e.target.value, e)}
        {...rest}
      />

      {rightIcon != null ? (
        <span className="absolute inset-y-0 right-0 pr-2 flex items-center text-gray-400">
          {rightIcon}
        </span>
      ) : null}

      {error != null ? (
        <div className="mt-1 text-xs text-red-600">{error}</div>
      ) : null}
    </div>
  );
};

export default TextInput;
