import {describe, expect, test} from '@jest/globals';
import {render, screen} from '@testing-library/react';
import {Spinner} from './Spinner.js';

describe('spinner', () => {
  test('renders after delay inline and block', async () => {
    const {rerender} = render(<Spinner delayMs={0} inline />);
    await expect(screen.findByLabelText('loading')).resolves.toBeVisible();
    rerender(<Spinner delayMs={0} />);
    await expect(screen.findByLabelText('loading')).resolves.toBeVisible();
  });
});
