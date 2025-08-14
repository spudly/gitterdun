import {FC} from 'react';
import {FormField} from './FormField.js';
import {TextInput} from './TextInput.js';
import {SelectInput} from './SelectInput.js';

const FormFieldDemo: FC = () => {
  return (
    <div className="space-y-6 p-4">
      <h2 className="text-2xl font-bold">FormField Component</h2>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Basic Form Field</h3>
        <FormField label="Email Address" htmlFor="email">
          <TextInput
            id="email"
            type="email"
            placeholder="Enter your email address"
          />
        </FormField>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Required Field</h3>
        <FormField label="Password" htmlFor="password" required>
          <TextInput
            id="password"
            type="password"
            placeholder="Enter your password"
          />
        </FormField>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">With Help Text</h3>
        <FormField
          label="Username"
          htmlFor="username"
          helpText="Choose a unique username that will be displayed to other users"
        >
          <TextInput id="username" placeholder="Enter your username" />
        </FormField>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">With Error</h3>
        <FormField
          label="Confirm Password"
          htmlFor="confirm-password"
          error="Passwords do not match"
        >
          <TextInput
            id="confirm-password"
            type="password"
            placeholder="Confirm your password"
            className="border-red-300 focus:border-red-500"
          />
        </FormField>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Select Input</h3>
        <FormField
          label="Country"
          htmlFor="country"
          helpText="Select your country of residence"
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
          label="Bio"
          htmlFor="bio"
          helpText="Tell us a little about yourself"
        >
          <textarea
            id="bio"
            rows={4}
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            placeholder="Enter your bio..."
          />
        </FormField>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Multiple Fields</h3>
        <div className="space-y-4 max-w-md">
          <FormField label="First Name" htmlFor="first-name" required>
            <TextInput id="first-name" placeholder="Enter your first name" />
          </FormField>

          <FormField label="Last Name" htmlFor="last-name" required>
            <TextInput id="last-name" placeholder="Enter your last name" />
          </FormField>

          <FormField label="Phone Number" htmlFor="phone">
            <TextInput
              id="phone"
              type="tel"
              placeholder="Enter your phone number"
            />
          </FormField>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Custom Styling</h3>
        <FormField
          label="Custom Field"
          htmlFor="custom"
          className="bg-blue-50 p-4 rounded-lg border border-blue-200"
        >
          <TextInput
            id="custom"
            placeholder="This field has custom styling"
            className="bg-white"
          />
        </FormField>
      </div>
    </div>
  );
};

export default FormFieldDemo;
