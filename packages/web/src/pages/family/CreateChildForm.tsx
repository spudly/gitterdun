import type {FC} from 'react';
import {useMemo, useState} from 'react';
import {CreateChildSchema} from '@gitterdun/shared';
import {Button} from '../../widgets/Button.js';
import {TextInput} from '../../widgets/TextInput.js';
import {Stack} from '../../widgets/Stack.js';
import {Text} from '../../widgets/Text.js';
import {defineMessages, useIntl} from 'react-intl';

type CreateChildPayload = {
  familyId: number;
  username: string;
  email: string | undefined;
  password: string;
};

type CreateChildFormProps = {
  readonly handleCreateChild: (data: CreateChildPayload) => void;
  readonly selectedFamilyId: number | null;
};

export const CreateChildForm: FC<CreateChildFormProps> = ({
  handleCreateChild,
  selectedFamilyId,
}) => {
  const [childUsername, setChildUsername] = useState('');
  const [childEmail, setChildEmail] = useState('');
  const [childPassword, setChildPassword] = useState('');
  const [usernameError, setUsernameError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
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
    usernameRequired: {
      defaultMessage: 'Username is required',
      id: 'pages.family.CreateChildForm.username-required',
    },
    emailInvalid: {
      defaultMessage: 'Please enter a valid email address',
      id: 'pages.family.CreateChildForm.email-invalid',
    },
    passwordTooShort: {
      defaultMessage: 'Password must be at least 4 characters',
      id: 'pages.family.CreateChildForm.password-too-short',
    },
  });

  const isFormValid = useMemo(() => {
    const result = CreateChildSchema.safeParse({
      username: childUsername,
      email: childEmail,
      password: childPassword,
    });
    return result.success && selectedFamilyId !== null;
  }, [childUsername, childEmail, childPassword, selectedFamilyId]);

  return (
    <Stack gap="sm">
      <Text as="h3" weight="semibold">
        {intl.formatMessage(messages.header)}
      </Text>

      <Stack gap="sm">
        <TextInput
          error={usernameError}
          onChange={val => {
            setChildUsername(val);
            if (val.trim() !== '') {
              setUsernameError(null);
            }
          }}
          placeholder={intl.formatMessage(messages.placeholderUsername)}
          value={childUsername}
        />

        <TextInput
          error={emailError}
          onChange={val => {
            setChildEmail(val);
            if (val.trim() !== '') {
              setEmailError(null);
            }
          }}
          placeholder={intl.formatMessage(messages.placeholderEmail)}
          type="email"
          value={childEmail}
        />

        <TextInput
          error={passwordError}
          onChange={val => {
            setChildPassword(val);
            if (val.trim().length >= 4) {
              setPasswordError(null);
            }
          }}
          placeholder={intl.formatMessage(messages.placeholderPassword)}
          type="password"
          value={childPassword}
        />

        <Button
          disabled={!isFormValid}
          onClick={() => {
            const parsed = CreateChildSchema.safeParse({
              username: childUsername,
              email: childEmail,
              password: childPassword,
            });
            if (!parsed.success || selectedFamilyId === null) {
              // Set field-level errors
              setUsernameError(null);
              setEmailError(null);
              setPasswordError(null);
              if (!parsed.success) {
                for (const issue of parsed.error.issues) {
                  if (issue.path[0] === 'username') {
                    setUsernameError(
                      intl.formatMessage(messages.usernameRequired),
                    );
                  }
                  if (issue.path[0] === 'email') {
                    setEmailError(intl.formatMessage(messages.emailInvalid));
                  }
                  if (issue.path[0] === 'password') {
                    setPasswordError(
                      intl.formatMessage(messages.passwordTooShort),
                    );
                  }
                }
              }
              return;
            }
            handleCreateChild({
              familyId: selectedFamilyId,
              username: parsed.data.username,
              email: parsed.data.email,
              password: parsed.data.password,
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
