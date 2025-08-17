import {describe, expect, jest, test} from '@jest/globals';
import type {FC, PropsWithChildren} from 'react';
import {renderHook, act, waitFor} from '@testing-library/react';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {useUser} from './useUser';
import * as apis from '../lib/api';

jest.mock('../lib/api', () => {
  return {
    authApi: {
      me: jest.fn(async () => ({
        success: true,
        data: {
          id: 1,
          username: 'u',
          role: 'parent',
          points: 0,
          streak_count: 0,
        },
      })),
      login: jest.fn(async () => ({
        success: true,
        data: {id: 1, username: 'u'},
      })),
      register: jest.fn(async () => ({
        success: true,
        data: {id: 2, username: 'v'},
      })),
      logout: jest.fn(async () => ({success: true})),
      forgotPassword: jest.fn(async () => ({success: true})),
      resetPassword: jest.fn(async () => ({success: true})),
    },
  };
});

const wrapper: FC<PropsWithChildren> = ({children}) => {
  const client = new QueryClient();
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
};

describe('useUser', () => {
  test('loads user and supports auth helpers', async () => {
    const {result, rerender} = renderHook(() => useUser(), {wrapper});
    // wait a tick for query to resolve
    await act(async () => {
      await new Promise(resolve => {
        setTimeout(resolve, 0);
      });
    });
    await act(async () => {
      await result.current.login('a', 'b');
      await result.current.register('u', 'a', 'p');
      await result.current.logout();
    });
    rerender();
  });

  test('returns null on me error and covers forgot/reset helpers', async () => {
    const {authApi} = apis;
    jest.mocked(authApi.me).mockRejectedValueOnce(new Error('boom'));
    const {result} = renderHook(() => useUser(), {wrapper});
    await act(async () => {
      await new Promise(resolve => {
        setTimeout(resolve, 0);
      });
    });
    expect(result.current.user ?? null).toBeNull();
    await act(async () => {
      await result.current.forgotPassword('x@example.com');
      await result.current.resetPassword('t', 'p');
    });
  });

  test('returns null when me succeeds without data (covers line 20)', async () => {
    const {authApi} = apis;
    jest.mocked(authApi.me).mockResolvedValueOnce({success: true});
    const {result} = renderHook(() => useUser(), {wrapper});
    await waitFor(() => {
      expect(result.current.user).toBeNull();
    });
  });

  test('does not set user on login success without data (covers else at line 32)', async () => {
    const {authApi} = apis;
    jest.mocked(authApi.login).mockResolvedValueOnce({success: true});
    const client = new QueryClient();
    const clientSpy = jest.spyOn(client, 'setQueryData');
    const LocalWrapper: FC<PropsWithChildren> = ({children}) => (
      <QueryClientProvider client={client}>{children}</QueryClientProvider>
    );
    const {result} = renderHook(() => useUser(), {wrapper: LocalWrapper});
    await act(async () => {
      await result.current.login('a', 'b');
    });
    expect(clientSpy).not.toHaveBeenCalled();
  });

  test('does not set user on register success without data (covers else at line 41)', async () => {
    const {authApi} = apis;
    jest.mocked(authApi.register).mockResolvedValueOnce({success: true});
    const client = new QueryClient();
    const clientSpy = jest.spyOn(client, 'setQueryData');
    const LocalWrapper: FC<PropsWithChildren> = ({children}) => (
      <QueryClientProvider client={client}>{children}</QueryClientProvider>
    );
    const {result} = renderHook(() => useUser(), {wrapper: LocalWrapper});
    await act(async () => {
      await result.current.register('u', 'e', 'p');
    });
    expect(clientSpy).not.toHaveBeenCalled();
  });

  test('includes role in register payload when provided (covers ternary at line 69)', async () => {
    const {authApi} = apis;
    const spy = jest.spyOn(authApi, 'register');
    const {result} = renderHook(() => useUser(), {wrapper});
    await act(async () => {
      await result.current.register('u', 'e@x.com', 'p', 'parent');
    });
    expect(spy).toHaveBeenCalledWith(expect.objectContaining({role: 'parent'}));
    spy.mockRestore();
  });
});
