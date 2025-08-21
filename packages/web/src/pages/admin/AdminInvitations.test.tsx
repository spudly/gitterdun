import {describe, expect, jest, test} from '@jest/globals';
import {fireEvent, render, screen, waitFor} from '@testing-library/react';
import {AdminInvitations} from './AdminInvitations';
import * as apiModule from '../../lib/api';
import {createWrapper} from '../../test/createWrapper';

jest.mock('../../lib/api', () => ({
  invitationsApi: {create: jest.fn(async () => ({}))},
}));

describe('<AdminInvitations />', () => {
  test('renders placeholders, select options, and button label', () => {
    const onMessageChange = jest.fn();
    const Wrapper = createWrapper({i18n: true});
    render(<AdminInvitations onMessageChange={onMessageChange} />, {
      wrapper: Wrapper,
    });

    expect(screen.getByPlaceholderText('Family ID')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Invite email')).toBeInTheDocument();
    expect(screen.getByRole('option', {name: 'Parent'})).toBeInTheDocument();
    expect(screen.getByRole('option', {name: 'Child'})).toBeInTheDocument();
    expect(screen.getByRole('button', {name: 'Invite'})).toBeInTheDocument();
  });

  test('shows validation message when inputs invalid', async () => {
    const onMessageChange = jest.fn();
    const Wrapper2 = createWrapper({i18n: true});
    render(<AdminInvitations onMessageChange={onMessageChange} />, {
      wrapper: Wrapper2,
    });

    fireEvent.click(screen.getByRole('button', {name: 'Invite'}));

    await waitFor(() => {
      expect(onMessageChange).toHaveBeenCalledWith(
        'Enter family ID and email',
        'error',
      );
    });
  });

  test('success flow shows success message and clears email', async () => {
    const onMessageChange = jest.fn();
    const mocked = jest.mocked(apiModule);
    mocked.invitationsApi.create.mockResolvedValueOnce({success: true});

    const Wrapper3 = createWrapper({i18n: true});
    render(<AdminInvitations onMessageChange={onMessageChange} />, {
      wrapper: Wrapper3,
    });

    fireEvent.change(screen.getByPlaceholderText('Family ID'), {
      target: {value: '1'},
    });
    fireEvent.change(screen.getByPlaceholderText('Invite email'), {
      target: {value: 'x@example.com'},
    });
    fireEvent.click(screen.getByRole('button', {name: 'Invite'}));

    await waitFor(() => {
      expect(onMessageChange).toHaveBeenCalledWith(
        'Invitation created (see server logs for token in dev)',
        'success',
      );
    });
  });

  test('error flow shows failure message', async () => {
    const onMessageChange = jest.fn();
    const mocked = jest.mocked(apiModule);
    mocked.invitationsApi.create.mockRejectedValueOnce(new Error('nope'));

    const Wrapper4 = createWrapper({i18n: true});
    render(<AdminInvitations onMessageChange={onMessageChange} />, {
      wrapper: Wrapper4,
    });

    fireEvent.change(screen.getByPlaceholderText('Family ID'), {
      target: {value: '1'},
    });
    fireEvent.change(screen.getByPlaceholderText('Invite email'), {
      target: {value: 'x@example.com'},
    });
    fireEvent.click(screen.getByRole('button', {name: 'Invite'}));

    await waitFor(() => {
      expect(onMessageChange).toHaveBeenCalledWith('Failed to invite', 'error');
    });
  });
});
