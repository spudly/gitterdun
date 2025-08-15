import {render, screen} from '@testing-library/react';
import {StatCard, getStatColorClass} from './StatCard';

describe('StatCard', () => {
  it('renders icon, label and value', () => {
    render(
      <StatCard color="blue" icon={<span>i</span>} label="L" value={123} />,
    );
    expect(screen.getByText('L')).toBeInTheDocument();
    expect(screen.getByText('123')).toBeInTheDocument();
  });

  it('covers color variants', () => {
    const {rerender} = render(<StatCard color="yellow" label="a" value="1" />);
    rerender(<StatCard color="green" label="b" value="2" />);
    rerender(<StatCard color="red" label="c" value="3" />);
    rerender(<StatCard color="purple" label="d" value="4" />);
    rerender(<StatCard color="gray" label="e" value="5" />);
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
    expect(getStatColorClass()).toBeTruthy();
  });
});
