import {describe, expect, jest, test} from '@jest/globals';
import {render, screen, fireEvent, act} from '@testing-library/react';
import {MemoryRouter, useLocation} from 'react-router-dom';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import ResetPassword from './ResetPassword';
import {useUser} from '../hooks/useUser';
import {ToastProvider} from '../widgets/ToastProvider';

jest.mock('../hooks/useUser', () => ({
  useUser: jest.fn(() => ({resetPassword: jest.fn(async () => ({}))})),
}));

const wrap = (ui: React.ReactElement, path = '/reset-password?token=t') => (
  <QueryClientProvider client={new QueryClient()}>
    <MemoryRouter initialEntries={[path]}>
      <ToastProvider>{ui}</ToastProvider>
    </MemoryRouter>
  </QueryClientProvider>
);

describe('resetPassword page', () => {
  test('validates token and passwords', async () => {
    render(wrap(<ResetPassword />, '/reset-password?token='));
    // Fill in valid passwords to pass HTML validation
    fireEvent.change(screen.getByLabelText(/New Password/iu), {
      target: {value: 'abcdef'},
    });
    fireEvent.change(screen.getByLabelText(/Confirm Password/iu), {
      target: {value: 'abcdef'},
    });
    const submit = screen.getByRole('button', {name: 'Reset Password'});
    await act(async () => {
      submit.click();
    });
    await expect(
      screen.findByText(/Missing token/i),
    ).resolves.toBeInTheDocument();
  });

  test('submits when valid', async () => {
    render(wrap(<ResetPassword />));
    fireEvent.change(screen.getByLabelText(/New Password/iu), {
      target: {value: 'a'},
    });
    fireEvent.change(screen.getByLabelText(/Confirm Password/iu), {
      target: {value: 'a'},
    });
    await act(async () => {
      fireEvent.click(screen.getByRole('button', {name: 'Reset Password'}));
    });
    await expect(
      screen.findByText(/Password reset successful/i),
    ).resolves.toBeInTheDocument();
  });

  test('shows message when passwords do not match', () => {
    render(wrap(<ResetPassword />));
    fireEvent.change(screen.getByLabelText(/New Password/iu), {
      target: {value: 'a'},
    });
    fireEvent.change(screen.getByLabelText(/Confirm Password/iu), {
      target: {value: 'b'},
    });
    fireEvent.click(screen.getByRole('button', {name: 'Reset Password'}));
    expect(screen.getByText(/Passwords do not match/u)).toBeInTheDocument();
  });

  test('executes missing-token branch', async () => {
    render(wrap(<ResetPassword />, '/reset-password?token='));
    // Fill in valid passwords to pass HTML validation
    fireEvent.change(screen.getByLabelText(/New Password/iu), {
      target: {value: 'abcdef'},
    });
    fireEvent.change(screen.getByLabelText(/Confirm Password/iu), {
      target: {value: 'abcdef'},
    });
    await act(async () => {
      fireEvent.click(screen.getByRole('button', {name: 'Reset Password'}));
    });
    await expect(
      screen.findByText(/Missing token/i),
    ).resolves.toBeInTheDocument();
    expect(screen.getByLabelText(/New Password/iu)).toBeInTheDocument();
    expect(
      screen.getByRole('button', {name: /Reset Password/i}),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', {name: /Reset Password/i}),
    ).toBeInTheDocument();
  });

  test('executes success branch and schedules redirect', async () => {
    jest.useFakeTimers();
    const LocationProbe = () => {
      const loc = useLocation();
      return <div data-testid="loc">{loc.pathname}</div>;
    };
    render(
      <QueryClientProvider client={new QueryClient()}>
        <MemoryRouter initialEntries={['/reset-password?token=t']}>
          <ToastProvider>
            <LocationProbe />
            <ResetPassword />
          </ToastProvider>
        </MemoryRouter>
      </QueryClientProvider>,
    );
    fireEvent.change(screen.getByLabelText(/New Password/iu), {
      target: {value: 'abcdef'},
    });
    fireEvent.change(screen.getByLabelText(/Confirm Password/iu), {
      target: {value: 'abcdef'},
    });
    await act(async () => {
      fireEvent.click(screen.getByRole('button', {name: 'Reset Password'}));
    });
    await expect(
      screen.findByText(/Password reset successful/i),
    ).resolves.toBeInTheDocument();
    act(() => {
      jest.runAllTimers();
    });
    expect(screen.getByTestId('loc').textContent).toBe('/login');
    jest.useRealTimers();
  });

  test('handles reset API rejection (catch branch)', async () => {
    const consoleErrorSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});
    const mockResetPassword = (jest.fn() as any).mockRejectedValue(
      new Error('API Error'),
    );

    jest
      .mocked(useUser)
      .mockReturnValue({
        user: null,
        isLoading: false,
        error: null,
        login: jest.fn(),
        register: jest.fn(),
        logout: jest.fn(),
        forgotPassword: jest.fn(),
        resetPassword: mockResetPassword,
        isLoggingIn: false,
        isRegistering: false,
        isLoggingOut: false,
        loginError: null,
        registerError: null,
      } as any);

    render(wrap(<ResetPassword />));
    fireEvent.change(screen.getByLabelText(/New Password/iu), {
      target: {value: 'abcdef'},
    });
    fireEvent.change(screen.getByLabelText(/Confirm Password/iu), {
      target: {value: 'abcdef'},
    });

    await act(async () => {
      fireEvent.click(screen.getByRole('button', {name: 'Reset Password'}));
    });

    // Verify the resetPassword function was called
    expect(mockResetPassword).toHaveBeenCalledWith('t', 'abcdef');

    // Clean up
    consoleErrorSpy.mockRestore();
  });

  test('uses default empty token when query param is absent and shows error', async () => {
    render(wrap(<ResetPassword />, '/reset-password'));
    // Fill valid passwords to satisfy required/minLength so submit handler runs
    fireEvent.change(screen.getByLabelText(/New Password/iu), {
      target: {value: 'abcdef'},
    });
    fireEvent.change(screen.getByLabelText(/Confirm Password/iu), {
      target: {value: 'abcdef'},
    });
    await act(async () => {
      fireEvent.click(screen.getByRole('button', {name: 'Reset Password'}));
    });
    expect(screen.getByText(/Missing token/u)).toBeInTheDocument();
  });
});
