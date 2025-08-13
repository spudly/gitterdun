import {FC} from 'react';
import {EmptyState} from './EmptyState.js';
import {Button} from './Button.js';

const EmptyStateDemo: FC = () => {
  return (
    <div className="space-y-6" data-testid="EmptyStateDemo">
      <EmptyState title="No data" description="Nothing to show right now." />
      <EmptyState
        title="Invite someone"
        description="Get started by inviting a member."
        action={<Button>Invite</Button>}
      />
    </div>
  );
};

export default EmptyStateDemo;
