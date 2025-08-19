import type {FC} from 'react';
import {useState} from 'react';
import {invitationsApi} from '../../lib/api.js';
import {Button} from '../../widgets/Button.js';
import {TextInput} from '../../widgets/TextInput.js';
import {SelectInput} from '../../widgets/SelectInput.js';

import {Toolbar} from '../../widgets/Toolbar.js';
import {useToast} from '../../widgets/ToastProvider.js';

type AdminInvitationsProps = {
  readonly onMessageChange: (
    message: string | null,
    type: 'success' | 'error' | null,
  ) => void;
};

export const AdminInvitations: FC<AdminInvitationsProps> = ({
  onMessageChange,
}) => {
  const [inviteFamIdAdmin, setInviteFamIdAdmin] = useState<string>('');
  const [inviteEmailAdmin, setInviteEmailAdmin] = useState<string>('');
  const [inviteRoleAdmin, setInviteRoleAdmin] = useState<'parent' | 'child'>(
    'parent',
  );
  const {safeAsync} = useToast();

  return (
    <Toolbar>
      <TextInput
        onChange={value => {
          setInviteFamIdAdmin(value);
        }}
        placeholder="Family ID"
        value={inviteFamIdAdmin}
      />

      <TextInput
        onChange={value => {
          setInviteEmailAdmin(value);
        }}
        placeholder="Invite email"
        value={inviteEmailAdmin}
      />

      <SelectInput
        onChange={value => {
          const role =
            value === 'parent' || value === 'child' ? value : 'parent';
          setInviteRoleAdmin(role);
        }}
        value={inviteRoleAdmin}
      >
        <option value="parent">Parent</option>
        <option value="child">Child</option>
      </SelectInput>

      <Button
        onClick={safeAsync(async () => {
          const famId = Number(inviteFamIdAdmin);
          if (
            !Number.isFinite(famId)
            || famId <= 0
            || inviteEmailAdmin === ''
          ) {
            onMessageChange('Enter family ID and email', 'error');
            return;
          }
          try {
            onMessageChange(null, null);
            await invitationsApi.create(famId, {
              email: inviteEmailAdmin,
              role: inviteRoleAdmin,
            });
            onMessageChange(
              'Invitation created (see server logs for token in dev)',
              'success',
            );
            setInviteEmailAdmin('');
          } catch (_err) {
            onMessageChange('Failed to invite', 'error');
          }
        }, 'Could not create invitation. Please try again.')}
        type="button"
      >
        Invite
      </Button>
    </Toolbar>
  );
};
