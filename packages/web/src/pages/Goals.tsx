import {useQuery} from '@tanstack/react-query';
import {Goal} from '@gitterdun/shared';
import {goalsApi} from '../lib/api.js';
import {useUser} from '../hooks/useUser.js';
import { FC } from 'react';

const Goals: FC = () => {
  const {user} = useUser();

  const {data: goalsResponse, isLoading} = useQuery({
    queryKey: ['goals'],
    queryFn: () =>
      user
        ? goalsApi.getAll({user_id: user.id})
        : Promise.resolve({success: true, data: []}),
    enabled: !!user,
  });

  const goals = goalsResponse?.data || [];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto" />
          <p className="mt-4 text-gray-600">Loading goals...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Goals</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {goals.map((goal: Goal) => (
            <div key={goal.id} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  {goal.title}
                </h3>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    goal.status === 'completed'
                      ? 'bg-green-100 text-green-800'
                      : goal.status === 'abandoned'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-blue-100 text-blue-800'
                  }`}
                >
                  {goal.status}
                </span>
              </div>

              {goal.description && (
                <p className="text-gray-600 mb-4">{goal.description}</p>
              )}

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Current Points:</span>
                  <span className="font-medium">{goal.current_points}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Target Points:</span>
                  <span className="font-medium">{goal.target_points}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{
                      width: `${Math.min((goal.current_points / goal.target_points) * 100, 100)}%`,
                    }}
                  />
                </div>
                <div className="text-xs text-gray-500 text-center">
                  {Math.round((goal.current_points / goal.target_points) * 100)}
                  % Complete
                </div>
              </div>
            </div>
          ))}
        </div>

        {goals.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg
                className="mx-auto h-12 w-12"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No goals yet
            </h3>
            <p className="text-gray-500">
              Create your first goal to start tracking your progress!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Goals;
