import {describe, expect, test} from '@jest/globals';
import {render} from '@testing-library/react';
import {PageLoading} from './PageLoading';

describe('pageLoading', () => {
  test('renders message and default', () => {
    const {rerender, getAllByText} = render(
      <PageLoading message="Loading..." />,
    );
    expect(getAllByText('Loading...').length).toBeGreaterThan(0);
    rerender(<PageLoading />);
    expect(getAllByText('Loading...').length).toBeGreaterThan(0);
  });
});
