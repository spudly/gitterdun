import {initializeDatabase} from '../lib/initDb';
import {logger} from '../utils/logger';
import {dropAllTables} from '../utils/dbMaintenance';
import {createFamily, addChildToFamily} from '../utils/familyOperations';
import {createNewUser} from '../utils/userAuth/createNewUser';
import {createChoreInDb, assignChoreToUsers} from '../utils/choreCrud';
import {ONE_DAY_MS, ONE_HOUR_MS} from '@gitterdun/shared';

const seedSampleData = async (): Promise<void> => {
  // Users (using existing helper)
  const parent = await createNewUser({
    username: 'test_parent',
    email: 'parent@example.com',
    password: 'test',
    role: 'user',
  });
  const child = await createNewUser({
    username: 'test_child',
    email: 'child@example.com',
    password: 'test',
    role: 'user',
  });

  const parentId = parent.id;
  const childId = child.id;
  logger.info(
    `Seed: created user ${parent.username} (id=${parentId}) and user ${child.username} (id=${childId})`,
  );

  // Family and membership
  const family = await createFamily('Sample Family', parentId);
  await addChildToFamily(family.id, childId);
  logger.info(
    `Seed: created family "${family.name}" (id=${family.id}) and added child user ${childId}`,
  );

  // Chores
  const now = Date.now();
  const startIso = new Date(now + ONE_HOUR_MS).toISOString();
  const dueIso = new Date(now + ONE_DAY_MS).toISOString();

  const trash = await createChoreInDb({
    title: 'Take out trash',
    description: 'Take out the kitchen trash',
    rewardPoints: 5,
    penaltyPoints: 0,
    startDate: Date.parse(startIso),
    dueDate: Date.parse(dueIso),
    recurrenceRule: 'FREQ=WEEKLY',
    choreType: 'required',
    createdBy: parentId,
    familyId: family.id,
  });
  const dishes = await createChoreInDb({
    title: 'Do the dishes',
    description: 'Wash and put away dishes',
    rewardPoints: 3,
    penaltyPoints: 0,
    startDate: Date.now() + ONE_HOUR_MS,
    dueDate: null,
    recurrenceRule: '',
    choreType: 'bonus',
    createdBy: parentId,
    familyId: family.id,
  });
  logger.info(
    `Seed: created chore "${trash.title}" (id=${trash.id}) and chore "${dishes.title}" (id=${dishes.id})`,
  );

  await assignChoreToUsers(trash.id, [childId]);
  await assignChoreToUsers(dishes.id, [childId]);
  logger.info(
    `Seed: assigned chores ${trash.id}, ${dishes.id} to user ${childId}`,
  );

  logger.info('Database reset and seeded with sample data');
};

export const resetDb = async (opts?: {seed?: boolean}): Promise<void> => {
  // For reliability with active connections, drop and recreate schema instead of deleting files
  await dropAllTables();

  await initializeDatabase();

  if (opts?.seed === true) {
    await seedSampleData();
  }
};

// CLI execution guard for tsx execution: match invoked script and avoid tests
const invokedScript = process.argv[1] ?? '';
const looksLikeThisScript = /dbReset\.(?:ts|js)$/u.test(invokedScript);
const isTestEnv = process.env['NODE_ENV'] === 'test';

if (looksLikeThisScript && !isTestEnv) {
  const shouldSeed = process.argv.includes('--seed');
  resetDb({seed: shouldSeed})
    .then(() => {
      logger.info(
        shouldSeed ? 'DB reset and seed complete' : 'DB reset complete',
      );
      process.exit(0);
    })
    .catch((error: unknown) => {
      logger.error({error}, 'DB reset failed');
      process.exit(1);
    });
}
