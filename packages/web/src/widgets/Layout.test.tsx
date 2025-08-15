import {render, screen, fireEvent} from '@testing-library/react';
import {MemoryRouter} from 'react-router-dom';

import Layout from './Layout';
import type {User} from '@gitterdun/shared';

const mockUser: User = {
  id: 1,
  username: 'User',
  email: 'user@example.com',
  role: 'admin',
  points: 10,
  streak_count: 2,
  created_at: '2023-01-01T00:00:00.000Z',
  updated_at: '2023-01-01T00:00:00.000Z',
};
let user: User | null = mockUser;
const mockLogout = jest.fn();
jest.mock('../hooks/useUser', () => ({
  useUser: () => ({user: user, logout: mockLogout}),
}));

describe('Layout', () => {
  it('renders nav and children', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <Layout navigation={[{name: 'Dashboard', path: '/', icon: '🏠'}]}>
          <div>Child</div>
        </Layout>
      </MemoryRouter>,
    );
    expect(screen.getByText('Child')).toBeInTheDocument();
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
  });

  it('shows login when no user and hides admin link', () => {
    user = null;
    render(
      <MemoryRouter initialEntries={['/']}>
        <Layout navigation={[]}>
          <div>Child</div>
        </Layout>
      </MemoryRouter>,
    );
    expect(screen.getByText('Login')).toBeInTheDocument();
  });

  it('calls logout when clicking Logout button', () => {
    user = mockUser;
    mockLogout.mockClear();
    render(
      <MemoryRouter initialEntries={['/']}>
        <Layout navigation={[]}>
          <div>Child</div>
        </Layout>
      </MemoryRouter>,
    );
    fireEvent.click(screen.getByRole('button', {name: /logout/i}));
    expect(mockLogout).toHaveBeenCalled();
  });
});
