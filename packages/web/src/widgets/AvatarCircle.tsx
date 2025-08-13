import {FC} from 'react';

type AvatarSize = 'sm' | 'md' | 'lg';

const SIZE_MAP: Record<AvatarSize, string> = {
  sm: 'w-6 h-6 text-xs',
  md: 'w-8 h-8 text-sm',
  lg: 'w-12 h-12 text-base',
};

export interface AvatarCircleProps {
  label: string;
  emoji?: string;
  size?: AvatarSize;
  ring?: boolean;
}

export const AvatarCircle: FC<AvatarCircleProps> = ({
  label,
  emoji,
  size = 'md',
  ring = false,
}) => {
  return (
    <div
      className={`rounded-full bg-gray-100 flex items-center justify-center font-medium text-gray-700 ${SIZE_MAP[size]} ${ring ? 'ring-2 ring-indigo-500' : ''}`}
      title={label}
      aria-label={label}
    >
      {emoji || label.slice(0, 2).toUpperCase()}
    </div>
  );
};

export default AvatarCircle;
