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
import {FormattedMessage, useIntl} from 'react-intl';

const ForgotPassword: FC = () => {
  const {forgotPassword} = useUser();
  const {safeAsync} = useToast();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const intl = useIntl();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage(null);
    safeAsync(
      async () => {
        await forgotPassword(email);
        setMessage(
          intl.formatMessage({
            defaultMessage:
              'If the email exists, a reset link has been sent. Check server logs for token in dev.',
            id: 'pages.ForgotPassword.if-the-email-exists-a-reset-li',
          }),
        );
      },
      intl.formatMessage({
        defaultMessage: 'Request failed',
        id: 'pages.ForgotPassword.request-failed',
      }),
      setMessage,
    )();
  };

  return (
    <FormCard
      title={intl.formatMessage({
        defaultMessage: 'Forgot Password',
        id: 'pages.ForgotPassword.forgot-password',
      })}
    >
      <Stack gap="md">
        <form onSubmit={handleSubmit}>
          <Stack gap="md">
            <FormField
              htmlFor="email"
              label={intl.formatMessage({
                defaultMessage: 'Email',
                id: 'pages.family.InviteMemberForm.email',
              })}
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

            <Button fullWidth type="submit">
              <FormattedMessage
                defaultMessage="Send reset link"
                id="forgotPassword.submit"
              />
            </Button>
          </Stack>
        </form>

        {message !== null && message !== '' ? (
          <Alert type="info">{message}</Alert>
        ) : null}
      </Stack>
    </FormCard>
  );
};

export default ForgotPassword;
