import {describe, expect, test} from '@jest/globals';
import {render, screen} from '@testing-library/react';
import {createWrapper} from '../test/createWrapper';
import {SparklesIcon} from './icons';

describe('sparklesIcon', () => {
  test('renders an svg', () => {
    render(<SparklesIcon />, {wrapper: createWrapper({i18n: true})});
    expect(screen.getByLabelText('Sparkles Icon')).toHaveAttribute(
      'viewBox',
      '0 0 24 24',
    );
  });
});
