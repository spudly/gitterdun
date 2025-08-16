import {describe, expect, test} from '@jest/globals';
import {render} from '@testing-library/react';
import {InfoCircleIcon} from './icons';

describe('infoCircleIcon', () => {
  test('renders an svg', () => {
    render(<InfoCircleIcon />);
    expect(document.querySelectorAll('svg')).toHaveLength(1);
  });
});
