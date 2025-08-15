import type {FC} from 'react';
import {FormField} from './FormField.js';
import {TextInput} from './TextInput.js';
import {SelectInput} from './SelectInput.js';
import {Card} from './Card.js';

const FormFieldDemo: FC = () => {
  return (
    <div className="space-y-6 p-4">
      <h2 className="text-2xl font-bold">FormField Component</h2>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Basic Form Field</h3>

        <FormField htmlFor="email" label="Email Address">
          <TextInput
            id="email"
            placeholder="Enter your email address"
            type="email"
          />
        </FormField>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Required Field</h3>

        <FormField htmlFor="password" label="Password" required>
          <TextInput
            id="password"
            placeholder="Enter your password"
            type="password"
          />
        </FormField>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">With Help Text</h3>

        <FormField
          helpText="Choose a unique username that will be displayed to other users"
          htmlFor="username"
          label="Username"
        >
          <TextInput id="username" placeholder="Enter your username" />
        </FormField>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">With Error</h3>

        <FormField
          error="Passwords do not match"
          htmlFor="confirm-password"
          label="Confirm Password"
        >
          <TextInput
            error="Passwords do not match"
            id="confirm-password"
            placeholder="Confirm your password"
            type="password"
          />
        </FormField>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Select Input</h3>

        <FormField
          helpText="Select your country of residence"
          htmlFor="country"
          label="Country"
        >
          <SelectInput id="country">
            <option value="">Select a country</option>

            <option value="us">United States</option>

            <option value="ca">Canada</option>

            <option value="uk">United Kingdom</option>

            <option value="au">Australia</option>
          </SelectInput>
        </FormField>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Textarea</h3>

        <FormField
          helpText="Tell us a little about yourself"
          htmlFor="bio"
          label="Bio"
        >
          <textarea
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            id="bio"
            placeholder="Enter your bio..."
            rows={4}
          />
        </FormField>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Multiple Fields</h3>

        <div className="space-y-4 max-w-md">
          <FormField htmlFor="first-name" label="First Name" required>
            <TextInput id="first-name" placeholder="Enter your first name" />
          </FormField>

          <FormField htmlFor="last-name" label="Last Name" required>
            <TextInput id="last-name" placeholder="Enter your last name" />
          </FormField>

          <FormField htmlFor="phone" label="Phone Number">
            <TextInput
              id="phone"
              placeholder="Enter your phone number"
              type="tel"
            />
          </FormField>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Custom Styling</h3>

        <Card elevated padded>
          <FormField htmlFor="custom" label="Custom Field">
            <TextInput
              id="custom"
              placeholder="This field is wrapped in a Card"
            />
          </FormField>
        </Card>
      </div>
    </div>
  );
};

export default FormFieldDemo;
