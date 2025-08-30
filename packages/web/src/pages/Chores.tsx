import type {FC} from 'react';
import {useQuery, useQueryClient} from '@tanstack/react-query';
import type {ChoreWithUsername} from '@gitterdun/shared';
import {choresApi} from '../lib/api.js';
import {useUser} from '../hooks/useUser.js';
import {PageContainer} from '../widgets/PageContainer.js';
import {PageHeader} from '../widgets/PageHeader.js';
import {List} from '../widgets/List.js';
import {ListRow} from '../widgets/ListRow.js';
import {StatusDot} from '../widgets/StatusDot.js';
import {Badge} from '../widgets/Badge.js';
import {InlineMeta} from '../widgets/InlineMeta.js';
import {Button} from '../widgets/Button.js';
import {PageLoading} from '../widgets/PageLoading.js';
import {FormattedMessage, useIntl} from 'react-intl';
import {choresMessages as messages} from './chores.messages.js';

// messages imported

const Chores: FC = () => {
  const {user} = useUser();
  const intl = useIntl();
  const queryClient = useQueryClient();

  const {data: choresResponse, isLoading} = useQuery({
    queryKey: ['chores', user?.id],
    queryFn: async () =>
      choresApi.getAll({
        user_id: user!.id,
        sort_by: 'start_date',
        order: 'asc',
      }),
    enabled: Boolean(user),
  });

  const chores = choresResponse?.data ?? [];

  // keep for potential future optimistic update flows

  if (isLoading) {
    return (
      <PageContainer variant="centered">
        <PageLoading message={intl.formatMessage(messages.loading)} />
      </PageContainer>
    );
  }

  const renderStatusDot = (status: ChoreWithUsername['status']) => {
    if (status === 'completed') {
      return <StatusDot color="green" />;
    }
    if (status === 'approved') {
      return <StatusDot color="blue" />;
    }
    return <StatusDot color="yellow" />;
  };

  const renderStatusText = (status: ChoreWithUsername['status']): string => {
    if (status === 'completed') {
      return intl.formatMessage(messages.statusCompleted);
    }
    if (status === 'approved') {
      return intl.formatMessage(messages.statusApproved);
    }
    return intl.formatMessage(messages.statusPending);
  };

  return (
    <PageContainer>
      <PageHeader title={intl.formatMessage(messages.header)} />

      <div data-testid="chores-list">
        <List>
          {chores.map((chore: ChoreWithUsername) => (
            <ListRow
              description={chore.description}
              key={chore.id}
              left={renderStatusDot(chore.status)}
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
                </InlineMeta>
              }
              right={
                chore.status === 'pending' ? (
                  <Button
                    onClick={() => {
                      const run = async () => {
                        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- guarded by enabled
                        await choresApi.complete(chore.id, {userId: user!.id});
                        await queryClient.invalidateQueries({
                          queryKey: ['chores', user?.id],
                        });
                      };
                      run().catch(() => {});
                    }}
                    size="sm"
                    variant="primary"
                  >
                    <FormattedMessage {...messages.complete} />
                  </Button>
                ) : chore.status === 'completed' ? (
                  <>
                    <Button size="sm" variant="primary">
                      <FormattedMessage
                        defaultMessage="Approve"
                        id="pages.admin.AdminChoresManagement.approve"
                      />
                    </Button>
                    <Button size="sm" variant="danger">
                      <FormattedMessage
                        defaultMessage="Reject"
                        id="pages.admin.AdminChoresManagement.reject"
                      />
                    </Button>
                  </>
                ) : undefined
              }
              title={chore.title}
              titleRight={
                <>
                  {renderStatusText(chore.status)}

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
      </div>
    </PageContainer>
  );
};

export default Chores;
