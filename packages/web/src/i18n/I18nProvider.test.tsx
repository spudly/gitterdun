import {describe, expect, test} from '@jest/globals';
import {render, screen} from '@testing-library/react';
import {FormattedMessage} from 'react-intl';

import {I18nProvider, useI18n} from './I18nProvider';

const TestComponent = () => {
  const {setLocale} = useI18n();
  return (
    <div>
      <h2>
        <FormattedMessage id="app.tagline" defaultMessage="Chore Tracker" />
      </h2>
      <button onClick={() => setLocale('pirate')} type="button">
        pirate
      </button>
    </div>
  );
};

describe('I18nProvider', () => {
  test('renders default english messages and can switch to pirate', async () => {
    render(
      <I18nProvider>
        <TestComponent />
      </I18nProvider>,
    );

    // English should show a playful tagline
    expect(screen.getByRole('heading', {level: 2}).textContent).toMatch(/Chore Wrangler/i);

    // Switch to pirate
    screen.getByRole('button', {name: /pirate/i}).click();

    // Tagline should update to pirate speak
    expect(screen.getByRole('heading', {level: 2}).textContent).toMatch(/Chore Plunderin'/i);
  });
});

