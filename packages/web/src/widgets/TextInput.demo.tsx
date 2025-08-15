import type {FC} from 'react';
import { useState} from 'react';
import {TextInput} from './TextInput.js';
import {FormField} from './FormField.js';

const TextInputDemo: FC = () => {
  const [value, setValue] = useState('');
  return (
    <div className="space-y-4"
data-testid="TextInputDemo"
    >
      <FormField
        helpText="We'll never share your email."
        htmlFor="email"
        label="Email"
      >
        <TextInput
          id="email"
          onChange={v => { setValue(v); }}
          placeholder="you@example.com"
          type="email"
          value={value}
        />
      </FormField>

      <FormField htmlFor="password"
label="Password"
required
      >
        <TextInput id="password"
placeholder="••••••"
type="password"
        />
      </FormField>

      <FormField
        htmlFor="with-error"
        label="With error"
        {...(value ? {} : {error: 'Required'})}
      >
        <TextInput
          id="with-error"
          onChange={v => { setValue(v); }}
          placeholder="Type something"
          value={value}
        />
      </FormField>

      <TextInput disabled
placeholder="Disabled"
      />
    </div>
  );
};

export default TextInputDemo;
