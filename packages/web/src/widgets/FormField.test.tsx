import {describe, expect, test} from '@jest/globals';
import {render, screen} from '@testing-library/react';
import {FormField} from './FormField';

describe('formField', () => {
  test('renders label, required, help and error', () => {
    render(
      <FormField
        error="err"
        helpText="help"
        htmlFor="email"
        label="Email"
        required
      >
        <input id="email" />
      </FormField>,
    );
    expect(screen.getByText('Email')).toHaveTextContent('Email');
    expect(screen.getByText('*')).toHaveTextContent('*');
    expect(screen.getByText('help')).toHaveTextContent('help');
    expect(screen.getByRole('alert')).toHaveTextContent('err');
  });

  test('renders without optional props', () => {
    render(
      <FormField htmlFor="name" label="Name">
        <input id="name" />
      </FormField>,
    );
    expect(screen.getByText('Name')).toHaveTextContent('Name');
  });
});
