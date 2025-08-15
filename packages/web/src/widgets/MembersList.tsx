import type {FC} from 'react';

export type MemberItem = {
  user_id: number | string;
  username: string;
  email: string;
  role: string;
};

export type MembersListProps = {readonly members: Array<MemberItem>};

export const MembersList: FC<MembersListProps> = ({members}) => {
  return (
    <ul className="space-y-1">
      {members.map(m => (
        <li className="flex justify-between" key={String(m.user_id)}>
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
