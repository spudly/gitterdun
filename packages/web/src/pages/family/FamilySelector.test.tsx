import {describe, expect, jest, test} from '@jest/globals';
import {fireEvent, render, screen} from '@testing-library/react';
import {FamilySelector} from './FamilySelector';
import {createWrapper} from '../../test/createWrapper';

describe('<FamilySelector />', () => {
  const families = [
    {id: 1, name: 'One'},
    {id: 2, name: 'Two'},
  ];

  test('renders option label and placeholder, button, and input placeholder', () => {
    const onFamilySelect = jest.fn();
    const onNewFamilyNameChange = jest.fn();
    const onCreateFamily = jest.fn();
    render(
      <FamilySelector
        families={families}
        newFamilyName=""
        onCreateFamily={onCreateFamily}
        onFamilySelect={onFamilySelect}
        onNewFamilyNameChange={onNewFamilyNameChange}
        selectedFamilyId={null}
      />,
      {wrapper: createWrapper({i18n: true})},
    );

    expect(
      screen.getByRole('option', {name: 'Choose a family'}),
    ).toBeInTheDocument();
    expect(screen.getByRole('button', {name: 'Create'})).toBeInTheDocument();
    expect(screen.getByPlaceholderText('New family name')).toBeInTheDocument();
  });

  test('selects a family and creates when valid', () => {
    const onFamilySelect = jest.fn();
    const onNewFamilyNameChange = jest.fn();
    const onCreateFamily = jest.fn();
    render(
      <FamilySelector
        families={families}
        newFamilyName="New Fam"
        onCreateFamily={onCreateFamily}
        onFamilySelect={onFamilySelect}
        onNewFamilyNameChange={onNewFamilyNameChange}
        selectedFamilyId={null}
      />,
      {wrapper: createWrapper({i18n: true})},
    );

    fireEvent.change(screen.getByRole('combobox'), {target: {value: '2'}});
    expect(onFamilySelect).toHaveBeenCalledWith(2);

    fireEvent.click(screen.getByRole('button', {name: 'Create'}));
    expect(onCreateFamily).toHaveBeenCalledWith();
  });
});
