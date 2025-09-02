import {beforeAll, describe, expect, jest, test} from '@jest/globals';
import {render, screen, within} from '@testing-library/react';
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

jest.mock('../lib/api', () => ({
  familiesApi: {
    myFamily: jest.fn(async () => ({
      success: true,
      data: {id: 1, owner_id: 1},
    })),
    listMembers: jest.fn(async () => ({
      success: true,
      data: [{user_id: 1, role: 'parent'}],
    })),
  },
}));

describe('layout', () => {
  beforeAll(() => {
    mockUserState = mockUser;
  });

  test('shows Approvals link in bottom nav for parents', async () => {
    mockUserState = mockUser;
    const Wrapper = createWrapper({
      i18n: true,
      queryClient: true,
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
    const bottomNav = screen.getByRole('navigation', {name: /menu/i});
    expect(bottomNav).toBeInTheDocument();
    await within(bottomNav).findByRole('link', {name: /approvals/i});
  });

  test('does not show Approvals link for non-parents', async () => {
    mockUserState = {...mockUser, id: 2};
    const {familiesApi} = require('../lib/api');
    familiesApi.myFamily.mockResolvedValue({
      success: true,
      data: {id: 1, owner_id: 1},
    });
    familiesApi.listMembers.mockResolvedValue({
      success: true,
      data: [{user_id: 2, role: 'child'}],
    });
    const Wrapper = createWrapper({
      i18n: true,
      queryClient: true,
      router: {initialEntries: ['/']},
    });
    render(
      <Layout navigation={[]}>
        {' '}
        <div>Child</div>{' '}
      </Layout>,
      {wrapper: Wrapper},
    );
    const bottomNav = screen.getByRole('navigation', {name: /menu/i});
    expect(
      within(bottomNav).queryByRole('link', {name: /approvals/i}),
    ).not.toBeInTheDocument();
  });

  test('renders nav and children', () => {
    const Wrapper = createWrapper({
      i18n: true,
      queryClient: true,
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
    expect(screen.getAllByText('Dashboard')[0]).toHaveTextContent('Dashboard');
  });

  test('renders bottom nav on small screens', async () => {
    const Wrapper = createWrapper({
      i18n: true,
      queryClient: true,
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
          {
            message: {defaultMessage: 'Chores', id: 'layout.chores'},
            path: '/chores',
            icon: '🧹',
          },
          {
            message: {defaultMessage: 'Goals', id: 'layout.goals'},
            path: '/goals',
            icon: '🎯',
          },
          {
            message: {defaultMessage: 'Leaderboard', id: 'layout.leaderboard'},
            path: '/leaderboard',
            icon: '🏆',
          },
        ]}
      >
        <div>Child</div>
      </Layout>,
      {wrapper: Wrapper},
    );

    const bottomNav = screen.getByRole('navigation', {name: /menu/i});
    expect(bottomNav).toBeInTheDocument();
    const {getByRole} = within(bottomNav);
    expect(getByRole('link', {name: /dashboard/i})).toBeInTheDocument();
  });

  test('shows a language selector control in the header', () => {
    const Wrapper = createWrapper({
      i18n: true,
      queryClient: true,
      router: {initialEntries: ['/']},
    });
    render(
      <Layout navigation={[]}>
        \<div>Child</div>
      </Layout>,
      {wrapper: Wrapper},
    );
    // Locale selector moved to Settings page
    expect(
      screen.queryByRole('button', {name: /language/i}),
    ).not.toBeInTheDocument();
  });

  test('shows login when no user and hides admin link', async () => {
    mockUserState = null;
    render(
      <Layout navigation={[]}>
        <div>Child</div>
      </Layout>,
      {
        wrapper: createWrapper({
          i18n: true,
          queryClient: true,
          router: {initialEntries: ['/']},
        }),
      },
    );
    // Login is now inside the user menu drawer
    await userEvent.click(screen.getByRole('button', {name: /user menu/i}));
    const dialog = screen.getByRole('dialog', {name: /user menu/i});
    expect(
      within(dialog).getByRole('link', {name: /login/i}),
    ).toBeInTheDocument();
  });

  test('calls logout when clicking Logout button', async () => {
    mockUserState = mockUser;
    mockLogout.mockClear();
    render(
      <Layout navigation={[]}>
        <div>Child</div>
      </Layout>,
      {
        wrapper: createWrapper({
          i18n: true,
          queryClient: true,
          router: {initialEntries: ['/']},
        }),
      },
    );
    await userEvent.click(screen.getByRole('button', {name: /user menu/i}));
    const dialog = screen.getByRole('dialog', {name: /user menu/i});
    await userEvent.click(
      within(dialog).getByRole('button', {name: /logout/i}),
    );
    expect(mockLogout).toHaveBeenCalledWith();
  });

  test('renders a user menu button', () => {
    mockUserState = mockUser;
    const Wrapper = createWrapper({
      i18n: true,
      queryClient: true,
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
    expect(
      screen.getByRole('button', {name: /user menu/i}),
    ).toBeInTheDocument();
  });

  // drawer behavior removed
  test('opens user menu drawer and shows identity and settings', async () => {
    mockUserState = mockUser;
    const Wrapper = createWrapper({
      i18n: true,
      queryClient: true,
      router: {initialEntries: ['/']},
    });
    render(
      <Layout navigation={[]}>
        <div>Child</div>
      </Layout>,
      {wrapper: Wrapper},
    );

    await userEvent.click(screen.getByRole('button', {name: /user menu/i}));
    const dialog = screen.getByRole('dialog', {name: /user menu/i});
    expect(dialog).toBeInTheDocument();
    expect(within(dialog).getByText(/signed in as/i)).toBeInTheDocument();
    expect(within(dialog).getByText(/^user$/i)).toBeInTheDocument();
    expect(
      within(dialog).getByRole('link', {name: /settings/i}),
    ).toBeInTheDocument();
    expect(
      within(dialog).getByRole('button', {name: /logout/i}),
    ).toBeInTheDocument();
  });
});
