import {render, screen, fireEvent} from '@testing-library/react';
import {SelectInput} from './SelectInput';

describe('SelectInput', () => {
  it('changes and shows error', () => {
    const onChange = jest.fn();
    render(
      <SelectInput onChange={v => onChange(v)} error="bad" defaultValue="">
        <option value="">-</option>
        <option value="a">A</option>
      </SelectInput>,
    );
    fireEvent.change(screen.getByDisplayValue('-'), {target: {value: 'a'}});
    expect(onChange).toHaveBeenCalledWith('a');
    expect(screen.getByText('bad')).toBeInTheDocument();
    const select = screen.getByRole('combobox');
    expect(select).toHaveClass('border-red-500');
  });

  it('uses default border class when no error', () => {
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
