import {render} from '@testing-library/react';
import {TrophyIcon} from './icons';

describe('TrophyIcon', () => {
  it('renders an svg', () => {
    render(<TrophyIcon />);
    expect(document.querySelectorAll('svg').length).toBe(1);
  });
});


