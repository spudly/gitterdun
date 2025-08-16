import {render, screen} from '@testing-library/react';
import {StatusBadge, getStatusClass} from './StatusBadge';
import {StatusDot} from './StatusDot';

describe('Status components', () => {
  it('renders StatusBadge and StatusDot', () => {
    render(
      <div>
        <StatusBadge status="completed">Completed</StatusBadge>

        <StatusDot color="green" label="ok" size={10} />
      </div>,
    );
    expect(screen.getByText('Completed')).toBeInTheDocument();
  });

  it('covers StatusBadge all statuses', () => {
    const {rerender} = render(<StatusBadge status="success">s</StatusBadge>);
    rerender(<StatusBadge status="error">e</StatusBadge>);
    rerender(<StatusBadge status="warning">w</StatusBadge>);
    rerender(<StatusBadge status="info">i</StatusBadge>);
    rerender(<StatusBadge status="pending">p</StatusBadge>);
    rerender(<StatusBadge status="completed">c</StatusBadge>);
    rerender(<StatusBadge status="approved">a</StatusBadge>);
  });

  it('StatusBadge helper covers all branches', () => {
    expect(getStatusClass('success')).toBeTruthy();
    expect(getStatusClass('error')).toBeTruthy();
    expect(getStatusClass('warning')).toBeTruthy();
    expect(getStatusClass('info')).toBeTruthy();
    expect(getStatusClass('pending')).toBeTruthy();
    expect(getStatusClass('completed')).toBeTruthy();
    expect(getStatusClass('approved')).toBeTruthy();
  });

  it('covers StatusDot all colors and unlabeled', () => {
    const {rerender} = render(<StatusDot color="blue" label="b" size={8} />);
    rerender(<StatusDot color="yellow" label="y" size={8} />);
    rerender(<StatusDot color="red" label="r" size={8} />);
    rerender(<StatusDot color="gray" size={8} />);
  });
});
