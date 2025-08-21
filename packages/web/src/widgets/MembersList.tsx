import type {FC} from 'react';
import {FormattedMessage} from 'react-intl';

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
            <FormattedMessage
              defaultMessage="{username} ({email})"
              id="membersList.userWithEmail"
              values={{username: member.username, email: member.email}}
            />
          </span>

          <span className="text-sm text-gray-500">{member.role}</span>
        </li>
      ))}
    </ul>
  );
};
