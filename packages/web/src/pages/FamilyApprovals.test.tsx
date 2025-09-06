import {describe, expect, jest, test} from '@jest/globals';
import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {createWrapper} from '../test/createWrapper.js';
import FamilyApprovals from './FamilyApprovals.js';

const mockInvalidate = jest.fn();
jest.mock('@tanstack/react-query', () => {
  const actual = jest.requireActual<typeof import('@tanstack/react-query')>(
    '@tanstack/react-query',
  );
  return {
    ...actual,
    useQueryClient: () => ({invalidateQueries: mockInvalidate}),
  };
});

jest.mock('../hooks/useUser', () => ({
  useUser: jest.fn(() => ({user: {id: 1, role: 'user'}})),
}));

jest.mock('../lib/api', () => {
  const upsert = jest.fn(async () => ({success: true}));
  const listForDay = jest.fn(async () => ({
    success: true,
    data: [
      {
        chore_id: 1,
        title: 'Take out trash',
        status: 'complete',
        approval_status: 'unapproved',
        notes: '',
      },
      {
        chore_id: 2,
        title: 'Clean room',
        status: 'complete',
        approval_status: 'approved',
        notes: 'done',
      },
    ],
  }));
  return {choreInstancesApi: {listForDay, upsert}};
});

describe('familyApprovals page', () => {
  test('shows only completed unapproved instances with Approve/Reject', async () => {
    render(<FamilyApprovals />, {
      wrapper: createWrapper({i18n: true, queryClient: true, router: true}),
    });

    await expect(
      screen.findByText('Approve completed chores'),
    ).resolves.toBeInTheDocument();

    // Shows unapproved completed chore
    expect(screen.getByText('Take out trash')).toBeInTheDocument();
    // Approved one should not show actions
    expect(screen.queryByText('Clean room')).not.toBeInTheDocument();

    const approveBtn = await screen.findByRole('button', {name: 'Approve'});
    const rejectBtn = await screen.findByRole('button', {name: 'Reject'});
    expect(approveBtn).toBeInTheDocument();
    expect(rejectBtn).toBeInTheDocument();
  });

  test('clicking Approve calls upsert with approved status', async () => {
    render(<FamilyApprovals />, {
      wrapper: createWrapper({i18n: true, queryClient: true, router: true}),
    });
    const user = userEvent.setup();
    await screen.findByText('Approve completed chores');
    const approveBtn = await screen.findByRole('button', {name: 'Approve'});
    await user.click(approveBtn);
    const {choreInstancesApi} = jest.mocked(await import('../lib/api.js'));
    expect(choreInstancesApi.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        chore_id: 1,
        approval_status: 'approved',
        date: expect.any(String),
      }),
    );
  });

  test('clicking Reject calls upsert with rejected status', async () => {
    render(<FamilyApprovals />, {
      wrapper: createWrapper({i18n: true, queryClient: true, router: true}),
    });
    const user = userEvent.setup();
    await screen.findByText('Approve completed chores');
    const rejectBtn = await screen.findByRole('button', {name: 'Reject'});
    await user.click(rejectBtn);
    const {choreInstancesApi} = jest.mocked(await import('../lib/api.js'));
    expect(choreInstancesApi.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        chore_id: 1,
        approval_status: 'rejected',
        date: expect.any(String),
      }),
    );
  });

  test('invalidates chores queries after approve/reject', async () => {
    render(<FamilyApprovals />, {
      wrapper: createWrapper({i18n: true, queryClient: true, router: true}),
    });
    const user = userEvent.setup();
    await screen.findByText('Approve completed chores');
    mockInvalidate.mockClear();
    await user.click(await screen.findByRole('button', {name: 'Approve'}));
    expect(mockInvalidate).toHaveBeenCalledWith({
      queryKey: ['chore-instances'],
    });
  });
});
