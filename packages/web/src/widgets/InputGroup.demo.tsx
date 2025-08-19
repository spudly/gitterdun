import type {FC} from 'react';
import {
  VerticalLayoutExample,
  HorizontalLayoutExample,
  ErrorStatesExample,
} from './demo-utils/InputGroupExamples.js';

const InputGroupDemo: FC = () => {
  return (
    <div className="space-y-6 p-4">
      <h2 className="text-2xl font-bold">InputGroup Component</h2>
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Vertical Layout (Default)</h3>
        <VerticalLayoutExample />
      </div>
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Horizontal Layout</h3>
        <HorizontalLayoutExample />
      </div>
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">With Error States</h3>
        <ErrorStatesExample />
      </div>
    </div>
  );
};
export default InputGroupDemo;
