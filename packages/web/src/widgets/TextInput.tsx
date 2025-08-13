import {ChangeEvent, FC, InputHTMLAttributes, ReactNode} from 'react';

export interface TextInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  error?: string | null;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  onChange?: (value: string, event: ChangeEvent<HTMLInputElement>) => void;
}

export const TextInput: FC<TextInputProps> = ({
  error,
  leftIcon,
  rightIcon,
  className = '',
  onChange,
  ...rest
}) => {
  const base =
    'w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500';
  const errorCls = error
    ? 'border-red-500 focus:ring-red-500'
    : 'border-gray-300';
  const paddingLeft = leftIcon ? 'pl-9' : '';
  const paddingRight = rightIcon ? 'pr-9' : '';
  return (
    <div className={`relative ${className}`}>
      {leftIcon && (
        <span className="absolute inset-y-0 left-0 pl-2 flex items-center text-gray-400">
          {leftIcon}
        </span>
      )}
      <input
        className={`${base} ${errorCls} ${paddingLeft} ${paddingRight}`}
        onChange={e => onChange?.(e.target.value, e)}
        {...rest}
      />
      {rightIcon && (
        <span className="absolute inset-y-0 right-0 pr-2 flex items-center text-gray-400">
          {rightIcon}
        </span>
      )}
      {error && <div className="mt-1 text-xs text-red-600">{error}</div>}
    </div>
  );
};

export default TextInput;
