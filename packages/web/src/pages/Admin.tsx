import type {FC} from 'react';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {choresApi} from '../lib/api.js';
import {useUser} from '../hooks/useUser.js';
import {PageContainer} from '../widgets/PageContainer.js';
import {PageHeader} from '../widgets/PageHeader.js';
import {PageLoading} from '../widgets/PageLoading.js';
import {Text} from '../widgets/Text.js';
import {Stack} from '../widgets/Stack.js';
import {Card} from '../widgets/Card.js';
import {FormattedMessage, defineMessages, useIntl} from 'react-intl';
import {AdminStats} from './admin/AdminStats.js';
import {AdminUsers} from './admin/AdminUsers.js';
import {AdminChoresManagement} from './admin/AdminChoresManagement.js';
import {TextInput} from '../widgets/TextInput.js';
import {Button} from '../widgets/Button.js';
import {useState} from 'react';

const useAdminSetup = () => {
  const {user} = useUser();
  const {data: choresResponse, isLoading} = useQuery({
    queryKey: ['chores', 'admin'],
    queryFn: async () => choresApi.getAll(),
    enabled: user?.role === 'admin',
  });
  const chores = choresResponse?.data ?? [];
  return {user, chores, isLoading};
};

const Admin: FC = () => {
  const {user, chores, isLoading} = useAdminSetup();
  const queryClient = useQueryClient();

  const intl = useIntl();
  const messages = defineMessages({
    createChore: {
      defaultMessage: 'Create Chore',
      id: 'pages.Admin.create-chore',
    },
    create: {defaultMessage: 'Create', id: 'pages.Admin.create'},
    titlePlaceholder: {defaultMessage: 'Title', id: 'pages.Admin.title'},
    bonusPlaceholder: {defaultMessage: 'Bonus', id: 'pages.Admin.bonus'},
  });

  const [showCreate, setShowCreate] = useState(false);
  const [title, setTitle] = useState('');
  const [points, setPoints] = useState(0);
  const [bonus, setBonus] = useState<number | ''>('');

  const createMutation = useMutation({
    mutationFn: async () =>
      choresApi.create({
        title,
        point_reward: Number(points) || 0,
        bonus_points: typeof bonus === 'number' ? bonus : 0,
        chore_type: 'required',
      }),
    onSuccess: async () => {
      setShowCreate(false);
      setTitle('');
      setPoints(0);
      setBonus('');
      await queryClient.invalidateQueries({queryKey: ['chores', 'admin']});
    },
  });
  if (!user || user.role !== 'admin') {
    return (
      <PageContainer variant="centered">
        <Card padded>
          <PageHeader
            title={intl.formatMessage({
              defaultMessage: 'Access Denied',
              id: 'pages.Admin.access-denied',
            })}
          />
          <Text muted>
            <FormattedMessage
              defaultMessage="You need admin privileges to view this page."
              id="pages.Admin.you-need-admin-privileges-to-v"
            />
          </Text>
        </Card>
      </PageContainer>
    );
  }

  if (isLoading) {
    return (
      <PageContainer variant="centered">
        <PageLoading
          message={intl.formatMessage({
            defaultMessage: 'Loading admin panel...',
            id: 'pages.Admin.loading-admin-panel',
          })}
        />
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageHeader
        title={intl.formatMessage({
          defaultMessage: 'Admin Panel',
          id: 'pages.Admin.admin-panel',
        })}
      />

      <Stack gap="md">
        <Button
          onClick={() => {
            setShowCreate(s => !s);
          }}
          variant="primary"
        >
          <FormattedMessage {...messages.createChore} />
        </Button>

        {showCreate ? (
          <Card padded>
            <Stack gap="md">
              <TextInput
                onChange={val => setTitle(val)}
                placeholder={intl.formatMessage(messages.titlePlaceholder)}
                value={title}
              />
              <input
                onChange={e => setPoints(Number(e.target.value))}
                placeholder={intl.formatMessage(messages.titlePlaceholder)}
                type="number"
                value={points}
              />
              <input
                onChange={e =>
                  setBonus(e.target.value === '' ? '' : Number(e.target.value))
                }
                placeholder={intl.formatMessage(messages.bonusPlaceholder)}
                type="number"
                value={bonus}
              />
              <Button
                disabled={title.trim() === ''}
                onClick={() => {
                  const run = async () => {
                    await createMutation.mutateAsync();
                  };
                  run();
                }}
              >
                <FormattedMessage {...messages.create} />
              </Button>
            </Stack>
          </Card>
        ) : null}
      </Stack>

      <Stack gap="lg">
        <AdminStats chores={chores} />
        <AdminUsers />
        <AdminChoresManagement chores={chores} />
      </Stack>
    </PageContainer>
  );
};

export default Admin;
