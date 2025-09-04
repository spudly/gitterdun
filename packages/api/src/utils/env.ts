// Postgres-only mode; production detection is not used here

export const getPostgresUrl = (): string | null => {
  const directUrl = process.env['PG_URL'];
  if (directUrl !== undefined) {
    return directUrl;
  }
  const host = process.env['PG_HOSTNAME'];
  const db = process.env['PG_DATABASE'];
  if (host === undefined || db === undefined) {
    return null;
  }
  const port = process.env['PG_PORT'] ?? '5432';
  const user = process.env['PG_USERNAME'];
  const pass = process.env['PG_PASSWORD'];
  const auth =
    user !== undefined ? `${user}${pass !== undefined ? `:${pass}` : ''}@` : '';
  return `postgresql://${auth}${host}:${port}/${db}`;
};
