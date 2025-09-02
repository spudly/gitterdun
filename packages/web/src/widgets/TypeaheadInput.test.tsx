import {describe, expect, test} from '@jest/globals';
import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {TypeaheadInput} from './TypeaheadInput';

describe('TypeaheadInput', () => {
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
});
