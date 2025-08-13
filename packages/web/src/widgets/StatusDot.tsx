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
      className={`inline-block rounded-full ${COLOR_MAP[color]} ${className}`}
      style={{width: size, height: size}}
    />
  );
};

export default StatusDot;
