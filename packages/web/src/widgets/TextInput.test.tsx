import {render, screen, fireEvent} from '@testing-library/react';
import {TextInput} from './TextInput';
import {FormField} from './FormField';
import type {ChangeEvent} from 'react';

describe('TextInput', () => {
  it('handles change, icons and error', () => {
    const onChange = jest.fn<
      undefined,
      [string, ChangeEvent<HTMLInputElement>]
    >();
    const {rerender} = render(
      <TextInput onChange={onChange} placeholder="p" value="" />,
    );
    fireEvent.change(screen.getByPlaceholderText('p'), {target: {value: 'x'}});
    expect(onChange).toHaveBeenCalledWith('x', expect.any(Object));
    rerender(
      <TextInput
        error="err"
        leftIcon={<span>L</span>}
        rightIcon={<span>R</span>}
        value=""
      />,
    );
    expect(screen.getByText('err')).toBeInTheDocument();
  });

  it('works with FormField', () => {
    render(
      <FormField error="E" helpText="H" htmlFor="f" label="L" required>
        <TextInput id="f" />
      </FormField>,
    );
    expect(screen.getByLabelText(/l/i)).toBeInTheDocument();
    expect(screen.getByText('H')).toBeInTheDocument();
    expect(screen.getByText('E')).toBeInTheDocument();
  });
});
