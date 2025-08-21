import type {FC, ReactNode} from 'react';
import {createContext, useContext, useMemo, useState} from 'react';
import {IntlProvider} from 'react-intl';
import {
  getMessagesForLocale,
  isSupportedLocale,
  SupportedLocale,
} from './messages/index.js';

type I18nContextValue = {
  readonly locale: SupportedLocale;
  readonly setLocale: (next: SupportedLocale) => void;
};

const I18nContext = createContext<I18nContextValue | null>(null);

export const useI18n = (): I18nContextValue => {
  const ctx = useContext(I18nContext);
  if (ctx === null) {
    throw new Error('useI18n must be used within I18nProvider');
  }
  return ctx;
};

type I18nProviderProps = {readonly children: ReactNode};

export const I18nProvider: FC<I18nProviderProps> = ({children}) => {
  // eslint-disable-next-line react/hook-use-state -- false positive
  const [locale, setLocaleState] = useState<SupportedLocale>(() => {
    const initial =
      typeof window !== 'undefined'
        ? window.localStorage.getItem('locale')
        : null;
    if (initial !== null && isSupportedLocale(initial)) {
      return initial;
    }
    return 'en';
  });

  const setLocale = (next: string) => {
    const resolved = isSupportedLocale(next) ? next : 'en';
    setLocaleState(resolved);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('locale', resolved);
    }
  };

  const messages = useMemo(() => getMessagesForLocale(locale), [locale]);
  const ctx: I18nContextValue = useMemo(() => ({locale, setLocale}), [locale]);

  return (
    <I18nContext.Provider value={ctx}>
      <IntlProvider locale={locale} messages={messages} onError={() => {}}>
        {children}
      </IntlProvider>
    </I18nContext.Provider>
  );
};
