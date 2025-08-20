import type {FC} from 'react';
import {useQuery} from '@tanstack/react-query';
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

const Chores: FC = () => {
  const {user} = useUser();
  const intl = useIntl();

  const {data: choresResponse, isLoading} = useQuery({
    queryKey: ['chores'],
    queryFn: async () => choresApi.getAll(),
    enabled: Boolean(user),
  });

  const chores = choresResponse?.data ?? [];

  if (isLoading) {
    return (
      <PageContainer variant="centered">
        <PageLoading
          message={intl.formatMessage({
            id: 'chores.loading',
            defaultMessage: 'Loading chores...',
          })}
        />
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

  const renderStatusBadge = (status: ChoreWithUsername['status']) => {
    if (status === 'completed') {
      return (
        <Badge variant="success">
          <FormattedMessage
            defaultMessage="Completed"
            id="chores.status.completed"
          />
        </Badge>
      );
    }
    if (status === 'approved') {
      return (
        <Badge variant="info">
          <FormattedMessage
            defaultMessage="Approved"
            id="chores.status.approved"
          />
        </Badge>
      );
    }
    return (
      <Badge variant="warning">
        <FormattedMessage defaultMessage="Pending" id="chores.status.pending" />
      </Badge>
    );
  };

  return (
    <PageContainer>
      <PageHeader
        title={intl.formatMessage({id: 'nav.chores', defaultMessage: 'Chores'})}
      />

      <List>
        {chores.map((chore: ChoreWithUsername) => (
          <ListRow
            description={chore.description}
            key={chore.id}
            left={renderStatusDot(chore.status)}
            meta={
              <InlineMeta>
                <span>
                  {intl.formatMessage(
                    {
                      id: 'chores.pointsWithValue',
                      defaultMessage: 'Points: {points}',
                    },
                    {points: chore.point_reward},
                  )}
                </span>

                {chore.bonus_points > 0 && (
                  <span>
                    {intl.formatMessage(
                      {
                        id: 'chores.bonusWithPoints',
                        defaultMessage: 'Bonus: +{points}',
                      },
                      {points: chore.bonus_points},
                    )}
                  </span>
                )}

                {chore.penalty_points > 0 && (
                  <span>
                    {intl.formatMessage(
                      {
                        id: 'chores.penaltyWithPoints',
                        defaultMessage: 'Penalty: -{points}',
                      },
                      {points: chore.penalty_points},
                    )}
                  </span>
                )}

                {typeof chore.due_date === 'string'
                && chore.due_date.length > 0 ? (
                  <span>
                    {intl.formatMessage(
                      {id: 'chores.dueWithDate', defaultMessage: 'Due: {date}'},
                      {date: new Date(chore.due_date).toLocaleDateString()},
                    )}
                  </span>
                ) : null}
              </InlineMeta>
            }
            right={
              chore.status === 'pending' ? (
                <Button size="sm" variant="primary">
                  <FormattedMessage
                    defaultMessage="Complete"
                    id="chores.complete"
                  />
                </Button>
              ) : undefined
            }
            title={chore.title}
            titleRight={
              <>
                {renderStatusBadge(chore.status)}

                {chore.chore_type === 'bonus' && (
                  <Badge variant="purple">
                    <FormattedMessage
                      defaultMessage="Bonus"
                      id="chores.type.bonus"
                    />
                  </Badge>
                )}
              </>
            }
          />
        ))}
      </List>
    </PageContainer>
  );
};

export default Chores;
