import type {FC} from 'react';
import {Suspense, lazy} from 'react';
import {Routes as RouterRoutes, Route} from 'react-router-dom';
import {Spinner} from './widgets/Spinner';

const Dashboard = lazy(async () => import('./pages/Dashboard'));
const Chores = lazy(async () => import('./pages/Chores'));
const Goals = lazy(async () => import('./pages/Goals'));
const Leaderboard = lazy(async () => import('./pages/Leaderboard'));
const Admin = lazy(async () => import('./pages/Admin'));
const Login = lazy(async () => import('./pages/Login'));
const ForgotPassword = lazy(async () => import('./pages/ForgotPassword'));
const ResetPassword = lazy(async () => import('./pages/ResetPassword'));
const Family = lazy(async () => import('./pages/Family'));
const AcceptInvitation = lazy(async () => import('./pages/AcceptInvitation'));
const Demos = lazy(async () => import('./pages/Demos'));

export const Routes: FC = () => {
  return (
    <Suspense fallback={<Spinner />}>
      <RouterRoutes>
        <Route element={<Dashboard />} path="/" />

        <Route element={<Chores />} path="/chores" />

        <Route element={<Goals />} path="/goals" />

        <Route element={<Leaderboard />} path="/leaderboard" />

        <Route element={<Admin />} path="/admin" />

        <Route element={<Login />} path="/login" />

        <Route element={<ForgotPassword />} path="/forgot-password" />

        <Route element={<ResetPassword />} path="/reset-password" />

        <Route element={<Family />} path="/family" />

        <Route element={<AcceptInvitation />} path="/accept-invitation" />

        <Route element={<Demos />} path="/__demos" />

        <Route element={<Demos />} path="/__demos/:name" />
      </RouterRoutes>
    </Suspense>
  );
};
