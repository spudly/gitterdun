import {describe, expect, jest, test} from '@jest/globals';
import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {TextInput} from './TextInput';
import {FormField} from './FormField';
import type {ChangeEvent} from 'react';

describe('textInput', () => {
  test('handles change, icons and error', async () => {
    const onChange =
      jest.fn<(value: string, event: ChangeEvent<HTMLInputElement>) => void>();
    const {rerender} = render(
      <TextInput onChange={onChange} placeholder="p" value="" />,
    );
    await userEvent.type(screen.getByPlaceholderText('p'), 'x');
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

  test('works with FormField', () => {
    render(
      <FormField error="E" helpText="H" htmlFor="f" label="L" required>
        <TextInput id="f" />
      </FormField>,
    );
    expect(screen.getByLabelText(/l/iu)).toBeInTheDocument();
    expect(screen.getByText('H')).toBeInTheDocument();
    expect(screen.getByText('E')).toBeInTheDocument();
  });
});
