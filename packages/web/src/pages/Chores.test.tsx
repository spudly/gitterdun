import {describe, expect, jest, test} from '@jest/globals';
import {render, screen, fireEvent} from '@testing-library/react';
import Chores from './Chores';
import {createWrapper} from '../test/createWrapper';

const mockInvalidate = jest.fn();
jest.mock('@tanstack/react-query', () => {
  const actual = jest.requireActual('@tanstack/react-query');
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
        status: 'incomplete',
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

describe('chores page', () => {
  test('renders header', async () => {
    render(<Chores />, {
      wrapper: createWrapper({i18n: true, queryClient: true, router: true}),
    });
    await expect(screen.findByText('Chores')).resolves.toBeInTheDocument();
  });

  test('defaults to hide completed and toggles to show', async () => {
    render(<Chores />, {
      wrapper: createWrapper({i18n: true, queryClient: true, router: true}),
    });

    await expect(screen.findByText('Chores')).resolves.toBeInTheDocument();
    expect(screen.getByText('Take out trash')).toBeInTheDocument();
    expect(screen.queryByText('Clean room')).not.toBeInTheDocument();

    const toggle = await screen.findByLabelText('Hide completed');
    fireEvent.click(toggle);
    await expect(screen.findByText('Clean room')).resolves.toBeInTheDocument();
  });

  test('shows Complete button and calls upsert on click', async () => {
    render(<Chores />, {
      wrapper: createWrapper({i18n: true, queryClient: true, router: true}),
    });
    await expect(screen.findByText('Chores')).resolves.toBeInTheDocument();
    const completeBtn = await screen.findByRole('button', {name: 'Complete'});
    fireEvent.click(completeBtn);
    const {choreInstancesApi} = require('../lib/api');
    expect(choreInstancesApi.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        chore_id: 1,
        status: 'complete',
        date: expect.any(String),
      }),
    );
  });

  test('invalidates chore-instances queries after completion', async () => {
    render(<Chores />, {
      wrapper: createWrapper({i18n: true, queryClient: true, router: true}),
    });
    const completeBtn = await screen.findByRole('button', {name: 'Complete'});
    fireEvent.click(completeBtn);
    // Wait a tick for async
    await screen.findByText('Chores');
    expect(mockInvalidate).toHaveBeenCalledWith({
      queryKey: ['chore-instances'],
    });
  });
});
