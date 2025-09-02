const baseCfg = require('../../jest.config.base.cjs');

module.exports = {
  ...baseCfg,
  rootDir: '.',
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.(t|j)sx?$': [
      'babel-jest',
      {
        presets: [['@babel/preset-typescript', {jsxPragma: 'React'}]],
        plugins: [
          ['babel-plugin-formatjs', {ast: true, removeDefaultMessage: false}],
          // Support dynamic import() under Jest CJS transform
          ['babel-plugin-dynamic-import-node'],
          ['@babel/plugin-transform-modules-commonjs'],
          ['@babel/plugin-transform-react-jsx', {runtime: 'automatic'}],
        ],
      },
    ],
  },
  setupFilesAfterEnv: [
    ...baseCfg.setupFilesAfterEnv,
    '<rootDir>/jest.setup.ts',
  ],
  displayName: 'web',
};
