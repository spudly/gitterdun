import {render, screen} from '@testing-library/react';
import {MemoryRouter} from 'react-router-dom';
import {TextLink} from './TextLink';

describe('TextLink', () => {
  it('renders within router', () => {
    render(
      <MemoryRouter>
        <TextLink to="/x">Link</TextLink>
      </MemoryRouter>,
    );
    expect(screen.getByText('Link')).toBeInTheDocument();
  });
});
