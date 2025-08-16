import type {FC} from 'react';
import type {RankingItem} from './RankingList.js';
import {RankingList} from './RankingList.js';

const RankingListDemo: FC = () => {
  const sampleRankings: Array<RankingItem> = [
    {
      id: 1,
      rank: 1,
      content: (
        <h3 className="text-sm font-medium text-gray-900">Alice Johnson</h3>
      ),
      score: '1250 pts',
      subtitle: <span>15 chores completed</span>,
      metadata: <span>7 day streak</span>,
    },
    {
      id: 2,
      rank: 2,
      content: <h3 className="text-sm font-medium text-gray-900">Bob Smith</h3>,
      score: '980 pts',
      subtitle: <span>12 chores completed</span>,
      metadata: <span>5 day streak</span>,
    },
    {
      id: 3,
      rank: 3,
      content: (
        <h3 className="text-sm font-medium text-gray-900">Charlie Brown</h3>
      ),
      score: '750 pts',
      subtitle: <span>10 chores completed</span>,
      metadata: <span>3 day streak</span>,
    },
    {
      id: 4,
      rank: 4,
      content: (
        <h3 className="text-sm font-medium text-gray-900">Diana Prince</h3>
      ),
      score: '650 pts',
      subtitle: <span>8 chores completed</span>,
      metadata: <span>2 day streak</span>,
    },
    {
      id: 5,
      rank: 5,
      content: (
        <h3 className="text-sm font-medium text-gray-900">Eve Wilson</h3>
      ),
      score: '520 pts',
      subtitle: <span>6 chores completed</span>,
      metadata: <span>1 day streak</span>,
    },
  ];

  const teamRankings: Array<RankingItem> = [
    {
      id: 'team-1',
      rank: 1,
      content: (
        <h3 className="text-sm font-medium text-gray-900">Team Alpha</h3>
      ),
      score: '95%',
      subtitle: <span>Weekly Challenge</span>,
      metadata: <span>5 members</span>,
    },
    {
      id: 'team-2',
      rank: 2,
      content: <h3 className="text-sm font-medium text-gray-900">Team Beta</h3>,
      score: '87%',
      subtitle: <span>Weekly Challenge</span>,
      metadata: <span>4 members</span>,
    },
    {
      id: 'team-3',
      rank: 3,
      content: (
        <h3 className="text-sm font-medium text-gray-900">Team Gamma</h3>
      ),
      score: '82%',
      subtitle: <span>Weekly Challenge</span>,
      metadata: <span>6 members</span>,
    },
  ];

  return (
    <div className="space-y-6 p-4">
      <h2 className="text-2xl font-bold">RankingList Component</h2>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Basic Ranking List</h3>

        <RankingList
          items={sampleRankings}
          subtitle="Sorted by total points"
          title="Full Rankings"
        />
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Team Rankings</h3>

        <RankingList
          items={teamRankings}
          subtitle="Weekly challenge results"
          title="Team Performance"
        />
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Without Ranks</h3>

        <RankingList
          items={sampleRankings}
          showRank={false}
          title="Participants"
        />
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Custom Styling</h3>

        <RankingList
          items={sampleRankings.slice(0, 3)}
          outlineColor="blue"
          outlined
          title="Top Performers"
        />
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Usage Example</h3>

        <div className="rounded-lg bg-gray-50 p-6">
          <h3 className="mb-4 text-xl font-semibold">Monthly Leaderboard</h3>

          <RankingList
            items={sampleRankings}
            subtitle="Sorted by total points"
            title="Full Rankings"
          />

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Keep up the great work! Rankings update daily.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RankingListDemo;
