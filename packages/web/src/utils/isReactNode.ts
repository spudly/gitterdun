import type {ReactNode} from 'react';
import {isValidElement} from 'react';

export const isReactNode = (value: unknown): value is ReactNode => {
  if (
    value === null
    || typeof value === 'boolean'
    || typeof value === 'string'
    || typeof value === 'number'
  ) {
    return true;
  }
  if (isValidElement(value as unknown)) {
    return true;
  }
  if (Array.isArray(value)) {
    return (value as Array<unknown>).every(isReactNode);
  }
  return false;
};
