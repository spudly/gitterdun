import {beforeAll, describe, expect, jest, test} from '@jest/globals';
import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {createWrapper} from '../test/createWrapper';

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
let mockUserState: User | null = null;
const mockLogout = jest.fn();
jest.mock('../hooks/useUser', () => ({
  useUser: () => ({user: mockUserState, logout: mockLogout}),
}));

describe('layout', () => {
  beforeAll(() => {
    mockUserState = mockUser;
  });

  test('renders nav and children', () => {
    const Wrapper = createWrapper({
      i18n: true,
      router: {initialEntries: ['/']},
    });
    render(
      <Layout
        navigation={[
          {
            message: {defaultMessage: 'Dashboard', id: 'layout.dashboard'},
            path: '/',
            icon: '🏠',
          },
        ]}
      >
        <div>Child</div>
      </Layout>,
      {wrapper: Wrapper},
    );
    expect(screen.getByText('Child')).toHaveTextContent('Child');
    expect(screen.getByText('Dashboard')).toHaveTextContent('Dashboard');
  });

  test('shows a language selector control in the header', () => {
    const Wrapper = createWrapper({
      i18n: true,
      router: {initialEntries: ['/']},
    });
    render(
      <Layout navigation={[]}>
        \<div>Child</div>
      </Layout>,
      {wrapper: Wrapper},
    );
    expect(screen.getByRole('button', {name: /language/i})).toBeEnabled();
  });

  test('shows login when no user and hides admin link', () => {
    mockUserState = null;
    render(
      <Layout navigation={[]}>
        <div>Child</div>
      </Layout>,
      {wrapper: createWrapper({i18n: true, router: {initialEntries: ['/']}})},
    );
    expect(screen.getByText('Login')).toHaveTextContent('Login');
  });

  test('calls logout when clicking Logout button', async () => {
    mockUserState = mockUser;
    mockLogout.mockClear();
    render(
      <Layout navigation={[]}>
        <div>Child</div>
      </Layout>,
      {wrapper: createWrapper({i18n: true, router: {initialEntries: ['/']}})},
    );
    await userEvent.click(screen.getByRole('button', {name: /logout/i}));
    expect(mockLogout).toHaveBeenCalledWith();
  });
});
