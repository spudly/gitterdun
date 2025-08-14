import {Suspense, lazy} from 'react';
import {createRoot} from 'react-dom/client';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Layout, {NavigationItem} from './widgets/Layout.js';
import {Spinner} from './widgets/Spinner.js';

const Dashboard = lazy(() => import('./pages/Dashboard'));
const Chores = lazy(() => import('./pages/Chores'));
const Goals = lazy(() => import('./pages/Goals'));
const Leaderboard = lazy(() => import('./pages/Leaderboard'));
const Admin = lazy(() => import('./pages/Admin'));
const Login = lazy(() => import('./pages/Login'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const ResetPassword = lazy(() => import('./pages/ResetPassword'));
const Family = lazy(() => import('./pages/Family'));
const AcceptInvitation = lazy(() => import('./pages/AcceptInvitation'));
const Demos = lazy(() => import('./pages/Demos'));

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
if (rootElement) {
  const navigation: NavigationItem[] = [
    {name: 'Dashboard', path: '/', icon: '🏠'},
    {name: 'Chores', path: '/chores', icon: '📋'},
    {name: 'Goals', path: '/goals', icon: '🎯'},
    {name: 'Leaderboard', path: '/leaderboard', icon: '🏆'},
  ];
  createRoot(rootElement).render(
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Layout navigation={navigation}>
          <Suspense fallback={<Spinner />}>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/chores" element={<Chores />} />
              <Route path="/goals" element={<Goals />} />
              <Route path="/leaderboard" element={<Leaderboard />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/login" element={<Login />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/family" element={<Family />} />
              <Route path="/accept-invitation" element={<AcceptInvitation />} />
              <Route path="/__demos" element={<Demos />} />
              <Route path="/__demos/:name" element={<Demos />} />
            </Routes>
          </Suspense>
        </Layout>
      </BrowserRouter>
    </QueryClientProvider>,
  );
}
