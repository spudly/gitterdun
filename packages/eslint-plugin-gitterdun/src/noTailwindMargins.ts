/* eslint-disable max-lines -- Complex ESLint rule with extensive comments and type safety */
import type {Rule} from 'eslint';

// Using simple types for AST node types to avoid external dependencies
type LiteralNode = {
  type: 'Literal';
  value: string | number | boolean | RegExp | null;
};

type JSXAttributeNode = {
  type: 'JSXAttribute';
  name?: {type: 'JSXIdentifier'; name: string};
  value?: {
    type: 'Literal' | 'JSXExpressionContainer';
    value?: string | number | boolean | RegExp | null;
    expression?: {type: string; quasis?: Array<{value: {raw: string}}>};
  };
};

/**
 * Detects if a string contains Tailwind CSS margin classes
 */
const hasTailwindMarginClasses = (classNameValue: string): Array<string> => {
  const marginPrefixes = [
    'm-',
    'mt-',
    'mr-',
    'mb-',
    'ml-',
    'mx-',
    'my-',
    '-m-',
    '-mt-',
    '-mr-',
    '-mb-',
    '-ml-',
    '-mx-',
    '-my-',
  ];

  const classes = classNameValue.split(/\s+/).filter(Boolean);
  const violatingClasses: Array<string> = [];

  for (const className of classes) {
    for (const prefix of marginPrefixes) {
      if (className.startsWith(prefix)) {
        violatingClasses.push(className);
        break;
      }
    }
  }

  return violatingClasses;
};

/**
 * Reports margin class violations to the ESLint context
 */
const reportViolatingClasses = (
  context: Rule.RuleContext,
  node: JSXAttributeNode | LiteralNode,
  violatingClasses: Array<string>,
): void => {
  if (violatingClasses.length > 0) {
    context.report({
      node,
      messageId:
        violatingClasses.length === 1
          ? 'noMarginClasses'
          : 'noMarginClassesMultiple',
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
  node: JSXAttributeNode,
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
  node: JSXAttributeNode,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- ESLint AST nodes require any type
  expression: any,
): void => {
  if (
    Boolean(expression)
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access -- ESLint AST property access
    && expression.type === 'TemplateLiteral'
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access -- ESLint AST property access
    && Boolean(expression.quasis)
  ) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access -- ESLint AST property access
    for (const quasi of expression.quasis) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, no-extra-boolean-cast -- ESLint AST property access requires explicit boolean
      if (Boolean(quasi.value.raw)) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-argument -- ESLint AST property access
        const violatingClasses = hasTailwindMarginClasses(quasi.value.raw);
        reportViolatingClasses(context, node, violatingClasses);
      }
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
      noMarginClassesMultiple:
        'Tailwind CSS margin classes are not allowed: {{classNames}}. Use padding or gap instead.',
    },
  },

  create(context) {
    // Track literal nodes that are part of JSX attributes to avoid double-reporting
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- ESLint AST nodes require any type
    const processedLiterals = new Set<any>();

    return {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any -- ESLint AST nodes require any type
      JSXAttribute(node: any) {
        // Only check className and class attributes
        // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions, @typescript-eslint/no-unsafe-member-access -- ESLint AST property access
        if (!node.name) {
          return;
        }

        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access -- ESLint AST property access
        const {name: attributeName} = node.name;
        if (attributeName !== 'className' && attributeName !== 'class') {
          return;
        }

        // Handle string literal values
        // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions, @typescript-eslint/no-unsafe-member-access -- ESLint AST property access
        if (node.value && node.value.type === 'Literal') {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access -- ESLint AST property access
          const literal = node.value as LiteralNode;
          processedLiterals.add(literal); // Mark this literal as processed
          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument -- ESLint AST node argument
          handleLiteralValue(context, node, literal);
        }

        // Handle template literal expressions (e.g., className={`flex ${someVar}`})
        // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions, @typescript-eslint/no-unsafe-member-access -- ESLint AST property access
        if (node.value && node.value.type === 'JSXExpressionContainer') {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access -- ESLint AST property access
          const {expression} = node.value;
          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument -- ESLint AST node argument
          handleTemplateLiteral(context, node, expression);
        }
      },

      // Also check regular string literals for non-JSX contexts
      // eslint-disable-next-line @typescript-eslint/no-explicit-any -- ESLint AST nodes require any type
      Literal(node: any) {
        // Skip literals that have already been processed by JSXAttribute
        if (processedLiterals.has(node)) {
          return;
        }

        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access -- ESLint AST property access
        if (typeof node.value === 'string') {
          // Simple heuristic: if it looks like CSS classes (contains common Tailwind patterns)
           
          const {value} = node;
          const hasTailwindPattern =
            /\b(?:flex|grid|text-|bg-|border-|p-|space-)/;

          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument -- ESLint AST property access
          if (hasTailwindPattern.test(value)) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument -- ESLint AST property access
            const violatingClasses = hasTailwindMarginClasses(value);
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument -- ESLint AST node argument
            reportViolatingClasses(context, node, violatingClasses);
          }
        }
      },
    };
  },
};
/* eslint-enable max-lines */
