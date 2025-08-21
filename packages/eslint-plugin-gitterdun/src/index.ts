import type {Rule} from 'eslint';
import {noMissingI18nMessages} from './noMissingI18nMessages.js';
import {noExtraI18nMessages} from './noExtraI18nMessages.js';

export const rules = {
  'no-missing-i18n-messages': noMissingI18nMessages,
  'no-extra-i18n-messages': noExtraI18nMessages,
} as const satisfies Record<string, Rule.RuleModule>;

const withRules = {rules};

export default withRules;
