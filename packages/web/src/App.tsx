import {QueryClientProvider} from '@tanstack/react-query';
import {BrowserRouter} from 'react-router-dom';
import Layout from './widgets/Layout.js';
import {ToastProvider} from './widgets/ToastProvider.js';
import {Routes} from './Routes.js';
import {NAVIGATION_ITEMS} from './constants.js';
import {I18nProvider} from './i18n/I18nProvider.js';
import {FC} from 'react';
import {queryClient} from './utils/queryClient.js';
import {ReactQueryDevtools} from '@tanstack/react-query-devtools';

export const App: FC = () => (
  <QueryClientProvider client={queryClient}>
    <I18nProvider>
      <ToastProvider>
        <BrowserRouter>
          <Layout navigation={NAVIGATION_ITEMS}>
            <Routes />
          </Layout>
        </BrowserRouter>
      </ToastProvider>
    </I18nProvider>
    {__ENV__ === 'development' ? (
      <>
        {/* eslint-disable-next-line react/jsx-no-literals -- devtools styles */}
        <style>{`.tsqd-open-btn-container{ transform: translateY(-50px); }`}</style>
        <ReactQueryDevtools initialIsOpen={false} />
      </>
    ) : null}
  </QueryClientProvider>
);
