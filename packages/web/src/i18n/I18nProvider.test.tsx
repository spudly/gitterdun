import {describe, expect, test} from '@jest/globals';
import {render, screen, waitFor} from '@testing-library/react';
import {FormattedMessage} from 'react-intl';

import {I18nProvider, useI18n} from './I18nProvider';
import en from './extracted/en.json';

const TestComponent = () => {
  const {setLocale} = useI18n();
  return (
    <div>
      <h2>
        <FormattedMessage
          defaultMessage="Chore Wrangler"
          id="widgets.Layout.chore-wrangler"
        />
      </h2>
      <button
        onClick={() => {
          setLocale('pirate');
        }}
        type="button"
      >
        pirate
      </button>
      <button
        onClick={() => {
          setLocale('fr');
        }}
        type="button"
      >
        fr
      </button>
      <button
        onClick={() => {
          setLocale('deseret');
        }}
        type="button"
      >
        deseret
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
    await waitFor(() => {
      expect(screen.getByRole('heading', {level: 2}).textContent).toMatch(
        /Chore Plunderin'|Chore Plunderin’/i,
      );
    });
  });

  test('can switch to French and see translated tagline', async () => {
    render(
      <I18nProvider>
        <TestComponent />
      </I18nProvider>,
    );

    // Switch to fr via test control button
    screen.getByRole('button', {name: 'fr'}).click();

    await waitFor(() => {
      expect(screen.getByRole('heading', {level: 2}).textContent).toMatch(
        /Dompteur de corvées/i,
      );
    });
  });

  test('can switch to Deseret and see translated tagline', async () => {
    render(
      <I18nProvider>
        <TestComponent />
      </I18nProvider>,
    );

    screen.getByRole('button', {name: 'deseret'}).click();

    await waitFor(() => {
      expect(screen.getByRole('heading', {level: 2}).textContent).toMatch(
        /𐐗𐐬𐐡 𐐎𐐪𐐡𐐨𐐯𐐡𐐮𐐡/i,
      );
    });
  });

  test('extracted en.json includes all Login page messages', () => {
    const keys = Object.keys(en);
    const expected = [
      'pages.Login.login',
      'pages.Login.login-failed',
      'pages.Login.email',
      'pages.Login.password',
      'pages.Login.logging-in',
      'pages.Login.forgot-password',
      'pages.Login.register-admin',
    ];
    for (const id of expected) {
      expect(keys).toContain(id);
    }
  });
});
