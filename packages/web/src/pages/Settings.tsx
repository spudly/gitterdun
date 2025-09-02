import type {FC} from 'react';
import {FormattedMessage, useIntl} from 'react-intl';
import {SETTINGS_LANGUAGES} from '../constants.js';
import {isSupportedLocale} from '../i18n/messages/index.js';
import {useI18n} from '../i18n/I18nProvider.js';

// Message descriptors and native names moved to constants

const Settings: FC = () => {
  const {locale, setLocale} = useI18n();
  const intl = useIntl();
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
                {SETTINGS_LANGUAGES.map(({id, nativeName, i18nMessage}) => {
                  const intlName = intl.formatMessage(i18nMessage);
                  return (
                    <option key={id} value={id}>
                      {nativeName}
                      {nativeName !== intlName ? (
                        <>
                          {/* eslint-disable-next-line react/jsx-no-literals -- punctuation outside i18n */}
                          {' ('}
                          {intlName}
                          {/* eslint-disable-next-line react/jsx-no-literals, react/jsx-curly-brace-presence -- punctuation outside i18n */}
                          {')'}
                        </>
                      ) : null}
                    </option>
                  );
                })}
              </select>
            </label>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Settings;
