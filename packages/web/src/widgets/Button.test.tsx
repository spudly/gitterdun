import {describe, expect, jest, test} from '@jest/globals';
import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {Button} from './Button.js';

describe('button', () => {
  test('supports icons, loading and clicks', async () => {
    const onClick = jest.fn();
    const {rerender} = render(
      <Button
        leftIcon={<span>◀</span>}
        onClick={onClick}
        rightIcon={<span>▶</span>}
      >
        Go
      </Button>,
    );
    await userEvent.click(screen.getByRole('button', {name: /go/i}));
    expect(onClick).toHaveBeenCalledWith(expect.any(Object));
    rerender(<Button loading>Go</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  test('applies full width class when fullWidth is true', () => {
    render(<Button fullWidth>Wide</Button>);
    expect(screen.getByRole('button', {name: /wide/i})).toHaveClass('w-full');
  });
});
