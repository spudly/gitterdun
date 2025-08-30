import fs from 'node:fs';
import path from 'node:path';

// eslint-disable-next-line ts/no-unnecessary-type-parameters -- not unnecessary
export const readJson = <TYPE>(file: string) =>
  JSON.parse(fs.readFileSync(file, 'utf8')) as TYPE;

// Extract keys from `export default { ... }` literal object
export const extractKeysFromTsObject = (source: string): Set<string> => {
  const keys = new Set<string>();
  // Capture the object key inside quotes followed by a colon, using a named group for clarity
  const regex = /['"](?<key>[A-Za-z0-9_.-]+)['"]\s*:/g;
  let match: RegExpExecArray | null;
  while ((match = regex.exec(source)) !== null) {
    const {groups} = match;
    const capturedKey = groups?.['key'];
    if (typeof capturedKey === 'string' && capturedKey.length > 0) {
      keys.add(capturedKey);
    }
  }
  return keys;
};

export const resolveFromCwd = (file: string): string =>
  path.resolve(process.cwd(), file);

type RuleOptions = {enPath: string};

const isValidRuleOptions = (options: unknown): options is RuleOptions =>
  typeof options === 'object'
  && options !== null
  && 'enPath' in options
  && typeof options.enPath === 'string'
  && options.enPath !== '';

export const hasValidRuleOptions = (
  arrayOfOptions: Array<unknown>,
): arrayOfOptions is [RuleOptions] =>
  arrayOfOptions.length !== 0 && isValidRuleOptions(arrayOfOptions[0]);
