import {render} from '@testing-library/react';
import {ClockIcon} from './icons';

describe('ClockIcon', () => {
  it('renders an svg', () => {
    render(<ClockIcon />);
    expect(document.querySelectorAll('svg').length).toBe(1);
  });
});
