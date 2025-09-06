import {describe, expect, test} from '@jest/globals';
import {render, screen} from '@testing-library/react';
import {createWrapper} from '../test/createWrapper.js';
import {CheckCircleIcon} from './icons/index.js';

describe('checkCircleIcon', () => {
  test('renders an svg', () => {
    render(<CheckCircleIcon />, {wrapper: createWrapper({i18n: true})});
    const svg = screen.getByLabelText('Check Circle Icon');
    expect(svg).toHaveAttribute('viewBox', '0 0 24 24');
  });
});
