import {FC} from 'react';
import {Link, useParams} from 'react-router-dom';
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
      <div className="max-w-5xl mx-auto p-6">
        <div className="mb-4">
          <Link className="text-indigo-600" to="/__demos">
            ← All demos
          </Link>
        </div>
        <Demo />
      </div>
    );
  }
  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Widget Demos</h1>
      <ul className="list-disc ml-6 space-y-1">
        {Object.keys(registry).map(key => (
          <li key={key}>
            <Link className="text-indigo-600" to={`/__demos/${key}`}>
              {key}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Demos;
