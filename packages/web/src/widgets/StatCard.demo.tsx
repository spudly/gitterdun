import {FC} from 'react';
import StatCard from './StatCard.js';

const StatCardDemo: FC = () => {
  return (
    <div
      className="grid grid-cols-1 md:grid-cols-4 gap-6"
      data-testid="StatCardDemo"
    >
      <StatCard
        label="Completed"
        value={12}
        color="green"
        icon={<span>✓</span>}
      />
      <StatCard
        label="Pending"
        value={7}
        color="yellow"
        icon={<span>⏳</span>}
      />
      <StatCard
        label="Points"
        value={345}
        color="blue"
        icon={<span>💎</span>}
      />
      <StatCard label="Due Soon" value={2} color="red" icon={<span>⚠️</span>} />
    </div>
  );
};

export default StatCardDemo;
