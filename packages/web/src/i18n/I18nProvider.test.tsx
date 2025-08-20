import {describe, expect, test} from '@jest/globals';
import {render, screen, waitFor} from '@testing-library/react';
import {FormattedMessage} from 'react-intl';

import {I18nProvider, useI18n} from './I18nProvider';

const TestComponent = () => {
  const {setLocale} = useI18n();
  return (
    <div>
      <h2>
        <FormattedMessage defaultMessage="Chore Tracker" id="app.tagline" />
      </h2>
      <button
        onClick={() => {
          setLocale('pirate');
        }}
        type="button"
      >
        pirate
      </button>
    </div>
  );
};

describe('i18nProvider', () => {
  test('renders default english messages and can switch to pirate', async () => {
    render(
      <I18nProvider>
        <TestComponent />
      </I18nProvider>,
    );

    // English should show a playful tagline
    expect(screen.getByRole('heading', {level: 2}).textContent).toMatch(
      /Chore Wrangler/i,
    );

    // Switch to pirate
    screen.getByRole('button', {name: /pirate/i}).click();

    // Tagline should update to pirate speak
    await waitFor(() =>
      { expect(screen.getByRole('heading', {level: 2}).textContent).toMatch(
        /Chore Plunderin'/i,
      ); },
    );
  });
});
