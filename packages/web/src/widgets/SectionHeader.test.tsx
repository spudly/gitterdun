import {describe, expect, test} from '@jest/globals';
import {render, screen} from '@testing-library/react';
import {SectionHeader} from './SectionHeader';

describe('sectionHeader', () => {
  test('renders title, subtitle, children', () => {
    render(
      <SectionHeader subtitle="S" title="T">
        <button type="button">C</button>
      </SectionHeader>,
    );
    expect(screen.getByText('T')).toBeInTheDocument();
    expect(screen.getByText('S')).toBeInTheDocument();
    expect(screen.getByText('C')).toBeInTheDocument();
  });
});
