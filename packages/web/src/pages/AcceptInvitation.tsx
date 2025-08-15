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

const AcceptInvitation: FC = () => {
  const [params] = useSearchParams();
  const token = params.get('token') ?? '';
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const navigate = useNavigate();
  const {safeAsync} = useToast();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage(null);
    safeAsync(
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
    )();
  };

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
              onChange={v => {
                setUsername(v);
              }}
              required
              value={username}
            />
          </FormField>

          <FormField htmlFor="password" label="Password" required>
            <TextInput
              id="password"
              minLength={6}
              onChange={v => {
                setPassword(v);
              }}
              required
              type="password"
              value={password}
            />
          </FormField>

          {message != null && message !== '' ? (
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
