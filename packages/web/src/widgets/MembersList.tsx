import {FC} from 'react';

export interface MemberItem {
  user_id: number | string;
  username: string;
  email: string;
  role: string;
}

export interface MembersListProps {
  members: MemberItem[];
}

export const MembersList: FC<MembersListProps> = ({members}) => {
  return (
    <ul className="space-y-1">
      {members.map(m => (
        <li key={String(m.user_id)} className="flex justify-between">
          <span>
            {m.username} ({m.email})
          </span>
          <span className="text-sm text-gray-500">{m.role}</span>
        </li>
      ))}
    </ul>
  );
};

export default MembersList;
