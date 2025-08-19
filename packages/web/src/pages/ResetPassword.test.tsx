import {describe, expect, jest, test} from '@jest/globals';
import {render, screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {MemoryRouter} from 'react-router-dom';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import ResetPassword from './ResetPassword';
import {useUser} from '../hooks/useUser';
import {ToastProvider} from '../widgets/ToastProvider';

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => {
  const actual =
    jest.requireActual<typeof import('react-router-dom')>('react-router-dom');
  return {...actual, useNavigate: () => mockNavigate};
});

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
    await userEvent.type(screen.getByLabelText(/New Password/iu), 'abcdef');
    await userEvent.type(screen.getByLabelText(/Confirm Password/iu), 'abcdef');
    const submit = screen.getByRole('button', {name: 'Reset Password'});
    await userEvent.click(submit);
    await expect(
      screen.findByText(/Missing token/i),
    ).resolves.toBeInTheDocument();
  });

  test('submits when valid', async () => {
    render(wrap(<ResetPassword />));
    await userEvent.type(screen.getByLabelText(/New Password/iu), 'a');
    await userEvent.type(screen.getByLabelText(/Confirm Password/iu), 'a');
    await userEvent.click(screen.getByRole('button', {name: 'Reset Password'}));
    await expect(
      screen.findByText(/Password reset successful/i),
    ).resolves.toBeInTheDocument();
  });

  test('shows message when passwords do not match', async () => {
    render(wrap(<ResetPassword />));
    await userEvent.type(screen.getByLabelText(/New Password/iu), 'a');
    await userEvent.type(screen.getByLabelText(/Confirm Password/iu), 'b');
    await userEvent.click(screen.getByRole('button', {name: 'Reset Password'}));
    expect(screen.getByText(/Passwords do not match/u)).toBeInTheDocument();
  });

  test('executes missing-token branch', async () => {
    render(wrap(<ResetPassword />, '/reset-password?token='));
    // Fill in valid passwords to pass HTML validation
    await userEvent.type(screen.getByLabelText(/New Password/iu), 'abcdef');
    await userEvent.type(screen.getByLabelText(/Confirm Password/iu), 'abcdef');
    await userEvent.click(screen.getByRole('button', {name: 'Reset Password'}));
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
    mockNavigate.mockReset();
    render(
      <QueryClientProvider client={new QueryClient()}>
        <MemoryRouter initialEntries={['/reset-password?token=t']}>
          <ToastProvider>
            <ResetPassword />
          </ToastProvider>
        </MemoryRouter>
      </QueryClientProvider>,
    );
    await userEvent.type(screen.getByLabelText(/New Password/iu), 'abcdef');
    await userEvent.type(screen.getByLabelText(/Confirm Password/iu), 'abcdef');
    await userEvent.click(screen.getByRole('button', {name: 'Reset Password'}));
    await expect(
      screen.findByText(/Password reset successful/i),
    ).resolves.toBeInTheDocument();
    await waitFor(
      () => {
        expect(mockNavigate).toHaveBeenCalledWith('/login');
      },
      {timeout: 2000},
    );
  });

  test('handles reset API rejection (catch branch)', async () => {
    const consoleErrorSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});
    const mockResetPassword = jest.fn(async () => {
      throw new Error('API Error');
    });

    type UseUserReturn = ReturnType<typeof useUser>;
    const mockUseUserReturn: UseUserReturn = {
      user: null,
      isLoading: false,
      error: null,
      login: jest.fn() as UseUserReturn['login'],
      register: jest.fn() as UseUserReturn['register'],
      logout: jest.fn() as UseUserReturn['logout'],
      forgotPassword: jest.fn() as UseUserReturn['forgotPassword'],
      resetPassword: mockResetPassword as UseUserReturn['resetPassword'],
      isLoggingIn: false,
      isRegistering: false,
      isLoggingOut: false,
      loginError: null,
      registerError: null,
    };
    jest.mocked(useUser).mockReturnValue(mockUseUserReturn);

    render(wrap(<ResetPassword />));
    await userEvent.type(screen.getByLabelText(/New Password/iu), 'abcdef');
    await userEvent.type(screen.getByLabelText(/Confirm Password/iu), 'abcdef');

    await userEvent.click(screen.getByRole('button', {name: 'Reset Password'}));

    // Verify the resetPassword function was called
    expect(mockResetPassword).toHaveBeenCalledWith('t', 'abcdef');

    // Clean up
    consoleErrorSpy.mockRestore();
  });

  test('uses default empty token when query param is absent and shows error', async () => {
    render(wrap(<ResetPassword />, '/reset-password'));
    // Fill valid passwords to satisfy required/minLength so submit handler runs
    await userEvent.type(screen.getByLabelText(/New Password/iu), 'abcdef');
    await userEvent.type(screen.getByLabelText(/Confirm Password/iu), 'abcdef');
    await userEvent.click(screen.getByRole('button', {name: 'Reset Password'}));
    expect(screen.getByText(/Missing token/u)).toBeInTheDocument();
  });
});
