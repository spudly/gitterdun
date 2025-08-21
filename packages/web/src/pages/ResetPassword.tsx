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
import {FormattedMessage, defineMessages, useIntl} from 'react-intl';

const ResetPassword: FC = () => {
  const {resetPassword} = useUser();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const {safeAsync} = useToast();
  const intl = useIntl();

  const messages = defineMessages({
    missingToken: {
      defaultMessage: 'Missing token',
      id: 'pages.ResetPassword.missing-token',
    },
    passwordsDoNotMatch: {
      defaultMessage: 'Passwords do not match',
      id: 'pages.ResetPassword.passwords-do-not-match',
    },
    success: {
      defaultMessage: 'Password reset successful. Redirecting...',
      id: 'pages.ResetPassword.password-reset-successful-redi',
    },
    couldNotReset: {
      defaultMessage: 'Could not reset password. Please try again.',
      id: 'pages.ResetPassword.could-not-reset-password-pleas',
    },
    failedToSubmit: {
      defaultMessage: 'Failed to submit form. Please try again.',
      id: 'pages.ResetPassword.failed-to-submit-form-please-t',
    },
    title: {
      defaultMessage: 'Reset Password',
      id: 'pages.ResetPassword.reset-password',
    },
    newPassword: {
      defaultMessage: 'New Password',
      id: 'pages.ResetPassword.new-password',
    },
    confirmPassword: {
      defaultMessage: 'Confirm Password',
      id: 'pages.ResetPassword.confirm-password',
    },
  });

  const handleSubmit: FormEventHandler<HTMLFormElement> = event => {
    event.preventDefault();
    setMessage(null);

    // Validate search parameters using Zod - use safeParse for URL params
    const searchParamsObject = Object.fromEntries(params.entries());
    const parseResult = TokenSearchParamsSchema.safeParse(searchParamsObject);
    if (!parseResult.success) {
      setMessage(intl.formatMessage(messages.missingToken));
      return;
    }
    const {token} = parseResult.data;
    if (password !== confirm) {
      setMessage(intl.formatMessage(messages.passwordsDoNotMatch));
      return;
    }
    safeAsync(async () => {
      try {
        await resetPassword(token, password);
        setMessage(intl.formatMessage(messages.success));
        setTimeout(() => {
          safeAsync(async () => {
            await navigate('/login');
          }, 'Failed to redirect to login');
        }, 1200);
      } catch {
        setMessage(intl.formatMessage(messages.couldNotReset));
      }
    }, intl.formatMessage(messages.failedToSubmit));
  };

  return (
    <FormCard title={intl.formatMessage(messages.title)}>
      <form onSubmit={handleSubmit}>
        <Stack gap="md">
          <FormField
            htmlFor="new-password"
            label={intl.formatMessage(messages.newPassword)}
            required
          >
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
            label={intl.formatMessage(messages.confirmPassword)}
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
            <FormattedMessage
              defaultMessage="Reset Password"
              id="pages.ResetPassword.reset-password"
            />
          </Button>
        </Stack>
      </form>
    </FormCard>
  );
};

export default ResetPassword;
