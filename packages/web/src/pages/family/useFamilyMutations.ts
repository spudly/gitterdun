import {useMutation} from '@tanstack/react-query';
import type {UseQueryResult} from '@tanstack/react-query';
import {familiesApi, invitationsApi} from '../../lib/api.js';

type QueryWithRefetch = Pick<UseQueryResult, 'refetch'>;

export const useFamilyMutations = (
  myFamiliesQuery: QueryWithRefetch,
  membersQuery: QueryWithRefetch,
) => {
  const createFamilyMutation = useMutation({
    mutationFn: familiesApi.create,
    onSuccess: async () => {
      await myFamiliesQuery.refetch();
    },
  });

  const createChildMutation = useMutation({
    mutationFn: async (params: {
      familyId: number;
      username: string;
      email: string;
      password: string;
    }) =>
      familiesApi.createChild(params.familyId, {
        username: params.username,
        email: params.email,
        password: params.password,
      }),
    onSuccess: async () => {
      await membersQuery.refetch();
    },
  });

  const inviteMutation = useMutation({
    mutationFn: async (params: {
      familyId: number;
      email: string;
      role: 'parent' | 'child';
    }) =>
      invitationsApi.create(params.familyId, {
        email: params.email,
        role: params.role,
      }),
  });

  return {createFamilyMutation, createChildMutation, inviteMutation};
};
