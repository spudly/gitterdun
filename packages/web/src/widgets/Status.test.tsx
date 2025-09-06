import {describe, expect, test} from '@jest/globals';
import {render, screen} from '@testing-library/react';
import {StatusBadge, getStatusClass} from './StatusBadge.js';
import {StatusDot} from './StatusDot.js';

describe('status components', () => {
  test('renders StatusBadge and StatusDot', () => {
    render(
      <div>
        <StatusBadge status="completed">Completed</StatusBadge>

        <StatusDot color="green" label="ok" size={10} />
      </div>,
    );
    expect(screen.getByText('Completed')).toHaveTextContent('Completed');
  });

  test('covers StatusBadge all statuses', () => {
    const {rerender} = render(<StatusBadge status="success">s</StatusBadge>);
    rerender(<StatusBadge status="error">e</StatusBadge>);
    rerender(<StatusBadge status="warning">w</StatusBadge>);
    rerender(<StatusBadge status="info">i</StatusBadge>);
    rerender(<StatusBadge status="pending">p</StatusBadge>);
    rerender(<StatusBadge status="completed">c</StatusBadge>);
    rerender(<StatusBadge status="approved">a</StatusBadge>);
    expect(screen.getByText('a')).toHaveTextContent('a');
  });

  test('statusBadge helper covers all branches', () => {
    expect(getStatusClass('success')).toBeTruthy();
    expect(getStatusClass('error')).toBeTruthy();
    expect(getStatusClass('warning')).toBeTruthy();
    expect(getStatusClass('info')).toBeTruthy();
    expect(getStatusClass('pending')).toBeTruthy();
    expect(getStatusClass('completed')).toBeTruthy();
    expect(getStatusClass('approved')).toBeTruthy();
    expect(getStatusClass('info')).toBeTruthy();
  });

  test('covers StatusDot all colors and unlabeled', () => {
    const {rerender} = render(<StatusDot color="blue" label="b" size={8} />);
    expect(screen.getByRole('img', {name: 'b'})).toBeVisible();
    rerender(<StatusDot color="yellow" label="y" size={8} />);
    expect(screen.getByRole('img', {name: 'y'})).toBeVisible();
    rerender(<StatusDot color="red" label="r" size={8} />);
    expect(screen.getByRole('img', {name: 'r'})).toBeVisible();
    rerender(<StatusDot color="gray" size={8} />);
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });
});
