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
import {CheckCircleIcon, ClockIcon, DocIcon} from '../widgets/icons';
import {FormattedMessage, useIntl} from 'react-intl';

const Dashboard: FC = () => {
  const {user} = useUser();
  const intl = useIntl();

  const {data: choresResponse, isLoading: choresLoading} = useQuery({
    queryKey: ['chores', 'dashboard'],
    queryFn: async () => choresApi.getAll({limit: 10}),
    enabled: Boolean(user),
  });

  const chores = choresResponse?.data ?? [];

  const getCompletedChoresCount = () =>
    chores.filter((chore: ChoreWithUsername) => chore.status === 'completed')
      .length;
  const getPendingChoresCount = () =>
    chores.filter((chore: ChoreWithUsername) => chore.status === 'pending')
      .length;
  const getTotalPoints = () =>
    chores
      .filter(
        (chore: ChoreWithUsername) =>
          chore.status === 'completed' || chore.status === 'approved',
      )
      .reduce(
        (sum: number, chore: ChoreWithUsername) => sum + chore.point_reward,
        0,
      );
  const getDueSoonChoresCount = () =>
    chores.filter((chore: ChoreWithUsername) => {
      if (chore.due_date === undefined) {
        return false;
      }
      const dueDate = new Date(chore.due_date);
      const now = new Date();
      const diffTime = dueDate.getTime() - now.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays <= 3 && diffDays >= 0;
    }).length;

  if (choresLoading) {
    return (
      <PageContainer variant="centered">
        <PageLoading
          message={intl.formatMessage({
            id: 'dashboard.loading',
            defaultMessage: 'Loading dashboard...',
          })}
        />
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageHeader title={intl.formatMessage({id: 'nav.dashboard', defaultMessage: 'Dashboard'})} />

      <GridContainer cols={4} gap="lg">
        <StatCard
          color="blue"
          icon={<CheckCircleIcon />}
          label={intl.formatMessage({
            id: 'dashboard.completed',
            defaultMessage: 'Completed Chores',
          })}
          value={getCompletedChoresCount()}
        />

        <StatCard
          color="yellow"
          icon={<ClockIcon />}
          label={intl.formatMessage({
            id: 'dashboard.pending',
            defaultMessage: 'Pending Chores',
          })}
          value={getPendingChoresCount()}
        />

        <StatCard
          color="green"
          icon={<DocIcon />}
          label={intl.formatMessage({
            id: 'dashboard.totalPoints',
            defaultMessage: 'Total Points',
          })}
          value={getTotalPoints()}
        />

        <StatCard
          color="red"
          icon={<ClockIcon />}
          label={intl.formatMessage({
            id: 'dashboard.dueSoon',
            defaultMessage: 'Due Soon',
          })}
          value={getDueSoonChoresCount()}
        />
      </GridContainer>

      <Card
        header={
          <Text as="h2" size="xl" weight="medium">
            <FormattedMessage
              id="dashboard.recentChores"
              defaultMessage="Recent Chores"
            />
          </Text>
        }
      >
        {chores.map((chore: ChoreWithUsername) => (
          <ListRow
            description={
              <Text as="span" muted size="sm">
                {chore.description ??
                  intl.formatMessage({
                    id: 'dashboard.noDescription',
                    defaultMessage: 'No description',
                  })}
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
