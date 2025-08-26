import type {FC} from 'react';
import {FormattedMessage, useIntl} from 'react-intl';
import {useEffect, useState} from 'react';
import {useQuery} from '@tanstack/react-query';
import {familiesApi} from '../lib/api.js';
import {PageContainer} from '../widgets/PageContainer.js';
import {FormSection} from '../widgets/FormSection.js';
import {GridContainer} from '../widgets/GridContainer.js';
import {Stack} from '../widgets/Stack.js';
import {TextInput} from '../widgets/TextInput.js';
import {Button} from '../widgets/Button.js';
import {useUser} from '../hooks/useUser.js';
import {FamilyMembers} from './family/FamilyMembers.js';
import {CreateChildForm} from './family/CreateChildForm.js';
import {InviteMemberForm} from './family/InviteMemberForm.js';
import {useFamilyMutations} from './family/useFamilyMutations.js';

const useFamilySetup = () => {
  const {user} = useUser();
  const [selectedFamilyId, setSelectedFamilyId] = useState<number | null>(null);
  const [newFamilyName, setNewFamilyName] = useState('');
  const myFamilyQuery = useQuery({
    queryKey: ['family', 'mine'],
    queryFn: async () => familiesApi.myFamily(),
    enabled: Boolean(user),
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
  const familyOptions = myFamilyQuery.data?.data
    ? [myFamilyQuery.data.data]
    : [];
  return {
    user,
    selectedFamilyId,
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
  const intl = useIntl();
  const {
    user,
    selectedFamilyId,
    newFamilyName,
    setNewFamilyName,
    createFamilyMutation,
    createChildMutation,
    inviteMutation,
    familyOptions,
    membersQuery,
  } = useFamilySetup();

  if (!user) {
    return (
      <div>
        <FormattedMessage
          defaultMessage="Please log in to manage your family."
          id="pages.Family.please-log-in-to-manage-your-f"
        />
      </div>
    );
  }

  return (
    <PageContainer>
      <FormSection
        title={intl.formatMessage({
          defaultMessage: 'Your Family',
          id: 'pages.Family.your-family',
        })}
      >
        {familyOptions.length === 0 ? (
          <Stack gap="md">
            <div>
              <TextInput
                onChange={val => {
                  setNewFamilyName(val);
                }}
                placeholder={intl.formatMessage({
                  defaultMessage: 'New family name',
                  id: 'pages.family.FamilySelector.new-family-name',
                })}
                value={newFamilyName}
              />
            </div>
            <Button
              onClick={() => {
                if (newFamilyName.trim() === '') {
                  return;
                }
                createFamilyMutation.mutate({name: newFamilyName});
                setNewFamilyName('');
              }}
            >
              {intl.formatMessage({
                defaultMessage: 'Create',
                id: 'pages.family.FamilySelector.create',
              })}
            </Button>
          </Stack>
        ) : null}
      </FormSection>

      {selectedFamilyId !== null ? (
        <GridContainer cols={2} gap="lg">
          <FormSection
            title={intl.formatMessage({
              defaultMessage: 'Members',
              id: 'pages.Family.members',
            })}
          >
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
