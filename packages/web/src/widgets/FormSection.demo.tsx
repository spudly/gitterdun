import {FC} from 'react';
import {FormSection} from './FormSection.js';
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
            <FormField label="First Name" htmlFor="first-name">
              <TextInput id="first-name" placeholder="Enter first name" />
            </FormField>
            <FormField label="Last Name" htmlFor="last-name">
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
            <FormField label="Theme" htmlFor="theme">
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
            <FormField label="Server URL" htmlFor="server-url">
              <TextInput id="server-url" placeholder="https://example.com" />
            </FormField>
            <FormField label="API Key" htmlFor="api-key">
              <TextInput
                id="api-key"
                placeholder="Enter API key"
                type="password"
              />
            </FormField>
            <FormField label="Timeout (seconds)" htmlFor="timeout">
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
        <FormSection
          title="Custom Styled Section"
          className="border-2 border-blue-200 bg-blue-50"
        >
          <p className="text-blue-800">
            This section has custom styling applied while maintaining the base
            structure.
          </p>
        </FormSection>
      </div>
    </div>
  );
};

export default FormSectionDemo;
