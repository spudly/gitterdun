import {describe, expect, test} from '@jest/globals';
import {render, screen} from '@testing-library/react';
import {createWrapper} from '../test/createWrapper.js';
import {TrophyIcon} from './icons/index.js';

describe('trophyIcon', () => {
  test('renders an svg', () => {
    render(<TrophyIcon />, {wrapper: createWrapper({i18n: true})});
    expect(screen.getByLabelText('Trophy Icon')).toHaveAttribute(
      'viewBox',
      '0 0 24 24',
    );
  });
});
