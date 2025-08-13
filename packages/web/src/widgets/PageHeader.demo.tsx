import {FC} from 'react';
import PageHeader from './PageHeader.js';
import Button from './Button.js';

const PageHeaderDemo: FC = () => {
  return (
    <div className="space-y-6" data-testid="PageHeaderDemo">
      <PageHeader title="Simple Page" />
      <PageHeader
        title="With Subtitle"
        subtitle="This page has more details."
      />
      <PageHeader title="With Actions" actions={<Button>Action</Button>} />
    </div>
  );
};

export default PageHeaderDemo;
