export type LiteralNode = {
  type: 'Literal';
  value: string | number | boolean | RegExp | null;
};

export type TemplateLiteralNode = {
  type: 'TemplateLiteral';
  quasis: Array<{value: {raw: string}}>;
};

export type JSXExpressionContainerNode = {
  type: 'JSXExpressionContainer';
  expression?: unknown;
};
