import {describe, expect, test} from '@jest/globals';
import {render, screen} from '@testing-library/react';
import {InputGroup} from './InputGroup.js';

describe('inputGroup', () => {
  test('renders help and error', () => {
    render(
      <InputGroup error="E" helpText="H">
        <input />
      </InputGroup>,
    );
    expect(screen.getByText('H')).toHaveTextContent('H');
    expect(screen.getByText('E')).toHaveTextContent('E');
  });

  test('renders input in horizontal layout', () => {
    render(
      <InputGroup layout="horizontal">
        <input />
      </InputGroup>,
    );
    expect(screen.getByRole('textbox')).toBeVisible();
  });
});
