import type {FC} from 'react';
import {
  RegistrationFormExample,
  LoginFormExample,
  LargeFormExample,
} from './demo-utils/FormCardExamples.js';
const FormCardDemo: FC = () => {
  return (
    <div className="space-y-6 p-4">
      <h2 className="text-2xl font-bold">FormCard Component</h2>
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Default Size with Title</h3>
        <RegistrationFormExample />
      </div>
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Small Size</h3>
        <LoginFormExample />
      </div>
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Large Size</h3>
        <LargeFormExample />
      </div>
    </div>
  );
};
export default FormCardDemo;
