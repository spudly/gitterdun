import type {FC} from 'react';
import { useState} from 'react';
import {useSearchParams, useNavigate} from 'react-router-dom';
import {useUser} from '../hooks/useUser.js';
import {FormCard} from '../widgets/FormCard.js';
import {FormField} from '../widgets/FormField.js';
import {TextInput} from '../widgets/TextInput.js';
import {Button} from '../widgets/Button.js';
import {Alert} from '../widgets/Alert.js';
import {Stack} from '../widgets/Stack.js';
import {useToast} from '../widgets/ToastProvider.js';

const ResetPassword: FC = () => {
  const {resetPassword} = useUser();
  const {safeAsync} = useToast();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage(null);
    const token = params.get('token') ?? '';
    if (!token) {
      setMessage('Missing token');
      return;
    }
    if (password !== confirm) {
      setMessage('Passwords do not match');
      return;
    }
    safeAsync(async () => {
      await resetPassword(token, password);
      setMessage('Password reset successful. Redirecting...');
      setTimeout(() => {
        navigate('/login');
      }, 1200);
    }, 'Could not reset password. Please try again.')();
  };

  return (
    <FormCard title="Reset Password">
      <form onSubmit={handleSubmit}>
        <Stack gap="md">
          <FormField htmlFor="new-password" label="New Password" required>
            <TextInput
              id="new-password"
              minLength={6}
              onChange={v => {
                setPassword(v);
              }}
              required
              type="password"
              value={password}
            />
          </FormField>

          <FormField
            htmlFor="confirm-password"
            label="Confirm Password"
            required
          >
            <TextInput
              id="confirm-password"
              minLength={6}
              onChange={v => {
                setConfirm(v);
              }}
              required
              type="password"
              value={confirm}
            />
          </FormField>

          {message != null && message !== '' ? (
            <Alert type="info">{message}</Alert>
          ) : null}

          <Button fullWidth type="submit">
            Reset Password
          </Button>
        </Stack>
      </form>
    </FormCard>
  );
};

export default ResetPassword;
