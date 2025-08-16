import {describe, expect, test} from '@jest/globals';
import {render} from '@testing-library/react';
import {DocIcon} from './icons';

describe('docIcon', () => {
  test('renders an svg', () => {
    render(<DocIcon />);
    expect(document.querySelectorAll('svg')).toHaveLength(1);
  });
});
