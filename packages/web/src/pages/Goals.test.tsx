import {describe, expect, jest, test} from '@jest/globals';
import {render, screen} from '@testing-library/react';
import {createWrapper} from '../test/createWrapper';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import Goals from './Goals';
import * as apiModule from '../lib/api';

const mockUseUser = jest.fn(() => ({user: {id: 1}}));
jest.mock('../hooks/useUser', () => ({useUser: () => mockUseUser()}));

jest.mock('../lib/api', () => ({
  goalsApi: {
    getAll: jest.fn(async () => ({
      success: true,
      data: [
        {
          id: 1,
          user_id: 1,
          title: 'G1',
          description: 'D',
          target_points: 10,
          current_points: 5,
          status: 'in_progress',
          created_at: '',
          updated_at: '',
        },
        {
          id: 2,
          user_id: 1,
          title: 'G2',
          target_points: 1,
          current_points: 1,
          status: 'completed',
          created_at: '',
          updated_at: '',
        },
      ],
    })),
  },
}));

const wrap = (ui: React.ReactElement) => {
  const Wrapper = createWrapper({i18n: true});
  return (
    <QueryClientProvider client={new QueryClient()}>
      <Wrapper>{ui}</Wrapper>
    </QueryClientProvider>
  );
};

describe('goals page', () => {
  test('renders header', async () => {
    render(wrap(<Goals />));
    await expect(screen.findByText('Goals')).resolves.toHaveTextContent(
      'Goals',
    );
  });

  test('covers completed, abandoned, and in_progress variants and empty state', async () => {
    const {goalsApi} = jest.mocked(apiModule);
    goalsApi.getAll.mockResolvedValueOnce({
      success: true,
      data: [
        {
          id: 10,
          user_id: 1,
          title: 'A',
          description: '',
          target_points: 10,
          current_points: 10,
          status: 'completed',
          created_at: '',
          updated_at: '',
        },
        {
          id: 11,
          user_id: 1,
          title: 'B',
          description: '',
          target_points: 5,
          current_points: 2,
          status: 'abandoned',
          created_at: '',
          updated_at: '',
        },
      ],
    });
    render(wrap(<Goals />));
    await expect(screen.findByText('A')).resolves.toHaveTextContent('A');
    expect(screen.getByText('B')).toHaveTextContent('B');

    // Empty state when no goals
    goalsApi.getAll.mockResolvedValueOnce({success: true, data: []});
    render(wrap(<Goals />));
    await expect(screen.findByText('No goals yet')).resolves.toHaveTextContent(
      'No goals yet',
    );
  });

  test('uses fallback empty data when user is null (covers queryFn else branch)', async () => {
    // @ts-expect-error: Testing null user fallback, type is intentionally invalid for test coverage
    mockUseUser.mockReturnValue({user: null});
    render(wrap(<Goals />));
    await expect(screen.findByText('No goals yet')).resolves.toHaveTextContent(
      'No goals yet',
    );
    expect(screen.getByText('No goals yet')).toHaveTextContent('No goals yet');
  });
});
