import type {FC, FormEventHandler} from 'react';
import {useState} from 'react';
import {FormattedMessage, defineMessages, useIntl} from 'react-intl';
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
import {ACCEPT_INVITATION_REDIRECT_DELAY} from '../constants';

type InvitationSubmitParams = {
  token: string;
  username: string;
  password: string;
  setMessage: (msg: string | null) => void;
  onAccepted: () => void;
};

const submitMessages = defineMessages({
  accepted: {
    defaultMessage: 'Invitation accepted. You can now log in.',
    id: 'pages.AcceptInvitation.invitation-accepted-you-can-no',
  },
  failedAccept: {
    defaultMessage: 'Failed to accept',
    id: 'pages.AcceptInvitation.failed-to-accept',
  },
  failedAcceptInvitation: {
    defaultMessage: 'Failed to accept invitation',
    id: 'pages.AcceptInvitation.failed-to-accept-invitation',
  },
});

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

    safeAsync(async () => {
      try {
        const res = await invitationsApi.accept({token, username, password});
        if (res.success) {
          setMessage(intl.formatMessage(submitMessages.accepted));
          setTimeout(() => {
            onAccepted();
          }, ACCEPT_INVITATION_REDIRECT_DELAY);
        } else {
          setMessage(intl.formatMessage(submitMessages.failedAccept));
        }
      } catch {
        setMessage(intl.formatMessage(submitMessages.failedAccept));
      }
    }, intl.formatMessage(submitMessages.failedAcceptInvitation));
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

const pageMessages = defineMessages({
  missingToken: {
    defaultMessage: 'Missing token.',
    id: 'pages.AcceptInvitation.missing-token',
  },
  header: {
    defaultMessage: 'Accept Invitation',
    id: 'pages.AcceptInvitation.accept-invitation',
  },
  username: {
    defaultMessage: 'Username',
    id: 'pages.family.CreateChildForm.username',
  },
  password: {
    defaultMessage: 'Password',
    id: 'pages.family.CreateChildForm.password',
  },
  accept: {
    defaultMessage: 'Accept Invitation',
    id: 'pages.AcceptInvitation.accept-invitation',
  },
});

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
        <FormattedMessage {...pageMessages.missingToken} />
      </div>
    );
  }

  return (
    <FormCard title={intl.formatMessage(pageMessages.header)}>
      <form onSubmit={handleSubmit}>
        <Stack gap="md">
          <FormField
            htmlFor="username"
            label={intl.formatMessage(pageMessages.username)}
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
            label={intl.formatMessage(pageMessages.password)}
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
            <FormattedMessage {...pageMessages.accept} />
          </Button>
        </Stack>
      </form>
    </FormCard>
  );
};

export default AcceptInvitation;
