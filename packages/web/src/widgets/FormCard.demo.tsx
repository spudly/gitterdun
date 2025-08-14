/* eslint-disable jsx-a11y/label-has-associated-control */
import {FC} from 'react';
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
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-2"
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
            <Button type="submit" className="w-full">
              Register
            </Button>
          </form>
        </FormCard>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Small Size</h3>
        <FormCard title="Quick Login" size="sm">
          <form className="space-y-4">
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Username
              </label>
              <TextInput id="username" placeholder="Enter username" required />
            </div>
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
                placeholder="Enter password"
                required
              />
            </div>
            <Button type="submit" className="w-full">
              Sign In
            </Button>
          </form>
        </FormCard>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Large Size</h3>
        <FormCard title="Detailed Profile" size="lg">
          <form className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
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
            </div>
            <div>
              <label
                htmlFor="bio"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Bio
              </label>
              <textarea
                id="bio"
                rows={4}
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Tell us about yourself"
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
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
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
        <FormCard
          title="Custom Styled Form"
          className="border-2 border-blue-200 bg-blue-50"
        >
          <p className="text-blue-800 mb-4">
            This form card has custom styling applied while maintaining the base
            structure.
          </p>
          <Button variant="secondary">Custom Action</Button>
        </FormCard>
      </div>
    </div>
  );
};

export default FormCardDemo;
