import type {LiteralNode} from './astTypes';
import {isObjectRecord} from './isObjectRecord';

export const isLiteralNode = (value: unknown): value is LiteralNode => {
  return (
    isObjectRecord(value)
    && typeof value['type'] === 'string'
    && value['type'] === 'Literal'
  );
};
