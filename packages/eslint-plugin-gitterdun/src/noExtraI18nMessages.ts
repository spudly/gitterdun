import fs from 'node:fs';
import path from 'node:path';
import type {Rule} from 'eslint';
import {
  extractKeysFromTsObject,
  hasValidRuleOptions,
  readJson,
  resolveFromCwd,
} from './utils.js';

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
  messages: {obsolete: 'Locale "{{locale}}" has obsolete keys: {{keys}}'},
  docs: {
    description: 'Ensure locale has no keys absent from extracted EN',
    recommended: false,
  },
} as const;

export const noExtraI18nMessages: Rule.RuleModule = {
  meta,
  create: (context: Rule.RuleContext): Rule.RuleListener => {
    // Guard: only run inside messages folders
    const normalizedFile = context.filename.replace(/\\/g, '/');
    const {options} = context;
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
    let source = '';
    try {
      source = fs.readFileSync(localeAbs, 'utf8');
    } catch {
      return {};
    }
    const keys = extractKeysFromTsObject(source);
    const obsolete: Array<string> = [];
    for (const key of keys) {
      if (!enKeys.has(key)) {
        obsolete.push(key);
      }
    }
    if (obsolete.length > 0) {
      context.report({
        loc: {line: 1, column: 0},
        messageId: 'obsolete',
        data: {
          locale: path.basename(localeAbs),
          keys:
            obsolete.slice(0, 5).join(', ') + (obsolete.length > 5 ? '…' : ''),
        },
      });
    }
    return {};
  },
};
