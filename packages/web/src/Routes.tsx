import {FC, Suspense, lazy} from 'react';
import {Routes as RouterRoutes, Route} from 'react-router-dom';
import {Spinner} from './widgets/Spinner';

export const Dashboard = lazy(() => import('./pages/Dashboard'));
export const Chores = lazy(() => import('./pages/Chores'));
export const Goals = lazy(() => import('./pages/Goals'));
export const Leaderboard = lazy(() => import('./pages/Leaderboard'));
export const Admin = lazy(() => import('./pages/Admin'));
export const Login = lazy(() => import('./pages/Login'));
export const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
export const ResetPassword = lazy(() => import('./pages/ResetPassword'));
export const Family = lazy(() => import('./pages/Family'));
export const AcceptInvitation = lazy(() => import('./pages/AcceptInvitation'));
export const Demos = lazy(() => import('./pages/Demos'));

export const Routes: FC = () => {
  return (
    <Suspense fallback={<Spinner />}>
      <RouterRoutes>
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
      </RouterRoutes>
    </Suspense>
  );
};
