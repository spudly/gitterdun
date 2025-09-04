import {z} from 'zod';
import {ChoreSchema} from '@gitterdun/shared';
import db from '../lib/db';
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

type Chore = z.infer<typeof ChoreSchema>;

export const executeChoreCompletionTransaction = async (
  choreId: number,
  userId: number,
  notes?: string,
): Promise<{chore: Chore; pointsEarned: number}> => {
  const tx = db.transaction(async () => {
    // Note: chore completion remains using sqlite transaction for now
    // The helpers are async, we await them inside the transaction
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

  return tx();
};
