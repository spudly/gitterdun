import type {FC, ReactNode} from 'react';
import clsx from 'clsx';

type FormFieldProps = {
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
  const hasHelpText = helpText !== undefined && helpText !== '';
  const hasError = error !== undefined && error !== '';

  return (
    <div className={clsx('space-y-1')}>
      <label
        className="flex gap-1 text-sm font-medium text-gray-700"
        htmlFor={htmlFor}
      >
        <span>{label}</span>

        {required ? (
          <span aria-hidden className="text-red-500">
            *
          </span>
        ) : null}
      </label>

      {children}

      {hasHelpText ? <p className="text-sm text-gray-500">{helpText}</p> : null}

      {hasError ? (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
};
