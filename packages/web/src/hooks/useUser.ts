import {useQuery, useMutation, useQueryClient} from '@tanstack/react-query';
import {UserSchema} from '@gitterdun/shared';
import type {User} from '@gitterdun/shared';
import {authApi} from '../lib/api.js';

export const useUser = () => {
  const queryClient = useQueryClient();

  const {
    data: user,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['user'],
    queryFn: async (): Promise<User | null> => {
      try {
        const res = await authApi.me();
        if (res.success && res.data) {
          return UserSchema.parse(res.data);
        }
        return null;
      } catch (_error) {
        return null;
      }
    },
    staleTime: 1000 * 60 * 60, // 1 hour
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

  const login = async (email: string, password: string) => {
    return loginMutation.mutateAsync({email, password});
  };

  const register = async (
    username: string,
    email: string,
    password: string,
    role?: string,
  ) => {
    return registerMutation.mutateAsync({
      username,
      email,
      password,
      ...(role === undefined ? {} : {role}),
    });
  };

  const logout = async () => {
    return logoutMutation.mutateAsync();
  };

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
