import {describe, expect, jest, test} from '@jest/globals';
import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {createWrapper} from '../test/createWrapper';
import Profile from './Profile';

jest.mock('../lib/api', () => {
  const actual = jest.requireActual<typeof import('../lib/api')>('../lib/api');
  return {
    ...actual,
    usersApi: {
      ...actual.usersApi,
      getMe: jest.fn(async () => ({
        success: true,
        data: {
          id: 1,
          username: 'User',
          email: 'user@example.com',
          role: 'user',
          points: 0,
          streak_count: 0,
          created_at: 'x',
          updated_at: 'y',
        },
      })),
      updateProfile: jest.fn(async () => ({success: true, data: {ok: true}})),
    },
  };
});

describe('profile', () => {
  test('renders form and updates name', async () => {
    render(<Profile />, {
      wrapper: createWrapper({
        i18n: true,
        router: {initialEntries: ['/profile']},
        queryClient: true,
      }),
    });

    const nameInput = await screen.findByRole('textbox', {name: /name/i});
    await userEvent.clear(nameInput);
    await userEvent.type(nameInput, 'New Name');

    await userEvent.click(screen.getByRole('button', {name: /save/i}));
    expect(nameInput).toHaveValue('New Name');
  });
});
