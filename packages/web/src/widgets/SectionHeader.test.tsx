import {render, screen} from '@testing-library/react';
import {SectionHeader} from './SectionHeader';

describe('SectionHeader', () => {
  it('renders title, subtitle, children', () => {
    render(
      <SectionHeader title="T" subtitle="S">
        <button type="button">C</button>
      </SectionHeader>,
    );
    expect(screen.getByText('T')).toBeInTheDocument();
    expect(screen.getByText('S')).toBeInTheDocument();
    expect(screen.getByText('C')).toBeInTheDocument();
  });
});
