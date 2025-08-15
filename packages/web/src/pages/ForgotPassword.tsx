import type {FC} from 'react';
import {useState} from 'react';
import {useUser} from '../hooks/useUser.js';
import {FormCard} from '../widgets/FormCard.js';
import {FormField} from '../widgets/FormField.js';
import {TextInput} from '../widgets/TextInput.js';
import {Button} from '../widgets/Button.js';
import {Alert} from '../widgets/Alert.js';
import {Stack} from '../widgets/Stack.js';
import {useToast} from '../widgets/ToastProvider.js';

const ForgotPassword: FC = () => {
  const {forgotPassword} = useUser();
  const {safeAsync} = useToast();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage(null);
    safeAsync(
      async () => {
        await forgotPassword(email);
        setMessage(
          'If the email exists, a reset link has been sent. Check server logs for token in dev.',
        );
      },
      'Request failed',
      setMessage,
    )();
  };

  return (
    <FormCard title="Forgot Password">
      <Stack gap="md">
        <form onSubmit={handleSubmit}>
          <Stack gap="md">
            <FormField htmlFor="email" label="Email" required>
              <TextInput
                id="email"
                onChange={v => {
                  setEmail(v);
                }}
                required
                type="email"
                value={email}
              />
            </FormField>

            <Button fullWidth type="submit">
              Send reset link
            </Button>
          </Stack>
        </form>

        {message != null && message !== '' ? (
          <Alert type="info">{message}</Alert>
        ) : null}
      </Stack>
    </FormCard>
  );
};

export default ForgotPassword;
