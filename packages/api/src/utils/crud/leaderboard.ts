import {all} from './db.js';

export const getLeaderboard = async (
  query: string,
  userId: number,
  limit: number,
): Promise<Array<unknown>> => {
  return (await all(query, userId, limit)) as Array<unknown>;
};
