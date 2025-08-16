import {render} from '@testing-library/react';
import {InfoCircleIcon} from './icons';

describe('InfoCircleIcon', () => {
  it('renders an svg', () => {
    render(<InfoCircleIcon />);
    expect(document.querySelectorAll('svg').length).toBe(1);
  });
});
