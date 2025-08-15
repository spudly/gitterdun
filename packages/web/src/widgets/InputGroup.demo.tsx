/* eslint-disable jsx-a11y/label-has-associated-control -- demo code without labels */
import type {FC} from 'react';
import {InputGroup} from './InputGroup.js';
import {Card} from './Card.js';
import {TextInput} from './TextInput.js';
import {SelectInput} from './SelectInput.js';

const InputGroupDemo: FC = () => {
  return (
    <div className="space-y-6 p-4">
      <h2 className="text-2xl font-bold">InputGroup Component</h2>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Vertical Layout (Default)</h3>

        <div className="space-y-4 max-w-md">
          <InputGroup>
            <div>
              <label
                className="block text-sm font-medium text-gray-700 mb-2"
                htmlFor="email"
              >
                Email Address
              </label>

              <TextInput
                id="email"
                placeholder="Enter your email"
                required
                type="email"
              />
            </div>
          </InputGroup>

          <InputGroup helpText="Must be at least 8 characters long">
            <div>
              <label
                className="block text-sm font-medium text-gray-700 mb-2"
                htmlFor="password"
              >
                Password
              </label>

              <TextInput
                id="password"
                placeholder="Enter your password"
                required
                type="password"
              />
            </div>
          </InputGroup>

          <InputGroup error="Please select a valid country">
            <div>
              <label
                className="block text-sm font-medium text-gray-700 mb-2"
                htmlFor="country"
              >
                Country
              </label>

              <SelectInput id="country">
                <option value="">Select a country</option>

                <option value="us">United States</option>

                <option value="ca">Canada</option>

                <option value="uk">United Kingdom</option>
              </SelectInput>
            </div>
          </InputGroup>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Horizontal Layout</h3>

        <div className="space-y-4 max-w-2xl">
          <InputGroup layout="horizontal">
            <div>
              <label
                className="block text-sm font-medium text-gray-700 mb-2"
                htmlFor="username"
              >
                Username
              </label>

              <TextInput id="username" placeholder="Enter username" />
            </div>
          </InputGroup>

          <InputGroup layout="horizontal">
            <div>
              <label
                className="block text-sm font-medium text-gray-700 mb-2"
                htmlFor="role"
              >
                Role
              </label>

              <SelectInput id="role">
                <option value="">Select role</option>

                <option value="admin">Administrator</option>

                <option value="user">User</option>

                <option value="guest">Guest</option>
              </SelectInput>
            </div>
          </InputGroup>

          <InputGroup helpText="Current account status" layout="horizontal">
            <div>
              <label
                className="block text-sm font-medium text-gray-700 mb-2"
                htmlFor="status"
              >
                Status
              </label>

              <SelectInput id="status">
                <option value="active">Active</option>

                <option value="inactive">Inactive</option>

                <option value="suspended">Suspended</option>
              </SelectInput>
            </div>
          </InputGroup>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">With Error States</h3>

        <div className="space-y-4 max-w-md">
          <InputGroup error="Please enter a valid email address">
            <div>
              <label
                className="block text-sm font-medium text-gray-700 mb-2"
                htmlFor="email-error"
              >
                Email
              </label>

              <TextInput
                error="Invalid email"
                id="email-error"
                placeholder="Enter email"
                type="email"
              />
            </div>
          </InputGroup>

          <InputGroup error="Password is required">
            <div>
              <label
                className="block text-sm font-medium text-gray-700 mb-2"
                htmlFor="password-error"
              >
                Password
              </label>

              <TextInput
                error="Password is required"
                id="password-error"
                placeholder="Enter password"
                required
                type="password"
              />
            </div>
          </InputGroup>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">With Help Text</h3>

        <div className="space-y-4 max-w-md">
          <InputGroup helpText="Your API key will be encrypted and stored securely">
            <div>
              <label
                className="block text-sm font-medium text-gray-700 mb-2"
                htmlFor="api-key"
              >
                API Key
              </label>

              <TextInput
                id="api-key"
                placeholder="Enter API key"
                type="password"
              />
            </div>
          </InputGroup>

          <InputGroup helpText="Optional: Provide additional context for this item">
            <div>
              <label
                className="block text-sm font-medium text-gray-700 mb-2"
                htmlFor="description"
              >
                Description
              </label>

              <textarea
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                id="description"
                placeholder="Enter description"
                rows={3}
              />
            </div>
          </InputGroup>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Required Fields</h3>

        <div className="space-y-4 max-w-md">
          <InputGroup>
            <div>
              <label
                className="block text-sm font-medium text-gray-700 mb-2"
                htmlFor="first-name"
              >
                First Name
              </label>

              <TextInput
                id="first-name"
                placeholder="Enter first name"
                required
              />
            </div>
          </InputGroup>

          <InputGroup>
            <div>
              <label
                className="block text-sm font-medium text-gray-700 mb-2"
                htmlFor="last-name"
              >
                Last Name
              </label>

              <TextInput
                id="last-name"
                placeholder="Enter last name"
                required
              />
            </div>
          </InputGroup>

          <InputGroup>
            <div>
              <label
                className="block text-sm font-medium text-gray-700 mb-2"
                htmlFor="phone"
              >
                Phone Number
              </label>

              <TextInput
                id="phone"
                placeholder="Enter phone number"
                type="tel"
              />
            </div>
          </InputGroup>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Custom Styling</h3>

        <Card elevated padded>
          <InputGroup>
            <div>
              <label
                className="block text-sm font-medium text-gray-700 mb-2"
                htmlFor="custom-input"
              >
                Custom Styled Input
              </label>

              <TextInput
                id="custom-input"
                placeholder="This input group is wrapped in a Card"
              />
            </div>
          </InputGroup>
        </Card>
      </div>
    </div>
  );
};

export default InputGroupDemo;
/* eslint-enable jsx-a11y/label-has-associated-control */
