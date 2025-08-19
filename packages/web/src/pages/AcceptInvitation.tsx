import type {FC} from 'react';
import {useState} from 'react';
import {useSearchParams, useNavigate} from 'react-router-dom';
import {invitationsApi} from '../lib/api.js';
import {FormCard} from '../widgets/FormCard.js';
import {FormField} from '../widgets/FormField.js';
import {TextInput} from '../widgets/TextInput.js';
import {Button} from '../widgets/Button.js';
import {Alert} from '../widgets/Alert.js';
import {Stack} from '../widgets/Stack.js';
import {useToast} from '../widgets/ToastProvider.js';

type InvitationSubmitParams = {
  token: string;
  username: string;
  password: string;
  setMessage: (msg: string | null) => void;
  navigate: (path: string) => void;
  safeAsync: (
    fn: () => Promise<void>,
    errorMsg: string,
    onError: (msg: string | null) => void,
  ) => () => void;
};

const useInvitationSubmit = (params: InvitationSubmitParams) => {
  const {token, username, password, setMessage, navigate, safeAsync} = params;
  return (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage(null);
    const run = safeAsync(
      async () => {
        const res = await invitationsApi.accept({token, username, password});
        if (res.success) {
          setMessage('Invitation accepted. You can now log in.');
          setTimeout(() => {
            navigate('/login');
          }, 1200);
        } else {
          setMessage('Failed to accept');
        }
      },
      'Failed to accept',
      setMessage,
    );
    run();
  };
};

const useAcceptInvitationSetup = () => {
  const [params] = useSearchParams();
  const token = params.get('token') ?? '';
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const navigate = useNavigate();
  const {safeAsync} = useToast();
  const handleSubmit = useInvitationSubmit({
    token,
    username,
    password,
    setMessage,
    navigate,
    safeAsync,
  });
  return {
    token,
    username,
    setUsername,
    password,
    setPassword,
    message,
    handleSubmit,
  };
};

const AcceptInvitation: FC = () => {
  const {
    token,
    username,
    setUsername,
    password,
    setPassword,
    message,
    handleSubmit,
  } = useAcceptInvitationSetup();

  if (!token) {
    return <div>Missing token.</div>;
  }

  return (
    <FormCard title="Accept Invitation">
      <form onSubmit={handleSubmit}>
        <Stack gap="md">
          <FormField htmlFor="username" label="Username" required>
            <TextInput
              id="username"
              onChange={value => {
                setUsername(value);
              }}
              required
              value={username}
            />
          </FormField>

          <FormField htmlFor="password" label="Password" required>
            <TextInput
              id="password"
              minLength={6}
              onChange={value => {
                setPassword(value);
              }}
              required
              type="password"
              value={password}
            />
          </FormField>

          {message !== null && message !== '' ? (
            <Alert type="info">{message}</Alert>
          ) : null}

          <Button fullWidth type="submit">
            Accept Invitation
          </Button>
        </Stack>
      </form>
    </FormCard>
  );
};

export default AcceptInvitation;
