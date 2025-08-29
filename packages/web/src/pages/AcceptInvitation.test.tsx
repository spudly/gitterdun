import {beforeEach, describe, expect, jest, test} from '@jest/globals';
import {render, screen} from '@testing-library/react';
import {createWrapper} from '../test/createWrapper';
import AcceptInvitation from './AcceptInvitation';
import {ToastProvider} from '../widgets/ToastProvider';

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
    const Wrapper = createWrapper({
      i18n: true,
      router: {initialEntries: ['/accept-invitation']},
    });
    render(
      <ToastProvider>
        <AcceptInvitation />
      </ToastProvider>,
      {wrapper: Wrapper},
    );
    expect(screen.getByText('Missing token.')).toHaveTextContent(
      'Missing token.',
    );
  });

  test('renders form with valid token', () => {
    const Wrapper = createWrapper({
      i18n: true,
      router: {initialEntries: ['/accept-invitation?token=abc']},
    });
    render(
      <ToastProvider>
        <AcceptInvitation />
      </ToastProvider>,
      {wrapper: Wrapper},
    );
    expect(
      screen.getByRole('heading', {name: 'Accept Invitation'}),
    ).toHaveTextContent('Accept Invitation');
    expect(screen.getByLabelText(/Username/iu)).toBeVisible();
    expect(screen.getByLabelText(/Password/iu)).toBeVisible();
    expect(
      screen.getByRole('button', {name: 'Accept Invitation'}),
    ).toBeEnabled();
  });
});
