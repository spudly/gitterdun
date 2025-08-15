import {render, screen} from '@testing-library/react';
import {ListRow} from './ListRow';

describe('ListRow', () => {
  it('renders all regions when provided', () => {
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
    expect(screen.getByText('L')).toBeInTheDocument();
    expect(screen.getByText('Title')).toBeInTheDocument();
    expect(screen.getByText('TR')).toBeInTheDocument();
    expect(screen.getByText('Desc')).toBeInTheDocument();
    expect(screen.getByText('M')).toBeInTheDocument();
    expect(screen.getByText('R')).toBeInTheDocument();
  });

  it('renders minimal', () => {
    render(<ListRow title="Only" />);
    expect(screen.getByText('Only')).toBeInTheDocument();
  });
});
