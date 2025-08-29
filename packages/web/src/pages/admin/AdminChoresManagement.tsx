import type {FC} from 'react';
import {FormattedMessage, defineMessages, useIntl} from 'react-intl';
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
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {choresApi} from '../../lib/api.js';
import {familiesApi} from '../../lib/familiesApi.js';
import {useState} from 'react';
import {SelectInput} from '../../widgets/SelectInput.js';

type AdminChoresManagementProps = {readonly chores: Array<ChoreWithUsername>};

export const AdminChoresManagement: FC<AdminChoresManagementProps> = ({
  chores,
}) => {
  const intl = useIntl();
  const queryClient = useQueryClient();
  const [assigningChoreId, setAssigningChoreId] = useState<number | null>(null);
  const [selectedUsername, setSelectedUsername] = useState<string>('');
  const [assignedToMap, setAssignedToMap] = useState<Record<number, string>>({});

  const myFamilyQuery = useQuery({
    queryKey: ['family', 'mine'],
    queryFn: async () => familiesApi.myFamily(),
  });
  const familyId = (myFamilyQuery.data?.data as {id?: unknown} | null)?.id;
  const membersQuery = useQuery({
    queryKey: ['family', familyId, 'members'],
    queryFn: async () =>
      typeof familyId === 'number'
        ? familiesApi.listMembers(familyId)
        : {success: true, data: []},
    enabled: typeof familyId === 'number',
  });
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
  const assignMutation = useMutation({
    mutationFn: async (params: {choreId: number; username: string}) => {
      const entry = (membersQuery.data?.data as Array<
        {user_id: number; username: string; role: string}
      >).find(m => m.username === params.username);
      if (entry) {
        await choresApi.assign(params.choreId, {userId: entry.user_id});
      }
    },
    onSuccess: async (_data, variables) => {
      setAssignedToMap(prev => ({...prev, [variables.choreId]: variables.username}));
      setAssigningChoreId(null);
    },
  });

  const messages = defineMessages({
    header: {
      defaultMessage: 'Chores Management',
      id: 'pages.admin.AdminChoresManagement.chores-management',
    },
    pointsWithValue: {
      defaultMessage: 'Points: {points}',
      id: 'pages.admin.AdminChoresManagement.points-points',
    },
    bonusWithPoints: {
      defaultMessage: 'Bonus: +{points}',
      id: 'pages.admin.AdminChoresManagement.bonus-points',
    },
    penaltyWithPoints: {
      defaultMessage: 'Penalty: -{points}',
      id: 'pages.admin.AdminChoresManagement.penalty-points',
    },
    dueWithDate: {
      defaultMessage: 'Due: {date}',
      id: 'pages.admin.AdminChoresManagement.due-date',
    },
    approve: {
      defaultMessage: 'Approve',
      id: 'pages.admin.AdminChoresManagement.approve',
    },
    reject: {
      defaultMessage: 'Reject',
      id: 'pages.admin.AdminChoresManagement.reject',
    },
    edit: {
      defaultMessage: 'Edit',
      id: 'pages.admin.AdminChoresManagement.edit',
    },
    statusCompleted: {
      defaultMessage: 'Completed',
      id: 'pages.admin.AdminChoresManagement.completed',
    },
    statusApproved: {
      defaultMessage: 'Approved',
      id: 'pages.admin.AdminChoresManagement.approved',
    },
    statusPending: {
      defaultMessage: 'Pending',
      id: 'pages.admin.AdminChoresManagement.pending',
    },
    typeBonus: {
      defaultMessage: 'Bonus',
      id: 'pages.admin.AdminChoresManagement.bonus',
    },
  });

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
                  <span>{`Assigned to: ${assignedToMap[chore.id]}`}</span>
                ) : null}
              </InlineMeta>
            }
            right={
              <Toolbar>
                <Button
                  onClick={() => {
                    setAssigningChoreId(chore.id);
                  }}
                  size="sm"
                  variant="secondary"
                >
                  <FormattedMessage
                    defaultMessage="Assign"
                    id="pages.admin.AdminChoresManagement.assign"
                  />
                </Button>

                {assigningChoreId === chore.id ? (
                  <>
                    <SelectInput
                      onChange={val => setSelectedUsername(val)}
                      value={selectedUsername}
                    >
                      <option value="" />
                      {((membersQuery.data?.data as Array<
                        {user_id: number; username: string; role: string}
                      >) ?? [])
                        .filter(m => m.role === 'child')
                        .map(member => (
                          <option key={member.user_id} value={member.username}>
                            {member.username}
                          </option>
                        ))}
                    </SelectInput>
                    <Button
                      onClick={() => {
                        if (selectedUsername !== '') {
                          assignMutation.mutate({
                            choreId: chore.id,
                            username: selectedUsername,
                          });
                        }
                      }}
                      size="sm"
                      variant="primary"
                    >
                      <FormattedMessage
                        defaultMessage="Assign Chore"
                        id="pages.admin.AdminChoresManagement.assign-chore"
                      />
                    </Button>
                  </>
                ) : null}
                {chore.status === 'completed' && (
                  <>
                    <Button
                      onClick={() => approveMutation.mutate(chore.id)}
                      size="sm"
                      variant="primary"
                    >
                      <FormattedMessage {...messages.approve} />
                    </Button>

                    <Button
                      onClick={() => rejectMutation.mutate(chore.id)}
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
