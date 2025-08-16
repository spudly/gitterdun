import {describe, expect, test} from '@jest/globals';
import {render} from '@testing-library/react';
import {SparklesIcon} from './icons';

describe('sparklesIcon', () => {
  test('renders an svg', () => {
    render(<SparklesIcon />);
    expect(document.querySelectorAll('svg')).toHaveLength(1);
  });
});
