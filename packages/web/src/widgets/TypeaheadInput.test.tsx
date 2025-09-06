import {describe, expect, jest, test} from '@jest/globals';
import {render, screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {TypeaheadInput} from './TypeaheadInput.js';

describe('typeaheadInput', () => {
  test('filters and selects options', async () => {
    const user = userEvent.setup();
    const options = ['UTC', 'America/New_York', 'Europe/London'];
    const onChange = jest.fn();
    render(
      <TypeaheadInput
        id="tz"
        onChange={onChange}
        options={options}
        placeholder="Search timezone"
        value=""
      />,
    );
    const input = screen.getByRole('combobox');
    await user.click(input);
    await user.type(input, 'new');
    const opt = await screen.findByText('America/New_York');
    await user.click(opt);
    expect(onChange).toHaveBeenCalledWith('America/New_York');
  });

  test('limits to 20 suggestions when query is empty', async () => {
    const user = userEvent.setup();
    const options = Array.from(
      {length: 100},
      (_unused, index) => `Option ${index + 1}`,
    );
    render(<TypeaheadInput id="typeahead" options={options} value="" />);
    const input = screen.getByRole('combobox');
    await user.click(input);
    await waitFor(() => {
      expect(screen.getAllByRole('button')).toHaveLength(20);
    });
  });

  test('limits to 50 suggestions when query is non-empty', async () => {
    const user = userEvent.setup();
    const options = Array.from(
      {length: 200},
      (_unused, index) => `a-${index + 1}`,
    );
    render(<TypeaheadInput id="typeahead" options={options} value="" />);
    const input = screen.getByRole('combobox');
    await user.click(input);
    await user.type(input, 'a');
    await waitFor(() => {
      expect(screen.getAllByRole('button')).toHaveLength(50);
    });
  });
});
