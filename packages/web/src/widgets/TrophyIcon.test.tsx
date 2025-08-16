import {describe, expect, test} from '@jest/globals';
import {render} from '@testing-library/react';
import {TrophyIcon} from './icons';

describe('trophyIcon', () => {
  test('renders an svg', () => {
    render(<TrophyIcon />);
    expect(document.querySelectorAll('svg')).toHaveLength(1);
  });
});
