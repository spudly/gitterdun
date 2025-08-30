import type {TemplateLiteralNode} from './astTypes';
import {isObjectRecord} from './isObjectRecord';

export const isTemplateLiteralNode = (
  value: unknown,
): value is TemplateLiteralNode => {
  if (!isObjectRecord(value)) {
    return false;
  }
  if (
    typeof value['type'] !== 'string'
    || value['type'] !== 'TemplateLiteral'
  ) {
    return false;
  }
  const {quasis} = value as {quasis?: unknown};
  if (!Array.isArray(quasis)) {
    return false;
  }
  const hasValueProp = (
    quasiCandidate: unknown,
  ): quasiCandidate is {value: unknown} => {
    return isObjectRecord(quasiCandidate) && 'value' in quasiCandidate;
  };
  const hasRawString = (qv: unknown): qv is {raw: string} => {
    if (!isObjectRecord(qv)) {
      return false;
    }
    return typeof qv['raw'] === 'string';
  };
  for (const quasi of quasis) {
    if (!hasValueProp(quasi)) {
      return false;
    }
    const qv = quasi.value;
    if (!hasRawString(qv)) {
      return false;
    }
  }
  return true;
};
