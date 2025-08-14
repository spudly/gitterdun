import {render, screen} from '@testing-library/react';
import {List} from './List';
import {ListRow} from './ListRow';

describe('List & ListRow', () => {
  it('renders list row content', () => {
    render(
      <List>
        <ListRow title="Row" description="Desc" right={<span>R</span>} />
      </List>,
    );
    expect(screen.getByText('Row')).toBeInTheDocument();
    expect(screen.getByText('Desc')).toBeInTheDocument();
    expect(screen.getByText('R')).toBeInTheDocument();
  });
});
