import {describe, expect, jest, test} from '@jest/globals';
import {fireEvent, render, screen} from '@testing-library/react';
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

    expect(screen.getByText('Invite Member')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByRole('option', {name: 'Parent'})).toBeInTheDocument();
    expect(screen.getByRole('option', {name: 'Child'})).toBeInTheDocument();
    expect(screen.getByRole('button', {name: 'Send'})).toBeInTheDocument();
  });

  test('submits when valid and clears input', () => {
    const handleInviteMember = jest.fn();
    const Wrapper2 = createWrapper({i18n: true});
    render(
      <InviteMemberForm
        handleInviteMember={handleInviteMember}
        selectedFamilyId={2}
      />,
      {wrapper: Wrapper2},
    );

    fireEvent.change(screen.getByPlaceholderText('Email'), {
      target: {value: 'abc@example.com'},
    });
    fireEvent.click(screen.getByRole('button', {name: 'Send'}));

    expect(handleInviteMember).toHaveBeenCalledWith({
      familyId: 2,
      email: 'abc@example.com',
      role: 'parent',
    });
  });
});
