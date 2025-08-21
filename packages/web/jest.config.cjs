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
          [
            'babel-plugin-formatjs',
            {
              ast: true,
              removeDefaultMessage: false,
              idInterpolationPattern: '[sha512:contenthash:base64:6]',
              overrideIdFn: (id, defaultMessage, _description, filePath) => {
                try {
                  const rel = filePath.split('/src/')[1] ?? filePath;
                  const prefix = rel
                    .replace(/\.[tj]sx?$/, '')
                    .replace(/\//g, '.');
                  const slug = defaultMessage
                    .toLowerCase()
                    .replace(/[^a-z0-9]+/g, '-')
                    .replace(/(?:^-|-$)/g, '')
                    .slice(0, 30);
                  return `${prefix}.${slug}`;
                } catch {
                  return id ?? defaultMessage;
                }
              },
            },
          ],
          // Support dynamic import() under Jest CJS transform
          ['babel-plugin-dynamic-import-node'],
          ['@babel/plugin-transform-modules-commonjs'],
          ['@babel/plugin-transform-react-jsx', {runtime: 'automatic'}],
        ],
      },
    ],
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  displayName: 'web',
};
