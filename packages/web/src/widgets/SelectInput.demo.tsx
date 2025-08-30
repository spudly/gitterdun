import type {FC} from 'react';
import {useState} from 'react';
import {SelectInput} from './SelectInput.js';
import {FormField} from './FormField.js';

const SelectInputDemo: FC = () => {
  const [value, setValue] = useState('');
  return (
    <div className="space-y-4">
      <FormField htmlFor="role" label="Role">
        <SelectInput
          id="role"
          onChange={val => {
            setValue(val);
          }}
          value={value}
        >
          <option value="">Select</option>

          <option value="parent">Parent</option>

          <option value="child">Child</option>
        </SelectInput>
      </FormField>

      <FormField htmlFor="disabled" label="Disabled">
        <SelectInput defaultValue="child" disabled id="disabled">
          <option value="parent">Parent</option>

          <option value="child">Child</option>
        </SelectInput>
      </FormField>

      <FormField
        htmlFor="with-error-select"
        label="With error"
        {...(value === '' ? {error: 'Please choose'} : {})}
      >
        <SelectInput
          id="with-error-select"
          onChange={val => {
            setValue(val);
          }}
          value={value}
        >
          <option value="">Select</option>

          <option value="parent">Parent</option>

          <option value="child">Child</option>
        </SelectInput>
      </FormField>
    </div>
  );
};

export default SelectInputDemo;
