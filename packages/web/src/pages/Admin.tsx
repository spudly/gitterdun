import type {FC} from 'react';
import {useState} from 'react';
import {useQuery} from '@tanstack/react-query';
import {choresApi} from '../lib/api.js';
import {useUser} from '../hooks/useUser.js';
import {PageContainer} from '../widgets/PageContainer.js';
import {PageHeader} from '../widgets/PageHeader.js';
import {FormSection} from '../widgets/FormSection.js';
import {PageLoading} from '../widgets/PageLoading.js';
import {Text} from '../widgets/Text.js';
import {Stack} from '../widgets/Stack.js';
import {Card} from '../widgets/Card.js';
import {Alert} from '../widgets/Alert.js';
import {AdminFamilyCreation} from './admin/AdminFamilyCreation.js';
import {AdminInvitations} from './admin/AdminInvitations.js';
import {AdminStats} from './admin/AdminStats.js';
import {AdminChoresManagement} from './admin/AdminChoresManagement.js';

const useAdminSetup = () => {
  const {user} = useUser();
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<'success' | 'error' | null>(
    null,
  );
  const {data: choresResponse, isLoading} = useQuery({
    queryKey: ['chores', 'admin'],
    queryFn: async () => choresApi.getAll(),
    enabled: user?.role === 'admin',
  });
  const chores = choresResponse?.data ?? [];
  const handleMessageChange = (
    newMessage: string | null,
    newType: 'success' | 'error' | null,
  ) => {
    setMessage(newMessage);
    setMessageType(newType);
  };
  return {user, message, messageType, handleMessageChange, chores, isLoading};
};

const Admin: FC = () => {
  const {user, message, messageType, handleMessageChange, chores, isLoading} =
    useAdminSetup();

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
        <FormSection title="Family Management">
          {message !== null && message !== '' ? (
            <Alert type={messageType === 'success' ? 'success' : 'error'}>
              {message}
            </Alert>
          ) : null}
          <AdminFamilyCreation onMessageChange={handleMessageChange} />
          <AdminInvitations onMessageChange={handleMessageChange} />
        </FormSection>

        <AdminStats chores={chores} />
        <AdminChoresManagement chores={chores} />
      </Stack>
    </PageContainer>
  );
};

export default Admin;
