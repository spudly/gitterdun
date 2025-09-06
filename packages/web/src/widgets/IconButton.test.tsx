import {describe, expect, test} from '@jest/globals';
import {render, screen} from '@testing-library/react';
import {IconButton} from './IconButton.js';

describe('iconButton', () => {
  test('renders and can be disabled', () => {
    render(<IconButton disabled icon={<span>i</span>} label="icon" />);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  test('supports variants and sizes when enabled', () => {
    const {rerender} = render(
      <IconButton
        icon={<span>i</span>}
        label="icon"
        size="sm"
        variant="secondary"
      />,
    );
    expect(screen.getByRole('button')).toBeEnabled();
    rerender(
      <IconButton
        icon={<span>i</span>}
        label="icon"
        size="lg"
        variant="danger"
      />,
    );
    expect(screen.getByRole('button')).toBeEnabled();
    rerender(
      <IconButton
        icon={<span>i</span>}
        label="icon"
        size="md"
        variant="ghost"
      />,
    );
    expect(screen.getByRole('button')).toBeEnabled();
  });
});
