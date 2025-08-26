import {describe, expect, jest, test} from '@jest/globals';
import {fireEvent, render, screen} from '@testing-library/react';
import {CreateChildForm} from './CreateChildForm';
import {createWrapper} from '../../test/createWrapper';

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

    expect(screen.getByText('Create Child Account')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Username')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', {name: 'Create'})).toBeInTheDocument();
  });

  test('submits when valid and clears inputs', () => {
    const handleCreateChild = jest.fn();
    const Wrapper2 = createWrapper({i18n: true});
    render(
      <CreateChildForm
        handleCreateChild={handleCreateChild}
        selectedFamilyId={5}
      />,
      {wrapper: Wrapper2},
    );

    fireEvent.change(screen.getByPlaceholderText('Username'), {
      target: {value: 'kid'},
    });
    fireEvent.change(screen.getByPlaceholderText('Email'), {
      target: {value: 'kid@example.com'},
    });
    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: {value: 'p@ss'},
    });
    fireEvent.click(screen.getByRole('button', {name: 'Create'}));

    expect(handleCreateChild).toHaveBeenCalledWith({
      familyId: 5,
      username: 'kid',
      email: 'kid@example.com',
      password: 'p@ss',
    });
  });

  test('does not submit with invalid email', () => {
    const handleCreateChild = jest.fn();
    const Wrapper = createWrapper({i18n: true});
    render(
      <CreateChildForm
        handleCreateChild={handleCreateChild}
        selectedFamilyId={1}
      />,
      {wrapper: Wrapper},
    );

    fireEvent.change(screen.getByPlaceholderText('Username'), {
      target: {value: 'kid'},
    });
    fireEvent.change(screen.getByPlaceholderText('Email'), {
      target: {value: 'not-an-email'},
    });
    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: {value: 'secr'},
    });
    fireEvent.click(screen.getByRole('button', {name: 'Create'}));

    expect(handleCreateChild).not.toHaveBeenCalled();
  });

  test('does not submit with short password', () => {
    const handleCreateChild = jest.fn();
    const Wrapper = createWrapper({i18n: true});
    render(
      <CreateChildForm
        handleCreateChild={handleCreateChild}
        selectedFamilyId={1}
      />,
      {wrapper: Wrapper},
    );

    fireEvent.change(screen.getByPlaceholderText('Username'), {
      target: {value: 'kid'},
    });
    fireEvent.change(screen.getByPlaceholderText('Email'), {
      target: {value: 'kid@example.com'},
    });
    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: {value: '123'},
    });
    fireEvent.click(screen.getByRole('button', {name: 'Create'}));

    expect(handleCreateChild).not.toHaveBeenCalled();
  });
});
