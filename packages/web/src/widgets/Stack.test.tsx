import {describe, expect, test} from '@jest/globals';
import {render, screen} from '@testing-library/react';
import {Stack, getGapClass} from './Stack';

describe('stack', () => {
  test('renders children', () => {
    render(
      <Stack gap="lg">
        <div>child</div>
      </Stack>,
    );
    expect(screen.getByText('child')).toHaveTextContent('child');
  });

  test('covers all gap variants', () => {
    const {rerender} = render(
      <Stack gap="xs">
        <div>c</div>
      </Stack>,
    );
    expect(getGapClass('xs')).toBe('space-y-1');
    rerender(
      <Stack gap="sm">
        <div>c</div>
      </Stack>,
    );
    expect(getGapClass('sm')).toBe('space-y-2');
    rerender(
      <Stack gap="md">
        <div>c</div>
      </Stack>,
    );
    expect(getGapClass('md')).toBe('space-y-4');
    rerender(
      <Stack gap="lg">
        <div>c</div>
      </Stack>,
    );
    expect(getGapClass('lg')).toBe('space-y-6');
    rerender(
      <Stack gap="xl">
        <div>c</div>
      </Stack>,
    );
    expect(getGapClass('xl')).toBe('space-y-8');
  });

  test('applies default gap=md when not provided', () => {
    render(
      <Stack>
        <div>child</div>
      </Stack>,
    );
    expect(getGapClass()).toBe('space-y-4');
  });
});
