import type {FC, ReactNode} from 'react';
import {I18nProvider} from '../i18n/I18nProvider.js';

type TestProvidersProps = {readonly children: ReactNode};

export const TestProviders: FC<TestProvidersProps> = ({children}) => {
  return <I18nProvider>{children}</I18nProvider>;
};
