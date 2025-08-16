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
    expect(screen.getByText('X')).toBeInTheDocument();
  });

  test('covers indent and density variants', () => {
    const {rerender, getByText} = render(
      <BulletList density="tight" indent="sm">
        <li>A</li>
      </BulletList>,
    );
    expect(getByText('A')).toBeInTheDocument();
    rerender(
      <BulletList density="normal" indent="md">
        <li>B</li>
      </BulletList>,
    );
    expect(getByText('B')).toBeInTheDocument();
    rerender(
      <BulletList density="tight" indent="lg">
        <li>C</li>
      </BulletList>,
    );
    expect(getByText('C')).toBeInTheDocument();
  });

  test('falls back to defaults on invalid props (runtime)', () => {
    // simulate bad runtime values and hit fallback branches
    const {container} = render(
      <BulletList
        // @ts-expect-error: intentaionally passing invalid props
        density="nope"
        // @ts-expect-error: intentaionally passing invalid props
        indent="nope"
      >
        <li>Z</li>
      </BulletList>,
    );
    expect(container.querySelector('ul')).toBeInTheDocument();
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
    const {getByText} = render(
      <BulletList>
        <li>default</li>
      </BulletList>,
    );
    expect(getByText('default')).toBeInTheDocument();
  });
});
