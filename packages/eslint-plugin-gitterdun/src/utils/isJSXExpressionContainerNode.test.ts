import {describe, expect, test} from '@jest/globals';
import {isJSXExpressionContainerNode} from './isJSXExpressionContainerNode.js';
import type {JSXExpressionContainerNode} from './astTypes.js';

describe('isJSXExpressionContainerNode', () => {
  test('detects JSXExpressionContainer node', () => {
    const node: JSXExpressionContainerNode = {type: 'JSXExpressionContainer'};
    expect(isJSXExpressionContainerNode(node)).toBe(true);
  });

  test('rejects other node', () => {
    expect(isJSXExpressionContainerNode({type: 'Literal'})).toBe(false);
  });
});
