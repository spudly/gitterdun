import type {FC} from 'react';
import {EmptyState} from './EmptyState.js';
import {Button} from './Button.js';

const EmptyStateDemo: FC = () => {
  return (
    <div className="space-y-6"
data-testid="EmptyStateDemo"
    >
      <EmptyState description="Nothing to show right now."
title="No data"
      />

      <EmptyState
        action={<Button>Invite</Button>}
        description="Get started by inviting a member."
        title="Invite someone"
      />
    </div>
  );
};

export default EmptyStateDemo;
