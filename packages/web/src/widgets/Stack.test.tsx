import {render, screen} from '@testing-library/react';
import {Stack} from './Stack';

describe('Stack', () => {
  it('renders children', () => {
    render(
      <Stack gap="lg">
        <div>child</div>
      </Stack>,
    );
    expect(screen.getByText('child')).toBeInTheDocument();
  });

  it('covers all gap variants', () => {
    const {rerender, container} = render(
      <Stack gap="xs">
        <div>c</div>
      </Stack>,
    );
    expect(container.firstChild).toHaveClass('space-y-1');
    rerender(
      <Stack gap="sm">
        <div>c</div>
      </Stack>,
    );
    expect(container.firstChild).toHaveClass('space-y-2');
    rerender(
      <Stack gap="md">
        <div>c</div>
      </Stack>,
    );
    expect(container.firstChild).toHaveClass('space-y-4');
    rerender(
      <Stack gap="lg">
        <div>c</div>
      </Stack>,
    );
    expect(container.firstChild).toHaveClass('space-y-6');
    rerender(
      <Stack gap="xl">
        <div>c</div>
      </Stack>,
    );
    expect(container.firstChild).toHaveClass('space-y-8');
  });

  it('applies default gap=md when not provided', () => {
    const {container} = render(
      <Stack>
        <div>child</div>
      </Stack>,
    );
    expect(container.firstChild).toHaveClass('space-y-4');
  });
});
