import type {FC} from 'react';
import type {ChoreWithUsername} from '@gitterdun/shared';
import {Card} from '../../widgets/Card.js';
import {List} from '../../widgets/List.js';
import {ListRow} from '../../widgets/ListRow.js';
import {StatusDot} from '../../widgets/StatusDot.js';
import {StatusBadge} from '../../widgets/StatusBadge.js';
import {Badge} from '../../widgets/Badge.js';
import {Button} from '../../widgets/Button.js';
import {Text} from '../../widgets/Text.js';
import {Toolbar} from '../../widgets/Toolbar.js';
import {InlineMeta} from '../../widgets/InlineMeta.js';

type AdminChoresManagementProps = {readonly chores: Array<ChoreWithUsername>};

export const AdminChoresManagement: FC<AdminChoresManagementProps> = ({
  chores,
}) => {
  return (
    <Card
      header={
        <Text as="h2" size="lg" weight="medium">
          Chores Management
        </Text>
      }
    >
      <List>
        {chores.map((chore: ChoreWithUsername) => (
          <ListRow
            description={chore.description}
            key={chore.id}
            left={
              <StatusDot
                color={
                  chore.status === 'completed'
                    ? 'green'
                    : chore.status === 'approved'
                      ? 'blue'
                      : 'yellow'
                }
                size={12}
              />
            }
            meta={
              <InlineMeta>
                <span>Points: {chore.point_reward}</span>

                {chore.bonus_points > 0 && (
                  <span>Bonus: +{chore.bonus_points}</span>
                )}

                {chore.penalty_points > 0 && (
                  <span>Penalty: -{chore.penalty_points}</span>
                )}

                {typeof chore.due_date === 'string'
                && chore.due_date.length > 0 ? (
                  <span>
                    Due: {new Date(chore.due_date).toLocaleDateString()}
                  </span>
                ) : null}
              </InlineMeta>
            }
            right={
              <Toolbar>
                {chore.status === 'completed' && (
                  <>
                    <Button size="sm" variant="primary">
                      Approve
                    </Button>

                    <Button size="sm" variant="danger">
                      Reject
                    </Button>
                  </>
                )}

                <Button size="sm" variant="secondary">
                  Edit
                </Button>
              </Toolbar>
            }
            title={chore.title}
            titleRight={
              <>
                <StatusBadge
                  status={
                    chore.status === 'completed'
                      ? 'completed'
                      : chore.status === 'approved'
                        ? 'approved'
                        : 'pending'
                  }
                >
                  {chore.status}
                </StatusBadge>

                {chore.chore_type === 'bonus' && (
                  <Badge variant="purple">Bonus</Badge>
                )}
              </>
            }
          />
        ))}
      </List>
    </Card>
  );
};
