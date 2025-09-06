import type {FC} from 'react';
import {Suspense, lazy} from 'react';
import {Routes as RouterRoutes, Route} from 'react-router-dom';
import {Spinner} from './widgets/Spinner.js';
import {ProtectedRoute} from './ProtectedRoute.js';

const Dashboard = lazy(async () => import('./pages/Dashboard.js'));
const Chores = lazy(async () => import('./pages/Chores.js'));
const Settings = lazy(async () => import('./pages/Settings.js'));
const Leaderboard = lazy(async () => import('./pages/Leaderboard.js'));
const Profile = lazy(async () => import('./pages/Profile.js'));
const Admin = lazy(async () => import('./pages/Admin.js'));
const Login = lazy(async () => import('./pages/Login.js'));
const ForgotPassword = lazy(async () => import('./pages/ForgotPassword.js'));
const ResetPassword = lazy(async () => import('./pages/ResetPassword.js'));
const Register = lazy(async () => import('./pages/Register.js'));
const Family = lazy(async () => import('./pages/Family.js'));
const FamilyApprovals = lazy(async () => import('./pages/FamilyApprovals.js'));
const AcceptInvitation = lazy(
  async () => import('./pages/AcceptInvitation.js'),
);
const Demos = lazy(async () => import('./pages/Demos.js'));
const Landing = lazy(async () => import('./pages/Landing.js'));
const ChoreCreate = lazy(async () => import('./pages/ChoreCreate.js'));

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
              <ChoreCreate />
            </ProtectedRoute>
          }
          path="/family/chores/new"
        />

        <Route
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          }
          path="/settings"
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
              <Profile />
            </ProtectedRoute>
          }
          path="/profile"
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

        <Route
          element={
            <ProtectedRoute>
              <FamilyApprovals />
            </ProtectedRoute>
          }
          path="/family/approvals"
        />

        <Route element={<AcceptInvitation />} path="/accept-invitation" />

        <Route element={<Demos />} path="/__demos" />

        <Route element={<Demos />} path="/__demos/:name" />

        <Route element={<Landing />} path="/landing" />
      </RouterRoutes>
    </Suspense>
  );
};
