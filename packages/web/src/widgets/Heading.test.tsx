import {render, screen} from '@testing-library/react';
import {Heading} from './Heading.js';
import {describe, expect, test} from '@jest/globals';

describe('<Heading />', () => {
  describe('default behavior', () => {
    test('renders as h1 by default', () => {
      render(<Heading>Default Header</Heading>);
      const header = screen.getByRole('heading', {level: 1});
      expect(header).toHaveTextContent('Default Header');
      expect(header).toHaveTextContent('Default Header');
    });

    test('renders with h1 size and weight classes', () => {
      render(<Heading>Default Header</Heading>);
      const header = screen.getByRole('heading', {level: 1});
      expect(header).toHaveClass('text-4xl', 'font-bold');
    });
  });

  describe('level prop with automatic styling', () => {
    test('renders h1 with xl size and bold weight', () => {
      render(<Heading level={1}>Level 1</Heading>);
      const header = screen.getByRole('heading', {level: 1});
      expect(header).toHaveTextContent('Level 1');
      expect(header).toHaveClass('text-4xl', 'font-bold');
    });

    test('renders h2 with lg size and bold weight', () => {
      render(<Heading level={2}>Level 2</Heading>);
      const header = screen.getByRole('heading', {level: 2});
      expect(header).toHaveTextContent('Level 2');
      expect(header).toHaveClass('text-3xl', 'font-bold');
    });

    test('renders h3 with md size and bold weight', () => {
      render(<Heading level={3}>Level 3</Heading>);
      const header = screen.getByRole('heading', {level: 3});
      expect(header).toHaveTextContent('Level 3');
      expect(header).toHaveClass('text-2xl', 'font-bold');
    });

    test('renders h4 with sm size and semibold weight', () => {
      render(<Heading level={4}>Level 4</Heading>);
      const header = screen.getByRole('heading', {level: 4});
      expect(header).toHaveTextContent('Level 4');
      expect(header).toHaveClass('text-lg', 'font-semibold');
    });

    test('renders h5 with xs size and semibold weight', () => {
      render(<Heading level={5}>Level 5</Heading>);
      const header = screen.getByRole('heading', {level: 5});
      expect(header).toHaveTextContent('Level 5');
      expect(header).toHaveClass('text-base', 'font-semibold');
    });

    test('renders h6 with xs size and medium weight', () => {
      render(<Heading level={6}>Level 6</Heading>);
      const header = screen.getByRole('heading', {level: 6});
      expect(header).toHaveTextContent('Level 6');
      expect(header).toHaveClass('text-base', 'font-medium');
    });
  });

  describe('no spacing applied by component', () => {
    test('does not apply any spacing classes', () => {
      render(<Heading>No Spacing</Heading>);
      const header = screen.getByRole('heading', {level: 1});
      expect(header).not.toHaveClass('mb-2', 'mb-4', 'mb-6');
    });

    test('allows parent to control spacing via external classes', () => {
      render(
        <div aria-label="container" className="flex flex-col gap-4">
          <Heading level={2}>Externally Spaced</Heading>
        </div>,
      );
      expect(screen.getByLabelText('container')).toHaveClass('gap-4');
    });
  });

  describe('children content', () => {
    test('renders text content', () => {
      render(<Heading>Text Content</Heading>);
      const header = screen.getByRole('heading', {level: 1});
      expect(header).toHaveTextContent('Text Content');
    });

    test('renders JSX content', () => {
      render(
        <Heading>
          <span>JSX</span> Content
        </Heading>,
      );
      const header = screen.getByRole('heading', {level: 1});
      expect(header).toHaveTextContent('JSX Content');
    });

    test('renders complex nested content', () => {
      render(
        <Heading>
          Complex <em>nested</em> <strong>content</strong>
        </Heading>,
      );
      const header = screen.getByRole('heading', {level: 1});
      expect(header).toHaveTextContent('Complex nested content');
    });
  });
});
