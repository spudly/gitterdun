import type {FC} from 'react';
import clsx from 'clsx';

type StatusColor = 'green' | 'blue' | 'yellow' | 'red' | 'gray';

type StatusDotProps = {
  readonly color?: StatusColor;
  readonly size?: number;
  readonly label?: string;
  readonly className?: string;
};

const COLOR_MAP: Record<StatusColor, string> = {
  green: 'bg-green-500',
  blue: 'bg-blue-500',
  yellow: 'bg-yellow-500',
  red: 'bg-red-500',
  gray: 'bg-gray-300',
};

export const getDotColorClass = (color: StatusColor = 'gray'): string => {
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
  if (label !== undefined) {
    return (
      <img
        alt={label}
        className={clsx(
          'inline-block rounded-full',
          getDotColorClass(color),
          className,
        )}
        height={size}
        src="data:image/gif;base64,R0lGODlhAQABAAAAACw="
        style={{width: size, height: size}}
        width={size}
      />
    );
  }
  return (
    <span
      aria-hidden
      className={clsx(
        'inline-block rounded-full',
        getDotColorClass(color),
        className,
      )}
      style={{width: size, height: size}}
    />
  );
};
