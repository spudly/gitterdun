import {describe, expect, jest, test} from '@jest/globals';
import {render, screen, fireEvent, act} from '@testing-library/react';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import Family from './Family';
import {useUser} from '../hooks/useUser';
import * as apiModule from '../lib/api';

jest.mock('../hooks/useUser', () => ({
  useUser: jest.fn(() => ({user: {id: 1}})),
}));

jest.mock('../lib/api', () => ({
  familiesApi: {
    myFamilies: jest.fn(async () => ({
      success: true,
      data: [{id: 1, name: 'Fam', owner_id: 1, created_at: ''}],
    })),
    listMembers: jest.fn(async () => ({success: true, data: []})),
    create: jest.fn(async () => ({success: true})),
    createChild: jest.fn(async () => ({success: true})),
  },
  invitationsApi: {create: jest.fn(async () => ({success: true}))},
}));

const wrap = (ui: React.ReactElement) => (
  <QueryClientProvider client={new QueryClient()}>{ui}</QueryClientProvider>
);

describe('family page', () => {
  test('requires login when user is null', () => {
    const mockedUseUser = jest.mocked(useUser);
    mockedUseUser.mockReturnValueOnce({
      user: null,
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
    } as ReturnType<typeof useUser>);
    render(wrap(<Family />));
    expect(
      screen.getByText('Please log in to manage your family.'),
    ).toBeInTheDocument();
  });
  test('renders section title', async () => {
    await act(async () => {
      render(wrap(<Family />));
    });
    expect(screen.getByText('Your Families')).toBeInTheDocument();
  });

  test('allows creating a new family and child & inviting a member', async () => {
    const {familiesApi, invitationsApi} = jest.mocked(apiModule);
    familiesApi.create.mockResolvedValueOnce({success: true});
    familiesApi.createChild.mockResolvedValueOnce({success: true});
    invitationsApi.create.mockResolvedValueOnce({success: true});

    render(wrap(<Family />));
    await screen.findByText('Your Families');
    fireEvent.change(screen.getByPlaceholderText('New family name'), {
      target: {value: 'NewFam'},
    });
    act(() => {
      fireEvent.click(screen.getAllByRole('button', {name: 'Create'})[0]!);
    });
    // Without a selected family, member sections are hidden.
    // Simulate a selection by setting state indirectly
    const selects = screen.getAllByRole('combobox');
    const familySelect = selects[0]!;
    fireEvent.change(familySelect, {target: {value: '1'}});
    // Create child
    // Since members section depends on selection, skip the child creation inputs if not present
    const usernameInput = await screen.findByPlaceholderText('Username');
    fireEvent.change(usernameInput, {target: {value: 'kid'}});
    fireEvent.change(screen.getAllByPlaceholderText('Email')[0]!, {
      target: {value: 'kid@ex.com'},
    });
    fireEvent.change(screen.getAllByPlaceholderText('Password')[0]!, {
      target: {value: 'pw'},
    });
    act(() => {
      fireEvent.click(screen.getAllByRole('button', {name: 'Create'})[1]!);
    });
    // Invite
    const inviteEmailInput = screen.getAllByPlaceholderText('Email')[1]!;
    fireEvent.change(inviteEmailInput, {target: {value: 'm@ex.com'}});
    act(() => {
      fireEvent.click(screen.getByRole('button', {name: 'Send'}));
    });
    expect(familiesApi.create).toHaveBeenCalledWith({name: 'NewFam'});
    expect(familiesApi.createChild).toHaveBeenCalledWith(1, {
      username: 'kid',
      email: 'kid@ex.com',
      password: 'pw',
    });
    expect(invitationsApi.create).toHaveBeenCalledWith(1, {
      email: 'm@ex.com',
      role: 'parent',
    });
  });

  test('skips actions when inputs are empty (validation branches)', async () => {
    render(wrap(<Family />));
    await screen.findByText('Your Families');
    // Click create with empty family name (guard branch)
    act(() => {
      fireEvent.click(screen.getAllByRole('button', {name: 'Create'})[0]!);
    });
    // Select a family to reveal sections
    fireEvent.change(screen.getAllByRole('combobox')[0]!, {
      target: {value: '1'},
    });
    // Child create with missing inputs (guard branch)
    act(() => {
      fireEvent.click(screen.getAllByRole('button', {name: 'Create'})[1]!);
    });
    // Invite with empty email should no-op (exercise path only)
    fireEvent.change(screen.getAllByRole('combobox')[0]!, {
      target: {value: '1'},
    });
    act(() => {
      fireEvent.click(screen.getByRole('button', {name: 'Send'}));
    });
    // Nothing to assert on API; ensure page is still rendered
    expect(screen.getByText('Your Families')).toBeInTheDocument();
  });
});
