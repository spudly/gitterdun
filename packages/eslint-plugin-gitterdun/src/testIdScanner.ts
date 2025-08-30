import fs from 'node:fs';
import path from 'node:path';
import {Minimatch} from 'minimatch';

const toPosix = (filePath: string): string =>
  filePath.split(path.sep).join('/');
// Use minimatch for robust glob matching (supports braces, extglob, **, etc.)

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
  const matchers = globs.map(
    pattern =>
      new Minimatch(toPosix(pattern), {
        dot: true,
        nocomment: false,
        nocase: false,
        nobrace: false,
      }),
  );
  return allFiles.filter(absPath => {
    const relPosix = toPosix(path.relative(process.cwd(), absPath));
    return matchers.some(matcher => matcher.match(relPosix));
  });
};

const ID_PATTERNS: Array<RegExp> = [
  // Single-quoted: allow embedded double quotes
  /(?:get|find|query)(?:All)?ByTestId\s*\(\s*'(?<id>[^'\n\r]+)'\s*\)/g,
  // Double-quoted: allow embedded single quotes
  /(?:get|find|query)(?:All)?ByTestId\s*\(\s*"(?<id>[^"\n\r]+)"\s*\)/g,
  // CSS attribute selectors
  /\[\s*data-testid\s*=\s*"(?<id>[^"\n\r]+)"\s*\]/g,
  /\[\s*data-testid\s*=\s*'(?<id>[^'\n\r]+)'\s*\]/g,
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
