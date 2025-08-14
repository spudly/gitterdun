import {render, screen} from '@testing-library/react';
import {StatCard, getStatColorClass} from './StatCard';

describe('StatCard', () => {
  it('renders icon, label and value', () => {
    render(
      <StatCard icon={<span>i</span>} label="L" value={123} color="blue" />,
    );
    expect(screen.getByText('L')).toBeInTheDocument();
    expect(screen.getByText('123')).toBeInTheDocument();
  });

  it('covers color variants', () => {
    const {rerender} = render(<StatCard label="a" value="1" color="yellow" />);
    rerender(<StatCard label="b" value="2" color="green" />);
    rerender(<StatCard label="c" value="3" color="red" />);
    rerender(<StatCard label="d" value="4" color="purple" />);
    rerender(<StatCard label="e" value="5" color="gray" />);
  });

  it('uses default color when not provided', () => {
    render(<StatCard label="x" value="y" />);
    expect(screen.getByText('x')).toBeInTheDocument();
    expect(screen.getByText('y')).toBeInTheDocument();
  });

  it('helper covers all color branches', () => {
    expect(getStatColorClass('blue')).toBeTruthy();
    expect(getStatColorClass('yellow')).toBeTruthy();
    expect(getStatColorClass('green')).toBeTruthy();
    expect(getStatColorClass('red')).toBeTruthy();
    expect(getStatColorClass('purple')).toBeTruthy();
    expect(getStatColorClass('gray')).toBeTruthy();
    expect(getStatColorClass(undefined as any)).toBeTruthy();
  });
});
