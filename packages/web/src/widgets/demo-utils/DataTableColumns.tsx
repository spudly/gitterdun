import type {Column} from '../DataTable.js';
import type {User} from './DataTableSampleData.js';
import {
  UserNameCell,
  UserRoleCell,
  UserStatusCell,
  UserLastLoginCell,
  UserActionsCell,
} from './DataTableCells.js';

export const createUserTableColumns = (): Array<Column<User>> => [
  {key: 'name', header: 'Name', render: user => <UserNameCell user={user} />},
  {key: 'email', header: 'Email'},
  {key: 'role', header: 'Role', render: user => <UserRoleCell user={user} />},
  {
    key: 'status',
    header: 'Status',
    render: user => <UserStatusCell user={user} />,
  },
  {
    key: 'lastLogin',
    header: 'Last Login',
    render: user => <UserLastLoginCell user={user} />,
  },
  {
    key: 'actions',
    header: 'Actions',
    render: user => <UserActionsCell user={user} />,
  },
];
