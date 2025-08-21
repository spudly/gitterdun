#!/usr/bin/env node
import fs from 'node:fs/promises';
import path from 'node:path';

// Keep logic in sync with vite/jest overrideIdFn
const slugifyDefaultMessage = defaultMessage => {
  return defaultMessage
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(?:^-|-$)/g, '')
    .slice(0, 30);
};

const computeHumanReadableId = (sourceFilePath, defaultMessage) => {
  const afterSrc = sourceFilePath.split('/src/')[1] ?? sourceFilePath;
  let relFromSrc = afterSrc.replace(/^\/+/, '');
  if (relFromSrc.startsWith('src/')) {
    relFromSrc = relFromSrc.slice(4);
  }
  const fileScope = relFromSrc.replace(/\.[tj]sx?$/, '').replace(/\//g, '.');
  const slug = slugifyDefaultMessage(defaultMessage);
  return `${fileScope}.${slug}`;
};

const main = async () => {
  const [inFile, outFile] = process.argv.slice(2);
  if (!inFile || !outFile) {
    console.error(
      'Usage: node scripts/i18n-postprocess.mjs <inputRawJson> <outputJson>',
    );
    process.exit(1);
  }

  const raw = await fs.readFile(inFile, 'utf8');
  const data = JSON.parse(raw);

  // Normalize to iterable of { id, defaultMessage, file, origin }
  const iterable = Array.isArray(data)
    ? data.map(entry => ({...entry}))
    : Object.entries(data).map(([id, entry]) => ({id, ...(entry ?? {})}));

  const result = {};
  for (const msg of iterable) {
    const {defaultMessage, file, origin, id: extractedId} = msg ?? {};
    if (typeof defaultMessage !== 'string' || defaultMessage === '') {
      continue;
    }
    // Prefer explicit id when provided
    let id =
      typeof extractedId === 'string' && extractedId !== '' ? extractedId : '';
    if (id === '') {
      // Fallback to compute from file path when id is missing
      const originFile =
        Array.isArray(origin) && Array.isArray(origin[0]) ? origin[0][0] : '';
      const filePath =
        typeof file === 'string' && file !== '' ? file : originFile;
      id = filePath
        ? computeHumanReadableId(filePath, defaultMessage)
        : defaultMessage;
    }
    result[id] = defaultMessage;
  }

  await fs.mkdir(path.dirname(outFile), {recursive: true});
  await fs.writeFile(outFile, `${JSON.stringify(result, null, 2)}\n`);
};

main().catch(err => {
  console.error(err);
  process.exit(1);
});
