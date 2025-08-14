import {FC} from 'react';

type StatusColor = 'green' | 'blue' | 'yellow' | 'red' | 'gray';

export interface StatusDotProps {
  color?: StatusColor;
  size?: number;
  label?: string;
  className?: string;
}

const COLOR_MAP: Record<StatusColor, string> = {
  green: 'bg-green-500',
  blue: 'bg-blue-500',
  yellow: 'bg-yellow-500',
  red: 'bg-red-500',
  gray: 'bg-gray-300',
};

export const getDotColorClass = (color?: StatusColor): string => {
  switch (color) {
    case 'green':
      return COLOR_MAP.green;
    case 'blue':
      return COLOR_MAP.blue;
    case 'yellow':
      return COLOR_MAP.yellow;
    case 'red':
      return COLOR_MAP.red;
    case 'gray':
      return COLOR_MAP.gray;
    default:
      return COLOR_MAP.gray;
  }
};

export const StatusDot: FC<StatusDotProps> = ({
  color = 'gray',
  size = 12,
  label,
  className = '',
}) => {
  return (
    <span
      role={label ? 'img' : undefined}
      aria-label={label}
      className={`inline-block rounded-full ${getDotColorClass(color)} ${className}`}
      style={{width: size, height: size}}
    />
  );
};

export default StatusDot;
