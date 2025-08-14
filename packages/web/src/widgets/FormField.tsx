import {FC, ReactNode} from 'react';
import clsx from 'clsx';

export interface FormFieldProps {
  label: string;
  htmlFor: string;
  children: ReactNode;
  required?: boolean;
  error?: string;
  helpText?: string;
  className?: string;
}

export const FormField: FC<FormFieldProps> = ({
  label,
  htmlFor,
  children,
  required = false,
  error,
  helpText,
  className = '',
}) => {
  return (
    <div className={clsx('space-y-1', className)}>
      <label
        htmlFor={htmlFor}
        className="block text-sm font-medium text-gray-700"
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {children}
      {helpText && <p className="text-sm text-gray-500">{helpText}</p>}
      {error && (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};

export default FormField;
