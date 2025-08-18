import {beforeEach, describe, expect, jest, test} from '@jest/globals';
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
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('loads user and supports auth helpers', async () => {
    const {result} = renderHook(() => useUser(), {wrapper});
    // Wait for initial query to resolve
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
    await act(async () => {
      await result.current.login('a', 'b');
      await result.current.register({username: 'u', email: 'a', password: 'p'});
      await result.current.logout();
    });
    // Wait for query to settle after logout clears the cache
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
  });

  test('returns null on me error and covers forgot/reset helpers', async () => {
    const {authApi} = apis;
    jest.mocked(authApi.me).mockRejectedValueOnce(new Error('boom'));
    const {result} = renderHook(() => useUser(), {wrapper});
    await waitFor(() => {
      expect(result.current.user).toBeNull();
    });
    await act(async () => {
      await result.current.forgotPassword('x@example.com');
      await result.current.resetPassword('t', 'p');
    });
    expect(result.current.error).toBeNull();
  });

  test('returns undefined when me succeeds without data', async () => {
    const {authApi} = apis;
    jest
      .mocked(authApi.me)
      .mockResolvedValueOnce({success: true, data: undefined});
    const {result} = renderHook(() => useUser(), {wrapper});
    await waitFor(() => {
      expect(result.current.user).toBeUndefined();
      expect(result.current.isLoading).toBe(false);
    });
  });

  test('does not set user on login success without data (covers else at line 32)', async () => {
    const {authApi} = apis;
    jest
      .mocked(authApi.me)
      .mockResolvedValueOnce({success: true, data: undefined});
    jest.mocked(authApi.login).mockResolvedValueOnce({success: true});
    const client = new QueryClient();
    const clientSpy = jest.spyOn(client, 'setQueryData');
    const LocalWrapper: FC<PropsWithChildren> = ({children}) => (
      <QueryClientProvider client={client}>{children}</QueryClientProvider>
    );
    const {result} = renderHook(() => useUser(), {wrapper: LocalWrapper});
    await waitFor(() => {
      expect(result.current.user).toBeUndefined();
    });
    await act(async () => {
      await result.current.login('a', 'b');
    });
    expect(clientSpy).not.toHaveBeenCalled();
    expect(result.current.user).toBeUndefined();
  });

  test('does not set user on register success without data (covers else at line 41)', async () => {
    const {authApi} = apis;
    jest
      .mocked(authApi.me)
      .mockResolvedValueOnce({success: true, data: undefined});
    jest.mocked(authApi.register).mockResolvedValueOnce({success: true});
    const client = new QueryClient();
    const clientSpy = jest.spyOn(client, 'setQueryData');
    const LocalWrapper: FC<PropsWithChildren> = ({children}) => (
      <QueryClientProvider client={client}>{children}</QueryClientProvider>
    );
    const {result} = renderHook(() => useUser(), {wrapper: LocalWrapper});
    await waitFor(() => {
      expect(result.current.user).toBeUndefined();
    });
    await act(async () => {
      await result.current.register({username: 'u', email: 'e', password: 'p'});
    });
    expect(clientSpy).not.toHaveBeenCalled();
    expect(result.current.user).toBeUndefined();
  });

  test('includes role in register payload when provided (covers ternary at line 69)', async () => {
    const {authApi} = apis;
    const spy = jest.spyOn(authApi, 'register');
    const {result} = renderHook(() => useUser(), {wrapper});
    await act(async () => {
      await result.current.register({
        username: 'u',
        email: 'e@x.com',
        password: 'p',
        role: 'parent',
      });
    });
    expect(spy).toHaveBeenCalledWith(expect.objectContaining({role: 'parent'}));
    spy.mockRestore();
    expect(result.current.isRegistering).toBe(false);
  });
});
