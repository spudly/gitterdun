import {describe, expect, test} from '@jest/globals';
import {render, screen} from '@testing-library/react';
import {EmptyState} from './EmptyState.js';

describe('emptyState', () => {
  test('renders title, description and action', () => {
    render(
      <EmptyState
        action={<button type="button">A</button>}
        description="D"
        icon={<span aria-hidden>i</span>}
        title="T"
      />,
    );
    expect(screen.getByText('T')).toHaveTextContent('T');
    expect(screen.getByText('D')).toHaveTextContent('D');
    expect(screen.getByRole('button', {name: 'A'})).toBeEnabled();
  });
});
