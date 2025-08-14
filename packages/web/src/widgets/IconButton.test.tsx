import {render, screen} from '@testing-library/react';
import {IconButton} from './IconButton';

describe('IconButton', () => {
  it('renders and can be disabled', () => {
    render(<IconButton icon={<span>i</span>} label="icon" disabled />);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('supports variants and sizes when enabled', () => {
    const {rerender, getByRole} = render(
      <IconButton
        icon={<span>i</span>}
        label="icon"
        variant="secondary"
        size="sm"
      />,
    );
    expect(getByRole('button')).toBeEnabled();
    rerender(
      <IconButton
        icon={<span>i</span>}
        label="icon"
        variant="danger"
        size="lg"
      />,
    );
    expect(getByRole('button')).toBeEnabled();
    rerender(
      <IconButton
        icon={<span>i</span>}
        label="icon"
        variant="ghost"
        size="md"
      />,
    );
    expect(getByRole('button')).toBeEnabled();
  });
});
