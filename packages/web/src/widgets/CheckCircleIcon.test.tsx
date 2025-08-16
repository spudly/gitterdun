import {describe, expect, test} from '@jest/globals';
import {render} from '@testing-library/react';
import {CheckCircleIcon} from './icons';

describe('checkCircleIcon', () => {
  test('renders an svg', () => {
    render(<CheckCircleIcon />);
    expect(document.querySelectorAll('svg')).toHaveLength(1);
  });
});
