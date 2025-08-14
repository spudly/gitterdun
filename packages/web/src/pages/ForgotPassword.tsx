import {FC, useState} from 'react';
import {useUser} from '../hooks/useUser.js';
import {FormCard} from '../widgets/FormCard.js';
import {FormField} from '../widgets/FormField.js';
import {TextInput} from '../widgets/TextInput.js';
import {Button} from '../widgets/Button.js';
import {Alert} from '../widgets/Alert.js';
import {Stack} from '../widgets/Stack.js';

const ForgotPassword: FC = () => {
  const {forgotPassword} = useUser();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage(null);
    try {
      await forgotPassword(email);
      setMessage(
        'If the email exists, a reset link has been sent. Check server logs for token in dev.',
      );
    } catch (_err) {
      setMessage('Request failed');
    }
  };

  return (
    <FormCard title="Forgot Password">
      <Stack gap="md">
        <form onSubmit={handleSubmit}>
          <Stack gap="md">
            <FormField label="Email" htmlFor="email" required>
              <TextInput
                id="email"
                type="email"
                value={email}
                onChange={v => setEmail(v)}
                required
              />
            </FormField>
            <Button type="submit" fullWidth>
              Send reset link
            </Button>
          </Stack>
        </form>
        {message && <Alert type="info">{message}</Alert>}
      </Stack>
    </FormCard>
  );
};

export default ForgotPassword;
