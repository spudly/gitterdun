import type {FC} from 'react';
import {useState} from 'react';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import {CreateChoreForm} from './CreateChoreForm.js';
import {choresApi} from '../../lib/api.js';
import {useToast} from '../../widgets/ToastProvider.js';
import {useIntl} from 'react-intl';
import {choresMessages as messages} from '../chores.messages.js';

type MemberLite = {user_id: number; username: string};

type Props = {
  readonly onCancel: () => void;
  readonly members: ReadonlyArray<MemberLite>;
  readonly userId: number;
};

export const ChoresCreatePageContainer: FC<Props> = ({
  onCancel,
  members,
  userId,
}) => {
  const [title, setTitle] = useState('');
  const [points, setPoints] = useState<number | ''>('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [choreType, setChoreType] = useState<'required' | 'bonus'>('required');
  const [assignedUserIds, setAssignedUserIds] = useState<ReadonlyArray<number>>(
    [],
  );
  const [recurrenceRule, setRecurrenceRule] = useState('');
  const [startError, setStartError] = useState<string | null>(null);
  const [dueError, setDueError] = useState<string | null>(null);
  const {safeAsync} = useToast();
  const intl = useIntl();
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: async () => {
      setStartError(null);
      setDueError(null);
      const {startTs, dueTs} = validateDates();
      if (startTs === null || dueTs === null) {
        throw new Error('validation');
      }
      const payload = buildPayload(startTs ?? undefined, dueTs ?? undefined);
      return choresApi.create(payload as any);
    },
    onSuccess: async () => {
      onCancel();
      setTitle('');
      setPoints('');
      setDescription('');
      setStartDate('');
      setDueDate('');
      setChoreType('required');
      setAssignedUserIds([]);
      setRecurrenceRule('');
      setStartError(null);
      setDueError(null);
      await queryClient.invalidateQueries({queryKey: ['chores', userId]});
    },
  });

  const validateDates = (): {startTs: number | null; dueTs: number | null} => {
    const now = Date.now();
    const startTs = startDate ? Date.parse(startDate) : undefined;
    const dueTs = dueDate ? Date.parse(dueDate) : undefined;
    if (startTs !== undefined && startTs <= now) {
      setStartError(intl.formatMessage(messages.startDateFutureError));
      return {startTs: null, dueTs: null};
    }
    if (startTs !== undefined && dueTs !== undefined && dueTs <= startTs) {
      setDueError(intl.formatMessage(messages.dueAfterStartError));
      return {startTs: null, dueTs: null};
    }
    return {startTs: startTs ?? undefined, dueTs: dueTs ?? undefined} as any;
  };

  const buildPayload = (
    startTs?: number,
    dueTs?: number,
  ): {
    title: string;
    chore_type: 'required' | 'bonus';
    description?: string;
    reward_points?: number;
    start_date?: number;
    due_date?: number;
    assigned_users?: ReadonlyArray<number>;
    recurrence_rule?: string;
  } => {
    const payload: {
      title: string;
      chore_type: 'required' | 'bonus';
      description?: string;
      reward_points?: number;
      start_date?: number;
      due_date?: number;
      assigned_users?: ReadonlyArray<number>;
      recurrence_rule?: string;
    } = {title, chore_type: choreType};
    if (description.trim() !== '') {
      payload.description = description.trim();
    }
    if (typeof points === 'number') {
      payload.reward_points = points;
    }
    if (startTs !== undefined) {
      payload.start_date = startTs;
    }
    if (dueTs !== undefined) {
      payload.due_date = dueTs;
    }
    if (assignedUserIds.length > 0) {
      payload.assigned_users = [...assignedUserIds];
    }
    if (recurrenceRule) {
      payload.recurrence_rule = recurrenceRule;
    }
    return payload;
  };

  return (
    <CreateChoreForm
      onCancel={onCancel}
      onCreate={safeAsync(async () => {
        await createMutation.mutateAsync();
      }, intl.formatMessage(messages.completeError))}
      onPointsChange={setPoints}
      onTitleChange={setTitle}
      description={description}
      onDescriptionChange={setDescription}
      startDate={startDate}
      onStartDateChange={setStartDate}
      dueDate={dueDate}
      onDueDateChange={setDueDate}
      choreType={choreType}
      onChoreTypeChange={setChoreType}
      startError={startError}
      dueError={dueError}
      members={members}
      assignedUserIds={assignedUserIds}
      onToggleAssigned={(userToToggle, next) => {
        setAssignedUserIds(prev => {
          if (next) {
            return prev.includes(userToToggle) ? prev : [...prev, userToToggle];
          }
          return prev.filter(id => id !== userToToggle);
        });
      }}
      recurrenceRule={recurrenceRule}
      onRecurrenceChange={setRecurrenceRule}
      points={points}
      title={title}
    />
  );
};
