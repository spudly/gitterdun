import type {FC} from 'react';
import {FormCard} from '../FormCard.js';
import {Button} from '../Button.js';
import {FormCardField} from './FormCardField.js';

export const RegistrationFormExample: FC = () => {
  return (
    <FormCard title="User Registration">
      <form className="space-y-4">
        <FormCardField
          id="name"
          label="Full Name"
          placeholder="Enter your full name"
          required
        />
        <FormCardField
          id="email"
          label="Email Address"
          placeholder="Enter your email"
          required
          type="email"
        />
        <Button fullWidth type="submit">
          Register
        </Button>
      </form>
    </FormCard>
  );
};

export const LoginFormExample: FC = () => {
  return (
    <FormCard size="sm" title="Quick Login">
      <form className="space-y-4">
        <FormCardField
          id="username"
          label="Username"
          placeholder="Enter username"
          required
        />
        <FormCardField
          id="password"
          label="Password"
          placeholder="Enter password"
          required
          type="password"
        />
        <Button fullWidth type="submit">
          Sign In
        </Button>
      </form>
    </FormCard>
  );
};

export const LargeFormExample: FC = () => {
  return (
    <FormCard size="lg" title="Detailed Information">
      <form className="space-y-4">
        <FormCardField
          id="company"
          label="Company Name"
          placeholder="Enter company name"
          required
        />
        <FormCardField
          id="website"
          label="Website"
          placeholder="https://example.com"
        />
        <FormCardField
          id="description"
          label="Description"
          placeholder="Tell us about your company"
        />
        <Button fullWidth type="submit">
          Submit
        </Button>
      </form>
    </FormCard>
  );
};
