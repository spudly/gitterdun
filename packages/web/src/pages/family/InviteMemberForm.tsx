import type {FC} from 'react';
import {useState} from 'react';
import {Button} from '../../widgets/Button.js';
import {TextInput} from '../../widgets/TextInput.js';
import {SelectInput} from '../../widgets/SelectInput.js';
import {Toolbar} from '../../widgets/Toolbar.js';
import {Stack} from '../../widgets/Stack.js';
import {Text} from '../../widgets/Text.js';

type InviteMemberFormProps = {
  readonly handleInviteMember: (data: {
    familyId: number;
    email: string;
    role: 'parent' | 'child';
  }) => void;
  readonly selectedFamilyId: number | null;
};

export const InviteMemberForm: FC<InviteMemberFormProps> = ({
  handleInviteMember,
  selectedFamilyId,
}) => {
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<'parent' | 'child'>('parent');

  return (
    <Stack gap="sm">
      <Text as="h3" weight="semibold">
        Invite Member
      </Text>

      <Toolbar>
        <TextInput
          onChange={val => {
            setInviteEmail(val);
          }}
          placeholder="Email"
          type="email"
          value={inviteEmail}
        />

        <SelectInput
          onChange={val => {
            const role = val === 'parent' || val === 'child' ? val : 'parent';
            setInviteRole(role);
          }}
          value={inviteRole}
        >
          <option value="parent">Parent</option>
          <option value="child">Child</option>
        </SelectInput>

        <Button
          onClick={() => {
            if (selectedFamilyId === null || inviteEmail.trim() === '') {
              return;
            }
            handleInviteMember({
              familyId: selectedFamilyId,
              email: inviteEmail,
              role: inviteRole,
            });
            setInviteEmail('');
          }}
          type="button"
        >
          Send
        </Button>
      </Toolbar>
    </Stack>
  );
};
