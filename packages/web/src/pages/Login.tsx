import type {FC} from 'react';
import { useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {useUser} from '../hooks/useUser.js';
import {FormCard} from '../widgets/FormCard.js';
import {FormField} from '../widgets/FormField.js';
import {TextInput} from '../widgets/TextInput.js';
import {Button} from '../widgets/Button.js';
import {Alert} from '../widgets/Alert.js';
import {Stack} from '../widgets/Stack.js';
import {useToast} from '../widgets/ToastProvider.js';
import {TextLink} from '../widgets/TextLink.js';

const Login: FC = () => {
  const {login, isLoggingIn, loginError} = useUser();
  const {safeAsync} = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage(null);
    safeAsync(async () => {
      await login(email, password);
      navigate('/');
    }, 'Login failed. Please try again.')();
  };

  return (
    <FormCard title="Login">
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

          <FormField htmlFor="password" label="Password" required>
            <TextInput
              id="password"
              onChange={v => {
                setPassword(v);
              }}
              required
              type="password"
              value={password}
            />
          </FormField>

          {message != null && message !== '' ? (
            <Alert type="error">{message}</Alert>
          ) : null}

          {loginError != null ? (
            <Alert type="error">{loginError.message}</Alert>
          ) : null}

          <Button disabled={isLoggingIn} fullWidth type="submit">
            {isLoggingIn ? 'Logging in...' : 'Login'}
          </Button>
        </Stack>
      </form>

      <Stack gap="sm">
        <TextLink to="/forgot-password">Forgot password?</TextLink>

        <TextLink to="/admin">Register (Admin)</TextLink>
      </Stack>
    </FormCard>
  );
};

export default Login;
