import {describe, expect, test} from '@jest/globals';
import {render} from '@testing-library/react';
import {Spinner} from './Spinner';

describe('spinner', () => {
  test('renders after delay inline and block', async () => {
    const {findByLabelText, rerender} = render(<Spinner delayMs={0} inline />);
    await expect(findByLabelText('loading')).resolves.toBeInTheDocument();
    rerender(<Spinner delayMs={0} />);
    await expect(findByLabelText('loading')).resolves.toBeInTheDocument();
  });
});
