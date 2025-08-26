/* eslint-disable react/no-multi-comp -- Demo file with multiple related cell components */
import type {FC} from 'react';
import {StatusBadge} from '../StatusBadge.js';
import {Button} from '../Button.js';
import type {User} from './DataTableSampleData.js';

type UserCellProps = {readonly user: User};

export const UserNameCell: FC<UserCellProps> = ({user}) => {
  return (
    <div className="flex items-center gap-4">
      <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-gray-300">
        <span className="text-sm font-medium text-gray-700">
          {user.name.charAt(0)}
        </span>
      </div>
      <div>
        <div className="text-sm font-medium text-gray-900">{user.name}</div>
        <div className="text-sm text-gray-500">ID: {user.id}</div>
      </div>
    </div>
  );
};

export const UserRoleCell: FC<UserCellProps> = ({user}) => {
  return (
    <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
      {user.role}
    </span>
  );
};

export const UserStatusCell: FC<UserCellProps> = ({user}) => {
  const getStatusVariant = (status: User['status']) => {
    if (status === 'active') {
      return 'success';
    }
    if (status === 'inactive') {
      return 'error';
    }
    return 'warning';
  };

  return (
    <StatusBadge status={getStatusVariant(user.status)}>
      {user.status}
    </StatusBadge>
  );
};

export const UserLastLoginCell: FC<UserCellProps> = ({user}) => {
  return (
    <span className="text-sm text-gray-500">
      {new Date(user.lastLogin).toLocaleDateString()}
    </span>
  );
};

export const UserActionsCell: FC<UserCellProps> = ({user: _user}) => {
  return (
    <div className="flex space-x-2">
      <Button size="sm" variant="secondary">
        Edit
      </Button>
      <Button size="sm" variant="danger">
        Delete
      </Button>
    </div>
  );
};
/* eslint-enable react/no-multi-comp */
