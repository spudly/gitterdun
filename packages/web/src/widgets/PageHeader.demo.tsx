import type {FC} from 'react';
import {PageHeader} from './PageHeader.js';
import {Button} from './Button.js';

const PageHeaderDemo: FC = () => {
  return (
    <div className="space-y-6" data-testid="PageHeaderDemo">
      <PageHeader title="Simple Page" />

      <PageHeader
        subtitle="This page has more details."
        title="With Subtitle"
      />

      <PageHeader actions={<Button>Action</Button>} title="With Actions" />
    </div>
  );
};

export default PageHeaderDemo;
