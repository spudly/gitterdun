import {describe, expect, jest, test} from '@jest/globals';
import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {createWrapper} from '../test/createWrapper';

jest.mock('../hooks/useUser', () => ({
  useUser: jest.fn(() => ({user: {id: 1, role: 'user'}})),
}));

jest.mock('../lib/api', () => {
  return {
    choreInstancesApi: {
      listForDay: jest.fn(async () => ({
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
      })),
    },
  };
});

describe('/chores page - chore instances list', () => {
  test('defaults to hide completed and can toggle to show', async () => {
    const Page = (await import('./Chores')).default; // will render instances list now
    const user = userEvent.setup();
    render(<Page />, {
      wrapper: createWrapper({i18n: true, queryClient: true, router: true}),
    });

    // Header text remains Chores for instances view
    await expect(screen.findByText('Chores')).resolves.toBeInTheDocument();

    // By default, hide completed is ON, so only the incomplete item appears
    expect(screen.getByText('Take out trash')).toBeInTheDocument();
    expect(screen.queryByText('Clean room')).not.toBeInTheDocument();

    // Toggle to show completed
    const toggle = screen.getByLabelText('Hide completed');
    await user.click(toggle);

    await expect(screen.findByText('Clean room')).resolves.toBeInTheDocument();
  });
});
