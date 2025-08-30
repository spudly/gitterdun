import {describe, expect, test} from '@jest/globals';
import {render, screen} from '@testing-library/react';
import {createWrapper} from '../test/createWrapper';
import {InfoCircleIcon} from './icons';

describe('infoCircleIcon', () => {
  test('renders an svg', () => {
    render(<InfoCircleIcon />, {wrapper: createWrapper({i18n: true})});
    expect(screen.getByLabelText('Info Circle Icon')).toHaveAttribute(
      'viewBox',
      '0 0 24 24',
    );
  });
});
