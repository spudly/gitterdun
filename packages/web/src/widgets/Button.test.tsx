import {describe, expect, jest, test} from '@jest/globals';
import {render, screen, fireEvent} from '@testing-library/react';
import {Button} from './Button';

describe('button', () => {
  test('supports icons, loading and clicks', () => {
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
    fireEvent.click(screen.getByRole('button', {name: /go/i}));
    expect(onClick).toHaveBeenCalled();
    rerender(<Button loading>Go</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  test('applies full width class when fullWidth is true', () => {
    render(<Button fullWidth>Wide</Button>);
    expect(screen.getByRole('button', {name: /wide/i})).toHaveClass('w-full');
  });
});
