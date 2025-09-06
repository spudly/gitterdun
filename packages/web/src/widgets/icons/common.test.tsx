import {describe, expect, test} from '@jest/globals';
import {render, screen, within} from '@testing-library/react';
import {createWrapper} from '../../test/createWrapper.js';
import {SvgIconBase} from './common.js';

describe('svgIconBase', () => {
  test('renders svg with title and dimensions', () => {
    render(
      <SvgIconBase size="sm" title="Test Icon">
        <path d="M0 0h24v24H0z" />
      </SvgIconBase>,
      {wrapper: createWrapper({i18n: true})},
    );
    const svg = screen.getByLabelText('Test Icon');
    expect(svg).toHaveAttribute('viewBox', '0 0 24 24');
    expect(svg).toHaveAttribute('width', '16');
    expect(svg).toHaveAttribute('height', '16');
    const titleEl = within(svg).getByText('Test Icon');
    expect(titleEl.tagName.toLowerCase()).toBe('title');
  });
});
