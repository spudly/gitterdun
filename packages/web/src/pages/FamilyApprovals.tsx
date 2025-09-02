import type {FC} from 'react';
import {useMemo} from 'react';
import {useQuery, useQueryClient} from '@tanstack/react-query';
import {FormattedMessage, defineMessages, useIntl} from 'react-intl';
import {PageContainer} from '../widgets/PageContainer.js';
import {PageHeader} from '../widgets/PageHeader.js';
import {List} from '../widgets/List.js';
import {ListRow} from '../widgets/ListRow.js';
import {Button} from '../widgets/Button.js';
import {PageLoading} from '../widgets/PageLoading.js';
import {useToast} from '../widgets/ToastProvider.js';
import {choreInstancesApi} from '../lib/api.js';

const messages = defineMessages({
  header: {
    defaultMessage: 'Approve completed chores',
    id: 'pages.family.approvals.header',
  },
  loading: {
    defaultMessage: 'Loading approvals...',
    id: 'pages.family.approvals.loading',
  },
  approve: {defaultMessage: 'Approve', id: 'pages.family.approvals.approve'},
  reject: {defaultMessage: 'Reject', id: 'pages.family.approvals.reject'},
  approveFailed: {
    defaultMessage: 'Failed to update approval',
    id: 'pages.family.approvals.failed',
  },
});

const FamilyApprovals: FC = () => {
  const intl = useIntl();
  const {safeAsync} = useToast();
  const queryClient = useQueryClient();
  const {data, isLoading, refetch} = useQuery({
    queryKey: ['chore-instances', 'today', 'approvals'],
    queryFn: async () => choreInstancesApi.listForDay({date: 'today'}),
    staleTime: 10_000,
  });
  const instances = useMemo(() => {
    const all = (data?.data ?? []) as Array<{
      chore_id: number;
      title: string;
      status: 'incomplete' | 'complete';
      approval_status: 'unapproved' | 'approved' | 'rejected';
      notes?: string;
    }>;
    return all.filter(
      instance =>
        instance.status === 'complete'
        && instance.approval_status === 'unapproved',
    );
  }, [data?.data]);

  if (isLoading) {
    return (
      <PageContainer variant="centered">
        <PageLoading message={intl.formatMessage(messages.loading)} />
      </PageContainer>
    );
  }

  const handleSetApproval = (
    choreId: number,
    next: 'approved' | 'rejected',
  ) => {
    safeAsync(async () => {
      const today = new Date().toISOString();
      await choreInstancesApi.upsert({
        chore_id: choreId,
        date: today,
        approval_status: next,
      });
      await refetch();
      await queryClient.invalidateQueries({queryKey: ['chore-instances']});
    }, intl.formatMessage(messages.approveFailed))();
  };

  return (
    <PageContainer>
      <PageHeader title={intl.formatMessage(messages.header)} />
      <List>
        {instances.map(instance => (
          <ListRow
            description={instance.notes}
            key={instance.chore_id}
            right={
              <div className="flex gap-2">
                <Button
                  onClick={safeAsync(async () => {
                    handleSetApproval(instance.chore_id, 'approved');
                  }, intl.formatMessage(messages.approveFailed))}
                  size="sm"
                >
                  <FormattedMessage {...messages.approve} />
                </Button>
                <Button
                  onClick={safeAsync(async () => {
                    handleSetApproval(instance.chore_id, 'rejected');
                  }, intl.formatMessage(messages.approveFailed))}
                  size="sm"
                  variant="ghost"
                >
                  <FormattedMessage {...messages.reject} />
                </Button>
              </div>
            }
            title={instance.title}
          />
        ))}
      </List>
    </PageContainer>
  );
};

export default FamilyApprovals;
