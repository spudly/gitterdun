import {describe, expect, jest, test} from '@jest/globals';
import {render, screen, fireEvent, act} from '@testing-library/react';
import {MemoryRouter, useLocation} from 'react-router-dom';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import Login from './Login';
import * as useUserModule from '../hooks/useUser';

type UseUserReturn = ReturnType<typeof useUserModule.useUser>;

const createUseUserMock = (
  overrides: Partial<UseUserReturn> = {},
): UseUserReturn => ({
  user: null,
  isLoading: false,
  error: null,
  login: jest.fn(async () => ({success: true})) as UseUserReturn['login'],
  register: jest.fn(async () => ({success: true})) as UseUserReturn['register'],
  logout: jest.fn(async () => ({success: true})) as UseUserReturn['logout'],
  forgotPassword: jest.fn(async () => ({
    success: true,
  })) as UseUserReturn['forgotPassword'],
  resetPassword: jest.fn(async () => ({
    success: true,
  })) as UseUserReturn['resetPassword'],
  isLoggingIn: false,
  isRegistering: false,
  isLoggingOut: false,
  loginError: null,
  registerError: null,
  ...overrides,
});

jest.mock<typeof import('../hooks/useUser')>('../hooks/useUser', () => ({
  useUser: jest.fn(() => createUseUserMock()),
}));

const wrap = (ui: React.ReactElement) => (
  <QueryClientProvider client={new QueryClient()}>
    <MemoryRouter>{ui}</MemoryRouter>
  </QueryClientProvider>
);

test('shows login error when loginError is present', () => {
  jest
    .mocked(useUserModule.useUser)
    .mockReturnValueOnce(
      createUseUserMock({
        login: jest.fn(async () => ({success: true})) as UseUserReturn['login'],
        loginError: new Error('Bad creds'),
      }),
    );
  render(wrap(<Login />));
  expect(screen.getByText('Bad creds')).toBeInTheDocument();
  // no restore needed when using mockReturnValueOnce
});

// wrap moved above to satisfy no-use-before-define

describe('login page', () => {
  test('renders and submits', async () => {
    const loginMock = jest.fn(async (_e: string, _p: string) => ({
      success: true,
      data: {
        id: 1,
        username: 'u',
        email: 'u@example.com',
        role: 'user',
        points: 0,
        streak_count: 0,
      },
    }));
    jest
      .mocked(useUserModule.useUser)
      .mockReturnValueOnce(
        createUseUserMock({login: loginMock as UseUserReturn['login']}),
      );
    render(wrap(<Login />));
    expect(screen.getAllByText('Login')[0]).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText(/email/iu), {
      target: {value: 'user@example.com'},
    });
    fireEvent.change(screen.getByLabelText(/password/iu), {
      target: {value: 'b'},
    });
    await act(async () => {
      fireEvent.click(screen.getByRole('button', {name: 'Login'}));
    });
    // no restore needed when using mockReturnValueOnce
  });

  // Success branch is exercised by the render-and-submit test above

  test('handles login rejection path', async () => {
    const mocked = jest.mocked(useUserModule.useUser);
    const defaultImpl = mocked.getMockImplementation();
    mocked.mockImplementation(() =>
      createUseUserMock({
        login: jest.fn(async () => {
          throw new Error('no');
        }) as UseUserReturn['login'],
      }),
    );
    render(wrap(<Login />));
    fireEvent.change(screen.getByLabelText(/email/iu), {
      target: {value: 'user@example.com'},
    });
    fireEvent.change(screen.getByLabelText(/password/iu), {
      target: {value: 'b'},
    });
    await act(async () => {
      fireEvent.click(screen.getByRole('button', {name: 'Login'}));
    });
    await expect(
      screen.findByText('Login failed'),
    ).resolves.toBeInTheDocument();
    mocked.mockImplementation(defaultImpl);
  });

  test('shows loading state when isLoggingIn is true', () => {
    jest
      .mocked(useUserModule.useUser)
      .mockReturnValueOnce(createUseUserMock({isLoggingIn: true}));
    render(wrap(<Login />));
    expect(screen.getByText('Logging in...')).toBeInTheDocument();
    // no restore needed when using mockReturnValueOnce
  });

  test('shows inline loginError alert when provided by hook', () => {
    jest
      .mocked(useUserModule.useUser)
      .mockReturnValueOnce(
        createUseUserMock({loginError: new Error('Inline Error')}),
      );
    render(wrap(<Login />));
    expect(screen.getByText('Inline Error')).toBeInTheDocument();
    // no restore needed when using mockReturnValueOnce
  });

  test('navigates to root on successful submit', async () => {
    const LocationProbe = () => {
      const loc = useLocation();
      return <div data-testid="loc">{loc.pathname}</div>;
    };
    render(
      <QueryClientProvider client={new QueryClient()}>
        <MemoryRouter initialEntries={['/login']}>
          <LocationProbe />

          <Login />
        </MemoryRouter>
      </QueryClientProvider>,
    );
    fireEvent.change(screen.getByLabelText(/email/iu), {
      target: {value: 'user@example.com'},
    });
    fireEvent.change(screen.getByLabelText(/password/iu), {
      target: {value: 'pw'},
    });
    await act(async () => {
      fireEvent.click(screen.getByRole('button', {name: 'Login'}));
    });
    expect(screen.getByTestId('loc').textContent).toBe('/');
  });
});
