import {describe, expect, test} from '@jest/globals';
import {render, screen} from '@testing-library/react';
import {ListRow} from './ListRow.js';

describe('listRow', () => {
  test('renders all regions when provided', () => {
    render(
      <ListRow
        description="Desc"
        left={<span>L</span>}
        meta={<span>M</span>}
        right={<button type="button">R</button>}
        title="Title"
        titleRight={<span>TR</span>}
      />,
    );
    expect(screen.getByText('L')).toHaveTextContent('L');
    expect(screen.getByText('Title')).toHaveTextContent('Title');
    expect(screen.getByText('TR')).toHaveTextContent('TR');
    expect(screen.getByText('Desc')).toHaveTextContent('Desc');
    expect(screen.getByText('M')).toHaveTextContent('M');
    expect(screen.getByText('R')).toHaveTextContent('R');
  });

  test('renders minimal', () => {
    render(<ListRow title="Only" />);
    expect(screen.getByText('Only')).toHaveTextContent('Only');
  });
});
