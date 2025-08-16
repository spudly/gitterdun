import type {FC} from 'react';
import type {PodiumItem} from './Podium.js';
import {Podium} from './Podium.js';

const PodiumDemo: FC = () => {
  const sampleLeaderboard: Array<PodiumItem> = [
    {
      id: 1,
      rank: 1,
      content: (
        <h3 className="text-lg font-semibold text-gray-900">Alice Johnson</h3>
      ),
      score: 1250,
      subtitle: '15 chores completed',
    },
    {
      id: 2,
      rank: 2,
      content: (
        <h3 className="text-lg font-semibold text-gray-900">Bob Smith</h3>
      ),
      score: 980,
      subtitle: '12 chores completed',
    },
    {
      id: 3,
      rank: 3,
      content: (
        <h3 className="text-lg font-semibold text-gray-900">Charlie Brown</h3>
      ),
      score: 750,
      subtitle: '10 chores completed',
    },
  ];

  const customLeaderboard: Array<PodiumItem> = [
    {
      id: 'user-1',
      rank: 1,
      content: (
        <h3 className="text-lg font-semibold text-gray-900">Team Alpha</h3>
      ),
      score: '95%',
      subtitle: 'Weekly Challenge',
    },
    {
      id: 'user-2',
      rank: 2,
      content: (
        <h3 className="text-lg font-semibold text-gray-900">Team Beta</h3>
      ),
      score: '87%',
      subtitle: 'Weekly Challenge',
    },
    {
      id: 'user-3',
      rank: 3,
      content: (
        <h3 className="text-lg font-semibold text-gray-900">Team Gamma</h3>
      ),
      score: '82%',
      subtitle: 'Weekly Challenge',
    },
  ];

  return (
    <div className="space-y-6 p-4">
      <h2 className="text-2xl font-bold">Podium Component</h2>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Leaderboard Podium</h3>

        <Podium items={sampleLeaderboard} />
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Custom Podium</h3>

        <Podium items={customLeaderboard} />
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Without Medals</h3>

        <Podium items={sampleLeaderboard} showMedals={false} />
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Custom Styling</h3>

        <div className="rounded-lg bg-gray-100 p-6">
          <Podium items={sampleLeaderboard} />
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Usage Example</h3>

        <div className="rounded-lg bg-gray-50 p-6">
          <h3 className="mb-4 text-xl font-semibold">Monthly Leaderboard</h3>

          <Podium items={sampleLeaderboard} />

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Congratulations to our top performers this month!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PodiumDemo;
