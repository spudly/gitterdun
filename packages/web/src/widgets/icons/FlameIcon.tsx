import type {IconComponent} from './common.js';
import {SIZE} from './common.js';

export const FlameIcon: IconComponent = ({size = 'md'}) => (
  <svg
    fill="none"
    height={SIZE[size]}
    stroke="currentColor"
    viewBox="0 0 24 24"
    width={SIZE[size]}
  >
    <path
      d="M12 2s4 3 4 7-3 6-4 9c-1-3-4-5-4-9s4-7 4-7z"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
    />
    <path
      d="M12 22c3.314 0 6-2.686 6-6 0-1.657-1-3-2-4-1 1-2 2-4 2s-3-1-4-2c-1 1-2 2.343-2 4 0 3.314 2.686 6 6 6z"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
    />
  </svg>
);
