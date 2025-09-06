import {describe, expect, jest, test} from '@jest/globals';
import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {FamilySelector} from './FamilySelector.js';
import {createWrapper} from '../../test/createWrapper.js';

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
    ).toHaveTextContent('Choose a family');
    expect(screen.getByRole('button', {name: 'Create'})).toBeEnabled();
    expect(screen.getByPlaceholderText('New family name')).toBeVisible();
  });

  test('selects a family and creates when valid', async () => {
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

    await userEvent.selectOptions(screen.getByRole('combobox'), '2');
    expect(onFamilySelect).toHaveBeenCalledWith(2);

    await userEvent.click(screen.getByRole('button', {name: 'Create'}));
    expect(onCreateFamily).toHaveBeenCalledWith();
  });
});
