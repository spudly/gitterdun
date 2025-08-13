import {FC} from 'react';
import {useQuery} from '@tanstack/react-query';
import {ChoreWithUsername} from '@gitterdun/shared';
import {choresApi} from '../lib/api.js';
import {useUser} from '../hooks/useUser.js';

const Chores: FC = () => {
  const {user} = useUser();

  const {data: choresResponse, isLoading} = useQuery({
    queryKey: ['chores'],
    queryFn: () => choresApi.getAll(),
    enabled: !!user,
  });

  const chores = choresResponse?.data || [];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto" />
          <p className="mt-4 text-gray-600">Loading chores...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Chores</h1>

        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {chores.map((chore: ChoreWithUsername) => (
              <li key={chore.id} className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div
                      className={`w-3 h-3 rounded-full mr-3 ${
                        chore.status === 'completed'
                          ? 'bg-green-500'
                          : chore.status === 'approved'
                            ? 'bg-blue-500'
                            : 'bg-yellow-500'
                      }`}
                    />
                    <div>
                      <div className="flex items-center">
                        <h3 className="text-sm font-medium text-gray-900">
                          {chore.title}
                        </h3>
                        <span
                          className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            chore.status === 'completed'
                              ? 'bg-green-100 text-green-800'
                              : chore.status === 'approved'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {chore.status}
                        </span>
                        {chore.chore_type === 'bonus' && (
                          <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                            Bonus
                          </span>
                        )}
                      </div>
                      {chore.description && (
                        <p className="text-sm text-gray-500 mt-1">
                          {chore.description}
                        </p>
                      )}
                      <div className="flex items-center mt-2 space-x-4 text-sm text-gray-500">
                        <span>Points: {chore.point_reward}</span>
                        {chore.bonus_points > 0 && (
                          <span>Bonus: +{chore.bonus_points}</span>
                        )}
                        {chore.penalty_points > 0 && (
                          <span>Penalty: -{chore.penalty_points}</span>
                        )}
                        {chore.due_date && (
                          <span>
                            Due: {new Date(chore.due_date).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {chore.status === 'pending' && (
                      <button
                        type="button"
                        className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                      >
                        Complete
                      </button>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Chores;
