import {render, screen} from '@testing-library/react';
import {StatusBadge, getStatusClass} from './StatusBadge';
import {StatusDot} from './StatusDot';

describe('Status components', () => {
  it('renders StatusBadge and StatusDot', () => {
    render(
      <div>
        <StatusBadge status="completed">Completed</StatusBadge>
        <StatusDot color="green" size={10} label="ok" />
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
    const {rerender} = render(<StatusDot color="blue" size={8} label="b" />);
    rerender(<StatusDot color="yellow" size={8} label="y" />);
    rerender(<StatusDot color="red" size={8} label="r" />);
    rerender(<StatusDot color="gray" size={8} />);
  });
});
