import type {FC} from 'react';
import {useState} from 'react';
import {Button} from '../../widgets/Button.js';
import {TextInput} from '../../widgets/TextInput.js';
import {Stack} from '../../widgets/Stack.js';
import {Text} from '../../widgets/Text.js';
import {defineMessages, useIntl} from 'react-intl';

type CreateChildFormProps = {
  readonly handleCreateChild: (data: {
    familyId: number;
    username: string;
    email: string;
    password: string;
  }) => void;
  readonly selectedFamilyId: number | null;
};

export const CreateChildForm: FC<CreateChildFormProps> = ({
  handleCreateChild,
  selectedFamilyId,
}) => {
  const [childUsername, setChildUsername] = useState('');
  const [childEmail, setChildEmail] = useState('');
  const [childPassword, setChildPassword] = useState('');
  const intl = useIntl();

  const messages = defineMessages({
    header: {
      defaultMessage: 'Create Child Account',
      id: 'pages.family.CreateChildForm.create-child-account',
    },
    placeholderUsername: {
      defaultMessage: 'Username',
      id: 'pages.family.CreateChildForm.username',
    },
    placeholderEmail: {
      defaultMessage: 'Email',
      id: 'pages.family.InviteMemberForm.email',
    },
    placeholderPassword: {
      defaultMessage: 'Password',
      id: 'pages.family.CreateChildForm.password',
    },
    create: {
      defaultMessage: 'Create',
      id: 'pages.family.FamilySelector.create',
    },
  });

  return (
    <Stack gap="sm">
      <Text as="h3" weight="semibold">
        {intl.formatMessage(messages.header)}
      </Text>

      <Stack gap="sm">
        <TextInput
          onChange={val => {
            setChildUsername(val);
          }}
          placeholder={intl.formatMessage(messages.placeholderUsername)}
          value={childUsername}
        />

        <TextInput
          onChange={val => {
            setChildEmail(val);
          }}
          placeholder={intl.formatMessage(messages.placeholderEmail)}
          type="email"
          value={childEmail}
        />

        <TextInput
          onChange={val => {
            setChildPassword(val);
          }}
          placeholder={intl.formatMessage(messages.placeholderPassword)}
          type="password"
          value={childPassword}
        />

        <Button
          onClick={() => {
            if (
              selectedFamilyId === null
              || childUsername.trim() === ''
              || childEmail.trim() === ''
              || childPassword.trim() === ''
            ) {
              return;
            }
            handleCreateChild({
              familyId: selectedFamilyId,
              username: childUsername,
              email: childEmail,
              password: childPassword,
            });
            setChildUsername('');
            setChildEmail('');
            setChildPassword('');
          }}
          type="button"
        >
          {intl.formatMessage(messages.create)}
        </Button>
      </Stack>
    </Stack>
  );
};
