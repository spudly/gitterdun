import {FC, useState} from 'react';
import {Button} from './Button.js';

const ButtonDemo: FC = () => {
  const [loading, setLoading] = useState(false);
  return (
    <div className="space-y-6" data-testid="ButtonDemo">
      <div className="space-x-2">
        <Button>Default</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="danger">Danger</Button>
        <Button variant="ghost">Ghost</Button>
      </div>
      <div className="space-x-2">
        <Button size="sm">Small</Button>
        <Button size="md">Medium</Button>
        <Button size="lg">Large</Button>
      </div>
      <div className="space-x-2">
        <Button disabled>Disabled</Button>
        <Button loading={loading} onClick={() => setLoading(v => !v)}>
          Toggle Loading
        </Button>
      </div>
      <div className="space-x-2">
        <Button leftIcon={<span aria-label="left">◀</span>}>Left Icon</Button>
        <Button rightIcon={<span aria-label="right">▶</span>}>
          Right Icon
        </Button>
      </div>
      <div>
        <Button fullWidth>Full width</Button>
      </div>
    </div>
  );
};

export default ButtonDemo;
