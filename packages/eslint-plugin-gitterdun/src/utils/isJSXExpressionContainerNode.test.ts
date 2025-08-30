import {describe, expect, test} from '@jest/globals';
import {isJSXExpressionContainerNode} from './isJSXExpressionContainerNode';
import type {JSXExpressionContainerNode} from './astTypes';

describe('isJSXExpressionContainerNode', () => {
  test('detects JSXExpressionContainer node', () => {
    const node: JSXExpressionContainerNode = {type: 'JSXExpressionContainer'};
    expect(isJSXExpressionContainerNode(node)).toBe(true);
  });

  test('rejects other node', () => {
    expect(isJSXExpressionContainerNode({type: 'Literal'})).toBe(false);
  });
});
