import type {LiteralNode} from './astTypes.js';
import {isObjectRecord} from './isObjectRecord.js';

export const isLiteralNode = (value: unknown): value is LiteralNode => {
  return (
    isObjectRecord(value)
    && typeof value['type'] === 'string'
    && value['type'] === 'Literal'
  );
};
