import {describe, expect, jest, test} from '@jest/globals';
import {render, screen, fireEvent} from '@testing-library/react';
import {createWrapper} from '../test/createWrapper';
import ResetPassword from './ResetPassword';
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

const wrap = (ui: React.ReactElement) => <ToastProvider>{ui}</ToastProvider>;

describe('resetPassword page', () => {
  test('validates token and passwords', async () => {
    const Wrapper = createWrapper({
      i18n: true,
      router: {initialEntries: ['/reset-password?token=']},
    });
    render(wrap(<ResetPassword />), {wrapper: Wrapper});
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
    const Wrapper = createWrapper({
      i18n: true,
      router: {initialEntries: ['/reset-password?token=t']},
    });
    render(wrap(<ResetPassword />), {wrapper: Wrapper});
    fireEvent.change(screen.getByLabelText(/New Password/iu), {
      target: {value: 'a'},
    });
    fireEvent.change(screen.getByLabelText(/Confirm Password/iu), {
      target: {value: 'b'},
    });
    fireEvent.click(screen.getByRole('button', {name: 'Reset Password'}));
    await expect(
      screen.findByText(/Passwords do not match/u),
    ).resolves.toBeInTheDocument();
  });

  test('executes missing-token branch', async () => {
    const MissingTokenWrapper = createWrapper({
      i18n: true,
      router: {initialEntries: ['/reset-password?token=']},
    });
    render(wrap(<ResetPassword />), {wrapper: MissingTokenWrapper});
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
    const NoTokenWrapper = createWrapper({
      i18n: true,
      router: {initialEntries: ['/reset-password']},
    });
    render(wrap(<ResetPassword />), {wrapper: NoTokenWrapper});
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
