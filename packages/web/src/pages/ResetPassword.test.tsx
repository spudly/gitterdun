import {describe, expect, jest, test} from '@jest/globals';
import {render, screen, fireEvent} from '@testing-library/react';
import {MemoryRouter} from 'react-router-dom';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import ResetPassword from './ResetPassword';
import {ToastProvider} from '../widgets/ToastProvider';
import {TestProviders} from '../test/TestProviders';

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
    render(wrap(<ResetPassword />, '/reset-password?token='), {
      wrapper: TestProviders,
    });
    // Fill in valid passwords to pass HTML validation
    fireEvent.change(screen.getByLabelText(/New Password/iu), {
      target: {value: 'abcdef'},
    });
    fireEvent.change(screen.getByLabelText(/Confirm Password/iu), {
      target: {value: 'abcdef'},
    });
    const submit = screen.getByRole('button', {name: 'Reset Password'});
    fireEvent.click(submit);
    await expect(
      screen.findByText(/Missing token/i),
    ).resolves.toBeInTheDocument();
  });

  test('shows message when passwords do not match', async () => {
    render(wrap(<ResetPassword />), {wrapper: TestProviders});
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
    render(wrap(<ResetPassword />, '/reset-password?token='), {
      wrapper: TestProviders,
    });
    // Fill in valid passwords to pass HTML validation
    fireEvent.change(screen.getByLabelText(/New Password/iu), {
      target: {value: 'abcdef'},
    });
    fireEvent.change(screen.getByLabelText(/Confirm Password/iu), {
      target: {value: 'abcdef'},
    });
    fireEvent.click(screen.getByRole('button', {name: 'Reset Password'}));
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

  test('uses default empty token when query param is absent and shows error', async () => {
    render(wrap(<ResetPassword />, '/reset-password'), {
      wrapper: TestProviders,
    });
    // Fill valid passwords to satisfy required/minLength so submit handler runs
    fireEvent.change(screen.getByLabelText(/New Password/iu), {
      target: {value: 'abcdef'},
    });
    fireEvent.change(screen.getByLabelText(/Confirm Password/iu), {
      target: {value: 'abcdef'},
    });
    fireEvent.click(screen.getByRole('button', {name: 'Reset Password'}));
    expect(screen.getByText(/Missing token/u)).toBeInTheDocument();
  });
});
