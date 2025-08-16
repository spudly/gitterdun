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

const Chores: FC = () => {
  const {user} = useUser();

  const {data: choresResponse, isLoading} = useQuery({
    queryKey: ['chores'],
    queryFn: async () => choresApi.getAll(),
    enabled: Boolean(user),
  });

  const chores = choresResponse?.data ?? [];

  if (isLoading) {
    return (
      <PageContainer variant="centered">
        <PageLoading message="Loading chores..." />
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
      return <Badge variant="success">completed</Badge>;
    }
    if (status === 'approved') {
      return <Badge variant="info">approved</Badge>;
    }
    return <Badge variant="warning">pending</Badge>;
  };

  return (
    <PageContainer>
      <PageHeader title="Chores" />

      <List>
        {chores.map((chore: ChoreWithUsername) => (
          <ListRow
            description={chore.description}
            key={chore.id}
            left={renderStatusDot(chore.status)}
            meta={
              <InlineMeta>
                <span>Points: {chore.point_reward}</span>

                {chore.bonus_points > 0 && (
                  <span>Bonus: +{chore.bonus_points}</span>
                )}

                {chore.penalty_points > 0 && (
                  <span>Penalty: -{chore.penalty_points}</span>
                )}

                {chore.due_date ?  (
                  <span>
                    Due: {new Date(chore.due_date).toLocaleDateString()}
                  </span>
                ) : null}
              </InlineMeta>
            }
            right={
              chore.status === 'pending' ? (
                <Button size="sm" variant="primary">
                  Complete
                </Button>
              ) : undefined
            }
            title={chore.title}
            titleRight={
              <>
                {renderStatusBadge(chore.status)}

                {chore.chore_type === 'bonus' && (
                  <Badge variant="purple">Bonus</Badge>
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
