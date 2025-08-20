import {beforeEach, describe, expect, jest, test} from '@jest/globals';
import {render, screen} from '@testing-library/react';
import {MemoryRouter} from 'react-router-dom';
import AcceptInvitation from './AcceptInvitation';
import {ToastProvider} from '../widgets/ToastProvider';
import {TestProviders} from '../test/TestProviders';

jest.mock('../lib/api', () => ({
  invitationsApi: {accept: jest.fn(async () => ({success: true}))},
}));

jest.mock('../widgets/ToastProvider', () => ({
  ToastProvider: ({children}: {children: React.ReactNode}) => (
    <div>{children}</div>
  ),
  useToast: () => ({
    safeAsync:
      (fn: (...args: Array<unknown>) => Promise<unknown>) =>
      async (...args: Array<unknown>) => {
        return fn(...args).catch(() => {
          // Swallow errors for testing
        });
      },
  }),
}));

describe('acceptInvitation page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('shows missing token when none provided', () => {
    render(
      <MemoryRouter initialEntries={['/accept-invitation']}>
        <ToastProvider>
          <AcceptInvitation />
        </ToastProvider>
      </MemoryRouter>,
      {wrapper: TestProviders},
    );
    expect(screen.getByText('Missing token.')).toBeInTheDocument();
  });

  test('renders form with valid token', () => {
    render(
      <MemoryRouter initialEntries={['/accept-invitation?token=abc']}>
        <ToastProvider>
          <AcceptInvitation />
        </ToastProvider>
      </MemoryRouter>,
      {wrapper: TestProviders},
    );
    expect(
      screen.getByRole('heading', {name: 'Accept Invitation'}),
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/Username/iu)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/iu)).toBeInTheDocument();
    expect(
      screen.getByRole('button', {name: 'Accept Invitation'}),
    ).toBeInTheDocument();
  });
});
