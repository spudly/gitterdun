import type {JSXExpressionContainerNode} from './astTypes';
import {isObjectRecord} from './isObjectRecord';

export const isJSXExpressionContainerNode = (
  value: unknown,
): value is JSXExpressionContainerNode => {
  return (
    isObjectRecord(value)
    && typeof value['type'] === 'string'
    && value['type'] === 'JSXExpressionContainer'
  );
};
