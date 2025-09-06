import {describe, expect, test} from '@jest/globals';
import {render, screen} from '@testing-library/react';
import {List} from './List.js';
import {ListRow} from './ListRow.js';

describe('list & ListRow', () => {
  test('renders list row content', () => {
    render(
      <List>
        <ListRow description="Desc" right={<span>R</span>} title="Row" />
      </List>,
    );
    expect(screen.getByText('Row')).toHaveTextContent('Row');
    expect(screen.getByText('Desc')).toHaveTextContent('Desc');
    expect(screen.getByText('R')).toHaveTextContent('R');
  });
});
