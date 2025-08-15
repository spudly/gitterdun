import type {IconComponent} from './common.js';
import {SIZE} from './common.js';

export const InfoCircleIcon: IconComponent = ({size = 'md'}) => (
  <svg
    fill="none"
    height={SIZE[size]}
    stroke="currentColor"
    viewBox="0 0 24 24"
    width={SIZE[size]}
  >
    <path
      d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 100 20 10 10 0 000-20z"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
    />
  </svg>
);


