import {describe, expect, jest, test} from '@jest/globals';
import {render, screen} from '@testing-library/react';
import {IntlProvider} from 'react-intl';
import {Routes} from './Routes';
import {createWrapper} from './test/createWrapper';

jest.mock('./hooks/useUser', () => ({
  __esModule: true,
  useUser: jest.fn(() => ({
    user: {
      id: 1,
      username: 'u',
      email: 'e@x',
      role: 'user',
      points: 0,
      streak_count: 0,
      created_at: '',
      updated_at: '',
    },
    isLoading: false,
    error: null,
    login: jest.fn(),
    register: jest.fn(),
    logout: jest.fn(),
    forgotPassword: jest.fn(),
    resetPassword: jest.fn(),
    isLoggingIn: false,
    isRegistering: false,
    isLoggingOut: false,
    loginError: null,
    registerError: null,
  })),
}));

describe('routes', () => {
  test('renders loading spinner while lazy routes load', async () => {
    render(
      <IntlProvider locale="en" messages={{}}>
        <Routes />
      </IntlProvider>,
      {wrapper: createWrapper({router: true})},
    );
    await expect(
      screen.findByLabelText('loading'),
    ).resolves.toBeInTheDocument();
  });
});
