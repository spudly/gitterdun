import type {FC} from 'react';
import {SectionHeader} from './SectionHeader.js';
import {Button} from './Button.js';

const SectionHeaderDemo: FC = () => {
  return (
    <div className="space-y-6 p-4">
      <h2 className="text-2xl font-bold">SectionHeader Component</h2>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Default Variant</h3>

        <SectionHeader title="User Management">
          <Button size="sm">Add User</Button>
        </SectionHeader>

        <div className="rounded bg-gray-100 p-4">
          <p>Content below the header</p>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Large Variant</h3>

        <SectionHeader
          subtitle="Manage your application settings"
          title="System Configuration"
          variant="large"
        >
          <Button>Save Changes</Button>
        </SectionHeader>

        <div className="rounded bg-gray-100 p-4">
          <p>Content below the large header</p>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Compact Variant</h3>

        <SectionHeader title="Quick Actions" variant="compact">
          <div className="flex gap-2">
            <Button size="sm" variant="secondary">
              Edit
            </Button>

            <Button size="sm" variant="danger">
              Delete
            </Button>
          </div>
        </SectionHeader>

        <div className="rounded bg-gray-100 p-4">
          <p>Content below the compact header</p>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">With Subtitle Only</h3>

        <SectionHeader
          subtitle="Export your data in various formats"
          title="Data Export"
        />

        <div className="rounded bg-gray-100 p-4">
          <p>Content below the header with subtitle</p>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Title Only</h3>

        <SectionHeader title="Simple Section" />

        <div className="rounded bg-gray-100 p-4">
          <p>Content below the simple header</p>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Custom Styling</h3>

        <SectionHeader title="Custom Styled Header" tone="blue">
          <Button variant="secondary">Custom Action</Button>
        </SectionHeader>

        <div className="rounded bg-gray-100 p-4">
          <p>Content below the custom styled header</p>
        </div>
      </div>
    </div>
  );
};

export default SectionHeaderDemo;
