import type {FC} from 'react';
import {useState} from 'react';
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
import {FormattedMessage, useIntl} from 'react-intl';

const Login: FC = () => {
  const {login, isLoggingIn, loginError} = useUser();
  const intl = useIntl();
  const {safeAsync} = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage(null);
    const run = safeAsync(
      async () => {
        await login(email, password);
        await navigate('/');
      },
      intl.formatMessage({id: 'login.failed', defaultMessage: 'Login failed'}),
      setMessage,
    );
    run();
  };

  return (
    <FormCard title={intl.formatMessage({id: 'login.title', defaultMessage: 'Login'})}>
      <form onSubmit={handleSubmit}>
        <Stack gap="md">
          <FormField
            htmlFor="email"
            label={intl.formatMessage({id: 'login.email', defaultMessage: 'Email'})}
            required
          >
            <TextInput
              id="email"
              onChange={value => {
                setEmail(value);
              }}
              required
              type="email"
              value={email}
            />
          </FormField>

          <FormField
            htmlFor="password"
            label={intl.formatMessage({id: 'login.password', defaultMessage: 'Password'})}
            required
          >
            <TextInput
              id="password"
              onChange={value => {
                setPassword(value);
              }}
              required
              type="password"
              value={password}
            />
          </FormField>

          {message !== null && message !== '' ? (
            <Alert type="error">{message}</Alert>
          ) : null}

          {loginError ? <Alert type="error">{loginError.message}</Alert> : null}

          <Button disabled={isLoggingIn} fullWidth type="submit">
            {isLoggingIn
              ? intl.formatMessage({
                  id: 'login.submitting',
                  defaultMessage: 'Logging in...',
                })
              : intl.formatMessage({
                  id: 'login.submit',
                  defaultMessage: 'Login',
                })}
          </Button>
        </Stack>
      </form>

      <Stack gap="sm">
        <TextLink to="/forgot-password">
          <FormattedMessage id="login.forgot" defaultMessage="Forgot password?" />
        </TextLink>

        <TextLink to="/admin">
          <FormattedMessage
            id="login.registerAdmin"
            defaultMessage="Register (Admin)"
          />
        </TextLink>
      </Stack>
    </FormCard>
  );
};

export default Login;
