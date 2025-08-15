import {render, screen} from '@testing-library/react';
import {List} from './List';
import {ListRow} from './ListRow';

describe('List & ListRow', () => {
  it('renders list row content', () => {
    render(
      <List>
        <ListRow description="Desc"
right={<span>R</span>}
title="Row"
        />
      </List>,
    );
    expect(screen.getByText('Row')).toBeInTheDocument();
    expect(screen.getByText('Desc')).toBeInTheDocument();
    expect(screen.getByText('R')).toBeInTheDocument();
  });
});
