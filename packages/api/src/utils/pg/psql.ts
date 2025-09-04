import {execFileSync} from 'node:child_process';
import {getPostgresUrl} from '../env';

const getPsqlCommand = (): string => {
  const cmd = process.env['POSTGRES_PSQL_COMMAND'] ?? 'psql';
  return cmd;
};

export const psqlExecFileInput = (sql: string): void => {
  const url = getPostgresUrl();
  if (url === null) {
    throw new Error('Postgres URL not configured');
  }
  const cmd = getPsqlCommand();
  execFileSync(
    cmd,
    ['--dbname', url, '-v', 'ON_ERROR_STOP=1', '-X', '-q', '-f', '-'],
    {input: sql},
  );
};
