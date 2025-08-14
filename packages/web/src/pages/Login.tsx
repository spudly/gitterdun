import {FC, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {useUser} from '../hooks/useUser.js';
import {FormCard} from '../widgets/FormCard.js';
import {FormField} from '../widgets/FormField.js';
import {TextInput} from '../widgets/TextInput.js';
import {Button} from '../widgets/Button.js';
import {Alert} from '../widgets/Alert.js';
import {Stack} from '../widgets/Stack.js';
import {TextLink} from '../widgets/TextLink.js';

const Login: FC = () => {
  const {login, isLoggingIn, loginError} = useUser();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage(null);
    try {
      await login(email, password);
      navigate('/');
    } catch (_err) {
      setMessage('Login failed');
    }
  };

  return (
    <FormCard title="Login">
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
          <FormField label="Password" htmlFor="password" required>
            <TextInput
              id="password"
              type="password"
              value={password}
              onChange={v => setPassword(v)}
              required
            />
          </FormField>
          {message && <Alert type="error">{message}</Alert>}
          {loginError && (
            <Alert type="error">{(loginError as Error).message}</Alert>
          )}
          <Button type="submit" fullWidth disabled={isLoggingIn}>
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
