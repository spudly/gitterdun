import type {JSSyntaxElement, Rule} from 'eslint';
import {
  getType,
  isIdentifier,
  isAwaitExpression,
  isPromiseLikeExpression,
  isArrayPattern,
  isObjectPattern,
} from './utils/astNodeUtils.js';
import {isPromiseByType} from './utils/isPromiseByType.js';
import {
  handleArrayDestructuring,
  handleObjectDestructuring,
  hasParserServices,
} from './utils/requirePromiseHelpers.js';
const reportNameViolation = (
  context: Rule.RuleContext,
  nodeForReport: JSSyntaxElement,
  name: string,
): void => {
  if (!/promise$/i.test(name)) {
    context.report({
      node: nodeForReport,
      messageId: 'requirePromiseSuffix',
      data: {name},
    });
  }
};
export const requirePromiseSuffixOnUnawaited = {
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Require variables assigned an unawaited Promise to be suffixed with "Promise"',
      recommended: false,
    },
    schema: [],
    messages: {
      requirePromiseSuffix:
        "Variable '{{name}}' should end with 'promise' when assigned a Promise without await",
    },
  },
  create(context): Rule.NodeListener {
    const sourceCode = hasParserServices(context.sourceCode)
      ? context.sourceCode
      : null;
    const services = sourceCode?.parserServices as
      | {program?: unknown; esTreeNodeToTSNodeMap?: unknown}
      | undefined;
    const hasTypeInfo =
      services !== undefined
      && services.program !== undefined
      && services.esTreeNodeToTSNodeMap !== undefined;
    const isPromiseLike = (_ctx: Rule.RuleContext, node: unknown): boolean => {
      // Prefer TS types when available
      if (hasTypeInfo && isPromiseByType(context, node)) {
        return true;
      }
      // Always allow explicit Promise syntax
      if (isPromiseLikeExpression(node)) {
        return true;
      }
      // Fallback for RuleTester (no type info): treat bare calls as promise-like
      return !hasTypeInfo && getType(node) === 'CallExpression';
    };
    const report = (node: unknown, name: string): void => {
      reportNameViolation(context, node as JSSyntaxElement, name);
    };
    const onVariableDeclarator: Rule.NodeListener['VariableDeclarator'] = (
      node,
    ): void => {
      const {init} = node;
      const {id} = node;

      if (init === undefined || init === null) {
        return;
      }

      if (isIdentifier(id)) {
        if (isPromiseLike(context, init)) {
          const {name} = id;
          reportNameViolation(context, id, name);
        }
      }

      if (isObjectPattern(id)) {
        handleObjectDestructuring(context, id, init, report);
      }
      if (isArrayPattern(id)) {
        handleArrayDestructuring(context, id, init, report);
      }
    };
    const onAssignmentExpression: Rule.NodeListener['AssignmentExpression'] = (
      node,
    ): void => {
      const {right} = node;
      if (isAwaitExpression(right)) {
        return;
      }
      const {left} = node;
      if (isIdentifier(left)) {
        if (isPromiseLike(context, right)) {
          const {name} = left;
          reportNameViolation(context, left, name);
        }
      }
      if (isObjectPattern(left)) {
        handleObjectDestructuring(context, left, right, report);
      }
      if (isArrayPattern(left)) {
        handleArrayDestructuring(context, left, right, report);
      }
    };
    return {
      VariableDeclarator: onVariableDeclarator,
      AssignmentExpression: onAssignmentExpression,
    };
  },
} as const satisfies Rule.RuleModule;
