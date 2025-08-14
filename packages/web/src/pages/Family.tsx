import {FC, useEffect, useState} from 'react';
import {useQuery, useMutation} from '@tanstack/react-query';
import {familiesApi, invitationsApi} from '../lib/api.js';
import {PageContainer} from '../widgets/PageContainer.js';
import {FormSection} from '../widgets/FormSection.js';
import {MembersList} from '../widgets/MembersList.js';
import {Toolbar} from '../widgets/Toolbar.js';
// import {FormField} from '../widgets/FormField.js';
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
    queryFn: () => familiesApi.myFamilies(),
    enabled: !!user,
  });

  useEffect(() => {
    const first = myFamiliesQuery.data?.data?.[0];
    if (first && !selectedFamilyId) {
      setSelectedFamilyId(first.id);
    }
  }, [myFamiliesQuery.data, selectedFamilyId]);

  const membersQuery = useQuery({
    queryKey: ['families', selectedFamilyId, 'members'],
    queryFn: () => familiesApi.listMembers(selectedFamilyId as number),
    enabled: !!selectedFamilyId,
  });

  const createFamilyMutation = useMutation({
    mutationFn: familiesApi.create,
    onSuccess: () => myFamiliesQuery.refetch(),
  });

  const createChildMutation = useMutation({
    mutationFn: (p: {
      familyId: number;
      username: string;
      email: string;
      password: string;
    }) =>
      familiesApi.createChild(p.familyId, {
        username: p.username,
        email: p.email,
        password: p.password,
      }),
    onSuccess: () => membersQuery.refetch(),
  });

  const inviteMutation = useMutation({
    mutationFn: (p: {
      familyId: number;
      email: string;
      role: 'parent' | 'child';
    }) => invitationsApi.create(p.familyId, {email: p.email, role: p.role}),
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
            value={selectedFamilyId ?? ''}
            onChange={val => setSelectedFamilyId(Number(val))}
          >
            <option value="" disabled>
              Select a family
            </option>
            {familyOptions.map(f => (
              <option key={f.id} value={f.id}>
                {f.name}
              </option>
            ))}
          </SelectInput>
          <TextInput
            placeholder="New family name"
            value={newFamilyName}
            onChange={val => setNewFamilyName(val)}
          />
          <Button
            type="button"
            onClick={() => {
              if (!newFamilyName.trim()) {
                return;
              }
              createFamilyMutation.mutate({name: newFamilyName.trim()});
              setNewFamilyName('');
            }}
          >
            Create
          </Button>
        </Toolbar>
      </FormSection>

      {selectedFamilyId && (
        <GridContainer cols={2} gap="lg">
          <FormSection title="Members">
            <MembersList members={(membersQuery.data?.data ?? []) as any} />
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
                      placeholder="Username"
                      value={childUsername}
                      onChange={val => setChildUsername(val)}
                    />
                    <TextInput
                      placeholder="Email"
                      type="email"
                      value={childEmail}
                      onChange={val => setChildEmail(val)}
                    />
                    <TextInput
                      placeholder="Password"
                      type="password"
                      value={childPassword}
                      onChange={val => setChildPassword(val)}
                    />
                    <Button
                      type="button"
                      onClick={() => {
                        if (!childUsername || !childEmail || !childPassword) {
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
                      placeholder="Email"
                      type="email"
                      value={inviteEmail}
                      onChange={val => setInviteEmail(val)}
                    />
                    <SelectInput
                      value={inviteRole}
                      onChange={val => setInviteRole(val as 'parent' | 'child')}
                    >
                      <option value="parent">Parent</option>
                      <option value="child">Child</option>
                    </SelectInput>
                    <Button
                      type="button"
                      onClick={() => {
                        if (!inviteEmail) {
                          return;
                        }
                        inviteMutation.mutate({
                          familyId: selectedFamilyId,
                          email: inviteEmail,
                          role: inviteRole,
                        });
                        setInviteEmail('');
                      }}
                    >
                      Send
                    </Button>
                  </Toolbar>
                </Stack>
              </div>
            </Stack>
          </FormSection>
        </GridContainer>
      )}
    </PageContainer>
  );
};

export default Family;
