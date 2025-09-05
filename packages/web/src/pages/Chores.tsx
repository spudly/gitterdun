import type {FC} from 'react';
import {useMemo, useState} from 'react';
import {useQuery, useQueryClient} from '@tanstack/react-query';
import {choreInstancesApi} from '../lib/api.js';
import {PageContainer} from '../widgets/PageContainer.js';
import {PageHeader} from '../widgets/PageHeader.js';
import {List} from '../widgets/List.js';
import {ListRow} from '../widgets/ListRow.js';
import {Checkbox} from '../widgets/Checkbox.js';
import {Button} from '../widgets/Button.js';
import {CheckCircleIcon} from '../widgets/icons/CheckCircleIcon.js';
import {PageLoading} from '../widgets/PageLoading.js';
import {FormattedMessage, defineMessages, useIntl} from 'react-intl';
import {useToast} from '../widgets/ToastProvider.js';

const messages = defineMessages({
  header: {defaultMessage: 'Chores', id: 'pages.ChoreInstances.header'},
  loading: {
    defaultMessage: 'Loading chores...',
    id: 'pages.ChoreInstances.loading',
  },
  hideCompleted: {
    defaultMessage: 'Hide completed',
    id: 'pages.ChoreInstances.hide-completed',
  },
});

const Chores: FC = () => {
  const intl = useIntl();
  const {safeAsync} = useToast();
  const queryClient = useQueryClient();
  const [hideCompleted, setHideCompleted] = useState(true);
  const {data: instancesResponse, isLoading} = useQuery({
    queryKey: ['chore-instances', 'today'],
    queryFn: async () => choreInstancesApi.listForDay({date: 'today'}),
  });
  const visibleInstances = useMemo(() => {
    const instances = (instancesResponse?.data ?? []) as
      | Awaited<ReturnType<typeof choreInstancesApi.listForDay>>['data']
      | [];
    if (!hideCompleted) {
      return instances;
    }
    return instances.filter(instance => instance.status !== 'complete');
  }, [hideCompleted, instancesResponse?.data]);

  if (isLoading) {
    return (
      <PageContainer variant="centered">
        <PageLoading message={intl.formatMessage(messages.loading)} />
      </PageContainer>
    );
  }

  // Render
  return (
    <PageContainer>
      <PageHeader title={intl.formatMessage(messages.header)} />
      <div>
        <Checkbox
          checked={hideCompleted}
          label={<FormattedMessage {...messages.hideCompleted} />}
          onChange={checked => {
            setHideCompleted(checked);
          }}
        />
      </div>

      <div>
        <List>
          {visibleInstances.map(instance => (
            <ListRow
              description={instance.notes}
              key={`${instance.chore_id}`}
              right={
                instance.status === 'complete' ? (
                  <span
                    aria-label={intl.formatMessage({
                      defaultMessage: 'Completed',
                      id: 'pages.ChoreInstances.completed',
                    })}
                    className="text-green-700"
                  >
                    <CheckCircleIcon size="sm" />
                  </span>
                ) : (
                  <Button
                    onClick={safeAsync(
                      async () => {
                        const today = new Date().toISOString();
                        const payload: {
                          chore_id: number;
                          date: string;
                          status?: 'incomplete' | 'complete';
                          approval_status?:
                            | 'unapproved'
                            | 'approved'
                            | 'rejected';
                          notes?: string;
                        } = {
                          chore_id: instance.chore_id,
                          date: today,
                          status: 'complete',
                          approval_status: instance.approval_status,
                        };
                        if (typeof instance.notes === 'string') {
                          payload.notes = instance.notes;
                        }
                        await choreInstancesApi.upsert(payload);
                        await queryClient.invalidateQueries({
                          queryKey: ['chore-instances'],
                        });
                      },
                      intl.formatMessage({
                        defaultMessage: 'Failed to complete chore',
                        id: 'pages.ChoreInstances.complete-failed',
                      }),
                    )}
                    size="sm"
                    variant="ghost"
                  >
                    <FormattedMessage
                      defaultMessage="Complete"
                      id="pages.ChoreInstances.complete"
                    />
                  </Button>
                )
              }
              title={instance.title}
            />
          ))}
        </List>
      </div>
    </PageContainer>
  );
};

export default Chores;
