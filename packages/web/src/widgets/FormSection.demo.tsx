import type {FC} from 'react';
import {FormSection} from './FormSection.js';
import {Card} from './Card.js';
import {FormField} from './FormField.js';
import {TextInput} from './TextInput.js';
import {Button} from './Button.js';

const FormSectionDemo: FC = () => {
  return (
    <div className="space-y-6 p-4">
      <h2 className="text-2xl font-bold">FormSection Component</h2>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Default Variant</h3>

        <FormSection title="User Information">
          <div className="space-y-3">
            <FormField htmlFor="first-name" label="First Name">
              <TextInput id="first-name" placeholder="Enter first name" />
            </FormField>

            <FormField htmlFor="last-name" label="Last Name">
              <TextInput id="last-name" placeholder="Enter last name" />
            </FormField>

            <Button>Save</Button>
          </div>
        </FormSection>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Compact Variant</h3>

        <FormSection title="Quick Settings" variant="compact">
          <div className="space-y-2">
            <FormField htmlFor="theme" label="Theme">
              <TextInput id="theme" placeholder="Select theme" />
            </FormField>

            <Button size="sm">Apply</Button>
          </div>
        </FormSection>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Spacious Variant</h3>

        <FormSection title="Detailed Configuration" variant="spacious">
          <div className="space-y-4">
            <FormField htmlFor="server-url" label="Server URL">
              <TextInput id="server-url" placeholder="https://example.com" />
            </FormField>

            <FormField htmlFor="api-key" label="API Key">
              <TextInput
                id="api-key"
                placeholder="Enter API key"
                type="password"
              />
            </FormField>

            <FormField htmlFor="timeout" label="Timeout (seconds)">
              <TextInput id="timeout" placeholder="30" type="number" />
            </FormField>

            <div className="flex gap-2">
              <Button>Save</Button>

              <Button variant="secondary">Cancel</Button>
            </div>
          </div>
        </FormSection>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Without Title</h3>

        <FormSection>
          <div className="text-center text-gray-600">
            <p>This section has no title but maintains consistent styling.</p>
          </div>
        </FormSection>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Custom Styling</h3>

        <Card elevated padded>
          <FormSection title="Custom Styled Section">
            <p className="text-gray-700">
              This section is wrapped by a Card to apply custom styling while
              maintaining the base structure.
            </p>
          </FormSection>
        </Card>
      </div>
    </div>
  );
};

export default FormSectionDemo;
