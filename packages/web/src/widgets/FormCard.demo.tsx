/* eslint-disable jsx-a11y/label-has-associated-control -- demo code without labels */
import type {FC} from 'react';
import {FormCard} from './FormCard.js';
import {TextInput} from './TextInput.js';
import {Button} from './Button.js';

const FormCardDemo: FC = () => {
  return (
    <div className="space-y-6 p-4">
      <h2 className="text-2xl font-bold">FormCard Component</h2>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Default Size with Title</h3>

        <FormCard title="User Registration">
          <form className="space-y-4">
            <div>
              <label
                className="block text-sm font-medium text-gray-700 mb-2"
                htmlFor="name"
              >
                Full Name
              </label>

              <TextInput
                id="name"
                placeholder="Enter your full name"
                required
              />
            </div>

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

            <Button fullWidth type="submit">
              Register
            </Button>
          </form>
        </FormCard>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Small Size</h3>

        <FormCard size="sm" title="Quick Login">
          <form className="space-y-4">
            <div>
              <label
                className="block text-sm font-medium text-gray-700 mb-2"
                htmlFor="username"
              >
                Username
              </label>

              <TextInput id="username" placeholder="Enter username" required />
            </div>

            <div>
              <label
                className="block text-sm font-medium text-gray-700 mb-2"
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

            <Button fullWidth type="submit">
              Sign In
            </Button>
          </form>
        </FormCard>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Large Size</h3>

        <FormCard size="lg" title="Detailed Profile">
          <form className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
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
            </div>

            <div>
              <label
                className="block text-sm font-medium text-gray-700 mb-2"
                htmlFor="bio"
              >
                Bio
              </label>

              <textarea
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                id="bio"
                placeholder="Tell us about yourself"
                rows={4}
              />
            </div>

            <div className="flex gap-2">
              <Button type="submit">Save Profile</Button>

              <Button variant="secondary">Cancel</Button>
            </div>
          </form>
        </FormCard>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Without Title</h3>

        <FormCard>
          <div className="text-center space-y-4">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
              <svg
                className="h-6 w-6 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M5 13l4 4L19 7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                />
              </svg>
            </div>

            <h3 className="text-lg font-medium text-gray-900">Success!</h3>

            <p className="text-sm text-gray-500">
              Your action has been completed successfully.
            </p>

            <Button>Continue</Button>
          </div>
        </FormCard>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Custom Styling</h3>

        <div className="border-2 border-blue-200 bg-blue-50 rounded-lg p-2">
          <FormCard title="Custom Styled Form">
            <p className="text-blue-800 mb-4">
              This form card is wrapped to apply custom styling while
              maintaining the base structure.
            </p>

            <Button variant="secondary">Custom Action</Button>
          </FormCard>
        </div>
      </div>
    </div>
  );
};

export default FormCardDemo;
/* eslint-enable jsx-a11y/label-has-associated-control */
