import {describe, expect, test} from '@jest/globals';
import {isTemplateLiteralNode} from './isTemplateLiteralNode';
import type {TemplateLiteralNode} from './astTypes';

describe('isTemplateLiteralNode', () => {
  test('valid template literal node', () => {
    const node: TemplateLiteralNode = {
      type: 'TemplateLiteral',
      quasis: [{value: {raw: 'm-1 flex'}}, {value: {raw: 'text-sm'}}],
    };
    expect(isTemplateLiteralNode(node)).toBe(true);
  });

  test('invalid shapes', () => {
    expect(isTemplateLiteralNode({type: 'TemplateLiteral'})).toBe(false);
    expect(
      isTemplateLiteralNode({type: 'TemplateLiteral', quasis: [{value: {}}]}),
    ).toBe(false);
  });
});
