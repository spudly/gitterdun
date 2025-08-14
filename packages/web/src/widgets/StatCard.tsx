import {FC, ReactNode} from 'react';
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

export interface StatCardProps {
  icon?: ReactNode;
  label: ReactNode;
  value: ReactNode;
  color?: StatColor;
}

export const StatCard: FC<StatCardProps> = ({
  icon,
  label,
  value,
  color = 'gray',
}) => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center">
        <div className={clsx('p-2 rounded-lg', COLOR_BG[color])}>{icon}</div>
        <div className="ml-4">
          <Text as="p" size="sm" weight="medium" muted>
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

export default StatCard;
