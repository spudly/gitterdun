const isValidEnv = (
  env: string,
): env is 'development' | 'test' | 'production' => {
  return ['development', 'test', 'production'].includes(env);
};

globalThis.__ENV__ = isValidEnv(import.meta.env.MODE)
  ? import.meta.env.MODE
  : 'development';
globalThis.__TEST__ = import.meta.env.MODE === 'test';
globalThis.__DEV__ = import.meta.env.MODE === 'development';
globalThis.__PROD__ = import.meta.env.MODE === 'production';

export {};
