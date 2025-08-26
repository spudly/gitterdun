import {describe, expect, jest, test} from '@jest/globals';
import {render, screen} from '@testing-library/react';
import {createWrapper} from '../test/createWrapper';
import Admin from './Admin';

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
  test('renders admin panel with appropriate sections but no family management', async () => {
    const Wrapper = createWrapper({
      i18n: true,
      queryClient: true,
      router: true,
    });
    render(<Admin />, {wrapper: Wrapper});

    await expect(screen.findByText('Admin Panel')).resolves.toBeInTheDocument();

    expect(screen.queryByText('Family Management')).not.toBeInTheDocument();
    expect(
      screen.queryByPlaceholderText('Family name'),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('button', {name: 'Create Family'}),
    ).not.toBeInTheDocument();
    expect(screen.queryByPlaceholderText('Family ID')).not.toBeInTheDocument();
    expect(
      screen.queryByRole('button', {name: 'Invite'}),
    ).not.toBeInTheDocument();
    expect(screen.queryByText('Chores Management')).not.toBeInTheDocument();
  });

  test('denies access for non-admin users', () => {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion -- wrong
    const mocked = jest.requireMock('../hooks/useUser') as {useUser: any};
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

    expect(screen.getByText('Access Denied')).toBeInTheDocument();
    expect(
      screen.getByText('You need admin privileges to view this page.'),
    ).toBeInTheDocument();
  });

  test('denies access for unauthenticated users', () => {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion -- wrong
    const mocked = jest.requireMock('../hooks/useUser') as {useUser: any};
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

    expect(screen.getByText('Access Denied')).toBeInTheDocument();
    expect(
      screen.getByText('You need admin privileges to view this page.'),
    ).toBeInTheDocument();
  });
});
