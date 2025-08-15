import {render} from '@testing-library/react';
import {SparklesIcon} from './icons';

describe('SparklesIcon', () => {
  it('renders an svg', () => {
    render(<SparklesIcon />);
    expect(document.querySelectorAll('svg').length).toBe(1);
  });
});


