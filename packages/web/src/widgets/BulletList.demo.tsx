import {FC} from 'react';
import {BulletList} from './BulletList.js';
import {Text} from './Text.js';

const BulletListDemo: FC = () => {
  return (
    <div>
      <Text as="h2" size="lg" weight="semibold">
        BulletList
      </Text>
      <BulletList indent="md" density="tight">
        <li>First item</li>
        <li>Second item</li>
        <li>Third item</li>
      </BulletList>
    </div>
  );
};

export default BulletListDemo;
