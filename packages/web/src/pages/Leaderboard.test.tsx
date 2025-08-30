import {describe, expect, jest, test} from '@jest/globals';
import {render, screen} from '@testing-library/react';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import Leaderboard from './Leaderboard';
import * as apiModule from '../lib/api';
import {createWrapper} from '../test/createWrapper';

jest.mock('../lib/api', () => ({
  leaderboardApi: {
    get: jest.fn(async () => ({
      success: true,
      data: {
        leaderboard: [
          {
            rank: 1,
            id: 1,
            username: 'U1',
            points: 10,
            streak_count: 2,
            badges_earned: 1,
            chores_completed: 3,
          },
          {
            rank: 2,
            id: 2,
            username: 'U2',
            points: 5,
            streak_count: 1,
            badges_earned: 0,
            chores_completed: 1,
          },
        ],
        sortBy: 'points',
        totalUsers: 2,
      },
    })),
  },
}));

const wrap = (ui: React.ReactElement) => (
  <QueryClientProvider client={new QueryClient()}>{ui}</QueryClientProvider>
);

describe('leaderboard page', () => {
  test('renders header', async () => {
    const Wrapper = createWrapper({i18n: true, queryClient: true});
    render(wrap(<Leaderboard />), {wrapper: Wrapper});
    await expect(screen.findByText('Leaderboard')).resolves.toBeInTheDocument();
  });

  test('renders podium and ranking list content', async () => {
    const Wrapper2 = createWrapper({i18n: true, queryClient: true});
    render(wrap(<Leaderboard />), {wrapper: Wrapper2});
    const headings = await screen.findAllByText('U1');
    expect(headings.length).toBeGreaterThan(0);
    expect(screen.getAllByText('U2').length).toBeGreaterThan(0);
  });

  test('exposes test ids for e2e: leaderboard and members', async () => {
    const Wrapper = createWrapper({i18n: true, queryClient: true});
    render(wrap(<Leaderboard />), {wrapper: Wrapper});

    const board = await screen.findByTestId('leaderboard');
    expect(board).toBeInTheDocument();

    const members = await screen.findAllByTestId('leaderboard-member');
    expect(members.length).toBeGreaterThan(0);
  });

  test('shows streak-based subtitle when sortBy is streak_count', async () => {
    const {leaderboardApi} = jest.mocked(apiModule);
    leaderboardApi.get.mockResolvedValueOnce({
      success: true,
      data: {
        leaderboard: [
          {
            rank: 1,
            id: 1,
            username: 'U1',
            points: 10,
            streak_count: 4,
            badges_earned: 1,
            chores_completed: 3,
          },
        ],
        sortBy: 'streak_count',
        totalUsers: 1,
      },
    });
    const Wrapper3 = createWrapper({i18n: true, queryClient: true});
    render(wrap(<Leaderboard />), {wrapper: Wrapper3});
    await expect(
      screen.findByText(/Sorted by streak count/u),
    ).resolves.toBeInTheDocument();
  });
});
