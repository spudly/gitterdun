import type {FC} from 'react';
import type {IncomingChoreWithUsername} from '@gitterdun/shared';
import {GridContainer} from '../../widgets/GridContainer.js';
import {StatCard} from '../../widgets/StatCard.js';
import {
  DocIcon,
  ClockIcon,
  CheckCircleIcon,
  SparklesIcon,
} from '../../widgets/icons/index.js';

type AdminStatsProps = {readonly chores: Array<IncomingChoreWithUsername>};

export const AdminStats: FC<AdminStatsProps> = ({chores}) => {
  return (
    <GridContainer cols={4} gap="lg">
      <StatCard
        color="blue"
        icon={<DocIcon />}
        label="Total Chores"
        value={chores.length}
      />

      <StatCard
        color="yellow"
        icon={<ClockIcon />}
        label="Pending Approval"
        value={
          chores.filter(
            (chore: IncomingChoreWithUsername) => chore.status === 'completed',
          ).length
        }
      />

      <StatCard
        color="green"
        icon={<CheckCircleIcon />}
        label="Approved"
        value={
          chores.filter(
            (chore: IncomingChoreWithUsername) => chore.status === 'approved',
          ).length
        }
      />

      <StatCard
        color="purple"
        icon={<SparklesIcon />}
        label="Bonus Chores"
        value={
          chores.filter(
            (chore: IncomingChoreWithUsername) => chore.chore_type === 'bonus',
          ).length
        }
      />
    </GridContainer>
  );
};
