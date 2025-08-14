import {FC} from 'react';

type IconSize = 'sm' | 'md' | 'lg';
const SIZE: Record<IconSize, number> = {sm: 16, md: 24, lg: 24};

interface IconProps {
  size?: IconSize;
}

export const DocIcon: FC<IconProps> = ({size = 'md'}) => (
  <svg
    width={SIZE[size]}
    height={SIZE[size]}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
    />
  </svg>
);

export const ClockIcon: FC<IconProps> = ({size = 'md'}) => (
  <svg
    width={SIZE[size]}
    height={SIZE[size]}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

export const CheckCircleIcon: FC<IconProps> = ({size = 'md'}) => (
  <svg
    width={SIZE[size]}
    height={SIZE[size]}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

export const SparklesIcon: FC<IconProps> = ({size = 'md'}) => (
  <svg
    width={SIZE[size]}
    height={SIZE[size]}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
    />
  </svg>
);

export const TrophyIcon: FC<IconProps> = ({size = 'md'}) => (
  <svg
    width={SIZE[size]}
    height={SIZE[size]}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M16 3v1a4 4 0 01-8 0V3m12 4a4 4 0 01-4 4h-1.5a3.5 3.5 0 01-7 0H6a4 4 0 01-4-4V5h4m12 2V5h4v2a4 4 0 01-4 4h-1.5"
    />
  </svg>
);

export const InfoCircleIcon: FC<IconProps> = ({size = 'md'}) => (
  <svg
    width={SIZE[size]}
    height={SIZE[size]}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 100 20 10 10 0 000-20z"
    />
  </svg>
);
