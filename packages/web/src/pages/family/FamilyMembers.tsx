import type {FC} from 'react';
import {FamilyMemberSchema} from '@gitterdun/shared';
import {MembersList} from '../../widgets/MembersList.js';

type FamilyMembersProps = {readonly membersData: unknown};

export const FamilyMembers: FC<FamilyMembersProps> = ({membersData}) => {
  const parsed = FamilyMemberSchema.array().safeParse(membersData);
  const members = parsed.success ? parsed.data : [];
  return <MembersList members={members} />;
};
