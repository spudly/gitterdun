import {render, screen} from '@testing-library/react';
import {FormField} from './FormField';

describe('FormField', () => {
  it('renders label, required, help and error', () => {
    render(
      <FormField
        label="Email"
        htmlFor="email"
        required
        helpText="help"
        error="err"
      >
        <input id="email" />
      </FormField>,
    );
    expect(screen.getByText('Email')).toBeInTheDocument();
    expect(screen.getByText('*')).toBeInTheDocument();
    expect(screen.getByText('help')).toBeInTheDocument();
    expect(screen.getByRole('alert')).toHaveTextContent('err');
  });

  it('renders without optional props', () => {
    render(
      <FormField label="Name" htmlFor="name">
        <input id="name" />
      </FormField>,
    );
    expect(screen.getByText('Name')).toBeInTheDocument();
  });
});
