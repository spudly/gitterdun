import {useQuery, useMutation, useQueryClient} from '@tanstack/react-query';
import {UserSchema} from '@gitterdun/shared';
import type {User} from '@gitterdun/shared';
import {authApi} from '../lib/api.js';

const NO_DATA_SUCCESS = {__noData: true} as const;

const isNoDataSuccess = (value: unknown): value is typeof NO_DATA_SUCCESS => {
  if (value === null || typeof value !== 'object') {
    return false;
  }
  return (
    Object.prototype.hasOwnProperty.call(value, '__noData')
    && (value as {__noData?: boolean}).__noData === true
  );
};

type UserQueryData = User | null | typeof NO_DATA_SUCCESS;

export const useUser = () => {
  const queryClient = useQueryClient();

  const {
    data: rawUser,
    isLoading,
    error,
  } = useQuery<UserQueryData>({
    queryKey: ['user'],
    queryFn: async (): Promise<UserQueryData> => {
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
    },
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

  const login = async (email: string, password: string) =>
    loginMutation.mutateAsync({email, password});

  const register = async (
    username: string,
    email: string,
    password: string,
    role?: string,
  ) =>
    registerMutation.mutateAsync({
      username,
      email,
      password,
      ...(role === undefined ? {} : {role}),
    });

  const logout = async () => logoutMutation.mutateAsync();

  const user: User | null | undefined = isNoDataSuccess(rawUser)
    ? undefined
    : (rawUser ?? null);

  return {
    user,
    isLoading,
    error,
    login,
    register,
    logout,
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
