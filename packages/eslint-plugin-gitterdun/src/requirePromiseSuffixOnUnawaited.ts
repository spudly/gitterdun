import type {Rule} from 'eslint';
import {
  getType,
  isIdentifier,
  isAwaitExpression,
  isPromiseLikeExpression,
} from './utils/astNodeUtils.js';
import {isPromiseByType} from './utils/isPromiseByType.js';
import {
  checkArrayDestructureAssignments,
  checkObjectDestructureAssignments,
} from './utils/assignDetection.js';

const endsWithPromiseSuffix = (name: string): boolean => /promise$/i.test(name);

const reportNameViolation = (
  context: Rule.RuleContext,
  nodeForReport: unknown,
  name: string,
): void => {
  if (!endsWithPromiseSuffix(name)) {
    context.report({
      node: nodeForReport as never,
      messageId: 'requirePromiseSuffix',
      data: {name},
    });
  }
};

const buildInitMapFromObjectExpression = (init: {
  properties: Array<unknown>;
}): Map<string, unknown> => {
  const {properties} = init;
  const initMap = new Map<string, unknown>();
  for (const propertyNode of properties) {
    if (getType(propertyNode) !== 'Property') {
      continue;
    }
    const isComputed = (propertyNode as {computed?: unknown}).computed === true;
    if (isComputed) {
      continue;
    }
    const {key, value} = propertyNode as {key: unknown; value: unknown};
    if (!isIdentifier(key)) {
      continue;
    }
    const valueType = getType(value);
    const valueExpr =
      valueType === 'AssignmentPattern'
        ? (value as {right: unknown}).right
        : value;
    initMap.set(key.name, valueExpr);
  }
  return initMap;
};

const reportPatternPropertiesAgainstMap = (
  context: Rule.RuleContext,
  pattern: {properties: Array<unknown>},
  initMap: Map<string, unknown>,
): void => {
  checkObjectDestructureAssignments(context, pattern, initMap, (node, name) => {
    reportNameViolation(context, node, name);
  });
};

const handleObjectDestructuring = (
  context: Rule.RuleContext,
  pattern: unknown,
  init: unknown,
): void => {
  if (
    getType(init) !== 'ObjectExpression'
    || getType(pattern) !== 'ObjectPattern'
  ) {
    return;
  }
  const initMap = buildInitMapFromObjectExpression(
    init as {properties: Array<unknown>},
  );
  reportPatternPropertiesAgainstMap(
    context,
    pattern as {properties: Array<unknown>},
    initMap,
  );
};

const handleArrayDestructuring = (
  context: Rule.RuleContext,
  pattern: unknown,
  init: unknown,
): void => {
  if (
    getType(init) !== 'ArrayExpression'
    || getType(pattern) !== 'ArrayPattern'
  ) {
    return;
  }
  const {elements} = init as {elements: Array<unknown>};
  const {elements: patternElements} = pattern as {elements: Array<unknown>};
  checkArrayDestructureAssignments(
    context,
    {elements: patternElements},
    elements,
    (node, name) => {
      reportNameViolation(context, node, name);
    },
  );
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
  create(context) {
    const services = (context.sourceCode.parserServices ?? {}) as {
      program?: unknown;
      esTreeNodeToTSNodeMap?: unknown;
    };
    const hasTypeInfo =
      services.program !== undefined
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
    const onVariableDeclarator = (node: unknown): void => {
      const {init} = node as {init?: unknown};
      const {id} = node as {id: unknown};

      if (init === undefined || init === null) {
        return;
      }

      if (getType(id) === 'Identifier') {
        if (isPromiseLike(context, init)) {
          const {name} = id as {name: string};
          reportNameViolation(context, id, name);
        }
      }

      if (getType(id) === 'ObjectPattern') {
        handleObjectDestructuring(context, id, init);
      }
      if (getType(id) === 'ArrayPattern') {
        handleArrayDestructuring(context, id, init);
      }
    };
    const onAssignmentExpression = (node: unknown): void => {
      const {right} = node as {right: unknown};
      if (isAwaitExpression(right)) {
        return;
      }
      const {left} = node as {left: unknown};
      if (getType(left) === 'Identifier') {
        if (isPromiseLike(context, right)) {
          const {name} = left as {name: string};
          reportNameViolation(context, left, name);
        }
      }
      if (getType(left) === 'ObjectPattern') {
        handleObjectDestructuring(context, left, right);
      }
      if (getType(left) === 'ArrayPattern') {
        handleArrayDestructuring(context, left, right);
      }
    };
    return {
      VariableDeclarator: onVariableDeclarator,
      AssignmentExpression: onAssignmentExpression,
    };
  },
} as const satisfies Rule.RuleModule;
