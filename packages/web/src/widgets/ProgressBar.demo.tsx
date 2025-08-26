import type {FC} from 'react';
import {ProgressBar} from './ProgressBar.js';

const ProgressBarDemo: FC = () => {
  return (
    <div className="space-y-6 p-4">
      <h2 className="text-2xl font-bold">ProgressBar Component</h2>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Basic Progress Bar</h3>

        <div className="space-y-4">
          <ProgressBar max={100} value={25} />

          <ProgressBar max={100} value={50} />

          <ProgressBar max={100} value={75} />

          <ProgressBar max={100} value={100} />
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Different Sizes</h3>

        <div className="space-y-4">
          <ProgressBar max={100} size="sm" value={60} />

          <ProgressBar max={100} size="md" value={60} />

          <ProgressBar max={100} size="lg" value={60} />
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Variants</h3>

        <div className="space-y-4">
          <ProgressBar max={100} value={30} variant="default" />

          <ProgressBar max={100} value={60} variant="success" />

          <ProgressBar max={100} value={80} variant="warning" />

          <ProgressBar max={100} value={90} variant="danger" />
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">With Labels and Percentage</h3>

        <div className="space-y-4">
          <ProgressBar max={100} showLabel showPercentage value={45} />

          <ProgressBar max={100} showPercentage value={67} />

          <ProgressBar max={100} showLabel value={89} />
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Goal Progress Examples</h3>

        <div className="space-y-6">
          <div className="flex flex-col gap-2">
            <h4 className="font-medium">Daily Chores</h4>

            <ProgressBar max={5} showPercentage value={3} variant="success" />
          </div>

          <div className="flex flex-col gap-2">
            <h4 className="font-medium">Weekly Goal</h4>

            <ProgressBar max={10} showPercentage value={7} variant="warning" />
          </div>

          <div className="flex flex-col gap-2">
            <h4 className="font-medium">Monthly Challenge</h4>

            <ProgressBar max={30} showPercentage value={15} variant="danger" />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Custom Values</h3>

        <div className="space-y-4">
          <ProgressBar max={3} value={2} />

          <ProgressBar max={12} value={7} />

          <ProgressBar max={200} value={150} />

          <ProgressBar max={10} value={0} />
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Custom Styling</h3>

        <div className="rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 p-4">
          <ProgressBar max={100} padded value={75} />
        </div>
      </div>
    </div>
  );
};

export default ProgressBarDemo;
