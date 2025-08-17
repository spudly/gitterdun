import {describe, expect, jest, test} from '@jest/globals';
import {render, screen, fireEvent, act} from '@testing-library/react';
import {MemoryRouter, useLocation} from 'react-router-dom';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import Admin from './Admin';
import * as useUserModule from '../hooks/useUser';
import * as apiModule from '../lib/api';

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

const wrap = (ui: React.ReactElement) => (
  <QueryClientProvider client={new QueryClient()}>
    <MemoryRouter>{ui}</MemoryRouter>
  </QueryClientProvider>
);

describe('admin page', () => {
  test('renders admin header', async () => {
    render(wrap(<Admin />));
    await expect(screen.findByText('Admin Panel')).resolves.toBeInTheDocument();
  });

  test('handles family creation and invitation flows', async () => {
    const mocked = jest.mocked(apiModule);
    mocked.familiesApi.create.mockResolvedValueOnce({success: true});
    mocked.invitationsApi.create.mockResolvedValueOnce({success: true});

    render(wrap(<Admin />));
    await screen.findByText('Admin Panel');
    // Create Family
    fireEvent.change(screen.getByPlaceholderText('Family name'), {
      target: {value: 'Smiths'},
    });
    await act(async () => {
      fireEvent.click(screen.getByRole('button', {name: 'Create Family'}));
    });
    await expect(
      screen.findByText(/Family created/u),
    ).resolves.toBeInTheDocument();

    // Invite flow validation then success
    fireEvent.change(screen.getByPlaceholderText('Family ID'), {
      target: {value: '1'},
    });
    fireEvent.change(screen.getByPlaceholderText('Invite email'), {
      target: {value: 'a@b.com'},
    });
    await act(async () => {
      fireEvent.click(screen.getByRole('button', {name: 'Invite'}));
    });
    await expect(
      screen.findByText(/Invitation created/u),
    ).resolves.toBeInTheDocument();
  });

  test('renders chore list and action buttons for completed status', async () => {
    const mocked = jest.mocked(apiModule);
    mocked.choresApi.getAll.mockResolvedValueOnce({
      success: true,
      data: [
        {
          id: 1,
          title: 'C',
          description: 'd',
          point_reward: 1,
          bonus_points: 0,
          penalty_points: 0,
          chore_type: 'regular',
          status: 'completed',
          created_by: 1,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          due_date: undefined,
          recurrence_rule: undefined,
          created_by_username: 'admin',
        },
      ],
    });
    render(wrap(<Admin />));
    await expect(screen.findByText('Admin Panel')).resolves.toBeInTheDocument();
    await expect(screen.findByText('C')).resolves.toBeInTheDocument();
    expect(screen.getByRole('button', {name: 'Approve'})).toBeInTheDocument();
    expect(screen.getByRole('button', {name: 'Reject'})).toBeInTheDocument();
  });

  test('renders pending chore and shows penalty/due meta', async () => {
    const mocked = jest.mocked(apiModule);
    mocked.choresApi.getAll.mockResolvedValueOnce({
      success: true,
      data: [
        {
          id: 9,
          title: 'Pending Item',
          description: 'desc',
          point_reward: 3,
          bonus_points: 0,
          penalty_points: 2,
          chore_type: 'regular',
          status: 'pending',
          due_date: new Date().toISOString(),
          created_by: 1,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ],
    });
    render(wrap(<Admin />));
    await expect(
      screen.findByText('Pending Item'),
    ).resolves.toBeInTheDocument();
    // Meta content presence (penalty/due labels)
    expect(screen.getByText(/Penalty:/u)).toBeInTheDocument();
    expect(screen.getByText(/Due:/u)).toBeInTheDocument();
    // Pending actions show only Edit button in this branch
    expect(screen.getByRole('button', {name: 'Edit'})).toBeInTheDocument();
  });

  test('requires admin privileges', async () => {
    const mockedUseUser = jest.mocked(useUserModule.useUser);
    mockedUseUser.mockReturnValueOnce({
      user: {
        id: 2,
        username: 'testuser',
        email: 'test@example.com',
        role: 'user',
        points: 0,
        streak_count: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      isLoading: false,
      error: null,
      login: jest.fn() as any,
      register: jest.fn() as any,
      logout: jest.fn() as any,
      forgotPassword: jest.fn() as any,
      resetPassword: jest.fn() as any,
      isLoggingIn: false,
      isRegistering: false,
      isLoggingOut: false,
      loginError: null,
      registerError: null,
    });
    render(wrap(<Admin />));
    await expect(
      screen.findByText('Access Denied'),
    ).resolves.toBeInTheDocument();
  });

  test('validates and handles errors on family create and invite', async () => {
    const {familiesApi, invitationsApi} = jest.mocked(apiModule);

    // Create Family: empty name should no-op (validation line)
    render(wrap(<Admin />));
    await screen.findByText('Admin Panel');
    await act(async () => {
      fireEvent.click(screen.getByRole('button', {name: 'Create Family'}));
    });

    // Create Family: API returns success=false
    familiesApi.create.mockResolvedValueOnce({success: false, error: 'Bad'});
    fireEvent.change(screen.getByPlaceholderText('Family name'), {
      target: {value: 'A'},
    });
    await act(async () => {
      fireEvent.click(screen.getByRole('button', {name: 'Create Family'}));
    });
    await expect(
      screen.findByText(/Failed to create family|Bad/u),
    ).resolves.toBeInTheDocument();

    // Invite: missing fields validation
    await act(async () => {
      fireEvent.click(screen.getByRole('button', {name: 'Invite'}));
    });
    await expect(
      screen.findByText('Enter family ID and email'),
    ).resolves.toBeInTheDocument();

    // Change role to cover role select onChange (second combobox on the page)
    const roleSelect = screen.getByRole('combobox');
    fireEvent.change(roleSelect, {target: {value: 'child'}});

    // Invite: API rejects -> catch branch
    fireEvent.change(screen.getByPlaceholderText('Family ID'), {
      target: {value: '123'},
    });
    fireEvent.change(screen.getByPlaceholderText('Invite email'), {
      target: {value: 'x@y.com'},
    });
    invitationsApi.create.mockRejectedValueOnce(new Error('nope'));
    await act(async () => {
      fireEvent.click(screen.getByRole('button', {name: 'Invite'}));
    });
    await expect(
      screen.findByText('Failed to invite'),
    ).resolves.toBeInTheDocument();
  });

  test('renders approved chore and bonus badge', async () => {
    const mocked = jest.mocked(apiModule);
    mocked.choresApi.getAll.mockResolvedValueOnce({
      success: true,
      data: [
        {
          id: 2,
          title: 'B',
          description: 'x',
          point_reward: 2,
          bonus_points: 1,
          penalty_points: 0,
          chore_type: 'bonus',
          status: 'approved',
          created_by: 1,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ],
    });
    render(wrap(<Admin />));
    await expect(screen.findByText('B')).resolves.toBeInTheDocument();
    expect(screen.getByText('approved')).toBeInTheDocument();
    expect(screen.getByText('Bonus')).toBeInTheDocument();
  });

  test('handles family create API rejection (catch path)', async () => {
    const mocked = jest.mocked(apiModule);
    mocked.familiesApi.create.mockRejectedValueOnce(new Error('boom'));
    render(wrap(<Admin />));
    await screen.findByText('Admin Panel');
    fireEvent.change(screen.getByPlaceholderText('Family name'), {
      target: {value: 'Err'},
    });
    await act(async () => {
      fireEvent.click(screen.getByRole('button', {name: 'Create Family'}));
    });
    await expect(
      screen.findByText('Failed to create family'),
    ).resolves.toBeInTheDocument();
  });

  test('shows backup error message when create returns success=false without error', async () => {
    const {familiesApi} = jest.mocked(apiModule);
    familiesApi.create.mockResolvedValueOnce({success: false});
    render(wrap(<Admin />));
    await screen.findByText('Admin Panel');
    fireEvent.change(screen.getByPlaceholderText('Family name'), {
      target: {value: 'X'},
    });
    await act(async () => {
      fireEvent.click(screen.getByRole('button', {name: 'Create Family'}));
    });
    await expect(
      screen.findByText('Failed to create family'),
    ).resolves.toBeInTheDocument();
  });

  test('navigates to /family after successful create via setTimeout', async () => {
    jest.useFakeTimers();
    const {familiesApi} = jest.mocked(apiModule);
    familiesApi.create.mockResolvedValueOnce({success: true});

    const LocationProbe = () => {
      const loc = useLocation();
      return <div data-testid="loc">{loc.pathname}</div>;
    };

    render(
      <QueryClientProvider client={new QueryClient()}>
        <MemoryRouter initialEntries={['/']}>
          <LocationProbe />

          <Admin />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await screen.findByText('Admin Panel');
    fireEvent.change(screen.getByPlaceholderText('Family name'), {
      target: {value: 'TimerFam'},
    });
    await act(async () => {
      fireEvent.click(screen.getByRole('button', {name: 'Create Family'}));
    });

    await act(async () => {
      jest.runAllTimers();
    });
    expect(screen.getByTestId('loc').textContent).toBe('/family');
    jest.useRealTimers();
  });
});
