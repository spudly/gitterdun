import {FC} from 'react';
import {AvatarCircle} from './AvatarCircle.js';

const AvatarCircleDemo: FC = () => {
  return (
    <div className="flex items-center gap-3" data-testid="AvatarCircleDemo">
      <AvatarCircle label="John Doe" />
      <AvatarCircle label="Jane Smith" size="lg" />
      <AvatarCircle label="Kid A" emoji="👦" ring />
    </div>
  );
};

export default AvatarCircleDemo;
