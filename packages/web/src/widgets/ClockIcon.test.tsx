import {describe, expect, test} from '@jest/globals';
import {render} from '@testing-library/react';
import {ClockIcon} from './icons';

describe('clockIcon', () => {
  test('renders an svg', () => {
    render(<ClockIcon />);
    expect(document.querySelectorAll('svg')).toHaveLength(1);
  });
});
