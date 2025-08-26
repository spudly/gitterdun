import type {FC} from 'react';
import {useQuery, useMutation, useQueryClient} from '@tanstack/react-query';
import {usersApi} from '../../lib/api.js';
import {Section} from '../../widgets/Section.js';
import {DataTable} from '../../widgets/DataTable.js';
import {Button} from '../../widgets/Button.js';
import {FormattedMessage} from 'react-intl';
import {useToast} from '../../widgets/ToastProvider.js';

type UserRow = {
  id: number;
  username: string;
  email: string | null;
  role: 'admin' | 'user';
  points: number;
  streak_count: number;
  created_at: string;
  updated_at: string;
};

export const AdminUsers: FC = () => {
  const queryClient = useQueryClient();
  const {safeAsync} = useToast();
  const listQuery = useQuery({
    queryKey: ['admin', 'users'],
    queryFn: async () => usersApi.list(),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => usersApi.delete(id),
  });

  const rows: Array<UserRow> = listQuery.data?.data ?? [];

  return (
    <Section header="Users">
      <DataTable
        columns={[
          {header: 'ID', key: 'id'},
          {header: 'Username', key: 'username'},
          {header: 'Email', key: 'email'},
          {header: 'Role', key: 'role'},
          {header: 'Points', key: 'points', align: 'right'},
          {header: 'Streak', key: 'streak_count', align: 'right'},
          {
            header: 'Actions',
            key: 'actions',
            render: (row: UserRow) => (
              <Button
                color="red"
                onClick={() => {
                  const run = safeAsync(async () => {
                    await deleteMutation.mutateAsync(row.id);
                    await queryClient.invalidateQueries({
                      queryKey: ['admin', 'users'],
                    });
                  }, 'Failed to delete user');
                  run();
                }}
                size="sm"
              >
                <FormattedMessage
                  defaultMessage="Delete"
                  id="admin.users.delete"
                />
              </Button>
            ),
          },
        ]}
        data={rows}
      />
    </Section>
  );
};
