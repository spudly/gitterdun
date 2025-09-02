#!/usr/bin/env -S node --experimental-strip-types

import {PLUGINS, RULES} from '../eslint.config.ts';
import type {ESLint} from 'eslint';
// eslint-disable-next-line import/no-deprecated -- no alternative
import {builtinRules} from 'eslint/use-at-your-own-risk';

type Rule = NonNullable<ESLint.Plugin['rules']>[string];

const collectConfiguredRuleNames = (ruleConfigs: typeof RULES) => {
  return Object.keys(ruleConfigs).sort();
};

const isDeprecated = (_name: string, rule: Rule): boolean => {
  const isObjectOrFunction =
    typeof rule === 'object' || typeof rule === 'function';
  if (!isObjectOrFunction) {
    return false;
  }
  if (!('meta' in rule)) {
    return false;
  }
  const {meta} = rule as {meta?: {deprecated?: boolean}};
  return Boolean(meta?.deprecated);
};

const collectAvailableRules = (plugins: Record<string, ESLint.Plugin>) => {
  const available = new Set<string>();
  const deprecated = new Set<string>();
  for (const [pluginName, plugin] of Object.entries(plugins)) {
    const rules = plugin.rules ?? {};
    for (const [shortName, ruleObj] of Object.entries(rules)) {
      const fullName = `${pluginName}/${shortName}`;
      if (isDeprecated(shortName, ruleObj)) {
        deprecated.add(fullName);
      } else {
        available.add(fullName);
      }
    }
  }
  return {available, deprecated};
};

const collectCoreRules = () => {
  const available = new Set<string>();
  const deprecated = new Set<string>();
  // eslint-disable-next-line import/no-deprecated, ts/no-deprecated -- no alternative
  for (const [name, ruleObj] of builtinRules.entries()) {
    if (isDeprecated(name, ruleObj)) {
      deprecated.add(name);
    } else {
      available.add(name);
    }
  }
  return {available, deprecated};
};

const main = () => {
  const configuredRuleNames = collectConfiguredRuleNames(RULES);
  const pluginSets = collectAvailableRules(PLUGINS);
  const coreSets = collectCoreRules();
  const available = new Set<string>([
    ...pluginSets.available,
    ...coreSets.available,
  ]);
  const deprecated = new Set<string>([
    ...pluginSets.deprecated,
    ...coreSets.deprecated,
  ]);
  const configuredSet = new Set(configuredRuleNames);

  const unusedRules = Array.from(available)
    .filter(name => !configuredSet.has(name))
    .sort();

  const deprecatedRules = configuredRuleNames
    .filter(name => deprecated.has(name))
    .sort();

  const invalidRules = configuredRuleNames
    .filter(name => !available.has(name) && !deprecated.has(name))
    .sort();

  const fmtListWithEmoji = (arr: Array<string>, emoji: string) =>
    arr.length
      ? `\n${arr.map(name => `  ${emoji} ${name}`).join('\n')}`
      : ' (none)';

  const hasIssues =
    unusedRules.length > 0
    || deprecatedRules.length > 0
    || invalidRules.length > 0;

  if (hasIssues) {
    console.log(
      [
        `Unused:${fmtListWithEmoji(unusedRules, '📋')}`,
        `Deprecated:${fmtListWithEmoji(deprecatedRules, '⚠️')}`,
        `Invalid:${fmtListWithEmoji(invalidRules, '❌')}`,
      ].join('\n'),
    );
    process.exitCode = 1;
  } else {
    console.log('✨ All Good!');
  }
};

main();
