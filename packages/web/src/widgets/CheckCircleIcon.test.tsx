import {render} from '@testing-library/react';
import {CheckCircleIcon} from './icons';

describe('CheckCircleIcon', () => {
  it('renders an svg', () => {
    render(<CheckCircleIcon />);
    expect(document.querySelectorAll('svg').length).toBe(1);
  });
});
