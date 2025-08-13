import {FC, ReactNode} from 'react';

export interface FormFieldProps {
  label?: ReactNode;
  help?: ReactNode;
  error?: string | null;
  required?: boolean;
  children: ReactNode;
  className?: string;
  htmlFor?: string;
}

export const FormField: FC<FormFieldProps> = ({
  label,
  help,
  error,
  required,
  children,
  className = '',
  htmlFor,
}) => {
  return (
    <div className={`space-y-1 ${className}`}>
      {label && (
        <label
          className="block text-sm font-medium text-gray-700"
          htmlFor={htmlFor}
        >
          {label}
          {required && <span className="text-red-600 ml-0.5">*</span>}
        </label>
      )}
      {children}
      {help && !error && <div className="text-xs text-gray-500">{help}</div>}
      {error && <div className="text-xs text-red-600">{error}</div>}
    </div>
  );
};

export default FormField;
