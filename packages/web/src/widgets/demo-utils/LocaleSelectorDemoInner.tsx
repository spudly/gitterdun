import type {FC} from 'react';
import {useI18n} from '../../i18n/I18nProvider';
import {LocaleSelector} from '../LocaleSelector';

export const LocaleSelectorDemoInner: FC = () => {
  const {locale, setLocale} = useI18n();
  return (
    <div className="p-4">
      <LocaleSelector
        onChange={next => {
          setLocale(next);
        }}
        value={locale}
      />
      <div className="mt-2 text-sm">Current: {locale}</div>
    </div>
  );
};
