import type {ChangeEvent, FC, SelectHTMLAttributes} from 'react';
import clsx from 'clsx';

type SelectInputProps = Omit<
  SelectHTMLAttributes<HTMLSelectElement>,
  'onChange'
> & {
  readonly error?: string | null;
  readonly onChange?: (
    value: string,
    event: ChangeEvent<HTMLSelectElement>,
  ) => void;
};

export const SelectInput: FC<SelectInputProps> = ({
  error,
  className = '',
  onChange,
  children,
  ...rest
}) => {
  const base =
    'w-full border rounded px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500';
  const hasError = error !== undefined && error !== null && error !== '';
  const errorCls = hasError
    ? 'border-red-500 focus:ring-red-500'
    : 'border-gray-300';
  return (
    <div className={className}>
      <select
        className={clsx(base, errorCls)}
        onChange={event => onChange?.(event.target.value, event)}
        {...rest}
      >
        {children}
      </select>

      {hasError ? (
        <div className="mt-1 text-xs text-red-600">{error}</div>
      ) : null}
    </div>
  );
};

export default SelectInput;
