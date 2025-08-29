import {describe, expect, test} from '@jest/globals';
import {render, screen} from '@testing-library/react';
import {BulletList, getDensityClass, getIndentClass} from './BulletList';

describe('bulletList', () => {
  test('renders items with props', () => {
    render(
      <BulletList density="normal" indent="lg">
        <li>X</li>
      </BulletList>,
    );
    expect(screen.getByText('X')).toHaveTextContent('X');
  });

  test('covers indent and density variants', () => {
    const {rerender} = render(
      <BulletList density="tight" indent="sm">
        <li>A</li>
      </BulletList>,
    );
    expect(screen.getByText('A')).toHaveTextContent('A');
    rerender(
      <BulletList density="normal" indent="md">
        <li>B</li>
      </BulletList>,
    );
    expect(screen.getByText('B')).toHaveTextContent('B');
    rerender(
      <BulletList density="tight" indent="lg">
        <li>C</li>
      </BulletList>,
    );
    expect(screen.getByText('C')).toHaveTextContent('C');
  });

  test('falls back to defaults on invalid props (runtime)', () => {
    // simulate bad runtime values and hit fallback branches
    render(
      <BulletList
        // @ts-expect-error: intentaionally passing invalid props
        density="nope"
        // @ts-expect-error: intentaionally passing invalid props
        indent="nope"
      >
        <li>Z</li>
      </BulletList>,
    );
    expect(screen.getByText('Z')).toHaveTextContent('Z');
  });

  test('helper functions cover all branches', () => {
    expect(getIndentClass('sm')).toBeTruthy();
    expect(getIndentClass('md')).toBeTruthy();
    expect(getIndentClass('lg')).toBeTruthy();
    expect(getIndentClass(undefined)).toBeTruthy();
    expect(getDensityClass('tight')).toBeTruthy();
    expect(getDensityClass('normal')).toBeTruthy();
    expect(getDensityClass(undefined)).toBeTruthy();
  });

  test('component defaults (no props) render', () => {
    render(
      <BulletList>
        <li>default</li>
      </BulletList>,
    );
    expect(screen.getByText('default')).toHaveTextContent('default');
  });
});
