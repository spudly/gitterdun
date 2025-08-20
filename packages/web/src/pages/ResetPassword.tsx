import type {FC, FormEventHandler} from 'react';
import {useState} from 'react';
import {useSearchParams, useNavigate} from 'react-router-dom';
import {TokenSearchParamsSchema} from '../schemas.js';
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
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const {safeAsync} = useToast();

  const handleSubmit: FormEventHandler<HTMLFormElement> = event => {
    event.preventDefault();
    setMessage(null);

    // Validate search parameters using Zod - use safeParse for URL params
    const searchParamsObject = Object.fromEntries(params.entries());
    const parseResult = TokenSearchParamsSchema.safeParse(searchParamsObject);
    if (!parseResult.success) {
      setMessage('Missing token');
      return;
    }
    const {token} = parseResult.data;
    if (password !== confirm) {
      setMessage('Passwords do not match');
      return;
    }
    safeAsync(async () => {
      try {
        await resetPassword(token, password);
        setMessage('Password reset successful. Redirecting...');
        setTimeout(() => {
          safeAsync(async () => {
            await navigate('/login');
          }, 'Failed to redirect to login');
        }, 1200);
      } catch {
        setMessage('Could not reset password. Please try again.');
      }
    }, 'Failed to submit form. Please try again.');
  };

  return (
    <FormCard title="Reset Password">
      <form onSubmit={handleSubmit}>
        <Stack gap="md">
          <FormField htmlFor="new-password" label="New Password" required>
            <TextInput
              id="new-password"
              minLength={6}
              onChange={value => {
                setPassword(value);
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
              onChange={value => {
                setConfirm(value);
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
