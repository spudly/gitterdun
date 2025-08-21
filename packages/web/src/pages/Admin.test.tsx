import {describe, expect, jest, test} from '@jest/globals';
import {render, screen, act, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {createWrapper} from '../test/createWrapper';
import Admin from './Admin';
import * as apiModule from '../lib/api';

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => {
  const actual =
    jest.requireActual<typeof import('react-router-dom')>('react-router-dom');
  return {...actual, useNavigate: () => mockNavigate};
});

jest.mock('../hooks/useUser', () => ({
  useUser: jest.fn(() => ({user: {id: 1, role: 'admin'}})),
}));

jest.mock('../lib/api', () => ({
  choresApi: {getAll: jest.fn(async () => ({success: true, data: []}))},
  familiesApi: {
    create: jest.fn(async () => ({success: true})),
    myFamilies: jest.fn(async () => ({success: true, data: []})),
    listMembers: jest.fn(async () => ({success: true, data: []})),
    createChild: jest.fn(async () => ({success: true})),
  },
  invitationsApi: {create: jest.fn(async () => ({success: true}))},
}));

const wrap = (ui: React.ReactElement) => ui;

describe('admin page', () => {
  test('navigates to /family after successful create via setTimeout', async () => {
    const {familiesApi} = jest.mocked(apiModule);
    familiesApi.create.mockResolvedValueOnce({success: true});
    mockNavigate.mockClear();

    const Wrapper = createWrapper({
      i18n: true,
      queryClient: true,
      router: true,
    });
    render(wrap(<Admin />), {wrapper: Wrapper});
    await screen.findByText('Admin Panel');
    await userEvent.clear(screen.getByPlaceholderText('Family name'));
    await userEvent.type(
      screen.getByPlaceholderText('Family name'),
      'TimerFam',
    );
    await act(async () => {
      await userEvent.click(
        screen.getByRole('button', {name: 'Create Family'}),
      );
    });

    await expect(
      screen.findByText('Family created. Redirecting...'),
    ).resolves.toBeInTheDocument();
    expect(familiesApi.create).toHaveBeenCalledWith({name: 'TimerFam'});

    await waitFor(
      () => {
        expect(mockNavigate).toHaveBeenCalledWith('/family');
      },
      {timeout: 2000},
    );
  });
});
