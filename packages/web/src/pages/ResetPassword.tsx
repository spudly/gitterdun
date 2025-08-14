import {FC, useState} from 'react';
import {useSearchParams, useNavigate} from 'react-router-dom';
import {useUser} from '../hooks/useUser.js';
import {FormCard} from '../widgets/FormCard.js';
import {FormField} from '../widgets/FormField.js';
import {TextInput} from '../widgets/TextInput.js';
import {Button} from '../widgets/Button.js';
import {Alert} from '../widgets/Alert.js';
import {Stack} from '../widgets/Stack.js';

const ResetPassword: FC = () => {
  const {resetPassword} = useUser();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage(null);
    const token = params.get('token') || '';
    if (!token) {
      setMessage('Missing token');
      return;
    }
    if (password !== confirm) {
      setMessage('Passwords do not match');
      return;
    }
    try {
      await resetPassword(token, password);
      setMessage('Password reset successful. Redirecting...');
      setTimeout(() => navigate('/login'), 1200);
    } catch (_err) {
      setMessage('Reset failed');
    }
  };

  return (
    <FormCard title="Reset Password">
      <form onSubmit={handleSubmit}>
        <Stack gap="md">
          <FormField label="New Password" htmlFor="new-password" required>
            <TextInput
              id="new-password"
              type="password"
              value={password}
              onChange={v => setPassword(v)}
              required
              minLength={6}
            />
          </FormField>
          <FormField
            label="Confirm Password"
            htmlFor="confirm-password"
            required
          >
            <TextInput
              id="confirm-password"
              type="password"
              value={confirm}
              onChange={v => setConfirm(v)}
              required
              minLength={6}
            />
          </FormField>
          {message && <Alert type="info">{message}</Alert>}
          <Button type="submit" fullWidth>
            Reset Password
          </Button>
        </Stack>
      </form>
    </FormCard>
  );
};

export default ResetPassword;
