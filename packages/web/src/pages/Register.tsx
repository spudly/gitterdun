import type {FC} from 'react';
import {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {defineMessages, useIntl} from 'react-intl';
import {useUser} from '../hooks/useUser.js';
import {FormCard} from '../widgets/FormCard.js';
import {FormField} from '../widgets/FormField.js';
import {TextInput} from '../widgets/TextInput.js';
import {Button} from '../widgets/Button.js';
import {Alert} from '../widgets/Alert.js';
import {Stack} from '../widgets/Stack.js';
import {useToast} from '../widgets/ToastProvider.js';

const messages = defineMessages({
  title: {defaultMessage: 'Register', id: 'pages.Register.register'},
  submitting: {
    defaultMessage: 'Registering...',
    id: 'pages.Register.registering',
  },
  submit: {defaultMessage: 'Register', id: 'pages.Register.register'},
  failed: {
    defaultMessage: 'Registration failed',
    id: 'pages.Register.registration-failed',
  },
  username: {defaultMessage: 'Username', id: 'pages.Register.username'},
  email: {defaultMessage: 'Email', id: 'pages.Register.email'},
  password: {defaultMessage: 'Password', id: 'pages.Register.password'},
});

const Register: FC = () => {
  const {register, isRegistering, registerError} = useUser();
  const intl = useIntl();
  const {safeAsync} = useToast();
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage(null);
    const run = safeAsync(
      async () => {
        const trimmedEmail = email.trim();
        const payload =
          trimmedEmail !== ''
            ? {username, email: trimmedEmail, password}
            : {username, password};
        await register(payload);
        await navigate('/');
      },
      intl.formatMessage(messages.failed),
      setMessage,
    );
    run();
  };

  return (
    <FormCard title={intl.formatMessage(messages.title)}>
      <form onSubmit={handleSubmit}>
        <Stack gap="md">
          <FormField
            htmlFor="username"
            label={intl.formatMessage(messages.username)}
            required
          >
            <TextInput
              id="username"
              onChange={value => {
                setUsername(value);
              }}
              required
              value={username}
            />
          </FormField>

          <FormField htmlFor="email" label={intl.formatMessage(messages.email)}>
            <TextInput
              id="email"
              onChange={value => {
                setEmail(value);
              }}
              type="email"
              value={email}
            />
          </FormField>

          <FormField
            htmlFor="password"
            label={intl.formatMessage(messages.password)}
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

          {registerError ? (
            <Alert type="error">{registerError.message}</Alert>
          ) : null}

          <Button disabled={isRegistering} fullWidth type="submit">
            {isRegistering
              ? intl.formatMessage(messages.submitting)
              : intl.formatMessage(messages.submit)}
          </Button>
        </Stack>
      </form>
    </FormCard>
  );
};

export default Register;
