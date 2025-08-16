import {render} from '@testing-library/react';
import {DocIcon} from './icons';

describe('DocIcon', () => {
  it('renders an svg', () => {
    render(<DocIcon />);
    expect(document.querySelectorAll('svg').length).toBe(1);
  });
});
