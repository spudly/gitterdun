import {describe, expect, jest, test} from '@jest/globals';
import {render, screen, fireEvent, act} from '@testing-library/react';
import {MemoryRouter} from 'react-router-dom';
import AcceptInvitation from './AcceptInvitation';
import * as apiModule from '../lib/api';

jest.mock('../lib/api', () => ({
  invitationsApi: {accept: jest.fn(async () => ({success: true}))},
}));

describe('acceptInvitation page', () => {
  test('shows missing token when none provided', () => {
    render(
      <MemoryRouter initialEntries={['/accept-invitation']}>
        <AcceptInvitation />
      </MemoryRouter>,
    );
    expect(screen.getByText('Missing token.')).toBeInTheDocument();
  });

  test('accepts invitation and navigates on success', async () => {
    jest.useFakeTimers();
    const mocked = jest.mocked(apiModule);
    mocked.invitationsApi.accept.mockResolvedValueOnce({success: true});
    render(
      <MemoryRouter initialEntries={['/accept-invitation?token=abc']}>
        <AcceptInvitation />
      </MemoryRouter>,
    );
    fireEvent.change(screen.getByLabelText(/Username/iu), {
      target: {value: 'u'},
    });
    fireEvent.change(screen.getByLabelText(/Password/iu), {
      target: {value: 'p12345'},
    });
    await act(async () => {
      fireEvent.submit(
        screen
          .getByRole('button', {name: 'Accept Invitation'})
          .closest('form')!,
      );
    });
    await expect(
      screen.findByText(/Invitation accepted/u),
    ).resolves.toBeInTheDocument();
    act(() => {
      jest.runAllTimers();
    });
    jest.useRealTimers();
    expect(mocked.invitationsApi.accept).toHaveBeenCalledWith({
      token: 'abc',
      username: 'u',
      password: 'p12345',
    });
  });

  test('shows error when API fails', async () => {
    const mocked = jest.mocked(apiModule);
    mocked.invitationsApi.accept.mockRejectedValueOnce(new Error('fail'));
    render(
      <MemoryRouter initialEntries={['/accept-invitation?token=abc']}>
        <AcceptInvitation />
      </MemoryRouter>,
    );
    fireEvent.change(screen.getByLabelText(/Username/iu), {
      target: {value: 'u'},
    });
    fireEvent.change(screen.getByLabelText(/Password/iu), {
      target: {value: 'p12345'},
    });
    await act(async () => {
      fireEvent.submit(
        screen
          .getByRole('button', {name: 'Accept Invitation'})
          .closest('form')!,
      );
    });
    expect(screen.getByText(/Failed to accept/u)).toBeInTheDocument();
  });

  test('shows failure message when API returns success=false', async () => {
    const mocked = jest.mocked(apiModule);
    mocked.invitationsApi.accept.mockResolvedValueOnce({
      success: false,
      error: 'x',
    });
    render(
      <MemoryRouter initialEntries={['/accept-invitation?token=abc']}>
        <AcceptInvitation />
      </MemoryRouter>,
    );
    fireEvent.change(screen.getByLabelText(/Username/iu), {
      target: {value: 'u'},
    });
    fireEvent.change(screen.getByLabelText(/Password/iu), {
      target: {value: 'p12345'},
    });
    await act(async () => {
      fireEvent.submit(
        screen
          .getByRole('button', {name: 'Accept Invitation'})
          .closest('form')!,
      );
    });
    expect(screen.getByText(/Failed to accept/u)).toBeInTheDocument();
  });
});
