import {FC, useState} from 'react';
import {TextInput} from './TextInput.js';
import {FormField} from './FormField.js';

const TextInputDemo: FC = () => {
  const [value, setValue] = useState('');
  return (
    <div className="space-y-4" data-testid="TextInputDemo">
      <FormField
        label="Email"
        htmlFor="email"
        help="We'll never share your email."
      >
        <TextInput
          id="email"
          type="email"
          placeholder="you@example.com"
          value={value}
          onChange={v => setValue(v)}
        />
      </FormField>
      <FormField label="Password" htmlFor="password" required>
        <TextInput id="password" type="password" placeholder="••••••" />
      </FormField>
      <FormField
        label="With error"
        htmlFor="with-error"
        error={value ? null : 'Required'}
      >
        <TextInput
          id="with-error"
          placeholder="Type something"
          value={value}
          onChange={v => setValue(v)}
        />
      </FormField>
      <TextInput placeholder="Disabled" disabled />
    </div>
  );
};

export default TextInputDemo;
