import {describe, expect, jest, test} from '@jest/globals';
import {render, screen} from '@testing-library/react';
import Chores from './Chores';
import * as apiModule from '../lib/api';
import {createWrapper} from '../test/createWrapper';

jest.mock('../hooks/useUser', () => ({useUser: () => ({user: {id: 1}})}));

jest.mock('../lib/api', () => ({
  choresApi: {
    getAll: jest.fn(async () => ({
      success: true,
      data: [
        {
          id: 1,
          title: 'A',
          description: 'd',
          point_reward: 1,
          bonus_points: 0,
          penalty_points: 0,
          chore_type: 'bonus',
          status: 'completed',
          created_by: 1,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ],
    })),
    complete: jest.fn(async () => ({success: true})),
  },
}));

describe('chores page', () => {
  test('renders header', async () => {
    render(<Chores />, {
      wrapper: createWrapper({i18n: true, queryClient: true}),
    });
    await expect(screen.findByText('Chores')).resolves.toBeInTheDocument();
  });

  test('renders approved and pending rows; shows Complete button for pending', async () => {
    const mocked = jest.mocked(apiModule);
    mocked.choresApi.getAll.mockResolvedValueOnce({
      success: true,
      data: [
        {
          id: 2,
          title: 'B',
          description: '',
          point_reward: 2,
          bonus_points: 1,
          penalty_points: 0,
          chore_type: 'regular',
          status: 'approved',
          created_by: 1,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: 3,
          title: 'C',
          description: '',
          point_reward: 3,
          bonus_points: 0,
          penalty_points: 0,
          chore_type: 'regular',
          status: 'pending',
          created_by: 1,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ],
    });
    render(<Chores />, {
      wrapper: createWrapper({i18n: true, queryClient: true}),
    });
    await expect(screen.findByText('Chores')).resolves.toBeInTheDocument();
    // Approved row text
    await expect(screen.findByText('Approved')).resolves.toBeInTheDocument();
    // Pending row should show Complete button
    await expect(
      screen.findByRole('button', {name: 'Complete'}),
    ).resolves.toBeInTheDocument();
    // Meta shows points and bonus
    await expect(screen.findByText('Points: 2')).resolves.toBeInTheDocument();
    await expect(screen.findByText('Bonus: +1')).resolves.toBeInTheDocument();
  });

  test('shows Approve/Reject for completed chores (user-level)', async () => {
    const mocked = jest.mocked(apiModule);
    mocked.choresApi.getAll.mockResolvedValueOnce({
      success: true,
      data: [
        {
          id: 5,
          title: 'Completed Chore',
          description: '',
          point_reward: 5,
          bonus_points: 1,
          penalty_points: 0,
          chore_type: 'bonus',
          status: 'completed',
          created_by: 1,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ],
    });
    render(<Chores />, {
      wrapper: createWrapper({i18n: true, queryClient: true}),
    });

    await expect(screen.findByText('Chores')).resolves.toBeInTheDocument();
    await expect(
      screen.findByRole('button', {name: 'Approve'}),
    ).resolves.toBeInTheDocument();
    await expect(
      screen.findByRole('button', {name: 'Reject'}),
    ).resolves.toBeInTheDocument();
    await expect(screen.findByText('Bonus: +1')).resolves.toBeInTheDocument();
  });

  test('renders penalty and due date meta when present', async () => {
    const mocked = jest.mocked(apiModule);
    mocked.choresApi.getAll.mockResolvedValueOnce({
      success: true,
      data: [
        {
          id: 4,
          title: 'D',
          description: '',
          point_reward: 4,
          bonus_points: 0,
          penalty_points: 2,
          chore_type: 'regular',
          status: 'approved',
          due_date: new Date().toISOString(),
          created_by: 1,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ],
    });
    render(<Chores />, {
      wrapper: createWrapper({i18n: true, queryClient: true}),
    });
    await expect(screen.findByText('Chores')).resolves.toBeInTheDocument();
    await expect(screen.findByText('Penalty: -2')).resolves.toBeInTheDocument();
    // We don't assert the exact date string; just ensure the label appears
    await expect(screen.findByText(/Due:/)).resolves.toBeInTheDocument();
  });

  test('clicking Complete calls API and updates status to Completed', async () => {
    const mocked = jest.mocked(apiModule);
    mocked.choresApi.getAll.mockResolvedValueOnce({
      success: true,
      data: [
        {
          id: 10,
          title: 'Do it',
          description: '',
          point_reward: 7,
          bonus_points: 0,
          penalty_points: 0,
          chore_type: 'regular',
          status: 'pending',
          created_by: 1,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ],
    });

    render(<Chores />, {
      wrapper: createWrapper({i18n: true, queryClient: true}),
    });

    const completeBtn = await screen.findByRole('button', {name: 'Complete'});
    completeBtn.click();

    expect(mocked.choresApi.complete).toHaveBeenCalledWith(10, {userId: 1});

    await expect(screen.findByText('Completed')).resolves.toBeInTheDocument();
  });
});
