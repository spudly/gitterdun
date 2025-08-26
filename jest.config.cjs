const path = require('node:path');
const {execSync} = require('node:child_process');

const jestConfigDir = __dirname;

// Touch the packages base path to document intent without retaining a variable
(() => {
  // no-op usage to avoid unused var while keeping clarity
  path.join(jestConfigDir, 'packages');
})();
const findCmd = "find packages -maxdepth 2 -name 'jest.config.cjs' -type f";
const stdout = execSync(findCmd, {
  encoding: 'utf-8',
  cwd: jestConfigDir,
}).trim();
const relativeConfigPaths =
  stdout === ''
    ? []
    : stdout.split(/\r?\n/).map(absOrRelPath => {
        const absolutePath = path.isAbsolute(absOrRelPath)
          ? absOrRelPath
          : path.join(jestConfigDir, absOrRelPath);
        return path.relative(jestConfigDir, absolutePath);
      });
const projects = relativeConfigPaths
  .map(relPath => path.join('<rootDir>', relPath))
  .sort((left, right) => (left < right ? -1 : left > right ? 1 : 0));

const rootJestConfig = {rootDir: '.', projects};
module.exports = rootJestConfig;
