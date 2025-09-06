import {describe, expect, jest, test} from '@jest/globals';
import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {CreateChildForm} from './CreateChildForm.js';
import {createWrapper} from '../../test/createWrapper.js';

describe('<CreateChildForm />', () => {
  test('renders header, placeholders and button label', () => {
    const handleCreateChild = jest.fn();
    const Wrapper = createWrapper({i18n: true});
    render(
      <CreateChildForm
        handleCreateChild={handleCreateChild}
        selectedFamilyId={1}
      />,
      {wrapper: Wrapper},
    );

    expect(screen.getByText('Create Child Account')).toHaveTextContent(
      'Create Child Account',
    );
    expect(screen.getByPlaceholderText('Username')).toBeVisible();
    expect(screen.getByPlaceholderText('Email')).toBeVisible();
    expect(screen.getByPlaceholderText('Password')).toBeVisible();
    expect(screen.getByRole('button', {name: 'Create'})).toBeVisible();
  });

  test('submits when valid and clears inputs', async () => {
    const handleCreateChild = jest.fn();
    const Wrapper2 = createWrapper({i18n: true});
    render(
      <CreateChildForm
        handleCreateChild={handleCreateChild}
        selectedFamilyId={5}
      />,
      {wrapper: Wrapper2},
    );

    await userEvent.type(screen.getByPlaceholderText('Username'), 'kid');
    await userEvent.type(
      screen.getByPlaceholderText('Email'),
      'kid@example.com',
    );
    await userEvent.type(screen.getByPlaceholderText('Password'), 'p@ss');
    await userEvent.click(screen.getByRole('button', {name: 'Create'}));

    expect(handleCreateChild).toHaveBeenCalledWith({
      familyId: 5,
      username: 'kid',
      email: 'kid@example.com',
      password: 'p@ss',
    });
  });

  test('does not submit with invalid email', async () => {
    const handleCreateChild = jest.fn();
    const Wrapper = createWrapper({i18n: true});
    render(
      <CreateChildForm
        handleCreateChild={handleCreateChild}
        selectedFamilyId={1}
      />,
      {wrapper: Wrapper},
    );

    await userEvent.type(screen.getByPlaceholderText('Username'), 'kid');
    await userEvent.type(screen.getByPlaceholderText('Email'), 'not-an-email');
    await userEvent.type(screen.getByPlaceholderText('Password'), 'secr');
    await userEvent.click(screen.getByRole('button', {name: 'Create'}));

    expect(handleCreateChild).not.toHaveBeenCalled();
  });

  test('does not submit with short password', async () => {
    const handleCreateChild = jest.fn();
    const Wrapper = createWrapper({i18n: true});
    render(
      <CreateChildForm
        handleCreateChild={handleCreateChild}
        selectedFamilyId={1}
      />,
      {wrapper: Wrapper},
    );

    await userEvent.type(screen.getByPlaceholderText('Username'), 'kid');
    await userEvent.type(
      screen.getByPlaceholderText('Email'),
      'kid@example.com',
    );
    await userEvent.type(screen.getByPlaceholderText('Password'), '123');
    await userEvent.click(screen.getByRole('button', {name: 'Create'}));

    expect(handleCreateChild).not.toHaveBeenCalled();
  });
});
