import {describe, expect, jest, test} from '@jest/globals';
import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
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
    await userEvent.type(screen.getByLabelText(/New Password/iu), 'abcdef');
    await userEvent.type(screen.getByLabelText(/Confirm Password/iu), 'abcdef');
    const submit = screen.getByRole('button', {name: 'Reset Password'});
    await userEvent.click(submit);
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
    await userEvent.type(screen.getByLabelText(/New Password/iu), 'a');
    await userEvent.type(screen.getByLabelText(/Confirm Password/iu), 'b');
    await userEvent.click(screen.getByRole('button', {name: 'Reset Password'}));
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
    await userEvent.type(screen.getByLabelText(/New Password/iu), 'abcdef');
    await userEvent.type(screen.getByLabelText(/Confirm Password/iu), 'abcdef');
    await userEvent.click(screen.getByRole('button', {name: 'Reset Password'}));
    await expect(
      screen.findByText(/Missing token/i),
    ).resolves.toBeInTheDocument();
    expect(screen.getByLabelText(/New Password/iu)).toBeVisible();
    expect(screen.getByRole('button', {name: /Reset Password/i})).toBeEnabled();
    expect(
      screen.getByRole('heading', {name: /Reset Password/i}),
    ).toHaveTextContent(/Reset Password/i);
  });

  test('uses default empty token when query param is absent and shows error', async () => {
    const NoTokenWrapper = createWrapper({
      i18n: true,
      router: {initialEntries: ['/reset-password']},
    });
    render(wrap(<ResetPassword />), {wrapper: NoTokenWrapper});
    // Fill valid passwords to satisfy required/minLength so submit handler runs
    await userEvent.type(screen.getByLabelText(/New Password/iu), 'abcdef');
    await userEvent.type(screen.getByLabelText(/Confirm Password/iu), 'abcdef');
    await userEvent.click(screen.getByRole('button', {name: 'Reset Password'}));
    expect(screen.getByText(/Missing token/u)).toHaveTextContent(
      /Missing token/u,
    );
  });
});
