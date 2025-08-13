import {FC} from 'react';
import {FormField} from './FormField.js';
import {TextInput} from './TextInput.js';

const FormFieldDemo: FC = () => {
  return (
    <div className="space-y-4" data-testid="FormFieldDemo">
      <FormField label="Username">
        <TextInput placeholder="john" />
      </FormField>
      <FormField label="With help" help="This appears below the field.">
        <TextInput placeholder="hinted" />
      </FormField>
      <FormField label="With error" error="Something went wrong">
        <TextInput placeholder="errored" />
      </FormField>
    </div>
  );
};

export default FormFieldDemo;
