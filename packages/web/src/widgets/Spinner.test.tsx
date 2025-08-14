import {render} from '@testing-library/react';
import {Spinner} from './Spinner';

describe('Spinner', () => {
  it('renders after delay inline and block', async () => {
    const {findByLabelText, rerender} = render(<Spinner delayMs={0} inline />);
    expect(await findByLabelText('loading')).toBeInTheDocument();
    rerender(<Spinner delayMs={0} />);
    expect(await findByLabelText('loading')).toBeInTheDocument();
  });
});
