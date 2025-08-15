import type {FC} from 'react';
import {Spinner} from './Spinner.js';

const SpinnerDemo: FC = () => {
  return (
    <div className="space-x-4"
data-testid="SpinnerDemo"
    >
      <Spinner inline
size="sm"
      />

      <Spinner inline
size="md"
      />

      <Spinner inline
size="lg"
      />
    </div>
  );
};

export default SpinnerDemo;
