import {render, screen} from '@testing-library/react';
import {MemoryRouter} from 'react-router-dom';

import {Routes} from './Routes';

// Mock all lazy-loaded pages to simple components so we only test route mapping here
jest.mock('./pages/Dashboard', () => ({
  __esModule: true,
  default: () => <div>Mock Dashboard</div>,
}));
jest.mock('./pages/Chores', () => ({
  __esModule: true,
  default: () => <div>Mock Chores</div>,
}));
jest.mock('./pages/Goals', () => ({
  __esModule: true,
  default: () => <div>Mock Goals</div>,
}));
jest.mock('./pages/Leaderboard', () => ({
  __esModule: true,
  default: () => <div>Mock Leaderboard</div>,
}));
jest.mock('./pages/Admin', () => ({
  __esModule: true,
  default: () => <div>Mock Admin</div>,
}));
jest.mock('./pages/Login', () => ({
  __esModule: true,
  default: () => <div>Mock Login</div>,
}));
jest.mock('./pages/ForgotPassword', () => ({
  __esModule: true,
  default: () => <div>Mock Forgot Password</div>,
}));
jest.mock('./pages/ResetPassword', () => ({
  __esModule: true,
  default: () => <div>Mock Reset Password</div>,
}));
jest.mock('./pages/Family', () => ({
  __esModule: true,
  default: () => <div>Mock Family</div>,
}));
jest.mock('./pages/AcceptInvitation', () => ({
  __esModule: true,
  default: () => <div>Mock Accept Invitation</div>,
}));
jest.mock('./pages/Demos', () => ({
  __esModule: true,
  default: () => <div>Mock Demos</div>,
}));

// Make the Suspense fallback render synchronously without delay
jest.mock('./widgets/Spinner', () => ({
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

describe('Routes', () => {
  it('shows Suspense fallback while lazy page loads', async () => {
    await renderAtPath('/goals');
    expect(screen.queryByLabelText('loading')).toBeInTheDocument();
    expect(await screen.findByText('Mock Goals')).toBeInTheDocument();
  });

  it.each([
    ['/', 'Mock Dashboard'],
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
    await renderAtPath(path as string);
    expect(await screen.findByText(expectedText as string)).toBeInTheDocument();
  });
});
