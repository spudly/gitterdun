import {FC, useState} from 'react';
import {DataTable, Column} from './DataTable.js';
import {StatusBadge} from './StatusBadge.js';
import {Button} from './Button.js';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive' | 'pending';
  lastLogin: string;
}

const DataTableDemo: FC = () => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const sampleData: User[] = [
    {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      role: 'Admin',
      status: 'active',
      lastLogin: '2024-01-15',
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane@example.com',
      role: 'User',
      status: 'active',
      lastLogin: '2024-01-14',
    },
    {
      id: 3,
      name: 'Bob Johnson',
      email: 'bob@example.com',
      role: 'User',
      status: 'inactive',
      lastLogin: '2024-01-10',
    },
    {
      id: 4,
      name: 'Alice Brown',
      email: 'alice@example.com',
      role: 'Moderator',
      status: 'pending',
      lastLogin: '2024-01-12',
    },
  ];

  const columns: Column<User>[] = [
    {
      key: 'name',
      header: 'Name',
      render: user => (
        <div className="flex items-center">
          <div className="flex-shrink-0 h-10 w-10">
            <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
              <span className="text-sm font-medium text-gray-700">
                {user.name.charAt(0)}
              </span>
            </div>
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900">{user.name}</div>
            <div className="text-sm text-gray-500">ID: {user.id}</div>
          </div>
        </div>
      ),
    },
    {key: 'email', header: 'Email'},
    {
      key: 'role',
      header: 'Role',
      render: user => (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          {user.role}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: user => (
        <StatusBadge
          status={
            user.status === 'active'
              ? 'success'
              : user.status === 'inactive'
                ? 'error'
                : 'warning'
          }
        >
          {user.status}
        </StatusBadge>
      ),
    },
    {
      key: 'lastLogin',
      header: 'Last Login',
      render: user => (
        <span className="text-sm text-gray-500">
          {new Date(user.lastLogin).toLocaleDateString()}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: _user => (
        <div className="flex space-x-2">
          <Button size="sm" variant="secondary">
            Edit
          </Button>
          <Button size="sm" variant="danger">
            Delete
          </Button>
        </div>
      ),
    },
  ];

  const handleRowClick = (user: User) => {
    setSelectedUser(user);
  };

  return (
    <div className="space-y-6 p-4">
      <h2 className="text-2xl font-bold">DataTable Component</h2>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Basic Table</h3>
        <DataTable
          data={sampleData}
          columns={columns}
          onRowClick={handleRowClick}
        />

        {selectedUser && (
          <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
            <p className="text-sm text-blue-800">
              Selected user: <strong>{selectedUser.name}</strong> (
              {selectedUser.email})
            </p>
          </div>
        )}
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Empty State</h3>
        <DataTable
          data={[]}
          columns={columns}
          emptyMessage="No users found. Try adjusting your search criteria."
        />
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Loading State</h3>
        <DataTable data={[]} columns={columns} loading />
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Custom Row Styling</h3>
        <DataTable
          data={sampleData}
          columns={columns}
          rowClassName={(_user, index) =>
            index % 2 === 0 ? 'bg-gray-50' : 'bg-white'
          }
        />
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Simplified Columns</h3>
        <DataTable
          data={sampleData}
          columns={[
            {key: 'name', header: 'Name'},
            {key: 'email', header: 'Email'},
            {key: 'role', header: 'Role'},
            {key: 'status', header: 'Status'},
          ]}
        />
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Custom Styling</h3>
        <DataTable
          data={sampleData}
          columns={columns}
          className="border-2 border-blue-200"
        />
      </div>
    </div>
  );
};

export default DataTableDemo;
