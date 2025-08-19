import type {FC} from 'react';
import {useQuery} from '@tanstack/react-query';
import {leaderboardApi} from '../lib/api.js';
import {PageContainer} from '../widgets/PageContainer.js';
import {PageHeader} from '../widgets/PageHeader.js';
import {Podium} from '../widgets/Podium.js';
import {RankingList} from '../widgets/RankingList.js';
import {PageLoading} from '../widgets/PageLoading.js';
import {Text} from '../widgets/Text.js';

const Leaderboard: FC = () => {
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
        <PageLoading message="Loading leaderboard..." />
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

        <Text muted>{entry.points} points</Text>

        <Text muted size="sm">
          {entry.chores_completed} chores
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
    score: `${entry.points} pts`,
    subtitle: (
      <>
        <span>{entry.chores_completed} chores completed</span>

        <span>{entry.badges_earned} badges earned</span>
      </>
    ),
    metadata: <span>{entry.streak_count} day streak</span>,
  }));

  return (
    <PageContainer>
      <PageHeader title="Leaderboard" />

      <Podium items={podiumItems} />

      <RankingList
        items={rankingItems}
        subtitle={`Sorted by ${sortBy === 'points' ? 'total points' : 'streak count'}`}
        title="Full Rankings"
      />
    </PageContainer>
  );
};

export default Leaderboard;
