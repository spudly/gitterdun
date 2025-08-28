import type {Rule} from 'eslint';
import {buildUsedTestIds} from './testIdScanner.js';

// Simple cache to avoid recomputing across multiple files within the same ESLint run
const cacheKeyToUsedIds: Map<string, Set<string>> = new Map<string, Set<string>>();

const buildUsedIdsCached = (globs: Array<string>): Set<string> => {
  const cacheKey = JSON.stringify({
    cwd: process.cwd(),
    globs: globs.slice().sort(),
  });
  const cached = cacheKeyToUsedIds.get(cacheKey);
  if (cached) {
    return cached;
  }
  const used = buildUsedTestIds(globs);
  cacheKeyToUsedIds.set(cacheKey, used);
  return used;
};

export const noUnusedDataTestId: Rule.RuleModule = {
  meta: {
    type: 'problem',
    docs: {
      description:
        'Require removing data-testid attributes that are not used in tests',
      category: 'Best Practices',
      recommended: false,
    },
    schema: [
      {
        type: 'object',
        properties: {
          testFileGlobs: {type: 'array', items: {type: 'string'}, minItems: 1},
        },
        required: ['testFileGlobs'],
        additionalProperties: false,
      },
    ],
    messages: {
      unusedDataTestId:
        'data-testid "{{testId}}" is unused in tests. Remove it or add a test.',
    },
  },
  create(context) {
    const option = (context.options[0] ?? {}) as {
      testFileGlobs?: Array<string>;
    };
    const globs = Array.isArray(option.testFileGlobs)
      ? option.testFileGlobs
      : [];
    const usedIds = globs.length > 0 ? buildUsedIdsCached(globs) : new Set<string>();

    return {
      JSXAttribute(attributeNode) {
        const named = attributeNode as unknown as {
          type?: string;
          name?: {type?: string; name?: unknown};
          value?:
            | {type?: 'Literal'; value?: unknown}
            | {type?: 'JSXExpressionContainer'; expression?: {type?: string; value?: unknown}};
        };

        if (named.type !== 'JSXAttribute') {
          return;
        }
        if (named.name?.type !== 'JSXIdentifier' || typeof named.name.name !== 'string') {
          return;
        }
        if (named.name.name !== 'data-testid') {
          return;
        }

        let testId: string | null = null;
        if (named.value && named.value.type === 'Literal' && typeof named.value.value === 'string') {
          testId = named.value.value;
        } else if (
          named.value
          && named.value.type === 'JSXExpressionContainer'
          && named.value.expression
          && named.value.expression.type === 'Literal'
          && typeof named.value.expression.value === 'string'
        ) {
          testId = named.value.expression.value;
        }

        if (testId !== null) {
          if (!usedIds.has(testId)) {
            context.report({node: attributeNode, messageId: 'unusedDataTestId', data: {testId}});
          }
        }
      },
    };
  },
};
