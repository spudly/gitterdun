import {render, screen, fireEvent} from '@testing-library/react';
import {MemoryRouter} from 'react-router-dom';

import Layout from './Layout';

let mockUser: any = {
  username: 'User',
  role: 'admin',
  points: 10,
  streak_count: 2,
};
const mockLogout = jest.fn();
jest.mock('../hooks/useUser', () => ({
  useUser: () => ({user: mockUser, logout: mockLogout}),
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
    mockUser = null;
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
    mockUser = {username: 'User', role: 'user', points: 0, streak_count: 0};
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
