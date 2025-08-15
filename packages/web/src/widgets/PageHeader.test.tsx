import {render, screen} from '@testing-library/react';
import {PageHeader} from './PageHeader';

describe('PageHeader', () => {
  it('renders title, subtitle and actions', () => {
    render(
      <PageHeader
        actions={<button type="button">A</button>}
        subtitle="Sub"
        title="Title"
      />,
    );
    expect(screen.getByText('Title')).toBeInTheDocument();
    expect(screen.getByText('Sub')).toBeInTheDocument();
    expect(screen.getByRole('button', {name: 'A'})).toBeInTheDocument();
  });
});
