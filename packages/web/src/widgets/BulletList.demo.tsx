import type {FC} from 'react';
import {BulletList} from './BulletList.js';
import {Text} from './Text.js';

const BulletListDemo: FC = () => {
  return (
    <div>
      <Text as="h2" size="lg" weight="semibold">
        BulletList
      </Text>

      <BulletList density="tight" indent="md">
        <li>First item</li>

        <li>Second item</li>

        <li>Third item</li>
      </BulletList>
    </div>
  );
};

export default BulletListDemo;
