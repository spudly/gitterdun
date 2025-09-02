import {pragma, all, run} from './crud/db';
import {sql} from './sql';

type TableRow = {name: string};

const listUserTables = (): ReadonlyArray<string> => {
  const rows = all(sql`
    SELECT
      name
    FROM
      sqlite_master
    WHERE
      type = 'table'
      AND name NOT like 'sqlite_%'
  `) as ReadonlyArray<TableRow>;
  return rows.map((row: TableRow) => row.name);
};

const dropTables = (tableNames: ReadonlyArray<string>): void => {
  pragma('foreign_keys = OFF');
  tableNames.forEach(name => {
    run(`DROP TABLE IF EXISTS ${name}`);
  });
  pragma('foreign_keys = ON');
};

export const dropAllTables = (): void => {
  const tables = listUserTables();
  dropTables(tables);
};
