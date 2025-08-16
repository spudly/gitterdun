import {describe, expect, test} from '@jest/globals';
import {render, screen} from '@testing-library/react';
import {MemoryRouter} from 'react-router-dom';
import {TextLink} from './TextLink';

describe('textLink', () => {
  test('renders within router', () => {
    render(
      <MemoryRouter>
        <TextLink to="/x">Link</TextLink>
      </MemoryRouter>,
    );
    expect(screen.getByText('Link')).toBeInTheDocument();
  });
});
