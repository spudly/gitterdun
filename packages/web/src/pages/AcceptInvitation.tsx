import {FC, useState} from 'react';
import {useSearchParams, useNavigate} from 'react-router-dom';
import {invitationsApi} from '../lib/api.js';
import {FormCard} from '../widgets/FormCard.js';
import {FormField} from '../widgets/FormField.js';
import {TextInput} from '../widgets/TextInput.js';
import {Button} from '../widgets/Button.js';
import {Alert} from '../widgets/Alert.js';
import {Stack} from '../widgets/Stack.js';

const AcceptInvitation: FC = () => {
  const [params] = useSearchParams();
  const token = params.get('token') || '';
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage(null);
    try {
      const res = await invitationsApi.accept({token, username, password});
      if (res.success) {
        setMessage('Invitation accepted. You can now log in.');
        setTimeout(() => navigate('/login'), 1200);
      } else {
        setMessage('Failed to accept');
      }
    } catch (_err) {
      setMessage('Failed to accept');
    }
  };

  if (!token) {
    return <div>Missing token.</div>;
  }

  return (
    <FormCard title="Accept Invitation">
      <form onSubmit={handleSubmit}>
        <Stack gap="md">
          <FormField label="Username" htmlFor="username" required>
            <TextInput
              id="username"
              value={username}
              onChange={v => setUsername(v)}
              required
            />
          </FormField>
          <FormField label="Password" htmlFor="password" required>
            <TextInput
              id="password"
              type="password"
              value={password}
              onChange={v => setPassword(v)}
              required
              minLength={6}
            />
          </FormField>
          {message && <Alert type="info">{message}</Alert>}
          <Button type="submit" fullWidth>
            Accept Invitation
          </Button>
        </Stack>
      </form>
    </FormCard>
  );
};

export default AcceptInvitation;
