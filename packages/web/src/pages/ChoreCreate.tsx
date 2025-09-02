import type {FC} from 'react';
import {useQuery} from '@tanstack/react-query';
import {familiesApi} from '../lib/api.js';
import {useUser} from '../hooks/useUser.js';
import {PageContainer} from '../widgets/PageContainer.js';
import {PageHeader} from '../widgets/PageHeader.js';
import {ChoresCreatePageContainer} from './chores/ChoresCreatePageContainer.js';
import {useNavigate} from 'react-router-dom';
import {useToast} from '../widgets/ToastProvider.js';

const ChoreCreate: FC = () => {
  const {user} = useUser();
  const {safeAsync} = useToast();
  const navigate = useNavigate();
  const {data: myFamily} = useQuery({
    queryKey: ['family', 'mine', user?.id],
    queryFn: async () => familiesApi.myFamily(),
    enabled: Boolean(user),
    staleTime: 60_000,
  });
  const selectedFamilyId = ((): number | null => {
    const fam = myFamily?.data;
    const candidate =
      fam && typeof (fam as {id?: unknown}).id === 'number'
        ? (fam as {id: number}).id
        : null;
    return candidate;
  })();
  const {data: membersData} = useQuery({
    queryKey: ['family', selectedFamilyId, 'members'],
    queryFn: async () => {
      if (selectedFamilyId == null) {
        return {success: true, data: []} as const;
      }
      return familiesApi.listMembers(selectedFamilyId);
    },
    enabled: selectedFamilyId != null,
    staleTime: 30_000,
  });

  return (
    <PageContainer>
      <PageHeader title="Add Chore" />
      <div className="rounded bg-white p-4 shadow">
        <ChoresCreatePageContainer
          members={
            Array.isArray(membersData?.data)
              ? membersData.data.map(member => ({
                  user_id: member.user_id,
                  username: member.username,
                }))
              : []
          }
          onCancel={safeAsync(async () => {
            await navigate('/family');
          }, 'Unable to navigate')}
          userId={typeof user?.id === 'number' ? user.id : 0}
        />
      </div>
    </PageContainer>
  );
};

export default ChoreCreate;
