import type {FC} from 'react';
import {useI18n} from '../../i18n/I18nProvider.js';
import {LocaleSelector} from '../LocaleSelector.js';

export const LocaleSelectorDemoInner: FC = () => {
  const {locale, setLocale} = useI18n();
  return (
    <div className="flex flex-col gap-2 p-4">
      <LocaleSelector
        onChange={next => {
          setLocale(next);
        }}
        value={locale}
      />
      <div className="text-sm">Current: {locale}</div>
    </div>
  );
};
