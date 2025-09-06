import {describe, expect, jest, test} from '@jest/globals';
import {render, screen} from '@testing-library/react';
import {createWrapper} from '../test/createWrapper.js';
import Admin from './Admin.js';

jest.mock('../hooks/useUser', () => ({
  useUser: jest.fn(() => ({
    user: {
      id: 1,
      username: 'admin',
      email: 'admin@example.com',
      role: 'admin',
      points: 0,
      streak_count: 0,
      created_at: '',
      updated_at: '',
    },
    isLoading: false,
    error: null,
    login: jest.fn(),
    register: jest.fn(),
    logout: jest.fn(),
    forgotPassword: jest.fn(),
    resetPassword: jest.fn(),
    isLoggingIn: false,
    isRegistering: false,
    isLoggingOut: false,
    loginError: null,
    registerError: null,
  })),
}));

jest.mock('../lib/api', () => ({
  choresApi: {getAll: jest.fn(async () => ({success: true, data: []}))},
  familiesApi: {
    create: jest.fn(async () => ({success: true})),
    myFamilies: jest.fn(async () => ({success: true, data: []})),
    listMembers: jest.fn(async () => ({success: true, data: []})),
    createChild: jest.fn(async () => ({success: true})),
  },
  invitationsApi: {create: jest.fn(async () => ({success: true}))},
}));

describe('admin page', () => {
  test('renders admin panel with stats and users, but not chores management', async () => {
    const Wrapper = createWrapper({
      i18n: true,
      queryClient: true,
      router: true,
    });
    render(<Admin />, {wrapper: Wrapper});

    await expect(screen.findByText('Admin Panel')).resolves.toHaveTextContent(
      'Admin Panel',
    );

    // Shows stats section
    expect(screen.getByText('Total Chores')).toBeInTheDocument();
    expect(screen.getByText('Pending Approval')).toBeInTheDocument();
    expect(screen.getByText('Approved')).toBeInTheDocument();
    expect(screen.getByText('Bonus Chores')).toBeInTheDocument();

    // Shows users section
    expect(screen.getByRole('region', {name: 'Users'})).toBeInTheDocument();

    // Does not show chores management section
    expect(screen.queryByText('Chores Management')).not.toBeInTheDocument();
  });

  test('denies access for non-admin users', () => {
    const mocked = jest.requireMock('../hooks/useUser');
    const useUserMock: any = mocked.useUser;
    useUserMock.mockReturnValueOnce({
      user: {
        id: 1,
        username: 'u',
        email: 'e@x',
        role: 'user',
        points: 0,
        streak_count: 0,
        created_at: '',
        updated_at: '',
      },
      isLoading: false,
      error: null,
      login: jest.fn(),
      register: jest.fn(),
      logout: jest.fn(),
      forgotPassword: jest.fn(),
      resetPassword: jest.fn(),
      isLoggingIn: false,
      isRegistering: false,
      isLoggingOut: false,
      loginError: null,
      registerError: null,
    });

    const Wrapper = createWrapper({
      i18n: true,
      queryClient: true,
      router: true,
    });
    render(<Admin />, {wrapper: Wrapper});

    expect(screen.getByText('Access Denied')).toHaveTextContent(
      'Access Denied',
    );
    expect(
      screen.getByText('You need admin privileges to view this page.'),
    ).toHaveTextContent('You need admin privileges to view this page.');
  });

  test('denies access for unauthenticated users', () => {
    const mocked = jest.requireMock('../hooks/useUser');
    const useUserMock: any = mocked.useUser;
    useUserMock.mockReturnValueOnce({
      user: null,
      isLoading: false,
      error: null,
      login: jest.fn(),
      register: jest.fn(),
      logout: jest.fn(),
      forgotPassword: jest.fn(),
      resetPassword: jest.fn(),
      isLoggingIn: false,
      isRegistering: false,
      isLoggingOut: false,
      loginError: null,
      registerError: null,
    });

    const Wrapper = createWrapper({
      i18n: true,
      queryClient: true,
      router: true,
    });
    render(<Admin />, {wrapper: Wrapper});

    expect(screen.getByText('Access Denied')).toHaveTextContent(
      'Access Denied',
    );
    expect(
      screen.getByText('You need admin privileges to view this page.'),
    ).toHaveTextContent('You need admin privileges to view this page.');
  });
});
