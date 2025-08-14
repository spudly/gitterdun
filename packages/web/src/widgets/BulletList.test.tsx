import {render, screen} from '@testing-library/react';
import {BulletList, getDensityClass, getIndentClass} from './BulletList';

describe('BulletList', () => {
  it('renders items with props', () => {
    render(
      <BulletList indent="lg" density="normal">
        <li>X</li>
      </BulletList>,
    );
    expect(screen.getByText('X')).toBeInTheDocument();
  });

  it('covers indent and density variants', () => {
    const {rerender, getByText} = render(
      <BulletList indent="sm" density="tight">
        <li>A</li>
      </BulletList>,
    );
    expect(getByText('A')).toBeInTheDocument();
    rerender(
      <BulletList indent="md" density="normal">
        <li>B</li>
      </BulletList>,
    );
    expect(getByText('B')).toBeInTheDocument();
    rerender(
      <BulletList indent="lg" density="tight">
        <li>C</li>
      </BulletList>,
    );
    expect(getByText('C')).toBeInTheDocument();
  });

  it('falls back to defaults on invalid props (runtime)', () => {
    // cast to any to simulate bad runtime values and hit fallback branches
    const {container} = render(
      <BulletList indent={'nope' as any} density={'nope' as any}>
        <li>Z</li>
      </BulletList>,
    );
    expect(container.querySelector('ul')).toBeInTheDocument();
  });

  it('helper functions cover all branches', () => {
    expect(getIndentClass('sm')).toBeTruthy();
    expect(getIndentClass('md')).toBeTruthy();
    expect(getIndentClass('lg')).toBeTruthy();
    expect(getIndentClass(undefined as any)).toBeTruthy();
    expect(getDensityClass('tight')).toBeTruthy();
    expect(getDensityClass('normal')).toBeTruthy();
    expect(getDensityClass(undefined as any)).toBeTruthy();
  });

  it('component defaults (no props) render', () => {
    const {getByText} = render(
      <BulletList>
        <li>default</li>
      </BulletList>,
    );
    expect(getByText('default')).toBeInTheDocument();
  });
});
