import {beforeEach, describe, expect, jest, test} from '@jest/globals';
import {render, screen, act} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {createWrapper} from '../test/createWrapper';
import * as useUserModule from '../hooks/useUser';
import Register from './Register';

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

describe('register page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders and submits', async () => {
    const Wrapper = createWrapper({i18n: true, router: true, toast: true});
    render(<Register />, {wrapper: Wrapper});

    expect(
      screen.getByRole('heading', {name: /register/i}),
    ).toBeInTheDocument();
    await userEvent.type(screen.getByLabelText(/username/i), 'newuser');
    await userEvent.type(screen.getByLabelText(/email/i), 'new@user.com');
    await userEvent.type(screen.getByLabelText(/password/i), 'password1');
    await act(async () => {
      await userEvent.click(screen.getByRole('button', {name: /register/i}));
    });
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  test('submits without email (email optional)', async () => {
    const registerSpy = jest.fn(async () => ({
      success: true,
    })) as UseUserReturn['register'];
    jest
      .mocked(useUserModule.useUser)
      .mockReturnValue(createUseUserMock({register: registerSpy}));
    const Wrapper = createWrapper({i18n: true, router: true});
    render(<Register />, {wrapper: Wrapper});

    await userEvent.type(screen.getByLabelText(/username/i), 'newuser');
    // do not type email
    await userEvent.type(screen.getByLabelText(/password/i), 'password1');
    await act(async () => {
      await userEvent.click(screen.getByRole('button', {name: /register/i}));
    });

    expect(registerSpy).toHaveBeenCalledTimes(1);
    const arg = jest.mocked(registerSpy).mock.calls[0]![0] as Record<
      string,
      unknown
    >;
    expect(arg).toMatchObject({username: 'newuser', password: 'password1'});
    expect(Object.hasOwn(arg, 'email')).toBe(false);
  });
});
