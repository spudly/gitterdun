import {render, screen} from '@testing-library/react';
import {PageHeader} from './PageHeader';

describe('PageHeader', () => {
  it('renders title, subtitle and actions', () => {
    render(
      <PageHeader
        title="Title"
        subtitle="Sub"
        actions={<button type="button">A</button>}
      />,
    );
    expect(screen.getByText('Title')).toBeInTheDocument();
    expect(screen.getByText('Sub')).toBeInTheDocument();
    expect(screen.getByRole('button', {name: 'A'})).toBeInTheDocument();
  });
});
