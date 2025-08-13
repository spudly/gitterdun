import {FC} from 'react';
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
        left={<StatusDot color="green" />}
        title="Dishwasher"
        description="Load and start"
        right={<Badge variant="success">completed</Badge>}
      />
      <ListRow
        left={<StatusDot color="yellow" />}
        title="Laundry"
        description="Fold clothes"
        right={<Button size="sm">Complete</Button>}
      />
      <ListRow
        left={<StatusDot color="blue" />}
        title="Homework"
        description="Math exercises"
        right={
          <>
            <Badge variant="purple">Bonus</Badge>
            <Badge variant="info">approved</Badge>
          </>
        }
      />
    </div>
  );
};

export default ListRowDemo;
