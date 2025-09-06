import type {JSXExpressionContainerNode} from './astTypes.js';
import {isObjectRecord} from './isObjectRecord.js';

export const isJSXExpressionContainerNode = (
  value: unknown,
): value is JSXExpressionContainerNode => {
  return (
    isObjectRecord(value)
    && typeof value['type'] === 'string'
    && value['type'] === 'JSXExpressionContainer'
  );
};
