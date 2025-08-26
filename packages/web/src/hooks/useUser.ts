import {useQuery, useMutation, useQueryClient} from '@tanstack/react-query';
import {UserSchema} from '@gitterdun/shared';
import type {User} from '@gitterdun/shared';
import {authApi} from '../lib/api.js';

const NO_DATA_SUCCESS = {__noData: true} as const;

const isNoDataSuccess = (value: unknown): value is typeof NO_DATA_SUCCESS => {
  if (value === null || typeof value !== 'object') {
    return false;
  }
  // Narrow using in-operator safely
  if (!('__noData' in value)) {
    return false;
  }
  // At this point, value has an __noData property of unknown type
  return (value as {__noData?: unknown}).__noData === true;
};

type UserQueryData = User | null | typeof NO_DATA_SUCCESS;

const createUserQueryFn = (): (() => Promise<UserQueryData>) => {
  return async (): Promise<UserQueryData> => {
    try {
      const res = await authApi.me();
      if (res.success && res.data) {
        return UserSchema.parse(res.data);
      }
      if (res.success && res.data === undefined) {
        return NO_DATA_SUCCESS;
      }
      return null;
    } catch (_error) {
      return null;
    }
  };
};

const processRawUserData = (
  rawUser: UserQueryData | undefined,
): User | null | undefined => {
  if (rawUser === undefined) {
    return undefined;
  }
  if (isNoDataSuccess(rawUser)) {
    return undefined;
  }
  return rawUser;
};

type RegisterParams =
  | {username: string; password: string}
  | {username: string; email: string; password: string}
  | {username: string; email: string; password: string; role: string};

export const useUser = () => {
  const queryClient = useQueryClient();
  const queryFn = createUserQueryFn();

  const {
    data: rawUser,
    isLoading,
    error,
  } = useQuery<UserQueryData>({
    queryKey: ['user'],
    queryFn,
    staleTime: 1000 * 60 * 60,
    retry: false,
  });

  const loginMutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: response => {
      if (response.success && response.data) {
        queryClient.setQueryData(['user'], response.data);
      }
    },
  });

  const registerMutation = useMutation({
    mutationFn: authApi.register,
    onSuccess: response => {
      if (response.success && response.data) {
        queryClient.setQueryData(['user'], response.data);
      }
    },
  });

  const logoutMutation = useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      queryClient.setQueryData(['user'], null);
      queryClient.clear();
    },
  });

  const user = processRawUserData(rawUser);

  return {
    user,
    isLoading,
    error,
    login: async (identifier: string, password: string) =>
      loginMutation.mutateAsync(
        identifier.includes('@')
          ? {email: identifier, password}
          : {username: identifier, password},
      ),
    register: async (params: RegisterParams) =>
      registerMutation.mutateAsync(params),
    logout: async () => logoutMutation.mutateAsync(),
    forgotPassword: async (email: string) => authApi.forgotPassword({email}),
    resetPassword: async (token: string, password: string) =>
      authApi.resetPassword({token, password}),
    isLoggingIn: loginMutation.isPending,
    isRegistering: registerMutation.isPending,
    isLoggingOut: logoutMutation.isPending,
    loginError: loginMutation.error,
    registerError: registerMutation.error,
  };
};
