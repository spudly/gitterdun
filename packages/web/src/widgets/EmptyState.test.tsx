import {render, screen} from '@testing-library/react';
import {EmptyState} from './EmptyState';

describe('EmptyState', () => {
  it('renders title, description and action', () => {
    render(
      <EmptyState
        title="T"
        description="D"
        action={<button type="button">A</button>}
        icon={<span aria-hidden>i</span>}
      />,
    );
    expect(screen.getByText('T')).toBeInTheDocument();
    expect(screen.getByText('D')).toBeInTheDocument();
    expect(screen.getByRole('button', {name: 'A'})).toBeInTheDocument();
  });
});
