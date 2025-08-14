import {FC} from 'react';
import {useQuery} from '@tanstack/react-query';
import {leaderboardApi} from '../lib/api.js';
import {PageContainer} from '../widgets/PageContainer.js';
import {PageHeader} from '../widgets/PageHeader.js';
import {Podium} from '../widgets/Podium.js';
import {RankingList} from '../widgets/RankingList.js';
import {PageLoading} from '../widgets/PageLoading.js';
import {Text} from '../widgets/Text.js';

const Leaderboard: FC = () => {
  const {data: leaderboardResponse, isLoading} = useQuery({
    queryKey: ['leaderboard'],
    queryFn: () => leaderboardApi.get({limit: 10, sortBy: 'points'}),
  });

  const leaderboard = leaderboardResponse?.data?.leaderboard || [];
  const sortBy = leaderboardResponse?.data?.sortBy || 'points';

  if (isLoading) {
    return (
      <PageContainer variant="centered">
        <PageLoading message="Loading leaderboard..." />
      </PageContainer>
    );
  }

  const podiumItems = leaderboard.slice(0, 3).map((entry, index) => ({
    id: entry.id,
    rank: index + 1,
    content: (
      <>
        <Text as="h3" size="lg" weight="semibold">
          {entry.username}
        </Text>
        <Text muted>{entry.points} points</Text>
        <Text size="sm" muted>
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
        title="Full Rankings"
        subtitle={`Sorted by ${sortBy === 'points' ? 'total points' : 'streak count'}`}
      />
    </PageContainer>
  );
};

export default Leaderboard;
