import type {Rule} from 'eslint';
import {
  getType,
  isIdentifier,
  isPromiseLikeExpression,
} from './astNodeUtils.js';
import {isPromiseByType} from './isPromiseByType.js';

export const checkObjectDestructureAssignments = (
  context: Rule.RuleContext,
  pattern: {properties: Array<unknown>},
  initMap: Map<string, unknown>,
  report: (node: unknown, name: string) => void,
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
  pattern: {elements: Array<unknown>},
  elements: Array<unknown>,
  report: (node: unknown, name: string) => void,
): void => {
  pattern.elements.forEach((elementNode, index) => {
    if (getType(elementNode) !== 'Identifier') {
      return;
    }
    const slice = elements.slice(index, index + 1);
    const valueExpr = slice.length > 0 ? slice[0] : undefined;
    const isSpread = getType(valueExpr) === 'SpreadElement';
    if (valueExpr == null || isSpread) {
      return;
    }
    const isCall = getType(valueExpr) === 'CallExpression';
    if (
      isPromiseByType(context, valueExpr)
      || isPromiseLikeExpression(valueExpr)
      || isCall
    ) {
      report(elementNode, (elementNode as {name: string}).name);
    }
  });
};
