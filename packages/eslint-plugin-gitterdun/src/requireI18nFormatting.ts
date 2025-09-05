import type {Rule} from 'eslint';
import type {TSESTree} from '@typescript-eslint/types';
// Note: avoid importing extraneous runtime deps; use simple structural guards

// Enforce that i18n MessageDescriptors are only rendered using
// <FormattedMessage {...descriptor}/> or intl.formatMessage(descriptor)
// Detects misuse such as using the descriptor directly as a string,
// or accessing descriptor.defaultMessage instead of formatting it.

type UnknownRecord = Record<string, unknown>;

const hasProp = <K extends string>(
  obj: unknown,
  key: K,
): obj is Record<K, unknown> =>
  typeof obj === 'object'
  && obj !== null
  // eslint-disable-next-line prefer-object-has-own -- TODO: fix this
  && Object.hasOwnProperty.call(obj, key);

const getStringProp = (obj: unknown, key: string): string | undefined => {
  if (!hasProp(obj, key)) {
    return undefined;
  }
  const value = (obj as UnknownRecord)[key];
  return typeof value === 'string' ? value : undefined;
};

const getProp = (obj: unknown, key: string): unknown => {
  if (!hasProp(obj, key)) {
    return undefined;
  }
  return (obj as UnknownRecord)[key];
};

const isNodeType = (node: unknown, typeName: string): boolean =>
  getStringProp(node, 'type') === typeName;

const isIdentifierWithName = (node: unknown, name: string): boolean =>
  isNodeType(node, 'Identifier') && getStringProp(node, 'name') === name;

const isIntlFormatMessageCall = (node: unknown): boolean => {
  const callee = getProp(node, 'callee');
  if (isNodeType(callee, 'MemberExpression')) {
    const property = getProp(callee, 'property');
    return isIdentifierWithName(property, 'formatMessage');
  }
  return false;
};

export const requireI18nFormatting: Rule.RuleModule = {
  meta: {
    type: 'problem',
    docs: {
      description:
        'Disallow using i18n MessageDescriptors without FormattedMessage or intl.formatMessage()',
    },
    messages: {
      requireFormatting:
        'i18n message must be formatted with <FormattedMessage /> or intl.formatMessage(...)',
    },
    schema: [],
  },
  create(context): Rule.NodeListener {
    return {
      JSXExpressionContainer(node) {
        // Flag descriptor.defaultMessage usages like {descriptor.defaultMessage}
        const expr = getProp(node, 'expression');
        if (
          isNodeType(expr, 'MemberExpression')
          && isIdentifierWithName(getProp(expr, 'property'), 'defaultMessage')
        ) {
          context.report({
            node: node as unknown as TSESTree.Node,
            messageId: 'requireFormatting',
          });
        }
      },
      CallExpression(node) {
        // Allow proper intl.formatMessage calls
        if (isIntlFormatMessageCall(node)) {
          return;
        }
        // Disallow calling defaultMessage directly e.g., fn(descriptor.defaultMessage)
        const args = getProp(node, 'arguments');
        if (!Array.isArray(args)) {
          return;
        }
        for (const arg of args as Array<unknown>) {
          if (
            isNodeType(arg, 'MemberExpression')
            && isIdentifierWithName(getProp(arg, 'property'), 'defaultMessage')
          ) {
            context.report({
              node: node as unknown as TSESTree.Node,
              messageId: 'requireFormatting',
            });
          }
        }
      },
    };
  },
};
