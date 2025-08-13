import {FC} from 'react';
import StatusDot from './StatusDot.js';

const StatusDotDemo: FC = () => {
  return (
    <div className="flex items-center gap-3" data-testid="StatusDotDemo">
      <StatusDot color="green" />
      <StatusDot color="blue" />
      <StatusDot color="yellow" />
      <StatusDot color="red" />
      <StatusDot color="gray" />
    </div>
  );
};

export default StatusDotDemo;
