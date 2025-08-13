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
        // Check if user is logged in by trying to get user info
        // This would typically be a /api/auth/me endpoint
        // For now, we'll check localStorage or session
        const token = localStorage.getItem('authToken');
        if (!token) return null;

        // In a real app, you'd validate the token with the server
        // For now, return null to indicate no user
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
        // Store auth token (in a real app, this would come from the response)
        localStorage.setItem('authToken', 'dummy-token');
        queryClient.setQueryData(['user'], response.data);
      }
    },
  });

  const registerMutation = useMutation({
    mutationFn: authApi.register,
    onSuccess: response => {
      if (response.success && response.data) {
        // Store auth token (in a real app, this would come from the response)
        localStorage.setItem('authToken', 'dummy-token');
        queryClient.setQueryData(['user'], response.data);
      }
    },
  });

  const logoutMutation = useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      localStorage.removeItem('authToken');
      queryClient.setQueryData(['user'], null);
      queryClient.clear();
    },
  });

  const login = (email: string, password: string) => {
    return loginMutation.mutate({email, password});
  };

  const register = (
    username: string,
    email: string,
    password: string,
    role?: string,
  ) => {
    return registerMutation.mutate({
      username,
      email,
      password,
      ...(role !== undefined ? {role} : {}),
    });
  };

  const logout = () => {
    return logoutMutation.mutate();
  };

  return {
    user,
    isLoading,
    error,
    login,
    register,
    logout,
    isLoggingIn: loginMutation.isPending,
    isRegistering: registerMutation.isPending,
    isLoggingOut: logoutMutation.isPending,
    loginError: loginMutation.error,
    registerError: registerMutation.error,
  };
};
