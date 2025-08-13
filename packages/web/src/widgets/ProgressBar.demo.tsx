import {FC, useState} from 'react';
import ProgressBar from './ProgressBar.js';

const ProgressBarDemo: FC = () => {
  const [v, setV] = useState(40);
  return (
    <div className="space-y-4" data-testid="ProgressBarDemo">
      <ProgressBar value={v} showPercent />
      <input
        type="range"
        min="0"
        max="100"
        value={v}
        onChange={e => setV(Number(e.target.value))}
      />
    </div>
  );
};

export default ProgressBarDemo;
