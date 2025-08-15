import type {FC} from 'react';
import { useState} from 'react';
import {useQuery} from '@tanstack/react-query';
import type {ChoreWithUsername} from '@gitterdun/shared';
import {useNavigate} from 'react-router-dom';
import {choresApi, familiesApi, invitationsApi} from '../lib/api.js';
import {useUser} from '../hooks/useUser.js';
import {PageContainer} from '../widgets/PageContainer.js';
import {PageHeader} from '../widgets/PageHeader.js';
import {GridContainer} from '../widgets/GridContainer.js';
import {StatCard} from '../widgets/StatCard.js';
import {Card} from '../widgets/Card.js';
import {List} from '../widgets/List.js';
import {ListRow} from '../widgets/ListRow.js';
import {StatusDot} from '../widgets/StatusDot.js';
import {StatusBadge} from '../widgets/StatusBadge.js';
import {Badge} from '../widgets/Badge.js';
import {Button} from '../widgets/Button.js';
import {FormSection} from '../widgets/FormSection.js';
import {TextInput} from '../widgets/TextInput.js';
import {SelectInput} from '../widgets/SelectInput.js';
import {Alert} from '../widgets/Alert.js';
import {PageLoading} from '../widgets/PageLoading.js';
import {Text} from '../widgets/Text.js';
import {Toolbar} from '../widgets/Toolbar.js';
import {Stack} from '../widgets/Stack.js';
import {InlineMeta} from '../widgets/InlineMeta.js';
import {useToast} from '../widgets/ToastProvider.js';
import {
  DocIcon,
  ClockIcon,
  CheckCircleIcon,
  SparklesIcon,
} from '../widgets/icons.js';

