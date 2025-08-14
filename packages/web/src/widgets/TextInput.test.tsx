import {render, screen, fireEvent} from '@testing-library/react';
import {TextInput} from './TextInput';
import {FormField} from './FormField';

describe('TextInput', () => {
  it('handles change, icons and error', () => {
    const onChange = jest.fn();
    const {rerender} = render(
      <TextInput value="" onChange={v => onChange(v)} placeholder="p" />,
    );
    fireEvent.change(screen.getByPlaceholderText('p'), {target: {value: 'x'}});
    expect(onChange).toHaveBeenCalledWith('x');
    rerender(
      <TextInput
        value=""
        error="err"
        leftIcon={<span>L</span>}
        rightIcon={<span>R</span>}
      />,
    );
    expect(screen.getByText('err')).toBeInTheDocument();
  });

  it('works with FormField', () => {
    render(
      <FormField label="L" htmlFor="f" required helpText="H" error="E">
        <TextInput id="f" />
      </FormField>,
    );
    expect(screen.getByLabelText(/l/i)).toBeInTheDocument();
    expect(screen.getByText('H')).toBeInTheDocument();
    expect(screen.getByText('E')).toBeInTheDocument();
  });
});
