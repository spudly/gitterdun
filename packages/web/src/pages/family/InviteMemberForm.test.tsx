import {describe, expect, jest, test} from '@jest/globals';
import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {InviteMemberForm} from './InviteMemberForm';
import {createWrapper} from '../../test/createWrapper';

describe('<InviteMemberForm />', () => {
  test('renders labels, placeholders, and options', () => {
    const handleInviteMember = jest.fn();
    const Wrapper = createWrapper({i18n: true});
    render(
      <InviteMemberForm
        handleInviteMember={handleInviteMember}
        selectedFamilyId={1}
      />,
      {wrapper: Wrapper},
    );

    expect(screen.getByText('Invite Member')).toHaveTextContent(
      'Invite Member',
    );
    expect(screen.getByPlaceholderText('Email')).toBeVisible();
    expect(screen.getByRole('option', {name: 'Parent'})).toHaveTextContent(
      'Parent',
    );
    expect(screen.getByRole('option', {name: 'Child'})).toHaveTextContent(
      'Child',
    );
    expect(screen.getByRole('button', {name: 'Send'})).toBeEnabled();
  });

  test('submits when valid and clears input', async () => {
    const handleInviteMember = jest.fn();
    const Wrapper2 = createWrapper({i18n: true});
    render(
      <InviteMemberForm
        handleInviteMember={handleInviteMember}
        selectedFamilyId={2}
      />,
      {wrapper: Wrapper2},
    );

    await userEvent.type(
      screen.getByPlaceholderText('Email'),
      'abc@example.com',
    );
    await userEvent.click(screen.getByRole('button', {name: 'Send'}));

    expect(handleInviteMember).toHaveBeenCalledWith({
      familyId: 2,
      email: 'abc@example.com',
      role: 'parent',
    });
  });
});
