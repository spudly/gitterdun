import {describe, expect, test} from '@jest/globals';
import {render, screen, within} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {createWrapper} from '../test/createWrapper.js';
import Settings from './Settings.js';

describe('settings', () => {
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

  test('does not duplicate language when native and intl names match', () => {
    const Wrapper = createWrapper({
      i18n: true,
      router: {initialEntries: ['/settings']},
    });
    render(<Settings />, {wrapper: Wrapper});
    const select = screen.getByRole('combobox', {name: /language/i});
    // English option should render as just "English" (no parentheses)
    expect(
      within(select).getByRole('option', {name: /^English$/u}),
    ).toBeInTheDocument();
  });
});
