import type {FC} from 'react';
import clsx from 'clsx';

type AvatarSize = 'sm' | 'md' | 'lg';

const SIZE_MAP: Record<AvatarSize, string> = {
  sm: 'w-6 h-6 text-xs',
  md: 'w-8 h-8 text-sm',
  lg: 'w-12 h-12 text-base',
};

type AvatarCircleProps = {
  readonly label: string;
  readonly emoji?: string;
  readonly size?: AvatarSize;
  readonly ring?: boolean;
};

export const AvatarCircle: FC<AvatarCircleProps> = ({
  label,
  emoji,
  size = 'md',
  ring = false,
}) => {
  return (
    <div
      aria-label={label}
      className={clsx(
        'flex items-center justify-center rounded-full bg-gray-100 font-medium text-gray-700',
        SIZE_MAP[size],
        ring ? 'ring-2 ring-indigo-500' : null,
      )}
      title={label}
    >
      {emoji ?? label.slice(0, 2).toUpperCase()}
    </div>
  );
};