const Admin: FC = () => {
  const {user} = useUser();

  const {data: choresResponse, isLoading} = useQuery({
    queryKey: ['chores', 'admin'],
    queryFn: async () => choresApi.getAll(),
    enabled: !!user && user.role === 'admin',
  });

  const chores = choresResponse?.data ?? [];

  const [familyName, setFamilyName] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<'success' | 'error' | null>(
    null,
  );
  const navigate = useNavigate();
  const [inviteFamIdAdmin, setInviteFamIdAdmin] = useState<string>('');
  const [inviteEmailAdmin, setInviteEmailAdmin] = useState<string>('');
  const [inviteRoleAdmin, setInviteRoleAdmin] = useState<'parent' | 'child'>(
    'parent',
  );
  const {safeAsync} = useToast();

  if (!user || user.role !== 'admin') {
    return (
      <PageContainer variant="centered">
        <Card padded>
          <PageHeader title="Access Denied" />

          <Text muted>You need admin privileges to view this page.</Text>
        </Card>
      </PageContainer>
    );
  }

  if (isLoading) {
    return (
      <PageContainer variant="centered">
        <PageLoading message="Loading admin panel..." />
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageHeader title="Admin Panel" />

      <Stack gap="lg">
        {/* Family Management */}
        <FormSection title="Family Management">
          {message != null && message !== '' ? (
            <Alert type={messageType === 'success' ? 'success' : 'error'}>
              {message}
            </Alert>
          ) : null}

          <Toolbar>
            <TextInput
              onChange={v => {
                setFamilyName(v);
              }}
              placeholder="Family name"
              value={familyName}
            />

            <Button
              onClick={safeAsync(async () => {
                if (familyName.trim() === '') {
                  return;
                }
                try {
                  setMessage(null);
                  setMessageType(null);
                  const res = await familiesApi.create({
                    name: familyName.trim(),
                  });
                  if (res.success) {
                    setMessage('Family created. Redirecting...');
                    setMessageType('success');
                    setFamilyName('');
                    setTimeout(() => {
                      navigate('/family');
                    }, 1200);
                  } else {
                    setMessage(res.error ?? 'Failed to create family');
                    setMessageType('error');
                  }
                } catch (_e) {
                  setMessage('Failed to create family');
                  setMessageType('error');
                }
              }, 'Could not create family. Please try again.')}
              type="button"
            >
              Create Family
            </Button>
          </Toolbar>

          <Toolbar>
            <TextInput
              onChange={v => {
                setInviteFamIdAdmin(v);
              }}
              placeholder="Family ID"
              value={inviteFamIdAdmin}
            />

            <TextInput
              onChange={v => {
                setInviteEmailAdmin(v);
              }}
              placeholder="Invite email"
              value={inviteEmailAdmin}
            />

            <SelectInput
              onChange={v => {
                const role = v === 'parent' || v === 'child' ? v : 'parent';
                setInviteRoleAdmin(role);
              }}
              value={inviteRoleAdmin}
            >
              <option value="parent">Parent</option>

              <option value="child">Child</option>
            </SelectInput>

            <Button
              onClick={safeAsync(async () => {
                const famId = Number(inviteFamIdAdmin);
                if (
                  !Number.isFinite(famId)
                  || famId <= 0
                  || inviteEmailAdmin === ''
                ) {
                  setMessage('Enter family ID and email');
                  setMessageType('error');
                  return;
                }
                try {
                  setMessage(null);
                  setMessageType(null);
                  await invitationsApi.create(famId, {
                    email: inviteEmailAdmin,
                    role: inviteRoleAdmin,
                  });
                  setMessage(
                    'Invitation created (see server logs for token in dev)',
                  );
                  setMessageType('success');
                  setInviteEmailAdmin('');
                } catch (_err) {
                  setMessage('Failed to invite');
                  setMessageType('error');
                }
              }, 'Could not create invitation. Please try again.')}
              type="button"
            >
              Invite
            </Button>
          </Toolbar>
        </FormSection>

        {/* Stats Overview */}
        <GridContainer cols={4} gap="lg">
          <StatCard
            color="blue"
            icon={<DocIcon />}
            label="Total Chores"
            value={chores.length}
          />

          <StatCard
            color="yellow"
            icon={<ClockIcon />}
            label="Pending Approval"
            value={
              chores.filter((c: ChoreWithUsername) => c.status === 'completed')
                .length
            }
          />

          <StatCard
            color="green"
            icon={<CheckCircleIcon />}
            label="Approved"
            value={
              chores.filter((c: ChoreWithUsername) => c.status === 'approved')
                .length
            }
          />

          <StatCard
            color="purple"
            icon={<SparklesIcon />}
            label="Bonus Chores"
            value={
              chores.filter((c: ChoreWithUsername) => c.chore_type === 'bonus')
                .length
            }
          />
        </GridContainer>

        {/* Chores Management */}
        <Card
          header={
            <Text as="h2" size="lg" weight="medium">
              Chores Management
            </Text>
          }
        >
          <List>
            {chores.map((chore: ChoreWithUsername) => (
              <ListRow
                description={chore.description}
                key={chore.id}
                left={
                  <StatusDot
                    color={
                      chore.status === 'completed'
                        ? 'green'
                        : chore.status === 'approved'
                          ? 'blue'
                          : 'yellow'
                    }
                    size={12}
                  />
                }
                meta={
                  <InlineMeta>
                    <span>Points: {chore.point_reward}</span>

                    {chore.bonus_points > 0 && (
                      <span>Bonus: +{chore.bonus_points}</span>
                    )}

                    {chore.penalty_points > 0 && (
                      <span>Penalty: -{chore.penalty_points}</span>
                    )}

                    {chore.due_date != null ? (
                      <span>
                        Due: {new Date(chore.due_date).toLocaleDateString()}
                      </span>
                    ) : null}
                  </InlineMeta>
                }
                right={
                  <Toolbar>
                    {chore.status === 'completed' && (
                      <>
                        <Button size="sm" variant="primary">
                          Approve
                        </Button>

                        <Button size="sm" variant="danger">
                          Reject
                        </Button>
                      </>
                    )}

                    <Button size="sm" variant="secondary">
                      Edit
                    </Button>
                  </Toolbar>
                }
                title={chore.title}
                titleRight={
                  <>
                    <StatusBadge
                      status={
                        chore.status === 'completed'
                          ? 'completed'
                          : chore.status === 'approved'
                            ? 'approved'
                            : 'pending'
                      }
                    >
                      {chore.status}
                    </StatusBadge>

                    {chore.chore_type === 'bonus' && (
                      <Badge variant="purple">Bonus</Badge>
                    )}
                  </>
                }
              />
            ))}
          </List>
        </Card>
      </Stack>
    </PageContainer>
  );
};

export default Admin;
