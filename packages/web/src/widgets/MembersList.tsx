import type {FC} from 'react';

type MemberItem = {
  user_id: number | string;
  username: string;
  email: string;
  role: string;
};

type MembersListProps = {readonly members: Array<MemberItem>};

export const MembersList: FC<MembersListProps> = ({members}) => {
  return (
    <ul className="space-y-1">
      {members.map(member => (
        <li className="flex justify-between" key={String(member.user_id)}>
          <span>
            {member.username} ({member.email})
          </span>

          <span className="text-sm text-gray-500">{member.role}</span>
        </li>
      ))}
    </ul>
  );
};

export default MembersList;
