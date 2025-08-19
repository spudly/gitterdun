import type {FC} from 'react';
import {useEffect, useState} from 'react';
import {useQuery} from '@tanstack/react-query';
import {familiesApi} from '../lib/api.js';
import {PageContainer} from '../widgets/PageContainer.js';
import {FormSection} from '../widgets/FormSection.js';
import {GridContainer} from '../widgets/GridContainer.js';
import {Stack} from '../widgets/Stack.js';
import {useUser} from '../hooks/useUser.js';
import {FamilySelector} from './family/FamilySelector.js';
import {FamilyMembers} from './family/FamilyMembers.js';
import {CreateChildForm} from './family/CreateChildForm.js';
import {InviteMemberForm} from './family/InviteMemberForm.js';
import {useFamilyMutations} from './family/useFamilyMutations.js';

const useFamilySetup = () => {
  const {user} = useUser();
  const [selectedFamilyId, setSelectedFamilyId] = useState<number | null>(null);
  const [newFamilyName, setNewFamilyName] = useState('');
  const myFamiliesQuery = useQuery({
    queryKey: ['families', 'mine'],
    queryFn: async () => familiesApi.myFamilies(),
    enabled: Boolean(user),
  });
  useEffect(() => {
    const first = myFamiliesQuery.data?.data?.[0];
    if (first != null && selectedFamilyId == null) {
      const candidate = (first as {id?: unknown}).id;
      if (typeof candidate === 'number') {
        setSelectedFamilyId(candidate);
      }
    }
  }, [myFamiliesQuery.data?.data, selectedFamilyId]);
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
    useFamilyMutations(myFamiliesQuery, membersQuery);
  const familyOptions = myFamiliesQuery.data?.data ?? [];
  return {
    user,
    selectedFamilyId,
    setSelectedFamilyId,
    newFamilyName,
    setNewFamilyName,
    createFamilyMutation,
    createChildMutation,
    inviteMutation,
    familyOptions,
    membersQuery,
  };
};

const Family: FC = () => {
  const {
    user,
    selectedFamilyId,
    setSelectedFamilyId,
    newFamilyName,
    setNewFamilyName,
    createFamilyMutation,
    createChildMutation,
    inviteMutation,
    familyOptions,
    membersQuery,
  } = useFamilySetup();

  if (!user) {
    return <div>Please log in to manage your family.</div>;
  }

  return (
    <PageContainer>
      <FormSection title="Your Families">
        <FamilySelector
          families={familyOptions}
          newFamilyName={newFamilyName}
          onCreateFamily={() => {
            createFamilyMutation.mutate({name: newFamilyName});
            setNewFamilyName('');
          }}
          onFamilySelect={setSelectedFamilyId}
          onNewFamilyNameChange={setNewFamilyName}
          selectedFamilyId={selectedFamilyId}
        />
      </FormSection>

      {selectedFamilyId !== null ? (
        <GridContainer cols={2} gap="lg">
          <FormSection title="Members">
            <FamilyMembers membersData={membersQuery.data?.data} />
          </FormSection>

          <FormSection>
            <Stack gap="md">
              <CreateChildForm
                handleCreateChild={createChildMutation.mutate}
                selectedFamilyId={selectedFamilyId}
              />
              <InviteMemberForm
                handleInviteMember={inviteMutation.mutate}
                selectedFamilyId={selectedFamilyId}
              />
            </Stack>
          </FormSection>
        </GridContainer>
      ) : null}
    </PageContainer>
  );
};

export default Family;
