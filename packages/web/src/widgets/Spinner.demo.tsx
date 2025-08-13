import {FC} from 'react';
import {Spinner} from './Spinner.js';

const SpinnerDemo: FC = () => {
  return (
    <div className="space-x-4" data-testid="SpinnerDemo">
      <Spinner size="sm" inline />
      <Spinner size="md" inline />
      <Spinner size="lg" inline />
    </div>
  );
};

export default SpinnerDemo;
