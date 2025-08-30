import type {FC} from 'react';
import {FormattedMessage, useIntl} from 'react-intl';
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
import {useMutation, useQueryClient} from '@tanstack/react-query';
import {choresApi} from '../../lib/api.js';
import {useState} from 'react';
import {AdminAssignControls} from './AdminAssignControls.js';
import {adminChoresMessages as messages} from './AdminChoresMessages.js';

type AdminChoresManagementProps = {readonly chores: Array<ChoreWithUsername>};

export const AdminChoresManagement: FC<AdminChoresManagementProps> = ({
  chores,
}) => {
  const intl = useIntl();
  const queryClient = useQueryClient();
  // retained state for future inline assignment UX; currently unused
  const [assignedToMap, setAssignedToMap] = useState<Record<number, string>>(
    {},
  );

  // assignment queries are handled in AdminAssignControls
  const approveMutation = useMutation({
    mutationFn: async (id: number) => choresApi.approve(id, {approvedBy: 1}),
    onSuccess: async () => {
      await queryClient.invalidateQueries({queryKey: ['chores', 'admin']});
    },
  });
  const rejectMutation = useMutation({
    mutationFn: async (id: number) => choresApi.reject(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({queryKey: ['chores', 'admin']});
    },
  });
  const handleAssigned = (choreId: number, username: string) => {
    setAssignedToMap(prev => ({...prev, [choreId]: username}));
  };

  // messages imported

  return (
    <Card
      header={
        <Text as="h2" size="lg" weight="medium">
          {intl.formatMessage(messages.header)}
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
                <span>
                  {intl.formatMessage(messages.pointsWithValue, {
                    points: chore.point_reward,
                  })}
                </span>

                {chore.bonus_points > 0 && (
                  <span>
                    {intl.formatMessage(messages.bonusWithPoints, {
                      points: chore.bonus_points,
                    })}
                  </span>
                )}

                {chore.penalty_points > 0 && (
                  <span>
                    {intl.formatMessage(messages.penaltyWithPoints, {
                      points: chore.penalty_points,
                    })}
                  </span>
                )}

                {typeof chore.due_date === 'string'
                && chore.due_date.length > 0 ? (
                  <span>
                    {intl.formatMessage(messages.dueWithDate, {
                      date: new Date(chore.due_date).toLocaleDateString(),
                    })}
                  </span>
                ) : null}

                {assignedToMap[chore.id] !== undefined ? (
                  <span>
                    <FormattedMessage
                      defaultMessage="Assigned to: {username}"
                      id="pages.admin.AdminChoresManagement.assigned-to"
                      values={{username: assignedToMap[chore.id]}}
                    />
                  </span>
                ) : null}
              </InlineMeta>
            }
            right={
              <Toolbar>
                <AdminAssignControls
                  choreId={chore.id}
                  onAssigned={username => {
                    handleAssigned(chore.id, username);
                  }}
                />
                {chore.status === 'completed' && (
                  <>
                    <Button
                      onClick={() => {
                        approveMutation.mutate(chore.id);
                      }}
                      size="sm"
                      variant="primary"
                    >
                      <FormattedMessage {...messages.approve} />
                    </Button>

                    <Button
                      onClick={() => {
                        rejectMutation.mutate(chore.id);
                      }}
                      size="sm"
                      variant="danger"
                    >
                      <FormattedMessage {...messages.reject} />
                    </Button>
                  </>
                )}

                <Button size="sm" variant="secondary">
                  <FormattedMessage {...messages.edit} />
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
                  {chore.status === 'completed' ? (
                    <FormattedMessage {...messages.statusCompleted} />
                  ) : chore.status === 'approved' ? (
                    <FormattedMessage {...messages.statusApproved} />
                  ) : (
                    <FormattedMessage {...messages.statusPending} />
                  )}
                </StatusBadge>

                {chore.chore_type === 'bonus' && (
                  <Badge variant="purple">
                    <FormattedMessage {...messages.typeBonus} />
                  </Badge>
                )}
              </>
            }
          />
        ))}
      </List>
    </Card>
  );
};
