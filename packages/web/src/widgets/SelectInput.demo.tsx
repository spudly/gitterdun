import {FC, useState} from 'react';
import {SelectInput} from './SelectInput.js';
import {FormField} from './FormField.js';

const SelectInputDemo: FC = () => {
  const [v, setV] = useState('');
  return (
    <div className="space-y-4" data-testid="SelectInputDemo">
      <FormField label="Role" htmlFor="role">
        <SelectInput
          id="role"
          value={v}
          onChange={val => setV(val)}
          data-testid="roleSelect"
        >
          <option value="">Select</option>
          <option value="parent">Parent</option>
          <option value="child">Child</option>
        </SelectInput>
      </FormField>
      <FormField label="Disabled" htmlFor="disabled">
        <SelectInput id="disabled" disabled defaultValue="child">
          <option value="parent">Parent</option>
          <option value="child">Child</option>
        </SelectInput>
      </FormField>
      <FormField
        label="With error"
        htmlFor="with-error-select"
        error={!v ? 'Please choose' : null}
      >
        <SelectInput
          id="with-error-select"
          value={v}
          onChange={val => setV(val)}
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
