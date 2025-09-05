import type {JSSyntaxElement, Rule} from 'eslint';
import {
  getType,
  isIdentifier,
  isPromiseLikeExpression,
} from './astNodeUtils.js';
import {isPromiseByType} from './isPromiseByType.js';
import type {Pattern} from 'estree';

export const checkObjectDestructureAssignments = (
  context: Rule.RuleContext,
  pattern: {properties: Array<unknown>},
  initMap: Map<string, unknown>,
  report: (node: JSSyntaxElement, name: string) => void,
): void => {
  const {properties} = pattern;
  for (const propertyNode of properties) {
    if (getType(propertyNode) !== 'Property') {
      continue;
    }
    const isComputed = (propertyNode as {computed?: unknown}).computed === true;
    if (isComputed) {
      continue;
    }
    const {key, value} = propertyNode as {key: unknown; value: unknown};
    const keyName = isIdentifier(key) ? key.name : null;
    if (keyName !== null && isIdentifier(value)) {
      const valueExpr = initMap.get(keyName);
      if (valueExpr !== undefined) {
        const isCall = getType(valueExpr) === 'CallExpression';
        if (
          isPromiseByType(context, valueExpr)
          || isPromiseLikeExpression(valueExpr)
          || isCall
        ) {
          report(value, value.name);
        }
      }
    }
  }
};

export const checkArrayDestructureAssignments = (
  context: Rule.RuleContext,
  pattern: {elements: Array<Pattern | null>},
  elements: Array<unknown>,
  report: (node: Pattern | null, name: string) => void,
): void => {
  pattern.elements.forEach((elementNode, index) => {
    if (!isIdentifier(elementNode)) {
      return;
    }
    const slice = elements.slice(index, index + 1);
    const valueExpr = slice.length > 0 ? slice[0] : undefined;
    const isSpread = getType(valueExpr) === 'SpreadElement';
    if (valueExpr == null || isSpread) {
      return;
    }
    if (
      isPromiseByType(context, valueExpr)
      || isPromiseLikeExpression(valueExpr)
      || getType(valueExpr) === 'CallExpression'
    ) {
      const {name} = elementNode;
      report(elementNode, name);
    }
  });
};
