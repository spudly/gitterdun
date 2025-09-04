import {run} from './crud/db';

type TableRow = {table_name: string};

const listUserTables = async (): Promise<ReadonlyArray<string>> => {
  const rows = (await run(
    `SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_type = 'BASE TABLE' AND table_name <> 'spatial_ref_sys'`,
  )) as ReadonlyArray<TableRow>;
  return rows.map((row: TableRow) => row.table_name);
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
