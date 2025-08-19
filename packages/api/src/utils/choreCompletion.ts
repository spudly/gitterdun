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

export const executeChoreCompletionTransaction = (
  choreId: number,
  userId: number,
  notes?: string,
): {chore: Chore; pointsEarned: number} => {
  const transaction = db.transaction(() => {
    findChoreAssignment(choreId, userId);
    const chore = getChoreForCompletion(choreId);
    const points = calculateCompletionPoints(chore);

    const completionParams: ChoreCompletionParams = {
      choreId,
      userId,
      points,
      notes,
    };
    updateChoreAssignmentCompletion(completionParams);
    const totalPoints =
      points.pointsEarned
      + points.bonusPointsEarned
      - points.penaltyPointsEarned;
    updateUserPointsForChore(userId, totalPoints);
    createChoreCompletionNotification(userId, chore, choreId);

    return {chore, pointsEarned: points.pointsEarned};
  });

  return transaction();
};
