import type {FC} from 'react';
import type {ChoreWithUsername} from '@gitterdun/shared';
import {InlineMeta} from '../../widgets/InlineMeta.js';
import {useIntl} from 'react-intl';
import {choresMessages as messages} from '../chores.messages.js';

type ChoreMetaProps = {readonly chore: ChoreWithUsername};

export const ChoreMeta: FC<ChoreMetaProps> = ({chore}) => {
  const intl = useIntl();
  const rewardPoints =
    typeof chore.reward_points === 'number'
      ? chore.reward_points
      : // Some legacy records may use `point_reward`
        ((): number => {
          const candidate = (chore as unknown as {point_reward?: unknown})
            .point_reward;
          return typeof candidate === 'number' ? candidate : 0;
        })();
  const penaltyPoints =
    typeof chore.penalty_points === 'number' ? chore.penalty_points : 0;
  const dueMs =
    typeof chore.due_date === 'number'
      ? chore.due_date
      : typeof chore.due_date === 'string'
        ? Date.parse(chore.due_date)
        : undefined;

  return (
    <InlineMeta>
      <span>
        {intl.formatMessage(messages.pointsWithValue, {points: rewardPoints})}
      </span>
      {penaltyPoints > 0 ? (
        <span>
          {intl.formatMessage(messages.penaltyWithPoints, {
            points: penaltyPoints,
          })}
        </span>
      ) : null}
      {typeof dueMs === 'number' && Number.isFinite(dueMs) ? (
        <span>
          {intl.formatMessage(messages.dueWithDate, {
            date: new Date(dueMs).toLocaleDateString(),
          })}
        </span>
      ) : null}
    </InlineMeta>
  );
};
