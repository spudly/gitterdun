import {describe, expect, test} from '@jest/globals';
import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {LocaleSelector} from './LocaleSelector';
import {I18nProvider, useI18n} from '../i18n/I18nProvider';

const Wrapper: React.FC<{children: React.ReactNode}> = ({children}) => (
  <I18nProvider>{children}</I18nProvider>
);

describe('localeSelector', () => {
  test('opens menu and selects a locale', async () => {
    const user = userEvent.setup();
    const TestHost = () => {
      const {locale, setLocale} = useI18n();
      return (
        <div>
          <span aria-label="locale">{locale}</span>
          <LocaleSelector
            onChange={next => {
              setLocale(next);
            }}
            value={locale}
          />
        </div>
      );
    };

    render(<TestHost />, {wrapper: Wrapper});
    // Closed initially
    expect(screen.queryByRole('menu')).toBeNull();
    await user.click(screen.getByRole('button', {name: /language/i}));
    // The menu should be visible now that it's open
    expect(screen.getByRole('menu')).toBeVisible();
    await user.click(screen.getByRole('menuitemradio', {name: /pirate/i}));
    expect(screen.getByLabelText('locale').textContent).toBe('pirate');
  });
});
