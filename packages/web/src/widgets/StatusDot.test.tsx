import {render, screen} from '@testing-library/react';
import {StatusDot, getDotColorClass} from './StatusDot';

describe('StatusDot', () => {
  it('renders with label (role=img) and without', () => {
    const {rerender} = render(<StatusDot color="red" size={8} label="alert" />);
    expect(screen.getByRole('img', {name: 'alert'})).toBeInTheDocument();
    rerender(<StatusDot color="gray" size={6} />);
    // no role when no label
    expect(screen.queryByRole('img')).toBeNull();
  });

  it('covers all known colors', () => {
    const {rerender} = render(<StatusDot color="green" />);
    rerender(<StatusDot color="blue" />);
    rerender(<StatusDot color="yellow" />);
    rerender(<StatusDot color="red" />);
    rerender(<StatusDot color="gray" />);
  });

  it('helper covers all color branches', () => {
    expect(getDotColorClass('green')).toBeTruthy();
    expect(getDotColorClass('blue')).toBeTruthy();
    expect(getDotColorClass('yellow')).toBeTruthy();
    expect(getDotColorClass('red')).toBeTruthy();
    expect(getDotColorClass('gray')).toBeTruthy();
    expect(getDotColorClass(undefined as any)).toBeTruthy();
  });

  it('component default color path', () => {
    const {container} = render(<StatusDot />);
    expect(container.firstChild).toBeInTheDocument();
  });
});
