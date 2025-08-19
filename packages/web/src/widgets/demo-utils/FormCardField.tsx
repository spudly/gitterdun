import type {FC} from 'react';
import {TextInput} from '../TextInput.js';

type FormCardFieldProps = {
  readonly id: string;
  readonly label: string;
  readonly placeholder: string;
  readonly type?: 'text' | 'email' | 'password';
  readonly required?: boolean;
};

export const FormCardField: FC<FormCardFieldProps> = ({
  id,
  label,
  placeholder,
  type = 'text',
  required = false,
}) => {
  return (
    <div>
      <label
        className="mb-2 block text-sm font-medium text-gray-700"
        htmlFor={id}
      >
        {label}
      </label>
      <TextInput
        id={id}
        placeholder={placeholder}
        required={required}
        type={type}
      />
    </div>
  );
};
