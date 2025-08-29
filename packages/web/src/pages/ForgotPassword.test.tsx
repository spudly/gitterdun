import {describe, expect, jest, test} from '@jest/globals';
import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import ForgotPassword from './ForgotPassword';
import * as useUserModule from '../hooks/useUser';
import {createWrapper} from '../test/createWrapper';

jest.mock('../hooks/useUser', () => ({
  useUser: jest.fn(() => ({forgotPassword: jest.fn(async () => ({}))})),
}));

const wrap = (ui: React.ReactElement) => (
  <QueryClientProvider client={new QueryClient()}>{ui}</QueryClientProvider>
);

describe('forgotPassword page', () => {
  test('submits and shows message', async () => {
    const Wrapper = createWrapper({i18n: true});
    render(wrap(<ForgotPassword />), {wrapper: Wrapper});
    const input = screen.getByLabelText(/email/iu);
    await userEvent.type(input, 'e');
    await userEvent.click(
      screen.getByRole('button', {name: 'Send reset link'}),
    );
    const msgs = await screen.findAllByText(/reset link/);
    expect(msgs.length).toBeGreaterThan(0);
    expect(screen.getByLabelText(/email/i)).toBeVisible();
    expect(
      screen.getByRole('button', {name: /send reset link/i}),
    ).toBeEnabled();
    expect(screen.getByText(/Forgot Password/i)).toHaveTextContent(
      /Forgot Password/i,
    );
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
    const Wrapper2 = createWrapper({i18n: true});
    render(wrap(<ForgotPassword />), {wrapper: Wrapper2});
    await userEvent.type(screen.getByLabelText(/email/iu), 'x@example.com');
    await userEvent.click(
      screen.getByRole('button', {name: 'Send reset link'}),
    );
    await expect(
      screen.findByText('Request failed'),
    ).resolves.toBeInTheDocument();
    // restore default implementation for subsequent tests
    mocked.mockImplementation(defaultImpl!);
  });
});
