import {useQuery, useMutation, useQueryClient} from '@tanstack/react-query';
import {User} from '@gitterdun/shared';
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
          return res.data as unknown as User;
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

  const login = (email: string, password: string) => {
    return loginMutation.mutateAsync({email, password});
  };

  const register = (
    username: string,
    email: string,
    password: string,
    role?: string,
  ) => {
    return registerMutation.mutateAsync({
      username,
      email,
      password,
      ...(role !== undefined ? {role} : {}),
    });
  };

  const logout = () => {
    return logoutMutation.mutateAsync();
  };

  return {
    user,
    isLoading,
    error,
    login,
    register,
    logout,
    forgotPassword: (email: string) => authApi.forgotPassword({email}),
    resetPassword: (token: string, password: string) =>
      authApi.resetPassword({token, password}),
    isLoggingIn: loginMutation.isPending,
    isRegistering: registerMutation.isPending,
    isLoggingOut: logoutMutation.isPending,
    loginError: loginMutation.error,
    registerError: registerMutation.error,
  };
};
