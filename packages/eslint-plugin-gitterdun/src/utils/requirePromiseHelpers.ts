import type {Rule, SourceCode} from 'eslint';
import type {
  ArrayPattern,
  AssignmentPattern,
  Expression,
  ObjectExpression,
  ObjectPattern,
  Pattern,
  Property as ESTreeProperty,
} from 'estree';
import {
  getType,
  isIdentifier,
  isObjectPattern,
  isArrayExpression,
  isObjectExpression,
} from './astNodeUtils.js';
import {
  checkArrayDestructureAssignments,
  checkObjectDestructureAssignments,
} from './assignDetection.js';

const buildInitMapFromObjectExpression = (
  init: Pick<ObjectExpression, 'properties'>,
): Map<string, Expression> => {
  const {properties} = init;
  const initMap = new Map<string, Expression>();
  const isProperty = (node: unknown): node is ESTreeProperty =>
    getType(node) === 'Property';
  for (const propertyNode of properties) {
    if (!isProperty(propertyNode)) {
      continue;
    }
    if (propertyNode.computed) {
      continue;
    }
    const {key, value} = propertyNode;
    if (!isIdentifier(key)) {
      continue;
    }
    const isPattern = (node: unknown): node is Pattern => {
      const nodeType = getType(node);
      return (
        nodeType === 'ArrayPattern'
        || nodeType === 'ObjectPattern'
        || nodeType === 'AssignmentPattern'
        || nodeType === 'RestElement'
      );
    };
    const isAssignmentPattern = (node: unknown): node is AssignmentPattern =>
      getType(node) === 'AssignmentPattern';
    if (isPattern(value)) {
      if (isAssignmentPattern(value)) {
        initMap.set(
          (key as {name: string}).name,
          (value as {right: Expression}).right,
        );
      }
      continue;
    }
    initMap.set((key as {name: string}).name, value as Expression);
  }
  return initMap;
};

const reportPatternPropertiesAgainstMap = (
  context: Rule.RuleContext,
  pattern: {properties: Array<unknown>},
  initMap: Map<string, unknown>,
  report: (node: unknown, name: string) => void,
): void => {
  checkObjectDestructureAssignments(context, pattern, initMap, report);
};

export const handleObjectDestructuring = (
  context: Rule.RuleContext,
  pattern: ObjectPattern,
  init: Expression,
  report: (node: unknown, name: string) => void,
): void => {
  if (!isObjectExpression(init) || !isObjectPattern(pattern)) {
    return;
  }
  const initMap = buildInitMapFromObjectExpression(init);
  reportPatternPropertiesAgainstMap(
    context,
    pattern as {properties: Array<unknown>},
    initMap,
    report,
  );
};

export const handleArrayDestructuring = (
  context: Rule.RuleContext,
  pattern: ArrayPattern,
  init: Expression,
  report: (node: unknown, name: string) => void,
): void => {
  if (!isArrayExpression(init)) {
    return;
  }
  const {elements} = init;
  const {elements: patternElements} = pattern;
  checkArrayDestructureAssignments(
    context,
    {elements: patternElements},
    elements,
    (node: Pattern | null, name: string) => {
      if (node !== null && isIdentifier(node)) {
        report(node, name);
      }
    },
  );
};

type UnknownParserServices = {
  program?: unknown;
  esTreeNodeToTSNodeMap?: unknown;
};

type SourceCodeWithUnknownParserServices = Omit<
  SourceCode,
  'parserServices'
> & {parserServices: UnknownParserServices};

export const hasParserServices = (
  sourceCode: SourceCode,
): sourceCode is SourceCodeWithUnknownParserServices =>
  'parserServices' in sourceCode;
