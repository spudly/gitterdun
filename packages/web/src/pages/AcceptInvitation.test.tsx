import {render, screen, fireEvent, act} from '@testing-library/react';
import {MemoryRouter} from 'react-router-dom';
import AcceptInvitation from './AcceptInvitation';
import * as apiModule from '../lib/api';

jest.mock('../lib/api', () => ({
  invitationsApi: {accept: jest.fn(async () => ({success: true}))},
}));

describe('AcceptInvitation page', () => {
  it('shows missing token when none provided', () => {
    render(
      <MemoryRouter initialEntries={['/accept-invitation']}>
        <AcceptInvitation />
      </MemoryRouter>,
    );
    expect(screen.getByText('Missing token.')).toBeInTheDocument();
  });

  it('accepts invitation and navigates on success', async () => {
    jest.useFakeTimers();
    const {invitationsApi}: any = apiModule;
    invitationsApi.accept.mockResolvedValueOnce({success: true});
    render(
      <MemoryRouter initialEntries={['/accept-invitation?token=abc']}>
        <AcceptInvitation />
      </MemoryRouter>,
    );
    fireEvent.change(screen.getByLabelText(/Username/i), {
      target: {value: 'u'},
    });
    fireEvent.change(screen.getByLabelText(/Password/i), {
      target: {value: 'p12345'},
    });
    await act(async () => {
      fireEvent.submit(
        screen
          .getByRole('button', {name: 'Accept Invitation'})
          .closest('form')!,
      );
    });
    expect(await screen.findByText(/Invitation accepted/)).toBeInTheDocument();
    act(() => {
      jest.runAllTimers();
    });
    jest.useRealTimers();
  });

  it('shows error when API fails', async () => {
    const {invitationsApi}: any = apiModule;
    invitationsApi.accept.mockRejectedValueOnce(new Error('fail'));
    render(
      <MemoryRouter initialEntries={['/accept-invitation?token=abc']}>
        <AcceptInvitation />
      </MemoryRouter>,
    );
    fireEvent.change(screen.getByLabelText(/Username/i), {
      target: {value: 'u'},
    });
    fireEvent.change(screen.getByLabelText(/Password/i), {
      target: {value: 'p12345'},
    });
    await act(async () => {
      fireEvent.submit(
        screen
          .getByRole('button', {name: 'Accept Invitation'})
          .closest('form')!,
      );
    });
    expect(screen.getByText(/Failed to accept/)).toBeInTheDocument();
  });

  it('shows failure message when API returns success=false', async () => {
    const {invitationsApi}: any = apiModule;
    invitationsApi.accept.mockResolvedValueOnce({success: false, error: 'x'});
    render(
      <MemoryRouter initialEntries={['/accept-invitation?token=abc']}>
        <AcceptInvitation />
      </MemoryRouter>,
    );
    fireEvent.change(screen.getByLabelText(/Username/i), {
      target: {value: 'u'},
    });
    fireEvent.change(screen.getByLabelText(/Password/i), {
      target: {value: 'p12345'},
    });
    await act(async () => {
      fireEvent.submit(
        screen
          .getByRole('button', {name: 'Accept Invitation'})
          .closest('form')!,
      );
    });
    expect(screen.getByText(/Failed to accept/)).toBeInTheDocument();
  });
});
