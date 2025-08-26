/* eslint-disable react/no-multi-comp -- Demo file with multiple related input group examples */
import type {FC} from 'react';
import {InputGroup} from '../InputGroup.js';
import {TextInput} from '../TextInput.js';

export const VerticalLayoutExample: FC = () => {
  return (
    <div className="max-w-md space-y-4">
      <InputGroup>
        <div className="flex flex-col gap-2">
          {/* eslint-disable-next-line jsx-a11y/label-has-associated-control -- TextInput component renders an input with matching id */}
          <label
            className="block text-sm font-medium text-gray-700"
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
        <div className="flex flex-col gap-2">
          {/* eslint-disable-next-line jsx-a11y/label-has-associated-control -- TextInput component renders an input with matching id */}
          <label
            className="block text-sm font-medium text-gray-700"
            htmlFor="password"
          >
            Password
          </label>
          <TextInput
            id="password"
            placeholder="Enter password"
            required
            type="password"
          />
        </div>
      </InputGroup>
    </div>
  );
};

export const HorizontalLayoutExample: FC = () => {
  return (
    <div className="max-w-2xl space-y-4">
      <InputGroup layout="horizontal">
        <div className="flex flex-col gap-2">
          {/* eslint-disable-next-line jsx-a11y/label-has-associated-control -- TextInput component renders an input with matching id */}
          <label
            className="block text-sm font-medium text-gray-700"
            htmlFor="first-name-h"
          >
            First Name
          </label>
          <TextInput id="first-name-h" placeholder="First name" required />
        </div>
      </InputGroup>
      <InputGroup layout="horizontal">
        <div className="flex flex-col gap-2">
          {/* eslint-disable-next-line jsx-a11y/label-has-associated-control -- TextInput component renders an input with matching id */}
          <label
            className="block text-sm font-medium text-gray-700"
            htmlFor="last-name-h"
          >
            Last Name
          </label>
          <TextInput id="last-name-h" placeholder="Last name" required />
        </div>
      </InputGroup>
    </div>
  );
};

export const ErrorStatesExample: FC = () => {
  return (
    <div className="max-w-md space-y-4">
      <InputGroup error="Please enter a valid email address">
        <div className="flex flex-col gap-2">
          {/* eslint-disable-next-line jsx-a11y/label-has-associated-control -- TextInput component renders an input with matching id */}
          <label
            className="block text-sm font-medium text-gray-700"
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
        <div className="flex flex-col gap-2">
          {/* eslint-disable-next-line jsx-a11y/label-has-associated-control -- TextInput component renders an input with matching id */}
          <label
            className="block text-sm font-medium text-gray-700"
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
  );
};
/* eslint-enable react/no-multi-comp */
