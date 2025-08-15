import type {FC, ReactNode} from 'react';
import clsx from 'clsx';

export type FormFieldProps = {
  readonly label: string;
  readonly htmlFor: string;
  readonly children: ReactNode;
  readonly required?: boolean;
  readonly error?: string;
  readonly helpText?: string;
};

export const FormField: FC<FormFieldProps> = ({
  label,
  htmlFor,
  children,
  required = false,
  error,
  helpText,
}) => {
  return (
    <div className={clsx('space-y-1')}>
      <label
        className="block text-sm font-medium text-gray-700"
        htmlFor={htmlFor}
      >
        {label}

        {required ? <span className="text-red-500 ml-1">*</span> : null}
      </label>

      {children}

      {helpText != null ? (
        <p className="text-sm text-gray-500">{helpText}</p>
      ) : null}

      {error != null ? (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
};

export default FormField;
