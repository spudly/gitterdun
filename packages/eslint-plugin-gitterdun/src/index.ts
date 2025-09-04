import type {Rule} from 'eslint';
import {noMissingI18nMessages} from './noMissingI18nMessages.js';
import {noExtraI18nMessages} from './noExtraI18nMessages.js';
import {requireI18nFormatting} from './requireI18nFormatting.js';
import {noTailwindMargins} from './noTailwindMargins.js';
import {noUnusedDataTestId} from './noUnusedDataTestId.js';
import {requirePromiseSuffixOnUnawaited} from './requirePromiseSuffixOnUnawaited.js';

export const rules = {
  'no-missing-i18n-messages': noMissingI18nMessages,
  'no-extra-i18n-messages': noExtraI18nMessages,
  'require-i18n-formatting': requireI18nFormatting,
  'no-tailwind-margins': noTailwindMargins,
  'no-unused-data-testid': noUnusedDataTestId,
  'require-promise-suffix-on-unawaited': requirePromiseSuffixOnUnawaited,
} as const satisfies Record<string, Rule.RuleModule>;

const withRules = {rules};

export default withRules;
