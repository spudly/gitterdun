import type {FC} from 'react';
import {useState} from 'react';
import {Button} from '../../widgets/Button.js';
import {TextInput} from '../../widgets/TextInput.js';
import {SelectInput} from '../../widgets/SelectInput.js';
import {Toolbar} from '../../widgets/Toolbar.js';
import {Stack} from '../../widgets/Stack.js';
import {Text} from '../../widgets/Text.js';
import {defineMessages, useIntl} from 'react-intl';

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
  const intl = useIntl();

  const messages = defineMessages({
    header: {defaultMessage: 'Invite Member'},
    placeholderEmail: {defaultMessage: 'Email'},
    optionParent: {defaultMessage: 'Parent'},
    optionChild: {defaultMessage: 'Child'},
    send: {defaultMessage: 'Send'},
  });

  return (
    <Stack gap="sm">
      <Text as="h3" weight="semibold">
        {intl.formatMessage(messages.header)}
      </Text>

      <Toolbar>
        <TextInput
          onChange={val => {
            setInviteEmail(val);
          }}
          placeholder={intl.formatMessage(messages.placeholderEmail)}
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
          <option value="parent">
            {intl.formatMessage(messages.optionParent)}
          </option>
          <option value="child">
            {intl.formatMessage(messages.optionChild)}
          </option>
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
          {intl.formatMessage(messages.send)}
        </Button>
      </Toolbar>
    </Stack>
  );
};
