import type {FC} from 'react';
import {useState} from 'react';
import {Button} from '../../widgets/Button.js';
import {TextInput} from '../../widgets/TextInput.js';
import {Stack} from '../../widgets/Stack.js';
import {Text} from '../../widgets/Text.js';

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

  return (
    <Stack gap="sm">
      <Text as="h3" weight="semibold">
        Create Child Account
      </Text>

      <Stack gap="sm">
        <TextInput
          onChange={val => {
            setChildUsername(val);
          }}
          placeholder="Username"
          value={childUsername}
        />

        <TextInput
          onChange={val => {
            setChildEmail(val);
          }}
          placeholder="Email"
          type="email"
          value={childEmail}
        />

        <TextInput
          onChange={val => {
            setChildPassword(val);
          }}
          placeholder="Password"
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
          Create
        </Button>
      </Stack>
    </Stack>
  );
};
