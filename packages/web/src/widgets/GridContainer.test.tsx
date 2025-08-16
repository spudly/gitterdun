import {render, screen} from '@testing-library/react';
import {GridContainer} from './GridContainer';
import {FormSection} from './FormSection';

describe('GridContainer + FormSection', () => {
  it('renders content', () => {
    render(
      <GridContainer cols={2} gap="md">
        <FormSection title="S">
          <div>c</div>
        </FormSection>
      </GridContainer>,
    );
    expect(screen.getByText('S')).toBeInTheDocument();
    expect(screen.getByText('c')).toBeInTheDocument();
  });

  it('applies default cols=2 and gap=md and empty className', () => {
    render(
      <GridContainer>
        <div>child</div>
      </GridContainer>,
    );
    const el = screen.getByText('child').parentElement!;
    expect(el).toHaveClass('grid');
    expect(el).toHaveClass('grid-cols-1', 'md:grid-cols-2');
    expect(el).toHaveClass('gap-4');
  });
});
