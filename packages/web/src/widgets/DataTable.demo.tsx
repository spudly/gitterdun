import type {FC} from 'react';
import {useState} from 'react';
import {DataTable} from './DataTable.js';
import type {User} from './demo-utils/DataTableSampleData.js';
import {sampleUsers} from './demo-utils/DataTableSampleData.js';
import {createUserTableColumns} from './demo-utils/DataTableColumns.js';

const DataTableDemo: FC = () => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const columns = createUserTableColumns();
  const handleRowClick = (user: User) => {
    setSelectedUser(user);
  };
  return (
    <div className="space-y-6 p-4">
      <h2 className="text-2xl font-bold">DataTable Component</h2>
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Basic Table</h3>
        <DataTable
          columns={columns}
          data={sampleUsers}
          onRowClick={handleRowClick}
        />
        {selectedUser ? (
          <div className="rounded-md border border-blue-200 bg-blue-50 p-4">
            <p className="text-sm text-blue-800">
              Selected user: <strong>{selectedUser.name}</strong> (
              {selectedUser.email})
            </p>
          </div>
        ) : null}
      </div>
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Empty State</h3>
        <DataTable
          columns={columns}
          data={[]}
          emptyMessage="No users found. Try adjusting your search criteria."
        />
      </div>
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Loading State</h3>
        <DataTable columns={columns} data={[]} loading />
      </div>
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Custom Row Styling</h3>
        <DataTable
          columns={columns}
          data={sampleUsers}
          rowVariant="hoverable"
        />
      </div>
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Simplified Columns</h3>
        <DataTable
          columns={[
            {key: 'name', header: 'Name'},
            {key: 'email', header: 'Email'},
            {key: 'role', header: 'Role'},
            {key: 'status', header: 'Status'},
          ]}
          data={sampleUsers}
        />
      </div>
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Custom Styling</h3>
        <div className="rounded-md border-2 border-blue-200">
          <DataTable columns={columns} data={sampleUsers} />
        </div>
      </div>
    </div>
  );
};
export default DataTableDemo;
