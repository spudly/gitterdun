import { FC } from 'react';
import {useQuery} from '@tanstack/react-query';
import {leaderboardApi} from '../lib/api.js';

const Leaderboard: FC = () => {
  const {data: leaderboardResponse, isLoading} = useQuery({
    queryKey: ['leaderboard'],
    queryFn: () => leaderboardApi.get({limit: 10, sortBy: 'points'}),
  });

  const leaderboard = leaderboardResponse?.data?.leaderboard || [];
  const sortBy = leaderboardResponse?.data?.sortBy || 'points';

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto" />
          <p className="mt-4 text-gray-600">Loading leaderboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Leaderboard</h1>

        {/* Top 3 Podium */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {leaderboard.slice(0, 3).map((entry, index) => (
            <div
              key={entry.id}
              className={`text-center ${
                index === 0 ? 'order-2' : index === 1 ? 'order-1' : 'order-3'
              }`}
            >
              <div
                className={`relative mx-auto w-24 h-24 rounded-full flex items-center justify-center text-2xl font-bold text-white ${
                  index === 0
                    ? 'bg-yellow-500'
                    : index === 1
                      ? 'bg-gray-400'
                      : 'bg-orange-500'
                }`}
              >
                {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mt-4">
                {entry.username}
              </h3>
              <p className="text-gray-600">{entry.points} points</p>
              <p className="text-sm text-gray-500">
                {entry.chores_completed} chores
              </p>
            </div>
          ))}
        </div>

        {/* Full Leaderboard */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Full Rankings</h2>
            <p className="text-sm text-gray-500">
              Sorted by {sortBy === 'points' ? 'total points' : 'streak count'}
            </p>
          </div>
          <div className="divide-y divide-gray-200">
            {leaderboard.map(entry => (
              <div key={entry.id} className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-sm font-medium text-gray-700 mr-4">
                      {entry.rank}
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">
                        {entry.username}
                      </h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>{entry.chores_completed} chores completed</span>
                        <span>{entry.badges_earned} badges earned</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold text-gray-900">
                      {entry.points} pts
                    </p>
                    <p className="text-sm text-gray-500">
                      {entry.streak_count} day streak
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
