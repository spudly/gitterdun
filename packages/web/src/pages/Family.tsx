import type {FC} from 'react';
import {useEffect, useState} from 'react';
import {useQuery, useMutation} from '@tanstack/react-query';
import {familiesApi, invitationsApi} from '../lib/api.js';
import {FamilyMemberSchema} from '@gitterdun/shared';
import {PageContainer} from '../widgets/PageContainer.js';
import {FormSection} from '../widgets/FormSection.js';
import {MembersList} from '../widgets/MembersList.js';
import {Toolbar} from '../widgets/Toolbar.js';
import {TextInput} from '../widgets/TextInput.js';
import {SelectInput} from '../widgets/SelectInput.js';
import {Button} from '../widgets/Button.js';
import {GridContainer} from '../widgets/GridContainer.js';
import {Stack} from '../widgets/Stack.js';
import {Text} from '../widgets/Text.js';
import {useUser} from '../hooks/useUser.js';

const Family: FC = () => {
  const {user} = useUser();
  const [selectedFamilyId, setSelectedFamilyId] = useState<number | null>(null);
  const [newFamilyName, setNewFamilyName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<'parent' | 'child'>('parent');
  const [childUsername, setChildUsername] = useState('');
  const [childEmail, setChildEmail] = useState('');
  const [childPassword, setChildPassword] = useState('');

  const myFamiliesQuery = useQuery({
    queryKey: ['families', 'mine'],
    queryFn: async () => familiesApi.myFamilies(),
    enabled: Boolean(user),
  });

  useEffect(() => {
    const first = myFamiliesQuery.data?.data?.[0];
    if (first !== undefined && selectedFamilyId === undefined) {
      const candidate = (first as {id?: unknown}).id;
      if (typeof candidate === 'number') {
        setSelectedFamilyId(candidate);
      }
    }
  }, [myFamiliesQuery.data, selectedFamilyId]);

  const membersQuery = useQuery({
    queryKey: ['families', selectedFamilyId, 'members'],
    queryFn: async () => {
      if (selectedFamilyId == null) {
        return {success: true, data: []};
      }
      return familiesApi.listMembers(selectedFamilyId);
    },
    enabled: selectedFamilyId !== null,
  });

  const createFamilyMutation = useMutation({
    mutationFn: familiesApi.create,
    onSuccess: async () => myFamiliesQuery.refetch(),
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
    onSuccess: async () => membersQuery.refetch(),
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

  if (!user) {
    return <div>Please log in to manage your family.</div>;
  }

  const familyOptions = myFamiliesQuery.data?.data ?? [];

  return (
    <PageContainer>
      <FormSection title="Your Families">
        <Toolbar>
          <SelectInput
            onChange={val => {
              const parsed = Number(val);
              setSelectedFamilyId(Number.isNaN(parsed) ? null : parsed);
            }}
            value={selectedFamilyId ?? ''}
          >
            <option disabled value="">
              Select a family
            </option>

            {familyOptions.map(family => (
              <option key={family.id} value={family.id}>
                {family.name}
              </option>
            ))}
          </SelectInput>

          <TextInput
            onChange={val => {
              setNewFamilyName(val);
            }}
            placeholder="New family name"
            value={newFamilyName}
          />

          <Button
            onClick={() => {
              if (newFamilyName.trim() === '') {
                return;
              }
              createFamilyMutation.mutate({name: newFamilyName.trim()});
              setNewFamilyName('');
            }}
            type="button"
          >
            Create
          </Button>
        </Toolbar>
      </FormSection>

      {selectedFamilyId ? (
        <GridContainer cols={2} gap="lg">
          <FormSection title="Members">
            {/* Parse API data using zod schema to avoid any */}
            {(() => {
              const parsed = FamilyMemberSchema.array().safeParse(
                membersQuery.data?.data ?? [],
              );
              const members = parsed.success ? parsed.data : [];
              return <MembersList members={members} />;
            })()}
          </FormSection>

          <FormSection>
            <Stack gap="md">
              <div>
                <Stack gap="sm">
                  <Text as="h3" weight="semibold">
                    Create Child Account
                  </Text>

                  <Stack gap="sm">
                    <TextInput
                      onChange={val => {
                        setChildUsername(val);
                      }}
                      placeholder="Username"
                      value={childUsername}
                    />

                    <TextInput
                      onChange={val => {
                        setChildEmail(val);
                      }}
                      placeholder="Email"
                      type="email"
                      value={childEmail}
                    />

                    <TextInput
                      onChange={val => {
                        setChildPassword(val);
                      }}
                      placeholder="Password"
                      type="password"
                      value={childPassword}
                    />

                    <Button
                      onClick={() => {
                        if (
                          childUsername === ''
                          || childEmail === ''
                          || childPassword === ''
                        ) {
                          return;
                        }
                        createChildMutation.mutate({
                          familyId: selectedFamilyId,
                          username: childUsername,
                          email: childEmail,
                          password: childPassword,
                        });
                        setChildUsername('');
                        setChildEmail('');
                        setChildPassword('');
                      }}
                      type="button"
                    >
                      Create
                    </Button>
                  </Stack>
                </Stack>
              </div>

              <div>
                <Stack gap="sm">
                  <Text as="h3" weight="semibold">
                    Invite Member
                  </Text>

                  <Toolbar>
                    <TextInput
                      onChange={val => {
                        setInviteEmail(val);
                      }}
                      placeholder="Email"
                      type="email"
                      value={inviteEmail}
                    />

                    <SelectInput
                      onChange={val => {
                        const role =
                          val === 'parent' || val === 'child' ? val : 'parent';
                        setInviteRole(role);
                      }}
                      value={inviteRole}
                    >
                      <option value="parent">Parent</option>

                      <option value="child">Child</option>
                    </SelectInput>

                    <Button
                      onClick={() => {
                        if (inviteEmail === '') {
                          return;
                        }
                        inviteMutation.mutate({
                          familyId: selectedFamilyId,
                          email: inviteEmail,
                          role: inviteRole,
                        });
                        setInviteEmail('');
                      }}
                      type="button"
                    >
                      Send
                    </Button>
                  </Toolbar>
                </Stack>
              </div>
            </Stack>
          </FormSection>
        </GridContainer>
      ) : null}
    </PageContainer>
  );
};

export default Family;
