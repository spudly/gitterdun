import {describe, expect, test} from '@jest/globals';
import {render, screen} from '@testing-library/react';
import {createWrapper} from '../test/createWrapper';
import {ClockIcon} from './icons';

describe('clockIcon', () => {
  test('renders an svg', () => {
    render(<ClockIcon />, {wrapper: createWrapper({i18n: true})});
    expect(screen.getByLabelText('Clock Icon')).toHaveAttribute(
      'viewBox',
      '0 0 24 24',
    );
  });
});
