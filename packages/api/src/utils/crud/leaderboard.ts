import {all} from './db';

export const getLeaderboard = (
  query: string,
  userId: number,
  limit: number,
) => {
  return all(query, userId, limit);
};
