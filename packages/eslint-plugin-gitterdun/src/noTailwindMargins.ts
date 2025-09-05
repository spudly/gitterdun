import type {Rule} from 'eslint';
import type {TSESTree} from '@typescript-eslint/types';
import type {LiteralNode} from './utils/astTypes';
import {isObjectRecord} from './utils/isObjectRecord';
import {isLiteralNode} from './utils/isLiteralNode';
import {isJSXExpressionContainerNode} from './utils/isJSXExpressionContainerNode';
import {isTemplateLiteralNode} from './utils/isTemplateLiteralNode';
import {hasTailwindMarginClasses} from './utils/hasTailwindMarginClasses';

// margin class detection is implemented in utils/hasTailwindMarginClasses

/**
 * Reports margin class violations to the ESLint context
 */
const reportViolatingClasses = (
  context: Rule.RuleContext,
  node: unknown,
  violatingClasses: Array<string>,
): void => {
  if (violatingClasses.length > 0) {
    context.report({
      // Casting only for the ESLint API call; we avoid `any` elsewhere
      node: node as never,
      messageId:
        violatingClasses.length === 1
          ? 'noMarginClasses'
          : 'noTailwindMarginsMultiple',
      data: {
        className: violatingClasses[0] ?? '',
        classNames: violatingClasses.join(', '),
      },
    });
  }
};

/**
 * Handles JSX string literal values
 */
const handleLiteralValue = (
  context: Rule.RuleContext,
  node: unknown,
  literal: LiteralNode,
): void => {
  if (typeof literal.value === 'string') {
    const violatingClasses = hasTailwindMarginClasses(literal.value);
    reportViolatingClasses(context, node, violatingClasses);
  }
};

/**
 * Handles JSX template literal expressions
 */
const handleTemplateLiteral = (
  context: Rule.RuleContext,
  node: unknown,
  expression: unknown,
): void => {
  if (!isTemplateLiteralNode(expression)) {
    return;
  }

  for (const quasi of expression.quasis) {
    // eslint-disable-next-line no-extra-boolean-cast -- ESLint AST property access requires explicit boolean
    if (Boolean(quasi.value.raw)) {
      const violatingClasses = hasTailwindMarginClasses(quasi.value.raw);
      reportViolatingClasses(context, node, violatingClasses);
    }
  }
};

export const noTailwindMargins: Rule.RuleModule = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow the use of Tailwind CSS margin classes',
      category: 'Best Practices',
      recommended: true,
    },
    schema: [],
    messages: {
      noMarginClasses:
        'Tailwind CSS margin class "{{className}}" is not allowed. Use padding or gap instead.',
      noTailwindMarginsMultiple:
        'Tailwind CSS margin classes are not allowed: {{classNames}}. Use padding or gap instead.',
    },
  },

  create(context): Rule.RuleListener {
    // Track literal nodes that are part of JSX attributes to avoid double-reporting
    const processedLiterals = new Set<LiteralNode>();

    return {
      JSXAttribute(node: TSESTree.JSXAttribute) {
        // Only check className and class attributes
        if (!isObjectRecord(node)) {
          return;
        }
        const nameNode = node.name;
        let attributeName: string | undefined;
        if (isObjectRecord(nameNode) && typeof nameNode.name === 'string') {
          attributeName = nameNode.name;
        }
        if (attributeName !== 'className' && attributeName !== 'class') {
          return;
        }
        const valueNode = node.value;
        if (isLiteralNode(valueNode)) {
          processedLiterals.add(valueNode);
          handleLiteralValue(context, node, valueNode);
        }
        if (isJSXExpressionContainerNode(valueNode)) {
          const {expression} = valueNode;
          handleTemplateLiteral(context, node, expression);
        }
      },

      // Also check regular string literals for non-JSX contexts

      Literal(node: unknown) {
        // Skip literals that have already been processed by JSXAttribute
        if (isLiteralNode(node) && processedLiterals.has(node)) {
          return;
        }
        if (isLiteralNode(node) && typeof node.value === 'string') {
          // Simple heuristic: if it looks like CSS classes (contains common Tailwind patterns)
          const {value} = node;
          const hasTailwindPattern =
            /\b(?:flex|grid|text-|bg-|border-|p-|space-)/;
          if (hasTailwindPattern.test(value)) {
            const violatingClasses = hasTailwindMarginClasses(value);
            reportViolatingClasses(context, node, violatingClasses);
          }
        }
      },
    };
  },
};
