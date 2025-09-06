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
import {CheckCircleIcon, ClockIcon, DocIcon} from '../widgets/icons/index.js';
import {FormattedMessage, useIntl} from 'react-intl';
import {DUE_SOON_THRESHOLD_DAYS} from '../constants.js';
import {differenceInDays} from 'date-fns';

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
      .reduce((sum: number, chore: ChoreWithUsername) => {
        const points = chore.reward_points ?? 0;
        return sum + points;
      }, 0);
  const getDueSoonChoresCount = () =>
    chores.filter((chore: ChoreWithUsername) => {
      if (chore.due_date === undefined) {
        return false;
      }
      const dueDate = new Date(chore.due_date);
      const now = new Date();
      const diffDays = differenceInDays(dueDate, now);
      return diffDays <= DUE_SOON_THRESHOLD_DAYS && diffDays >= 0;
    }).length;

  if (choresLoading) {
    return (
      <PageContainer variant="centered">
        <PageLoading
          message={intl.formatMessage({
            defaultMessage: 'Loading dashboard...',
            id: 'pages.Dashboard.loading-dashboard',
          })}
        />
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageHeader
        title={intl.formatMessage({
          defaultMessage: 'Dashboard',
          id: 'pages.Dashboard.dashboard',
        })}
      />

      <GridContainer cols={4} gap="lg">
        <StatCard
          color="blue"
          icon={<CheckCircleIcon />}
          label={intl.formatMessage({
            defaultMessage: 'Completed Chores',
            id: 'pages.Dashboard.completed-chores',
          })}
          value={getCompletedChoresCount()}
        />

        <StatCard
          color="yellow"
          icon={<ClockIcon />}
          label={intl.formatMessage({
            defaultMessage: 'Pending Chores',
            id: 'pages.Dashboard.pending-chores',
          })}
          value={getPendingChoresCount()}
        />

        <StatCard
          color="green"
          icon={<DocIcon />}
          label={intl.formatMessage({
            defaultMessage: 'Total Points',
            id: 'pages.Dashboard.total-points',
          })}
          value={getTotalPoints()}
        />

        <StatCard
          color="red"
          icon={<ClockIcon />}
          label={intl.formatMessage({
            defaultMessage: 'Due Soon',
            id: 'pages.Dashboard.due-soon',
          })}
          value={getDueSoonChoresCount()}
        />
      </GridContainer>

      <Card
        header={
          <Text as="h2" size="xl" weight="medium">
            <FormattedMessage
              defaultMessage="Recent Chores"
              id="pages.Dashboard.recent-chores"
            />
          </Text>
        }
      >
        {chores.map((chore: ChoreWithUsername) => (
          <ListRow
            description={
              <Text as="span" muted size="sm">
                {chore.description
                  ?? intl.formatMessage({
                    defaultMessage: 'No description',
                    id: 'pages.Dashboard.no-description',
                  })}
              </Text>
            }
            key={chore.id}
            right={
              <Text>
                {intl.formatMessage(
                  {
                    defaultMessage: '{points} pts',
                    id: 'pages.Leaderboard.points-pts',
                  },
                  {
                    points:
                      typeof chore.reward_points === 'number'
                        ? chore.reward_points
                        : 0,
                  },
                )}
              </Text>
            }
            title={chore.title}
          />
        ))}
      </Card>
    </PageContainer>
  );
};

export default Dashboard;
