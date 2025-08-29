import fs from 'node:fs';
import path from 'node:path';

const toPosix = (filePath: string): string =>
  filePath.split(path.sep).join('/');
  input.replace(/[.*+^${}()|[\]\\]/g, '\\$&');
const globToRegExp = (globPattern: string): RegExp => {
  const posixGlob = toPosix(globPattern);
  let pattern = posixGlob.replace(/\*\*/g, '§§DOUBLESTAR§§');
  pattern = escapeRegex(pattern)
    .replace(/§§DOUBLESTAR§§/g, '.*')
    .replace(/\*/g, '[^/]*')
    .replace(/\?/g, '[^/]');
  return new RegExp(`^${pattern}$`);
};

const defaultIgnoreDirs = new Set([
  'node_modules',
  '.git',
  'dist',
  'build',
  'coverage',
  'playwright-report',
]);

const walkFiles = (rootDir: string): Array<string> => {
  const results: Array<string> = [];
  const stack: Array<string> = [rootDir];
  while (stack.length > 0) {
    const popped = stack.pop();
    if (typeof popped !== 'string') {
      continue;
    }
    let entries: Array<fs.Dirent>;
    try {
      entries = fs.readdirSync(popped, {withFileTypes: true});
    } catch {
      continue;
    }
    for (const entry of entries) {
      const entryPath = path.join(popped, entry.name);
      if (entry.isDirectory()) {
        if (!defaultIgnoreDirs.has(entry.name)) {
          stack.push(entryPath);
        }
      } else if (entry.isFile()) {
        results.push(entryPath);
      }
    }
  }
  return results;
};

const filterByGlobs = (
  allFiles: Array<string>,
  globs: Array<string>,
): Array<string> => {
  const regs = globs.map(globToRegExp);
  return allFiles
    .map(absPath => toPosix(path.relative(process.cwd(), absPath)))
    .filter(relPath => regs.some(reg => reg.test(relPath)))
    .map(relPath => path.resolve(process.cwd(), relPath));
};

const ID_PATTERNS: Array<RegExp> = [
  /(?:get|find|query)(?:All)?ByTestId\s*\(\s*'(?<id>[^'"\n\r]+)'\s*\)/g,
  /(?:get|find|query)(?:All)?ByTestId\s*\(\s*"(?<id>[^"\n\r]+)"\s*\)/g,
  /\[\s*data-testid\s*=\s*"(?<id>[^"]+)"\s*\]/g,
  /\[\s*data-testid\s*=\s*'(?<id>[^']+)'\s*\]/g,
  /\[\s*data-testid\s*=\s*(?<id>[^\]"'\s]+)\s*\]/g,
];

const extractTestIdsFromContent = (content: string): Set<string> => {
  const ids = new Set<string>();
  for (const pattern of ID_PATTERNS) {
    for (const match of content.matchAll(pattern)) {
      const extracted = (match.groups?.['id'] ?? '').trim();
      if (extracted !== '') {
        ids.add(extracted);
      }
    }
  }
  return ids;
};

export const buildUsedTestIds = (globs: Array<string>): Set<string> => {
  const allFiles = walkFiles(process.cwd());
  const matched = filterByGlobs(allFiles, globs);
  const used = new Set<string>();
  for (const file of matched) {
    let text: string;
    try {
      text = fs.readFileSync(file, 'utf8');
    } catch {
      continue;
    }
    for (const id of extractTestIdsFromContent(text)) {
      used.add(id);
    }
  }
  return used;
};
