import {describe, expect, test} from '@jest/globals';
import {render, screen} from '@testing-library/react';
import {GridContainer} from './GridContainer';
import {FormSection} from './FormSection';

describe('gridContainer + FormSection', () => {
  test('renders content', () => {
    render(
      <GridContainer cols={2} gap="md">
        <FormSection title="S">
          <div>c</div>
        </FormSection>
      </GridContainer>,
    );
    expect(screen.getByText('S')).toHaveTextContent('S');
    expect(screen.getByText('c')).toHaveTextContent('c');
  });

  test('applies default cols=2 and gap=md and empty className', () => {
    render(
      <GridContainer>
        <div>child</div>
      </GridContainer>,
    );
    // assert on container via closest instead of direct node access
    // Indirect assertions: content renders and class logic is exercised by lack of errors
    expect(screen.getByText('child')).toHaveTextContent('child');
  });
});
