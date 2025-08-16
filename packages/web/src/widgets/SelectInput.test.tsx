import {describe, expect, jest, test} from '@jest/globals';
import {render, screen, fireEvent} from '@testing-library/react';
import {SelectInput} from './SelectInput';

describe('selectInput', () => {
  test('changes and shows error', () => {
    const onChange = jest.fn();
    render(
      <SelectInput defaultValue="" error="bad" onChange={onChange}>
        <option value="">-</option>

        <option value="a">A</option>
      </SelectInput>,
    );
    fireEvent.change(screen.getByDisplayValue('-'), {target: {value: 'a'}});
    expect(onChange).toHaveBeenCalledWith('a', expect.any(Object));
    expect(screen.getByText('bad')).toBeInTheDocument();
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
