/* eslint-disable import/max-dependencies -- Demo registry requires many imports for all widget demos */
import type {FC} from 'react';
import {Suspense, lazy} from 'react';
import {FormattedMessage} from 'react-intl';
import {useParams} from 'react-router-dom';
import {z} from 'zod';
import {TextLink} from '../widgets/TextLink.js';
import {Text} from '../widgets/Text.js';
import {PageContainer} from '../widgets/PageContainer.js';
import {Stack} from '../widgets/Stack.js';
import {BulletList} from '../widgets/BulletList.js';

const registry: Record<string, FC> = {
  Alert: lazy(async () => import('../widgets/Alert.demo.js')),
  AvatarCircle: lazy(async () => import('../widgets/AvatarCircle.demo.js')),
  Badge: lazy(async () => import('../widgets/Badge.demo.js')),
  BulletList: lazy(async () => import('../widgets/BulletList.demo.js')),
  Button: lazy(async () => import('../widgets/Button.demo.js')),
  Card: lazy(async () => import('../widgets/Card.demo.js')),
  DataTable: lazy(async () => import('../widgets/DataTable.demo.js')),
  EmptyState: lazy(async () => import('../widgets/EmptyState.demo.js')),
  FormCard: lazy(async () => import('../widgets/FormCard.demo.js')),
  FormField: lazy(async () => import('../widgets/FormField.demo.js')),
  FormSection: lazy(async () => import('../widgets/FormSection.demo.js')),
  GridContainer: lazy(async () => import('../widgets/GridContainer.demo.js')),
  Heading: lazy(async () => import('../widgets/Heading.demo.js')),
  IconButton: lazy(async () => import('../widgets/IconButton.demo.js')),
  InputGroup: lazy(async () => import('../widgets/InputGroup.demo.js')),
  Layout: lazy(async () => import('../widgets/Layout.demo.js')),
  ListRow: lazy(async () => import('../widgets/ListRow.demo.js')),
  Modal: lazy(async () => import('../widgets/Modal.demo.js')),
  PageContainer: lazy(async () => import('../widgets/PageContainer.demo.js')),
  PageHeader: lazy(async () => import('../widgets/PageHeader.demo.js')),
  Podium: lazy(async () => import('../widgets/Podium.demo.js')),
  ProgressBar: lazy(async () => import('../widgets/ProgressBar.demo.js')),
  RankingList: lazy(async () => import('../widgets/RankingList.demo.js')),
  Section: lazy(async () => import('../widgets/Section.demo.js')),
  SectionHeader: lazy(async () => import('../widgets/SectionHeader.demo.js')),
  SelectInput: lazy(async () => import('../widgets/SelectInput.demo.js')),
  Spinner: lazy(async () => import('../widgets/Spinner.demo.js')),
  StatCard: lazy(async () => import('../widgets/StatCard.demo.js')),
  StatusBadge: lazy(async () => import('../widgets/StatusBadge.demo.js')),
  StatusDot: lazy(async () => import('../widgets/StatusDot.demo.js')),
  TextInput: lazy(async () => import('../widgets/TextInput.demo.js')),
};

/* eslint-enable import/max-dependencies */

const DemoParamsSchema = z.object({name: z.string().min(1).optional()});

const Demos: FC = () => {
  const {name} = DemoParamsSchema.parse(useParams());
  if (name !== undefined && registry[name]) {
    const Demo = registry[name];
    return (
      <PageContainer variant="wide">
        <Stack gap="md">
          <TextLink to="/__demos">
            <FormattedMessage defaultMessage="← All demos" id="demos.all" />
          </TextLink>

          <Suspense
            fallback={
              <div>
                <FormattedMessage
                  defaultMessage="Loading demo..."
                  id="demos.loading"
                />
              </div>
            }
          >
            <Demo />
          </Suspense>
        </Stack>
      </PageContainer>
    );
  }
  return (
    <PageContainer variant="wide">
      <Text as="h1" size="2xl" weight="semibold">
        <FormattedMessage defaultMessage="Widget Demos" id="demos.title" />
      </Text>

      <BulletList density="tight" indent="md">
        {Object.keys(registry).map(key => (
          <li key={key}>
            <TextLink to={`/__demos/${key}`}>{key}</TextLink>
          </li>
        ))}
      </BulletList>
    </PageContainer>
  );
};

export default Demos;
