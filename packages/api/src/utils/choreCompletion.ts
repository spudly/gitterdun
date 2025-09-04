import {z} from 'zod';
import {ChoreSchema} from '@gitterdun/shared';
import type {ChoreCompletionParams} from './choreAssignments';
import {
  findChoreAssignment,
  updateChoreAssignmentCompletion,
} from './choreAssignments';
import {
  getChoreForCompletion,
  calculateCompletionPoints,
  updateUserPointsForChore,
  createChoreCompletionNotification,
} from './chorePoints';
import {transaction} from './crud/db';

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
