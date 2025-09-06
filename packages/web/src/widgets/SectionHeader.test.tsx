import {describe, expect, test} from '@jest/globals';
import {render, screen} from '@testing-library/react';
import {SectionHeader} from './SectionHeader.js';

describe('sectionHeader', () => {
  test('renders title, subtitle, children', () => {
    render(
      <SectionHeader subtitle="S" title="T">
        <button type="button">C</button>
      </SectionHeader>,
    );
    expect(screen.getByText('T')).toHaveTextContent('T');
    expect(screen.getByText('S')).toHaveTextContent('S');
    expect(screen.getByText('C')).toHaveTextContent('C');
  });
});
