import {describe, expect, test} from '@jest/globals';
import {render, screen} from '@testing-library/react';
import {PageLoading} from './PageLoading';

describe('pageLoading', () => {
  test('renders message and default', () => {
    const {rerender} = render(<PageLoading message="Loading..." />);
    expect(screen.getAllByText('Loading...').length).toBeGreaterThan(0);
    rerender(<PageLoading />);
    expect(screen.getAllByText('Loading...').length).toBeGreaterThan(0);
  });
});
