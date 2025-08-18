import type {FC} from 'react';
import {useParams} from 'react-router-dom';
import {TextLink} from '../widgets/TextLink.js';
import {Text} from '../widgets/Text.js';
import {PageContainer} from '../widgets/PageContainer.js';
import {Stack} from '../widgets/Stack.js';
import {BulletList} from '../widgets/BulletList.js';
import AlertDemo from '../widgets/Alert.demo.js';
import AvatarCircleDemo from '../widgets/AvatarCircle.demo.js';
import BadgeDemo from '../widgets/Badge.demo.js';
import BulletListDemo from '../widgets/BulletList.demo.js';
import ButtonDemo from '../widgets/Button.demo.js';
import CardDemo from '../widgets/Card.demo.js';
import DataTableDemo from '../widgets/DataTable.demo.js';
import EmptyStateDemo from '../widgets/EmptyState.demo.js';
import FormCardDemo from '../widgets/FormCard.demo.js';
import FormFieldDemo from '../widgets/FormField.demo.js';
import FormSectionDemo from '../widgets/FormSection.demo.js';
import GridContainerDemo from '../widgets/GridContainer.demo.js';
import IconButtonDemo from '../widgets/IconButton.demo.js';
import InputGroupDemo from '../widgets/InputGroup.demo.js';
import LayoutDemo from '../widgets/Layout.demo.js';
import ListRowDemo from '../widgets/ListRow.demo.js';
import ModalDemo from '../widgets/Modal.demo.js';
import PageContainerDemo from '../widgets/PageContainer.demo.js';
import PageHeaderDemo from '../widgets/PageHeader.demo.js';
import PodiumDemo from '../widgets/Podium.demo.js';
import ProgressBarDemo from '../widgets/ProgressBar.demo.js';
import RankingListDemo from '../widgets/RankingList.demo.js';
import SectionHeaderDemo from '../widgets/SectionHeader.demo.js';
import SelectInputDemo from '../widgets/SelectInput.demo.js';
import SpinnerDemo from '../widgets/Spinner.demo.js';
import StatCardDemo from '../widgets/StatCard.demo.js';
import StatusBadgeDemo from '../widgets/StatusBadge.demo.js';
import StatusDotDemo from '../widgets/StatusDot.demo.js';
import TextInputDemo from '../widgets/TextInput.demo.js';

const registry: Record<string, FC> = {
  Alert: AlertDemo,
  AvatarCircle: AvatarCircleDemo,
  Badge: BadgeDemo,
  BulletList: BulletListDemo,
  Button: ButtonDemo,
  Card: CardDemo,
  DataTable: DataTableDemo,
  EmptyState: EmptyStateDemo,
  FormCard: FormCardDemo,
  FormField: FormFieldDemo,
  FormSection: FormSectionDemo,
  GridContainer: GridContainerDemo,
  IconButton: IconButtonDemo,
  InputGroup: InputGroupDemo,
  Layout: LayoutDemo,
  ListRow: ListRowDemo,
  Modal: ModalDemo,
  PageContainer: PageContainerDemo,
  PageHeader: PageHeaderDemo,
  Podium: PodiumDemo,
  ProgressBar: ProgressBarDemo,
  RankingList: RankingListDemo,
  SectionHeader: SectionHeaderDemo,
  SelectInput: SelectInputDemo,
  Spinner: SpinnerDemo,
  StatCard: StatCardDemo,
  StatusBadge: StatusBadgeDemo,
  StatusDot: StatusDotDemo,
  TextInput: TextInputDemo,
};

const Demos: FC = () => {
  const params = useParams();
  const {name} = params;
  if (name !== undefined && name !== '' && registry[name]) {
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
