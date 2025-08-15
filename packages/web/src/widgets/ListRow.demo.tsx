import type {FC} from 'react';
import {ListRow} from './ListRow.js';
import {StatusDot} from './StatusDot.js';
import {Badge} from './Badge.js';
import {Button} from './Button.js';

const ListRowDemo: FC = () => {
  return (
    <div
      className="divide-y divide-gray-200 bg-white rounded shadow"
      data-testid="ListRowDemo"
    >
      <ListRow
        description="Load and start"
        left={<StatusDot color="green" />}
        right={<Badge variant="success">completed</Badge>}
        title="Dishwasher"
      />

      <ListRow
        description="Fold clothes"
        left={<StatusDot color="yellow" />}
        right={<Button size="sm">Complete</Button>}
        title="Laundry"
      />

      <ListRow
        description="Math exercises"
        left={<StatusDot color="blue" />}
        right={
          <>
            <Badge variant="purple">Bonus</Badge>

            <Badge variant="info">approved</Badge>
          </>
        }
        title="Homework"
      />
    </div>
  );
};

export default ListRowDemo;
