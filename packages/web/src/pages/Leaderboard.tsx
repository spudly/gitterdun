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
            id: 'leaderboard.loading',
            defaultMessage: 'Loading leaderboard...',
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
            {id: 'leaderboard.pointsLong', defaultMessage: '{count} points'},
            {count: entry.points},
          )}
        </Text>

        <Text muted size="sm">
          {intl.formatMessage(
            {id: 'leaderboard.choresCount', defaultMessage: '{count} chores'},
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
      {id: 'leaderboard.scoreAbbrev', defaultMessage: '{points} pts'},
      {points: entry.points},
    ),
    subtitle: (
      <>
        <span>
          {intl.formatMessage(
            {
              id: 'leaderboard.choresCompleted',
              defaultMessage: '{count} chores completed',
            },
            {count: entry.chores_completed},
          )}
        </span>

        <span>
          {intl.formatMessage(
            {
              id: 'leaderboard.badgesEarned',
              defaultMessage: '{count} badges earned',
            },
            {count: entry.badges_earned},
          )}
        </span>
      </>
    ),
    metadata: (
      <span>
        {intl.formatMessage(
          {id: 'leaderboard.dayStreak', defaultMessage: '{count} day streak'},
          {count: entry.streak_count},
        )}
      </span>
    ),
  }));

  return (
    <PageContainer>
      <PageHeader
        title={intl.formatMessage({
          id: 'nav.leaderboard',
          defaultMessage: 'Leaderboard',
        })}
      />

      <Podium items={podiumItems} />

      <RankingList
        items={rankingItems}
        subtitle={intl.formatMessage(
          {id: 'leaderboard.sortedBy', defaultMessage: 'Sorted by {criterion}'},
          {
            criterion: intl.formatMessage({
              id:
                sortBy === 'points'
                  ? 'leaderboard.sortedBy.totalPoints'
                  : 'leaderboard.sortedBy.streakCount',
              defaultMessage:
                sortBy === 'points' ? 'total points' : 'streak count',
            }),
          },
        )}
        title={intl.formatMessage({
          id: 'leaderboard.fullRankings',
          defaultMessage: 'Full Rankings',
        })}
      />
    </PageContainer>
  );
};

export default Leaderboard;
