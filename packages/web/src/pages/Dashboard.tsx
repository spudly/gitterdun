import type {FC} from 'react';
import {useQuery} from '@tanstack/react-query';
import type {ChoreWithUsername} from '@gitterdun/shared';
import {choresApi} from '../lib/api.js';
import {useUser} from '../hooks/useUser.js';
import {PageContainer} from '../widgets/PageContainer.js';
import {PageHeader} from '../widgets/PageHeader.js';
import {GridContainer} from '../widgets/GridContainer.js';
import {StatCard} from '../widgets/StatCard.js';
import {Card} from '../widgets/Card.js';
import {ListRow} from '../widgets/ListRow.js';
import {Text} from '../widgets/Text.js';
import {PageLoading} from '../widgets/PageLoading.js';
import {CheckCircleIcon, ClockIcon, DocIcon} from '../widgets/icons.js';

const Dashboard: FC = () => {
  const {user} = useUser();

  const {data: choresResponse, isLoading: choresLoading} = useQuery({
    queryKey: ['chores', 'dashboard'],
    queryFn: async () => choresApi.getAll({limit: 10}),
    enabled: !!user,
  });

  const chores = choresResponse?.data ?? [];

  const getCompletedChoresCount = () =>
    chores.filter((c: ChoreWithUsername) => c.status === 'completed').length;
  const getPendingChoresCount = () =>
    chores.filter((c: ChoreWithUsername) => c.status === 'pending').length;
  const getTotalPoints = () =>
    chores
      .filter(
        (c: ChoreWithUsername) =>
          c.status === 'completed' || c.status === 'approved',
      )
      .reduce((sum: number, c: ChoreWithUsername) => sum + c.point_reward, 0);
  const getDueSoonChoresCount = () =>
    chores.filter((c: ChoreWithUsername) => {
      if (c.due_date == null) {
        return false;
      }
      const dueDate = new Date(c.due_date);
      const now = new Date();
      const diffTime = dueDate.getTime() - now.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays <= 3 && diffDays >= 0;
    }).length;

  if (choresLoading) {
    return (
      <PageContainer variant="centered">
        <PageLoading message="Loading dashboard..." />
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageHeader title="Dashboard" />

      <GridContainer cols={4} gap="lg">
        <StatCard
          color="blue"
          icon={<CheckCircleIcon />}
          label="Completed Chores"
          value={getCompletedChoresCount()}
        />

        <StatCard
          color="yellow"
          icon={<ClockIcon />}
          label="Pending Chores"
          value={getPendingChoresCount()}
        />

        <StatCard
          color="green"
          icon={<DocIcon />}
          label="Total Points"
          value={getTotalPoints()}
        />

        <StatCard
          color="red"
          icon={<ClockIcon />}
          label="Due Soon"
          value={getDueSoonChoresCount()}
        />
      </GridContainer>

      <Card
        header={
          <Text as="h2" size="xl" weight="medium">
            Recent Chores
          </Text>
        }
      >
        {chores.map((chore: ChoreWithUsername) => (
          <ListRow
            description={
              <Text as="span" muted size="sm">
                {chore.description ?? 'No description'}
              </Text>
            }
            key={chore.id}
            right={<Text>{chore.point_reward} pts</Text>}
            title={chore.title}
          />
        ))}
      </Card>
    </PageContainer>
  );
};

export default Dashboard;
