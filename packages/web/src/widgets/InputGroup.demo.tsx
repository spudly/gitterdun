/* eslint-disable jsx-a11y/label-has-associated-control */
import {FC} from 'react';
import {InputGroup} from './InputGroup.js';
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
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email Address
              </label>
              <TextInput
                id="email"
                type="email"
                placeholder="Enter your email"
                required
              />
            </div>
          </InputGroup>

          <InputGroup helpText="Must be at least 8 characters long">
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Password
              </label>
              <TextInput
                id="password"
                type="password"
                placeholder="Enter your password"
                required
              />
            </div>
          </InputGroup>

          <InputGroup error="Please select a valid country">
            <div>
              <label
                htmlFor="country"
                className="block text-sm font-medium text-gray-700 mb-2"
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
                htmlFor="username"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Username
              </label>
              <TextInput id="username" placeholder="Enter username" />
            </div>
          </InputGroup>

          <InputGroup layout="horizontal">
            <div>
              <label
                htmlFor="role"
                className="block text-sm font-medium text-gray-700 mb-2"
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

          <InputGroup layout="horizontal" helpText="Current account status">
            <div>
              <label
                htmlFor="status"
                className="block text-sm font-medium text-gray-700 mb-2"
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
                htmlFor="email-error"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email
              </label>
              <TextInput
                id="email-error"
                type="email"
                placeholder="Enter email"
                className="border-red-300 focus:border-red-500"
              />
            </div>
          </InputGroup>

          <InputGroup error="Password is required">
            <div>
              <label
                htmlFor="password-error"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Password
              </label>
              <TextInput
                id="password-error"
                type="password"
                placeholder="Enter password"
                className="border-red-300 focus:border-red-500"
                required
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
                htmlFor="api-key"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                API Key
              </label>
              <TextInput
                id="api-key"
                type="password"
                placeholder="Enter API key"
              />
            </div>
          </InputGroup>

          <InputGroup helpText="Optional: Provide additional context for this item">
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Description
              </label>
              <textarea
                id="description"
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                htmlFor="first-name"
                className="block text-sm font-medium text-gray-700 mb-2"
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
                htmlFor="last-name"
                className="block text-sm font-medium text-gray-700 mb-2"
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
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Phone Number
              </label>
              <TextInput
                id="phone"
                type="tel"
                placeholder="Enter phone number"
              />
            </div>
          </InputGroup>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Custom Styling</h3>
        <InputGroup className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <div>
            <label
              htmlFor="custom-input"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Custom Styled Input
            </label>
            <TextInput
              id="custom-input"
              placeholder="This input group has custom styling"
              className="bg-white"
            />
          </div>
        </InputGroup>
      </div>
    </div>
  );
};

export default InputGroupDemo;
