import {all, run} from './crud/db.js';
import {z} from 'zod';

const TableRowSchema = z.object({table_name: z.string()});

const listUserTables = async (): Promise<ReadonlyArray<string>> => {
  const rawRows = await all(
    `SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_type = 'BASE TABLE' AND table_name <> 'spatial_ref_sys'`,
  );
  const rows = z.array(TableRowSchema).parse(rawRows);
  return rows.map(row => row.table_name);
};

const dropTables = async (tableNames: ReadonlyArray<string>): Promise<void> => {
  for (const name of tableNames) {
    // eslint-disable-next-line no-await-in-loop -- sequential drops
    await run(`DROP TABLE IF EXISTS ${name} CASCADE`);
  }
};

export const dropAllTables = async (): Promise<void> => {
  const tables = await listUserTables();
  await dropTables(tables);
};
