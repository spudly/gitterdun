import {describe, expect, test} from '@jest/globals';
import {isLiteralNode} from './isLiteralNode';
import type {LiteralNode} from './astTypes';

describe('isLiteralNode', () => {
  test('detects literal node', () => {
    const node: LiteralNode = {type: 'Literal', value: 'hello'};
    expect(isLiteralNode(node)).toBe(true);
  });

  test('rejects non-literal node', () => {
    expect(isLiteralNode({type: 'Other'})).toBe(false);
  });
});
