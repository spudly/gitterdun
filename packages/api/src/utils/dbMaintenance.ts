import {pragma, all, run} from './crud/db';
import {sql} from './sql';

type TableRow = {name: string};

const listUserTables = async (): Promise<ReadonlyArray<string>> => {
  const rows = (await all(sql`
    SELECT
      name
    FROM
      sqlite_master
    WHERE
      type = 'table'
      AND name NOT like 'sqlite_%'
  `)) as ReadonlyArray<TableRow>;
  return rows.map((row: TableRow) => row.name);
};

const dropTables = async (tableNames: ReadonlyArray<string>): Promise<void> => {
  pragma('foreign_keys = OFF');
  for (const name of tableNames) {
    // eslint-disable-next-line no-await-in-loop -- sequential drops
    await run(`DROP TABLE IF EXISTS ${name}`);
  }
  pragma('foreign_keys = ON');
};

export const dropAllTables = async (): Promise<void> => {
  const tables = await listUserTables();
  await dropTables(tables);
};
