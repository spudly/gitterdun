import {z} from 'zod';
import {ChoreSchema} from '@gitterdun/shared';
import type {ChoreCompletionParams} from './choreAssignments.js';
import {
  findChoreAssignment,
  updateChoreAssignmentCompletion,
} from './choreAssignments.js';
import {
  getChoreForCompletion,
  calculateCompletionPoints,
  updateUserPointsForChore,
  createChoreCompletionNotification,
} from './chorePoints.js';
import {transaction} from './crud/db.js';

type Chore = z.infer<typeof ChoreSchema>;

export const executeChoreCompletionTransaction = async (
  choreId: number,
  userId: number,
  notes?: string,
): Promise<{chore: Chore; pointsEarned: number}> => {
  return transaction(async () => {
    await findChoreAssignment(choreId, userId);
    const chore = await getChoreForCompletion(choreId);
    const points = calculateCompletionPoints(chore);

    const completionParams: ChoreCompletionParams = {
      choreId,
      userId,
      points,
      notes,
    };
    await updateChoreAssignmentCompletion(completionParams);
    const totalPoints =
      points.pointsEarned
      + points.bonusPointsEarned
      - points.penaltyPointsEarned;
    await updateUserPointsForChore(userId, totalPoints);
    await createChoreCompletionNotification(userId, chore, choreId);

    return {chore, pointsEarned: points.pointsEarned};
  });
};
