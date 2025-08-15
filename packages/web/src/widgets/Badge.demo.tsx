import type {FC} from 'react';
import {Badge} from './Badge.js';

const BadgeDemo: FC = () => {
  return (
    <div className="space-x-2"
data-testid="BadgeDemo"
    >
      <Badge>Neutral</Badge>

      <Badge variant="success">Success</Badge>

      <Badge variant="info">Info</Badge>

      <Badge variant="warning">Warning</Badge>

      <Badge variant="danger">Danger</Badge>

      <Badge variant="purple">Bonus</Badge>
    </div>
  );
};

export default BadgeDemo;
