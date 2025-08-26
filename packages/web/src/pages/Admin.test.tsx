import {describe, expect, jest, test} from '@jest/globals';
import {render, screen} from '@testing-library/react';
import {createWrapper} from '../test/createWrapper';
import Admin from './Admin';

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

describe('admin page', () => {
  test('renders admin panel with appropriate sections but no family management', async () => {
    const Wrapper = createWrapper({
      i18n: true,
      queryClient: true,
      router: true,
    });
    render(<Admin />, {wrapper: Wrapper});

    // Should render the admin panel title
    await expect(screen.findByText('Admin Panel')).resolves.toBeInTheDocument();

    // Should NOT contain family management functionality
    expect(screen.queryByText('Family Management')).not.toBeInTheDocument();
    expect(
      screen.queryByPlaceholderText('Family name'),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('button', {name: 'Create Family'}),
    ).not.toBeInTheDocument();
    expect(screen.queryByPlaceholderText('Family ID')).not.toBeInTheDocument();
    expect(
      screen.queryByRole('button', {name: 'Invite'}),
    ).not.toBeInTheDocument();
  });

  test('denies access for non-admin users', () => {
    const useUserMock = jest.requireMock('../hooks/useUser').useUser;
    useUserMock.mockReturnValueOnce({user: {id: 1, role: 'user'}});

    const Wrapper = createWrapper({
      i18n: true,
      queryClient: true,
      router: true,
    });
    render(<Admin />, {wrapper: Wrapper});

    expect(screen.getByText('Access Denied')).toBeInTheDocument();
    expect(
      screen.getByText('You need admin privileges to view this page.'),
    ).toBeInTheDocument();
  });

  test('denies access for unauthenticated users', () => {
    const useUserMock = jest.requireMock('../hooks/useUser').useUser;
    useUserMock.mockReturnValueOnce({user: null});

    const Wrapper = createWrapper({
      i18n: true,
      queryClient: true,
      router: true,
    });
    render(<Admin />, {wrapper: Wrapper});

    expect(screen.getByText('Access Denied')).toBeInTheDocument();
    expect(
      screen.getByText('You need admin privileges to view this page.'),
    ).toBeInTheDocument();
  });
});
