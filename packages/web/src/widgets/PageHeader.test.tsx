import {describe, expect, test} from '@jest/globals';
import {render, screen} from '@testing-library/react';
import {PageHeader} from './PageHeader';

describe('pageHeader', () => {
  test('renders title, subtitle and actions', () => {
    render(
      <PageHeader
        actions={<button type="button">A</button>}
        subtitle="Sub"
        title="Title"
      />,
    );
    expect(screen.getByText('Title')).toHaveTextContent('Title');
    expect(screen.getByText('Sub')).toHaveTextContent('Sub');
    expect(screen.getByRole('button', {name: 'A'})).toBeEnabled();
  });
});
