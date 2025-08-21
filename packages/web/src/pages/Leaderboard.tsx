import type {FC} from 'react';
import {useQuery} from '@tanstack/react-query';
import {leaderboardApi} from '../lib/api.js';
import {PageContainer} from '../widgets/PageContainer.js';
import {PageHeader} from '../widgets/PageHeader.js';
import {Podium} from '../widgets/Podium.js';
import {RankingList} from '../widgets/RankingList.js';
import {PageLoading} from '../widgets/PageLoading.js';
import {Text} from '../widgets/Text.js';
import {useIntl} from 'react-intl';

const Leaderboard: FC = () => {
  const intl = useIntl();
  const {
    data: leaderboardResponse,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['leaderboard'],
    queryFn: async () => leaderboardApi.get({limit: 10, sortBy: 'points'}),
  });
  if (error) {
    console.error(error instanceof Error ? error : new Error(String(error))); // eslint-disable-line no-console -- dev logging only
  }

  const leaderboard = leaderboardResponse?.data?.leaderboard ?? [];
  const sortBy = leaderboardResponse?.data?.sortBy ?? 'points';

  if (isLoading) {
    return (
      <PageContainer variant="centered">
        <PageLoading
          message={intl.formatMessage({
            defaultMessage: 'Loading leaderboard...',
            id: 'pages.Leaderboard.loading-leaderboard',
          })}
        />
      </PageContainer>
    );
  }

  const podiumItems = leaderboard.slice(0, 3).map((entry, index) => ({
    id: entry.id,
    // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion -- it's hard to reconcile this type with both typescript and the eslint error
    rank: (index + 1) as 1 | 2 | 3,
    content: (
      <>
        <Text as="h3" size="lg" weight="semibold">
          {entry.username}
        </Text>

        <Text muted>
          {intl.formatMessage(
            {
              defaultMessage: '{count} points',
              id: 'pages.Leaderboard.count-points',
            },
            {count: entry.points},
          )}
        </Text>

        <Text muted size="sm">
          {intl.formatMessage(
            {
              defaultMessage: '{count} chores',
              id: 'pages.Leaderboard.count-chores',
            },
            {count: entry.chores_completed},
          )}
        </Text>
      </>
    ),
  }));

  const rankingItems = leaderboard.map(entry => ({
    id: entry.id,
    rank: entry.rank,
    content: (
      <Text as="h3" size="sm" weight="medium">
        {entry.username}
      </Text>
    ),
    score: intl.formatMessage(
      {defaultMessage: '{points} pts', id: 'pages.Leaderboard.points-pts'},
      {points: entry.points},
    ),
    subtitle: (
      <>
        <span>
          {intl.formatMessage(
            {
              defaultMessage: '{count} chores completed',
              id: 'pages.Leaderboard.count-chores-completed',
            },
            {count: entry.chores_completed},
          )}
        </span>

        <span>
          {intl.formatMessage(
            {
              defaultMessage: '{count} badges earned',
              id: 'pages.Leaderboard.count-badges-earned',
            },
            {count: entry.badges_earned},
          )}
        </span>
      </>
    ),
    metadata: (
      <span>
        {intl.formatMessage(
          {
            defaultMessage: '{count} day streak',
            id: 'pages.Leaderboard.count-day-streak',
          },
          {count: entry.streak_count},
        )}
      </span>
    ),
  }));

  return (
    <PageContainer>
      <PageHeader
        title={intl.formatMessage({
          defaultMessage: 'Leaderboard',
          id: 'pages.Leaderboard.leaderboard',
        })}
      />

      <Podium items={podiumItems} />

      <RankingList
        items={rankingItems}
        subtitle={intl.formatMessage(
          {
            defaultMessage: 'Sorted by {criterion}',
            id: 'pages.Leaderboard.sorted-by-criterion',
          },
          {
            criterion:
              sortBy === 'points'
                ? intl.formatMessage({
                    defaultMessage: 'total points',
                    id: 'pages.Leaderboard.total-points',
                  })
                : intl.formatMessage({
                    defaultMessage: 'streak count',
                    id: 'pages.Leaderboard.streak-count',
                  }),
          },
        )}
        title={intl.formatMessage({
          defaultMessage: 'Full Rankings',
          id: 'pages.Leaderboard.full-rankings',
        })}
      />
    </PageContainer>
  );
};

export default Leaderboard;
