import {test as base, Page} from '@playwright/test';
import fs from 'fs';
import path from 'path';
import {fileURLToPath} from 'url';
const FILENAME = fileURLToPath(import.meta.url);
const DIRNAME = path.dirname(FILENAME);

export const test = base.extend({});
export {expect} from '@playwright/test';

async function saveIstanbulCoverage(page: Page, suffix: string) {
  // Pull coverage from browser context and write to .nyc_output
  // Only if instrumentation is enabled
  const coverage = await page.evaluate(
    () => (window as any).__coverage__ || null,
  );
  if (!coverage) return;
  const outDir = path.resolve(DIRNAME, '..', '.nyc_output');
  await fs.promises.mkdir(outDir, {recursive: true});
  const file = path.join(outDir, `coverage-${suffix}-${Date.now()}.json`);
  await fs.promises.writeFile(file, JSON.stringify(coverage));
}

test.afterEach(async ({page}, testInfo) => {
  await saveIstanbulCoverage(
    page,
    `${testInfo.project.name}-${testInfo.parallelIndex}`,
  );
});
