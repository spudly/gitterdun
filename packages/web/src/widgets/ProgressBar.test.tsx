import {render, screen} from '@testing-library/react';
import {ProgressBar} from './ProgressBar';

describe('ProgressBar', () => {
  it('shows percentage and clamps to 100%', () => {
    const {rerender} = render(
      <ProgressBar value={50} max={100} showLabel showPercentage />,
    );
    expect(screen.getByText(/50%/)).toBeInTheDocument();
    rerender(<ProgressBar value={200} max={100} showPercentage />);
    expect(screen.getByText(/100%/)).toBeInTheDocument();
  });

  it('renders size and variant combinations', () => {
    const {rerender} = render(
      <ProgressBar value={10} max={100} size="sm" variant="success" />,
    );
    rerender(<ProgressBar value={10} max={100} size="lg" variant="warning" />);
    rerender(<ProgressBar value={10} max={100} size="md" variant="danger" />);
  });
});
