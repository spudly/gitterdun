import {describe, expect, test} from '@jest/globals';
import {render, screen} from '@testing-library/react';
import {Section} from './Section';

describe('section', () => {
  describe('basic rendering', () => {
    test('renders a section element with header and children', () => {
      render(
        <Section header="Test Section">
          <p>Child content</p>
        </Section>,
      );

      const section = screen.getByRole('region');
      const header = screen.getByRole('heading', {level: 2});
      const content = screen.getByText('Child content');

      expect(section).toBeInTheDocument();
      expect(header).toHaveTextContent('Test Section');
      expect(content).toBeInTheDocument();
    });

    test('renders with default header level 2 when no context', () => {
      render(
        <Section header="Default Level">
          <div>Content</div>
        </Section>,
      );

      const header = screen.getByRole('heading', {level: 2});
      expect(header).toBeInTheDocument();
    });

    test('accepts multiple children', () => {
      render(
        <Section header="Multiple Children">
          <p>First child</p>
          <p>Second child</p>
          <div>Third child</div>
        </Section>,
      );

      expect(screen.getByText('First child')).toBeInTheDocument();
      expect(screen.getByText('Second child')).toBeInTheDocument();
      expect(screen.getByText('Third child')).toBeInTheDocument();
    });
  });

  describe('headingLevel prop', () => {
    test('uses explicit headingLevel when provided', () => {
      render(
        <Section header="Custom Level" headingLevel={4}>
          <p>Content</p>
        </Section>,
      );

      const header = screen.getByRole('heading', {level: 4});
      expect(header).toHaveTextContent('Custom Level');
    });

    test('supports all header levels 1-6', () => {
      const levels = [1, 2, 3, 4, 5, 6] as const;

      levels.forEach(level => {
        const {unmount} = render(
          <Section header={`Level ${level}`} headingLevel={level}>
            <div>Content</div>
          </Section>,
        );

        const header = screen.getByRole('heading', {level});
        expect(header).toHaveTextContent(`Level ${level}`);
        unmount();
      });
    });
  });

  describe('gap prop', () => {
    test('applies no gap class by default', () => {
      render(
        <Section header="No Gap">
          <p>Child</p>
        </Section>,
      );

      const section = screen.getByRole('region');
      expect(section).not.toHaveClass(
        'space-y-1',
        'space-y-2',
        'space-y-4',
        'space-y-6',
        'space-y-8',
      );
    });

    test('applies correct gap classes', () => {
      const gaps = [
        {gap: 'xs' as const, expectedClass: 'space-y-1'},
        {gap: 'sm' as const, expectedClass: 'space-y-2'},
        {gap: 'md' as const, expectedClass: 'space-y-4'},
        {gap: 'lg' as const, expectedClass: 'space-y-6'},
        {gap: 'xl' as const, expectedClass: 'space-y-8'},
      ];

      gaps.forEach(({gap, expectedClass}) => {
        const {unmount} = render(
          <Section gap={gap} header={`Gap ${gap}`}>
            <p>Child</p>
          </Section>,
        );

        const section = screen.getByRole('region');
        expect(section).toHaveClass(expectedClass);
        unmount();
      });
    });
  });

  describe('sectionContext automatic level management', () => {
    test('increments header level for nested sections', () => {
      render(
        <Section header="Level 2 (default)">
          <Section header="Level 3 (nested)">
            <Section header="Level 4 (double nested)">
              <p>Deep content</p>
            </Section>
          </Section>
        </Section>,
      );

      const level2Header = screen.getByRole('heading', {level: 2});
      const level3Header = screen.getByRole('heading', {level: 3});
      const level4Header = screen.getByRole('heading', {level: 4});

      expect(level2Header).toHaveTextContent('Level 2 (default)');
      expect(level3Header).toHaveTextContent('Level 3 (nested)');
      expect(level4Header).toHaveTextContent('Level 4 (double nested)');
    });

    test('caps header level at 6 for deeply nested sections', () => {
      render(
        <Section header="L2" headingLevel={2}>
          <Section header="L3">
            <Section header="L4">
              <Section header="L5">
                <Section header="L6">
                  <Section header="Still L6">
                    <Section header="Also L6">
                      <p>Deep content</p>
                    </Section>
                  </Section>
                </Section>
              </Section>
            </Section>
          </Section>
        </Section>,
      );

      // Should cap at level 6
      const deepHeaders = screen.getAllByRole('heading', {level: 6});
      expect(deepHeaders).toHaveLength(3); // "L6", "Still L6", "Also L6"
      expect(deepHeaders[0]).toHaveTextContent('L6');
      expect(deepHeaders[1]).toHaveTextContent('Still L6');
      expect(deepHeaders[2]).toHaveTextContent('Also L6');
    });

    test('allows headingLevel override to break context pattern', () => {
      render(
        <Section header="Level 2">
          <Section header="Level 3">
            <Section header="Override to Level 1" headingLevel={1}>
              <Section header="Back to Level 2">
                <p>Content</p>
              </Section>
            </Section>
          </Section>
        </Section>,
      );

      const level2Headers = screen.getAllByRole('heading', {level: 2});
      const level3Header = screen.getByRole('heading', {level: 3});
      const level1Header = screen.getByRole('heading', {level: 1});

      expect(level2Headers).toHaveLength(2); // First section and nested after override
      expect(level2Headers[0]).toHaveTextContent('Level 2');
      expect(level2Headers[1]).toHaveTextContent('Back to Level 2');
      expect(level3Header).toHaveTextContent('Level 3');
      expect(level1Header).toHaveTextContent('Override to Level 1');
    });
  });

  describe('context integration with mixed content', () => {
    test('works with sections mixed with other content', () => {
      render(
        <Section header="Main Section">
          <p>Some paragraph content</p>
          <Section header="Subsection">
            <div>Nested content</div>
            <Section header="Sub-subsection">
              <span>Deep content</span>
            </Section>
          </Section>
          <p>More content after nested sections</p>
        </Section>,
      );

      const mainHeader = screen.getByRole('heading', {level: 2});
      const subHeader = screen.getByRole('heading', {level: 3});
      const subSubHeader = screen.getByRole('heading', {level: 4});

      expect(mainHeader).toHaveTextContent('Main Section');
      expect(subHeader).toHaveTextContent('Subsection');
      expect(subSubHeader).toHaveTextContent('Sub-subsection');

      expect(screen.getByText('Some paragraph content')).toBeInTheDocument();
      expect(screen.getByText('Nested content')).toBeInTheDocument();
      expect(screen.getByText('Deep content')).toBeInTheDocument();
      expect(
        screen.getByText('More content after nested sections'),
      ).toBeInTheDocument();
    });
  });

  describe('accessibility', () => {
    test('uses section role for proper semantics', () => {
      render(
        <Section header="Accessible Section">
          <p>Content</p>
        </Section>,
      );

      const section = screen.getByRole('region');
      expect(section.tagName).toBe('SECTION');
    });

    test('maintains proper heading hierarchy in nested structure', () => {
      render(
        <Section header="Article Title">
          <Section header="Chapter">
            <Section header="Section">
              <Section header="Subsection">
                <p>Content</p>
              </Section>
            </Section>
          </Section>
        </Section>,
      );

      // Verify proper heading hierarchy
      expect(screen.getByRole('heading', {level: 2})).toHaveTextContent(
        'Article Title',
      );
      expect(screen.getByRole('heading', {level: 3})).toHaveTextContent(
        'Chapter',
      );
      expect(screen.getByRole('heading', {level: 4})).toHaveTextContent(
        'Section',
      );
      expect(screen.getByRole('heading', {level: 5})).toHaveTextContent(
        'Subsection',
      );
    });
  });

  describe('edge cases', () => {
    test('handles empty children gracefully', () => {
      render(<Section header="Empty Section" />);

      const section = screen.getByRole('region');
      const header = screen.getByRole('heading', {level: 2});

      expect(section).toBeInTheDocument();
      expect(header).toHaveTextContent('Empty Section');
    });

    test('handles null/undefined children', () => {
      render(
        <Section header="Conditional Content">
          {null}
          {undefined}
          <p>Valid content</p>
        </Section>,
      );

      expect(screen.getByText('Valid content')).toBeInTheDocument();
      expect(screen.getByRole('heading')).toHaveTextContent(
        'Conditional Content',
      );
    });
  });
});
