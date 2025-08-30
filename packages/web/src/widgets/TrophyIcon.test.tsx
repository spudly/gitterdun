import {describe, expect, test} from '@jest/globals';
import {render, screen} from '@testing-library/react';
import {createWrapper} from '../test/createWrapper';
import {TrophyIcon} from './icons';

describe('trophyIcon', () => {
  test('renders an svg', () => {
    render(<TrophyIcon />, {wrapper: createWrapper({i18n: true})});
    expect(screen.getByLabelText('Trophy Icon')).toHaveAttribute(
      'viewBox',
      '0 0 24 24',
    );
  });
});
