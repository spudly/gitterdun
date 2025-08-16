import {render, screen} from '@testing-library/react';
import {StatusBadge, getStatusClass} from './StatusBadge';

describe('StatusBadge', () => {
  it('renders with provided status and size', () => {
    render(
      <StatusBadge size="sm" status="info">
        Info
      </StatusBadge>,
    );
    expect(screen.getByText('Info')).toBeInTheDocument();
  });

  it('helper default branch returns info styles', () => {
    // @ts-expect-error default branch
    const cls = getStatusClass(undefined);
    expect(cls).toContain('bg-blue-100');
    expect(cls).toContain('text-blue-800');
  });

  it('renders status text when children not provided', () => {
    render(<StatusBadge status="warning" />);
    expect(screen.getByText('warning')).toBeInTheDocument();
  });
});
