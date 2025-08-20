import type {IconComponent} from './common.js';
import {SIZE} from './common.js';

export const UserIcon: IconComponent = ({size = 'md'}) => (
  <svg
    fill="none"
    height={SIZE[size]}
    stroke="currentColor"
    viewBox="0 0 24 24"
    width={SIZE[size]}
  >
    <path
      d="M12 12c2.761 0 5-2.239 5-5s-2.239-5-5-5-5 2.239-5 5 2.239 5 5 5z"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
    />
    <path
      d="M4 20c0-4.418 3.582-8 8-8s8 3.582 8 8"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
    />
  </svg>
);
