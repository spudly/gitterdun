globalThis.__ENV__ = import.meta.env.MODE as typeof globalThis.__ENV__;
globalThis.__TEST__ = import.meta.env.MODE === 'test';
globalThis.__DEV__ = import.meta.env.MODE === 'development';
globalThis.__PROD__ = import.meta.env.MODE === 'production';

export {};
