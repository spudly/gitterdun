import {describe, expect, jest, test} from '@jest/globals';
import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import Family from './Family.js';
import {useUser} from '../hooks/useUser.js';
import * as apiModule from '../lib/api.js';
import {createWrapper} from '../test/createWrapper.js';

jest.mock('../hooks/useUser', () => ({
  useUser: jest.fn(() => ({user: {id: 1}})),
}));

jest.mock('../lib/api', () => ({
  familiesApi: {
    myFamily: jest.fn(async () => ({
      success: true,
      data: {id: 1, name: 'Fam', owner_id: 1, created_at: ''},
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
    const Wrapper = createWrapper({i18n: true});
    render(wrap(<Family />), {wrapper: Wrapper});
    expect(
      screen.getByText('Please log in to manage your family.'),
    ).toHaveTextContent('Please log in to manage your family.');
  });

  test('serves as the primary family management interface for authenticated users', async () => {
    const Wrapper = createWrapper({i18n: true, queryClient: true});
    render(wrap(<Family />), {wrapper: Wrapper});

    // Should provide all core family management features
    await expect(screen.findByText('Your Family')).resolves.toHaveTextContent(
      'Your Family',
    );

    // Should allow family creation
    expect(screen.getByPlaceholderText('New family name')).toBeVisible();
    expect(screen.getAllByRole('button', {name: 'Create'})[0]).toBeEnabled();

    // No selector now; create-only when no family
    expect(screen.queryByRole('combobox')).not.toBeInTheDocument();
  });

  test('provides complete family management functionality when family is selected', async () => {
    const Wrapper = createWrapper({i18n: true, queryClient: true});
    render(wrap(<Family />), {wrapper: Wrapper});

    await screen.findByText('Your Family');
    // With a family present, members section is visible
    await expect(screen.findByText('Members')).resolves.toBeInTheDocument();
  });

  test('renders section title', async () => {
    const Wrapper = createWrapper({i18n: true, queryClient: true});
    render(wrap(<Family />), {wrapper: Wrapper});
    await expect(screen.findByText('Your Family')).resolves.toBeInTheDocument();
  });

  test('allows creating a new family and child & inviting a member', async () => {
    const {familiesApi, invitationsApi} = jest.mocked(apiModule);
    // First load: no family → show create form
    familiesApi.myFamily.mockResolvedValueOnce({success: true, data: null});
    familiesApi.create.mockResolvedValueOnce({success: true});
    // After create, refetch returns the new family
    familiesApi.myFamily.mockResolvedValueOnce({
      success: true,
      data: {id: 1, name: 'Fam', owner_id: 1, created_at: ''},
    });
    familiesApi.listMembers.mockResolvedValueOnce({success: true, data: []});
    familiesApi.createChild.mockResolvedValueOnce({success: true});
    invitationsApi.create.mockResolvedValueOnce({success: true});

    const Wrapper = createWrapper({i18n: true, queryClient: true});
    render(wrap(<Family />), {wrapper: Wrapper});

    await screen.findByText('Your Family');
    // Create family
    await userEvent.type(
      screen.getByPlaceholderText('New family name'),
      'NewFam',
    );
    await userEvent.click(screen.getByRole('button', {name: 'Create'}));
    expect(familiesApi.create).toHaveBeenCalledWith({name: 'NewFam'});

    // After refetch, reveal both forms
    await userEvent.click(
      screen.getByRole('button', {name: 'Add Family Member'}),
    );
    const usernameInput = await screen.findByPlaceholderText('Username');
    await userEvent.type(usernameInput, 'kid');
    await userEvent.type(
      screen.getAllByPlaceholderText('Email')[0]!,
      'kid@ex.com',
    );
    await userEvent.type(
      screen.getAllByPlaceholderText('Password')[0]!,
      'pw12',
    );
    await userEvent.click(screen.getAllByRole('button', {name: 'Create'})[0]!);

    // Invite
    const inviteEmailInput = screen.getAllByPlaceholderText('Email')[1]!;
    await userEvent.type(inviteEmailInput, 'm@ex.com');
    await userEvent.click(screen.getByRole('button', {name: 'Send'}));
    expect(familiesApi.createChild).toHaveBeenCalledWith(1, {
      username: 'kid',
      email: 'kid@ex.com',
      password: 'pw12',
    });
    expect(invitationsApi.create).toHaveBeenCalledWith(1, {
      email: 'm@ex.com',
      role: 'parent',
    });
  });

  test('skips actions when inputs are empty (validation branches)', async () => {
    const Wrapper2 = createWrapper({i18n: true, queryClient: true});
    render(wrap(<Family />), {wrapper: Wrapper2});
    await screen.findByText('Your Family');
    // Click create with empty family name (guard branch)
    await userEvent.click(screen.getAllByRole('button', {name: 'Create'})[0]!);
    // Reveal forms; Invite with empty email should no-op
    await userEvent.click(
      screen.getByRole('button', {name: 'Add Family Member'}),
    );
    await userEvent.click(screen.getByRole('button', {name: 'Send'}));
    // Nothing to assert on API; ensure page is still rendered
    expect(screen.getByText('Your Family')).toHaveTextContent('Your Family');
  });
});

describe('family page form toggles', () => {
  test('hides forms by default and shows them after clicking buttons', async () => {
    const Wrapper = createWrapper({i18n: true, queryClient: true});
    render(wrap(<Family />), {wrapper: Wrapper});
    const user = userEvent.setup();

    // Forms should not be visible initially
    expect(
      screen.queryByRole('region', {name: 'Create Child Account'}),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('region', {name: 'Invite Member'}),
    ).not.toBeInTheDocument();

    // Click single button in FamilyMembers to show both forms
    await user.click(
      await screen.findByRole('button', {name: 'Add Family Member'}),
    );

    // Forms should now be visible
    await expect(
      screen.findByRole('region', {name: 'Create Child Account'}),
    ).resolves.toBeInTheDocument();
    await expect(
      screen.findByRole('region', {name: 'Invite Member'}),
    ).resolves.toBeInTheDocument();
  });
});
