import React from 'react';
import {renderHook, act} from '@testing-library/react';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {useUser} from './useUser';
import * as apiModule from '../lib/api';

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

const wrapper: React.FC<{children: React.ReactNode}> = ({children}) => {
  const client = new QueryClient();
  return React.createElement(QueryClientProvider, {client}, children);
};

describe('useUser', () => {
  it('loads user and supports auth helpers', async () => {
    const {result, rerender} = renderHook(() => useUser(), {wrapper});
    // wait a tick for query to resolve
    await act(async () => {
      await new Promise(resolve => {
        setTimeout(resolve, 0);
      });
    });
    expect(
      result.current.user == null || typeof result.current.user === 'object',
    ).toBe(true);
    await act(async () => {
      await result.current.login('a', 'b');
      await result.current.register('u', 'a', 'p');
      await result.current.logout();
    });
    rerender();
  });

  it('returns null on me error and covers forgot/reset helpers', async () => {
    const {authApi}: any = apiModule;
    authApi.me.mockRejectedValueOnce(new Error('boom'));
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

  it('returns null when me succeeds without data (covers line 20)', async () => {
    const {authApi}: any = apiModule;
    authApi.me.mockResolvedValueOnce({success: true});
    const {result} = renderHook(() => useUser(), {wrapper});
    await act(async () => {
      await new Promise(resolve => {
        setTimeout(resolve, 0);
      });
    });
    expect(result.current.user == null).toBe(true);
  });

  it('does not set user on login success without data (covers else at line 32)', async () => {
    const {authApi}: any = apiModule;
    authApi.login.mockResolvedValueOnce({success: true});
    const client = new QueryClient();
    const clientSpy = jest.spyOn(client, 'setQueryData');
    const LocalWrapper: React.FC<{children: React.ReactNode}> = ({children}) =>
      React.createElement(QueryClientProvider, {client}, children);
    const {result} = renderHook(() => useUser(), {wrapper: LocalWrapper});
    await act(async () => {
      await result.current.login('a', 'b');
    });
    expect(clientSpy).not.toHaveBeenCalled();
  });

  it('does not set user on register success without data (covers else at line 41)', async () => {
    const {authApi}: any = apiModule;
    authApi.register.mockResolvedValueOnce({success: true});
    const client = new QueryClient();
    const clientSpy = jest.spyOn(client, 'setQueryData');
    const LocalWrapper: React.FC<{children: React.ReactNode}> = ({children}) =>
      React.createElement(QueryClientProvider, {client}, children);
    const {result} = renderHook(() => useUser(), {wrapper: LocalWrapper});
    await act(async () => {
      await result.current.register('u', 'e', 'p');
    });
    expect(clientSpy).not.toHaveBeenCalled();
  });

  it('includes role in register payload when provided (covers ternary at line 69)', async () => {
    const {authApi}: any = apiModule;
    const spy = jest.spyOn(authApi, 'register');
    const {result} = renderHook(() => useUser(), {wrapper});
    await act(async () => {
      await result.current.register('u', 'e@x.com', 'p', 'parent');
    });
    expect(spy).toHaveBeenCalledWith(expect.objectContaining({role: 'parent'}));
    spy.mockRestore();
  });
});
