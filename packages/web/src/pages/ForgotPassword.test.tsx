import {render, screen, fireEvent, act} from '@testing-library/react';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import ForgotPassword from './ForgotPassword';
import * as useUserModule from '../hooks/useUser';

jest.mock('../hooks/useUser', () => ({
  useUser: jest.fn(() => ({forgotPassword: jest.fn(async () => ({}))})),
}));

const wrap = (ui: React.ReactElement) => (
  <QueryClientProvider client={new QueryClient()}>{ui}</QueryClientProvider>
);

describe('ForgotPassword page', () => {
  it('submits and shows message', async () => {
    render(wrap(<ForgotPassword />));
    const input = screen.getByLabelText(/email/i);
    fireEvent.change(input, {target: {value: 'e'}});
    await act(async () => {
      fireEvent.submit(
        screen.getByRole('button', {name: 'Send reset link'}).closest('form')!,
      );
    });
    const msgs = await screen.findAllByText(/reset link/);
    expect(msgs.length).toBeGreaterThan(0);
  });

  it('shows error message when request rejects (catch path)', async () => {
    const mocked = useUserModule.useUser as unknown as jest.Mock;
    const defaultImpl = mocked.getMockImplementation();
    mocked.mockImplementation(
      () =>
        ({
          forgotPassword: jest.fn(async () => {
            throw new Error('boom');
          }),
        }) as unknown as ReturnType<typeof useUserModule.useUser>,
    );
    render(wrap(<ForgotPassword />));
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: {value: 'x@example.com'},
    });
    await act(async () => {
      fireEvent.submit(
        screen.getByRole('button', {name: 'Send reset link'}).closest('form')!,
      );
    });
    expect(await screen.findByText('Request failed')).toBeInTheDocument();
    // restore default implementation for subsequent tests
    mocked.mockImplementation(defaultImpl as any);
  });
});
