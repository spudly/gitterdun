import type {FC, ReactNode} from 'react';
import clsx from 'clsx';
import {Text} from './Text.js';

type StatColor = 'blue' | 'yellow' | 'green' | 'red' | 'purple' | 'gray';

const COLOR_BG: Record<StatColor, string> = {
  blue: 'bg-blue-100 text-blue-600',
  yellow: 'bg-yellow-100 text-yellow-600',
  green: 'bg-green-100 text-green-600',
  red: 'bg-red-100 text-red-600',
  purple: 'bg-purple-100 text-purple-600',
  gray: 'bg-gray-100 text-gray-600',
};

export const getStatColorClass = (color: StatColor = 'gray'): string => {
  switch (color) {
    case 'blue':
      return COLOR_BG.blue;
    case 'yellow':
      return COLOR_BG.yellow;
    case 'green':
      return COLOR_BG.green;
    case 'red':
      return COLOR_BG.red;
    case 'purple':
      return COLOR_BG.purple;
    case 'gray':
    default:
      return COLOR_BG.gray;
  }
};

type StatCardProps = {
  readonly icon?: ReactNode;
  readonly label: ReactNode;
  readonly value: ReactNode;
  readonly color?: StatColor;
};

export const StatCard: FC<StatCardProps> = ({
  icon,
  label,
  value,
  color = 'gray',
}) => {
  return (
    <div className="rounded-lg bg-white p-6 shadow">
      <div className="flex items-center">
        <div className={clsx('rounded-lg p-2', getStatColorClass(color))}>
          {icon}
        </div>

        <div className="ml-4">
          <Text as="p" muted size="sm" weight="medium">
            {label}
          </Text>

          <Text as="p" size="lg" weight="semibold">
            {value}
          </Text>
        </div>
      </div>
    </div>
  );
};
