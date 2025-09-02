import type {FC} from 'react';
import {FormattedMessage} from 'react-intl';
import {isSupportedLocale} from '../i18n/messages/index.js';
import {useI18n} from '../i18n/I18nProvider.js';

const Settings: FC = () => {
  const {locale, setLocale} = useI18n();
  return (
    <div className="w-full px-4 py-6 sm:px-6 lg:px-8">
      <h1 className="text-xl font-semibold">
        <FormattedMessage defaultMessage="Settings" id="pages.Settings.title" />
      </h1>
      <div className="pt-4">
        <section className="rounded border p-4">
          <div className="grid gap-2">
            <h2 className="text-sm font-medium">
              <FormattedMessage
                defaultMessage="Language"
                id="pages.Settings.language"
              />
            </h2>
            <label className="grid gap-2 text-sm" htmlFor="locale-select">
              <FormattedMessage
                defaultMessage="Language"
                id="pages.Settings.language"
              />
              <select
                className="rounded border px-2 py-1 text-sm"
                id="locale-select"
                onChange={event => {
                  const next = event.target.value;
                  if (isSupportedLocale(next)) {
                    setLocale(next);
                  }
                }}
                value={locale}
              >
                <option value="en">English</option>
                <option value="pirate">Pirate</option>
                <option value="piglatin">Pig Latin</option>
                <option value="fr">Français</option>
                <option value="deseret">Deseret</option>
              </select>
            </label>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Settings;
