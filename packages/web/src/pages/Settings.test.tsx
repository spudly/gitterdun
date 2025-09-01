import {describe, expect, test} from '@jest/globals';
import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {createWrapper} from '../test/createWrapper';
import Settings from './Settings';

describe('Settings', () => {
  test('renders locale select and changes locale', async () => {
    const Wrapper = createWrapper({
      i18n: true,
      router: {initialEntries: ['/settings']},
    });
    render(<Settings />, {wrapper: Wrapper});

    const select = screen.getByRole('combobox', {name: /language/i});
    expect(select).toBeInTheDocument();

    await userEvent.selectOptions(select, 'fr');
    expect((select as HTMLSelectElement).value).toBe('fr');
  });
});
