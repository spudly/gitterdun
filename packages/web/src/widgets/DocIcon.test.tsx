import {describe, expect, test} from '@jest/globals';
import {render, screen} from '@testing-library/react';
import {createWrapper} from '../test/createWrapper.js';
import {DocIcon} from './icons/index.js';

describe('docIcon', () => {
  test('renders an svg', () => {
    render(<DocIcon />, {wrapper: createWrapper({i18n: true})});
    expect(screen.getByLabelText('Doc Icon')).toHaveAttribute(
      'viewBox',
      '0 0 24 24',
    );
  });
});
