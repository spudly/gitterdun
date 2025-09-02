import {describe, expect, jest, test} from '@jest/globals';
import {QueryClient} from '@tanstack/react-query';
import {render, screen} from '@testing-library/react';
import {createWrapper} from '../../test/createWrapper';
import Family from '../Family';
import * as apiModule from '../../lib/api';

jest.mock('../../hooks/useUser', () => ({
  useUser: jest.fn(() => ({user: {id: 1, role: 'user'}})),
}));

jest.mock('../../lib/api', () => {
  return {
    choresApi: {
      getAll: jest.fn(async () => ({
        success: true,
        data: [
          {
            id: 1,
            title: 'Take out trash',
            description: '',
            reward_points: 3,
            penalty_points: 0,
            chore_type: 'required',
            status: 'pending',
            created_by: 1,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ],
      })),
    },
    familiesApi: {
      myFamily: jest.fn(async () => ({
        success: true,
        data: {
          id: 10,
          name: 'Fam',
          owner_id: 1,
          created_at: new Date().toISOString(),
        },
      })),
      listMembers: jest.fn(async () => ({success: true, data: []})),
    },
  };
});

describe('Family page chores management', () => {
  test('shows a Chores section with Add Chore link for family owner', async () => {
    const client = new QueryClient();
    client.setQueryData(['family', 'mine', 1], {
      success: true,
      data: {
        id: 10,
        name: 'Fam',
        owner_id: 1,
        created_at: new Date().toISOString(),
      },
    });
    client.setQueryData(['family', 10, 'members'], {success: true, data: []});

    render(<Family />, {
      wrapper: createWrapper({i18n: true, queryClient: {client}, router: true}),
    });

    await expect(screen.findByText('Chores')).resolves.toBeInTheDocument();
    const addLink = await screen.findByRole('link', {name: 'Add Chore'});
    expect(addLink).toHaveAttribute('href', '/family/chores/new');
  });

  test('lists chores within the Family page', async () => {
    const client = new QueryClient();
    client.setQueryData(['family', 'mine', 1], {
      success: true,
      data: {
        id: 10,
        name: 'Fam',
        owner_id: 1,
        created_at: new Date().toISOString(),
      },
    });
    client.setQueryData(['family', 10, 'members'], {success: true, data: []});

    render(<Family />, {
      wrapper: createWrapper({i18n: true, queryClient: {client}, router: true}),
    });

    await expect(
      screen.findByText('Take out trash'),
    ).resolves.toBeInTheDocument();
  });
});
