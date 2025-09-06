import type {FC} from 'react';
import type {IncomingChoreWithUsername} from '@gitterdun/shared';
import {InlineMeta} from '../../widgets/InlineMeta.js';
import {useIntl} from 'react-intl';
import {choresMessages as messages} from '../chores.messages.js';

type ChoreMetaProps = {readonly chore: IncomingChoreWithUsername};

export const ChoreMeta: FC<ChoreMetaProps> = ({chore}) => {
  const intl = useIntl();
  const rewardPoints =
    typeof chore.reward_points === 'number'
      ? chore.reward_points
      : // Some legacy records may use `point_reward`
        ((): number => {
          const candidate = (chore as Partial<Record<'point_reward', unknown>>)
            .point_reward;
          return typeof candidate === 'number' ? candidate : 0;
        })();
  const penaltyPoints =
    typeof chore.penalty_points === 'number' ? chore.penalty_points : 0;
  const dueDate = chore.due_date; // Now a Date object from IncomingSchema transform

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
      {dueDate ? (
        <span>{intl.formatMessage(messages.dueWithDate, {date: dueDate})}</span>
      ) : null}
    </InlineMeta>
  );
};
