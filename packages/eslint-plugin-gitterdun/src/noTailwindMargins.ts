import type {Rule} from 'eslint';

// Using simple interfaces for AST node types to avoid external dependencies
interface LiteralNode {
  type: 'Literal';
  value: string | number | boolean | RegExp | null;
}

interface JSXAttributeNode {
  type: 'JSXAttribute';
  name?: {
    type: 'JSXIdentifier';
    name: string;
  };
  value?: {
    type: 'Literal' | 'JSXExpressionContainer';
    value?: string | number | boolean | RegExp | null;
    expression?: {
      type: string;
      quasis?: Array<{
        value: { raw: string };
      }>;
    };
  };
}

/**
 * Detects if a string contains Tailwind CSS margin classes
 */
const hasTailwindMarginClasses = (classNameValue: string): Array<string> => {
  const marginPrefixes = [
    'm-', 'mt-', 'mr-', 'mb-', 'ml-', 'mx-', 'my-',
    '-m-', '-mt-', '-mr-', '-mb-', '-ml-', '-mx-', '-my-'
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
  violatingClasses: Array<string>
): void => {
  if (violatingClasses.length > 0) {
    context.report({
      node,
      messageId: violatingClasses.length === 1 ? 'noMarginClasses' : 'noMarginClassesMultiple',
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
  literal: LiteralNode
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
  expression: any
): void => {
  if (expression && expression.type === 'TemplateLiteral' && expression.quasis) {
    for (const quasi of expression.quasis) {
      if (quasi.value.raw) {
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
      noMarginClasses: 'Tailwind CSS margin class "{{className}}" is not allowed. Use padding or gap instead.',
      noMarginClassesMultiple: 'Tailwind CSS margin classes are not allowed: {{classNames}}. Use padding or gap instead.',
    },
  },

  create(context) {
    return {
      JSXAttribute(node: any) {
        // Only check className and class attributes
        if (!node.name) {
          return;
        }
        
        const {name: attributeName} = node.name;
        if (attributeName !== 'className' && attributeName !== 'class') {
          return;
        }

        // Handle string literal values
        if (node.value && node.value.type === 'Literal') {
          const literal = node.value as LiteralNode;
          handleLiteralValue(context, node, literal);
        }

        // Handle template literal expressions (e.g., className={`flex ${someVar}`})
        if (node.value && node.value.type === 'JSXExpressionContainer') {
          const {expression} = node.value;
          handleTemplateLiteral(context, node, expression);
        }
      },

      // Also check regular string literals for non-JSX contexts
      Literal(node: any) {
        if (typeof node.value === 'string') {
          // Simple heuristic: if it looks like CSS classes (contains common Tailwind patterns)
          const {value} = node;
          const hasTailwindPattern = /\b(?:flex|grid|text-|bg-|border-|p-|space-)/;
          
          if (hasTailwindPattern.test(value)) {
            const violatingClasses = hasTailwindMarginClasses(value);
            reportViolatingClasses(context, node, violatingClasses);
          }
        }
      },
    };
  },
};