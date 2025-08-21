import type {FC} from 'react';
import {I18nProvider} from '../i18n/I18nProvider';
import {LocaleSelectorDemoInner} from './demo-utils/LocaleSelectorDemoInner';

const LocaleSelectorDemo: FC = () => (
  <I18nProvider>
    <LocaleSelectorDemoInner />
  </I18nProvider>
);

export default LocaleSelectorDemo;
