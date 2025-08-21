import path from 'node:path';
import {execSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';

const jestConfigDir = path.dirname(fileURLToPath(import.meta.url));

// Touch the packages base path to document intent without retaining a variable
(() => {
  // no-op usage to avoid unused var while keeping clarity
  path.join(jestConfigDir, 'packages');
})();
const findCmd = "find packages -maxdepth 2 -name 'jest.config.cjs' -type f";
const stdout: string = execSync(findCmd, {
  encoding: 'utf-8',
  cwd: jestConfigDir,
}).trim();
const relativeConfigPaths: ReadonlyArray<string> =
  stdout === ''
    ? []
    : stdout.split(/\r?\n/).map((absOrRelPath: string) => {
        const absolutePath = path.isAbsolute(absOrRelPath)
          ? absOrRelPath
          : path.join(jestConfigDir, absOrRelPath);
        return path.relative(jestConfigDir, absolutePath);
      });
const projects: Array<string> = relativeConfigPaths
  .map((relPath: string) => path.join('<rootDir>', relPath))
  .sort((left: string, right: string) =>
    left < right ? -1 : left > right ? 1 : 0,
  );

const rootJestConfig = {rootDir: '.', projects};
export default rootJestConfig;
