import db from '../../lib/db';

export const run = (query: string, ...params: Array<unknown>) => {
  return db.prepare(query).run(...params);
};

export const get = (query: string, ...params: Array<unknown>) => {
  return db.prepare(query).get(...params);
};

export const all = (query: string, ...params: Array<unknown>) => {
  return db.prepare(query).all(...params);
};

export const pragma = (pragmaCommand: string): void => {
  db.pragma(pragmaCommand);
};
