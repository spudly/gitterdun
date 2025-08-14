import {FC} from 'react';
import {ProgressBar} from './ProgressBar.js';

const ProgressBarDemo: FC = () => {
  return (
    <div className="space-y-6 p-4">
      <h2 className="text-2xl font-bold">ProgressBar Component</h2>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Basic Progress Bar</h3>
        <div className="space-y-4">
          <ProgressBar value={25} max={100} />
          <ProgressBar value={50} max={100} />
          <ProgressBar value={75} max={100} />
          <ProgressBar value={100} max={100} />
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Different Sizes</h3>
        <div className="space-y-4">
          <ProgressBar value={60} max={100} size="sm" />
          <ProgressBar value={60} max={100} size="md" />
          <ProgressBar value={60} max={100} size="lg" />
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Variants</h3>
        <div className="space-y-4">
          <ProgressBar value={30} max={100} variant="default" />
          <ProgressBar value={60} max={100} variant="success" />
          <ProgressBar value={80} max={100} variant="warning" />
          <ProgressBar value={90} max={100} variant="danger" />
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">With Labels and Percentage</h3>
        <div className="space-y-4">
          <ProgressBar value={45} max={100} showLabel showPercentage />
          <ProgressBar value={67} max={100} showPercentage />
          <ProgressBar value={89} max={100} showLabel />
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Goal Progress Examples</h3>
        <div className="space-y-6">
          <div>
            <h4 className="font-medium mb-2">Daily Chores</h4>
            <ProgressBar value={3} max={5} variant="success" showPercentage />
          </div>

          <div>
            <h4 className="font-medium mb-2">Weekly Goal</h4>
            <ProgressBar value={7} max={10} variant="warning" showPercentage />
          </div>

          <div>
            <h4 className="font-medium mb-2">Monthly Challenge</h4>
            <ProgressBar value={15} max={30} variant="danger" showPercentage />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Custom Values</h3>
        <div className="space-y-4">
          <ProgressBar value={2} max={3} />
          <ProgressBar value={7} max={12} />
          <ProgressBar value={150} max={200} />
          <ProgressBar value={0} max={10} />
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Custom Styling</h3>
        <ProgressBar
          value={75}
          max={100}
          className="bg-gradient-to-r from-purple-500 to-pink-500 p-4 rounded-lg"
        />
      </div>
    </div>
  );
};

export default ProgressBarDemo;
