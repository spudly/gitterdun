import {render, screen} from '@testing-library/react';
import {ProgressBar} from './ProgressBar';

describe('ProgressBar', () => {
  it('shows percentage and clamps to 100%', () => {
    const {rerender} = render(
      <ProgressBar max={100} showLabel showPercentage value={50} />,
    );
    expect(screen.getByText(/50%/)).toBeInTheDocument();
    rerender(<ProgressBar max={100} showPercentage value={200} />);
    expect(screen.getByText(/100%/)).toBeInTheDocument();
  });

  it('renders size and variant combinations', () => {
    const {rerender} = render(
      <ProgressBar max={100} size="sm" value={10} variant="success" />,
    );
    rerender(<ProgressBar max={100} size="lg" value={10} variant="warning" />);
    rerender(<ProgressBar max={100} size="md" value={10} variant="danger" />);
  });
});
