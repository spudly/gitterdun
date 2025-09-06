import {useEffect, useState} from 'react';
import type {FC} from 'react';
import {Stack} from '../../widgets/Stack.js';
import {TextInput} from '../../widgets/TextInput.js';
import {Button} from '../../widgets/Button.js';
import {FormattedMessage, useIntl} from 'react-intl';
import {choresMessages as messages} from '../chores.messages.js';
import {Checkbox} from '../../widgets/Checkbox.js';
import {SelectInput} from '../../widgets/SelectInput.js';
import {DATE_FORMAT_FOR_INPUT_DATETIME, EMPTY_ARRAY} from '../../constants.js';
import {format} from 'date-fns';

type CreateChoreFormProps = {
  readonly title: string;
  readonly points: number | '';
  readonly onTitleChange: (value: string) => void;
  readonly onPointsChange: (value: number | '') => void;
  readonly description: string;
  readonly onDescriptionChange: (value: string) => void;
  readonly startDate: string;
  readonly onStartDateChange: (value: string) => void;
  readonly dueDate: string;
  readonly onDueDateChange: (value: string) => void;
  readonly choreType: 'required' | 'bonus';
  readonly onChoreTypeChange: (value: 'required' | 'bonus') => void;
  readonly onCancel: () => void;
  readonly onCreate: () => void;
  readonly members?: ReadonlyArray<{user_id: number; username: string}>;
  readonly assignedUserIds: ReadonlyArray<number>;
  readonly onToggleAssigned: (userId: number, nextChecked: boolean) => void;
  readonly recurrenceRule: string;
  readonly onRecurrenceChange: (value: string) => void;
  readonly startError?: string | null;
  readonly dueError?: string | null;
};

const useNow = () => {
  const [now, setNow] = useState<Date>(new Date(0));

  useEffect(() => {
    setNow(new Date());
  }, []);

  return now;
};

export const CreateChoreForm: FC<CreateChoreFormProps> = ({
  title,
  points,
  onTitleChange,
  onPointsChange,
  description,
  onDescriptionChange,
  startDate,
  onStartDateChange,
  dueDate,
  onDueDateChange,
  choreType,
  onChoreTypeChange,
  onCancel,
  onCreate,
  members = EMPTY_ARRAY,
  assignedUserIds,
  onToggleAssigned,
  recurrenceRule,
  onRecurrenceChange,
  startError,
  dueError,
}) => {
  const intl = useIntl();
  const now = useNow();

  return (
    <div>
      <Stack gap="md">
        <TextInput
          onChange={onTitleChange}
          placeholder={intl.formatMessage(messages.titlePlaceholder)}
          value={title}
        />
        <input
          aria-label={intl.formatMessage(messages.pointsPlaceholder)}
          onChange={event => {
            const raw = event.target.value;
            if (raw === '') {
              onPointsChange('');
            } else {
              const next = Number(raw);
              onPointsChange(Number.isNaN(next) ? '' : next);
            }
          }}
          placeholder={intl.formatMessage(messages.pointsPlaceholder)}
          type="number"
          value={points}
        />
        <TextInput
          onChange={onDescriptionChange}
          placeholder={intl.formatMessage(messages.descriptionPlaceholder)}
          value={description}
        />
        <label className="grid gap-1 text-sm" htmlFor="start-date-input">
          {intl.formatMessage(messages.startDateLabel)}
          <TextInput
            aria-label={intl.formatMessage(messages.startDateLabel)}
            id="start-date-input"
            min={format(now, DATE_FORMAT_FOR_INPUT_DATETIME)}
            onChange={onStartDateChange}
            type="datetime-local"
            value={startDate}
          />
          {startError != null && startError !== '' ? (
            <div className="text-xs text-red-600">{startError}</div>
          ) : null}
        </label>
        <label className="grid gap-1 text-sm" htmlFor="due-date-input">
          {intl.formatMessage(messages.dueDateLabel)}
          <TextInput
            aria-label={intl.formatMessage(messages.dueDateLabel)}
            id="due-date-input"
            min={startDate || format(now, DATE_FORMAT_FOR_INPUT_DATETIME)}
            onChange={onDueDateChange}
            type="datetime-local"
            value={dueDate}
          />
          {dueError != null && dueError !== '' ? (
            <div className="text-xs text-red-600">{dueError}</div>
          ) : null}
        </label>

        {/* Recurrence above assignees */}
        <label className="grid gap-2 text-sm" htmlFor="recurrence-select">
          <FormattedMessage {...messages.recurrenceLabel} />
          <SelectInput
            id="recurrence-select"
            onChange={value => {
              onRecurrenceChange(value);
            }}
            value={recurrenceRule}
          >
            <option value="">
              {intl.formatMessage(messages.recurrenceNone)}
            </option>
            <option value="FREQ=DAILY">
              {intl.formatMessage(messages.recurrenceDaily)}
            </option>
            <option value="FREQ=WEEKLY">
              {intl.formatMessage(messages.recurrenceWeekly)}
            </option>
            <option value="FREQ=MONTHLY">
              {intl.formatMessage(messages.recurrenceMonthly)}
            </option>
          </SelectInput>
        </label>

        {/* Bonus Chore */}
        <Checkbox
          checked={choreType === 'bonus'}
          label={intl.formatMessage(messages.bonusChoreLabel)}
          onChange={checked => {
            onChoreTypeChange(checked ? 'bonus' : 'required');
          }}
        />

        {/* Assignees */}
        <div className="flex flex-col gap-2">
          <div className="text-sm font-medium">
            <FormattedMessage {...messages.assigneesLabel} />
          </div>
          <div className="flex flex-col gap-1">
            {members.map(member => {
              const isChecked = assignedUserIds.includes(member.user_id);
              return (
                <Checkbox
                  checked={isChecked}
                  key={member.user_id}
                  label={member.username}
                  onChange={checked => {
                    onToggleAssigned(member.user_id, checked);
                  }}
                />
              );
            })}
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button onClick={onCancel} variant="secondary">
            <FormattedMessage {...messages.cancel} />
          </Button>
          <Button disabled={title.trim() === ''} onClick={onCreate}>
            <FormattedMessage {...messages.createChore} />
          </Button>
        </div>
      </Stack>
    </div>
  );
};
