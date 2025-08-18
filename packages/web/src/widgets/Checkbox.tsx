import type {ChangeEvent, FC, ReactNode} from 'react';

type CheckboxProps = {
  readonly id?: string;
  readonly label: ReactNode;
  readonly checked?: boolean;
  readonly disabled?: boolean;
  readonly onChange?: (
    checked: boolean,
    event: ChangeEvent<HTMLInputElement>,
  ) => void;
};

export const Checkbox: FC<CheckboxProps> = ({
  id,
  label,
  checked,
  disabled,
  onChange,
}) => {
  return (
    <label className="flex items-center gap-2" htmlFor={id}>
      <input
        checked={checked}
        disabled={disabled}
        id={id}
        onChange={event => onChange?.(event.target.checked, event)}
        type="checkbox"
      />
      {label}
    </label>
  );
};

export default Checkbox;
