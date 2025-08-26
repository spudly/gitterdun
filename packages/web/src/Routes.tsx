import type {FC} from 'react';
import {Suspense, lazy} from 'react';
import {Routes as RouterRoutes, Route} from 'react-router-dom';
import {Spinner} from './widgets/Spinner';
import {ProtectedRoute} from './ProtectedRoute.js';

const Dashboard = lazy(async () => import('./pages/Dashboard'));
const Chores = lazy(async () => import('./pages/Chores'));
const Goals = lazy(async () => import('./pages/Goals'));
const Leaderboard = lazy(async () => import('./pages/Leaderboard'));
const Admin = lazy(async () => import('./pages/Admin'));
const Login = lazy(async () => import('./pages/Login'));
const ForgotPassword = lazy(async () => import('./pages/ForgotPassword'));
const ResetPassword = lazy(async () => import('./pages/ResetPassword'));
const Register = lazy(async () => import('./pages/Register'));
const Family = lazy(async () => import('./pages/Family'));
const AcceptInvitation = lazy(async () => import('./pages/AcceptInvitation'));
const Demos = lazy(async () => import('./pages/Demos'));
const Landing = lazy(async () => import('./pages/Landing'));

// moved to ProtectedRoute.tsx

export const Routes: FC = () => {
  return (
    <Suspense fallback={<Spinner />}>
      <RouterRoutes>
        <Route
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
          path="/"
        />

        <Route
          element={
            <ProtectedRoute>
              <Chores />
            </ProtectedRoute>
          }
          path="/chores"
        />

        <Route
          element={
            <ProtectedRoute>
              <Goals />
            </ProtectedRoute>
          }
          path="/goals"
        />

        <Route
          element={
            <ProtectedRoute>
              <Leaderboard />
            </ProtectedRoute>
          }
          path="/leaderboard"
        />

        <Route
          element={
            <ProtectedRoute>
              <Admin />
            </ProtectedRoute>
          }
          path="/admin"
        />

        <Route element={<Login />} path="/login" />

        <Route element={<ForgotPassword />} path="/forgot-password" />

        <Route element={<ResetPassword />} path="/reset-password" />

        <Route element={<Register />} path="/register" />

        <Route
          element={
            <ProtectedRoute>
              <Family />
            </ProtectedRoute>
          }
          path="/family"
        />

        <Route element={<AcceptInvitation />} path="/accept-invitation" />

        <Route element={<Demos />} path="/__demos" />

        <Route element={<Demos />} path="/__demos/:name" />

        <Route element={<Landing />} path="/landing" />
      </RouterRoutes>
    </Suspense>
  );
};
