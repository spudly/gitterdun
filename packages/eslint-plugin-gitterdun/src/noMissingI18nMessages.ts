import fs from 'node:fs';
import path from 'node:path';
import type {Rule} from 'eslint';
import {
  extractKeysFromTsObject,
  hasValidRuleOptions,
  readJson,
  resolveFromCwd,
} from './utils.js';
import {MAX_DISPLAYED_ERROR_ITEMS} from './constants.js';

const meta = {
  type: 'problem',
  schema: [
    {
      type: 'object',
      properties: {enPath: {type: 'string'}},
      required: ['enPath'],
      additionalProperties: false,
    },
  ],
  messages: {missing: 'Locale "{{locale}}" has missing keys: {{keys}}'},
  docs: {
    description: 'Ensure locale has all keys from extracted EN',
    recommended: false,
  },
} as const;

export const noMissingI18nMessages: Rule.RuleModule = {
  meta,
  create: (context: Rule.RuleContext): Rule.RuleListener => {
    const {options} = context;
    const normalizedFile = context.filename.replace(/\\/g, '/');
    if (
      !hasValidRuleOptions(options)
      || !/\/(?:^|.*\/)?messages\//.test(normalizedFile)
    ) {
      return {};
    }
    const [{enPath}] = options;
    const enJson = readJson<Record<string, string>>(resolveFromCwd(enPath));
    const enKeys = new Set(Object.keys(enJson));

    const localeAbs = resolveFromCwd(context.filename);
    let source;
    try {
      source = fs.readFileSync(localeAbs, 'utf8');
    } catch {
      context.report({
        loc: {line: 1, column: 0},
        messageId: 'missing',
        data: {locale: path.basename(localeAbs), keys: '(file not found)'},
      });
      return {};
    }
    const keys = extractKeysFromTsObject(source);
    const missing: Array<string> = [...enKeys].filter(key => !keys.has(key));
    if (missing.length > 0) {
      context.report({
        loc: {line: 1, column: 0},
        messageId: 'missing',
        data: {
          locale: path.basename(localeAbs),
          keys:
            missing.slice(0, MAX_DISPLAYED_ERROR_ITEMS).join(', ')
            + (missing.length > MAX_DISPLAYED_ERROR_ITEMS ? '…' : ''),
        },
      });
    }
    return {};
  },
};
