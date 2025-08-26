import type {FC} from 'react';
import {useQuery} from '@tanstack/react-query';
import {choresApi} from '../lib/api.js';
import {useUser} from '../hooks/useUser.js';
import {PageContainer} from '../widgets/PageContainer.js';
import {PageHeader} from '../widgets/PageHeader.js';
import {PageLoading} from '../widgets/PageLoading.js';
import {Text} from '../widgets/Text.js';
import {Stack} from '../widgets/Stack.js';
import {Card} from '../widgets/Card.js';
import {FormattedMessage, useIntl} from 'react-intl';
import {AdminStats} from './admin/AdminStats.js';
import {AdminChoresManagement} from './admin/AdminChoresManagement.js';
import {AdminUsers} from './admin/AdminUsers.js';

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

  const intl = useIntl();
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

      <Stack gap="lg">
        <AdminStats chores={chores} />
        <AdminChoresManagement chores={chores} />
        <AdminUsers />
      </Stack>
    </PageContainer>
  );
};

export default Admin;
