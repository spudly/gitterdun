import {FC} from 'react';
import {useParams} from 'react-router-dom';
import {TextLink} from '../widgets/TextLink.js';
import {Text} from '../widgets/Text.js';
import {PageContainer} from '../widgets/PageContainer.js';
import {Stack} from '../widgets/Stack.js';
import {BulletList} from '../widgets/BulletList.js';
import ButtonDemo from '../widgets/Button.demo.js';
import CardDemo from '../widgets/Card.demo.js';
import BadgeDemo from '../widgets/Badge.demo.js';
import StatusDotDemo from '../widgets/StatusDot.demo.js';
import SpinnerDemo from '../widgets/Spinner.demo.js';
import TextInputDemo from '../widgets/TextInput.demo.js';
import SelectInputDemo from '../widgets/SelectInput.demo.js';
import FormFieldDemo from '../widgets/FormField.demo.js';
import ProgressBarDemo from '../widgets/ProgressBar.demo.js';
import StatCardDemo from '../widgets/StatCard.demo.js';
import PageHeaderDemo from '../widgets/PageHeader.demo.js';
import EmptyStateDemo from '../widgets/EmptyState.demo.js';
import ListRowDemo from '../widgets/ListRow.demo.js';
import AvatarCircleDemo from '../widgets/AvatarCircle.demo.js';
import LayoutDemo from '../widgets/Layout.demo.js';

const registry: Record<string, FC> = {
  Button: ButtonDemo,
  Card: CardDemo,
  Badge: BadgeDemo,
  StatusDot: StatusDotDemo,
  Spinner: SpinnerDemo,
  TextInput: TextInputDemo,
  SelectInput: SelectInputDemo,
  FormField: FormFieldDemo,
  ProgressBar: ProgressBarDemo,
  StatCard: StatCardDemo,
  PageHeader: PageHeaderDemo,
  EmptyState: EmptyStateDemo,
  ListRow: ListRowDemo,
  AvatarCircle: AvatarCircleDemo,
  Layout: LayoutDemo,
};

const Demos: FC = () => {
  const params = useParams();
  const {name} = params;
  if (name && registry[name]) {
    const Demo = registry[name];
    return (
      <PageContainer variant="wide">
        <Stack gap="md">
          <TextLink to="/__demos">← All demos</TextLink>
          <Demo />
        </Stack>
      </PageContainer>
    );
  }
  return (
    <PageContainer variant="wide">
      <Text as="h1" size="2xl" weight="semibold">
        Widget Demos
      </Text>
      <BulletList indent="md" density="tight">
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
