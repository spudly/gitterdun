import {render, screen, fireEvent, act} from '@testing-library/react';
import {MemoryRouter, useLocation} from 'react-router-dom';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import Login from './Login';
import * as useUserModule from '../hooks/useUser';

jest.mock('../hooks/useUser', () => ({
  useUser: jest.fn(() => ({
    login: jest.fn(async () => ({})),
    isLoggingIn: false,
    loginError: null,
  })),
}));

const wrap = (ui: React.ReactElement) => (
  <QueryClientProvider client={new QueryClient()}>
    <MemoryRouter>{ui}</MemoryRouter>
  </QueryClientProvider>
);

it('shows login error when loginError is present', () => {
  (useUserModule.useUser as unknown as jest.Mock).mockReturnValueOnce({
    login: jest.fn(
      async (_e: string, _p: string) => ({success: true}) as any,
    ) as any,
    isLoggingIn: false,
    loginError: new Error('Bad creds'),
  } as unknown as ReturnType<typeof useUserModule.useUser>);
  render(wrap(<Login />));
  expect(screen.getByText('Bad creds')).toBeInTheDocument();
  // no restore needed when using mockReturnValueOnce
});

// wrap moved above to satisfy no-use-before-define

describe('Login page', () => {
  it('renders and submits', async () => {
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
    (useUserModule.useUser as unknown as jest.Mock).mockReturnValueOnce({
      login: loginMock as any,
      isLoggingIn: false,
      loginError: null,
    } as unknown as ReturnType<typeof useUserModule.useUser>);
    render(wrap(<Login />));
    expect(screen.getAllByText('Login')[0]).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: {value: 'user@example.com'},
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: {value: 'b'},
    });
    await act(async () => {
      fireEvent.click(screen.getByRole('button', {name: 'Login'}));
    });
    // no restore needed when using mockReturnValueOnce
  });

  // Success branch is exercised by the render-and-submit test above

  it('handles login rejection path', async () => {
    const mocked = useUserModule.useUser as unknown as jest.Mock;
    const defaultImpl = mocked.getMockImplementation();
    mocked.mockImplementation(
      () =>
        ({
          login: jest.fn(async () => {
            throw new Error('no');
          }) as any,
          isLoggingIn: false,
          loginError: null,
        }) as unknown as ReturnType<typeof useUserModule.useUser>,
    );
    render(wrap(<Login />));
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: {value: 'user@example.com'},
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: {value: 'b'},
    });
    await act(async () => {
      fireEvent.click(screen.getByRole('button', {name: 'Login'}));
    });
    expect(await screen.findByText('Login failed')).toBeInTheDocument();
    mocked.mockImplementation(defaultImpl as any);
  });

  it('shows loading state when isLoggingIn is true', () => {
    (useUserModule.useUser as unknown as jest.Mock).mockReturnValueOnce({
      login: jest.fn(
        async (_e: string, _p: string) => ({success: true}) as any,
      ) as any,
      isLoggingIn: true,
      loginError: null,
    } as unknown as ReturnType<typeof useUserModule.useUser>);
    render(wrap(<Login />));
    expect(screen.getByText('Logging in...')).toBeInTheDocument();
    // no restore needed when using mockReturnValueOnce
  });

  it('shows inline loginError alert when provided by hook', () => {
    (useUserModule.useUser as unknown as jest.Mock).mockReturnValueOnce({
      login: jest.fn(
        async (_e: string, _p: string) => ({success: true}) as any,
      ) as any,
      isLoggingIn: false,
      loginError: new Error('Inline Error'),
    } as unknown as ReturnType<typeof useUserModule.useUser>);
    render(wrap(<Login />));
    expect(screen.getByText('Inline Error')).toBeInTheDocument();
    // no restore needed when using mockReturnValueOnce
  });

  it('navigates to root on successful submit', async () => {
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
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: {value: 'user@example.com'},
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: {value: 'pw'},
    });
    await act(async () => {
      fireEvent.click(screen.getByRole('button', {name: 'Login'}));
    });
    expect(screen.getByTestId('loc').textContent).toBe('/');
  });
});
