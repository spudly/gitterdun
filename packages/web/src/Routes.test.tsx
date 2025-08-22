import {describe, expect, jest, test} from '@jest/globals';
import {render, screen} from '@testing-library/react';
import {MemoryRouter} from 'react-router-dom';

import {Routes} from './Routes';

// Mock auth hook to allow protected route rendering by default
jest.mock<typeof import('./hooks/useUser')>('./hooks/useUser', () => ({
  __esModule: true,
  useUser: jest.fn(() => ({user: {id: 1}, isLoading: false})),
}));

// Mock all lazy-loaded pages to simple components so we only test route mapping here
jest.mock<typeof import('./pages/Landing')>('./pages/Landing', () => ({
  __esModule: true,
  default: () => <div>Mock Landing</div>,
}));
jest.mock<typeof import('./pages/Dashboard')>('./pages/Dashboard', () => ({
  __esModule: true,
  default: () => <div>Mock Dashboard</div>,
}));
jest.mock<typeof import('./pages/Chores')>('./pages/Chores', () => ({
  __esModule: true,
  default: () => <div>Mock Chores</div>,
}));
jest.mock<typeof import('./pages/Goals')>('./pages/Goals', () => ({
  __esModule: true,
  default: () => <div>Mock Goals</div>,
}));
jest.mock<typeof import('./pages/Leaderboard')>('./pages/Leaderboard', () => ({
  __esModule: true,
  default: () => <div>Mock Leaderboard</div>,
}));
jest.mock<typeof import('./pages/Admin')>('./pages/Admin', () => ({
  __esModule: true,
  default: () => <div>Mock Admin</div>,
}));
jest.mock<typeof import('./pages/Login')>('./pages/Login', () => ({
  __esModule: true,
  default: () => <div>Mock Login</div>,
}));
jest.mock<typeof import('./pages/ForgotPassword')>(
  './pages/ForgotPassword',
  () => ({__esModule: true, default: () => <div>Mock Forgot Password</div>}),
);
jest.mock<typeof import('./pages/ResetPassword')>(
  './pages/ResetPassword',
  () => ({__esModule: true, default: () => <div>Mock Reset Password</div>}),
);
jest.mock<typeof import('./pages/Family')>('./pages/Family', () => ({
  __esModule: true,
  default: () => <div>Mock Family</div>,
}));
jest.mock<typeof import('./pages/AcceptInvitation')>(
  './pages/AcceptInvitation',
  () => ({__esModule: true, default: () => <div>Mock Accept Invitation</div>}),
);
jest.mock<typeof import('./pages/Demos')>('./pages/Demos', () => ({
  __esModule: true,
  default: () => <div>Mock Demos</div>,
}));

// Make the Suspense fallback render synchronously without delay
jest.mock<typeof import('./widgets/Spinner')>('./widgets/Spinner', () => ({
  __esModule: true,
  Spinner: () => <div aria-label="loading" />,
}));

const renderAtPath = async (path: string) => {
  render(
    <MemoryRouter initialEntries={[path]}>
      <Routes />
    </MemoryRouter>,
  );
};

describe('routes', () => {
  test('shows Suspense fallback while lazy page loads', async () => {
    await renderAtPath('/goals');
    expect(screen.queryByLabelText('loading')).toBeInTheDocument();
    await expect(screen.findByText('Mock Goals')).resolves.toBeInTheDocument();
  });

  test.each([
    ['/', 'Mock Dashboard'],
    ['/landing', 'Mock Landing'],
    ['/chores', 'Mock Chores'],
    ['/goals', 'Mock Goals'],
    ['/leaderboard', 'Mock Leaderboard'],
    ['/admin', 'Mock Admin'],
    ['/login', 'Mock Login'],
    ['/forgot-password', 'Mock Forgot Password'],
    ['/reset-password', 'Mock Reset Password'],
    ['/family', 'Mock Family'],
    ['/accept-invitation', 'Mock Accept Invitation'],
    ['/__demos', 'Mock Demos'],
    ['/__demos/Button', 'Mock Demos'],
  ])('renders %s -> %s', async (path, expectedText) => {
    await renderAtPath(path);
    await expect(screen.findByText(expectedText)).resolves.toBeInTheDocument();
  });
});

describe('access control', () => {
  test('redirects unauthenticated users to landing for protected routes', async () => {
    const {useUser} = require('./hooks/useUser') as {useUser: jest.Mock};
    useUser.mockImplementation(() => ({user: null, isLoading: false}));
    await renderAtPath('/goals');
    await expect(
      screen.findByText('Mock Landing'),
    ).resolves.toBeInTheDocument();
  });

  test('allows authenticated users to access protected routes', async () => {
    const {useUser} = require('./hooks/useUser') as {useUser: jest.Mock};
    useUser.mockImplementation(() => ({user: {id: 1}, isLoading: false}));
    await renderAtPath('/goals');
    await expect(screen.findByText('Mock Goals')).resolves.toBeInTheDocument();
  });
});
