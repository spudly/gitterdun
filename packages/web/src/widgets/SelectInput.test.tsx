import {describe, expect, jest, test} from '@jest/globals';
import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {SelectInput} from './SelectInput.js';

describe('selectInput', () => {
  test('changes and shows error', async () => {
    const onChange = jest.fn();
    render(
      <SelectInput defaultValue="" error="bad" onChange={onChange}>
        <option value="">-</option>

        <option value="a">A</option>
      </SelectInput>,
    );
    await userEvent.selectOptions(screen.getByRole('combobox'), 'a');
    expect(onChange).toHaveBeenCalledWith('a', expect.any(Object));
    expect(screen.getByText('bad')).toHaveTextContent('bad');
    const select = screen.getByRole('combobox');
    expect(select).toHaveClass('border-red-500');
  });

  test('uses default border class when no error', () => {
    render(
      <SelectInput defaultValue="">
        <option value="">-</option>

        <option value="a">A</option>
      </SelectInput>,
    );
    const select = screen.getByRole('combobox');
    expect(select).toHaveClass('border-gray-300');
  });
});
