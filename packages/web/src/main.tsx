import {createRoot} from 'react-dom/client';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {BrowserRouter} from 'react-router-dom';
import Layout from './widgets/Layout.js';
import {Routes} from './Routes.js';
import {NAVIGATION_ITEMS} from './constants.js';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 10, // 10 minutes
    },
  },
});

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element not found');
}

createRoot(rootElement).render(
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <Layout navigation={NAVIGATION_ITEMS}>
        <Routes />
      </Layout>
    </BrowserRouter>
  </QueryClientProvider>,
);
