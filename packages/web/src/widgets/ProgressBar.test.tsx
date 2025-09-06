import {describe, expect, test} from '@jest/globals';
import {render, screen} from '@testing-library/react';
import {ProgressBar} from './ProgressBar.js';
import {createWrapper} from '../test/createWrapper.js';

describe('progressBar', () => {
  test('shows percentage and clamps to 100%', () => {
    const Wrapper = createWrapper({i18n: true});
    const {rerender} = render(
      <ProgressBar max={100} showLabel showPercentage value={50} />,
      {wrapper: Wrapper},
    );
    expect(screen.getByText(/50%/u)).toHaveTextContent('50%');
    rerender(<ProgressBar max={100} showPercentage value={200} />);
    expect(screen.getByText(/100%/u)).toHaveTextContent('100%');
  });

  test('renders size and variant combinations', () => {
    const Wrapper = createWrapper({i18n: true});
    const {rerender} = render(
      <ProgressBar max={100} size="sm" value={10} variant="success" />,
      {wrapper: Wrapper},
    );
    rerender(<ProgressBar max={100} size="lg" value={10} variant="warning" />);
    rerender(<ProgressBar max={100} size="md" value={10} variant="danger" />);
    expect(screen.getByRole('progressbar')).toBeVisible();
  });
});
