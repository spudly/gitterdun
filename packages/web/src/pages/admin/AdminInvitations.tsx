import type {FC} from 'react';
import {useState} from 'react';
import {invitationsApi} from '../../lib/api.js';
import {Button} from '../../widgets/Button.js';
import {TextInput} from '../../widgets/TextInput.js';
import {SelectInput} from '../../widgets/SelectInput.js';

import {Toolbar} from '../../widgets/Toolbar.js';
import {useToast} from '../../widgets/ToastProvider.js';
import {defineMessages, useIntl} from 'react-intl';

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
  const intl = useIntl();

  const messages = defineMessages({
    placeholderFamilyId: {
      defaultMessage: 'Family ID',
      id: 'pages.admin.AdminInvitations.family-id',
    },
    placeholderInviteEmail: {
      defaultMessage: 'Invite email',
      id: 'pages.admin.AdminInvitations.invite-email',
    },
    optionParent: {
      defaultMessage: 'Parent',
      id: 'pages.family.InviteMemberForm.parent',
    },
    optionChild: {
      defaultMessage: 'Child',
      id: 'pages.family.InviteMemberForm.child',
    },
    invite: {
      defaultMessage: 'Invite',
      id: 'pages.admin.AdminInvitations.invite',
    },
    validation: {
      defaultMessage: 'Enter family ID and email',
      id: 'pages.admin.AdminInvitations.enter-family-id-and-email',
    },
    success: {
      defaultMessage: 'Invitation created (see server logs for token in dev)',
      id: 'pages.admin.AdminInvitations.invitation-created-see-server-',
    },
    failure: {
      defaultMessage: 'Failed to invite',
      id: 'pages.admin.AdminInvitations.failed-to-invite',
    },
    toastError: {
      defaultMessage: 'Could not create invitation. Please try again.',
      id: 'pages.admin.AdminInvitations.could-not-create-invitation-pl',
    },
  });

  return (
    <Toolbar>
      <TextInput
        onChange={value => {
          setInviteFamIdAdmin(value);
        }}
        placeholder={intl.formatMessage(messages.placeholderFamilyId)}
        value={inviteFamIdAdmin}
      />

      <TextInput
        onChange={value => {
          setInviteEmailAdmin(value);
        }}
        placeholder={intl.formatMessage(messages.placeholderInviteEmail)}
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
        <option value="parent">
          {intl.formatMessage(messages.optionParent)}
        </option>
        <option value="child">
          {intl.formatMessage(messages.optionChild)}
        </option>
      </SelectInput>

      <Button
        onClick={safeAsync(async () => {
          const famId = Number(inviteFamIdAdmin);
          if (
            !Number.isFinite(famId)
            || famId <= 0
            || inviteEmailAdmin === ''
          ) {
            onMessageChange(intl.formatMessage(messages.validation), 'error');
            return;
          }
          try {
            onMessageChange(null, null);
            await invitationsApi.create(famId, {
              email: inviteEmailAdmin,
              role: inviteRoleAdmin,
            });
            onMessageChange(intl.formatMessage(messages.success), 'success');
            setInviteEmailAdmin('');
          } catch (_err) {
            onMessageChange(intl.formatMessage(messages.failure), 'error');
          }
        }, intl.formatMessage(messages.toastError))}
        type="button"
      >
        {intl.formatMessage(messages.invite)}
      </Button>
    </Toolbar>
  );
};
