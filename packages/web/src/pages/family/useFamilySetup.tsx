import {useEffect, useState} from 'react';
import {useQuery} from '@tanstack/react-query';
import {familiesApi} from '../../lib/api.js';
import {useFamilyMutations} from './useFamilyMutations.js';

export const useFamilySetup = (user: {id?: number} | null) => {
  const [selectedFamilyId, setSelectedFamilyId] = useState<number | null>(null);
  const [newFamilyName, setNewFamilyName] = useState('');
  const myFamilyQuery = useQuery({
    queryKey: ['family', 'mine'],
    queryFn: async () => familiesApi.myFamily(),
    enabled: Boolean(user),
  });
  const tzQuery = useQuery({
    queryKey: ['timezones'],
    queryFn: async () => {
      try {
        const vals = (
          Intl as unknown as {
            supportedValuesOf?: (key: string) => Array<string>;
          }
        ).supportedValuesOf?.('timeZone');
        const list = Array.isArray(vals) && vals.length > 0 ? vals : ['UTC'];
        return {success: true, data: list} as const;
      } catch {
        return {success: true, data: ['UTC']} as const;
      }
    },
  });
  useEffect(() => {
    const fam = myFamilyQuery.data?.data;
    if (fam != null && selectedFamilyId == null) {
      const candidate = (fam as {id?: unknown}).id;
      if (typeof candidate === 'number') {
        setSelectedFamilyId(candidate);
      }
    }
  }, [myFamilyQuery.data?.data, selectedFamilyId]);
  const membersQuery = useQuery({
    queryKey: ['family', selectedFamilyId, 'members'],
    queryFn: async () => {
      if (selectedFamilyId == null) {
        return {success: true, data: []};
      }
      return familiesApi.listMembers(selectedFamilyId);
    },
    enabled: selectedFamilyId != null,
  });
  const {createFamilyMutation, createChildMutation, inviteMutation} =
    useFamilyMutations(myFamilyQuery, membersQuery);
  const family = (myFamilyQuery.data?.data ?? null) as {
    id?: number;
    timezone?: string;
  } | null;
  return {
    selectedFamilyId,
    newFamilyName,
    setNewFamilyName,
    createFamilyMutation,
    createChildMutation,
    inviteMutation,
    family,
    membersQuery,
    myFamilyQuery,
    tzQuery,
  };
};
