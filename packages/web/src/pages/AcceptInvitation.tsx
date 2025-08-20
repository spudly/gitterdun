import type {FC, FormEventHandler} from 'react';
import {useState} from 'react';
import {FormattedMessage, useIntl} from 'react-intl';
import {useSearchParams, useNavigate} from 'react-router-dom';
import {TokenSearchParamsSchema} from '../schemas.js';
import {invitationsApi} from '../lib/api.js';
import {FormCard} from '../widgets/FormCard.js';
import {FormField} from '../widgets/FormField.js';
import {TextInput} from '../widgets/TextInput.js';
import {Button} from '../widgets/Button.js';
import {Alert} from '../widgets/Alert.js';
import {Stack} from '../widgets/Stack.js';
import {useToast} from '../widgets/ToastProvider.js';

type InvitationSubmitParams = {
  token: string;
  username: string;
  password: string;
  setMessage: (msg: string | null) => void;
  onAccepted: () => void;
};

const useInvitationSubmit = ({
  token,
  username,
  password,
  setMessage,
  onAccepted,
}: InvitationSubmitParams) => {
  const intl = useIntl();
  const {safeAsync} = useToast();
  const submitHandler: FormEventHandler<HTMLFormElement> = event => {
    event.preventDefault();
    setMessage(null);

    safeAsync(
      async () => {
        try {
          const res = await invitationsApi.accept({token, username, password});
          if (res.success) {
            setMessage(
              intl.formatMessage({
                id: 'acceptInvitation.accepted',
                defaultMessage: 'Invitation accepted. You can now log in.',
              }),
            );
            setTimeout(() => {
              onAccepted();
            }, 1200);
          } else {
            setMessage(
              intl.formatMessage({
                id: 'acceptInvitation.failed',
                defaultMessage: 'Failed to accept',
              }),
            );
          }
        } catch {
          setMessage(
            intl.formatMessage({
              id: 'acceptInvitation.failed',
              defaultMessage: 'Failed to accept',
            }),
          );
        }
      },
      intl.formatMessage({
        id: 'acceptInvitation.submitError',
        defaultMessage: 'Failed to accept invitation',
      }),
    );
  };
  return submitHandler;
};

const useAcceptInvitationSetup = () => {
  const [urlSearchParams] = useSearchParams();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const navigate = useNavigate();
  const {safeAsync} = useToast();

  // Validate search parameters using Zod - use safeParse for URL params
  const searchParamsObject = Object.fromEntries(urlSearchParams.entries());
  const parseResult = TokenSearchParamsSchema.safeParse(searchParamsObject);
  const token = parseResult.success ? parseResult.data.token : null;

  const handleSubmit = useInvitationSubmit({
    token: token ?? '',
    username,
    password,
    setMessage,
    onAccepted: () => {
      const handleNavigate = safeAsync(async () => {
        await navigate('/login');
      }, 'Failed to redirect to login');
      handleNavigate();
    },
  });
  return {
    token,
    username,
    setUsername,
    password,
    setPassword,
    message,
    handleSubmit,
  };
};

const AcceptInvitation: FC = () => {
  const intl = useIntl();
  const {
    token,
    username,
    setUsername,
    password,
    setPassword,
    message,
    handleSubmit,
  } = useAcceptInvitationSetup();

  if (token == null || token === '') {
    return (
      <div>
        <FormattedMessage
          defaultMessage="Missing token."
          id="acceptInvitation.missingToken"
        />
      </div>
    );
  }

  return (
    <FormCard
      title={intl.formatMessage({
        defaultMessage: 'Accept Invitation',
        id: 'acceptInvitation.title',
      })}
    >
      <form onSubmit={handleSubmit}>
        <Stack gap="md">
          <FormField
            htmlFor="username"
            label={intl.formatMessage({
              defaultMessage: 'Username',
              id: 'acceptInvitation.username',
            })}
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

          <FormField
            htmlFor="password"
            label={intl.formatMessage({
              defaultMessage: 'Password',
              id: 'acceptInvitation.password',
            })}
            required
          >
            <TextInput
              id="password"
              minLength={6}
              onChange={value => {
                setPassword(value);
              }}
              required
              type="password"
              value={password}
            />
          </FormField>

          {message !== null && message !== '' ? (
            <Alert type="info">{message}</Alert>
          ) : null}

          <Button fullWidth type="submit">
            <FormattedMessage
              defaultMessage="Accept Invitation"
              id="acceptInvitation.accept"
            />
          </Button>
        </Stack>
      </form>
    </FormCard>
  );
};

export default AcceptInvitation;
