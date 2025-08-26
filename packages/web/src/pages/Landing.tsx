import type {FC} from 'react';
import {FormattedMessage, defineMessages, useIntl} from 'react-intl';
import {PageContainer} from '../widgets/PageContainer.js';
import {PageHeader} from '../widgets/PageHeader.js';
import {Card} from '../widgets/Card.js';
import {Text} from '../widgets/Text.js';
import {Stack} from '../widgets/Stack.js';
import {TextLink} from '../widgets/TextLink.js';

const messages = defineMessages({
  title: {defaultMessage: 'Welcome to Gitterdun', id: 'pages.Landing.title'},
  subtitle: {
    defaultMessage: 'Organize chores. Motivate your family. Have fun together.',
    id: 'pages.Landing.subtitle',
  },
  loginCta: {defaultMessage: 'Login', id: 'pages.Landing.login'},
  registerCta: {defaultMessage: 'Register', id: 'pages.Landing.register'},
});

const Landing: FC = () => {
  const intl = useIntl();
  return (
    <PageContainer variant="centered">
      <Card padded>
        <PageHeader title={intl.formatMessage(messages.title)} />
        <Text muted>
          <FormattedMessage {...messages.subtitle} />
        </Text>
        <Stack gap="md">
          <TextLink to="/login">
            <FormattedMessage {...messages.loginCta} />
          </TextLink>
          <TextLink to="/register">
            <FormattedMessage {...messages.registerCta} />
          </TextLink>
        </Stack>
      </Card>
    </PageContainer>
  );
};

export default Landing;
