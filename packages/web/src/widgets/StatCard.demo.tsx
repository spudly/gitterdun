import type {FC} from 'react';
import {StatCard} from './StatCard.js';

const StatCardDemo: FC = () => {
  return (
    <div
      className="grid grid-cols-1 gap-6 md:grid-cols-4"
      data-testid="StatCardDemo"
    >
      <StatCard
        color="green"
        icon={<span>✓</span>}
        label="Completed"
        value={12}
      />

      <StatCard
        color="yellow"
        icon={<span>⏳</span>}
        label="Pending"
        value={7}
      />

      <StatCard
        color="blue"
        icon={<span>💎</span>}
        label="Points"
        value={345}
      />

      <StatCard color="red" icon={<span>⚠️</span>} label="Due Soon" value={2} />
    </div>
  );
};

export default StatCardDemo;
