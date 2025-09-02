import type {FC} from 'react';
import {useState} from 'react';
import {Button} from '../../widgets/Button.js';
import {defineMessages, useIntl} from 'react-intl';
import {Stack} from '../../widgets/Stack.js';
import {CreateChildForm} from './CreateChildForm.js';
import {InviteMemberForm} from './InviteMemberForm.js';
import {Modal} from '../../widgets/Modal.js';
import {FamilyMemberSchema} from '@gitterdun/shared';
import {MembersList} from '../../widgets/MembersList.js';

type FamilyMembersProps = {
  readonly membersData: unknown;
  readonly selectedFamilyId: number | null;
  readonly handleCreateChild: (data: {
    familyId: number;
    username: string;
    email: string | undefined;
    password: string;
  }) => void;
  readonly handleInviteMember: (data: {
    familyId: number;
    email: string;
    role: 'parent' | 'child';
  }) => void;
};

export const FamilyMembers: FC<FamilyMembersProps> = ({
  membersData,
  selectedFamilyId,
  handleCreateChild,
  handleInviteMember,
}) => {
  const intl = useIntl();
  const messages = defineMessages({
    addFamilyMember: {
      defaultMessage: 'Add Family Member',
      id: 'pages.Family.add-family-member',
    },
  });
  const [showAdd, setShowAdd] = useState(false);
  const parsed = FamilyMemberSchema.array().safeParse(membersData);
  const members = parsed.success ? parsed.data : [];
  return (
    <Stack gap="sm">
      <MembersList members={members} />
      <Button
        onClick={() => {
          setShowAdd(true);
        }}
        variant="secondary"
      >
        {intl.formatMessage(messages.addFamilyMember)}
      </Button>
      <Modal
        isOpen={showAdd}
        onClose={() => {
          setShowAdd(false);
        }}
        size="lg"
        title={intl.formatMessage(messages.addFamilyMember)}
      >
        <Stack gap="md">
          <CreateChildForm
            handleCreateChild={handleCreateChild}
            selectedFamilyId={selectedFamilyId}
          />
          <InviteMemberForm
            handleInviteMember={handleInviteMember}
            selectedFamilyId={selectedFamilyId}
          />
        </Stack>
      </Modal>
    </Stack>
  );
};
