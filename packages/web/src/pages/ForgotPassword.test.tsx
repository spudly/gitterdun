import {describe, expect, jest, test} from '@jest/globals';
import {render, screen, fireEvent, act} from '@testing-library/react';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import ForgotPassword from './ForgotPassword';
import * as useUserModule from '../hooks/useUser';

jest.mock('../hooks/useUser', () => ({
  useUser: jest.fn(() => ({forgotPassword: jest.fn(async () => ({}))})),
}));

const wrap = (ui: React.ReactElement) => (
  <QueryClientProvider client={new QueryClient()}>{ui}</QueryClientProvider>
);

describe('forgotPassword page', () => {
  test('submits and shows message', async () => {
    render(wrap(<ForgotPassword />));
    const input = screen.getByLabelText(/email/iu);
    fireEvent.change(input, {target: {value: 'e'}});
    await act(async () => {
      fireEvent.submit(
        screen.getByRole('button', {name: 'Send reset link'}).closest('form')!,
      );
    });
    const msgs = await screen.findAllByText(/reset link/);
    expect(msgs.length).toBeGreaterThan(0);
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByRole('button', {name: /send reset link/i})).toBeInTheDocument();
    expect(screen.getByText(/Forgot Password/i)).toBeInTheDocument();
  });

  test('shows error message when request rejects (catch path)', async () => {
    const mocked = jest.mocked(useUserModule.useUser);
    const defaultImpl = mocked.getMockImplementation();
    mocked.mockImplementation(
      () =>
        ({
          user: null,
          isLoading: false,
          error: null,
          login: jest.fn(),
          register: jest.fn(),
          logout: jest.fn(),
          forgotPassword: jest.fn(async () => {
            throw new Error('boom');
          }),
          resetPassword: jest.fn(),
          isLoggingIn: false,
          isRegistering: false,
          isLoggingOut: false,
          loginError: null,
          registerError: null,
        }) as ReturnType<typeof useUserModule.useUser>,
    );
    render(wrap(<ForgotPassword />));
    fireEvent.change(screen.getByLabelText(/email/iu), {
      target: {value: 'x@example.com'},
    });
    await act(async () => {
      fireEvent.submit(
        screen.getByRole('button', {name: 'Send reset link'}).closest('form')!,
      );
    });
    await expect(
      screen.findByText('Request failed'),
    ).resolves.toBeInTheDocument();
    // restore default implementation for subsequent tests
    mocked.mockImplementation(defaultImpl!);
  });
});
