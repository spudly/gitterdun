/* eslint-disable gitterdun/no-tailwind-margins -- test file contains margin classes as test data */
import {RuleTester} from 'eslint';
import {noTailwindMargins} from '../noTailwindMargins.js';

const ruleTester = new RuleTester({
  languageOptions: {
    parser: require('@typescript-eslint/parser'),
    parserOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
      ecmaFeatures: {
        jsx: true,
      },
    },
  },
});

ruleTester.run('no-tailwind-margins', noTailwindMargins, {
  valid: [
    // Valid className without margin classes
    {
      code: '<div className="flex p-4 bg-blue-500 text-white" />',
    },
    {
      code: '<div className="grid gap-4 space-y-2" />',
    },
    {
      code: '<div className="" />',
    },
    {
      code: '<div className={undefined} />',
    },
    // class attribute (for non-React contexts)
    {
      code: '<div class="flex p-4 bg-blue-500" />',
    },
    // Template literals without margin classes
    {
      code: '<div className={`flex p-4 ${isActive ? "bg-blue-500" : "bg-gray-500"}`} />',
    },
    // Other attributes should not be checked
    {
      code: '<div id="m-4" data-test="mb-2" />',
    },
    // String literals that don't look like CSS classes
    {
      code: 'const message = "margin-top is not allowed";',
    },
    {
      code: 'const config = "m-4";', // doesn't match Tailwind pattern
    },
  ],
  invalid: [
    // Single margin class
    {
      code: '<div className="flex m-4 p-2" />',
      errors: [
        {
          messageId: 'noMarginClasses',
          data: {className: 'm-4'},
        },
      ],
    },
    // Multiple margin classes
    {
      code: '<div className="flex m-4 mb-2 p-2" />',
      errors: [
        {
          messageId: 'noMarginClassesMultiple',
          data: {classNames: 'm-4, mb-2'},
        },
      ],
    },
    // All margin direction classes
    {
      code: '<div className="mt-4" />',
      errors: [{messageId: 'noMarginClasses', data: {className: 'mt-4'}}],
    },
    {
      code: '<div className="mr-4" />',
      errors: [{messageId: 'noMarginClasses', data: {className: 'mr-4'}}],
    },
    {
      code: '<div className="mb-4" />',
      errors: [{messageId: 'noMarginClasses', data: {className: 'mb-4'}}],
    },
    {
      code: '<div className="ml-4" />',
      errors: [{messageId: 'noMarginClasses', data: {className: 'ml-4'}}],
    },
    {
      code: '<div className="mx-4" />',
      errors: [{messageId: 'noMarginClasses', data: {className: 'mx-4'}}],
    },
    {
      code: '<div className="my-4" />',
      errors: [{messageId: 'noMarginClasses', data: {className: 'my-4'}}],
    },
    // Negative margin classes
    {
      code: '<div className="-m-4" />',
      errors: [{messageId: 'noMarginClasses', data: {className: '-m-4'}}],
    },
    {
      code: '<div className="-mt-4" />',
      errors: [{messageId: 'noMarginClasses', data: {className: '-mt-4'}}],
    },
    {
      code: '<div className="-mr-4" />',
      errors: [{messageId: 'noMarginClasses', data: {className: '-mr-4'}}],
    },
    {
      code: '<div className="-mb-4" />',
      errors: [{messageId: 'noMarginClasses', data: {className: '-mb-4'}}],
    },
    {
      code: '<div className="-ml-4" />',
      errors: [{messageId: 'noMarginClasses', data: {className: '-ml-4'}}],
    },
    {
      code: '<div className="-mx-4" />',
      errors: [{messageId: 'noMarginClasses', data: {className: '-mx-4'}}],
    },
    {
      code: '<div className="-my-4" />',
      errors: [{messageId: 'noMarginClasses', data: {className: '-my-4'}}],
    },
    // Various margin values
    {
      code: '<div className="m-0" />',
      errors: [{messageId: 'noMarginClasses', data: {className: 'm-0'}}],
    },
    {
      code: '<div className="m-px" />',
      errors: [{messageId: 'noMarginClasses', data: {className: 'm-px'}}],
    },
    {
      code: '<div className="m-0.5" />',
      errors: [{messageId: 'noMarginClasses', data: {className: 'm-0.5'}}],
    },
    {
      code: '<div className="m-96" />',
      errors: [{messageId: 'noMarginClasses', data: {className: 'm-96'}}],
    },
    {
      code: '<div className="m-auto" />',
      errors: [{messageId: 'noMarginClasses', data: {className: 'm-auto'}}],
    },
    // Arbitrary values
    {
      code: '<div className="m-[10px]" />',
      errors: [{messageId: 'noMarginClasses', data: {className: 'm-[10px]'}}],
    },
    {
      code: '<div className="mt-[2rem]" />',
      errors: [{messageId: 'noMarginClasses', data: {className: 'mt-[2rem]'}}],
    },
    // Template literals with margin classes
    {
      code: '<div className={`flex m-4 ${isActive ? "bg-blue-500" : "bg-gray-500"}`} />',
      errors: [{messageId: 'noMarginClasses', data: {className: 'm-4'}}],
    },
    {
      code: '<div className={`flex mt-2 mb-4 ${className}`} />',
      errors: [{messageId: 'noMarginClassesMultiple', data: {classNames: 'mt-2, mb-4'}}],
    },
    // class attribute (for non-React contexts)
    {
      code: '<div class="flex m-4 p-2" />',
      errors: [{messageId: 'noMarginClasses', data: {className: 'm-4'}}],
    },
    // String literals that look like CSS classes
    {
      code: 'const classes = "flex m-4 p-2";',
      errors: [{messageId: 'noMarginClasses', data: {className: 'm-4'}}],
    },
    {
      code: 'const buttonClasses = "bg-blue-500 text-white m-2";',
      errors: [{messageId: 'noMarginClasses', data: {className: 'm-2'}}],
    },
    // Edge case: multiple spaces
    {
      code: '<div className="flex    m-4    p-2" />',
      errors: [{messageId: 'noMarginClasses', data: {className: 'm-4'}}],
    },
    // Edge case: newlines in className
    {
      code: `<div className="flex
        m-4
        p-2" />`,
      errors: [{messageId: 'noMarginClasses', data: {className: 'm-4'}}],
    },
  ],
});