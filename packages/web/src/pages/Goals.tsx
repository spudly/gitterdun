import {useQuery} from '@tanstack/react-query';
import {Goal} from '@gitterdun/shared';
import {FC} from 'react';
import {goalsApi} from '../lib/api.js';
import {useUser} from '../hooks/useUser.js';
import {PageContainer} from '../widgets/PageContainer.js';
import {PageHeader} from '../widgets/PageHeader.js';
import {GridContainer} from '../widgets/GridContainer.js';
import {Card} from '../widgets/Card.js';
import {ProgressBar} from '../widgets/ProgressBar.js';
import {Text} from '../widgets/Text.js';
import {SectionHeader} from '../widgets/SectionHeader.js';
import {Stack} from '../widgets/Stack.js';
import {CheckCircleIcon} from '../widgets/icons.js';
import {PageLoading} from '../widgets/PageLoading.js';
import {Badge} from '../widgets/Badge.js';
import {KeyValue} from '../widgets/KeyValue.js';
import {EmptyState} from '../widgets/EmptyState.js';

const Goals: FC = () => {
  const {user} = useUser();

  const {data: goalsResponse, isLoading} = useQuery({
    queryKey: ['goals'],
    queryFn: () =>
      user
        ? goalsApi.getAll({user_id: user.id})
        : Promise.resolve({success: true, data: []}),
    enabled: !!user,
  });

  const goals = goalsResponse?.data || [];

  if (isLoading) {
    return (
      <PageContainer variant="centered">
        <PageLoading message="Loading goals..." />
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageHeader title="Goals" />

      <GridContainer cols={3} gap="lg">
        {goals.map((goal: Goal) => (
          <Card key={goal.id}>
            <SectionHeader title={goal.title}>
              <Badge
                variant={
                  goal.status === 'completed'
                    ? 'success'
                    : goal.status === 'abandoned'
                      ? 'danger'
                      : 'info'
                }
              >
                {goal.status}
              </Badge>
            </SectionHeader>
            <Stack gap="sm">
              {goal.description && <Text muted>{goal.description}</Text>}
              <KeyValue label="Current Points:" value={goal.current_points} />
              <KeyValue label="Target Points:" value={goal.target_points} />
              <ProgressBar
                value={goal.current_points}
                max={goal.target_points}
                showPercentage
              />
            </Stack>
          </Card>
        ))}
      </GridContainer>

      {goals.length === 0 && (
        <EmptyState
          title="No goals yet"
          description="Create your first goal to start tracking your progress!"
          icon={<CheckCircleIcon size="lg" />}
        />
      )}
    </PageContainer>
  );
};

export default Goals;
