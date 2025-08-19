import type {FC} from 'react';
import {
  VariantsExample,
  SizesExample,
  StatesExample,
} from './demo-utils/IconButtonExamples.js';

const IconButtonDemo: FC = () => {
  return (
    <div className="space-y-6 p-4">
      <h2 className="text-2xl font-bold">IconButton Component</h2>
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">All Variants</h3>
        <VariantsExample />
      </div>
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Different Sizes</h3>
        <SizesExample />
      </div>
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Button States</h3>
        <StatesExample />
      </div>
    </div>
  );
};

export default IconButtonDemo;
